---
id: lesson-24
slug: well-architected-and-capstone
title: "Well-Architected and Capstone"
level: advanced
order: 24
duration: 22
tags:
  - well-architected
  - cloud-adoption-framework
  - architecture
  - capstone
  - best-practices
summary: "Bring it all together — the five pillars of the Azure Well-Architected Framework and where the Cloud Adoption Framework fits, then a capstone that designs a small, real solution end to end using the compute, storage, data, identity, security, and automation services from this course."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Name and apply the **five pillars** of the Azure **Well-Architected Framework**.
- Explain where the **Cloud Adoption Framework** fits.
- Design a **small end-to-end solution** on Azure, justifying each service choice.
- Evaluate a design against the pillars.

# Why It Matters

You've met the core Azure services one at a time. Real work means **combining** them into a solution
that is reliable, secure, cost-effective, well-run, and fast. The **Well-Architected Framework** gives
you a checklist of trade-offs to reason about, and the capstone lets you practice pulling the whole
course together — the skill that actually matters on the job.

# Concept Explanation

### The Azure Well-Architected Framework (WAF)

The **Well-Architected Framework** is Microsoft's set of guiding principles for building good cloud
workloads, organized into **five pillars**. Every design trades these against one another:

1. **Reliability** — the system stays available and recovers from failure (redundancy, zones/regions,
   backup/DR — lesson 23).
2. **Security** — protect data and systems (Zero Trust, identity, encryption, Defender — lessons 8, 22).
3. **Cost Optimization** — get the most value per dollar (right-sizing, reservations, budgets — lesson
   21).
4. **Operational Excellence** — run and improve the system smoothly (monitoring, IaC, CI/CD — lessons
   17, 19, 20).
5. **Performance Efficiency** — use resources effectively and scale to demand (autoscale, right service
   choice — lessons 5, 23).

There's no perfect score on all five at once — improving one often costs another (more reliability
usually costs more money). Good architecture is **deliberate trade-offs**, documented and revisited.

### The Cloud Adoption Framework (CAF)

Where WAF guides a **single workload's design**, the **Cloud Adoption Framework (CAF)** guides an
**organization's whole cloud journey**: strategy, planning, getting the environment **ready** (landing
zones), adopting, **governing**, and **managing**. Think **CAF = the program** (how a company adopts
Azure) and **WAF = each workload** built within it.

### How the pillars guide decisions

For any design, ask one question per pillar:

```text
Reliability            → What happens when a component/zone/region fails?
Security               → Who can access what, and is data protected in transit and at rest?
Cost Optimization      → Are we paying only for what we need? Any commitments/right-sizing?
Operational Excellence → How do we deploy, monitor, and recover — repeatably?
Performance Efficiency → Does it scale with load, using the right service for the job?
```

# Key Terminology

- **Well-Architected Framework (WAF)** — five pillars for designing good workloads.
- **The five pillars** — Reliability, Security, Cost Optimization, Operational Excellence, Performance
  Efficiency.
- **Cloud Adoption Framework (CAF)** — guidance for an organization's whole cloud journey.
- **Landing zone** — a pre-configured, governed environment to deploy workloads into.
- **Trade-off** — improving one pillar often costs another; architecture is choosing deliberately.

# Options and Trade-offs

| Tension | Favor A | Favor B | How to choose |
| ------- | ------- | ------- | ------------- |
| Reliability vs Cost | **Multi-region redundancy** | **Single region** | Multi-region for critical systems with strict SLAs; single region to save cost on non-critical apps. |
| Performance vs Cost | **Larger/reserved capacity** | **Autoscale/serverless** | Reserved capacity for steady heavy load; serverless/autoscale for spiky or light workloads. |
| Operational Excellence | **Full IaC + CI/CD** | **Manual for a quick prototype** | Automate for anything lasting or shared; manual only for throwaway experiments. |

# Worked Example — Capstone: a small web application

Design a customer-facing web app that stores profiles and uploaded files. Walk it through the course:

```text
Compute        → App Service (PaaS) for the web/API (lesson 10); autoscale out on CPU (lesson 23).
Relational data→ Azure SQL Database, vCore serverless, zone-redundant (lessons 13, 23).
Files          → Blob storage (hot tier) with lifecycle rules for old files (lessons 6, 12).
Networking     → VNet with private endpoints to SQL and Storage; only the web tier is public (lesson 15).
Identity       → Microsoft Entra ID for users; RBAC + least privilege for the team (lesson 8).
Secrets        → Key Vault + a managed identity; no secrets in code (lesson 16).
Monitoring     → Application Insights + alerts with action groups (lesson 17).
Infra as code  → Bicep templates, one per environment via parameters (lesson 19).
Delivery       → GitHub Actions with OIDC; deploy to a staging slot, then swap (lessons 10, 20).
Cost/Governance→ Budgets + alerts; Azure Policy for tags/regions; CanNotDelete lock on the database (lesson 21).
```

