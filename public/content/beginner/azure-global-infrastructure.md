---
id: lesson-03
slug: azure-global-infrastructure
title: "Azure Global Infrastructure"
level: beginner
order: 3
duration: 17
tags:
  - regions
  - availability-zones
  - region-pairs
  - geography
  - resilience
summary: "How Azure is laid out across the planet — datacenters grouped into regions, availability zones for in-region resilience, region pairs and geographies for disaster recovery and data residency, and the practical factors that decide which region you pick."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Define a **region**, an **availability zone**, a **region pair**, and a **geography**.
- Explain how availability zones protect against **datacenter-level** failures.
- Explain how region pairs and geographies support **disaster recovery** and **data residency**.
- Recognize **sovereign clouds** as separate, isolated Azure environments.
- Choose a region using **latency, service availability, price, and compliance**.

# Why It Matters

Where your resources physically run affects **speed** (how close you are to users), **resilience** (how
failures are contained), **cost** (prices vary by region), and **compliance** (where your data legally
lives). These are decisions you make almost every time you create something in Azure, so it pays to
understand the map.

# Concept Explanation

### Datacenters, regions, and geographies

Azure runs in physical buildings full of servers called **datacenters**. You don't pick individual
datacenters; you pick a **region**.

- **Region** — a set of datacenters within a latency-defined area, joined by a fast, dedicated regional
  network. Examples of region names: *East US*, *West Europe*, *Southeast Asia*.
- **Geography** — a larger market (often a country or area) that contains one or more regions and
  preserves **data-residency and compliance** boundaries. Data in a geography generally stays in that
  geography.

### Availability zones: surviving a datacenter failure

An **availability zone (AZ)** is a **physically separate** location *within* a region, with its own
**independent power, cooling, and networking**. Regions that support zones have at least three of them.
If one zone has an outage (power, flood, fire), the others keep running.

You use zones by choosing **zone-redundant** options: for example, spreading virtual machines across
zones or picking zone-redundant storage. The payoff is staying up even if an entire datacenter goes
down. Not every region has availability zones — check before you rely on them.

```text
Region "East US"
 ├─ Availability Zone 1  (independent power/cooling/network)
 ├─ Availability Zone 2  (independent power/cooling/network)
 └─ Availability Zone 3  (independent power/cooling/network)
Spread your app across zones → one zone can fail and you stay online.
```

### Region pairs: surviving a regional disaster

Many regions are grouped into a **region pair** — two regions within the same geography, usually
hundreds of miles apart. Some Azure services can **replicate** across the pair for **disaster
recovery**, and Microsoft rolls out certain platform updates to one region of a pair at a time to
reduce risk. Note that Microsoft also now offers some regions **without** a pair (using availability
zones for resilience instead), so don't assume every region is paired — check the docs.

### Sovereign (specialized) clouds

Beyond global "public" Azure, there are **isolated, sovereign clouds** for special requirements — for
example **Azure Government** (for US government) and **Azure operated by 21Vianet** (in China). These
are physically and logically separate instances of Azure with their own compliance boundaries. Most
learners use global Azure.

### Choosing a region

Four practical factors:

1. **Latency / proximity** — pick a region near your users for a faster experience.
2. **Service availability** — not every service or VM size exists in every region; confirm what you
   need is offered there.
3. **Price** — the same service can cost different amounts in different regions.
4. **Compliance / data residency** — some data must legally remain in a certain country or geography.

# Key Terminology

