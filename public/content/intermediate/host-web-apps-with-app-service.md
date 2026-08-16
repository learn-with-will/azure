---
id: lesson-10
slug: host-web-apps-with-app-service
title: "Host Web Apps with App Service"
level: intermediate
order: 10
duration: 20
tags:
  - app-service
  - paas
  - deployment-slots
  - scaling
  - tls
summary: "Deploy a web app or API on Azure App Service — the App Service plan that provides the compute, deploying code with the CLI, scaling up versus out, zero-downtime releases with deployment slots, and adding a custom domain with free managed TLS."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain the relationship between an **App Service plan** and a **web app**.
- Deploy a web app to **App Service** with the Azure CLI.
- Distinguish **scaling up** from **scaling out**, and enable **autoscale**.
- Use **deployment slots** for zero-downtime releases and add a **custom domain with TLS**.

# Why It Matters

App Service is the fastest way to get a website or API into production without managing servers. It
handles the OS, patching, load balancing, HTTPS, and scaling, so you ship code instead of babysitting
infrastructure. Understanding its plans and features lets you release safely and scale smoothly.

# Concept Explanation

### App Service plan vs web app

Two resources work together:

- **App Service plan** — the **compute** your apps run on: a region, an OS (Linux or Windows), a size,
  and a **pricing tier**. It's the "server farm" you rent.
- **Web app** (App Service app) — your actual application, which runs **inside** a plan. **Multiple
  apps can share one plan** (and its cost).

**Pricing tiers** range from **Free (F1)** and **Basic (B1)** — good for learning — up to **Standard**,
**Premium**, and beyond, which add autoscale, deployment slots, and more power.

### Deploying your code

App Service supports many **runtime stacks** (.NET, Node.js, Python, Java, PHP) and **containers**. A
quick way to deploy from a project folder:

```bash
# From your app's folder — creates the plan + app and deploys in one step
az webapp up --name my-unique-app-name --resource-group web-rg --runtime "NODE:20-lts"
```

You can also deploy with a **ZIP package**, from a **container image**, or via **CI/CD** (lesson 20).

### Scaling up vs scaling out

- **Scale up (vertical)** — move to a **bigger plan** (more CPU/RAM) for a single, heavier instance.
- **Scale out (horizontal)** — run **more instances** of the app behind App Service's built-in load
  balancing. On **Standard and above**, you can **autoscale** out and in based on rules (for example,
  CPU) or a schedule.

Scaling out usually gives better resilience and handles spikes; scaling up helps a single heavy app.

### Deployment slots

On **Standard and higher**, a web app can have **deployment slots** — live copies like **staging**. You
deploy and test in staging, then **swap** it with production. The swap is **near-instant** and warms the
app first, giving **zero-downtime** releases and an easy rollback (swap back).

### Custom domains and TLS

You can map your own domain (like `www.contoso.com`) to the app and secure it with **HTTPS**. App
Service offers a **free managed certificate** for supported custom domains, so you don't have to buy or
manually renew a certificate for basic scenarios.

# Key Terminology

- **App Service plan** — the compute (region, OS, size, tier) apps run on.
- **Web app** — your application running inside a plan.
- **Runtime stack** — the language/runtime (or container) the app uses.
- **Scale up / scale out** — bigger instance vs more instances (autoscale on Standard+).
- **Deployment slot** — a live copy (e.g., staging) you can swap with production.
- **Managed certificate** — free App Service TLS certificate for custom domains.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Handling load | **Scale up** (bigger plan) | **Scale out** (more instances) | Scale out for spikes and resilience (autoscale); scale up for a single resource-heavy app. |
| Releasing | **Deploy to production** directly | **Swap from a staging slot** | Slots give zero-downtime releases and instant rollback; direct deploy is simpler but riskier. |
| Tier | **Free/Basic** | **Standard/Premium** | Free/Basic for learning and small apps; Standard+ for autoscale, slots, and production SLAs. |

# Worked Example

Create a plan and app explicitly, deploy a build, then add a staging slot:

```bash
# 1. Create an App Service plan (Linux, Basic tier)
az appservice plan create \
  --name web-plan --resource-group web-rg \
  --sku B1 --is-linux

# 2. Create a web app on that plan (Node.js runtime)
az webapp create \
  --name my-unique-app-name --resource-group web-rg \
  --plan web-plan --runtime "NODE:20-lts"

# 3. (Standard+ needed) Add a staging slot, then swap it into production
az webapp deployment slot create \
  --name my-unique-app-name --resource-group web-rg --slot staging
az webapp deployment slot swap \
  --name my-unique-app-name --resource-group web-rg --slot staging --target-slot production
```

