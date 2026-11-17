---
slug: deployment-environments-and-manual-approvals
title: "Deployment Environments and Manual Approval Gates"
topic: iac-and-devops
kind: pattern
summary: "Protect production environments using branch protection rules, required reviewer approvals, and staging gates."
tags: [environments, approvals, governance, staging]
related: [github-actions-azure-deployment-workflow, deployment-slots-and-zero-downtime, cicd-fundamentals-github-actions-and-azure-pipelines]
---
> **In one line:** Protect production deployments using GitHub Environments with required reviewer approval gates.

## The idea

In enterprise software delivery, code should never deploy automatically to live production without explicit governance checkpoints, automated smoke testing, and designated human approvals.

GitHub Actions provides **Environments** (e.g., `development`, `staging`, `production`) to enforce deployment protection rules:

1. **Required Reviewers (Manual Approval Gates):** When a pipeline job targets the `production` environment, execution automatically pauses. Designated team leads or release managers receive an email notification and must review the proposed changes and click **Approve** before the job executes.
2. **Wait Timers:** Automatically delay deployment for a designated period (e.g., waiting 30 minutes after staging deployment to allow automated monitoring tests to detect errors).
3. **Protected Branches:** Restrict deployments to specific branches (e.g., only commits originating from `main` can deploy to `production`).
4. **Environment Secrets and Variables:** Isolate credentials so that staging pipelines only possess staging Azure subscription credentials, while production credentials remain locked to the production environment.

| Stage | Target Environment | Approval Gate | Azure Target |
|---|---|---|---|
| **Build & Test** | None (CI Runner) | None (Automatic) | Ephemeral runner |
| **Deploy Staging** | `staging` | None (Automatic on merge) | App Service Staging Slot |
| **Verify & Smoke Test** | `staging` | Automated integration tests | Staging Slot URL |
| **Deploy Production** | `production` | **Manual Reviewer Approval** | Production Slot (Swap) |

> **Tip:** Combine GitHub Environments with App Service **Deployment Slots**. The pipeline deploys to Staging automatically, pauses for manual approval, and then executes the swap into Production upon approval.

## See it

Configure a GitHub Actions job with an explicit environment approval target:

```yaml
# Excerpt from GitHub Actions workflow using Environments
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://learn.example.com
    steps:
      - uses: actions/checkout@v4
      - name: Swap Staging Slot to Production
        run: |
          az webapp deployment slot swap             --resource-group rg-learning-portal             --name webapp-portal-prod-001             --slot staging             --target-slot production
```

When this job runs, GitHub pauses execution at the `environment: production` line until authorized release managers review and approve the release in the GitHub UI.

## Go deeper

In Azure DevOps Pipelines, identical capabilities are provided through **Environment Approvals and Checks**. You can configure automated gates that query Azure Monitor alerts; if active Sev 1 alerts are firing in the subscription, the pipeline automatically cancels the production rollout.

## Watch out

- Failing to configure environment protection rules allows any developer with commit access to push directly to production.
- Do not hardcode production secret values in repository-level variables; always isolate them inside the protected Environment.

## Remember

- GitHub Environments enforce manual reviewer approval gates before production releases.
- Isolate environment variables and secrets so non-production jobs cannot access production assets.
- Combine approval gates with App Service deployment slots for safe, zero-downtime releases.
