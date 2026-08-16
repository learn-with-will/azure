---
id: lesson-21
slug: cost-management-and-governance
title: "Cost Management and Governance"
level: advanced
order: 21
duration: 20
tags:
  - cost-management
  - azure-policy
  - budgets
  - locks
  - governance
summary: "Keep spending and sprawl under control — estimate with the pricing and TCO calculators, track and forecast real spend with Cost Management and budgets, save with reservations and right-sizing, and enforce the rules with Azure Policy, resource locks, tags, and management groups."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Estimate and track costs with the **pricing/TCO calculators**, **Cost Management**, and **budgets**.
- Name the main ways to **reduce** Azure spend.
- Enforce standards with **Azure Policy**, **resource locks**, **tags**, and **management groups**.
- Explain how governance scales across many subscriptions.

# Why It Matters

The cloud's pay-as-you-go model is powerful but easy to overspend on, and easy to let sprawl into an
ungoverned mess. **Cost management** keeps the bill predictable; **governance** keeps resources
compliant, secure, and organized as you grow. Both are essential for running Azure responsibly — not
just building on it.

# Concept Explanation

### Estimating and tracking cost

- **Pricing calculator** — estimate the cost of a design **before** you build it.
- **TCO (Total Cost of Ownership) calculator** — compare running on-premises vs on Azure.
- **Microsoft Cost Management** — analyze and **forecast actual spend**, break it down (by resource
  group, tag, service), and spot trends.
- **Budgets** — set spending thresholds that **alert** you (and can trigger actions) as you approach or
  exceed them.

Because prices, credits, and offers change, use these live tools rather than memorized figures.

### Ways to spend less

- **Right-size** resources and turn off what you don't need (auto-shutdown dev VMs).
- **Reservations** (1- or 3-year commitments) and **savings plans** cut rates for steady workloads.
- **Azure Hybrid Benefit** reuses existing Windows Server/SQL licenses.
- **Spot VMs** run interruptible workloads at deep discounts.
- **Azure Advisor** gives personalized **cost** (and reliability/security) recommendations.
- **Tags** let you attribute spend to teams so owners see and manage it.

### Governance with Azure Policy

**Azure Policy** enforces **organizational rules** on resources. A policy can **audit** (flag
non-compliance) or **deny** (block a non-compliant create), and some can **remediate** automatically.
Examples: "allowed regions only," "require a `costCenter` tag," "no public IPs on VMs," "allowed VM
sizes." Policies are assigned at a scope (management group, subscription, resource group) and apply to
everything beneath. **Policy governs *how* resources are configured; RBAC governs *who* can act.**

### Resource locks

A **resource lock** protects against accidental change or deletion:

- **CanNotDelete** — you can read and modify, but **not delete**.
- **ReadOnly** — you can read, but **not modify or delete**.

Put a **CanNotDelete** lock on critical resources (a production database) so a stray command can't remove
them.

### Organizing at scale: tags and management groups

- **Tags** (lesson 4) attribute cost and organize resources.
- **Management groups** apply **Policy and RBAC across many subscriptions at once**, so a rule like
  "allowed regions" is set once and inherited everywhere.

Together these implement the guidance in Microsoft's **Cloud Adoption Framework**.

# Key Terminology

- **Pricing / TCO calculator** — estimate future cost / compare on-prem vs cloud.
- **Cost Management** — analyze and forecast actual spend.
- **Budget** — a spending threshold with alerts/actions.
- **Reservation / savings plan** — discounts for committed, steady usage.
- **Azure Policy** — rules that audit, deny, or remediate resource configurations.
- **Resource lock** — CanNotDelete or ReadOnly protection on resources.
- **Management group** — a scope to apply Policy/RBAC across subscriptions.

# Options and Trade-offs

| Goal | Option A | Option B | How to choose |
| ---- | -------- | -------- | ------------- |
| Cutting steady-state cost | **Reservations/savings plans** | **Pay-as-you-go** | Commit for predictable, long-running workloads; pay-as-you-go for variable or short-term. |
| Enforcing standards | **Audit** policy | **Deny** policy | Audit to observe first; deny to hard-block non-compliant resources once you're confident. |
| Protecting resources | **CanNotDelete** lock | **ReadOnly** lock | CanNotDelete for things that may change but must not be deleted; ReadOnly to freeze configuration. |
| Scaling governance | **Per-subscription** setup | **Management groups** | Management groups when you have several subscriptions and want consistent, inherited rules. |

# Worked Example

Set a monthly budget alert and require a tag with policy:

```bash
# A monthly budget that alerts at 80% of $100 for a resource group
az consumption budget create \
  --budget-name shop-monthly --amount 100 --time-grain Monthly \
  --category Cost --resource-group shop-prod-rg

# Assign a built-in policy that requires a 'costCenter' tag on resources
az policy assignment create \
  --name require-costcenter \
  --scope /subscriptions/<sub-id>/resourceGroups/shop-prod-rg \
  --policy <require-tag-policy-definition-id> \
  --params '{ "tagName": { "value": "costCenter" } }'
```

