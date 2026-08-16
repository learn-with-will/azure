---
id: lesson-20
slug: cicd-to-azure
title: "CI/CD to Azure"
level: advanced
order: 20
duration: 20
tags:
  - cicd
  - github-actions
  - azure-pipelines
  - oidc
  - deployment
summary: "Automate build, test, and deploy to Azure — what CI/CD means, the two main tools (GitHub Actions and Azure Pipelines), authenticating to Azure securely with OIDC/workload identity federation instead of stored secrets, and a workflow that deploys an app on every push."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **CI/CD** and why it matters.
- Compare **GitHub Actions** and **Azure Pipelines**.
- Authenticate a pipeline to Azure with **OIDC** (no stored secret) rather than a secret.
- Read a workflow that **deploys** an app to Azure on every push.

# Why It Matters

Manual deployments are slow and error-prone; a forgotten step at 5 p.m. on Friday is how outages happen.
**CI/CD** automates the path from a code change to a running deployment, with tests and approvals along
the way — so releases are frequent, consistent, and reversible. It's how modern teams ship safely.

# Concept Explanation

### What CI/CD means

- **Continuous Integration (CI)** — every change is automatically **built and tested** when pushed, so
  problems surface immediately.
- **Continuous Delivery/Deployment (CD)** — validated changes are automatically **released** to an
  environment (delivery = ready to deploy, often with an approval; deployment = all the way to
  production automatically).

A **pipeline** (or **workflow**) is the automated sequence of steps that does this.

### Two main tools

- **GitHub Actions** — CI/CD defined in **YAML** workflows in your GitHub repo (`.github/workflows/`).
- **Azure Pipelines** (part of **Azure DevOps**) — CI/CD in YAML pipelines, tightly integrated with
  Azure DevOps boards and repos.

Both are excellent; choose based on where your code and team already live. Examples here use GitHub
Actions.

### Authenticating to Azure — securely

A pipeline needs permission to deploy to Azure. Two approaches:

- **Service principal with a secret** — an Entra ID identity whose **client secret** you store in the
  pipeline. Works, but it's a **stored credential** that can leak and must be rotated.
- **OpenID Connect (OIDC) / workload identity federation** — the pipeline proves its identity to Entra
  ID with a **short-lived token** and **no stored secret at all**. This is the **recommended** approach.

You grant the identity a scoped **RBAC** role (for example, Contributor on one resource group) — least
privilege, as always.

### A deployment workflow

```yaml
# .github/workflows/deploy.yml — build and deploy a web app on every push to main
name: deploy
on:
  push:
    branches: [main]

permissions:
  id-token: write      # needed for OIDC login
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Sign in to Azure with OIDC — no stored password
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      # Deploy the app to App Service
      - uses: azure/webapps-deploy@v3
        with:
          app-name: my-unique-app-name
          package: .
```

The `client-id`/`tenant-id`/`subscription-id` here are **identifiers, not secrets** — the actual trust
is established by OIDC federation, so there's no password to leak.

### Environments and approvals

Both tools support **environments** (dev, staging, prod) with **protection rules** — for example,
requiring a manual **approval** before deploying to production. Combine this with **deployment slots**
(lesson 10) or **Bicep** (lesson 19) for safe, repeatable releases.

# Key Terminology

- **CI (Continuous Integration)** — auto build/test on every change.
- **CD (Continuous Delivery/Deployment)** — auto release to an environment.
- **Pipeline / workflow** — the automated build-test-deploy sequence.
- **GitHub Actions / Azure Pipelines** — the two main CI/CD tools (both YAML).
- **Service principal** — an Entra ID identity used by automation.
- **OIDC / workload identity federation** — secretless pipeline auth to Azure.
- **Environment / approval** — a deployment target with optional gate.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Tool | **GitHub Actions** | **Azure Pipelines** | Match where your code/team live; both are capable YAML-based tools. |
| Pipeline auth | **OIDC (secretless)** | **Service principal secret** | Prefer OIDC — no stored credential to leak or rotate. |
| Prod releases | **Auto-deploy** | **Approval gate** | Auto for low-risk; require approval for production or regulated systems. |
| Release safety | **Slots / IaC** | Deploy in place | Use slots and Bicep for zero-downtime, repeatable, reversible releases. |

# Worked Example

The workflow above is the whole loop: push to `main` → **checkout** → **OIDC login** → **deploy** to App
Service. Add a **test** step before deploy (CI) and a **staging environment with approval** before prod
(CD) to make it production-grade.

# Real World Analogy

