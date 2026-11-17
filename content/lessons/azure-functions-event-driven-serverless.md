---
slug: azure-functions-event-driven-serverless
title: "Azure Functions and Event-Driven Serverless"
topic: app-service-and-serverless
kind: concept
summary: "Execute stateless code on demand in response to cloud events without managing underlying servers."
tags: [functions, serverless, event-driven, architecture]
related: [functions-triggers-and-bindings, functions-hosting-plans-and-cold-starts, creating-functions-with-azure-cli]
---
> **In one line:** Azure Functions runs event-driven, micro-billed code on demand without persistent server management.

## The idea

**Serverless computing** does not mean servers do not exist; it means developers never provision, manage, scale, or patch servers. **Azure Functions** is Microsoft's event-driven serverless compute platform.

Instead of paying for an entire virtual machine or App Service plan that sits idle overnight waiting for traffic, Azure Functions executes code strictly in response to external events. When events arrive, Azure instantiates your function, processes the payload, and deallocates compute resources immediately upon completion.

Key architectural concepts of Azure Functions:
- **Event-Driven Execution:** Functions execute when triggered by external events—an HTTP API request, a new file uploaded to Blob storage, a message added to a Service Bus queue, or a cron timer.
- **Micro-Billing (Consumption Plan):** Billed strictly by execution duration (measured in gigabyte-seconds) and total execution count. If your function runs zero times this month, you pay zero dollars for compute.
- **Massive Automatic Scalability:** When thousands of events arrive simultaneously (e.g., a burst of 10,000 queue messages), Azure Functions instantly scales out hundreds of concurrent execution instances.

| Dimension | Traditional Virtual Machine | Azure App Service | Azure Functions |
|---|---|---|---|
| **Billing Model** | Constant hourly server fee | Constant hourly plan fee | Pay-per-execution (Consumption) |
| **Scaling Velocity** | Minutes (booting VMs) | Tens of seconds | Sub-second (scale to hundreds) |
| **Idle Cost** | 100% full billing | 100% full billing | **$0.00 (Zero idle cost)** |
| **Max Execution** | Indefinite (24/7) | Indefinite (24/7) | 5–10 min (Consumption default) |

> **Note:** Functions should be **stateless and idempotent**. Because instances spin up and terminate dynamically, functions must never save state to the local filesystem or assume that subsequent requests land on the same instance.

## See it

Inspect the function apps running in your subscription and verify their execution runtime:

```bash
# List all serverless Function Apps in your resource group
az functionapp list --resource-group rg-learning-portal --query "[].{Name:name, Runtime:runtime, State:state}" -o table

# Inspect consumption usage metrics for your function app
az functionapp show --name func-event-processor --resource-group rg-learning-portal   --query "{HostNames:defaultHostName, Kind:kind, Sku:sku}" -o json
```

The output indicates whether the app is executing on a serverless consumption tier (`functionapp,linux`) with automated event-driven scaling.

## Go deeper

For complex stateful workflows, Microsoft provides **Durable Functions**, an extension of Azure Functions. Durable Functions allows you to write stateful serverless workflows in code (using patterns like Function Chaining, Fan-Out/Fan-In, and Human Interaction Approval) while Azure transparently manages state, checkpoints, and retries.

## Watch out

- Functions running on the Consumption plan have a default execution timeout of 5 minutes (configurable to 10); long batch jobs will be abruptly terminated.
- Writing files to local disk storage inside a function will fail or disappear, as local container filesystems are strictly ephemeral.

## Remember

- Azure Functions executes code strictly in response to cloud events on a pay-per-execution billing model.
- Compute billing drops to zero when functions are not actively executing events.
- Functions must be designed as stateless, idempotent units of execution.
