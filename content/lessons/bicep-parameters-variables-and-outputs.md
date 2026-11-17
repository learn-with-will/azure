---
slug: bicep-parameters-variables-and-outputs
title: "Bicep Parameters, Variables, and Outputs"
topic: iac-and-devops
kind: api
summary: "Parameterize infrastructure deployments with decorators, calculate local variables, and return resource outputs."
tags: [bicep, parameters, variables, outputs]
related: [writing-bicep-declarative-templates, bicep-modules-and-reusable-infrastructure, deploying-bicep-with-azure-cli]
---
> **In one line:** Parameters accept input values, variables calculate local logic, and outputs return deployment data.

## The idea

Hardcoding server names, SKU sizes, and regions inside infrastructure templates prevents code reuse across development, staging, and production environments. Bicep parameterizes templates using three core constructs:

1. **Parameters (`param`):** Dynamic input values supplied by deployment scripts, CI/CD pipelines, or `.bicepparam` parameter files. Bicep provides powerful **decorators** to enforce validation rules:
   - `@allowed(['dev', 'test', 'prod'])`: Restricts input to an approved list of values.
   - `@minLength(3)` / `@maxLength(24)`: Validates string lengths.
   - `@description('...')`: Documents the parameter for editors and CLI help.
   - `@secure()`: Masks sensitive strings (passwords, connection keys) so they are never logged in plain text or activity history.
2. **Variables (`var`):** Local intermediate values calculated within the template. Used to simplify complex expressions, concatenate strings, and keep resource blocks readable.
3. **Outputs (`output`):** Values returned by the template upon successful deployment (e.g., generated public IP addresses, Key Vault URIs, web app FQDNs). Can be captured by CI/CD pipelines or parent modules.

| Construct | Declared Keyword | Modifiable at Deploy Time | Common Example |
|---|---|---|---|
| **Parameter** | `param` | **Yes (Supplied via CLI / parameters file)** | `param environment string = 'prod'` |
| **Variable** | `var` | No (Calculated internally) | `var storageName = 'st${uniqueString(...)}'` |
| **Output** | `output` | N/A (Emitted after deploy) | `output fqdn string = app.properties.defaultHostName` |

> **Tip:** Always use `uniqueString(resourceGroup().id)` to generate deterministic, globally unique resource names for services like Storage Accounts and Key Vaults. The hash remains identical across deployments to the same resource group, preserving idempotency.

## See it

Declare a Bicep template utilizing decorators, variables, and secure parameters:

```bicep
// parameters.bicep: parameterized infrastructure template
@description('Target environment tier')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@secure()
@description('Administrator password for the database')
param adminPassword string

var skuName = (environment == 'prod') ? 'P1v3' : 'B1'
var uniquePrefix = uniqueString(resourceGroup().id)

resource appPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'plan-${environment}-${uniquePrefix}'
  location: resourceGroup().location
  sku: { name: skuName }
}

output planId string = appPlan.id
output provisionedSku string = skuName
```

The ternary operator in `var skuName` automatically selects a lightweight Basic SKU for development while reserving Premium compute for production deployments.

## Go deeper

Bicep supports **Bicep Parameters Files (`.bicepparam`)**. These companion files bind parameters directly to target Bicep templates with compile-time type validation, replacing error-prone legacy JSON parameter files.

## Watch out

- Never declare default values for `@secure()` parameters in source code; default passwords can be inspected in Git history.
- Variables cannot reference outputs from child modules deployed within the same file.

## Remember

- Parameters accept external inputs decorated with validation rules (`@allowed`, `@secure`).
- Variables calculate local expressions to simplify template logic without exposing input flags.
- Outputs return generated infrastructure properties (IPs, endpoints) back to CI/CD pipelines.
