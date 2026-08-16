---
id: lesson-11
slug: serverless-with-azure-functions
title: "Serverless with Azure Functions"
level: intermediate
order: 11
duration: 20
tags:
  - functions
  - serverless
  - triggers
  - bindings
  - consumption
summary: "Build event-driven serverless code with Azure Functions — how triggers start a function and bindings connect it to data, the hosting plans (Consumption scales to zero but can cold-start; Premium keeps instances warm), what serverless is good and bad at, and creating a function app with the CLI."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what **Azure Functions** is and how **triggers** and **bindings** work.
- Compare the **Consumption** and **Premium** hosting plans, including **cold starts**.
- Recognize workloads that suit serverless — and those that don't.
- Create a **function app** with the Azure CLI.

# Why It Matters

Serverless lets you run code without provisioning or managing servers, and pay only when it runs. For
event-driven work — reacting to an HTTP call, a new file, a queue message, or a schedule — Functions is
often the simplest, cheapest option. Knowing its model and limits helps you use it where it shines and
avoid where it doesn't.

# Concept Explanation

### Triggers and bindings

Every function has exactly **one trigger** — the event that **starts** it:

- **HTTP** — a web request (build a lightweight API).
- **Timer** — a schedule (like a cron job).
- **Queue / Blob / Event Grid / Service Bus** — a new message, a new file, or an event.

**Bindings** connect a function to data **declaratively**, so you write less boilerplate:

- An **input binding** brings data *in* (for example, read a row).
- An **output binding** sends data *out* (for example, write a message to a queue).

For instance: a **Blob trigger** fires when an image is uploaded; an **output binding** writes a
thumbnail back to storage — with little glue code.

### Function app and hosting plans

A **function app** is the deployment and management unit; it contains one or more functions, runs on a
**plan**, and uses an associated **storage account**. The plan controls scaling and cost:

- **Consumption plan** — true serverless: **scales automatically, including to zero** when idle, and you
  **pay per execution** (plus a free monthly grant). The trade-off is possible **cold starts** — a short
  delay when a new instance spins up after idle time. Functions here also have an execution **time
  limit**.
- **Premium plan** — keeps **pre-warmed** instances (no cold starts), allows longer runs and VNet
  integration, for more demanding or latency-sensitive work at higher cost.
- **Dedicated (App Service) plan** — run functions on an existing App Service plan.

(Azure also offers a newer **Flex Consumption** plan; check the docs for current options.)

### Languages and statelessness

Functions support **C#, JavaScript/TypeScript, Python, Java, and PowerShell**. Treat each function as
**stateless** — don't rely on data staying in memory between runs, because instances come and go. Store
state in a database or storage.

### What serverless is good (and bad) at

- **Good:** event-driven tasks, bursty/spiky workloads, scheduled jobs, glue between services, and
  APIs that can tolerate occasional cold starts.
- **Not ideal:** long-running or always-on processes, or anything needing constant sub-second response
  with zero warm-up (use Premium or a different service).

# Key Terminology

- **Azure Functions** — a serverless, event-driven compute service.
- **Trigger** — the single event that starts a function.
- **Binding** — a declarative connection to data (input or output).
- **Function app** — the unit that hosts one or more functions on a plan.
- **Consumption plan** — pay-per-execution, scales to zero, may cold-start.
- **Cold start** — the startup delay when a new instance spins up after idle.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Hosting plan | **Consumption** (scale to zero) | **Premium** (pre-warmed) | Consumption for spiky, cost-sensitive work that tolerates cold starts; Premium for low latency, long runs, or VNet needs. |
| Workload fit | **Event-driven / short** | **Long-running / always-on** | Functions suit short, event-driven tasks; use containers/App Service for long-running services. |
| Connecting data | **Bindings** | **Manual SDK calls** | Bindings cut boilerplate for common sources; SDK calls for full control or unsupported sources. |

# Worked Example

Create the resources for a function app (storage + a Consumption function app):

```bash
# 1. Resource group
az group create --name fn-lab-rg --location eastus

# 2. Functions need an associated storage account (globally unique, lowercase)
az storage account create \
  --name fnlabstore$RANDOM --resource-group fn-lab-rg \
  --location eastus --sku Standard_LRS

# 3. Create a Consumption-plan function app (Node.js runtime)
az functionapp create \
  --name my-unique-fn-app --resource-group fn-lab-rg \
  --storage-account <your-storage-account> \
  --consumption-plan-location eastus \
  --runtime node --functions-version 4
```

