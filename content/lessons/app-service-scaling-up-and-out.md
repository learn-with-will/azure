---
slug: app-service-scaling-up-and-out
title: "Scaling App Service: Scale Up vs Scale Out"
topic: app-service-and-serverless
kind: technique
summary: "Increase instance hardware power (scale up) or add additional parallel worker instances (scale out)."
tags: [scaling, autoscale, performance, app-service]
related: [app-service-architecture-and-plans, vertical-vs-horizontal-autoscale-rules, deployment-slots-and-zero-downtime]
---
> **In one line:** Scale up to upgrade hardware CPU/RAM; scale out to add parallel worker instances behind the load balancer.

## The idea

When application traffic surges or database queries slow down, Azure App Service provides two fundamental scaling mechanisms:

1. **Scale Up (Vertical Scaling):** Upgrades the underlying App Service plan to a higher pricing tier with more powerful hardware specs—adding faster CPU cores, more gigabytes of RAM, or unlocking advanced platform features like deployment slots and dedicated virtual networking.
2. **Scale Out (Horizontal Scaling):** Increases the number of parallel virtual machine instances running your application. App Service's integrated frontend load balancers automatically distribute incoming HTTP requests across all active worker instances.

Scale Out can be configured manually (setting a fixed instance count, e.g., 5 instances) or automated via **Autoscale Rules**. Autoscale dynamically adjusts worker instance counts based on real-time performance metrics (e.g., scaling out when average CPU exceeds 75% for 5 minutes, and scaling in when CPU drops below 30%).

| Scaling Dimension | Action | Disruption | Scaling Ceiling |
|---|---|---|---|
| **Scale Up** | Upgrades hardware tier (e.g. B1 to P2v3) | Brief warm-up migration | Max available hardware SKU |
| **Scale Out** | Adds parallel worker instances | **Zero downtime** | Up to 30 (P3v3) or 100 (ASE) |
| **Autoscale** | Metric-based instance adjustment | **Zero downtime** | Bounded by Min / Max limits |

> **Tip:** Design web applications to be completely stateless so that user sessions can be balanced across any scaled-out worker instance without relying on sticky sessions or local server disk caching.

## See it

Configure automated horizontal autoscale rules on an App Service Plan using the Azure CLI:

```bash
# Create an autoscale profile bounded between 2 and 10 worker instances
az monitor autoscale create   --resource-group rg-learning-portal   --name autoscale-web-plan   --resource "plan-web-prod"   --resource-type "Microsoft.Web/serverfarms"   --min-count 2   --max-count 10   --count 2   --output table

# Add a rule to scale out by 1 instance whenever CPU exceeds 75% for 5 minutes
az monitor autoscale rule create   --resource-group rg-learning-portal   --autoscale-name autoscale-web-plan   --condition "Percentage CPU > 75 avg 5m"   --scale out 1   --cooldown 5
```

The autoscale rule constantly monitors performance counters and dispatches new worker instances automatically without operator intervention.

## Go deeper

App Service provides a feature called **Health Check**. You provide a path (e.g., `/healthz`). App Service pings this path on every worker instance every minute. If an instance returns HTTP 500 or fails to respond, the internal load balancer stops routing traffic to that specific instance and triggers an automatic instance replacement.

Autoscale rules can also be triggered by custom web metrics, such as HTTP queue length or response latency. Furthermore, you can define automated notifications to alert DevOps channels in Microsoft Teams or Slack via Azure Monitor action groups whenever a scale-out event occurs, ensuring full visibility into traffic surges.

## Watch out

- Failing to configure a cooldown period (e.g., 5 to 10 minutes) on autoscale rules causes rapid, erratic flapping between scaling in and out.
- Scaling up (vertical) requires migrating to new host hardware, which may cause a brief connection hiccup.

## Remember

- Scale up adds more CPU and RAM to instances; scale out adds more parallel instances.
- Autoscale dynamically adjusts instance counts between defined minimum and maximum boundaries based on metrics.
- Stateless application architectures are mandatory for seamless horizontal scaling.