# Real World Analogy

An **App Service plan** is like renting **space in a serviced office building** — the landlord handles
power, cleaning, and security (the OS and platform). Your **web app** is your **office** inside it; you
can rent several offices on the same lease. A **deployment slot** is a **rehearsal room**: you set
everything up there, then swap it with the real office overnight so customers never see the disruption.

# Examples

## Example 1 — Basic: ship a site in minutes

A developer runs `az webapp up` from their project folder. App Service creates the plan and app, deploys
the code, and returns a public HTTPS URL — no servers configured.

**Why this works:** PaaS handles the OS, TLS, and hosting, so a site goes live immediately.

## Example 2 — Real-world: safe releases with slots

A team deploys each release to a **staging slot**, runs smoke tests, then **swaps** to production. If
something's wrong, they **swap back** in seconds.

**Why this works:** slots turn releases into instant, reversible swaps instead of risky in-place
deployments.

## Example 3 — Pitfall: Free tier for a busy app

An app on the **Free** tier hits its quotas and can't autoscale, so it slows and stalls under real
traffic.

**Why this bites:** Free/Basic tiers lack autoscale and slots and have limits. Production apps belong on
**Standard or higher**.

# Common Mistakes

- **Confusing the plan with the app.** The plan is the compute; the app runs inside it (and several apps
  can share a plan).
- **Expecting autoscale or slots on Free/Basic.** Those need **Standard+**.
- **Deploying straight to production.** Use a staging slot and swap.
- **Manually managing certificates.** Use the free **managed certificate** for custom domains where
  possible.

# Best Practices

- Use **deployment slots** (Standard+) for zero-downtime releases and easy rollback.
- Prefer **scale out with autoscale** for spiky traffic; scale up for single heavy apps.
- Put production apps on **Standard or higher** for SLAs, slots, and autoscale.
- Add a **custom domain** with the **free managed certificate** for HTTPS.

# Summary

- An **App Service plan** provides the compute; **web apps** run inside it and can share a plan.
- Deploy with `az webapp up`, ZIP, containers, or CI/CD across many **runtime stacks**.
- **Scale up** (bigger) vs **scale out** (more instances, with **autoscale** on Standard+).
- **Deployment slots** enable zero-downtime swaps; **managed certificates** give free HTTPS on custom
  domains.

# Flash Cards

Q: What's the difference between an App Service plan and a web app?
A: The plan is the compute (region, OS, size, pricing tier) that apps run on; the web app is your application running inside a plan. Multiple apps can share one plan.

Q: What's the difference between scaling up and scaling out in App Service?
A: Scaling up moves to a bigger plan (more CPU/RAM per instance); scaling out runs more instances behind built-in load balancing. Autoscale (Standard+) adjusts the number of instances automatically.

Q: What are deployment slots used for?
A: Live copies of an app (like staging) where you deploy and test, then swap into production for a near-instant, zero-downtime release — and swap back to roll back.

Q: Which App Service tiers support autoscale and deployment slots?
A: Standard and higher. Free and Basic tiers don't include autoscale or slots and have quota limits.

Q: How can you get HTTPS on a custom domain in App Service without buying a certificate?
A: Use an App Service managed certificate — a free TLS certificate for supported custom domains that Azure provisions and renews.

Q: Name three ways to deploy code to App Service.
A: `az webapp up` from a project folder, a ZIP package or container image, and CI/CD pipelines (GitHub Actions or Azure Pipelines).

# Exercises

### Easy
Explain the relationship between an App Service plan and a web app, and why several apps might share one
plan.

### Medium
Deploy a small web app with `az webapp up`, open its HTTPS URL, then scale the plan out to two instances
(or describe the autoscale rule you'd set).

### Challenging
Design a zero-downtime release process using deployment slots: describe the steps from building a new
version to swapping it live, including how you'd roll back if a problem appears after the swap.

# Further Reading

- Microsoft Learn — *App Service overview*: <https://learn.microsoft.com/azure/app-service/overview>
- Microsoft Learn — *App Service plans*: <https://learn.microsoft.com/azure/app-service/overview-hosting-plans>
- Microsoft Learn — *Set up staging environments (deployment slots)*: <https://learn.microsoft.com/azure/app-service/deploy-staging-slots>
- Microsoft Learn — *Add a TLS/SSL certificate in App Service*: <https://learn.microsoft.com/azure/app-service/configure-ssl-certificate>
