---
slug: deployment-slots-and-zero-downtime
title: "Deployment Slots and Zero-Downtime Swaps"
topic: app-service-and-serverless
kind: pattern
summary: "Stage revisions in staging slots, warm up caches, and perform instant traffic swaps without downtime."
tags: [deployment-slots, zero-downtime, staging, blue-green]
related: [app-service-architecture-and-plans, deploying-apps-to-app-service, custom-domains-and-managed-tls]
---
> **In one line:** Deployment slots enable blue-green testing in staging before instantly swapping traffic to production.

## The idea

Deploying new application code directly into a live production environment risks downtime, cold-start latency spikes, or uncaught release bugs. **Deployment Slots** in Azure App Service eliminate this risk by implementing managed **blue-green deployments**.

A deployment slot is a fully functional, live web app with its own separate public URL (e.g., `webapp-prod-staging.azurewebsites.net`). It executes within the same App Service Plan as the production slot.

The zero-downtime swap workflow:
1. Deploy new application code to the **Staging slot**.
2. Run automated integration tests and verify that database migrations succeeded.
3. Warm up JIT compilers, cache hierarchies, and database connection pools in staging.
4. Execute a **Swap**. Azure's frontend load balancers instantly reroute public production traffic to the newly warmed instances, while routing the staging URL to the previous release.
5. If an unexpected error is discovered post-swap, execute another swap to instantly roll back to the prior known-good version.

| Slot Setting Type | Behavior on Swap | Example Configuration |
|---|---|---|
| **Swapped Settings** | Swapped with the application code | App framework version, feature flags |
| **Slot-Specific (Sticky)** | Stays with the physical slot | DB connection strings (`Production` vs `Staging`) |

> **Note:** Any setting marked as **Deployment Slot Setting (Sticky)** does not swap. This guarantees your staging slot continues pointing to your test database even after the application code swaps to production.

## See it

Create a staging slot, deploy code, and perform a production swap using the Azure CLI:

```bash
# Create a dedicated staging deployment slot
az webapp deployment slot create   --name webapp-portal-prod-001   --resource-group rg-learning-portal   --slot staging   --output table

# Swap the staging slot into production with zero downtime
az webapp deployment slot swap   --resource-group rg-learning-portal   --name webapp-portal-prod-001   --slot staging   --target-slot production   --output table
```

The swap occurs at the virtual load balancer level through DNS pointer remapping, delivering seamless zero-downtime transitions to active end users.

## Go deeper

App Service supports **Traffic Routing (Testing in Production)**. You can configure the frontend load balancer to route a fractional percentage of real live traffic (e.g., 10%) to your staging slot while sending 90% to production. This enables real-world canary testing before performing a full 100% swap.

Deployment slots support sticky settings, called 'deployment slot settings'. App settings or connection strings marked as sticky stay with the specific slot during swaps (e.g., maintaining a staging database connection on the staging slot), preventing staging configurations from leaking into production.

## Watch out

- All deployment slots share the same App Service Plan hardware capacity; running heavy load tests in staging can impact production performance.
- Forgetting to mark database connection strings as 'slot-specific' will accidentally route production users to staging databases upon swapping.

## Remember

- Deployment slots enable zero-downtime blue-green deployments and instant rollbacks.
- Warming up staging instances before swapping prevents cold-start latency for production users.
- Use slot-specific settings to prevent non-production connection strings from leaking into production.
