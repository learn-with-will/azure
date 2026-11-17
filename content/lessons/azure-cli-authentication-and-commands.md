---
slug: azure-cli-authentication-and-commands
title: "Authenticating and Managing with Azure CLI"
topic: cloud-fundamentals
kind: tool
summary: "Install, log in with az login, set active subscriptions, and format JSON output using JMESPath queries."
tags: [azure-cli, cli, authentication, bash, jmespath]
related: [azure-management-tools-portal-cli-powershell, resource-groups-lifecycle, deploying-vms-with-azure-cli]
---
> **In one line:** The Azure CLI manages cloud resources using concise verb-noun commands and powerful JMESPath queries.

## The idea

The Azure CLI follows a predictable command structure:
```text
az <group> [subgroup] <action> [parameters]
```
For example: `az vm create --name myVM ...` or `az storage account list ...`.

Key conventions for mastering the Azure CLI include:
1. **Interactive Login:** Running `az login` opens a browser window for interactive OAuth2 sign-in. For headless non-interactive environments (CI/CD pipelines), authenticate with a Service Principal or Managed Identity.
2. **Output Formatting (`--output` or `-o`):** Supports `json` (default), `table` (human-readable columnar text), `tsv` (tab-separated values, ideal for shell piping), and `yaml`.
3. **Filtering with JMESPath (`--query`):** A client-side query language that filters, extracts, and reshapes JSON returned by Azure before printing.

Mastering JMESPath query filtering allows operators to extract specific properties from large JSON payloads. For instance, `[?location=='eastus'].name` searches an array of resources for entities located in East US and returns only their string names.

| Output Format | Use Case | Example Command |
|---|---|---|
| `-o json` | Default programmatic parsing | `az group list -o json` |
| `-o table` | Quick human inspection in terminal | `az group list -o table` |
| `-o tsv` | Shell script variable extraction | `IP=$(az vm show ... -o tsv)` |
| `--query "<jmespath>"` | Extracting specific nested fields | `az vm list --query "[].name"` |

> **Tip:** Combine `--query` with `-o tsv` to extract raw string values directly into shell variables without requiring `jq` or `awk`.

## See it

Authenticate to Azure and filter your resource groups using JMESPath:

```bash
# Log in interactively via browser authentication
az login -o table

# Create a resource group in East US
az group create --name rg-learning-portal --location eastus -o table

# Query specific properties using JMESPath filtering
az group show --name rg-learning-portal --query "{Name:name, Region:location, Status:properties.provisioningState}" -o json

# Extract raw string value into shell variable without quotes
RG_LOC=$(az group show --name rg-learning-portal --query "location" -o tsv)
echo "Target region is: $RG_LOC"
```

The output confirms successful creation of your resource group within the target subscription and region.

## Go deeper

The Azure CLI supports custom extensions to add non-core features (e.g., `az containerapp`, `az bicep`, `az devops`). You can configure the CLI to automatically install missing extensions when commands are invoked:
```bash
az config set extension.use_dynamic_install=yes_without_prompt
```
This enables zero-friction command execution in modern automated scripting environments.

## Watch out

- JMESPath query expressions are case-sensitive; verify exact API property names in Azure documentation.
- Never store plaintext passwords or secrets in shell scripts when running `az login`.

## Remember

- Azure CLI commands follow the standard `az <group> [subgroup] <action>` hierarchy.
- Use `--query` with JMESPath syntax to filter and extract targeted API response data.
- Combine `--query` with `-o tsv` to capture clean values directly into shell script variables.
