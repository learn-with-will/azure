---
id: lesson-01
slug: what-is-cloud-computing
title: "What Is Cloud Computing?"
level: beginner
order: 1
duration: 16
tags:
  - cloud
  - iaas
  - paas
  - saas
  - fundamentals
summary: "What the cloud actually is — renting computing over the internet, the IaaS/PaaS/SaaS service models and the shared responsibility that comes with each, public/private/hybrid deployment, the shift from CapEx to OpEx, and the real benefits like elasticity and global reach."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **cloud computing** in plain language and why organizations use it.
- Describe the three service models — **IaaS**, **PaaS**, and **SaaS** — and who manages what.
- Explain the **shared responsibility model** and why it changes with the service model.
- Tell apart **public**, **private**, and **hybrid** clouds.
- Explain the shift from **CapEx to OpEx** and benefits like **elasticity** and **high availability**.

# Why It Matters

Almost every app you use — email, streaming, online banking, this website — runs on the cloud. For a
business, the cloud means you can launch an idea without buying servers, and grow (or shrink) as
demand changes. But "the cloud" is a broad term. Knowing the **service models** and who is
**responsible** for what is the foundation everything else in Azure builds on. Get this right and the
rest of the course clicks into place.

# Concept Explanation

### What the cloud really is

**Cloud computing** is renting computing resources — servers, storage, databases, networking,
software — over the internet, and paying only for what you use. Instead of buying and running your own
machines, you use a **cloud provider's** datacenters (Microsoft Azure, in this course) on demand.

The provider owns the buildings, hardware, power, and cooling. You get a self-service portal and APIs
to create what you need in minutes, and you hand it back when you're done.

### The three service models: IaaS, PaaS, SaaS

The models differ by **how much the provider manages** versus how much you do.

- **IaaS (Infrastructure as a Service)** — you rent raw building blocks: virtual machines, disks,
  networks. You still install and patch the operating system and everything above it. *Most control,
  most responsibility.* Example: an Azure **Virtual Machine**.
- **PaaS (Platform as a Service)** — you rent a managed platform to run your app; the provider handles
  the OS, patching, and scaling plumbing. You focus on your code and data. Example: Azure **App
  Service**.
- **SaaS (Software as a Service)** — you just use finished software over the web; the provider runs
  everything. Example: **Microsoft 365** or Outlook on the web.

```text
                 You manage ▓   Provider manages ░
On-premises   ▓▓▓▓▓▓▓▓▓▓▓▓  (you run it all)
IaaS          ▓▓▓▓▓▓▓░░░░░  (you: OS and up)
PaaS          ▓▓▓░░░░░░░░░  (you: app and data)
SaaS          ▓░░░░░░░░░░░  (you: just your data and users)
```

### The shared responsibility model

In the cloud, security and operations are a **partnership**. The provider secures the physical
datacenter and the underlying infrastructure; you secure what you put on top. **Where the line falls
depends on the service model** — the more managed the service, the less you handle.

Some things are **always yours**, no matter the model: your **data**, your **accounts and
identities**, and **who has access**. The provider will never be responsible for choosing a weak
password for you.

### Deployment models: public, private, hybrid

- **Public cloud** — shared provider datacenters open to everyone (Azure is a public cloud). Most
  common; no hardware to buy.
- **Private cloud** — cloud-style infrastructure dedicated to one organization (in your own datacenter
  or hosted). More control, more cost and effort.
- **Hybrid cloud** — public and private connected together, so workloads and data can span both. Handy
  when some systems must stay on-premises (for example, for regulation).

