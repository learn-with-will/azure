---
slug: cosmos-db-architecture-and-multi-model-apis
title: "Azure Cosmos DB Architecture and APIs"
topic: relational-and-nosql-databases
kind: concept
summary: "Explore Azure Cosmos DB's multi-model engines: NoSQL (Core SQL), MongoDB, Apache Cassandra, Table, and Gremlin."
tags: [cosmos-db, nosql, apis, json, multi-model]
related: [request-units-and-capacity-planning, cosmos-db-partition-key-selection, cosmos-db-five-consistency-levels]
---
> **In one line:** Azure Cosmos DB is a globally distributed, multi-model NoSQL database offering single-digit millisecond latency.

## The idea

**Azure Cosmos DB** is Microsoft's globally distributed, multi-model NoSQL database management service. It is designed from the ground up for modern, horizontally scalable applications that demand guaranteed single-digit millisecond response latencies (typically < 10ms read and write) at any scale, anywhere in the world.

Cosmos DB operates on a multi-model atom-record-sequence (ARS) storage engine. It projects this internal data model through multiple industry-standard API interfaces:

1. **API for NoSQL (Core SQL):** The native default API. Stores data as JSON documents and queries them using familiar SQL syntax (e.g., `SELECT * FROM c WHERE c.category = 'books'`).
2. **API for MongoDB:** Wire-compatible with the MongoDB protocol. Existing Node.js, Python, or Go apps using MongoDB SDKs can point directly to Cosmos DB without code rewrites.
3. **API for Apache Cassandra:** Wire-compatible with Apache Cassandra CQLv4 for wide-column family workloads.
4. **API for Apache Gremlin:** Graph database API for managing nodes and edges in relationship-heavy systems (social networks, recommendation engines, fraud rings).
5. **API for Table:** Key-value store wire-compatible with Azure Table Storage with premium low-latency guarantees.

| API Flavor | Data Model | Client Compatibility | Best Use Case |
|---|---|---|---|
| **NoSQL (Core)** | JSON Documents | Azure Cosmos DB SDKs, SQL dialect | Greenfield cloud apps, e-commerce, catalogs |
| **MongoDB** | BSON / JSON Documents | Standard MongoDB drivers & Mongoose | Migrating existing MongoDB applications |
| **Cassandra** | Wide-column tables | Standard CQL drivers & Apache Spark | Telemetry, time-series, IoT ingestion |
| **Gremlin** | Graph (Nodes & Edges) | Apache TinkerPop Gremlin | Social graphs, fraud detection, identity mapping |
| **Table** | Key-Value pairs | Azure Table SDKs | Simple key-value lookup with high SLA |

> **Tip:** You choose the API when provisioning the Cosmos DB account. The API choice is permanent and cannot be changed on an existing account.

## See it

Provision a Cosmos DB account with the NoSQL API and create a database using the Azure CLI:

```bash
# Provision a Cosmos DB account using the native NoSQL (Core) API
az cosmosdb create   --name cosmos-portal-prod-001   --resource-group rg-learning-portal   --locations regionName=eastus failoverPriority=0 isZoneRedundant=False   --default-consistency-level Session   --output table

# Create a database named 'storefront' inside the Cosmos DB account
az cosmosdb sql database create   --account-name cosmos-portal-prod-001   --resource-group rg-learning-portal   --name storefront   --output table
```

The account is provisioned with the native NoSQL API and configured for Session consistency in the East US region.

## Go deeper

Cosmos DB delivers strict financial **Service Level Agreements (SLAs)** covering not just availability, but also **latency, throughput, and consistency**. Microsoft guarantees that 99% of read and write requests complete in under 10 milliseconds, or customers receive financial billing credits.

## Watch out

- The API selection made at account creation is permanent; you cannot convert a NoSQL account into a MongoDB account later.
- Cosmos DB is a NoSQL engine; attempting to run relational normalization patterns with heavy cross-collection joins is an anti-pattern.

## Remember

- Cosmos DB provides guaranteed single-digit millisecond read/write latency backed by comprehensive SLAs.
- Multiple API options (NoSQL, MongoDB, Cassandra, Gremlin, Table) support various data models.
- The API model is selected during account creation and cannot be changed on an existing account.
