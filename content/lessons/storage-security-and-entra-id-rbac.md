---
slug: storage-security-and-entra-id-rbac
title: "Storage Security: Entra ID RBAC vs Shared Keys"
topic: storage-and-blob
kind: pitfall
summary: "Enforce Microsoft Entra ID role-based access for storage and disable legacy all-powerful account keys."
tags: [security, rbac, entra-id, account-keys, pitfall]
related: [shared-access-signatures-sas, azure-role-based-access-control-rbac, avoiding-hardcoded-credentials]
---
> **In one line:** Rely on Microsoft Entra ID RBAC roles for storage access and disable shared master account keys.

## The idea

Every Azure Storage Account is created with two 512-bit **Shared Keys** (master account keys). Possessing an account key grants root-level, all-powerful administrative access to everything inside the storage account—the ability to read, write, modify, or permanently delete every single blob, file share, table, and queue message.

Hardcoding storage account keys in configuration files, scripts, or application settings is an extreme security risk. If a key is leaked or checked into a public Git repository, attackers gain full access to your corporate data assets.

Microsoft's modern security standard mandates **Microsoft Entra ID Role-Based Access Control (RBAC)**:
1. **Fine-Grained Scopes:** Assign permissions at the storage account, container, or individual blob level.
2. **Least Privilege Roles:**
   - *Storage Blob Data Reader:* Read blob contents and metadata.
   - *Storage Blob Data Contributor:* Read, write, and delete blobs.
   - *Storage Blob Data Owner:* Full data access plus permission to assign RBAC roles.
3. **Disabling Shared Key Access:** You can configure the storage account to completely disallow Shared Key authentication, forcing all clients and applications to authenticate via Entra ID tokens.

| Security Dimension | Shared Account Keys | Microsoft Entra ID RBAC |
|---|---|---|
| **Permission Granularity** | All-or-nothing root access | Fine-grained (Reader, Contributor) |
| **Credential Rotation** | High disruption (Breaks apps) | Seamless token renewal |
| **Audit Visibility** | Anonymous key caller in logs | Exact user / Managed Identity in audit trail |
| **Security Best Practice** | Deprecated / Disallowed | **Recommended Microsoft Standard** |

> **Watch out:** Disabling shared key access on an existing storage account will immediately break any legacy applications or backup scripts using connection strings that embed `AccountKey=...`.

## See it

Assign a user the Storage Blob Data Reader role and disable shared key access using the Azure CLI:

```bash
# Assign the 'Storage Blob Data Reader' role to a user at the container scope
az role assignment create   --assignee "alex@contoso.com"   --role "Storage Blob Data Reader"   --scope "/subscriptions/{sub-id}/resourceGroups/rg-learning-portal/providers/Microsoft.Storage/storageAccounts/stportaldata001/blobServices/default/containers/customer-documents"

# Disable legacy shared account key access on the storage account
az storage account update   --name stportaldata001   --resource-group rg-learning-portal   --allow-shared-key-access false   --output table
```

With `--allow-shared-key-access false`, any connection attempt using master keys or account SAS tokens is rejected by ARM with an HTTP 403 Forbidden error.

## Go deeper

Applications running inside Azure (such as App Service web apps, Virtual Machines, or Azure Functions) should authenticate to Blob storage using **Managed Identities**. The app requests an Entra ID token automatically from the local Azure instance metadata service, eliminating credentials from configuration files entirely.

## Watch out

- Assigning standard 'Contributor' or 'Owner' on the storage account grants ARM management rights, but does NOT grant data plane read rights; you must assign 'Storage Blob Data Contributor'.
- Disabling shared key access blocks Azure Portal storage browser views unless the administrator explicitly switches to Entra ID user authentication mode.

## Remember

- Master account keys grant all-or-nothing root access and should be disabled in production.
- Use Microsoft Entra ID RBAC roles ('Storage Blob Data Reader / Contributor') for granular access.
- Combine Managed Identities with RBAC to achieve passwordless cloud application storage access.
