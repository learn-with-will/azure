---
id: lesson-23
slug: reliability-and-scaling
title: "Reliability and Scaling"
level: advanced
order: 23
duration: 20
tags:
  - reliability
  - sla
  - autoscale
  - high-availability
  - disaster-recovery
summary: "Design systems that stay up and keep up — how SLAs and composite SLAs work, availability sets versus availability zones, scaling up versus out with autoscale, and protecting data and continuity with backup and disaster recovery (RTO/RPO)."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **SLAs** and how a **composite SLA** changes with dependencies.
- Distinguish **availability sets** from **availability zones**.
- Apply **scaling** (up vs out) and **autoscale**.
- Describe **backup** and **disaster recovery** and the meaning of **RTO/RPO**.

# Why It Matters

Real systems fail — hardware dies, zones lose power, traffic spikes. **Reliability** is designing so
those events don't take you down, and **scaling** is keeping performance steady as load changes. These
choices determine whether your app shrugs off problems or falls over at the worst moment.

# Concept Explanation

### SLAs and composite SLAs

A **Service Level Agreement (SLA)** is the provider's commitment to a service's **uptime** (for example,
a percentage per month), often with service credits if missed. Key points:

- SLAs are **per service**; some **free tiers have no SLA**.
- When your app **depends on multiple services in series**, their SLAs **multiply** into a lower
  **composite SLA**. Two services each at 99.9% in a chain give roughly 99.9% × 99.9% ≈ **99.8%**.
- **Redundancy** (running components in parallel across zones/regions) can **raise** effective
  availability above a single instance.

Don't memorize specific SLA numbers — look them up per service — but **do** reason about how dependencies
combine.

### Availability sets vs availability zones

Two ways to make VMs resilient:

- **Availability set** — spreads VMs across **fault domains** (separate racks/power) and **update
  domains** (updated at different times) **within a single datacenter**. Protects against **rack-level
  failures and host maintenance**.
- **Availability zone** — spreads VMs across **physically separate datacenters** in a region. Protects
  against a **whole-datacenter outage** (stronger than an availability set).

Use **zones** for higher resilience where available; availability sets protect within one datacenter.

### Scaling: up vs out, and autoscale

- **Scale up (vertical)** — a **bigger** instance (more CPU/RAM). Simple, but limited and usually needs a
  restart.
- **Scale out (horizontal)** — **more** instances behind a load balancer. Better for resilience and
  handling spikes.
- **Autoscale** — rules that add/remove instances automatically based on a **metric** (CPU, queue
  length) or a **schedule**. Combine with **VM Scale Sets**, **App Service**, **Container Apps**, or
  **AKS**.

Prefer **scaling out with autoscale** for elastic, resilient workloads.

### Backup and disaster recovery

Reliability includes surviving data loss and regional disasters:

- **Azure Backup** — scheduled **backups** of VMs, files, and databases, with retention and restore.
- **Azure Site Recovery** — **replicates** workloads to another region and **orchestrates failover** for
  disaster recovery.
- **RPO (Recovery Point Objective)** — how much **data loss** you can tolerate (how far back your last
  good copy is).
- **RTO (Recovery Time Objective)** — how **quickly** you must be back online.

Design backup frequency and DR strategy to meet your target **RPO/RTO** — stricter targets cost more.

# Key Terminology

- **SLA** — the provider's uptime commitment for a service.
- **Composite SLA** — combined availability of dependent services (multiplies down in series).
- **Availability set** — VM spread across fault/update domains in one datacenter.
- **Availability zone** — VM spread across separate datacenters in a region.
- **Scale up / out** — bigger instance vs more instances; **autoscale** automates the latter.
- **Azure Backup / Site Recovery** — data backup / regional failover for DR.
- **RPO / RTO** — tolerable data loss / tolerable downtime.

# Options and Trade-offs

| Goal | Option A | Option B | How to choose |
| ---- | -------- | -------- | ------------- |
| VM resilience | **Availability set** | **Availability zones** | Zones for datacenter-outage protection (stronger); sets to guard against rack failures/maintenance in one datacenter. |
| Handling load | **Scale up** | **Scale out + autoscale** | Scale out for resilience and spikes; scale up for a single heavier instance with a hard limit. |
| Disaster recovery | **Backup only** | **Backup + Site Recovery** | Backup for data recovery; add Site Recovery when you must fail over to another region quickly. |
| Availability target | **Single instance** | **Redundant across zones/regions** | Add redundancy to meet higher SLAs; single instance only for non-critical workloads. |

# Worked Example

Reason about a composite SLA and fix it with redundancy:

```text
App = Web App (depends on) → Database, in series.
If each has ~99.9% monthly SLA, the composite ≈ 99.9% × 99.9% ≈ 99.8%
  → more expected downtime than either alone.

To improve:
- Run the web tier across multiple instances/zones (parallel redundancy).
- Use a zone-redundant or geo-redundant database.
- Add health probes + a load balancer so failures route around bad instances.
```