CI/CD is a **factory conveyor belt** for software. **CI** is the **quality-control station** that
inspects every part as it arrives (build + tests). **CD** is the **automated packaging and shipping** at
the end. **OIDC** is a **badge reader** that verifies each worker by identity rather than handing out
copyable keys. An **approval gate** is a **supervisor sign-off** before the truck leaves for the most
important customer.

# Examples

## Example 1 — Basic: deploy on push

A solo developer adds the workflow above. Now every push to `main` builds and deploys automatically — no
manual steps, no forgotten deployments.

**Why this works:** automation makes releases consistent and frees the developer to focus on code.

## Example 2 — Real-world: gated production

A team auto-deploys to **staging** on every merge, runs tests, and requires a **manual approval** to
promote to **production** — often via a slot swap.

**Why this works:** approvals and staging catch problems before customers see them, while keeping most of
the pipeline automatic.

## Example 3 — Pitfall: a leaked pipeline secret

A team stored a service principal **secret** in the repo's variables; it was exposed in a log and used to
tamper with resources.

**Why this bites:** stored credentials can leak. **OIDC** removes the secret entirely, and scoping the
identity with **least-privilege RBAC** limits the damage of any compromise.

# Common Mistakes

- **Storing long-lived secrets for pipeline auth.** Use **OIDC** instead.
- **Over-permissioning the deploy identity.** Grant least-privilege RBAC at the smallest scope.
- **Deploying straight to prod with no gate.** Add tests, staging, and approvals.
- **No rollback plan.** Pair CI/CD with **slots** or **IaC** so you can revert quickly.

# Best Practices

- Automate **build + test on every change**; deploy through **staging** before production.
- Authenticate with **OIDC/workload identity federation** — no stored secrets.
- Scope the deployment identity with **least-privilege RBAC**.
- Use **environments with approvals** and **slots/IaC** for safe, reversible releases.

# Summary

- **CI/CD** automates build, test, and deploy so releases are frequent, consistent, and reversible.
- **GitHub Actions** and **Azure Pipelines** are the two main YAML-based tools.
- Authenticate to Azure with **OIDC** (secretless) and a **least-privilege** RBAC role.
- Use **environments, approvals**, and **slots/IaC** to make production releases safe.

# Flash Cards

Q: What do CI and CD stand for and mean?
A: Continuous Integration — automatically building and testing every change. Continuous Delivery/Deployment — automatically releasing validated changes to an environment (delivery keeps them ready/approved; deployment goes all the way to production).

Q: What are the two main CI/CD tools for Azure?
A: GitHub Actions (YAML workflows in a GitHub repo) and Azure Pipelines (part of Azure DevOps). Both are capable; choose based on where your code and team live.

Q: Why is OIDC (workload identity federation) preferred over a service principal secret for pipeline auth?
A: OIDC lets the pipeline prove its identity with a short-lived token and no stored secret, so there's nothing to leak or rotate — unlike a stored client secret.

Q: In the OIDC workflow, are the client-id, tenant-id, and subscription-id secrets?
A: No — they're identifiers. The trust is established by OIDC federation, so there's no password stored; those values just tell the login action which identity and subscription to use.

Q: How do you make production deployments safer in a pipeline?
A: Deploy to staging first, run tests, require a manual approval on the production environment, and use deployment slots or IaC so releases are zero-downtime and reversible.

Q: What role should a deployment identity have?
A: A least-privilege RBAC role scoped as narrowly as possible (for example, Contributor on a single resource group), so a compromise has limited blast radius.

# Exercises

### Easy
Explain the difference between continuous integration and continuous deployment in your own words.

### Medium
Write (or annotate) a GitHub Actions workflow that logs into Azure with OIDC and deploys to App Service
on push to `main`. Point out which values are identifiers rather than secrets.

### Challenging
Design a CI/CD pipeline for a team with dev/staging/prod: describe the stages, where tests and approvals
go, how the pipeline authenticates to Azure, and how you'd roll back a bad production release.

# Further Reading

- Microsoft Learn — *What is CI/CD?*: <https://learn.microsoft.com/devops/deliver/what-is-continuous-delivery>
- Microsoft Learn — *Authenticate GitHub Actions to Azure with OIDC*: <https://learn.microsoft.com/azure/developer/github/connect-from-azure-openid-connect>
- Microsoft Learn — *Deploy to App Service with GitHub Actions*: <https://learn.microsoft.com/azure/app-service/deploy-github-actions>
- Microsoft Learn — *What is Azure Pipelines?*: <https://learn.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines>
