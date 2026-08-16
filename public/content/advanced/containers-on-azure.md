---
id: lesson-18
slug: containers-on-azure
title: "Containers on Azure"
level: advanced
order: 18
duration: 20
tags:
  - containers
  - container-registry
  - container-apps
  - aks
  - aci
summary: "Run containers on Azure — building and storing images in Azure Container Registry, then choosing where they run: Container Instances for single containers, Container Apps for serverless microservices, or Azure Kubernetes Service for full Kubernetes control."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a **container image** and a **registry** are, and build one with **ACR**.
- Compare **Container Instances**, **Container Apps**, and **AKS**.
- Choose the right container service for a workload.

# Why It Matters

Containers package an app with everything it needs so it runs the same on a laptop, a test server, or in
the cloud. Azure offers several ways to run them, from "just run this one container" to "orchestrate
hundreds." Knowing the options — and their operational cost — helps you avoid over-engineering while
still scaling when you need to.

# Concept Explanation

### Images and registries

A **container image** is a packaged, immutable snapshot of an app and its dependencies, usually built
from a **Dockerfile**. Images live in a **registry**. **Azure Container Registry (ACR)** is a **private
registry** for your images, and it can even **build** images in the cloud for you:

```bash
# Create a registry, then build an image from a Dockerfile in the cloud
az acr create --resource-group apps-rg --name myregistry$RANDOM --sku Basic
az acr build --registry <registry> --image web:v1 .
```

Container services then **pull** images from the registry to run them.

### Where containers run: three services

- **Azure Container Instances (ACI)** — run a **single container** (or a small group) quickly, with
  **per-second billing** and no servers to manage. Great for simple tasks, batch jobs, or bursts. It's
  **not** an orchestrator — no built-in rolling updates or complex scaling.
- **Azure Container Apps** — a **serverless** platform for **containers and microservices**, built on
  Kubernetes and **KEDA** under the hood but **without exposing the Kubernetes API**. You get
  **autoscaling (including scale to zero)**, HTTPS **ingress**, **revisions** for safe rollouts, and
  event-driven scaling — a great middle ground.
- **Azure Kubernetes Service (AKS)** — **managed Kubernetes**. Azure runs the control plane; you deploy
  and operate workloads with full Kubernetes power and configurability. Most control and ecosystem, most
  to learn and operate. You pay for the worker nodes.

```text
One container, run and go        → Container Instances (ACI)
Microservices, serverless scaling → Container Apps
Full Kubernetes control          → AKS
```

### Choosing

Start with the **least operational overhead** that meets the need. Reach for **AKS** only when you truly
need Kubernetes-level control (custom operators, specific networking/scheduling, an existing Kubernetes
investment). Many teams are well served by **Container Apps**.

# Key Terminology

- **Container image** — an immutable package of an app and its dependencies.
- **Dockerfile** — the recipe used to build an image.
- **Registry / ACR** — where images are stored; ACR is Azure's private registry (and can build images).
- **ACI** — run single containers serverlessly, billed per second.
- **Container Apps** — serverless containers/microservices with autoscale and ingress.
- **AKS** — managed Kubernetes for full orchestration control.

# Options and Trade-offs

| Workload | Best fit | Why | Watch out for |
| -------- | -------- | --- | ------------- |
| A one-off container/job | **ACI** | Fast, per-second billing, no ops | No orchestration features |
| Microservices / web apps | **Container Apps** | Serverless scaling (to zero), ingress, revisions | Less low-level control than raw Kubernetes |
| Complex, large-scale orchestration | **AKS** | Full Kubernetes ecosystem and control | Real operational overhead and learning curve |
| Storing images | **ACR** | Private, integrated, can build in-cloud | Manage access and image lifecycle |

# Worked Example

Build an image in ACR and run it on Container Apps:

```bash
# 1. Build and push the image to your registry
az acr build --registry <registry> --image web:v1 .

# 2. Create a Container Apps environment, then the app from that image
az containerapp env create --name apps-env --resource-group apps-rg --location eastus

az containerapp create \
  --name web --resource-group apps-rg --environment apps-env \
  --image <registry>.azurecr.io/web:v1 \
  --target-port 8080 --ingress external \
  --min-replicas 0 --max-replicas 5
```

With `--min-replicas 0`, the app **scales to zero** when idle and back up under load — serverless
containers.

# Real World Analogy