The lesson: **series dependencies lower** availability; **parallel redundancy raises** it.

# Real World Analogy

Reliability is like planning a **road trip**. An **availability set** is carrying a **spare tire** — you
survive a flat without stopping the trip. **Availability zones** are knowing **alternate routes** so a
closed road (a whole datacenter) doesn't strand you. **Autoscale** is adding **more lanes** automatically
when traffic builds. **Backup and DR** are **insurance and a tow plan**: how much of the trip you'd
redo (**RPO**) and how fast you'd get moving again (**RTO**).

# Examples

## Example 1 — Basic: autoscale a web tier

An app on **App Service** scales out from 2 to 8 instances when CPU passes 70% and back down at night — 
steady performance during spikes, lower cost when quiet.

**Why this works:** horizontal autoscale matches capacity to demand automatically.

## Example 2 — Real-world: survive a regional outage

A critical service replicates to a second region with **Site Recovery** and routes users via **Front
Door**. When the primary region fails, traffic fails over with minimal downtime.

**Why this works:** cross-region redundancy plus global routing meets a strict RTO.

## Example 3 — Pitfall: forgetting the composite SLA

A team advertises "99.99% uptime" but chains several 99.9% services with no redundancy. Real availability
is lower than promised.

**Why this bites:** dependencies **multiply** SLAs downward. You must add redundancy to hit a high
target.

# Common Mistakes

- **Ignoring composite SLAs.** Series dependencies reduce combined availability.
- **Confusing availability sets and zones.** Zones protect against datacenter outages; sets protect
  within one datacenter.
- **Relying only on scale up.** It has a ceiling; scale out for resilience and spikes.
- **No tested DR/backup.** Define RPO/RTO and actually test restores/failover.

# Best Practices

- Add **redundancy** (zones/regions, multiple instances) to meet availability targets.
- Prefer **scale out with autoscale**; use health probes so traffic avoids unhealthy instances.
- Configure **Azure Backup** and, for critical systems, **Site Recovery**; **test** them.
- Set explicit **RPO/RTO** targets and design backup/DR to meet them.

# Summary

- **SLAs** are per service and **multiply** across series dependencies; **redundancy** raises effective
  availability.
- **Availability sets** protect within a datacenter; **availability zones** protect across datacenters.
- **Scale out with autoscale** for elastic, resilient capacity; scale up has limits.
- **Azure Backup** and **Site Recovery** protect data and continuity — design them to your **RPO/RTO**.

# Flash Cards

Q: What is an SLA, and what happens to it when services depend on each other in series?
A: A Service Level Agreement is the provider's uptime commitment for a service. When services depend on each other in series, their SLAs multiply into a lower composite SLA — the combination is less available than either alone.

Q: What's the difference between an availability set and an availability zone?
A: An availability set spreads VMs across fault and update domains within one datacenter (protecting against rack failures and maintenance); an availability zone spreads them across physically separate datacenters in a region (protecting against a whole-datacenter outage).

Q: What's the difference between scaling up and scaling out, and what does autoscale do?
A: Scaling up uses a bigger instance (more CPU/RAM, with a ceiling); scaling out adds more instances behind a load balancer. Autoscale automatically adds/removes instances based on metrics or a schedule.

Q: What do RPO and RTO mean?
A: RPO (Recovery Point Objective) is how much data loss you can tolerate — how far back your last good copy is. RTO (Recovery Time Objective) is how quickly you must be back online after an incident.

Q: What do Azure Backup and Azure Site Recovery do?
A: Azure Backup takes scheduled backups of VMs, files, and databases for restore; Azure Site Recovery replicates workloads to another region and orchestrates failover for disaster recovery.

Q: How can redundancy improve on a single service's availability?
A: Running components in parallel across zones or regions means one failing instance doesn't take the system down, raising effective availability above a single instance — the opposite of series dependencies that lower it.

# Exercises

### Easy
Explain the difference between scaling up and scaling out, and give a scenario where each is appropriate.

### Medium
Configure (or describe) an autoscale rule for an App Service or VM Scale Set: the metric, thresholds, and
min/max instances. Explain how it improves both performance and cost.

### Challenging
For a payment service that can tolerate at most 5 minutes of data loss (RPO) and 15 minutes of downtime
(RTO), design a reliability and DR plan across zones and regions, and explain how you'd verify it meets
those targets.

# Further Reading

- Microsoft Learn — *Reliability in Azure*: <https://learn.microsoft.com/azure/reliability/overview>
- Microsoft Learn — *Availability sets and zones for VMs*: <https://learn.microsoft.com/azure/virtual-machines/availability>
- Microsoft Learn — *Autoscale overview*: <https://learn.microsoft.com/azure/azure-monitor/autoscale/autoscale-overview>
- Microsoft Learn — *Azure Backup and Site Recovery*: <https://learn.microsoft.com/azure/reliability/concept-business-continuity-high-availability-disaster-recovery>
