---
slug: writing-bicep-declarative-templates
title: "Writing Declarative Bicep Templates"
topic: iac-and-devops
kind: technique
summary: "Define Azure resources, symbolic names, API versions, and dependencies in clear, concise Bicep syntax."
tags: [bicep, templates, syntax, resources]
related: [infrastructure-as-code-arm-vs-bicep, bicep-parameters-variables-and-outputs, deploying-bicep-with-azure-cli]
---
> **In one line:** Declare Azure infrastructure resources using concise Bicep resource blocks with automatic dependency tracking.

## The idea

A Bicep file (`.bicep`) describes the desired end-state of Azure infrastructure declaratively. You state *what* resources should exist, and the Azure Resource Manager determines the correct sequence of actions to achieve that state.

A Bicep resource declaration follows this structure:
```bicep
resource <symbolic-name> '<resource-type>@<api-version>' = {
  name: <resource-name>
  location: <location>
  properties: { ... }
}
```

Key elements of a Bicep resource block:
1. **Symbolic Name:** An internal identifier used within the Bicep file to reference this resource in other blocks (e.g., `storageApp`). Does not appear in Azure.
2. **Resource Type and API Version:** Specifies the Azure Resource Provider and schema version (e.g., `'Microsoft.Web/serverfarms@2023-12-01'`).
3. **Automatic Dependency Resolution:** If Resource B references a property of Resource A (e.g., an App Service pointing to `storageApp.id`), Bicep **automatically infers the dependency**. ARM provisions Resource A first, waits for completion, and then provisions Resource B in parallel with independent assets.

| Bicep Keyword | Purpose | Example |
|---|---|---|
| `param` | Input values passed at deployment time | `param environmentName string = 'prod'` |
| `var` | Internal calculated variables | `var storageName = 'st${uniqueString(resourceGroup().id)}'` |
| `resource` | Infrastructure asset to provision | `resource webApp 'Microsoft.Web/sites@2023-12-01'` |
| `output` | Values returned after deployment completes | `output endpoint string = webApp.properties.defaultHostName` |

> **Tip:** Never hardcode explicit `dependsOn` arrays unless absolutely necessary. Bicep automatically calculates dependency directed acyclic graphs (DAGs) from symbolic property references.

## See it

Write a complete Bicep file that provisions an App Service Plan and a Web App with automatic dependency linking:

```bicep
// webapp.bicep: App Service Plan and Web App with implicit dependency
param location string = resourceGroup().location
param appName string = 'app-portal-${uniqueString(resourceGroup().id)}'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'plan-portal-prod'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
  }
}

output webUrl string = webApp.properties.defaultHostName
```

Notice that `webApp` references `appServicePlan.id`. Bicep detects this reference, ensuring the plan is created before the web app boots.

## Go deeper

Bicep supports **Target Scopes**. By default, Bicep files deploy to a target Resource Group (`targetScope = 'resourceGroup'`). However, you can configure Bicep files to deploy at the `subscription`, `managementGroup`, or `tenant` scopes to automate subscription creation, RBAC assignments, and policy definitions.

## Watch out

- Always pin explicit API versions in resource declarations (e.g., `@2023-12-01`); never omit versions or use dynamic strings.
- Resource names must satisfy individual service naming rules (e.g., storage accounts require lowercase letters without hyphens).

## Remember

- Bicep resource blocks define symbolic names, resource providers, and pinned API versions.
- Symbolic property references establish automatic dependency ordering without manual `dependsOn` arrays.
- Target scopes allow Bicep to deploy infrastructure across Resource Groups, Subscriptions, and Management Groups.
