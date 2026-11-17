---
slug: cosmos-db-five-consistency-levels
title: "The 5 Consistency Levels in Cosmos DB"
topic: relational-and-nosql-databases
kind: concept
summary: "Tune CAP theorem trade-offs across Strong, Bounded Staleness, Session, Consistent Prefix, and Eventual."
tags: [consistency, session-consistency, strong-consistency, cap-theorem]
related: [cosmos-db-architecture-and-multi-model-apis, cosmos-db-global-distribution-and-multi-write, request-units-and-capacity-planning]
---
> **In one line:** Cosmos DB offers five granular consistency levels balancing data synchronization against latency and cost.

## The idea

In distributed databases, the CAP theorem states that a system cannot achieve Consistency, Availability, and Partition Tolerance simultaneously. Traditional databases force an extreme choice: either strict two-phase commit relational consistency (slow and unavailable during network splits) or eventual consistency (fast, but reading stale data).

Azure Cosmos DB breaks this binary choice by offering **five well-defined consistency levels** along a continuous sliding scale:

1. **Strong:** Linearizable consistency. Reads are guaranteed to return the most recent committed write. Requires synchronous multi-datacenter consensus. Highest latency, lowest availability during partitions, and cannot be used with multi-region writes.
2. **Bounded Staleness:** Reads lag behind writes by at most a configurable time window (e.g., 5 seconds) or version count (e.g., 100 updates). Guarantees ordered reads within the bounded window.
3. **Session (Default):** The most popular level. Guarantees **monotonic reads, monotonic writes, and read-your-own-writes** within an active user session token. An individual user always sees their own immediate updates. Ideal for social feeds, shopping carts, and web apps.
4. **Consistent Prefix:** Readers never see out-of-order writes. If updates happen in order A, B, C, a reader may see A, then B, but will never see B before A.
5. **Eventual:** Weakest consistency. No ordering guarantees. Readers eventually see all updates when replication quiesces. Delivers lowest read latency, lowest RU cost, and highest availability.

| Level | Data Freshness Guarantee | Read Latency | RU Cost | Read-Your-Own-Writes |
|---|---|---|---|---|
| **Strong** | Exact instant real-time synchronization | Highest | 2x RUs | Yes |
| **Bounded Staleness** | Lags by at most K versions or T seconds | High | 2x RUs | Yes |
| **Session** | **Guaranteed within user session** | **Low (< 10ms)** | **1x RU** | **Yes (Within session)** |
| **Consistent Prefix** | No out-of-order data reads | Low | 1x RU | No |
| **Eventual** | Stale data possible until converged | Lowest | 1x RU | No |

> **Tip:** **Session consistency** fits over 80% of web and mobile applications. It provides the developer experience of strong consistency for the active user while preserving low RU costs and high distributed availability.

## See it

Inspect and update the default consistency level on a Cosmos DB account using the Azure CLI:

```bash
# Query the current default consistency level configured on the account
az cosmosdb show   --name cosmos-portal-prod-001   --resource-group rg-learning-portal   --query "consistencyPolicy.defaultConsistencyLevel" -o tsv

# Update the default consistency level to Bounded Staleness with custom bounds
az cosmosdb update   --name cosmos-portal-prod-001   --resource-group rg-learning-portal   --default-consistency-level BoundedStaleness   --max-staleness-prefix 1000   --max-interval 10   --output table
```

This ensures that readers worldwide never lag behind primary writes by more than 1,000 updates or 10 seconds.

## Go deeper

The consistency level set on the Cosmos DB account serves as the default baseline. However, individual client application SDK queries can override the consistency level **per request** to a weaker level (e.g., overriding a Session account to Eventual consistency for a reporting query to save RU charges).

## Watch out

- Strong consistency cannot be configured when multi-region writes are enabled on a Cosmos DB account.
- Strong and Bounded Staleness read operations consume double the Request Units of Session or Eventual reads.

## Remember

- Cosmos DB offers 5 consistency levels: Strong, Bounded Staleness, Session, Consistent Prefix, and Eventual.
- Session consistency is the default and optimal level for the vast majority of web applications.
- Stronger consistency levels increase read latency and consume double the Request Units.
