---
id: lesson-14
slug: nosql-with-cosmos-db
title: "NoSQL with Cosmos DB"
level: intermediate
order: 14
duration: 20
tags:
  - cosmos-db
  - nosql
  - partitioning
  - consistency
  - request-units
summary: "Azure Cosmos DB, the globally distributed NoSQL database — its multiple APIs, how throughput is measured and billed in Request Units, why the partition key is the most important design choice, the five consistency levels, and turnkey global distribution."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe **Azure Cosmos DB** and its multiple **APIs**.
- Explain **Request Units (RU/s)** and the difference between provisioned and serverless throughput.
- Choose a good **partition key** and explain why it matters.
- Compare the **five consistency levels** and their trade-offs.

# Why It Matters

Not every app fits neatly into tables and rows. Cosmos DB is Azure's globally distributed **NoSQL**
database, built for massive scale, low latency, and worldwide reach. Its two signature design choices —
the **partition key** and the **consistency level** — have outsized effects on performance and cost, so
it's worth understanding them early.

# Concept Explanation

### What Cosmos DB is

**Azure Cosmos DB** is a **fully managed, globally distributed NoSQL** database offering fast,
predictable performance and the ability to replicate data across regions. It's a good fit for
high-scale, low-latency workloads: web and mobile back ends, IoT, catalogs, and personalization.

### Multiple APIs

Cosmos DB speaks several **APIs**, chosen when you create the account:

- **API for NoSQL** — the native, document-based API (recommended for new apps).
- **API for MongoDB** — wire-compatible with MongoDB.
- **API for Apache Cassandra** — for Cassandra workloads.
- **API for Apache Gremlin** — graph data.
- **API for Table** — key/value, similar to Azure Table storage.

The MongoDB/Cassandra/Gremlin/Table APIs help you **migrate existing apps** with minimal changes.

### Throughput: Request Units (RU/s)

Cosmos DB measures cost of operations in **Request Units per second (RU/s)** — a single currency that
bundles the CPU, memory, and I/O an operation uses. Reading a small item costs a little; a complex query
costs more. You provision throughput two ways:

- **Provisioned throughput** — reserve RU/s (manually or with **autoscale** that adjusts within a
  range). Good for steady or predictable load.
- **Serverless** — pay per request, no reservation. Good for spiky or light, intermittent workloads.

### Partitioning: the key decision

Cosmos DB spreads data across **physical partitions** for scale. You choose a **partition key** (a
property of your items), and items with the same key value form a **logical partition**. A **good
partition key** has **high cardinality** (many distinct values) and **spreads reads/writes evenly**. A
**bad** key concentrates traffic on one partition — a **"hot partition"** — throttling performance.
Choose it carefully; it's hard to change later.

### Consistency levels

Distributed databases trade **consistency** against **latency and availability**. Cosmos DB offers
**five** well-defined levels, from strongest to weakest:

1. **Strong** — always read the latest committed write (highest consistency, higher latency).
2. **Bounded staleness** — reads lag by at most a set time or number of versions.
3. **Session** — consistent **within a client session** (read your own writes). **This is the default**
   and a great general choice.
4. **Consistent prefix** — you never see writes out of order, but may see older data.
5. **Eventual** — no ordering guarantee; converges over time (lowest latency, highest availability).

Pick the **weakest level that still meets your correctness needs** for the best performance and cost.

### Global distribution

You can add **regions** to a Cosmos DB account with a click, and optionally enable **multi-region
writes** so users write to the nearest region. Cosmos DB handles replication.

# Key Terminology

- **Azure Cosmos DB** — a managed, globally distributed NoSQL database.
- **API** — the data model/protocol (NoSQL, MongoDB, Cassandra, Gremlin, Table).
- **Request Unit (RU/s)** — the throughput/cost currency for operations.
- **Provisioned vs serverless** — reserved throughput vs pay-per-request.
- **Partition key** — the property that distributes data across partitions.
- **Hot partition** — an overloaded partition from a poor key choice.
- **Consistency level** — one of five points on the consistency–latency spectrum.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Throughput | **Provisioned (autoscale)** | **Serverless** | Provisioned for steady/high load; serverless for spiky or light, intermittent workloads. |
| Consistency | **Strong** | **Session/Eventual** | Strong for strict correctness; Session (default) for most apps; Eventual for max performance where staleness is OK. |
| API | **NoSQL** (native) | **Mongo/Cassandra/etc.** | NoSQL for new apps; a compatibility API to migrate an existing app with few changes. |

# Worked Example

Create a Cosmos DB account (NoSQL API), a database, and a container with a partition key:

```bash
# 1. Account (serverless here for a light workload)
az cosmosdb create \
  --name mycosmos$RANDOM --resource-group data-rg \
  --capabilities EnableServerless

# 2. A database
az cosmosdb sql database create \
  --account-name <account> --resource-group data-rg --name shop

# 3. A container with a well-chosen partition key (/customerId spreads load evenly)
az cosmosdb sql container create \
  --account-name <account> --resource-group data-rg \
  --database-name shop --name orders --partition-key-path "/customerId"
```

