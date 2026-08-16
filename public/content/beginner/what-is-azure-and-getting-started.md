---
id: lesson-02
slug: what-is-azure-and-getting-started
title: "What Is Azure and Getting Started"
level: beginner
order: 2
duration: 18
tags:
  - azure
  - portal
  - azure-cli
  - subscription
  - cloud-shell
summary: "What Microsoft Azure is and how you actually work with it — the account/subscription model, the four main ways to interact (portal, Azure CLI, Azure PowerShell, and Cloud Shell), signing in, and creating your very first resource group."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe what **Microsoft Azure** is and the breadth of what it offers.
- Explain the relationship between an **Azure account**, a **subscription**, and a **tenant**.
- List the main ways to work with Azure: the **portal**, the **Azure CLI**, **Azure PowerShell**, and
  **Cloud Shell**.
- Sign in with the **Azure CLI** and create your first **resource group**.
- Know how to get an Azure account without surprise charges.

# Why It Matters

Before you can deploy anything, you need to know *what Azure is* and *how to talk to it*. Azure gives
you several front doors — a point-and-click portal for learning and a command line for repeatable,
automatable work. Understanding the account and subscription model now prevents billing and
permissions confusion later, when you have real resources running.

# Concept Explanation

### What Azure is

**Microsoft Azure** is Microsoft's **public cloud platform**: a very large collection of services —
virtual machines, databases, storage, networking, AI, containers, and many more — running in
Microsoft's datacenters worldwide. You create and manage these services on demand and pay for what you
use. This course focuses on the **core** services most people need first.

### Accounts, subscriptions, and tenants

A few terms describe *who you are* and *where your resources and bills live*:

- **Azure account** — your identity for using Azure, backed by **Microsoft Entra ID** (the identity
  service, covered in lesson 8).
- **Subscription** — a **billing and management boundary**. Resources are created inside a
  subscription; usage is billed to it. You can have several (for example, "dev" and "production").
- **Microsoft Entra tenant** — the directory of users and groups your organization owns. A tenant can
  contain many subscriptions.

Inside a subscription you organize resources into **resource groups** (the next lesson). For now:
**account → subscription → resource group → resources.**

### Four ways to work with Azure

1. **Azure portal** — a web GUI at `portal.azure.com`. Great for exploring, learning, and one-off
   tasks. You can *see* everything you create.
2. **Azure CLI** — a cross-platform command-line tool. Commands start with **`az`**. Ideal for
   repeatable, scriptable work. This course uses the CLI as its primary tool.
3. **Azure PowerShell** — the **`Az`** PowerShell module; same idea as the CLI, in PowerShell style.
   Use whichever you prefer.
4. **Cloud Shell** — a browser-based shell (Bash **or** PowerShell) built into the portal, with the
   CLI, PowerShell, and common tools **pre-installed** and already signed in. Nothing to install
   locally.

Underneath all of these is the **Azure REST API** — every tool ultimately calls it.

### Signing in and finding your subscription

With the CLI installed locally, you sign in and check which subscription you're using:

```bash
# Opens a browser to sign in
az login

# Show the active subscription (name, id, tenant)
az account show --output table

# List all subscriptions you can access
az account list --output table
```

If you have more than one subscription, set the active one so new resources land in the right place:

```bash
az account set --subscription "My Subscription Name"
```

### Getting an account safely

Azure offers a **free account** that includes a **time-limited credit** plus a set of **always-free**
service tiers. The exact credit amount, duration, and included services change over time, so check the
current free-account page rather than trusting a number you read somewhere. Two habits keep you safe
while learning: **use free/low-cost tiers**, and **delete resources when you're done** (easy if you
group them — next lesson).

# Key Terminology

- **Microsoft Azure** — Microsoft's public cloud platform of on-demand services.
- **Azure account** — your identity for using Azure (backed by Microsoft Entra ID).
- **Subscription** — the billing and management boundary that resources live in.
- **Tenant** — your organization's Microsoft Entra directory of users and groups.
- **Azure portal** — the web GUI for Azure.
- **Azure CLI (`az`)** — the cross-platform command-line tool for Azure.
- **Azure PowerShell (`Az`)** — the PowerShell module for Azure.
- **Cloud Shell** — a ready-to-use, signed-in shell in the browser.

# Options and Trade-offs

| Task | Option A | Option B | How to choose |
| ---- | -------- | -------- | ------------- |
| Interacting with Azure | **Portal** (GUI) | **CLI/PowerShell** (commands) | Portal to explore and learn; CLI/PowerShell for repeatable, automatable work. |
| Where to run commands | **Local CLI** install | **Cloud Shell** (browser) | Cloud Shell to start instantly with nothing installed; local CLI for your own environment and scripts. |
| CLI language | **Azure CLI** (`az`) | **Azure PowerShell** (`Az`) | Personal preference; `az` is concise and cross-shell, `Az` fits PowerShell users. |

