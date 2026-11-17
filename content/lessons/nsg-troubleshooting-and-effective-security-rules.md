---
slug: nsg-troubleshooting-and-effective-security-rules
title: "NSG Rule Precedence and Troubleshooting"
topic: networking-and-connectivity
kind: pitfall
summary: "Debug blocked connections using Effective Security Rules and understand default NSG rule evaluation."
tags: [nsg, troubleshooting, effective-rules, priority, pitfall]
related: [network-security-groups-and-security-rules, creating-vnets-and-subnets-with-azure-cli, connecting-via-ssh-and-bastion]
---
> **In one line:** Troubleshoot network drops using Effective Security Rules to inspect combined subnet and NIC firewalls.

## The idea

A classic, frustrating operational problem occurs when an administrator deploys a virtual machine or API, configures an NSG rule allowing traffic, and finds that incoming connections are still silently dropped.

Diagnosing connection drops requires understanding **Rule Precedence and Combination**:
When both a **Subnet NSG** and a **NIC NSG** are associated with a VM:
- **Inbound Traffic:** Filtered by the Subnet NSG *first*. If permitted, it is then filtered by the NIC NSG *second*. Both must permit the packet!
- **Outbound Traffic:** Filtered by the NIC NSG *first*. If permitted, it is then filtered by the Subnet NSG *second*.

If an administrator creates an allow rule on the Subnet NSG, but the NIC NSG contains a higher-priority deny rule (or falls through to `DenyAllInBound`), the packet is dropped.

Azure solves this with **Effective Security Rules**. This diagnostic API calculates the combined, consolidated result of all associated NSGs on a specific network interface, displaying exactly which rule is permitting or blocking traffic.

| Evaluation Stage | Inbound Sequence | Outbound Sequence |
|---|---|---|
| **Step 1** | Subnet NSG rules evaluated (Lowest priority number first) | NIC NSG rules evaluated (Lowest priority number first) |
| **Step 2** | Packet must be explicitly permitted by Subnet NSG | Packet must be explicitly permitted by NIC NSG |
| **Step 3** | NIC NSG rules evaluated (Lowest priority number first) | Subnet NSG rules evaluated (Lowest priority number first) |
| **Step 4** | Packet arrives at VM operating system | Packet exits onto VNet routing fabric |

> **Tip:** When debugging connectivity issues, always run `az network nic list-effective-nsg`. It shows you the definitive real-world rule evaluation order rather than guessing across separate NSG resource screens.

## See it

Query the Effective Security Rules applied to a virtual machine's network interface using the Azure CLI:

```bash
# Query the effective security rules actively enforced on a VM network interface
az network nic list-effective-nsg   --resource-group rg-learning-portal   --name vm-web-prodVMNic   --output table

# Verify whether inbound traffic on port 80 is allowed or blocked across all NSGs
az network nic list-effective-nsg   --resource-group rg-learning-portal   --name vm-web-prodVMNic   --query "value[].effectiveSecurityRules[?destinationPortRange=='80'].{Rule:name, Action:access, Priority:priority}"   -o json
```

The output displays the active rule name, priority, and allow/deny action enforced at runtime across all combined network boundaries.

## Go deeper

For deeper network diagnostics, use **Azure Network Watcher IP Flow Verify**. You provide a packet 5-tuple (source IP, destination IP, target port), and Network Watcher instantly tests your NSGs, returning either `Access Allowed` or `Access Denied` along with the exact NSG rule name responsible for the drop.

## Watch out

- Never assume allowing traffic on the Subnet NSG is sufficient if a separate NIC NSG exists on the target VM.
- Local OS software firewalls (such as `ufw` or `iptables` on Linux, or Windows Defender Firewall) can drop packets even if Azure NSGs permit them.

## Remember

- Inbound traffic must pass the Subnet NSG first AND the NIC NSG second.
- Use `az network nic list-effective-nsg` to view the unified, consolidated rule evaluation list.
- Use Network Watcher IP Flow Verify to quickly test whether a specific port and IP is permitted.
