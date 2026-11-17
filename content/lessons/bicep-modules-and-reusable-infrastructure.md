---
slug: bicep-modules-and-reusable-infrastructure
title: "Bicep Modules and Reusable Infrastructure Components"
topic: iac-and-devops
kind: pattern
summary: "Decompose complex templates into modular, testable Bicep files and share them via private Bicep registries."
tags: [bicep, modules, architecture, reusability]
related: [writing-bicep-declarative-templates, bicep-parameters-variables-and-outputs, what-if-operation-and-idempotency]
---
> **In one line:** Bicep modules decompose monolithic templates into reusable, standardized building blocks.

## The idea

As cloud environments grow, authoring monolithic Bicep files containing hundreds of virtual machines, storage accounts, and network interfaces becomes unmaintainable. **Bicep Modules** allow you to decompose complex templates into composable, reusable building blocks.

A module in Bicep is simply another standard `.bicep` file invoked by a parent template using the `module` keyword:

```bicep
module <symbolic-name> '<path-to-file.bicep>' = {
  name: <deployment-name>
  params: { ... }
}
```

Key advantages of modular architecture:
1. **Separation of Concerns:** Networking teams manage `network.bicep`, database teams manage `database.bicep`, and application teams orchestrate them in `main.bicep`.
2. **Standardization:** Centralized platform engineering teams write gold-standard modules enforcing corporate encryption, backup, and tagging policies.
3. **Cross-Scope Deployments:** A parent template executing at the Subscription scope can deploy a module into a specific child Resource Group by passing the `scope: resourceGroup(...)` property.
4. **Iterative Loops:** Easily provision arrays of identical resources using `[for item in items: ...]` module loops.

| Module Source | Syntax Example | Use Case |
|---|---|---|
| **Local File** | `module stg './modules/storage.bicep' = { ... }` | Project-specific component decomposition |
| **Private ACR Registry** | `module db 'br:acrprod.azurecr.io/bicep/sql:v1' = { ... }` | Enterprise-wide shared security modules |
| **Public MCR Registry** | `module vnet 'br/public:avm/res/network/virtual-network:0.1.1' = { ... }` | Microsoft Azure Verified Modules (AVM) |

> **Tip:** Leverage **Azure Verified Modules (AVM)** (<https://aka.ms/avm>). These are official, Microsoft-supported Bicep modules pre-configured with security best practices, telemetry, and automated tests.

## See it

Orchestrate a multi-tier application by calling a reusable child module from a root template:

```bicep
// main.bicep: Root orchestration template
param location string = resourceGroup().location

// Deploy the reusable network infrastructure module
module networkModule './modules/network.bicep' = {
  name: 'networkDeployment'
  params: {
    vnetName: 'vnet-app-prod'
    location: location
  }
}

// Deploy the web compute module, passing the subnet ID output from the network module
module appModule './modules/webapp.bicep' = {
  name: 'appDeployment'
  params: {
    subnetId: networkModule.outputs.appSubnetId
    location: location
  }
}
```

Bicep automatically resolves dependencies across modules: `networkModule` deploys first, and its output subnet ID flows directly into `appModule`.

## Go deeper

Modules support **Module Loops**. If you have an array of region names (e.g., `['eastus', 'westeurope', 'southeastasia']`), a single module declaration with `[for region in regions: ...]` provisions identical regional infrastructure stacks in parallel across all target locations.

## Watch out

- Each module execution creates a child ARM deployment record in the resource group; avoid deeply nested module chains (max 5 levels).
- Module symbolic outputs are not available until the child module deployment completes successfully.

## Remember

- Bicep modules allow decomposing large templates into reusable, isolated component files.
- Modules can be consumed from local directories, private ACR registries, or public Azure Verified Modules.
- Parent templates seamlessly wire module outputs as input parameters into downstream modules.
