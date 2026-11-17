---
slug: azure-slas-and-composite-availability
title: "Azure SLAs and Composite Availability Calculations"
topic: governance-reliability-architecture
kind: concept
summary: "Calculate end-to-end composite availability SLAs across multi-tier cloud architectures and design for target uptime."
tags: [sla, availability, reliability, architecture]
related: [vertical-vs-horizontal-autoscale-rules, azure-backup-and-azure-site-recovery, well-architected-framework-five-pillars]
---
> **In one line:** Calculate end-to-end composite availability by multiplying individual service SLAs across serial architectures.

## The idea

Microsoft provides formal **Service Level Agreements (SLAs)** guaranteeing uptime percentages for individual Azure services (e.g., 99.9% for single VMs, 99.95% for App Service, 99.99% for multi-region Cosmos DB). If a service fails to meet its documented SLA, customers become eligible for billing service credits.

However, modern cloud architectures are composed of multiple interdependent services linked together in series. When services depend on each other, their overall system uptime is calculated using **Composite SLA math**.

Calculating Serial Composite SLA:
If a Web App depends strictly on an Azure SQL Database, the entire application is down if *either* component fails:
$$\text{Composite SLA} = \text{SLA}_{\text{Web App}} \times \text{SLA}_{\text{Database}}$$

Example Calculation:
- Azure App Service SLA: **99.95%** (0.9995)
- Azure SQL Database SLA: **99.99%** (0.9999)
- Composite Serial SLA: $0.9995 \times 0.9999 = 0.9994$ (**99.94%**)

Adding Redundant Parallel Fallbacks:
To increase composite availability, design redundant fallback paths in parallel (e.g., secondary failover database or queue buffering):
$$\text{Parallel SLA} = 1 - (1 - \text{SLA}_A) \times (1 - \text{SLA}_B)$$

| Target Availability | Permitted Downtime per Year | Permitted Downtime per Month | Architectural Approach |
|---|---|---|---|
| **99.9% (Three Nines)** | 8.76 hours | 43.8 minutes | Single VM / Standard regional services |
| **99.95% (Three and a Half)**| 4.38 hours | 21.9 minutes | Availability Zones across primary services |
| **99.99% (Four Nines)** | **52.6 minutes** | **4.38 minutes** | Multi-region active-active or active-passive |
| **99.999% (Five Nines)** | **5.26 minutes** | **26.3 seconds** | Mission-critical decoupled distributed systems |

> **Tip:** Serial dependencies always **decrease** total availability. Parallel redundancy always **increases** total availability. Keep critical paths short and decouple auxiliary dependencies using asynchronous queues.

## See it

Inspect how serial dependencies compound downtime across a three-tier architecture:

```text
+---------------------------------------------------------------+
| App Service (99.95%) -> Storage (99.9%) -> SQL Database (99.99%) |
+---------------------------------------------------------------+
Calculation:
0.9995 x 0.9990 x 0.9999 = 0.9984 (99.84% Composite SLA)

Permitted Annual Downtime:
- Single App Service: 4.38 hours/year
- Composite System:   14.02 hours/year (Compounded!)
```

Understanding composite SLA math allows cloud architects to identify single points of failure and justify the investment in secondary regional failover replicas.

## Go deeper

Azure provides the **Azure Status** page and **Azure Service Health**. Service Health delivers personalized notifications about active cloud outages, planned platform maintenance, and health advisories affecting your specific subscription resources, enabling automated incident escalation.

## Watch out

- Azure SLAs represent financial commitments for billing credits; they do not guarantee that outages will never exceed SLA thresholds.
- Free tier services (like Free F1 App Service or basic networking tiers) carry a 0% SLA with zero financial backing.

## Remember

- Serial service dependencies multiply SLAs together, resulting in lower overall composite availability.
- Parallel redundant paths dramatically increase composite availability by eliminating single points of failure.
- Design multi-region architectures with Availability Zones when applications demand Four Nines (99.99%) uptime.
