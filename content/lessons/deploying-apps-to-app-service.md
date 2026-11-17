---
slug: deploying-apps-to-app-service
title: "Deploying Code to App Service with Azure CLI"
topic: app-service-and-serverless
kind: tool
summary: "Deploy Node.js, .NET, and Python web applications to App Service with az webapp up and ZIP deploy."
tags: [app-service, deployment, azure-cli, webapp]
related: [app-service-architecture-and-plans, deployment-slots-and-zero-downtime, github-actions-azure-deployment-workflow]
---
> **In one line:** Deploy web application code directly to Azure App Service using the Azure CLI or automated ZIP deployment.

## The idea

Azure App Service provides versatile deployment mechanisms suited for everything from rapid local prototyping to enterprise CI/CD automation pipelines:

1. **`az webapp up`:** The fastest way to deploy. It analyzes your local working directory, detects the runtime stack (.NET, Node.js, Python), provisions an App Service Plan and Web App if they don't exist, archives your code into a ZIP package, and deploys it in one step.
2. **ZIP Deploy (`az webapp deploy`):** The enterprise standard for CI/CD pipelines. Packages your built application artifact into a `.zip` archive and posts it to the Kudu deployment engine. Kudu extracts the files into `/home/site/wwwroot` and restarts the web application process.
3. **Container Deployment:** Point App Service to a private Docker image stored in Azure Container Registry (ACR), enabling consistent local and cloud runtime environments.
4. **Git Deploy:** Push directly to a remote Kudu Git repository or connect to GitHub for automated branch builds.

| Deployment Tool | Ideal Scenario | Mechanics |
|---|---|---|
| `az webapp up` | Rapid developer prototyping | Auto-creates plan, webapp, and uploads code |
| `az webapp deploy` | CI/CD GitHub Actions / Pipelines | Deploys pre-built ZIP artifact via Kudu |
| Container Image | Microservices / Custom runtimes | Pulls Docker image from ACR |
| GitHub Actions | Automated Git push workflow | Triggers build and deploy on Git commits |

> **Tip:** In automated CI/CD pipelines, always build your application dependencies (e.g., `npm run build` or `dotnet publish`) on the CI runner, then deploy the resulting output folder using `az webapp deploy`.

## See it

Package a web application and deploy it to an existing Azure App Service using ZIP deployment:

```bash
# Package the application build output into a zip archive
zip -r app.zip dist/ package.json node_modules/

# Deploy the zip package directly to App Service via the CLI
az webapp deploy   --resource-group rg-learning-portal   --name webapp-portal-prod-001   --src-path app.zip   --type zip   --clean true   --output table

# Stream live application console logs to monitor startup
az webapp log tail --resource-group rg-learning-portal --name webapp-portal-prod-001
```

The `--clean true` flag ensures obsolete files from prior deployments are wiped from the server directory, preventing ghost dependencies.

## Go deeper

Under the hood, Linux App Service runs on **Oryx**, Microsoft's open-source multi-language build and execution engine. When deploying source code without pre-built packages, Oryx inspects `package.json` or `requirements.txt`, runs package manager installations, and configures appropriate process supervisors (PM2, Gunicorn, or ASP.NET Kestrel).

## Watch out

- Never commit secrets or sensitive database passwords into source code archives deployed to App Service.
- Failing to set `--clean true` during ZIP deploy leaves obsolete legacy files lingering inside `/home/site/wwwroot`.

## Remember

- `az webapp up` provides single-command deployment for fast developer prototyping.
- Production CI/CD pipelines should use `az webapp deploy` with pre-compiled ZIP artifacts.
- Stream real-time server output using `az webapp log tail` to debug startup errors.
