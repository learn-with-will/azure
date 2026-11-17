---
slug: infrastructure-as-code-arm-vs-bicep
title: "Infrastructure as Code: ARM Templates vs Bicep"
topic: iac-and-devops
kind: concept
summary: "Understand declarative infrastructure management and how domain-specific Bicep compiles cleanly to ARM JSON."
tags: [bicep, arm, iac, declarative]
related: [writing-bicep-declarative-templates, bicep-parameters-variables-and-outputs, deploying-bicep-with-azure-cli]
---
> **In one line:** Bicep is Azure's domain-specific declarative language that compiles cleanly down to ARM JSON templates.

## The idea

**Infrastructure as Code (IaC)** is the practice of provisioning and managing cloud infrastructure using declarative, version-controlled definition files rather than manual clicks in a web portal or procedural shell scripts.

Historically, native Azure declarative deployments relied on **Azure Resource Manager (ARM) Templates** written in raw JSON. While powerful and supported natively by the ARM control plane, ARM JSON templates suffer from severe drawbacks:
- Verbose, deeply nested syntax requiring thousands of lines of brackets.
- Clunky expressions like `"[parameters('storageAccountName')]"` and `"[concat(...)]"`.
- Lack of code reuse and difficult multi-file modularization.

Microsoft solved this by creating **Bicep**:
Bicep is a transparent, domain-specific abstraction (DSL) over ARM templates:
- **Clean, concise syntax:** Reads like modern programming languages (TypeScript or Terraform) without JSON ceremony.
- **First-Class Modularization:** Break complex architectures into clean, reusable `.bicep` module files.
- **Zero-Day Feature Support:** All new Azure services and API versions are immediately supported in Bicep the day they launch.
- **Direct Transpilation:** Bicep compiles directly into standard ARM JSON templates. When deployed, the Azure CLI automatically transpiles Bicep in memory before submitting to the ARM API.

| Dimension | ARM JSON Templates | Azure Bicep |
|---|---|---|
| **File Format** | Verbose nested JSON (`.json`) | **Concise DSL (`.bicep`)** |
| **Readability** | Difficult (Heavy brackets & quotes) | **Clean and human-friendly** |
| **Modules & Reuse** | Complex linked templates | **Simple `module` keyword** |
| **Tooling & Linter** | Basic schema validation | **Rich VS Code extension with autocomplete** |
| **Underlying Engine** | Azure Resource Manager (ARM) | Azure Resource Manager (Transpiles to ARM) |

> **Tip:** You do not need to choose between ARM templates and Bicep. Because Bicep is a direct transparent abstraction over ARM, any existing ARM JSON template can be decompiled into Bicep using `az bicep decompile`.

## See it

Compare a concise Bicep resource definition with its transpiled ARM JSON output using the Azure CLI:

```bicep
// main.bicep: concise declarative storage account definition
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'stbicepdemo001'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}
```

Transpile the Bicep template directly to raw ARM JSON to inspect the underlying control plane payload:

```bash
# Transpile the Bicep file into standard ARM JSON
az bicep build --file main.bicep --outfile azuredeploy.json
```

The resulting `azuredeploy.json` contains over 40 lines of boilerplate schema, parameters, and resources generated automatically from 8 lines of Bicep.

## Go deeper

Bicep integrates with **Private Bicep Registries**. Enterprise platform engineering teams can publish standardized, security-hardened Bicep modules (e.g., a corporate compliant SQL database or locked-down virtual network) to an internal Azure Container Registry (ACR), allowing developers to consume approved modules across the organization.

## Watch out

- Bicep is designed specifically for Microsoft Azure; if multicloud deployments across AWS or GCP are required, Terraform is commonly chosen.
- Always install the official **Bicep VS Code extension** to unlock real-time syntax checking, IntelliSense, and parameter validation.

## Remember

- Bicep is a concise, domain-specific declarative language that replaces verbose ARM JSON templates.
- Bicep transpiles directly into ARM template JSON with immediate day-zero Azure service support.
- Use Bicep modules to build reusable, standardized enterprise infrastructure components.
