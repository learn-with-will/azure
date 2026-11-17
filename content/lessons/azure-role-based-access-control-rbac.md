---
slug: azure-role-based-access-control-rbac
title: "Azure Role-Based Access Control (RBAC)"
topic: identity-and-security
kind: concept
summary: "Assign fine-grained management permissions using security principals, role definitions, and hierarchical scopes."
tags: [rbac, roles, permissions, scopes, access-control]
related: [microsoft-entra-id-fundamentals, azure-resource-hierarchy, managed-identities-for-azure-resources]
---
> **In one line:** Azure RBAC grants granular permissions by binding security principals to role definitions at specific scopes.

## The idea

**Azure Role-Based Access Control (RBAC)** is the authorization system built into Azure Resource Manager to provide fine-grained access management for cloud infrastructure.

An RBAC access assignment is composed of three elements:
1. **Security Principal:** *Who* needs access. Can be a User, a Security Group, a Service Principal (application identity), or a Managed Identity.
2. **Role Definition:** *What* permissions are granted. A collection of allowed and disallowed actions (e.g., `Microsoft.Compute/virtualMachines/read`). Azure provides hundreds of built-in roles:
   - **Owner:** Full access to all resources, including the ability to grant access to others.
   - **Contributor:** Full access to create, update, and manage all resources, but **cannot grant access to others**.
   - **Reader:** Read-only access to view resources; cannot create, modify, or delete anything.
3. **Scope:** *Where* the permissions apply. Defined along the Azure hierarchy:
   - Management Group Scope
   - Subscription Scope
   - Resource Group Scope
   - Individual Resource Scope

| Role Definition | Manage Resources | Grant Access to Others | Delete Resources | Read Configurations |
|---|---|---|---|---|
| **Owner** | Yes | **Yes** | Yes | Yes |
| **Contributor** | Yes | **No** | Yes | Yes |
| **Reader** | **No** | **No** | **No** | Yes |

> **Tip:** Permissions always **inherit downward**. Granting *Reader* at the Subscription scope automatically gives the user read access to every Resource Group and Resource in that subscription. Permissions only add together; there is no 'deny' in standard RBAC role assignments.

## See it

Assign a user the Contributor role scoped to a single resource group using the Azure CLI:

```bash
# Assign the 'Contributor' role to a developer scoped strictly to one resource group
az role assignment create   --assignee "alex@contoso.com"   --role "Contributor"   --resource-group rg-learning-portal   --output table

# Verify the assignment and inspect its inherited scope
az role assignment list   --resource-group rg-learning-portal   --query "[?principalName=='alex@contoso.com'].{Principal:principalName, Role:roleDefinitionName, Scope:scope}"   -o table
```

Alex can now deploy VMs and databases inside `rg-learning-portal`, but cannot modify other resource groups in the subscription or assign roles to coworkers.

## Go deeper

If built-in roles are too broad, you can author **Custom RBAC Roles** in JSON. For example, a 'Virtual Machine Operator' role can be defined that permits restarting and stopping VMs (`Microsoft.Compute/virtualMachines/restart/action`) while strictly forbidding changing VM sizes or deleting disks.

For enterprise organizations with specific governance requirements, Azure supports **Custom Roles**. You can define fine-grained JSON permission sets specifying exact allowed actions (`Microsoft.Compute/virtualMachines/restart/action`) and notActions, and assign them at subscription or management group scopes.

## Watch out

- Never assign the 'Owner' role when 'Contributor' is sufficient; enforcing the principle of least privilege is mandatory.
- Standard Contributor and Owner roles manage the control plane, but do NOT grant data plane rights to read blobs or database rows.

## Remember

- RBAC binds a Security Principal to a Role Definition at a designated Scope.
- Owner can assign permissions; Contributor manages resources; Reader is strictly read-only.
- Permissions inherit downward from Management Groups to Subscriptions, Resource Groups, and Resources.
