---
slug: vertical-vs-horizontal-autoscale-rules
title: "Scaling Strategies: Vertical vs Horizontal Autoscale"
topic: governance-reliability-architecture
kind: technique
summary: "Implement vertical scaling and dynamic horizontal autoscale rules based on CPU, memory, and queue metrics."
tags: [autoscale, scaling, performance, reliability]
related: [azure-slas-and-composite-availability, azure-backup-and-azure-site-recovery, well-architected-framework-five-pillars]
---
> **In one line:** Scale vertically by resizing compute capacity, or horizontally by dynamically adding and removing instances.

## The idea

Cloud elasticity allows applications to adapt dynamically to changing user demand, preventing server crashes during traffic spikes while saving costs during quiet periods. Architects utilize two fundamental scaling strategies:

1. **Vertical Scaling (Scale Up / Scale Down):**
   - Increasing or decreasing the compute resources (vCPU, RAM, disk speed) of an existing single instance (e.g., resizing a VM from `Standard_D2s_v5` to `Standard_D8s_v5`).
   - **Limitations:** Finite ceiling (bounded by maximum available VM hardware); usually requires a service restart and temporary downtime.
2. **Horizontal Scaling (Scale Out / Scale In):**
   - Adding or removing identical compute instances behind a load balancer (e.g., expanding an App Service Plan from 2 instances to 10 instances).
   - **Advantages:** Virtually limitless elasticity; zero application downtime during scale operations; built-in high availability.

Azure Autoscale Rules:
Azure Monitor provides automated horizontal scaling engines driven by:
- **Metric-Based Rules:** Triggers scale actions based on live telemetry (e.g., scale out when average CPU exceeds 75% for 5 minutes; scale in when CPU drops below 25%).
- **Schedule-Based Rules:** Scales compute according to predictable business schedules (e.g., scale out to 10 instances on Monday morning at 8:00 AM; scale in to 2 instances on Friday evening).

| Scaling Dimension | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
|---|---|---|
| **Mechanism** | Resize instance hardware tier | **Add/remove parallel worker instances** |
| **Downtime** | Typically requires restart | **Zero downtime** |
| **Upper Ceiling** | Maximum single VM size | **Hundreds of parallel instances** |
| **Architecture Requirement** | Legacy stateful apps supported | **Requires stateless application tier** |

> **Tip:** Always configure **Autoscale Cool-Down periods** (typically 5 to 10 minutes). Cool-down timers prevent 'flapping'—a rapid, destabilizing cycle of scaling out and scaling in caused by transient traffic spikes.

## See it

Configure horizontal autoscale rules for an Azure App Service Plan using the Azure CLI:

```bash
# Enable metric-based autoscale on an App Service Plan
az monitor autoscale create   --resource-group rg-learning-portal   --resource plan-portal-prod   --resource-type Microsoft.Web/serverfarms   --min-count 2   --max-count 10   --count 2

# Add a scale-out rule: Add 1 instance when average CPU > 75% for 5 minutes
az monitor autoscale rule create   --resource-group rg-learning-portal   --autoscale-name autoscale-plan-portal-prod   --condition "CpuPercentage > 75 avg 5m"   --scale out 1   --cooldown 5
```

When incoming traffic drives CPU consumption above 75%, Azure Monitor automatically provisions an additional worker instance without dropping client connections.

## Go deeper

For event-driven architectures, scale horizontally using **Queue-Based Scaling**. Instead of scaling on CPU, monitor the queue depth of Azure Service Bus or Storage Queues. If unprocessed queue messages surge above 1,000, autoscale instantly spawns worker instances to process the backlog.

## Watch out

- Horizontal autoscale requires application sessions to be stateless; store user sessions in Azure Cache for Redis or distributed tokens.
- Scale-in rules must be less aggressive than scale-out rules to prevent premature instance termination while work is completing.

## Remember

- Vertical scaling resizes instance capacity; horizontal scaling adds and removes parallel instances.
- Horizontal scaling provides zero-downtime elasticity and requires stateless application design.
- Configure appropriate cool-down windows on autoscale rules to prevent erratic scaling oscillation.