Now spend is watched, and resources missing a `costCenter` tag are flagged (or blocked, depending on the
policy effect).

# Real World Analogy

Governance and cost control are like **running a shared office**. **Budgets** are the **spending limits**
each department agrees to, with a heads-up when they're close. **Azure Policy** is the **building rules**
("no space heaters," "fire doors must stay clear") enforced automatically. **Resource locks** are
**"do not remove" tags** on critical equipment. **Management groups** let facilities set one rule that
applies to **every floor** at once.

# Examples

## Example 1 — Basic: stop bill shock

A team sets a **budget** with an 80% alert. When a runaway test doubles usage mid-month, they're notified
early and shut it down before it becomes expensive.

**Why this works:** budgets turn cost into something you're warned about, not surprised by.

## Example 2 — Real-world: enforce region and tags org-wide

A company assigns policies at a **management group** to allow only European regions and require a
`costCenter` tag. Every subscription inherits the rules automatically.

**Why this works:** management-group-scoped policy enforces standards consistently without per-team
effort.

## Example 3 — Pitfall: the deleted production database

Without a lock, an engineer deletes the wrong resource group and takes production with it.

**Why this bites:** critical resources need a **CanNotDelete** lock so accidental commands can't remove
them.

# Common Mistakes

- **No budgets or alerts.** Set them so cost never surprises you.
- **Memorizing prices.** Use the calculators and Cost Management — offers change.
- **Skipping locks on critical resources.** Add CanNotDelete to production essentials.
- **Configuring each subscription by hand.** Use management groups for consistent policy/RBAC.

# Best Practices

- Estimate with the **pricing calculator**, then track with **Cost Management** and **budgets**.
- Reduce spend with **right-sizing**, **reservations/savings plans**, **Hybrid Benefit**, and **Advisor**.
- Enforce standards with **Azure Policy** (audit → deny) and protect essentials with **locks**.
- Apply **tags** for cost attribution and **management groups** for org-wide governance.

# Summary

- Estimate cost with the **pricing/TCO calculators**; track and forecast with **Cost Management** and
  **budgets**.
- Save with **reservations/savings plans**, **right-sizing**, **Hybrid Benefit**, **spot**, and
  **Advisor**.
- Govern with **Azure Policy** (audit/deny/remediate), **resource locks** (CanNotDelete/ReadOnly),
  **tags**, and **management groups**.
- **Policy governs how resources are configured; RBAC governs who can act.**

# Flash Cards

Q: What's the difference between the pricing calculator and Cost Management?
A: The pricing calculator estimates cost of a design before you build; Cost Management analyzes and forecasts your actual spend and lets you break it down and set budgets.

Q: What does Azure Policy do, and how is it different from RBAC?
A: Azure Policy enforces rules on resource configurations — it can audit, deny, or remediate (e.g., allowed regions, required tags). RBAC controls who can perform actions. Policy governs how resources are configured; RBAC governs who can act.

Q: What are the two types of resource lock and what do they prevent?
A: CanNotDelete (you can read and modify but not delete) and ReadOnly (you can read but not modify or delete). They protect critical resources from accidental change/deletion.

Q: Name three ways to reduce Azure spend.
A: Right-sizing and shutting down idle resources; reservations or savings plans for steady workloads; and Azure Hybrid Benefit (plus spot VMs and Advisor recommendations).

Q: How do management groups help with governance?
A: They let you assign Azure Policy and RBAC once and have every subscription beneath them inherit the rules — consistent governance across many subscriptions without per-team setup.

Q: What is a budget in Azure Cost Management?
A: A spending threshold for a scope (e.g., a resource group or subscription) that triggers alerts (and optionally actions) as you approach or exceed the amount, so cost never surprises you.

# Exercises

### Easy
Explain the difference between the pricing calculator and the TCO calculator, and when you'd use each.

### Medium
Create a monthly budget with an alert on a resource group, and describe an Azure Policy you'd assign
(audit or deny) and why.

### Challenging
Design cost and governance controls for a company with five subscriptions: describe the management-group
structure, two policies you'd enforce, how you'd attribute cost by team, and which resources you'd lock.

# Further Reading

- Microsoft Learn — *What is Microsoft Cost Management?*: <https://learn.microsoft.com/azure/cost-management-billing/cost-management-billing-overview>
- Microsoft Learn — *What is Azure Policy?*: <https://learn.microsoft.com/azure/governance/policy/overview>
- Microsoft Learn — *Lock resources to prevent changes*: <https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources>
- Microsoft Learn — *Ways to save money on Azure*: <https://learn.microsoft.com/azure/cost-management-billing/costs/cost-mgt-best-practices>
