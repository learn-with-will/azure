---
slug: creating-functions-with-azure-cli
title: "Creating Function Apps with Azure CLI"
topic: app-service-and-serverless
kind: tool
summary: "Provision storage-backed Azure Function Apps, configure runtime stacks, and deploy code via CLI."
tags: [functions, azure-cli, serverless, deployment]
related: [azure-functions-event-driven-serverless, functions-triggers-and-bindings, managing-blobs-with-azure-cli]
---
> **In one line:** Provision serverless Function Apps and dependent storage accounts with single Azure CLI commands.

## The idea

Every Azure Function App requires an **Azure Storage Account**. The storage account is used internally by the Azure Functions host for:
- Managing execution state and function triggers.
- Coordinating distributed singleton locks and timer schedules.
- Storing function code packages and deployment logs in Blob and File shares (`AzureWebJobsStorage`).

When creating a Function App via the Azure CLI, you follow a three-step provisioning workflow:
1. Create a Resource Group.
2. Create a general-purpose Storage Account (Standard LRS).
3. Create the Function App, linking it to the storage account and specifying the consumption hosting plan and target runtime language.

| CLI Parameter | Accepted Values | Purpose |
|---|---|---|
| `--storage-account` | Storage account name | Internal state persistence |
| `--consumption-plan-location` | Azure region (e.g. `eastus`) | Regional serverless pool |
| `--runtime` | `node`, `python`, `dotnet-isolated`, `java` | Language execution environment |
| `--runtime-version` | e.g. `20` (Node), `3.11` (Python) | Specific framework version |
| `--functions-version` | `4` (default) | Azure Functions runtime version |

> **Tip:** Always use Azure Functions runtime version `4`. Versions 1, 2, and 3 are deprecated and out of support.

## See it

Provision a complete serverless Node.js Function App environment from scratch using the Azure CLI:

```bash
# Step 1: Create a storage account required for internal Functions runtime state
az storage account create   --name stfuncbackend001   --resource-group rg-learning-portal   --location eastus   --sku Standard_LRS   --output table

# Step 2: Create the serverless Function App on the Consumption plan
az functionapp create   --name func-order-processor-001   --resource-group rg-learning-portal   --storage-account stfuncbackend001   --consumption-plan-location eastus   --runtime node   --runtime-version 20   --functions-version 4   --output table

# Step 3: Verify the function app status and host endpoints
az functionapp show --name func-order-processor-001 --resource-group rg-learning-portal   --query "{Name:name, State:state, Host:defaultHostName}" -o json

# Step 4: Configure application settings and runtime environment variables
az functionapp config appsettings set --name func-order-processor-001 --resource-group rg-learning-portal   --settings "QUEUE_BATCH_SIZE=32" "ENVIRONMENT=Production" -o table
```

The function app is provisioned immediately in the serverless consumption pool, ready to accept code deployments. Continuous deployment can be attached directly to a GitHub repository or Azure DevOps pipeline.

## Go deeper

For local development and testing, install the **Azure Functions Core Tools** (`npm install -g azure-functions-core-tools@4`). This allows you to run `func start` locally to execute, test, and debug triggers and bindings on your workstation, and deploy directly to Azure with `func azure functionapp publish <app-name>`.

When testing functions locally before cloud deployment, use the Azure Functions Core Tools (`func init` and `func start`). This local runtime replicates Azure execution triggers and bindings on your workstation, allowing full debugging and local testing without incurring cloud consumption charges.

## Watch out

- Storage account names must be globally unique across all of Azure and consist of only 3–24 lowercase alphanumeric characters.
- Do not share a single storage account across high-throughput production Function Apps; storage throughput throttling will slow down function scaling.

## Remember

- Every Azure Function App requires an accompanying Azure Storage Account to manage internal runtime state.
- Use `az functionapp create` with `--consumption-plan-location` to deploy serverless pay-per-use apps.
- Use Azure Functions Core Tools for local development, debugging, and deployment publishing.
