---
slug: azure-app-configuration-centralized-settings
title: "Centralized Settings with Azure App Configuration"
topic: identity-and-security
kind: tool
summary: "Manage non-secret dynamic application settings and feature flags across microservices in one central place."
tags: [app-configuration, feature-flags, microservices, settings]
related: [azure-key-vault-secrets-keys-certificates, app-service-key-vault-references, managed-identities-for-azure-resources]
---
> **In one line:** Azure App Configuration centrally manages dynamic application settings and feature flags across microservices.

## The idea

Modern microservice architectures frequently distribute configuration settings across dozens of separate applications, containers, and deployment slots. When a common setting (like an API base URL, timeout threshold, or branding color) needs updating, redeploying every microservice causes operational friction.

**Azure App Configuration** provides a centralized, dedicated service for managing non-secret application settings and **Feature Flags**:

- **Centralized Key-Value Store:** Manage configurations for all microservices in a single administrative console with label support (e.g., `AppName:LoggingLevel` with labels `Development`, `Staging`, and `Production`).
- **Dynamic Configuration Refresh:** Applications listen to configuration change events. When an operator updates a setting in App Configuration, connected applications update their runtime memory state **without restarting the application or dropping connections**.
- **Native Feature Flag Management:** Built-in UI to toggle feature flags on or off, support percentage-based rollouts, and enable targeted beta user testing.
- **Key Vault Integration:** App Configuration can store references to Azure Key Vault secrets, providing a unified configuration entry point for both secrets and non-secrets.

| Feature | Azure Key Vault | Azure App Configuration |
|---|---|---|
| **Primary Data Type** | Highly sensitive secrets, keys, certs | Non-secret settings, UI strings, feature flags |
| **Security Controls** | FIPS 140-2 HSM encryption | Standard encryption at rest |
| **Dynamic Reloading** | Event-driven (Requires polling) | Built-in push/sentinel dynamic reload |
| **Feature Flags** | No | **Native Feature Management UI and filters** |

> **Tip:** Combine the two services: store application passwords and TLS keys in Azure Key Vault, and store general configuration settings and feature flags in Azure App Configuration.

## See it

Create an Azure App Configuration store and define a feature flag using the Azure CLI:

```bash
# Provision a standard Azure App Configuration store
az appconfig create   --name appcs-portal-prod-001   --resource-group rg-learning-portal   --location eastus   --sku standard   --output table

# Create a key-value setting with an environment label
az appconfig kv set   --name appcs-portal-prod-001   --key "Portal:ThemeColor"   --value "#0078D4"   --label "Production"   --yes -o table

# Create a boolean feature flag to gate a new beta feature
az appconfig feature set   --name appcs-portal-prod-001   --feature "EnableDarkThemeBeta"   --description "Gates new dark theme UI"   --yes -o table
```

Microservices query this centralized endpoint upon startup to retrieve all operational settings and active feature flags dynamically.

## Go deeper

App Configuration integrates with **Azure Event Grid**. When a setting changes, App Configuration broadcasts an event to an Azure Service Bus topic or webhook, enabling enterprise event-driven architectures to notify distributed worker pools to flush internal memory caches immediately.

## Watch out

- Never store plaintext passwords or private keys in App Configuration; use Key Vault references for all sensitive credentials.
- Free tier App Configuration stores are capped at 10 MB total storage and 1,000 requests per day.

## Remember

- Azure App Configuration centralizes non-secret configurations and feature flags across microservices.
- Supports dynamic runtime configuration reloading without restarting application processes.
- Stores references to Key Vault secrets to deliver a single unified configuration layer.
