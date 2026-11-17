---
slug: cloud-adoption-framework-guidance
title: "Microsoft Cloud Adoption Framework (CAF)"
topic: governance-reliability-architecture
kind: concept
summary: "Navigate enterprise cloud transformation using the Strategy, Plan, Ready, Adopt, Govern, and Manage phases of CAF."
tags: [caf, cloud-adoption, governance, landing-zones]
related: [well-architected-framework-five-pillars, azure-policy-and-compliance-enforcement, cloud-architecture-capstone-solution-design]
---
> **In one line:** The Cloud Adoption Framework guides enterprise cloud migration strategy, culture, governance, and management.

## The idea

While the Well-Architected Framework focuses on the technical design of individual workloads, the **Microsoft Cloud Adoption Framework (CAF)** provides holistic guidance for entire organizations migrating to and operating in the cloud. CAF bridges business strategy, people, culture, and technology.

The Six Core Methodologies of CAF:
1. **Strategy:** Define business motivations (cost savings, agility, innovation) and calculate anticipated financial return on investment.
2. **Plan:** Align organizational teams, skills readiness, and build a prioritized cloud adoption plan with workload inventory.
3. **Ready:** Prepare the cloud environment by deploying an **Azure Landing Zone**—a standardized, secure multi-subscription foundation.
4. **Adopt:** Execute workload migrations (rehost, refactor, rearchitect) or innovate with cloud-native application architectures.
5. **Govern:** Establish corporate guardrails, compliance benchmarks, and automated policies across cost, identity, and security.
6. **Manage:** Implement ongoing operations management, monitoring, SLA tracking, and business continuity.

| CAF Phase | Focus Area | Primary Deliverable |
|---|---|---|
| **Strategy** | Business alignment | Business case & financial ROI model |
| **Plan** | People & skills | Adoption roadmap & team alignment |
| **Ready** | Infrastructure landing | **Azure Landing Zone architecture** |
| **Adopt** | Workload transformation | Migrated VMs & modernized cloud apps |
| **Govern** | Policy & compliance | Azure Policy, Management Group hierarchy |
| **Manage** | Ongoing operations | BCDR, patching, monitoring baselines |

> **Tip:** Start the 'Ready' phase with **Azure Landing Zone Accelerators**. These are official Microsoft Bicep and Terraform reference implementations that configure Management Groups, hub-and-spoke networking, and policy assignments in a single deployment.

## See it

Inspect a standard enterprise Azure Landing Zone Management Group hierarchy aligned with CAF:

```text
Tenant Root Group
 ├── Decommissioned / Sandboxes
 └── Enterprise Organization
      ├── Platform
      │    ├── Management (Log Analytics, Automation)
      │    ├── Connectivity (Hub VNet, Firewall, VPN)
      │    └── Identity (Entra Domain Services, Key Vaults)
      └── Landing Zones (Workloads)
           ├── Production (Prod Subscriptions)
           └── Non-Production (Dev/Test Subscriptions)
```

Organizing subscriptions under CAF Management Groups enables centralized policy enforcement, RBAC inheritance, and billing isolation across enterprise divisions.

## Go deeper

CAF defines the **Five Disciplines of Cloud Governance**: Cost Management, Security Baseline, Identity Baseline, Resource Consistency, and Deployment Acceleration. These five disciplines ensure organizations maintain control as cloud scale expands exponentially.

## Watch out

- Avoid skipping the 'Strategy' and 'Plan' phases; rushing directly to technical migration without executive alignment leads to stalled initiatives.
- Do not deploy all enterprise workloads into a single subscription; use dedicated subscriptions for workload isolation.

## Remember

- The Cloud Adoption Framework (CAF) provides holistic organizational guidance across Strategy, Plan, Ready, Adopt, Govern, and Manage.
- Deploy Azure Landing Zones to establish an enterprise-ready foundation with standardized networking, identity, and governance.
- Structure subscriptions hierarchically under Management Groups to ensure consistent policy and security inheritance.
