---
slug: creating-vnets-and-subnets-with-azure-cli
title: "Creating VNets and Subnets with Azure CLI"
topic: networking-and-connectivity
kind: tool
summary: "Provision address prefixes, virtual networks, and subnets using az network vnet and subnet commands."
tags: [azure-cli, vnet, subnet, networking, bash]
related: [virtual-networks-and-subnet-design, network-security-groups-and-security-rules, vnet-peering-hub-and-spoke-architecture]
---
> **In one line:** Use the Azure CLI to provision virtual networks, segment subnets, and attach security group firewalls.

## The idea

Automating network infrastructure through the Azure CLI guarantees repeatable, version-controlled topologies that prevent manual configuration drift.

The core CLI command group for virtual networking is `az network vnet`:
- `az network vnet create`: Allocates a virtual network with its root CIDR address space.
- `az network vnet subnet create`: Carves out a specific subnet range and attaches security firewalls.
- `az network vnet subnet update`: Binds Network Security Groups or enables VNet Service Endpoints.
- `az network vnet list`: Queries active network topologies and address spaces across subscriptions.

A standard enterprise script provisions the Virtual Network first, provisions an associated Network Security Group, and links the NSG directly to the subnet upon creation.

| Parameter | Example Value | Purpose |
|---|---|---|
| `--address-prefixes` | `10.100.0.0/16` | Root private CIDR block for the VNet |
| `--vnet-name` | `vnet-production` | Target parent virtual network |
| `--network-security-group` | `nsg-app-tier` | Associates firewall rules to the subnet |
| `--service-endpoints` | `Microsoft.Storage` | Enables optimized routing for Azure PaaS |

> **Tip:** When creating subnets, always link the Network Security Group during the `az network vnet subnet create` command rather than updating it later to ensure instances are protected from the moment they boot.

## See it

Provision a multi-tier network topology with frontend and backend subnets using the Azure CLI:

```bash
# Step 1: Create a virtual network with a 10.100.0.0/16 CIDR block
az network vnet create   --resource-group rg-learning-portal   --name vnet-ecommerce-prod   --location eastus   --address-prefixes 10.100.0.0/16   --output table

# Step 2: Create a dedicated Network Security Group for the web tier
az network nsg create   --resource-group rg-learning-portal   --name nsg-web-subnet   --location eastus   --output table

# Step 3: Create the web subnet and attach the NSG in a single command
az network vnet subnet create   --resource-group rg-learning-portal   --vnet-name vnet-ecommerce-prod   --name snet-web   --address-prefixes 10.100.1.0/24   --network-security-group nsg-web-subnet   --output table

# Verify the provisioned subnet and associated NSG ID
az network vnet subnet show --resource-group rg-learning-portal --vnet-name vnet-ecommerce-prod --name snet-web   --query "{Subnet:name, CIDR:addressPrefix, NSG:networkSecurityGroup.id}" -o json
```

The output confirms that the web subnet is provisioned and guarded by its dedicated NSG firewall rules.

## Go deeper

You can append multiple non-contiguous address spaces to an existing VNet after creation using `az network vnet update --add addressSpace.addressPrefixes 172.16.0.0/16`. This allows networks that are running low on available IP space to expand dynamically without tearing down running virtual machines.

When designing enterprise virtual networks, always leave unallocated IP address space for future expansion. Subnets cannot be resized once resources are attached without recreating them; planning clean CIDR blocks upfront prevents costly network reconfiguration and downtime later in production.

## Watch out

- You cannot shrink or remove an address prefix from a VNet if subnets containing active resources are currently allocated within that range.
- Subnet address ranges must fall completely within the parent VNet's configured address prefixes.

## Remember

- Use `az network vnet create` and `az network vnet subnet create` to define network topologies.
- Always attach Network Security Groups directly to subnets during creation for instant security coverage.
- Virtual networks support adding secondary non-contiguous address prefixes when IP capacity runs low.
