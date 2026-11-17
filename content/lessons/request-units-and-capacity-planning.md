---
slug: request-units-and-capacity-planning
title: "Request Units (RU/s) and Throughput Capacity"
topic: relational-and-nosql-databases
kind: concept
summary: "Measure normalized CPU, memory, and IOPS consumption using Request Units for provisioned and serverless modes."
tags: [request-units, rus, throughput, capacity, billing]
related: [cosmos-db-architecture-and-multi-model-apis, cosmos-db-partition-key-selection, cosmos-db-five-consistency-levels]
---
> **In one line:** Request Units normalize CPU, memory, and IOPS into a single currency for measuring database operations.

## The idea

In traditional databases, sizing requires calculating physical CPU cores, RAM gigabytes, and storage IOPS independently. Azure Cosmos DB abstracts physical hardware through a normalized currency called **Request Units (RUs)**.

One **Request Unit (1 RU)** represents the computing resources required to read a standard **1 KB JSON document** by its unique `id` and partition key using point-read execution.

More complex operations consume more RUs:
- Writing a 1 KB document typically consumes ~5 RUs (because indexing, replication across three replicas, and transaction commit logging require write overhead).
- Queries with `WHERE` clauses, sorting (`ORDER BY`), aggregations, or regex matching consume significantly higher RUs depending on index utilization and scanned document volume.

Cosmos DB supports three capacity modes:
1. **Provisioned Throughput (Manual):** You reserve a dedicated throughput capacity (e.g., 1,000 RU/s). Billed hourly for the reserved capacity whether you use it or not.
2. **Autoscale Throughput:** You set a maximum threshold (e.g., 4,000 RU/s). Cosmos DB scales between 10% of maximum (400 RU/s) and 100% (4,000 RU/s) instantly based on real-time load.
3. **Serverless Mode:** Billed strictly per Request Unit consumed. Scales down to zero. Ideal for dev/test and applications with bursty, unpredictable, or light traffic.

| Capacity Mode | Scaling Behavior | Billing Model | Best Use Case |
|---|---|---|---|
| **Manual Provisioned** | Fixed static throughput | Fixed hourly charge | Sustained, predictable production traffic |
| **Autoscale** | Scales between 10% and 100% | Hourly based on highest scaled hour | Unpredictable or cyclical production traffic |
| **Serverless** | Dynamic scaling to zero | Billed per million RUs consumed | Dev/test, low-volume background jobs |

> **Tip:** If client applications exceed the provisioned RU/s capacity in a given second, Cosmos DB rate-limits the requests, returning **HTTP 429 (Too Many Requests)**. Cosmos DB SDKs automatically retry 429 errors with backoff.

## See it

Create a container with Autoscale throughput provisioned using the Azure CLI:

```bash
# Create a container with autoscale throughput capping at 4,000 RU/s
az cosmosdb sql container create   --account-name cosmos-portal-prod-001   --resource-group rg-learning-portal   --database-name storefront   --name products   --partition-key-path "/category"   --max-throughput 4000   --output table

# Query the container throughput settings
az cosmosdb sql container throughput show   --account-name cosmos-portal-prod-001   --resource-group rg-learning-portal   --database-name storefront   --name products   --query "resource.autoscaleSettings.maxThroughput" -o tsv
```

The container automatically scales between 400 RU/s during idle periods and 4,000 RU/s during high-demand catalog browsing spikes.

## Go deeper

Every Cosmos DB SDK response header includes `x-ms-request-charge`. This value indicates the exact fractional number of RUs consumed by that specific query or write operation. Profiling this header in your application telemetry allows engineers to optimize queries and add composite indexes to reduce operational costs.

## Watch out

- Over-indexing collections wastes write RUs; by default, Cosmos DB indexes every single property in every document.
- Frequent HTTP 429 responses indicate that your partition key is creating a hot partition or your provisioned RU/s ceiling is too low.

## Remember

- A Request Unit (RU) normalizes CPU, memory, and IOPS into a single operational currency.
- 1 RU equals the cost of reading a 1 KB document by its ID and partition key.
- Autoscale automatically adjusts throughput between 10% and 100% of your configured maximum limit.
