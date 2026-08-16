---
id: lesson-07
slug: core-networking-overview
title: "Core Networking Overview"
level: beginner
order: 7
duration: 18
tags:
  - networking
  - virtual-network
  - nsg
  - load-balancing
  - connectivity
summary: "The building blocks of networking in Azure — virtual networks and subnets, network security groups for traffic rules, ways to connect to on-premises (VPN and ExpressRoute), the load-balancing options (Load Balancer, Application Gateway, Front Door, Traffic Manager), and Azure DNS."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a **virtual network (VNet)** and a **subnet** are.
- Use **network security groups (NSGs)** to allow or deny traffic.
- Compare **VPN Gateway** and **ExpressRoute** for connecting to on-premises.
- Pick a **load-balancing** service for a scenario, and say what **Azure DNS** does.

# Why It Matters

Networking is how your resources **talk to each other, to the internet, and to your on-premises world**
— safely. Even simple apps need a network: a place for VMs to live, rules for what traffic is allowed,
and a way to distribute requests. Get the basics and you can reason about security and reliability for
everything you deploy.

# Concept Explanation

### Virtual networks and subnets

A **virtual network (VNet)** is your own **private, isolated network** in an Azure region. Resources
like VMs get private IP addresses inside it and can communicate. You divide a VNet into **subnets** —
smaller ranges that group resources (for example, a `web` subnet and a `data` subnet), which helps you
apply security and organization. A VNet lives in **one region**, but VNets can be connected with
**peering**.

### Network security groups (NSGs)

A **network security group (NSG)** is a set of **allow/deny rules** that filter network traffic by
**source/destination IP, port, and protocol**. You attach an NSG to a **subnet** or a VM's network
interface. For example: allow inbound HTTPS (port 443) to the web subnet, deny everything else. NSGs are
your first, always-on layer of network security.

### Public vs private addresses

A **private IP** lets resources talk **inside** the VNet; a **public IP** exposes a resource to the
**internet**. Many back-end resources should have **no public IP at all** and be reached only through a
front end — a key security habit.

### Connecting to on-premises

To join your Azure network with an on-premises datacenter:

- **VPN Gateway** — an **encrypted tunnel over the public internet**. Cheaper and quick to set up; speed
  depends on the internet.
- **ExpressRoute** — a **private, dedicated connection** (through a connectivity provider) that **does
  not** traverse the public internet. More reliable, higher throughput, better for critical or
  high-volume links; costs more.

### Load balancing: spreading traffic

When you have multiple back ends, a **load balancer** distributes requests across them for scale and
resilience. Azure offers several, by scope and layer:

- **Azure Load Balancer** — **regional**, layer 4 (TCP/UDP). Fast, protocol-level distribution.
- **Application Gateway** — **regional**, layer 7 (HTTP/HTTPS), with URL-based routing and an optional
  **Web Application Firewall (WAF)**.
- **Azure Front Door** — **global**, layer 7, with CDN-style acceleration and WAF — routes users to the
  nearest healthy back end worldwide.
- **Traffic Manager** — **DNS-based** global routing that directs clients to an endpoint by policy
  (e.g., closest region).

```text
Global HTTP app  → Front Door (global L7 + WAF/CDN)
Regional web app → Application Gateway (L7, path routing, WAF)
Regional TCP/UDP → Azure Load Balancer (L4)
DNS-level routing→ Traffic Manager
```

### Azure DNS

**Azure DNS** hosts your **DNS domains** in Azure, translating names like `www.contoso.com` into IP
addresses using Azure's global name servers — so you can manage records alongside your other resources.

# Key Terminology

- **Virtual network (VNet)** — a private, isolated network in a region.
- **Subnet** — a subdivision of a VNet grouping related resources.
- **Network security group (NSG)** — allow/deny rules filtering traffic by IP/port/protocol.
- **Public / private IP** — internet-reachable vs VNet-internal addressing.
- **VPN Gateway / ExpressRoute** — encrypted internet tunnel vs private dedicated link to on-premises.
- **Load balancer** — distributes traffic across back ends (L4 vs L7, regional vs global).
- **Azure DNS** — hosts DNS domains and resolves names to addresses.

# Options and Trade-offs

| Need | Option A | Option B | How to choose |
| ---- | -------- | -------- | ------------- |
| On-premises link | **VPN Gateway** (over internet) | **ExpressRoute** (private) | VPN for quick/low-cost; ExpressRoute for reliability, throughput, and keeping off the public internet. |
| HTTP load balancing | **Application Gateway** (regional) | **Front Door** (global) | Front Door for worldwide users/CDN; Application Gateway for a single region with path routing + WAF. |
| Non-HTTP load balancing | **Azure Load Balancer** (L4) | Application Gateway (L7) | Load Balancer for TCP/UDP; Application Gateway when you need HTTP-aware routing. |

# Worked Example

Create a VNet with a subnet and an NSG that allows only HTTPS inbound:

```bash
# 1. Create a VNet with an initial subnet
az network vnet create \
  --resource-group net-rg --name app-vnet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name web --subnet-prefix 10.0.1.0/24

# 2. Create a network security group
az network nsg create --resource-group net-rg --name web-nsg

# 3. Allow inbound HTTPS (443); other inbound stays denied by default rules
az network nsg rule create \
  --resource-group net-rg --nsg-name web-nsg --name Allow-HTTPS \
  --priority 100 --direction Inbound --access Allow \
  --protocol Tcp --destination-port-ranges 443
```

The VNet gives resources a private home; the NSG controls what traffic reaches them.

# Real World Analogy

A **VNet** is a **private office building**; **subnets** are its **floors**. An **NSG** is the **security
desk** deciding who may enter which floor. A **VPN Gateway** is a **secure courier** carrying messages
between buildings over public roads; **ExpressRoute** is a **private underground tunnel** between them. A
**load balancer** is the **receptionist** sending each visitor to an available staff member.

# Examples

## Example 1 — Basic: isolate a database

A web app's VMs sit in a `web` subnet with a public entry point, while the database VM sits in a `data`
subnet with **no public IP**, reachable only from the web subnet.

**Why this works:** keeping the database private shrinks its exposure to the internet.

## Example 2 — Real-world: global app with a firewall

A retailer serves customers worldwide and puts **Azure Front Door** in front of regional back ends,
gaining global routing to the nearest healthy region, CDN acceleration, and a **WAF** to block common
attacks.

**Why this works:** Front Door is built for global, HTTP-facing apps that need performance and
protection.

## Example 3 — Pitfall: opening everything

To "make it work," someone adds an NSG rule allowing all inbound traffic from anywhere. The app runs —
and so does every attacker's scanner.

**Why this bites:** overly broad rules defeat the NSG's purpose. Allow only the specific ports and
sources you need.

# Common Mistakes

- **Giving back ends public IPs.** Keep databases and internal services private.
- **Writing an allow-all NSG rule.** Be specific about ports and sources.
- **Confusing L4 and L7 load balancing.** Use Application Gateway/Front Door for HTTP-aware routing;
  Load Balancer for raw TCP/UDP.
- **Choosing a VNet region carelessly.** A VNet is regional; plan where your resources live.

# Best Practices

- Segment a VNet into **subnets** by role (web, app, data) and protect each with an **NSG**.
- Expose only a **front end** publicly; keep everything else on **private IPs**.
- Use **Front Door/Application Gateway with a WAF** for internet-facing HTTP apps.
- Prefer **ExpressRoute** for critical or high-volume on-premises connectivity.

# Summary

- A **VNet** is your private network in a region, split into **subnets**; **NSGs** allow/deny traffic by
  IP/port/protocol.
- Connect to on-premises with a **VPN Gateway** (over the internet) or **ExpressRoute** (private,
  dedicated).
- Load-balance with **Azure Load Balancer** (L4), **Application Gateway** (regional L7 + WAF), **Front
  Door** (global L7 + CDN/WAF), or **Traffic Manager** (DNS routing).
- **Azure DNS** hosts your domains alongside your resources.

# Flash Cards

Q: What is an Azure virtual network (VNet)?
A: Your own private, isolated network in an Azure region, where resources get private IP addresses and communicate. It's divided into subnets and is scoped to one region.

Q: What does a network security group (NSG) do?
A: It filters network traffic with allow/deny rules based on source/destination IP, port, and protocol, attached to a subnet or a network interface.

Q: How do VPN Gateway and ExpressRoute differ?
A: VPN Gateway creates an encrypted tunnel over the public internet; ExpressRoute is a private, dedicated connection through a provider that doesn't use the public internet — more reliable and higher throughput.

Q: When would you use Azure Front Door versus Application Gateway?
A: Front Door for global, internet-facing HTTP apps (routes to the nearest healthy region, with CDN and WAF); Application Gateway for regional layer-7 load balancing with path-based routing and an optional WAF.

Q: What is the difference between a public and a private IP address in a VNet?
A: A private IP is reachable only within the VNet; a public IP exposes a resource to the internet. Back-end resources should usually have no public IP.

Q: What does Azure DNS provide?
A: Hosting for your DNS domains in Azure, resolving names (like www.contoso.com) to IP addresses using Azure's global name servers.

# Exercises

### Easy
Explain, in one sentence each, what a VNet, a subnet, and an NSG are.

### Medium
Create a VNet with two subnets (`web` and `data`), attach an NSG to `web` that allows only inbound
HTTPS, and describe how you'd keep the `data` subnet private.

### Challenging
Design the networking for a global e-commerce site: which load-balancing service(s) would you use and
why, how would you protect it, and how would you connect to an on-premises inventory system?

# Further Reading

- Microsoft Learn — *Azure Virtual Network overview*: <https://learn.microsoft.com/azure/virtual-network/virtual-networks-overview>
- Microsoft Learn — *Network security groups*: <https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview>
- Microsoft Learn — *Load-balancing options*: <https://learn.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview>
- Microsoft Learn — *VPN Gateway vs ExpressRoute*: <https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways>
