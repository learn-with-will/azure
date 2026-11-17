---
slug: azure-subscriptions-and-accounts
title: "Azure Accounts, Tenants, and Subscriptions"
topic: cloud-fundamentals
kind: concept
summary: "Structure billing boundaries, subscriptions, and tenant directories to isolate environments and control spend."
tags: [subscriptions, tenants, billing, accounts]
related: [azure-resource-hierarchy, resource-groups-lifecycle, what-is-azure]
---
> **In one line:** Subscriptions act as billing boundaries and resource containers under a Microsoft Entra ID tenant.

## The idea

Understanding how identity and billing relate in Azure requires mastering three distinct concepts:

1. **Microsoft Account / Work Account:** The identity credential (e.g., `alex@contoso.com`) used to sign in.
2. **Microsoft Entra Tenant:** A dedicated, isolated instance of Microsoft Entra ID representing an organization. Holds user accounts, security groups, app registrations, and directory policies.
3. **Azure Subscription:** A logical container of resources that serves two essential boundaries:
   - **Billing Boundary:** Costs incurred by all resources inside the subscription appear on a single invoice charged to the subscription's payment method.
   - **Access Control Boundary:** Administrative permissions (RBAC) and Azure Policies can be applied at the subscription scope, governing everything beneath it.

An organization can have multiple subscriptions under one Entra tenant. For example: `sub-development`, `sub-staging`, and `sub-production`. Subscriptions allow financial controllers to establish hard monthly spending caps, separate billing cards, and isolate audit logs between production and test systems.

| Entity | Primary Purpose | Scope | Multiplicity |
|---|---|---|---|
| **Entra Tenant** | Identity, authentication, directory | Entire organization | 1 tenant per enterprise |
| **Subscription** | Billing, invoices, governance boundary | Environment or department | Multiple per tenant |
| **Resource Group** | Lifecycle and deployment container | Application or service tier | Multiple per subscription |

> **Note:** Every Azure subscription has a hard limit on resources (such as maximum cores per region or total storage accounts). Splitting workloads across multiple subscriptions prevents reaching individual subscription quota ceilings.

## See it

Inspect the subscriptions accessible to your logged-in identity using the Azure CLI:

```bash
# List all subscriptions linked to your account with their state and ID
az account list --output table

# Set the active subscription context for all subsequent CLI commands
az account set --subscription "Visual Studio Enterprise"

# Confirm currently selected active subscription and tenant details
az account show --query "{Name:name, Id:id, TenantId:tenantId, IsDefault:isDefault}" -o table
```

Setting the default subscription ensures commands like `az vm create` target the intended billing account without accidental cross-subscription resource placement.

## Go deeper

Enterprises manage multiple subscriptions using **Azure Enterprise Agreements (EA)** or **Microsoft Customer Agreements (MCA)**. These agreements introduce **Billing Accounts**, **Billing Profiles**, and **Invoice Sections**, enabling departments to share volume pricing discounts while maintaining isolated administrative control over independent subscriptions.

Enterprise organizations manage multiple subscriptions using **Management Groups**. Management Groups provide a hierarchical governance tree above subscriptions, allowing platform teams to assign Azure Policies and RBAC roles at root or department levels that automatically inherit downward across dozens of subscriptions.

## Watch out

- Co-mingling production and development workloads in the same subscription makes cost allocation and strict RBAC isolation difficult.
- Deleting or suspending a subscription deallocates and permanently removes all resources contained inside it.

## Remember

- An Azure subscription serves as both a billing boundary and an administrative governance boundary.
- Multiple subscriptions can be linked to a single Microsoft Entra ID directory tenant.
- Always verify your active CLI subscription context before provisioning resources to prevent billing errors.