- **Datacenter** — a physical building of servers (you don't select these directly).
- **Region** — a set of nearby datacenters you deploy into (e.g., *West Europe*).
- **Availability zone (AZ)** — a physically separate location within a region, independently powered.
- **Zone-redundant** — spread across zones so one zone failing doesn't take you down.
- **Region pair** — two regions in a geography used by some services for DR.
- **Geography** — a compliance/residency boundary containing one or more regions.
- **Sovereign cloud** — an isolated Azure instance (e.g., Azure Government, 21Vianet China).

# Options and Trade-offs

| Goal | Option A | Option B | How to choose |
| ---- | -------- | -------- | ------------- |
| In-region resilience | **Single zone** (simplest) | **Zone-redundant** (spread across AZs) | Zone-redundant for production uptime; single zone for cheap, non-critical workloads. |
| Disaster recovery | Rely on **availability zones** | Replicate to the **paired region** | Zones handle datacenter failures; region replication handles losing a whole region. |
| Region choice | **Closest** region | **Cheapest** or **compliant** region | Balance latency vs price vs where data must legally reside. |

# Worked Example

List the regions available to you, then create a resource group in a chosen region:

```bash
# See which regions you can use
az account list-locations --output table

# Create a resource group in West Europe (metadata stored in that region)
az group create --name eu-rg --location westeurope
```

A resource group has a location for its **metadata**, but it can contain resources from other regions —
handy when a workload spans regions.

# Real World Analogy

Think of a **region** as a **city** and its **availability zones** as separate **power grids** in
different parts of that city. If one neighborhood's grid fails, businesses on the other grids keep the
lights on. A **region pair** is like having a **sister city** far enough away that the same storm won't
hit both — so if the whole first city goes dark, operations move there.

# Examples

## Example 1 — Basic: pick a region for your users

An app serving customers in Germany deploys to a **European** region for low latency and to keep data
in-geography, rather than a distant region across the ocean.

**Why this works:** proximity improves speed, and staying in-geography helps meet data-residency rules.

## Example 2 — Real-world: zone-redundant for uptime

A payment service must stay online during a datacenter outage, so it runs across **three availability
zones** in its region. When one zone loses power, the other two keep serving traffic.

**Why this works:** zones are independent, so a single-datacenter failure doesn't take the whole
service down.

## Example 3 — Pitfall: assuming a service exists everywhere

A team designs around a specific VM size or a newer service, then picks a region where it isn't offered
yet — and deployment fails.

**Why this bites:** service and hardware availability **varies by region**. Always confirm availability
in your target region before committing.

# Common Mistakes

- **Confusing zones with regions.** Zones protect against a *datacenter* failure inside one region;
  region pairs protect against losing a *whole region*.
- **Assuming every region has availability zones or a pair.** Some don't — verify.
- **Ignoring price differences.** The same resource can cost more in one region than another.
- **Overlooking data residency.** Where data lives can be a legal requirement, not just a preference.

# Best Practices

- Deploy **close to your users** unless compliance or cost says otherwise.
- Use **availability zones** for production workloads that need to survive a datacenter outage.
- Plan **disaster recovery** across regions for anything that can't tolerate losing an entire region.
- Confirm **service, size, and price** in the target region *before* you build.

# Summary

- Azure is organized as **datacenters → regions → geographies**, with **availability zones** inside
  many regions.
- **Availability zones** give in-region resilience; **region pairs** and geographies support
  **disaster recovery** and **data residency**.
- **Sovereign clouds** (e.g., Azure Government, 21Vianet China) are isolated Azure instances.
- Choose a region by weighing **latency, service availability, price, and compliance**.

# Flash Cards

Q: What is an Azure region?
A: A set of datacenters deployed within a latency-defined area and connected by a dedicated regional network — the unit you deploy into (for example, East US).

Q: What is an availability zone and what does it protect against?
A: A physically separate location within a region with independent power, cooling, and networking. Spreading across zones protects against a single-datacenter (zone-level) failure.

Q: What is a region pair used for?
A: Two regions in the same geography that some services use to replicate for disaster recovery; Microsoft also staggers some platform updates across the pair. (Not every region has a pair.)

Q: What does a "geography" boundary preserve?
A: Data-residency and compliance boundaries — data in a geography generally stays within it. A geography contains one or more regions.

Q: Name two Azure sovereign (specialized) clouds.
A: Azure Government (US government) and Azure operated by 21Vianet (China) — isolated instances separate from global Azure.

Q: What four factors should guide choosing a region?
A: Latency/proximity to users, service and hardware availability in that region, price, and compliance/data-residency requirements.

# Exercises

### Easy
In one sentence each, explain the difference between a region, an availability zone, and a region pair.

### Medium
Run `az account list-locations --output table` and pick the two closest regions to you. Note whether
each supports availability zones (check the docs) and why that might matter for a production app.

### Challenging
Open the Azure "regions and availability zones" documentation. For a region near you, find its paired
region (if any) and explain how you would use zones *and* the pair together to survive both a
datacenter outage and a full regional outage.

# Further Reading

- Microsoft Learn — *Azure regions, availability zones, and region pairs*: <https://learn.microsoft.com/azure/reliability/availability-zones-overview>
- Microsoft Learn — *What are Azure regions?*: <https://learn.microsoft.com/azure/reliability/regions-overview>
- Azure — *Global infrastructure*: <https://azure.microsoft.com/explore/global-infrastructure/>
- Microsoft Learn — *Azure sovereign/national clouds*: <https://learn.microsoft.com/azure/security/fundamentals/national-clouds>
