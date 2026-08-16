---
id: lesson-05
slug: core-compute-overview
title: "Core Compute Overview"
level: beginner
order: 5
duration: 18
tags:
  - compute
  - virtual-machines
  - app-service
  - functions
  - containers
summary: "A map of Azure's main ways to run code — virtual machines and scale sets (IaaS), App Service (PaaS web hosting), Azure Functions (serverless), and containers (ACI, Container Apps, AKS) — and a simple way to pick the right one for a workload."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Name Azure's main **compute** options and say what each is for.
- Place each option on the **IaaS → PaaS → serverless** spectrum.
- Explain the difference between **VMs**, **App Service**, **Functions**, and **containers**.
- Choose a suitable compute service for a given workload.

# Why It Matters

"Compute" means **running your code or apps**, and Azure offers several ways to do it — from a full
virtual machine you control top to bottom, to serverless functions where you just supply code. Picking
the right one affects how much you manage, how it scales, and what it costs. This lesson is the map;
later lessons get hands-on with each.

# Concept Explanation

### Virtual Machines (IaaS)

An **Azure Virtual Machine (VM)** is a computer in the cloud — you choose the OS (Windows or Linux),
size (CPU/RAM), and disks, and you manage everything from the operating system up. VMs give **the most
control** and are the natural home for **"lift and shift"** (moving existing servers to the cloud as-is)
or software that needs a specific OS setup. The trade-off: you patch and maintain the OS yourself.

A **Virtual Machine Scale Set** is a group of **identical VMs** that can **automatically scale** the
number of instances up or down and load-balance across them — VMs when you need many, elastically.

### App Service (PaaS)

**Azure App Service** hosts **web apps, REST APIs, and back ends** on a fully managed platform. You
deploy your code (or a container); Azure runs the OS, patches it, and provides easy **scaling**, custom
domains, and HTTPS. You focus on the app, not the servers. It's the quickest way to get a website or API
online.

### Azure Functions (serverless)

**Azure Functions** runs **small pieces of code** in response to **events** — an HTTP request, a timer,
a new file in storage, a message on a queue. On the **Consumption** plan it **scales automatically**
(including to zero when idle) and you pay per execution. "Serverless" means you don't manage servers,
not that there are none. Great for event-driven, bursty, or glue logic; not for long-running
always-on processes.

### Containers: ACI, Container Apps, AKS

**Containers** package an app with its dependencies so it runs the same everywhere. Azure runs them
three ways:

- **Azure Container Instances (ACI)** — run a single container quickly, without managing servers.
  Simplest; good for short tasks and simple workloads.
- **Azure Container Apps** — a **serverless** platform for containers and microservices, with
  built-in scaling (including **scale to zero**) and traffic splitting. A great middle ground.
- **Azure Kubernetes Service (AKS)** — **managed Kubernetes** for full control over complex,
  large-scale container orchestration. Most powerful, most to learn.

(We go deeper on containers in lesson 18.)

### A simple way to choose

```text
Need full OS control / lift-and-shift?        → Virtual Machine (+ Scale Set for many)
Hosting a web app or API, want it managed?     → App Service
Short, event-driven code, pay-per-run?         → Azure Functions
Containerized app or microservices?            → Container Apps (or AKS for full Kubernetes)
Just one container, run it and go?             → Container Instances
```

The general rule: **choose the most managed option that fits**, so you run less infrastructure yourself.

# Key Terminology

- **Virtual Machine (VM)** — an IaaS computer in the cloud; you manage the OS and up.
- **VM Scale Set** — a set of identical, auto-scaling VMs behind a load balancer.
- **App Service** — PaaS hosting for web apps and APIs.
- **Azure Functions** — serverless, event-driven code billed per execution.
- **Container** — an app packaged with its dependencies to run consistently anywhere.
- **ACI / Container Apps / AKS** — run a single container / serverless containers / managed Kubernetes.

# Options and Trade-offs

| Workload | Best fit | Why | Watch out for |
| -------- | -------- | --- | ------------- |
| Existing server app, needs specific OS | **Virtual Machine** | Full control, lift-and-shift | You patch and maintain the OS |
| New website or API | **App Service** | Managed, fast to ship, easy scaling | Less low-level control than a VM |
| Event-driven / bursty logic | **Azure Functions** | Scales to zero, pay per run | Cold starts; not for long-running work |
| Microservices in containers | **Container Apps** | Serverless scaling, simpler than AKS | Less control than full Kubernetes |
| Complex container orchestration | **AKS** | Full Kubernetes power | Steeper learning curve and ops |

# Worked Example

Two teams, two choices:

```text
Team A has a 10-year-old Windows application tied to a specific OS configuration.
  → Deploy it on a Virtual Machine (IaaS). They keep control; they accept OS upkeep.

Team B is building a brand-new REST API and wants it live today with minimal ops.
  → Deploy it on App Service (PaaS). Azure runs and scales the platform; they ship code.
```

Same goal (run software), very different amounts of management.

# Real World Analogy

Getting around a city:

- **VM** = **owning a car** — total control, but you fuel, insure, and maintain it.
- **App Service** = **a leased, serviced car** — you drive; someone else handles maintenance.
- **Functions** = **a taxi** — it shows up when you need it, you pay per trip, nothing sits idle.
- **Containers** = **shipping containers** — pack once, and they move identically on any truck (host).

# Examples

## Example 1 — Basic: the simplest thing that works

A student hosts a personal portfolio site. They pick **App Service** on a free/low tier — no servers to
manage, HTTPS included, live in minutes.

**Why this works:** for a standard web app, PaaS removes almost all the busywork.

## Example 2 — Real-world: process files as they arrive

A company needs to make a thumbnail whenever an image is uploaded. They use an **Azure Function**
triggered by new blobs in storage; it runs only when images arrive and scales with the upload rate.

**Why this works:** event-driven, bursty work is exactly what serverless functions are built for.

## Example 3 — Pitfall: a VM for a simple website

A team spins up a VM to host a basic site, then spends time patching the OS, configuring a web server,
and renewing certificates — all of which App Service would have handled.

**Why this bites:** choosing IaaS when PaaS fits means signing up for maintenance you didn't need.

# Common Mistakes

- **Reaching for a VM by default.** Prefer the most managed option that meets the need.
- **Using Functions for long-running, always-on work.** They shine on short, event-driven tasks.
- **Jumping straight to AKS.** Kubernetes is powerful but heavy; Container Apps or App Service is often
  enough.
- **Confusing scaling models.** VMs scale via scale sets; Functions and Container Apps can scale to
  zero.

# Best Practices

- Start with **App Service or Functions** for new apps; move to VMs/containers only when you need their
  control.
- Use **VM Scale Sets** (not lone VMs) when you need many elastic instances.
- Match **billing to usage** — serverless (Functions, Container Apps) for spiky workloads.
- Right-size compute and revisit it; over-provisioning is a common source of waste.

# Summary

- Azure compute spans **IaaS → PaaS → serverless**: **VMs/Scale Sets**, **App Service**, **Functions**,
  and **containers** (ACI, Container Apps, AKS).
- **VMs** give the most control; **App Service** manages web hosting; **Functions** run event-driven
  code and scale to zero; **containers** package apps to run anywhere.
- Choose the **most managed** option that fits the workload to minimize what you operate.

# Flash Cards

Q: What is an Azure Virtual Machine and where does it sit on the service-model spectrum?
A: A cloud computer where you control the OS and everything above it — Infrastructure as a Service (IaaS). It offers the most control but you maintain the OS.

Q: What is Azure App Service for?
A: Hosting web apps, REST APIs, and back ends on a fully managed (PaaS) platform — you deploy code or a container and Azure runs, patches, and scales the platform.

Q: When should you use Azure Functions?
A: For short, event-driven pieces of code (HTTP request, timer, new file, queue message). On the Consumption plan they scale automatically (to zero when idle) and bill per execution.

Q: What is the difference between Container Instances, Container Apps, and AKS?
A: ACI runs a single container simply; Container Apps is a serverless platform for containers/microservices with scale-to-zero; AKS is managed Kubernetes for full orchestration control.

Q: What is a VM Scale Set?
A: A group of identical VMs that automatically scale in and out and load-balance across instances — for when you need many elastic VMs.

Q: What's a good default rule when choosing compute?
A: Choose the most managed option that fits the workload, so you run less infrastructure yourself.

# Exercises

### Easy
List Azure's five compute options from this lesson and write one sentence on what each is best for.

### Medium
For each scenario, pick a compute service and justify it: (a) a new blog, (b) resizing images on
upload, (c) a legacy Windows app that needs a specific OS, (d) a set of containerized microservices.

### Challenging
Take an app you know (or imagine one) and argue for two *different* compute choices for it, listing the
trade-offs of each in control, scaling, and operational effort. Which would you pick and why?

# Further Reading

- Microsoft Learn — *Choose an Azure compute service*: <https://learn.microsoft.com/azure/architecture/guide/technology-choices/compute-decision-tree>
- Microsoft Learn — *Azure Virtual Machines overview*: <https://learn.microsoft.com/azure/virtual-machines/overview>
- Microsoft Learn — *App Service overview*: <https://learn.microsoft.com/azure/app-service/overview>
- Microsoft Learn — *Azure Functions overview*: <https://learn.microsoft.com/azure/azure-functions/functions-overview>
