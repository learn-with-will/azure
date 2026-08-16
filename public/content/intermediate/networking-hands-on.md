---
id: lesson-15
slug: networking-hands-on
title: "Networking Hands-On"
level: intermediate
order: 15
duration: 20
tags:
  - virtual-network
  - subnets
  - peering
  - private-endpoint
  - nsg
summary: "Build a network from the ground up — a virtual network with subnets, a network security group, a VM placed inside it, connecting networks with VNet peering, and reaching PaaS services privately with private endpoints instead of over the public internet."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Build a **VNet** with **subnets** and attach a **network security group**.
- Place a **VM** into a specific subnet.
- Connect two networks with **VNet peering**.
- Reach a PaaS service privately with a **private endpoint**.

# Why It Matters

Lesson 7 mapped the networking building blocks; here you assemble them. Real workloads need private,
segmented networks where front ends are reachable and back ends are locked down. Two techniques —
**peering** (join networks) and **private endpoints** (reach PaaS services privately) — show up in
almost every production design.

# Concept Explanation

### Building a VNet with subnets

You define a VNet with an **address space** (a private IP range) and carve it into **subnets**:

```bash
az group create --name net-lab-rg --location eastus

az network vnet create \
  --resource-group net-lab-rg --name app-vnet \
  --address-prefix 10.10.0.0/16 \
  --subnet-name web --subnet-prefix 10.10.1.0/24

# Add a second subnet for data
az network vnet subnet create \
  --resource-group net-lab-rg --vnet-name app-vnet \
  --name data --address-prefix 10.10.2.0/24
```

Segmenting by role (web, data) lets you apply different security rules to each tier.

### Securing subnets with an NSG

Attach a **network security group** to a subnet to filter traffic. Here, allow only HTTPS into `web`:

```bash
az network nsg create --resource-group net-lab-rg --name web-nsg

az network nsg rule create \
  --resource-group net-lab-rg --nsg-name web-nsg --name Allow-HTTPS \
  --priority 100 --direction Inbound --access Allow \
  --protocol Tcp --destination-port-ranges 443

az network vnet subnet update \
  --resource-group net-lab-rg --vnet-name app-vnet --name web \
  --network-security-group web-nsg
```

### Placing a VM in a subnet

When you create a VM, point it at the VNet/subnet so it gets a private IP there:

```bash
az vm create \
  --resource-group net-lab-rg --name web-vm \
  --image Ubuntu2204 --size Standard_B1s \
  --vnet-name app-vnet --subnet web \
  --admin-username azureuser --generate-ssh-keys
```

### Connecting networks: VNet peering

**VNet peering** links two virtual networks so resources communicate over Azure's backbone using
**private IPs** — as if on one network. Peering works within or across regions. A key rule: peering is
**not transitive** — if A peers with B and B peers with C, A and C are **not** automatically connected.

### Reaching PaaS privately: private endpoints

Many PaaS services (storage, Azure SQL, Key Vault) have **public endpoints** by default. A **private
endpoint** gives the service a **private IP inside your VNet** (via **Azure Private Link**), so your
apps reach it **without traversing the public internet**. You can then disable public access to the
service entirely. This is the modern way to keep PaaS traffic private. (An older mechanism, **service
endpoints**, extends your VNet's identity to a service but doesn't give it a private IP; private
endpoints are generally preferred.)

# Key Terminology

- **Address space** — the private IP range a VNet owns (e.g., `10.10.0.0/16`).
- **Subnet** — a subdivision of the VNet's address space.
- **NSG** — allow/deny traffic rules attached to a subnet or NIC.
- **VNet peering** — private connectivity between two VNets (non-transitive).
- **Private endpoint** — a private IP in your VNet for a PaaS service (via Private Link).
- **Service endpoint** — older method to secure a service to a VNet (no private IP).

# Options and Trade-offs

| Goal | Option A | Option B | How to choose |
| ---- | -------- | -------- | ------------- |
| Connect two VNets | **Peering** | **VPN Gateway** | Peering for private, high-speed Azure-to-Azure links; gateways for on-premises or transit scenarios. |
| Private PaaS access | **Private endpoint** | **Service endpoint** | Private endpoint (private IP, disable public access) is preferred; service endpoints are simpler but less isolated. |
| Segmentation | **One subnet** | **Per-tier subnets + NSGs** | Per-tier subnets with NSGs give defense-in-depth; a single subnet is simpler but coarser. |

# Worked Example

Peer two VNets so their resources can talk privately:

