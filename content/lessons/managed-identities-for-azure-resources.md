---
slug: managed-identities-for-azure-resources
title: "Managed Identities for Azure Resources"
topic: identity-and-security
kind: pattern
summary: "Authenticate Azure resources to Entra ID-protected services automatically without embedded credentials."
tags: [managed-identities, system-assigned, user-assigned, security]
related: [azure-key-vault-secrets-keys-certificates, app-service-key-vault-references, azure-role-based-access-control-rbac]
---
> **In one line:** Managed Identities give Azure resources an automatic Entra ID identity, eliminating credentials in code.

## The idea

The fundamental challenge of cloud security is the 'secret zero' dilemma: how does an application authenticate to Azure Key Vault or a database without storing a secret password in its configuration?

**Managed Identities for Azure Resources** solves this completely by giving Azure resources (Virtual Machines, App Service apps, Azure Functions) an automatically managed identity inside Microsoft Entra ID.

How it works:
1. You enable Managed Identity on an Azure resource (e.g., an App Service web app).
2. Azure automatically creates a Service Principal identity representing that app in Microsoft Entra ID.
3. You assign that identity RBAC permissions (e.g., granting it *Key Vault Secrets User* on your Key Vault).
4. When the app executes, it calls a local Azure instance metadata service endpoint (`http://169.254.169.254/metadata/identity/oauth2/token`).
5. Azure provides a valid Entra ID OAuth 2.0 access token **without requiring any passwords, client secrets, or certificates in application code**.

Azure supports two types of managed identities:
- **System-Assigned:** Tied directly to a single resource. Automatically created when enabled and **automatically deleted when the resource is deleted**. Cannot be shared.
- **User-Assigned:** Created as a standalone Azure resource with its own lifecycle. Can be shared across multiple resources (e.g., shared by all worker VMs in a VMSS fleet).

| Characteristic | System-Assigned Managed Identity | User-Assigned Managed Identity |
|---|---|---|
| **Lifecycle** | Tied to resource (Deleted when resource dies) | Independent lifecycle (Managed separately) |
| **Sharing** | 1:1 relationship (Single resource only) | 1:Many (Shared across multiple resources) |
| **Creation** | Enabled via flag on resource | Provisioned as standalone resource |
| **Best For** | Single isolated web apps or functions | Scale sets, multiple microservices sharing access |

> **Tip:** Use the modern `Azure.Identity` SDK (`DefaultAzureCredential`). It automatically uses Managed Identity in production, while falling back to local Azure CLI developer credentials on your workstation with zero code changes.

## See it

Enable a System-Assigned Managed Identity on an App Service web app using the Azure CLI:

```bash
# Enable System-Assigned Managed Identity on the web app and capture its Principal ID
APP_PRINCIPAL_ID=$(az webapp identity assign   --name webapp-portal-prod-001   --resource-group rg-learning-portal   --query "principalId" -o tsv)

echo "Assigned Identity Principal ID: $APP_PRINCIPAL_ID"

# Grant the web app identity permission to read secrets from Key Vault
az role assignment create   --assignee "$APP_PRINCIPAL_ID"   --role "Key Vault Secrets User"   --scope "/subscriptions/{sub-id}/resourceGroups/rg-learning-portal/providers/Microsoft.KeyVault/vaults/kv-portal-prod-001"   --output table
```

The web app now possesses direct, passwordless cryptographic authority to read secrets from Key Vault without storing credentials in code.

## Go deeper

Managed Identities automatically handle token rotation. Azure rotates the underlying security credentials in Microsoft Entra ID continuously behind the scenes. Developers never have to write secret rotation scripts or worry about expiring certificate outages.

## Watch out

- Managed Identities only work for services running inside Azure; on-premises servers require Azure Arc to acquire managed identities.
- Deleting a resource with a System-Assigned identity immediately deletes the identity in Entra ID, invalidating all role assignments.

## Remember

- Managed Identities eliminate credentials, connection secrets, and password rotation from source code.
- System-Assigned is 1:1 with a resource; User-Assigned is standalone and shared across multiple resources.
- Use `DefaultAzureCredential` in application code to authenticate transparently across dev and cloud environments.
