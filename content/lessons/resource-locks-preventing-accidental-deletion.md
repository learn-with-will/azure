---
slug: resource-locks-preventing-accidental-deletion
title: "Resource Locks: Preventing Accidental Deletion"
topic: governance-reliability-architecture
kind: tool
summary: "Protect mission-critical Azure resources and subscriptions from accidental deletion or modification using Resource Locks."
tags: [locks, resource-locks, governance, safety]
related: [azure-policy-and-compliance-enforcement, azure-slas-and-composite-availability, azure-backup-and-azure-site-recovery]
---
> **In one line:** Prevent accidental deletion or unauthorized modification of critical cloud assets using CanNotDelete and ReadOnly resource locks.

## The idea

In production cloud environments, accidental deletion is one of the leading causes of catastrophic downtime. Even with strict Role-Based Access Control, an engineer with Subscription Owner permissions can accidentally click 'Delete' on a core production Virtual Network, Key Vault, or SQL Database.

**Azure Resource Locks** provide a dedicated safety mechanism that overrides user permissions, preventing accidental changes or deletions until the lock is explicitly removed.

Azure supports two types of resource locks:
1. **CanNotDelete (Delete Lock):**
   - Authorized users can read, modify, and manage the resource normally.
   - **Nobody can delete the resource**, including Subscription Owners and Global Administrators.
   - To delete the resource, an administrator must intentionally navigate to the Locks blade and delete the lock first.
2. **ReadOnly (Read-Only Lock):**
   - Authorized users can view resource properties and configuration.
   - **Nobody can update, modify, or delete the resource**.
   - Functions like making the resource immutable.

| Lock Type | Can Read? | Can Modify Properties? | Can Delete? | Primary Use Case |
|---|---|---|---|---|
| **CanNotDelete** | Yes | **Yes** | **NO** | Core production databases, Virtual Networks, Key Vaults |
| **ReadOnly** | Yes | **NO** | **NO** | Regulatory archive storage, reference virtual networks |

> **Tip:** Resource locks are **inherited**. Applying a `CanNotDelete` lock on a Resource Group automatically locks every resource inside it, as well as any new resources provisioned into that group in the future.

## See it

Apply a `CanNotDelete` lock to a production resource group using the Azure CLI:

```bash
# Apply a CanNotDelete lock to prevent accidental deletion of critical infrastructure
az lock create   --name "Lock-Critical-Portal-RG"   --resource-group rg-learning-portal   --lock-type CanNotDelete   --notes "Prevents accidental deletion of production learning portal infrastructure"

# List active locks configured on the resource group
az lock list   --resource-group rg-learning-portal   --output table

# Attempting to delete the resource group will now fail with a 409 Conflict error
```

If an administrator or automated script executes `az group delete --name rg-learning-portal`, Azure Resource Manager blocks the operation with an error stating the resource group is locked.

## Go deeper

Locks supersede standard RBAC permissions. To prevent unauthorized engineers from simply removing locks, restrict the `Microsoft.Authorization/locks/*` permissions using custom RBAC roles. Only senior platform operations leads should possess authorization to remove deletion locks on production environments.

To maintain automation in DevOps pipelines, CI/CD service principals can be granted scoped permissions to remove locks temporarily, apply infrastructure schema migrations or updates, and immediately reapply the `CanNotDelete` lock upon pipeline completion, preserving end-to-end protection against accidental human errors.

## Watch out

- A `ReadOnly` lock on an App Service or Storage Account can prevent operational tasks, like uploading application logs or rotating keys.
- Locks do not prevent operations internal to a service (e.g., a SQL table can still have rows deleted even if the SQL Server is locked).

## Remember

- Resource locks protect mission-critical cloud infrastructure from accidental deletion or unexpected modification.
- CanNotDelete permits reading and updating but blocks deletion; ReadOnly blocks both updating and deletion.
- Locks are inherited downwards from subscriptions and resource groups to all child resources.