```bash
# Assume app-vnet and svc-vnet exist in the same resource group
az network vnet peering create \
  --resource-group net-lab-rg --vnet-name app-vnet \
  --name app-to-svc --remote-vnet svc-vnet --allow-vnet-access

az network vnet peering create \
  --resource-group net-lab-rg --vnet-name svc-vnet \
  --name svc-to-app --remote-vnet app-vnet --allow-vnet-access
```

Peering must be created **on both sides** (as shown) before traffic flows.

# Real World Analogy

Building a VNet is like designing an **office floor plan**. **Subnets** are **departments** (each with
its own door rules — the NSG). **Peering** is building a **private skybridge** to the office next door
so staff walk over directly instead of going out to the street. A **private endpoint** is installing a
**direct internal phone line** to a supplier, so you never have to call them on the public phone network.

# Examples

## Example 1 — Basic: web-tier lockdown

A team puts VMs in a `web` subnet that allows only HTTPS inbound and a database in a `data` subnet with
no inbound from the internet — only from `web`.

**Why this works:** per-tier subnets plus NSGs contain exposure to just what's needed.

## Example 2 — Real-world: private storage access

An app connects to its storage account through a **private endpoint** and the storage account's public
access is **disabled**, so data never traverses the public internet.

**Why this works:** Private Link keeps PaaS traffic on the Azure backbone and off the internet.

## Example 3 — Pitfall: expecting transitive peering

An engineer peers A↔B and B↔C and assumes A can reach C. It can't.

**Why this bites:** peering is **not transitive**. Connect A↔C directly, or use a hub-and-spoke design
with routing.

# Common Mistakes

- **Overlapping address spaces.** Peered VNets must not have overlapping IP ranges.
- **Peering on one side only.** Create the peering on **both** VNets.
- **Assuming peering is transitive.** It isn't — plan hub-and-spoke or direct links.
- **Leaving PaaS public when it should be private.** Use private endpoints and disable public access.

# Best Practices

- Plan **non-overlapping** address spaces before you build (peering needs it).
- Segment by tier with **subnets + NSGs**; keep back ends off the public internet.
- Use **private endpoints** for PaaS access and disable public network access where possible.
- For many VNets, adopt a **hub-and-spoke** topology instead of meshing peerings.

# Summary

- Build a **VNet** with an address space, carve **subnets**, and secure them with **NSGs**.
- Place VMs into specific subnets for private IPs and per-tier rules.
- **VNet peering** privately connects two VNets but is **non-transitive**.
- **Private endpoints** give PaaS services a private IP in your VNet, keeping traffic off the internet.

# Flash Cards

Q: What do you define when creating a VNet, and how do you subdivide it?
A: You define an address space (a private IP range like 10.10.0.0/16) and divide it into subnets (smaller ranges) that group resources by role, each securable with an NSG.

Q: What is VNet peering, and what important limitation does it have?
A: Peering privately connects two VNets so resources communicate over the Azure backbone using private IPs. It is non-transitive — peering A↔B and B↔C does not connect A and C.

Q: What is a private endpoint?
A: A network interface with a private IP inside your VNet that connects privately (via Azure Private Link) to a PaaS service, so traffic avoids the public internet. You can then disable the service's public access.

Q: How does a private endpoint differ from a service endpoint?
A: A private endpoint gives the service a private IP in your VNet (via Private Link) and is generally preferred; a service endpoint extends your VNet's identity to the service over the Azure backbone but doesn't provide a private IP.

Q: Why must peered VNets have non-overlapping address spaces?
A: Because peering makes them route to each other by private IP; overlapping ranges would make addresses ambiguous, so the ranges must not overlap.

Q: What must you do to make VNet peering actually work?
A: Create the peering on both VNets (both directions) and ensure non-overlapping address spaces; then resources can communicate over private IPs.

# Exercises

### Easy
Create a VNet with `web` and `data` subnets and attach an NSG to `web` that allows only inbound HTTPS.

### Medium
Deploy a VM into the `web` subnet, then create a second VNet and peer the two (both directions). Verify
the peering status shows "Connected."

### Challenging
Design private connectivity for an app that uses Azure Storage and Azure SQL and must not expose either
to the public internet. Describe the private endpoints, DNS considerations, and how you'd disable public
access.

# Further Reading

- Microsoft Learn — *Virtual network overview*: <https://learn.microsoft.com/azure/virtual-network/virtual-networks-overview>
- Microsoft Learn — *Virtual network peering*: <https://learn.microsoft.com/azure/virtual-network/virtual-network-peering-overview>
- Microsoft Learn — *What is a private endpoint?*: <https://learn.microsoft.com/azure/private-link/private-endpoint-overview>
- Microsoft Learn — *What is Azure Private Link?*: <https://learn.microsoft.com/azure/private-link/private-link-overview>