*(Using more than one provider is called **multicloud** — don't confuse it with hybrid.)*

### CapEx vs OpEx

Buying your own servers is a **capital expense (CapEx)**: a big up-front purchase you own and
depreciate. The cloud is an **operating expense (OpEx)**: a pay-as-you-go running cost with no
up-front hardware. OpEx makes it easy to start small and stop paying when you stop using — but it does
**not** automatically mean "cheaper". Cost depends on the workload, so measure it.

### The benefits, honestly

- **Elasticity & scalability** — add capacity when demand spikes and remove it when it drops.
- **High availability & reliability** — provider infrastructure is built to keep running through
  hardware failures (more in later lessons).
- **Agility** — go from idea to running service in minutes, not weeks.
- **Global reach** — deploy close to users around the world.

# Key Terminology

- **Cloud computing** — on-demand computing resources over the internet, paid per use.
- **Cloud provider** — the company running the datacenters (here, Microsoft Azure).
- **IaaS / PaaS / SaaS** — service models from most self-managed to fully managed.
- **Shared responsibility model** — the split of security/ops duties between you and the provider.
- **Public / private / hybrid cloud** — where the infrastructure lives and who can use it.
- **CapEx / OpEx** — up-front capital cost vs pay-as-you-go operating cost.
- **Elasticity** — automatically adding/removing capacity to match demand.
- **High availability** — staying up despite failures.

# Options and Trade-offs

| Topic | Option A | Option B | How to choose |
| ----- | -------- | -------- | ------------- |
| Service model | **IaaS** — max control | **PaaS/SaaS** — less to manage | More control and legacy needs → IaaS; faster delivery → PaaS; buy, don't build → SaaS. |
| Deployment | **Public** cloud | **Hybrid** (public + private) | Public for most new work; hybrid when some systems must stay on-premises. |
| Spending | **CapEx** (own hardware) | **OpEx** (pay-as-you-go) | OpEx to start small and stay flexible; CapEx only for steady, predictable, owned infrastructure. |

# Worked Example

A small team wants to launch a website.

```text
Option 1 (on-premises): buy a server, rack it, install and patch the OS, set up networking,
    secure it, and keep it running 24/7 — weeks of work and up-front cost (CapEx).

Option 2 (PaaS on Azure): create an App Service web app, deploy the code — live in minutes,
    pay for what you use (OpEx). Azure patches and scales the platform underneath.
```

For a brand-new site with unknown traffic, Option 2 lets the team start today, spend little, and scale
automatically if the site takes off.

# Real World Analogy

Think about getting electricity. You **don't** build a power plant in your basement (that's
on-premises). You plug into the grid and **pay for the kilowatt-hours you use** (that's the cloud). The
utility runs the plants and lines (the provider's responsibility); you're responsible for what you
plug in and how you use it (your responsibility). Need more power? The grid already has it — that's
elasticity.

# Examples

## Example 1 — Basic: matching a need to a model

A company needs email for staff. Rather than run mail servers (IaaS) or build an email app (PaaS),
they subscribe to **Microsoft 365** — **SaaS**. They manage only their users and data; everything else
is handled.

**Why this works:** when finished software already does the job, SaaS is the least effort.

## Example 2 — Real-world: handling a holiday spike

An online store normally serves steady traffic but expects 10× load on a sale day. In the cloud they
**scale out** for the sale and **scale back** afterward, paying for the extra capacity only while it's
needed.

**Why this works:** elasticity turns a scary capacity-planning problem into a setting you adjust.

## Example 3 — Pitfall: assuming the cloud secures everything

A team moves a database to the cloud and assumes it's now "secure by default." They leave a weak admin
password and open network access — and get breached.

**Why this bites:** the provider secured the datacenter, but **data, identities, and access are always
the customer's responsibility**. The cloud shares the work; it doesn't remove yours.

# Common Mistakes

- **Thinking "cloud" means one thing.** IaaS, PaaS, and SaaS are very different levels of
  responsibility.
- **Assuming cloud is always cheaper.** OpEx is flexible, but cost depends on the workload — measure it.
- **Confusing hybrid with multicloud.** Hybrid = public + private together; multicloud = more than one
  provider.
- **Believing the provider handles all security.** Your data, accounts, and access are always yours.

# Best Practices

- Pick the **most managed** model that meets your needs — less to run means fewer ways to fail.
- Learn where the **responsibility line** falls for each service you use.
- Start small with **pay-as-you-go**, then measure real cost and usage before committing.
- Keep ownership of **identity and data** front of mind from day one.

# Summary

- **Cloud computing** is renting computing over the internet and paying per use.
- **IaaS → PaaS → SaaS** trade control for convenience; the provider manages progressively more.
- The **shared responsibility model** splits duties, but **data, identity, and access are always
  yours**.
- Clouds can be **public, private, or hybrid**; using several providers is **multicloud**.
- The cloud shifts **CapEx to OpEx** and adds **elasticity, availability, agility, and global reach** —
  benefits to verify against your real workload.

# Flash Cards

Q: What is cloud computing in one sentence?
A: Renting computing resources (servers, storage, databases, software) over the internet and paying only for what you use.

Q: How do IaaS, PaaS, and SaaS differ?
A: By how much the provider manages. IaaS gives raw infrastructure (you manage the OS up); PaaS gives a managed platform (you manage app and data); SaaS gives finished software (you manage only your data and users).

Q: What does the shared responsibility model say is always the customer's job?
A: Your data, your accounts and identities, and managing who has access — regardless of service model.

Q: What is the difference between hybrid cloud and multicloud?
A: Hybrid connects public and private clouds together; multicloud means using more than one cloud provider.

Q: What is the difference between CapEx and OpEx in cloud terms?
A: CapEx is a big up-front purchase of hardware you own; OpEx is pay-as-you-go running cost with no up-front hardware. The cloud favors OpEx.

Q: What does "elasticity" mean?
A: Automatically adding capacity when demand rises and removing it when demand falls, so you pay for what you actually need.

# Exercises

### Easy
Write one sentence each defining IaaS, PaaS, and SaaS, and give one real product you use as an example
of each.

### Medium
Pick three apps or services you used today. For each, decide whether it's most likely IaaS, PaaS, or
SaaS from your point of view, and explain why.

### Challenging
Open the Azure "shared responsibility in the cloud" documentation. For a **PaaS** service, list which
responsibilities shift to Microsoft and which stay with you, and explain why identity and data never
move.

# Further Reading

- Azure — *What is cloud computing?*: <https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-cloud-computing/>
- Azure — *Types of cloud computing (IaaS/PaaS/SaaS)*: <https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-iaas/>
- Microsoft Learn — *Shared responsibility in the cloud*: <https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility>
- Microsoft Learn — *Describe cloud computing (AZ-900)*: <https://learn.microsoft.com/training/modules/describe-cloud-compute/>
