---
slug: hybrid-connectivity-vpn-and-expressroute
title: "Hybrid Connectivity: Site-to-Site VPN and ExpressRoute"
topic: networking-and-connectivity
kind: concept
summary: "Connect corporate on-premises datacenters to Azure via IPSec VPN tunnels or private dedicated ExpressRoute circuits."
tags: [vpn, expressroute, hybrid, connectivity, networking]
related: [virtual-networks-and-subnet-design, vnet-peering-hub-and-spoke-architecture, cloud-deployment-models]
---
> **In one line:** Connect on-premises datacenters to Azure using encrypted IPSec VPNs or private dedicated ExpressRoute circuits.

## The idea

Enterprise hybrid cloud architectures require reliable, secure network connectivity between on-premises corporate datacenters and Azure Virtual Networks. Azure provides two primary enterprise hybrid connectivity models:

1. **Azure Site-to-Site VPN:** Establishes an encrypted **IPSec / IKE** tunnel between an on-premises VPN appliance and an Azure Virtual Network Gateway (`VpnGw`). Traffic traverses the public internet, but all packets are cryptographically encrypted. Quick to set up, highly cost-effective, and supports bandwidth up to 10 Gbps depending on gateway SKU.
2. **Azure ExpressRoute:** Establishes a **private, dedicated physical circuit** connecting your on-premises datacenter directly to Microsoft infrastructure through a certified connectivity provider (Equinix, AT&T, Verizon). **Traffic does NOT travel over the public internet.** Delivers ultra-low, predictable latency, enterprise-grade reliability (99.95% SLA), and massive bandwidth capabilities up to 100 Gbps.

| Dimension | Site-to-Site VPN Gateway | Azure ExpressRoute |
|---|---|---|
| **Transmission Medium** | Encrypted over the public internet | **Dedicated private fiber circuit** |
| **Setup Timeline** | Minutes to hours | Weeks to months (Telecomm provider provisioning) |
| **Typical Bandwidth** | 100 Mbps to 10 Gbps | **50 Mbps up to 100 Gbps** |
| **Latency Consistency** | Variable (Subject to public internet congestion) | **Ultra-low, deterministic, and predictable** |
| **Cost** | Low (Gateway hourly + egress fees) | High (Monthly port fee + provider circuit charges) |

> **Tip:** Many enterprises deploy **Site-to-Site VPN as an automated backup failover** for their primary ExpressRoute circuit, ensuring network continuity if a physical fiber circuit is severed.

## See it

Create an Azure Virtual Network Gateway configured for Site-to-Site VPN using the Azure CLI:

```bash
# Step 1: Create a public IP address for the VPN Gateway
az network public-ip create   --resource-group rg-learning-portal   --name pip-vpngw-eastus   --sku Standard   --location eastus   --output table

# Step 2: Create a VNet Gateway in the dedicated GatewaySubnet
az network vnet-gateway create   --resource-group rg-learning-portal   --name vpngw-corp-eastus   --public-ip-addresses pip-vpngw-eastus   --vnet vnet-corp-eastus   --gateway-type Vpn   --vpn-type RouteBased   --sku VpnGw2   --output table
```

The gateway exposes a dedicated public IP endpoint to negotiate encrypted IPSec tunnels with on-premises firewall appliances.

## Go deeper

For remote telecommuters and mobile employees needing access to internal Azure resources without an office connection, Azure supports **Point-to-Site (P2S) VPN**. Employees install a VPN client (OpenVPN or Azure VPN Client) authenticated via Microsoft Entra ID with Multi-Factor Authentication (MFA).

For mission-critical enterprise workloads requiring guaranteed uptime, deploy ExpressRoute with a **site-to-site VPN failover**. If the physical private ExpressRoute circuit experiences an unexpected disruption or carrier maintenance, routing automatically fails over to the encrypted IPSec VPN tunnel across the public internet.

## Watch out

- VPN Gateways must always be deployed into a subnet named exactly `GatewaySubnet`; placing VMs in this subnet is prohibited.
- ExpressRoute circuits provide private connectivity, but traffic is unencrypted by default; add MACsec or IPSec if end-to-end encryption is required.

## Remember

- Site-to-Site VPN encrypts traffic over the public internet using standard IPSec tunnels.
- ExpressRoute provides private, dedicated, high-bandwidth connections bypassing the public internet.
- Virtual Network Gateways require a dedicated subnet named exactly `GatewaySubnet`.
