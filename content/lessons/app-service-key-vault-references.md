---
slug: app-service-key-vault-references
title: "App Service Key Vault References"
topic: identity-and-security
kind: pattern
summary: "Inject Key Vault secrets directly into App Service application settings using @Microsoft.KeyVault syntax."
tags: [key-vault, app-service, configuration, managed-identity]
related: [azure-key-vault-secrets-keys-certificates, managed-identities-for-azure-resources, azure-app-configuration-centralized-settings]
---
> **In one line:** App Service Key Vault references inject secrets directly into environment variables without writing SDK code.

## The idea

Even when using Managed Identities, writing boilerplate application code to query Azure Key Vault, extract secret strings, and cache them in memory requires ongoing software maintenance.

**App Service Key Vault References** eliminate this boilerplate entirely. You configure standard App Service Application Settings using special reference syntax pointing to your Key Vault:

```text
@Microsoft.KeyVault(SecretUri=https://<vault-name>.vault.azure.net/secrets/<secret-name>/)
```

How it works:
1. The App Service web app is granted a System-Assigned Managed Identity.
2. The identity is assigned the *Key Vault Secrets User* RBAC role on the Key Vault.
3. In App Service Application Settings, you set the value to `@Microsoft.KeyVault(SecretUri=...)`.
4. The App Service infrastructure host intercepts the setting, queries Key Vault using the app's Managed Identity, and **injects the resolved secret value directly into the application process environment**.
5. Your code accesses the secret as a standard local environment variable (e.g., `process.env.DATABASE_PASSWORD` in Node.js or `Configuration["DATABASE_PASSWORD"]` in .NET).

| Approach | Code Required | Credential Handling | Local Environment Consistency |
|---|---|---|---|
| **Direct Key Vault SDK** | Manual SDK client instantiation | Code queries Key Vault at boot | Code requires cloud SDK mocks |
| **Key Vault References** | **Zero code required** | **Host resolves and injects secret** | **Reads standard environment variables** |

> **Tip:** Always use versionless secret URIs (e.g. `.../secrets/DbPassword/` without a trailing version GUID). When you update the secret in Key Vault, App Service automatically detects the update and refreshes the secret within 24 hours.

## See it

Configure a Key Vault Reference in App Service Application Settings using the Azure CLI:

```bash
# Get the secret URI from Azure Key Vault
SECRET_URI=$(az keyvault secret show --vault-name kv-portal-prod-001 --name DbConnectionString --query "id" -o tsv)

# Set the App Service application setting to the Key Vault reference URI
az webapp config appsettings set   --name webapp-portal-prod-001   --resource-group rg-learning-portal   --settings "DB_CONNECTION_STRING=@Microsoft.KeyVault(SecretUri=${SECRET_URI})"   --output table

# Verify the app settings show the resolved Key Vault reference status
az webapp config appsettings list   --name webapp-portal-prod-001   --resource-group rg-learning-portal   --query "[?name=='DB_CONNECTION_STRING'].{Name:name, Value:value}" -o json
```

Inside your application code, reading `process.env.DB_CONNECTION_STRING` returns the plain decrypted connection string seamlessly.

## Go deeper

If a Key Vault reference fails to resolve (e.g., because the Managed Identity lacks permissions or a firewall blocks the connection), App Service injects the literal raw `@Microsoft.KeyVault(...)` string into the environment variable. You can inspect the **Key Vault Reference Status** in the Azure Portal to verify green checkmark resolution.

## Watch out

- If the App Service Managed Identity lacks 'Key Vault Secrets User' permissions, secret resolution fails silently at runtime.
- If Key Vault network firewall rules block public access, App Service must be configured with Regional VNet Integration to resolve references.

## Remember

- Key Vault References inject cloud secrets directly into standard environment variables with zero code.
- Requires enabling Managed Identity on App Service and granting read permissions on the Key Vault.
- Use versionless secret URIs to enable automatic secret rotation pickup.