Now **evaluate against the pillars**: Reliability (zone-redundant DB, autoscale, backups), Security
(private endpoints, Entra ID, Key Vault, encryption), Cost (serverless DB, budgets, right-sizing),
Operational Excellence (IaC, CI/CD, monitoring), Performance (autoscale, right services). Each choice
traces to a pillar and a lesson.

# Real World Analogy

The Well-Architected pillars are like reviewing a **house design** against **structural safety,
security, budget, maintainability, and comfort**. You can't max all five — a fortress costs more; a
cheap house may be less comfortable. A good architect makes **conscious trade-offs** and writes down
why. The **Cloud Adoption Framework** is the **city plan and permits** that govern how any house gets
built in the first place.

# Examples

## Example 1 — Basic: apply one pillar

A team reviews their app for **Reliability** and realizes a single-instance database is a weak point.
They move to a zone-redundant tier and add backups — one pillar, one concrete improvement.

**Why this works:** the pillars turn "is this good?" into specific, answerable questions.

## Example 2 — Real-world: a deliberate trade-off

A startup chooses a **single region** (not multi-region) to save cost, accepting a lower availability
target for now — and **documents** the decision to revisit as they grow.

**Why this works:** trade-offs are fine when they're **deliberate and recorded**, not accidental.

## Example 3 — Pitfall: optimizing one pillar blindly

A team drives **cost** down by removing redundancy and monitoring. The app is cheap — until an outage
they can't see or recover from.

**Why this bites:** over-optimizing one pillar wrecks others. Balance all five against the workload's
real needs.

# Common Mistakes

- **Chasing a perfect score on every pillar.** They trade off; choose deliberately for the workload.
- **Confusing WAF and CAF.** WAF = a workload's design; CAF = the organization's cloud journey.
- **Skipping the operational pillars.** Monitoring, IaC, and CI/CD are as vital as the app itself.
- **Not documenting trade-offs.** Undocumented decisions become tomorrow's mysteries.

# Best Practices

- Review every design against the **five pillars**, and record the **trade-offs** you make.
- Use **CAF** for organization-level setup (landing zones, governance) and **WAF** per workload.
- Automate operations (**IaC + CI/CD + monitoring**) from the start.
- Revisit the architecture as requirements, scale, and budget change.

# Summary

- The **Well-Architected Framework** has five pillars: **Reliability, Security, Cost Optimization,
  Operational Excellence, Performance Efficiency** — balanced through deliberate trade-offs.
- The **Cloud Adoption Framework** guides the organization's whole cloud journey; **WAF** guides each
  workload.
- A solid solution **combines** compute, data, storage, identity, security, monitoring, IaC, and CI/CD —
  as in the capstone.
- Great architecture is **conscious, documented trade-offs**, revisited over time. Congratulations —
  you've completed the course!

# Flash Cards

Q: What are the five pillars of the Azure Well-Architected Framework?
A: Reliability, Security, Cost Optimization, Operational Excellence, and Performance Efficiency.

Q: What's the difference between the Well-Architected Framework and the Cloud Adoption Framework?
A: The Well-Architected Framework guides the design of an individual workload (via the five pillars); the Cloud Adoption Framework guides an organization's overall cloud journey — strategy, readiness (landing zones), governance, and management.

Q: Why can't a design maximize all five pillars at once?
A: Because they trade off — improving one (say, reliability with multi-region redundancy) often costs another (money). Good architecture makes deliberate, documented trade-offs suited to the workload.

Q: Which pillars do monitoring, IaC, and CI/CD primarily support?
A: Operational Excellence (running and improving the system smoothly), with monitoring also supporting Reliability and Performance Efficiency.

Q: In the capstone, why use private endpoints and Key Vault?
A: Private endpoints keep database and storage traffic off the public internet, and Key Vault (with a managed identity) keeps secrets out of code — both strengthen the Security pillar.

Q: What is a landing zone?
A: A pre-configured, governed Azure environment (from the Cloud Adoption Framework) that workloads are deployed into, providing consistent networking, identity, security, and governance from the start.

# Exercises

### Easy
List the five Well-Architected pillars and write one question you'd ask about a design for each.

### Medium
Take the capstone web app and improve it for one pillar of your choice (e.g., Reliability or Cost),
naming the specific Azure services/settings you'd change and what you trade off.

### Challenging
Design your own small solution (pick any app idea) end to end using services from this course. For each
of the five pillars, justify your choices and state one deliberate trade-off you made and why.

# Further Reading

- Microsoft Learn — *Azure Well-Architected Framework*: <https://learn.microsoft.com/azure/well-architected/>
- Microsoft Learn — *The five pillars of architectural excellence*: <https://learn.microsoft.com/azure/well-architected/pillars>
- Microsoft Learn — *Cloud Adoption Framework for Azure*: <https://learn.microsoft.com/azure/cloud-adoption-framework/overview>
- Microsoft Learn — *Azure Architecture Center*: <https://learn.microsoft.com/azure/architecture/>