You'd then add functions (each with a trigger) locally with the Azure Functions Core Tools and deploy
them. On Consumption, the app costs essentially nothing while idle.

# Real World Analogy

A Function is like a **motion-sensor light**. It stays off (scaled to zero) and costs nothing until
**something happens** (the **trigger** — someone walks by). Then it switches on, does its job, and turns
off again. A **cold start** is the brief flicker as it powers up. A **Premium plan** is leaving a dim
pilot light on so there's no flicker — comfier, but you pay to keep it warm.

# Examples

## Example 1 — Basic: a scheduled cleanup

A timer-triggered function runs every night to delete temporary files. It exists only to run on a
schedule and costs almost nothing.

**Why this works:** a scheduled, short task is a perfect fit for serverless.

## Example 2 — Real-world: process uploads

When a user uploads an image to Blob storage, a **blob-triggered** function generates a thumbnail and
writes it back via an **output binding**. Traffic spikes at lunchtime; the app scales out and back
automatically.

**Why this works:** event-driven, bursty work scales seamlessly and you pay only for actual runs.

## Example 3 — Pitfall: a long batch job on Consumption

A team runs a multi-hour data job as a Consumption function and hits the execution **time limit**, so it
fails partway.

**Why this bites:** Consumption functions have a maximum run time. Long jobs need Premium/Dedicated, a
container, or a different design (e.g., breaking the work into pieces).

# Common Mistakes

- **Storing state in memory between runs.** Instances are transient — persist state externally.
- **Ignoring cold starts for latency-critical APIs.** Use Premium (pre-warmed) if warm-up delay is
  unacceptable.
- **Running long jobs on Consumption.** Respect the time limit; choose the right plan or split the work.
- **Reinventing glue code.** Use **bindings** for common inputs/outputs.

# Best Practices

- Keep functions **small, single-purpose, and stateless**.
- Use **bindings** to reduce boilerplate for common data sources.
- Pick **Consumption** for spiky/cheap workloads and **Premium** when you need no cold starts, longer
  runs, or VNet.
- Store secrets in **Key Vault** and connection info in app settings (lesson 16), not in code.

# Summary

- **Azure Functions** runs event-driven code: one **trigger** starts a function; **bindings** connect it
  to data declaratively.
- A **function app** hosts functions on a plan and uses a storage account.
- **Consumption** scales to zero and bills per run (with possible **cold starts** and a time limit);
  **Premium** stays warm for demanding work.
- Serverless suits **short, event-driven, bursty** tasks — not long-running, always-on processes.

# Flash Cards

Q: What is the difference between a trigger and a binding in Azure Functions?
A: A trigger is the single event that starts a function (HTTP, timer, queue, blob, etc.). Bindings declaratively connect the function to data — input bindings bring data in, output bindings send data out.

Q: What does the Consumption plan give you, and what's the trade-off?
A: Automatic scaling including to zero and pay-per-execution billing. The trade-offs are possible cold starts (startup delay after idle) and a maximum execution time.

Q: What is a cold start?
A: The short delay when Azure spins up a new instance to run a function after it has been idle. The Premium plan avoids this by keeping instances pre-warmed.

Q: What kinds of workloads suit Azure Functions?
A: Short, event-driven, bursty, or scheduled tasks and glue logic. Long-running or always-on processes are a poor fit for the Consumption plan.

Q: Why should function code be stateless?
A: Because instances are created and destroyed dynamically, so anything kept only in memory can be lost between runs. Persist state in a database or storage.

Q: What is a function app?
A: The deployment and management unit that contains one or more functions, runs on a hosting plan, and uses an associated storage account.

# Exercises

### Easy
List three triggers and, for each, an example task that trigger would be good for.

### Medium
Create a Consumption-plan function app with the CLI (storage account included). Describe a trigger and
an output binding you would add and what they'd do.

### Challenging
You have an API that must respond in under 100 ms at all times and also a nightly 30-minute report job.
Explain which Functions plan(s) — or alternative services — you'd use for each and why.

# Further Reading

- Microsoft Learn — *Azure Functions overview*: <https://learn.microsoft.com/azure/azure-functions/functions-overview>
- Microsoft Learn — *Triggers and bindings*: <https://learn.microsoft.com/azure/azure-functions/functions-triggers-bindings>
- Microsoft Learn — *Azure Functions hosting options*: <https://learn.microsoft.com/azure/azure-functions/functions-scale>
- Microsoft Learn — *Create a function using the Azure CLI*: <https://learn.microsoft.com/azure/azure-functions/create-first-function-cli-node>
