---
slug: github-actions-azure-deployment-workflow
title: "Building a GitHub Actions Deployment Workflow"
topic: iac-and-devops
kind: technique
summary: "Write a GitHub Actions YAML workflow to build, test, and deploy code or Bicep templates to Azure."
tags: [github-actions, yaml, workflow, deployment]
related: [oidc-workload-identity-federation, deploying-apps-to-app-service, deploying-bicep-with-azure-cli]
---
> **In one line:** Construct an end-to-end GitHub Actions workflow to deploy Bicep and web applications to Azure.

## The idea

A production-grade CI/CD workflow combines source checkout, environment validation, infrastructure provisioning, and application code deployment into an automated pipeline.

A standard enterprise workflow follows a structured sequence:
1. **Trigger:** Listens for code pushes to the `main` branch or manual `workflow_dispatch` events.
2. **OIDC Authentication:** Authenticates the GitHub runner to Azure using `azure/login@v2`.
3. **Infrastructure Stage (Bicep):** Uses `azure/arm-deploy@v2` to deploy Bicep templates, provisioning or updating the App Service Plan and Web App.
4. **Build Stage:** Compiles the application code, installs dependencies (`npm ci`), and packages the build artifacts into a ZIP archive.
5. **Deployment Stage:** Uses `azure/webapps-deploy@v3` to deploy the ZIP package directly to the Azure Web App.

| Official GitHub Action | Role in Workflow |
|---|---|
| `actions/checkout@v4` | Checks out Git source repository onto the runner |
| `azure/login@v2` | Authenticates runner to Azure using OIDC |
| `azure/arm-deploy@v2` | Provisions declarative Bicep infrastructure templates |
| `azure/webapps-deploy@v3` | Deploys compiled web app packages directly to App Service |

> **Tip:** Add a pull request workflow that runs `az bicep build` and `az deployment group what-if` on PR branches without deploying. This validates infrastructure changes before code is merged into `main`.

## See it

Construct a concise GitHub Actions workflow deploying Bicep and Node.js code to Azure:

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  id-token: write
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - uses: azure/arm-deploy@v2
        with:
          resourceGroupName: rg-learning-portal
          template: ./infra/main.bicep
      - uses: azure/webapps-deploy@v3
        with:
          app-name: webapp-portal-prod
          package: ./dist/
```

Every push to `main` provisions the underlying cloud infrastructure first, then deploys the latest compiled application code.

## Go deeper

For containerized workflows, replace `azure/webapps-deploy` with `docker build` and `docker push` targeting Azure Container Registry (ACR), followed by `az containerapp update` or `az webapp config container set` to instruct the compute host to pull the new image tag.

## Watch out

- Ensure the Azure Service Principal holds sufficient RBAC Contributor permissions on the target resource group.
- Deploying without automated unit tests runs the risk of automatically publishing broken code directly to production.

## Remember

- Use `azure/arm-deploy` to provision Bicep infrastructure templates within CI/CD pipelines.
- Use `azure/webapps-deploy` to package and deploy compiled web applications to App Service.
- Combine OIDC authentication with GitHub Actions for secure, passwordless cloud deployments.