Choosing `/customerId` (many distinct customers, evenly accessed) avoids hot partitions far better than,
say, a single constant value.

# Real World Analogy

Think of a giant **library with many reading rooms** (partitions). The **partition key** is how you
decide which room each book goes in. A good rule ("shelve by author's last name") spreads visitors
across rooms; a bad rule ("put every book in Room A") creates a mob in one room while the rest sit empty
— a **hot partition**. **Consistency levels** are how quickly every branch library shows the newest
book: instantly everywhere (**Strong**) or eventually (**Eventual**), trading speed for freshness.

# Examples

## Example 1 — Basic: a product catalog

A shopping app stores products in Cosmos DB with the **NoSQL API**, partitioned by category, and uses
the default **Session** consistency — fast reads, and each user sees their own updates immediately.

**Why this works:** Session consistency suits typical apps, and a sensible partition key spreads load.

## Example 2 — Real-world: go global with a click

A game launches worldwide and adds Cosmos DB **regions** near its players, enabling **multi-region
writes** so each player reads and writes to a nearby region with low latency.

**Why this works:** turnkey global distribution is exactly what Cosmos DB is built for.

## Example 3 — Pitfall: a hot partition

A team partitions telemetry by `deviceType`, but 90% of devices share one type — so one partition takes
almost all the traffic and gets throttled.

**Why this bites:** low-cardinality, unevenly accessed keys create hot partitions. A higher-cardinality
key (like `deviceId`) spreads the load.

# Common Mistakes

- **Choosing a low-cardinality partition key.** It causes hot partitions and throttling.
- **Defaulting to Strong consistency everywhere.** It raises latency/cost; Session is usually enough.
- **Provisioning huge RU/s "to be safe."** Use autoscale or serverless to match real demand.
- **Expecting to change the partition key easily.** It's a foundational choice — plan it up front.

# Best Practices

- Pick a **high-cardinality partition key** that spreads reads and writes evenly.
- Start with **Session** consistency; go stronger or weaker only when the app truly needs it.
- Use **autoscale** or **serverless** to match throughput to demand and control cost.
- Choose the **NoSQL API** for new apps; use a compatibility API mainly to migrate.

# Summary

- **Cosmos DB** is a managed, globally distributed NoSQL database with several **APIs**.
- Throughput is billed in **RU/s**, provisioned (with autoscale) or **serverless**.
- The **partition key** is the critical design choice — high cardinality avoids **hot partitions**.
- Five **consistency levels** (Strong → Eventual, with **Session** the default) trade consistency for
  latency and availability.

# Flash Cards

Q: What is Azure Cosmos DB?
A: A fully managed, globally distributed NoSQL database offering low latency and turnkey multi-region replication, with several APIs (NoSQL, MongoDB, Cassandra, Gremlin, Table).

Q: What is a Request Unit (RU/s)?
A: The currency Cosmos DB uses to measure throughput and cost — a single unit bundling the CPU, memory, and I/O an operation consumes. You provision RU/s (manual or autoscale) or use serverless pay-per-request.

Q: What makes a good partition key?
A: High cardinality (many distinct values) and even distribution of reads and writes, so no single partition becomes a "hot partition." It's hard to change later, so choose carefully.

Q: Name the five Cosmos DB consistency levels from strongest to weakest.
A: Strong, Bounded staleness, Session, Consistent prefix, and Eventual. Session is the default.

Q: Why is Session consistency a common default choice?
A: It guarantees consistency within a client session (you read your own writes) while offering much better latency and availability than Strong — a good fit for most apps.

Q: What is a hot partition and what causes it?
A: A single partition receiving a disproportionate share of traffic, causing throttling. It's caused by a low-cardinality or unevenly accessed partition key.

# Exercises

### Easy
List the five Cosmos DB APIs and say which one you'd choose for a brand-new application.

### Medium
Create a serverless Cosmos DB account with a container, choosing a partition key for an "orders"
collection. Explain why your key avoids hot partitions.

### Challenging
For a social app that must "read your own posts immediately" but can tolerate slightly stale views of
others' posts, choose a consistency level and justify it against Strong and Eventual on latency, cost,
and correctness.

# Further Reading

- Microsoft Learn — *Welcome to Azure Cosmos DB*: <https://learn.microsoft.com/azure/cosmos-db/introduction>
- Microsoft Learn — *Consistency levels*: <https://learn.microsoft.com/azure/cosmos-db/consistency-levels>
- Microsoft Learn — *Partitioning and partition keys*: <https://learn.microsoft.com/azure/cosmos-db/partitioning-overview>
- Microsoft Learn — *Request Units in Azure Cosmos DB*: <https://learn.microsoft.com/azure/cosmos-db/request-units>