A **container image** is a **flat-pack kit** with every part and instruction included, so it assembles
identically anywhere. **ACR** is the **warehouse** storing your kits. Running them is about **how much
logistics you want**: **ACI** is assembling one kit on the spot; **Container Apps** is a **managed
assembly line** that speeds up or pauses automatically; **AKS** is running your **own factory** — total
control, but you staff and run it.

# Examples

## Example 1 — Basic: a scheduled batch job

A nightly data-cleanup job runs as a single container on **ACI**, billed only for the minutes it runs,
then disappears.

**Why this works:** ACI is ideal for short-lived, single-container tasks with no orchestration needs.

## Example 2 — Real-world: serverless microservices

A startup runs several microservices on **Container Apps**. Traffic is spiky, so services **scale to
zero** overnight and scale out during the day, and each release uses **revisions** for safe rollout.

**Why this works:** Container Apps gives Kubernetes-style scaling and rollouts without operating
Kubernetes.

## Example 3 — Pitfall: AKS for a simple app

A small team adopts **AKS** for one modest web app, then spends weeks on cluster upgrades, networking,
and YAML instead of shipping features.

**Why this bites:** Kubernetes is powerful but heavy. For a simple app, **Container Apps** or **App
Service** delivers the same result with far less operational burden.

# Common Mistakes

- **Defaulting to AKS.** Prefer Container Apps/ACI unless you need full Kubernetes.
- **Using public registries for private images.** Use ACR with controlled access.
- **Ignoring scale-to-zero.** Container Apps can idle to zero — big savings for spiky workloads.
- **Baking secrets into images.** Use managed identities and Key Vault (lesson 16), not image layers.

# Best Practices

- Store images in **ACR** with least-privilege access; build with `az acr build` when handy.
- Choose the **least operational** service that fits: ACI → Container Apps → AKS.
- Use **Container Apps** revisions and scale-to-zero for cost-efficient microservices.
- Keep images small and **secrets out of images**; pull configuration/secrets at runtime.

# Summary

- A **container image** (built from a Dockerfile) is stored in a **registry**; **ACR** is Azure's private
  registry and can build images.
- Run containers on **ACI** (single containers), **Container Apps** (serverless microservices, scale to
  zero), or **AKS** (managed Kubernetes).
- Pick the **least operational overhead** that meets the need; reserve **AKS** for genuine Kubernetes
  requirements.

# Flash Cards

Q: What is a container image and where is it stored?
A: An immutable package of an app and its dependencies (built from a Dockerfile). It's stored in a registry — Azure Container Registry (ACR) is Azure's private registry, which can also build images in the cloud.

Q: What is Azure Container Instances (ACI) best for?
A: Running a single container (or small group) quickly and serverlessly, billed per second — good for simple tasks, batch jobs, and bursts. It is not an orchestrator.

Q: What does Azure Container Apps offer?
A: A serverless platform for containers and microservices (built on Kubernetes + KEDA but without exposing the Kubernetes API), with autoscaling including scale-to-zero, HTTPS ingress, and revisions for safe rollouts.

Q: When should you choose AKS over Container Apps?
A: When you need full Kubernetes control — custom operators, specific networking/scheduling, or an existing Kubernetes investment. AKS gives the most power but the most operational overhead.

Q: What's a good default rule for choosing a container service?
A: Pick the least operational overhead that meets the need: ACI for single containers, Container Apps for microservices, and AKS only when you truly need Kubernetes.

Q: Why shouldn't you bake secrets into a container image?
A: Image layers can be extracted and images are shared/stored, so embedded secrets leak. Provide secrets at runtime via managed identities and Key Vault instead.

# Exercises

### Easy
Match each to a service: (a) a nightly single-container job, (b) several autoscaling microservices, (c)
a large system needing custom Kubernetes networking.

### Medium
Create an ACR, build an image with `az acr build`, and deploy it to Container Apps with `--min-replicas
0`. Explain what scale-to-zero does to cost.

### Challenging
A team is unsure whether to use Container Apps or AKS for a set of ten microservices. List the questions
you'd ask to decide, and explain which answers would push you toward each service.

# Further Reading

- Microsoft Learn — *Azure Container Registry introduction*: <https://learn.microsoft.com/azure/container-registry/container-registry-intro>
- Microsoft Learn — *Container Instances overview*: <https://learn.microsoft.com/azure/container-instances/container-instances-overview>
- Microsoft Learn — *Azure Container Apps overview*: <https://learn.microsoft.com/azure/container-apps/overview>
- Microsoft Learn — *Azure Kubernetes Service overview*: <https://learn.microsoft.com/azure/aks/what-is-aks>