# Worked Example

Create your first thing in Azure — a **resource group** in a region — then confirm it exists and clean
it up:

```bash
# Create a resource group named "learn-rg" in the East US region
az group create --name learn-rg --location eastus

# Confirm it's there
az group show --name learn-rg --output table

# Clean up when finished (no charge for an empty group, but tidy is good)
az group delete --name learn-rg --yes --no-wait
```

That's the whole loop: create, verify, delete. Everything you build later follows the same rhythm.

# Real World Analogy

Think of Azure as a huge **rental workshop**. Your **account** is your membership card. A
**subscription** is the tab your rentals get billed to. The **portal** is walking the aisles and
picking tools by hand; the **CLI** is handing the clerk a written list so you get the exact same tools
every time. **Cloud Shell** is a workbench already set up inside the shop so you can start immediately.

# Examples

## Example 1 — Basic: check who and where you are

Before creating anything, confirm your identity and active subscription so resources and bills land in
the right place:

```bash
az account show --output table
```

**Why this works:** a five-second check prevents the classic mistake of building in the wrong
subscription.

## Example 2 — Real-world: separate subscriptions for dev and prod

A company keeps a **development** subscription and a **production** subscription. Costs are billed and
tracked separately, and access can be granted per subscription, so a developer experimenting in dev
can't accidentally touch production.

**Why this works:** subscriptions are natural boundaries for **billing** and **access**.

## Example 3 — Pitfall: leaving resources running

A learner creates a virtual machine to try something, closes the browser, and forgets it. It keeps
running — and charging — for days.

**Why this bites:** the cloud bills for running resources whether or not you're using them. Deleting
the **resource group** when you're done removes everything in it at once.

# Common Mistakes

- **Confusing account, subscription, and tenant.** Account = identity; subscription = billing boundary;
  tenant = your directory of users.
- **Building in the wrong subscription.** Check `az account show` first, especially with more than one.
- **Trusting a hard-coded free-credit figure.** The offer changes — read the current free-account page.
- **Forgetting cleanup.** Undeleted resources keep billing; group them so cleanup is one command.

# Best Practices

- Use the **portal to learn** and the **CLI to repeat** — capture working commands in a script.
- Run `az account show` before creating resources to confirm the target subscription.
- Start in **Cloud Shell** if you don't want to install anything.
- Put throwaway learning resources in a dedicated **resource group** and delete it when done.

# Summary

- **Azure** is Microsoft's public cloud: a huge catalog of on-demand services.
- Identity and billing are organized as **account → subscription → resource group → resources**, with a
  **tenant** holding your users.
- You can work with Azure through the **portal**, **Azure CLI (`az`)**, **Azure PowerShell (`Az`)**, or
  **Cloud Shell** — all calling the same REST API.
- `az login`, `az account show`, and `az group create` are your first commands.
- Use free/low-cost tiers and **delete resources** you no longer need.

# Flash Cards

Q: What is Microsoft Azure?
A: Microsoft's public cloud platform — a large collection of on-demand services (compute, storage, databases, networking, AI, and more) running in Microsoft datacenters, billed per use.

Q: What is an Azure subscription?
A: A billing and management boundary. Resources are created inside a subscription and their usage is billed to it; you can have several (for example, dev and production).

Q: Name the four main ways to interact with Azure.
A: The Azure portal (web GUI), the Azure CLI (`az`), Azure PowerShell (the `Az` module), and Cloud Shell (a signed-in shell in the browser).

Q: What is Cloud Shell?
A: A browser-based shell (Bash or PowerShell) built into the portal, with the CLI, PowerShell, and common tools pre-installed and already authenticated — no local install needed.

Q: Which command signs you in with the Azure CLI, and which shows your active subscription?
A: `az login` signs in; `az account show` shows the active subscription (name, id, tenant).

Q: How do you avoid surprise charges while learning?
A: Use free/low-cost tiers and delete resources when you're done — grouping them in a resource group makes cleanup a single command.

# Exercises

### Easy
Explain, in your own words, the difference between an Azure **account**, a **subscription**, and a
**tenant**.

### Medium
Using Cloud Shell or a local CLI, run `az account show` and `az group create` to make a resource group
named `learn-rg` in a region near you, then delete it. Write down each command you used.

### Challenging
Open the current Azure free-account page and list (a) two always-free services and (b) what the
introductory credit currently includes. Explain why hard-coding those numbers in a tutorial would be a
bad idea.

# Further Reading

- Azure — *What is Azure?*: <https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-azure/>
- Microsoft Learn — *Azure CLI overview*: <https://learn.microsoft.com/cli/azure/what-is-azure-cli>
- Microsoft Learn — *Azure Cloud Shell overview*: <https://learn.microsoft.com/azure/cloud-shell/overview>
- Microsoft Learn — *What is an Azure subscription?*: <https://learn.microsoft.com/azure/cost-management-billing/manage/create-subscription>
