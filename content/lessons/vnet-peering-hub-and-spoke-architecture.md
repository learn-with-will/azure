---
slug: vnet-peering-hub-and-spoke-architecture
title: "VNet Peering and Hub-and-Spoke Topology"
topic: networking-and-connectivity
kind: pattern
summary: "Connect separate virtual networks seamlessly over the Microsoft backbone without gateway transit overhead."
tags: [peering, hub-and-spoke, topology, routing]
related: [virtual-networks-and-subnet-design, private-endpoints-and-private-link, hybrid-connectivity-vpn-and-expressroute]
---
> **In one line:** VNet Peering connects virtual networks across the Microsoft backbone with high bandwidth and low latency.

## The idea

By default, resources in different Virtual Networks cannot communicate with each other. **Virtual Network Peering** seamlessly connects two Azure Virtual Networks together.

Once peered, resources in both VNets communicate as if they were in the same network:
- Traffic travels entirely over the Microsoft private backbone network, never traversing the public internet.
- Delivers ultra-low latency, identical to VMs communicating within a single VNet.
- Supports **Global VNet Peering**, allowing VNets in different Azure regions (e.g., East US and West Europe) to peer directly.

Enterprises use VNet Peering to build the **Hub-and-Spoke Topology**:
- **Hub VNet:** The central connectivity and security hub. Contains shared enterprise services: Azure Firewall, VPN/ExpressRoute Gateways, Azure Bastion, and DNS resolvers.
- **Spoke VNets:** Separate application workloads (e.g., `vnet-hr-spoke`, `vnet-payments-spoke`). Each spoke peers with the central Hub VNet.

| Architecture | Setup Complexity | Throughput / Latency | Public Internet Traversal |
|---|---|---|---|
| **VNet Peering** | Single configuration command | **Full wire speed (Zero hop latency)** | **Zero (Private backbone)** |
| **VPN Gateway Transit** | High (Gateways, certificates, tunnels) | Limited by Gateway SKU (10 Gbps max) | Yes (Unless internal) |

> **Watch out:** VNet Peering is **non-transitive**! If Spoke A is peered to Hub, and Spoke B is peered to Hub, **Spoke A cannot communicate directly with Spoke B** unless a Network Virtual Appliance (such as Azure Firewall) routes traffic in the Hub.

## See it

Establish bi-directional VNet peering between a Hub VNet and a Spoke VNet using the Azure CLI:

```bash
# Step 1: Create the Hub VNet and a Spoke VNet
az network vnet create -g rg-learning-portal -n vnet-hub -l eastus --address-prefixes 10.0.0.0/16 -o table
az network vnet create -g rg-learning-portal -n vnet-spoke-app -l eastus --address-prefixes 10.1.0.0/16 -o table

# Step 2: Peer Hub to Spoke
az network vnet peering create   --resource-group rg-learning-portal   --name hub-to-spoke   --vnet-name vnet-hub   --remote-vnet vnet-spoke-app   --allow-vnet-access   --output table

# Step 3: Peer Spoke back to Hub (Peering requires BOTH directions to complete)
az network vnet peering create   --resource-group rg-learning-portal   --name spoke-to-hub   --vnet-name vnet-spoke-app   --remote-vnet vnet-hub   --allow-vnet-access   --output table
```

Both peering connections transition to the `Connected` state, allowing immediate private IP routing between workloads in both networks.

## Go deeper

VNet Peering supports **Gateway Transit**. A spoke network can check `--use-remote-gateways` to route its on-premises corporate traffic through the VPN or ExpressRoute Gateway residing in the central Hub VNet, eliminating the need to pay for duplicate gateways in every individual spoke.

VNet peering is completely non-transitive: if VNet A is peered with VNet B, and VNet B is peered with VNet C, VNet A cannot communicate with VNet C through B directly. To enable transitive routing across spokes, deploy an Azure Firewall or Network Virtual Appliance (NVA) in the central hub.

## Watch out

- VNet Peering requires linking both directions independently; peering A to B leaves the connection in 'Initiated' state until B peers to A.
- You cannot peer two VNets that share overlapping IP address prefixes.

## Remember

- VNet Peering connects virtual networks over the private Microsoft backbone at wire speed.
- Peering is non-transitive; Spoke A cannot reach Spoke B through the Hub without a central router/firewall.
- Hub-and-spoke architectures centralize firewalls, gateways, and DNS in one shared network.
