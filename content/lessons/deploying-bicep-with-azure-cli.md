---
slug: deploying-bicep-with-azure-cli
title: "Deploying Bicep Files with Azure CLI"
topic: iac-and-devops
kind: tool
summary: "Execute az deployment group create to provision Bicep files directly against target resource groups."
tags: [bicep, azure-cli, deployment, automation]
related: [writing-bicep-declarative-templates, what-if-operation-and-idempotency, github-actions-azure-deployment-workflow]
---
> **In one line:** Deploy Bicep templates directly to Azure resource groups using the az deployment group create command.

## The idea

Deploying Bicep infrastructure requires no external compilation step or separate transpilation tools installed on your workstation. When you pass a `.bicep` file to the Azure CLI command `az deployment group create`, the CLI transparently compiles the Bicep template into ARM JSON in memory and submits the payload directly to the Azure Resource Manager API.

The core command structure for deploying to a resource group requires specifying the target group, the template file, and any runtime parameters:
```bash
az deployment group create   --resource-group <rg-name>   --template-file <path-to-bicep>   --parameters <path-to-params-or-inline>   --mode Incremental
```

Deployment Modes in Azure Resource Manager control how existing cloud resources are treated:
- **Incremental Mode (Default):** ARM adds or modifies resources declared in the template. Resources that exist in the resource group but are **not declared in the template are left completely untouched**. This is the standard, safe choice for day-to-day deployments and shared environments.
- **Complete Mode:** ARM ensures the target resource group matches the template exactly. Any existing resources in the resource group that are **not declared in the template are permanently deleted**. While powerful for ephemeral sandbox environments, Complete mode carries catastrophic risk if templates accidentally omit existing production databases or networking rules.

| Deployment Mode | Matching Resources | Unmentioned Resources in RG | Risk Profile |
|---|---|---|---|
| **Incremental (Default)** | Created or Updated | **Preserved untouched** | Safe (Production standard) |
| **Complete** | Created or Updated | **Permanently DELETED** | **High (Destructive)** |

> **Tip:** Always stick with **Incremental mode** unless you are intentionally implementing declarative environment cleanup pipelines. You can pass parameter values directly inline using `--parameters key=value` or reference a `.bicepparam` parameters file with `--parameters @params.bicepparam`.

## See it

Deploy a Bicep template, pass parameters, and inspect the deployment history using the Azure CLI:

```bash
# Validate template syntax and parameters before actual deployment
az deployment group validate   --resource-group rg-learning-portal   --template-file main.bicep   --parameters environment=prod

# Deploy the Bicep template to the target resource group in Incremental mode
az deployment group create   --name "deploy-portal-v1"   --resource-group rg-learning-portal   --template-file main.bicep   --parameters environment=prod   --output table

# Query the output properties emitted by the completed deployment
az deployment group show   --name "deploy-portal-v1"   --resource-group rg-learning-portal   --query "properties.outputs"   -o json
```

The CLI displays real-time deployment status, provisioning resources concurrently according to the Bicep dependency graph.

## Go deeper

Every deployment is permanently recorded in the resource group's deployment history. You can inspect previous deployment runs, view the exact template and parameters submitted, and track deployment errors using `az deployment group list --resource-group <rg-name>`. You can also clean up failed deployment records or re-execute historic deployments with zero friction.

## Watch out

- Never execute deployments in Complete mode without running a pre-flight What-If check to verify what resources will be deleted.
- Submitting invalid parameters causes ARM pre-flight validation failures before any physical resources are provisioned.

## Remember

- The Azure CLI compiles and submits Bicep files directly using `az deployment group create`.
- Incremental mode adds and modifies resources without touching unmentioned existing assets.
- Complete mode permanently deletes any existing resources in the group that are not in the template.
