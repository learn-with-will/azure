---
slug: azure-resource-hierarchy
title: "Azure Resource Hierarchy: Management Groups to Resources"
topic: azure-architecture-and-governance
kind: concept
summary: "Organize Azure resources across Management Groups, Subscriptions, and Resource Groups for uniform governance."
tags: [management-groups, subscriptions, hierarchy, governance]
related: [resource-groups-lifecycle, azure-resource-manager-control-plane, azure-policy-and-compliance-enforcement]
---
> **In one line:** Azure organizes all infrastructure into a four-level hierarchy: Management Groups, Subscriptions, Resource Groups, and Resources.

## The idea

To govern access permissions, billing, and compliance policies across thousands of cloud assets, Azure enforces a strict four-level administrative hierarchy:

```text
Root Management Group
 └── Management Groups (Departments / Business Units)
      └── Subscriptions (Billing & Security Boundaries)
           └── Resource Groups (Application Lifecycle Containers)
                └── Resources (VMs, Databases, Storage Accounts)
```

1. **Management Groups:** Containers above subscriptions. You can organize subscriptions into a tree structure up to six levels deep. Policies and RBAC role assignments applied to a management group are automatically inherited by all child management groups and subscriptions beneath it.
2. **Subscriptions:** Billing and quota boundaries linked to an Entra ID tenant. Used to separate enterprise environments (e.g., Production vs Development).
3. **Resource Groups:** Logical folders that group related resources sharing a common deployment lifecycle. Every resource belongs to exactly one resource group.
4. **Resources:** Individual service instances created in Azure (e.g., a Virtual Machine, a SQL Database, a Key Vault, a Virtual Network).

| Hierarchy Level | Primary Architectural Purpose | Inherited By |
|---|---|---|
| **Management Group** | Enterprise-wide policy enforcement and multi-subscription governance | Child MGs, Subscriptions, RGs, Resources |
| **Subscription** | Billing, credit tracking, hard service quotas, and environment isolation | Resource Groups and Resources |
| **Resource Group** | Lifecycle deployment, administrative grouping, and project cost tagging | Resources inside the group |
| **Resource** | Functional application infrastructure instance | N/A (Leaf node) |

> **Note:** Governance settings always inherit downward. A policy denying public IP addresses applied at a Management Group cannot be overridden or bypassed at the child Resource Group level.

## See it

Inspect the management group hierarchy and subscriptions using the Azure CLI:

```bash
# List all management groups in your organizational tenant
az account management-group list -o table

# Inspect management group hierarchy details including child subscriptions
az account management-group show --name mg-corp-production --expand --output json
```

The output reveals how child subscriptions inherit governance rules and access rights from their parent management container.

## Go deeper

Every Entra ID tenant includes a single **Root Management Group** created automatically. All top-level management groups and subscriptions fold under this root. Granting global security policies (such as requiring Microsoft Defender for Cloud across all company subscriptions) is accomplished by assigning policies directly at this root scope.

## Watch out

- Avoid placing all enterprise systems inside a single subscription; you will hit regional CPU core quotas and complicate billing auditing.
- Remember that permissions assigned at higher hierarchy levels cannot be removed at lower child levels; permissions only add, never subtract.

## Remember

- Azure enforces a four-level hierarchy: Management Groups -> Subscriptions -> Resource Groups -> Resources.
- Policies and RBAC permissions defined at higher scopes automatically inherit down to all child levels.
- Every individual Azure resource must belong to exactly one parent resource group.
