---
slug: virtual-networks-and-subnet-design
title: "Virtual Networks (VNets) and Subnet Design"
topic: networking-and-connectivity
kind: concept
summary: "Isolate cloud infrastructure in private IP address spaces and segment workloads into dedicated subnets."
tags: [vnet, subnets, ip-addressing, cidr, networking]
related: [network-security-groups-and-security-rules, creating-vnets-and-subnets-with-azure-cli, vnet-peering-hub-and-spoke-architecture]
---
> **In one line:** Virtual Networks isolate cloud assets in private IP blocks, segmented into purpose-built subnets.

## The idea

An **Azure Virtual Network (VNet)** is the foundational building block for private networking in Microsoft Azure. A VNet enables Azure resources (such as Virtual Machines, App Service plans, and AKS clusters) to securely communicate with each other, the internet, and on-premises enterprise networks.

When provisioning a VNet, you define one or more **Classless Inter-Domain Routing (CIDR)** private address prefixes (e.g., `10.0.0.0/16`, providing 65,536 private IP addresses).

You then segment this large address space into smaller **Subnets** to enforce security and workload isolation:
- **Web / Frontend Subnet (`10.0.1.0/24`):** Hosts public-facing Application Gateways or web servers.
- **Backend / API Subnet (`10.0.2.0/24`):** Hosts middle-tier application microservices.
- **Database Subnet (`10.0.3.0/24`):** Completely isolated from the internet, hosting database instances.
- **Dedicated Service Subnets:** Certain Azure services mandate a dedicated subnet with a specific reserved name (e.g., `AzureBastionSubnet` for Bastion, `GatewaySubnet` for VPN/ExpressRoute gateways).

| Subnet Design Rule | Explanation |
|---|---|
| **5 Reserved IPs** | Azure reserves **5 IP addresses in every subnet** (Network address, 3 Azure gateway/DNS addresses, Broadcast). A `/24` subnet has 251 usable IPs, not 256. |
| **No Overlapping CIDR** | Never create VNets with overlapping IP spaces if they will ever be peered or connected to on-premises networks. |
| **Regional Boundary** | A VNet is strictly bounded to a single Azure region, but spans all Availability Zones within that region. |

> **Note:** IP addresses within a VNet belong to standard RFC 1918 private address ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`). Resources communicating within a VNet never expose traffic to the public internet.

## See it

Inspect the subnet allocations and reserved IP addresses within a Virtual Network using the Azure CLI:

```bash
# Create a virtual network with a 10.0.0.0/16 address space
az network vnet create   --resource-group rg-learning-portal   --name vnet-corp-eastus   --address-prefixes 10.0.0.0/16   --location eastus   --output table

# Create a frontend subnet within the virtual network
az network vnet subnet create   --resource-group rg-learning-portal   --vnet-name vnet-corp-eastus   --name snet-web-frontend   --address-prefixes 10.0.1.0/24   --output table

# Query the subnet address prefixes and provisioning state
az network vnet subnet show   --resource-group rg-learning-portal   --vnet-name vnet-corp-eastus   --name snet-web-frontend   --query "{Subnet:name, CIDR:addressPrefix, State:provisioningState}" -o json
```

The output confirms that the subnet has been created within the parent VNet, ready to host network interfaces and application workloads.

## Go deeper

Azure provides default system routing out of the box. Every subnet can automatically communicate with all other subnets in the same VNet without configuring a router. To override this default behavior (e.g., forcing all inter-subnet traffic through a centralized firewall appliance), you deploy custom **User Defined Routes (UDRs)** in a **Route Table**.

## Watch out

- Failing to account for Azure's 5 reserved IP addresses in small subnets (like `/29` providing only 3 usable IPs) causes IP exhaustion.
- Using overlapping CIDR blocks prevents configuring VNet Peering or VPN connections later without rebuilding networks.

## Remember

- A Virtual Network provides private, isolated IP address spaces bounded to a single Azure region.
- Azure reserves exactly 5 IP addresses in every subnet for network routing, DNS, and broadcast.
- Always design non-overlapping CIDR address spaces to support future VNet peering and hybrid growth.
