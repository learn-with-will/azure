---
slug: network-security-groups-and-security-rules
title: "Network Security Groups (NSGs) and Security Rules"
topic: networking-and-connectivity
kind: technique
summary: "Filter inbound and outbound network traffic using 5-tuple priority-ranked security rules."
tags: [nsg, security-rules, firewall, priority, networking]
related: [virtual-networks-and-subnet-design, nsg-troubleshooting-and-effective-security-rules, connecting-via-ssh-and-bastion]
---
> **In one line:** Network Security Groups filter traffic at the subnet and NIC levels using priority-ordered 5-tuple rules.

## The idea

A **Network Security Group (NSG)** acts as a stateful, virtual distributed firewall that controls inbound and outbound network traffic flowing to Azure resources.

An NSG can be associated at two distinct scopes:
1. **Subnet Scope:** Protects all resources located within that subnet (recommended best practice).
2. **Network Interface (NIC) Scope:** Protects an individual virtual machine.

NSGs evaluate traffic using a **5-tuple**: Source IP, Source Port, Destination IP, Destination Port, and Protocol (TCP/UDP/ICMP).

Rules are evaluated in **Priority Order** (from lowest number 100 to highest number 4096). The first rule that matches the traffic is immediately applied, and subsequent rules are ignored.

Every NSG includes immutable **Default Rules** with priority 65000 and higher:
- `AllowVnetInBound` (Priority 65000): Permits all internal traffic between subnets in the VNet.
- `AllowAzureLoadBalancerInBound` (Priority 65001): Permits Azure health probes.
- `DenyAllInBound` (Priority 65500): Blocks all other inbound traffic from the outside world.

| Rule Attribute | Example Setting | Purpose |
|---|---|---|
| **Priority** | `100` to `4096` | Processing order (Lower numbers evaluated first) |
| **Source** | `198.51.100.0/24` or Service Tag | Originating network location |
| **Port Range** | `80`, `443`, or `*` | Target destination TCP/UDP port |
| **Action** | `Allow` or `Deny` | Traffic permission decision |

> **Tip:** Use **Service Tags** (such as `Internet`, `VirtualNetwork`, `AzureLoadBalancer`, or `Sql`) in NSG rules. Service Tags represent Microsoft-managed IP address ranges, eliminating the need to manually track shifting cloud IP addresses.

## See it

Create an NSG and add a high-priority rule allowing inbound HTTPS traffic using the Azure CLI:

```bash
# Create a Network Security Group in East US
az network nsg create   --resource-group rg-learning-portal   --name nsg-web-frontend   --location eastus   --output table

# Add an inbound security rule permitting HTTPS port 443 with priority 120
az network nsg rule create   --resource-group rg-learning-portal   --nsg-name nsg-web-frontend   --name "AllowHTTPSInbound"   --priority 120   --source-address-prefixes Internet   --destination-port-ranges 443   --protocol Tcp   --access Allow   --direction Inbound   --output table
```

Traffic arriving on port 443 matches rule 120 and is permitted into the subnet before reaching the default `DenyAllInBound` rule (65500).

## Go deeper

NSGs are **stateful**. If an inbound packet is permitted through an NSG rule, the corresponding outbound response packet is automatically permitted, even if an outbound deny rule exists. The reverse is also true: outbound requests automatically permit matching incoming reply packets.

Network Security Groups support **Application Security Groups (ASGs)**. ASGs allow you to group virtual machine network interfaces logically (such as `WebServers` or `DbServers`) and reference the group in NSG rules, eliminating the need to maintain fragile, constantly changing lists of static IP addresses.

## Watch out

- Associating conflicting NSGs at both the subnet level and the NIC level causes confusing traffic blocks; standardizing on subnet NSGs is recommended.
- Rules with priority 65000 and above are platform defaults and cannot be deleted or modified; you must override them with lower-numbered rules.

## Remember

- NSGs filter traffic at the subnet and NIC levels using priority-ranked 5-tuple rules (100–4096).
- Evaluation stops at the first rule that matches incoming or outgoing network packets.
- Use Service Tags (e.g. `Internet`, `AzureLoadBalancer`) to manage dynamic Microsoft IP ranges safely.
