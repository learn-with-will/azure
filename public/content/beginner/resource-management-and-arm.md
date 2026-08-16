---
id: lesson-04
slug: resource-management-and-arm
title: "Resource Management and ARM"
level: beginner
order: 4
duration: 18
tags:
  - resource-groups
  - arm
  - management-groups
  - tags
  - governance
summary: "How Azure organizes and manages everything you create — the management-group / subscription / resource-group / resource hierarchy, the Azure Resource Manager control plane that every request goes through, and tags for organizing and tracking cost."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the Azure **management hierarchy**: management groups, subscriptions, resource groups, and
  resources.
- Explain what a **resource group** is and the rules for what goes in one.
- Explain what **Azure Resource Manager (ARM)** is and why every tool goes through it.
- Use **tags** to organize resources and support cost reporting.
- Create a resource inside a resource group with the CLI.

# Why It Matters

Every VM, database, and website you create is a **resource**, and Azure needs a tidy way to organize,
secure, and bill them. That structure — and the **Azure Resource Manager** layer underneath it — is
what makes it possible to apply permissions, budgets, and policies consistently. Learn it once and it
applies to *every* service in Azure.

# Concept Explanation

### The management hierarchy

Azure organizes everything into four nested levels, from broad to specific:

```text
Management group   (org-wide grouping of subscriptions; can nest)
  └─ Subscription  (billing + management boundary)
       └─ Resource group  (logical container for related resources)
            └─ Resource    (a VM, database, storage account, web app, …)
```

- **Management groups** sit **above** subscriptions and let you apply governance (access and policy) to
  **many subscriptions at once**. They can be nested, with a single **root** management group at the
  top. Large organizations use them; a solo learner may never need them.
- **Subscriptions** are the **billing and management boundary** (lesson 2).
- **Resource groups** hold related resources.
- **Resources** are the individual services you create.

### Resource groups — the rules

A **resource group (RG)** is a **logical container** for resources that share a lifecycle — often an
app's website, database, and storage together. Key rules:

- A resource belongs to **exactly one** resource group at a time.
- A resource group has a **location** (region) where its **metadata** is stored, but it can contain
  resources from **other** regions.
- **Deleting a resource group deletes everything inside it** — the fastest, cleanest way to tear down a
  project (and a great way to avoid forgotten, still-billing resources).
- Resources *can* be moved between groups (and some between subscriptions), with service-specific
  caveats.

Group resources by **what you'll manage or delete together**.

### Azure Resource Manager (ARM): the control plane

Whenever you create, read, update, or delete a resource — through the **portal**, **CLI**,
**PowerShell**, an **SDK**, or the **REST API** — the request goes through **Azure Resource Manager
(ARM)**, Azure's **deployment and management layer** (the "control plane"). ARM provides a **consistent
management layer** that:

- Authenticates and authorizes the request (via Microsoft Entra ID and **RBAC**).
- Applies **policies** and validates the request.
- Sends the work to the right resource provider.

Because everything routes through ARM, the permissions, policies, tags, and templates you'll meet in
later lessons apply **uniformly**, no matter which tool you used.

### Tags: organizing and tracking

**Tags** are simple **name/value pairs** you attach to resources (and resource groups and
subscriptions), such as `environment=production`, `costCenter=marketing`, or `owner=dana`. They don't
change how a resource works; they help you **organize, filter, and report** — especially for **cost
management** (lesson 21). Note that tags are **not** automatically inherited by resources inside a
tagged resource group unless you enforce that with policy.

# Key Terminology

- **Resource** — a single manageable Azure service instance (VM, database, storage account, …).
- **Resource group** — a logical container for related resources; one home per resource.
- **Subscription** — the billing/management boundary that resource groups live in.
- **Management group** — a container above subscriptions for org-wide governance.
- **Azure Resource Manager (ARM)** — the control plane every management request goes through.
- **Resource provider** — the service behind a resource type (e.g., `Microsoft.Compute` for VMs).
- **Tag** — a name/value label for organizing and cost-reporting resources.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Grouping resources | **One RG per app/environment** | **One big RG for everything** | Per app/environment makes cleanup, access, and cost tracking clean; one giant RG gets messy fast. |
| Governing many subscriptions | **Management groups** | Configure each **subscription** by hand | Management groups when you have several subscriptions and want consistent policy/access; skip for a single subscription. |
| Organizing for cost | **Tags** (environment, owner, cost center) | No tags | Tags make cost reports and cleanup far easier; adopt a simple tagging scheme early. |

# Worked Example

Create a resource group, add a resource with tags, and inspect it:

