---
slug: cicd-fundamentals-github-actions-and-azure-pipelines
title: "CI/CD to Azure: GitHub Actions and Azure Pipelines"
topic: iac-and-devops
kind: concept
summary: "Compare GitHub Actions and Azure Pipelines for automating continuous integration and continuous deployment."
tags: [cicd, github-actions, azure-pipelines, automation]
related: [oidc-workload-identity-federation, github-actions-azure-deployment-workflow, deployment-environments-and-manual-approvals]
---
> **In one line:** Automate cloud delivery using continuous integration and continuous deployment pipelines.

## The idea

Manual infrastructure deployments and code uploads are error-prone, untracked, and slow. **Continuous Integration and Continuous Deployment (CI/CD)** automates software building, automated testing, security scanning, and cloud infrastructure deployment.

- **Continuous Integration (CI):** Automates building application binaries, compiling Docker containers, executing unit tests, and linting Bicep files whenever developers open or update pull requests.
- **Continuous Deployment (CD):** Automates the safe delivery and release of validated artifacts and infrastructure templates to staging and production Azure environments.

Azure workloads are primarily automated using two enterprise CI/CD platforms:
1. **GitHub Actions:** Cloud-native automation built directly into GitHub. Workflows are declared in YAML files inside `.github/workflows/`. Highly popular for modern cloud-native apps and open-source projects. Offers thousands of pre-built community actions in the GitHub Marketplace.
2. **Azure Pipelines:** Part of Azure DevOps. Enterprise CI/CD platform offering advanced release gates, manual approvals, artifact feeds, and deep integrations with enterprise Jira or Azure Boards.

| Feature | GitHub Actions | Azure Pipelines |
|---|---|---|
| **Configuration Format** | YAML (`.github/workflows/*.yml`) | YAML (`azure-pipelines.yml`) or Classic UI |
| **Hosting Platform** | GitHub.com / GitHub Enterprise | Azure DevOps Services / Server |
| **Authentication Standard** | **OIDC (Workload Identity Federation)** | Service Connections (OIDC / Service Principal) |
| **Runners** | GitHub-hosted or self-hosted runners | Microsoft-hosted or self-hosted agents |

> **Tip:** Microsoft officially provides the `azure/login` action for GitHub Actions. It supports modern passwordless OpenID Connect (OIDC) authentication, eliminating stored secret credentials from CI/CD runners.

## See it

Inspect the GitHub Actions workflow syntax for deploying an Azure Bicep template:

```yaml
# .github/workflows/deploy.yml: basic CI/CD pipeline
name: Deploy Infrastructure
on:
  push:
    branches: [main]

jobs:
  validate-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate Bicep
        run: az bicep build --file ./infra/main.bicep
```

Every push to the `main` branch automatically checks out code on an Ubuntu runner and validates that the Bicep template compiles without syntax errors.

## Go deeper

CI/CD pipelines should always implement a **two-phase deployment strategy**:
1. **Phase 1 (CI Gate):** Run `az bicep build` and `az deployment group what-if` on Pull Requests to validate syntax and review proposed cloud changes.
2. **Phase 2 (CD Release):** Execute `az deployment group create` strictly on merged commits to `main` targeting designated environments.

## Watch out

- Never store long-lived Azure service principal passwords or subscription secrets inside plaintext pipeline repository variables.
- Avoid deploying directly to production without testing deployments in staging or canary slots first.

## Remember

- CI/CD automates testing, infrastructure validation, and cloud deployment on code commits.
- GitHub Actions and Azure Pipelines use declarative YAML workflows to manage automated delivery.
- Use pull request validation gates to run Bicep linters and What-If checks before merging code.
