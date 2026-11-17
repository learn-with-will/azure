---
slug: cosmos-db-partition-key-selection
title: "Selecting the Partition Key in Cosmos DB"
topic: relational-and-nosql-databases
kind: pattern
summary: "Distribute data and requests evenly across physical partitions to prevent hot partitions and RU starvation."
tags: [partition-key, partitioning, data-modeling, scalability]
related: [request-units-and-capacity-planning, cosmos-db-architecture-and-multi-model-apis, cosmos-db-five-consistency-levels]
---
> **In one line:** The partition key is the single most important design choice, determining horizontal scaling and data distribution.

## The idea

Azure Cosmos DB achieves infinite horizontal scalability through **partitioning**. As your database grows, Cosmos DB transparently shards data across multiple **Physical Partitions** (each with a 50 GB storage capacity and a 10,000 RU/s maximum throughput ceiling).

When you create a container, you must define a **Partition Key** (a JSON property path, such as `/customerId` or `/tenantId`). Cosmos DB hashes this property value to determine which physical partition stores the document.

The requirements for an effective partition key:
1. **High Cardinality:** Must have thousands or millions of distinct possible values (e.g., `userId`, `deviceId`, `orderId`). A property with only two values (`gender`) is a disastrous partition key.
2. **Even Data Distribution:** Data volume should distribute uniformly across all values to prevent storage imbalances.
3. **Even Request Distribution:** Incoming read and write requests should hit different partition keys rather than concentrating on one value.
4. **Query Alignment:** Ideally, your most frequent and performance-critical queries include the partition key in their `WHERE` clause (Point Query / Single-Partition Query).

| Partition Key Candidate | Cardinality | Risk Assessment | Verdict |
|---|---|---|---|
| `countryCode` | Low (~200 values) | Heavy storage clustering in large countries | **Poor** |
| `gender` | Very Low (2–3 values) | Severe hot partition bottleneck | **Unacceptable** |
| `userId` / `customerId` | Very High (Millions) | Uniform distribution across users | **Excellent for user data** |
| `deviceId` | Very High (Millions) | Even IoT telemetry distribution | **Excellent for IoT metrics** |

> **Watch out:** A **Hot Partition** occurs when a single partition key value receives disproportionate traffic or storage volume. If that single physical partition exceeds its 10,000 RU/s ceiling, requests will be aggressively throttled with HTTP 429, even if total account throughput is largely idle!

## See it

Create a container with a high-cardinality partition key and inspect the container partition key definition:

```bash
# Create a container with /customerId as the partition key path
az cosmosdb sql container create   --account-name cosmos-portal-prod-001   --resource-group rg-learning-portal   --database-name storefront   --name orders   --partition-key-path "/customerId"   --throughput 400   --output table

# Verify the configured partition key definition paths
az cosmosdb sql container show   --account-name cosmos-portal-prod-001   --resource-group rg-learning-portal   --database-name storefront   --name orders   --query "resource.partitionKey.paths" -o json
```

Queries filtering by `WHERE c.customerId = 'cust-1234'` route directly to a single physical partition, executing with minimum RU consumption.

## Go deeper

Queries that do not include the partition key in their `WHERE` clause are called **Cross-Partition Queries**. Cosmos DB must fan out the query across every physical partition in the container and merge the results at the client layer. Cross-partition queries consume high RUs and experience elevated response latency.

## Watch out

- The partition key cannot be changed after a container is created; altering it requires creating a new container and migrating data.
- A single logical partition key value cannot exceed 20 GB of total stored data.

## Remember

- The partition key determines how data and throughput are sharded across physical partitions.
- Choose a property with high cardinality that distributes both storage and query volume evenly.
- Cross-partition queries fan out across all physical partitions, consuming significantly more Request Units.