```bash
# 1. Create a resource group
az group create --name shop-prod-rg --location eastus

# 2. Create a storage account in it, with tags (storage names are globally unique + lowercase)
az storage account create \
  --name shopprodstore$RANDOM \
  --resource-group shop-prod-rg \
  --location eastus \
  --sku Standard_LRS \
  --tags environment=production owner=dana costCenter=retail

# 3. List everything in the group
az resource list --resource-group shop-prod-rg --output table

# 4. Tear it all down in one command when finished
az group delete --name shop-prod-rg --yes --no-wait
```

# Real World Analogy

Think of a **subscription** as your **house account** at a warehouse. **Resource groups** are the
**labeled bins** where you keep related things together, so you can grab or throw out a whole project at
once. **Tags** are **sticky labels** ("kitchen", "owner: Dana") that let you find and total things
across bins. And **ARM** is the **front desk** every request passes through — it checks your ID,
enforces the rules, and routes your order.

# Examples

## Example 1 — Basic: one resource group per environment

A team keeps `app-dev-rg` and `app-prod-rg`. Development experiments live in the dev group; production
lives in prod. Deleting the dev group cleans up all experiments at once without touching production.

**Why this works:** grouping by lifecycle makes cleanup and access control simple and safe.

## Example 2 — Real-world: tags drive a cost report

Finance wants spend broken down by department. Because every resource carries a `costCenter` tag, they
generate a cost report grouped by that tag and see exactly what each team spends.

**Why this works:** tags turn a flat bill into a report you can actually act on.

## Example 3 — Pitfall: deleting the wrong resource group

An engineer runs `az group delete` on the wrong name and removes a production database with it.

**Why this bites:** deleting a resource group deletes **everything** in it. Double-check the name, and
use resource **locks** (lesson 21) on things that must not be deleted.

# Common Mistakes

- **Putting unrelated resources in one giant group.** It defeats the point — group by shared lifecycle.
- **Forgetting a resource group's location only stores metadata.** Resources inside can be in other
  regions.
- **Assuming tags are inherited.** They aren't by default; enforce inheritance with policy if you need
  it.
- **Thinking the portal and CLI are "different systems."** Both call the same **ARM** control plane.

# Best Practices

- Use **one resource group per application per environment** so cleanup and access are clean.
- Adopt a small, consistent **tagging** scheme (environment, owner, cost center) from day one.
- Use **management groups** to apply access and policy across multiple subscriptions consistently.
- Protect critical resources from accidental deletion with **locks** (covered in governance).

# Summary

- Azure's hierarchy is **management group → subscription → resource group → resource**.
- A **resource group** is a logical container; a resource lives in exactly one, and deleting the group
  deletes its contents.
- **Azure Resource Manager (ARM)** is the control plane every request goes through, giving consistent
  auth, policy, and management across all tools.
- **Tags** organize resources and power cost reporting (but aren't inherited by default).

# Flash Cards

Q: What are the four levels of the Azure management hierarchy, broad to specific?
A: Management group → subscription → resource group → resource.

Q: What is a resource group, and how many can a resource belong to?
A: A logical container for related resources that share a lifecycle. A resource belongs to exactly one resource group at a time.

Q: What happens when you delete a resource group?
A: Every resource inside it is deleted — a fast way to tear down a project (and a risk if you pick the wrong group).

Q: What is Azure Resource Manager (ARM)?
A: Azure's deployment and management control plane. Every request from the portal, CLI, PowerShell, SDKs, or REST API goes through ARM, which handles authentication, RBAC, policy, and routing.

Q: Do resources automatically inherit their resource group's tags?
A: No. Tags are not inherited by default; you can enforce inheritance with Azure Policy if you need it.

Q: What are management groups for?
A: Applying governance (access and policy) across many subscriptions at once. They sit above subscriptions and can be nested under a single root.

# Exercises

### Easy
Draw the four-level hierarchy (management group → subscription → resource group → resource) and place
one example at each level.

### Medium
Create a resource group, add any low-cost resource to it with two tags (for example `environment=dev`
and `owner=<you>`), list the group's contents, then delete the group. Record the commands.

### Challenging
Explain how ARM, RBAC, tags, and management groups work together to let a company give the "finance"
team read-only cost visibility across every subscription without granting them permission to change any
resource.

# Further Reading

- Microsoft Learn — *What is Azure Resource Manager?*: <https://learn.microsoft.com/azure/azure-resource-manager/management/overview>
- Microsoft Learn — *Manage resource groups*: <https://learn.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-portal>
- Microsoft Learn — *Organize your resources with management groups*: <https://learn.microsoft.com/azure/governance/management-groups/overview>
- Microsoft Learn — *Use tags to organize your Azure resources*: <https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources>
