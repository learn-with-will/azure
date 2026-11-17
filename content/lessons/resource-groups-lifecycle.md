---
slug: resource-groups-lifecycle
title: "Resource Group Lifecycle and Scope"
topic: azure-architecture-and-governance
kind: technique
summary: "Deploy, manage, and tear down related resources together as a single lifecycle management unit."
tags: [resource-groups, lifecycle, arm, cleanup]
related: [azure-resource-hierarchy, azure-resource-manager-control-plane, resource-tagging-strategies]
---
> **In one line:** Resource groups group assets that share a lifecycle so they can be deployed, monitored, and deleted together.

## The idea

A **Resource Group** is a fundamental logical container in Azure that holds related resources for an application solution.

Three golden rules govern resource group design:
1. **Shared Lifecycle:** Group resources that should be deployed, updated, and deleted together. If a web app, its database, and its storage account belong to a single project that will be retired together, place them in the same resource group.
2. **Single Membership:** Every Azure resource must exist in exactly one resource group. A resource cannot belong to two resource groups simultaneously, although you can move resources between groups if necessary.
3. **Independent Regional Metadata:** A resource group has a location (e.g., `--location eastus`), which stores the resource group's administrative metadata. However, resources *inside* the group can reside in completely different regions.

| Operation | Scope | Consequence |
|---|---|---|
| **Deploy Group** | `az group create` | Creates metadata container for project assets |
| **Apply RBAC** | Resource Group Scope | Grants permissions across all assets in the group |
| **Apply Locks** | Resource Group Scope | Locks all contained resources against deletion |
| **Delete Group** | `az group delete` | **Permanently deletes ALL contained resources in one command** |

> **Tip:** In development and testing environments, place all temporary infrastructure inside a dedicated resource group (e.g., `rg-dev-sandbox`). Tearing down the entire environment requires only one command: `az group delete --name rg-dev-sandbox --yes --no-wait`.

## See it

Create a resource group, deploy an asset into it, and inspect its contents via the Azure CLI:

```bash
# Create a dedicated resource group for a microservice in East US
az group create --name rg-order-service-prod --location eastus -o table

# List all resources currently deployed inside the resource group
az resource list --resource-group rg-order-service-prod --output table

# Delete the resource group and all contained resources asynchronously
az group delete --name rg-order-service-prod --yes --no-wait
```

Deleting the resource group triggers ARM to automatically calculate dependency trees and delete all virtual machines, disks, and networks inside it without manual intervention.

## Go deeper

Resource groups do not act as network boundaries. A virtual machine in `rg-frontend` can communicate directly with a database in `rg-backend` over private IP addresses as long as both reside in the same Virtual Network or in peered VNets. Resource groups represent management and billing boundaries, not networking fences.

## Watch out

- Be extremely cautious when executing `az group delete`; deleting a resource group permanently deletes every contained database, disk, and secret.
- Do not group resources by type (e.g., putting all company databases in one RG and all web apps in another); group by application lifecycle.

## Remember

- Group resources together that share a common deployment and decommissioning lifecycle.
- Resources within a resource group can physically reside in different Azure regions.
- Deleting a resource group permanently removes all resources contained within it.
