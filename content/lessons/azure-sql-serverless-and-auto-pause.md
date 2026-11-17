---
slug: azure-sql-serverless-and-auto-pause
title: "Azure SQL Database Serverless Tier"
topic: relational-and-nosql-databases
kind: technique
summary: "Configure auto-scaling compute and automatic pausing during idle periods for intermittent database workloads."
tags: [serverless, azure-sql, auto-pause, cost-saving]
related: [azure-sql-dtu-vs-vcore-purchasing-models, azure-sql-firewall-and-connectivity, azure-sql-service-tiers-and-deployment-options]
---
> **In one line:** Azure SQL Serverless automatically scales vCores based on demand and pauses compute during idle windows.

## The idea

Many business databases experience intermittent, bursty, or unpredictable query traffic. A line-of-business internal portal may see heavy utilization from 9:00 AM to 5:00 PM on weekdays, but sit completely idle on weeknights and weekends. Paying for fixed 24/7 provisioned vCores wastes significant cloud budget.

**Azure SQL Database Serverless** solves this by introducing dynamic auto-scaling and automatic compute pausing within the General Purpose tier:

1. **Dynamic Compute Autoscaling:** You configure a minimum vCore limit (e.g., 0.5 vCore) and a maximum vCore limit (e.g., 4 vCores). As incoming query load increases, Azure automatically scales vCores up within seconds. When demand drops, it scales back down to the minimum limit. You are billed per second strictly for the exact vCores consumed.
2. **Auto-Pausing:** If the database receives zero connections for a configurable inactivity period (default: 60 minutes), Azure automatically pauses the compute engine. **While paused, compute billing drops to $0.00 per hour**; you pay only for disk storage.
3. **Auto-Resumption:** When the next client application connects or a query arrives, the database resumes automatically. The initial resuming connection experiences a brief latency delay (typically 30–60 seconds).

| Feature | Provisioned vCore Compute | Serverless Compute |
|---|---|---|
| **Billing Model** | Flat hourly charge for allocated vCores | Per-second charge for actual vCores consumed |
| **Idle Behavior** | Continues full billing 24/7 | **Pauses compute ($0.00 / hour compute fee)** |
| **Scaling** | Manual resize or scheduled scripts | Automatic real-time scaling within min/max bounds |
| **First Connection Delay** | Sub-millisecond (Always active) | 30–60 seconds on resume after auto-pause |

> **Tip:** For line-of-business applications, dev/test environments, and new applications with unknown query volume, start with Serverless to avoid paying for idle compute capacity.

## See it

Configure auto-pause and min/max vCore boundaries on an Azure SQL database using the Azure CLI:

```bash
# Configure Serverless compute with 0.5 min vCores, 4 max vCores, and 60-min auto-pause
az sql db update   --resource-group rg-learning-portal   --server sql-portal-prod-001   --name db-portal-production   --min-capacity 0.5   --capacity 4   --auto-pause-delay 60   --output table

# Verify the configured auto-pause delay setting
az sql db show   --resource-group rg-learning-portal   --server sql-portal-prod-001   --name db-portal-production   --query "{MinCores:minCapacity, MaxCores:capacity, AutoPauseMinutes:autoPauseDelay}"   -o json
```

The database will now automatically scale between 0.5 and 4 vCores based on query intensity and pause compute billing after one hour of silence.

## Go deeper

Applications connecting to a serverless database that supports auto-pausing should configure connection retry logic with exponential backoff (e.g., using Polly in .NET or standard retry interceptors). This allows the client application to wait gracefully during the 30–60 second database wake-up phase without throwing connection timeout errors to users.

## Watch out

- Do not enable auto-pausing for databases powering customer-facing e-commerce websites where a 45-second resume latency is unacceptable.
- Background maintenance jobs or frequent health-check pings will prevent the database from ever reaching the idle auto-pause threshold.

## Remember

- Azure SQL Serverless automatically scales vCores up and down based on real-time query demand.
- Auto-pausing halts compute billing entirely during periods of zero connection activity.
- Client applications must tolerate a 30–60 second latency delay during the initial database resumption.
