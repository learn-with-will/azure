---
slug: functions-hosting-plans-and-cold-starts
title: "Hosting Plans: Consumption, Flex, Premium, and Cold Starts"
topic: app-service-and-serverless
kind: concept
summary: "Compare Consumption, Flex Consumption, Premium, and Dedicated plans while mitigating serverless cold starts."
tags: [consumption, premium, flex, cold-start, latency]
related: [azure-functions-event-driven-serverless, app-service-architecture-and-plans, functions-triggers-and-bindings]
---
> **In one line:** Balance cost and latency across Consumption, Flex, and Premium plans to eliminate serverless cold starts.

## The idea

Azure Functions supports three primary hosting plan architectures that dictate scaling behavior, network integration, and execution costs:

1. **Consumption Plan (Serverless):** Scales dynamically from 0 to 200 instances. Billed strictly per execution and gigabyte-seconds of RAM. If an app receives zero traffic for 20 minutes, Azure deallocates all host instances. When the next request arrives, the function experiences a **cold start** (a 1 to 5 second latency delay while Azure boots a new container and initializes runtime frameworks).
2. **Premium Plan (Elastic Premium):** Keeps a configurable pool of pre-warmed instances running 24/7, **completely eliminating cold starts**. Supports enhanced hardware (up to 4 cores, 16 GB RAM), unbounded execution timeouts (up to 60 minutes), and native Regional VNet integration to access private databases.
3. **Flex Consumption Plan:** A modern serverless tier combining pay-as-you-go per-instance pricing with fast scaling, private virtual network connectivity, and configurable always-ready warm instances.
4. **Dedicated Plan:** Runs functions on standard App Service plans alongside regular web apps. Ideal if you already have underutilized App Service compute capacity.

| Feature | Consumption Plan | Flex Consumption | Premium Plan |
|---|---|---|---|
| **Cold Starts** | Yes (when scaling from 0) | Low (Always-ready instances) | **Zero (Pre-warmed instances)** |
| **Scaling Limit** | Up to 200 instances | Fast concurrency control | Up to 100 instances |
| **Max Execution** | 5 to 10 minutes | Up to 30 minutes | Up to 60 minutes |
| **VNet Integration** | No | Yes | Yes (Full enterprise VNet) |
| **Idle Billing** | **$0.00** | Small fee for warm instances | Flat minimum baseline fee |

> **Tip:** For internal batch queues and asynchronous file processors, use the **Consumption Plan** (cold starts do not impact batch jobs). For user-facing customer REST APIs requiring sub-100ms response times, choose the **Premium Plan** or **Flex Consumption**.

## See it

Check the hosting plan tier and pre-warmed instance count for a Function App using the Azure CLI:

```bash
# Query the hosting plan details and compute tier for a function app
az functionapp plan show --name plan-functions-prod --resource-group rg-learning-portal   --query "{Name:name, Tier:sku.tier, Size:sku.size, MaxWorkers:maximumElasticWorkerCount}" -o table

# Inspect always-ready and pre-warmed instance allocations
az functionapp config show --name func-api-prod --resource-group rg-learning-portal   --query "{PreWarmed:preWarmedInstanceCount, MinimumInstances:minTlsVersion}" -o json
```

Pre-warmed instances ensure incoming HTTP requests are served instantly by active worker nodes without latency penalties.

## Go deeper

Cold starts occur in three phases:
1. Allocating physical container hardware in the Azure pool.
2. Booting the runtime host (.NET runtime, Node.js process, Python interpreter).
3. Executing your application startup initialization (establishing database connections, reading configuration).
Minimizing third-party library dependencies and utilizing lazy initialization significantly shortens cold start durations even on Consumption plans.

## Watch out

- Never use the standard Consumption Plan if your functions must connect to private on-premises databases over a Virtual Network.
- Functions on the Premium plan incur continuous minimum baseline hourly billing for their pre-warmed instances regardless of traffic.

## Remember

- The Consumption plan scales to zero and costs nothing when idle, but incurs initial cold-start latency.
- The Premium plan eliminates cold starts with pre-warmed instances and supports private VNet integration.
- Choose hosting plans based on user latency sensitivity, execution duration, and network isolation requirements.
