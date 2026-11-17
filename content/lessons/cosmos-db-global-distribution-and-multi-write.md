---
slug: cosmos-db-global-distribution-and-multi-write
title: "Turnkey Global Distribution and Multi-Region Writes"
topic: relational-and-nosql-databases
kind: technique
summary: "Replicate database containers worldwide with single-digit millisecond reads and multi-region active writes."
tags: [global-distribution, multi-region, replication, high-availability]
related: [cosmos-db-five-consistency-levels, azure-regions-and-geographies, cosmos-db-partition-key-selection]
---
> **In one line:** Replicate Cosmos DB globally with single clicks and enable multi-region active writes for global resilience.

## The idea

Scaling an enterprise database across multiple continents historically required complex replication brokers, custom conflict resolution handlers, and fragile VPN tunnels. **Azure Cosmos DB** provides **Turnkey Global Distribution**.

With single CLI commands or portal clicks, you can add or remove Azure regions at any time. Cosmos DB transparently replicates both data and throughput across all configured regions.

Cosmos DB operates in two global replication topologies:
1. **Single-Write, Multi-Read:** One region handles all write transactions. Cosmos DB automatically replicates data asynchronously to all read regions. If the write region suffers an outage, Cosmos DB fails over automatically to the next prioritized regional replica.
2. **Multi-Region Writes (Active-Active):** Every configured region accepts both read and write transactions locally. A user in Tokyo writes to East Asia, and a user in London writes to West Europe with single-digit millisecond response times. Cosmos DB replicates writes across the globe in background milliseconds.

| Dimension | Single-Write Multi-Region | Multi-Region Writes (Active-Active) |
|---|---|---|
| **Write Latency** | Low in primary region; WAN latency for remote regions | **Single-digit ms worldwide** |
| **Read Latency** | Local single-digit ms worldwide | Local single-digit ms worldwide |
| **Availability SLA** | 99.999% for reads, 99.99% for writes | **99.999% for both reads AND writes** |
| **Conflict Resolution** | Not needed (Single master) | Automatic via LWW (Last-Write-Wins) or custom stored procedure |

> **Tip:** When multi-region writes are enabled, concurrent conflicting writes to the same document are resolved automatically by default using **Last-Write-Wins (LWW)** based on timestamp comparison.

## See it

Add a secondary replica region and enable multi-region writes on a Cosmos DB account via the CLI:

```bash
# Add West Europe as a secondary global replication region
az cosmosdb update   --name cosmos-portal-prod-001   --resource-group rg-learning-portal   --locations regionName=eastus failoverPriority=0 isZoneRedundant=False   --locations regionName=westeurope failoverPriority=1 isZoneRedundant=False   --output table

# Enable active-active Multi-Region Writes across all configured locations
az cosmosdb update   --name cosmos-portal-prod-001   --resource-group rg-learning-portal   --enable-multiple-write-locations true   --output table
```

Clients configured with the Cosmos DB SDK automatically discover the closest geographical endpoint and route database writes locally without application code changes.

## Go deeper

Cosmos DB SDKs support **Multi-Homing**. You configure a list of preferred regions in your client initialization code (e.g., `preferredLocations: ['West Europe', 'East US']`). If the local regional datacenter suffers an ungraceful failure, the SDK detects the connectivity loss and automatically reroutes queries to the secondary region without application crashes.

## Watch out

- Enabling an additional replica region doubles your hourly provisioned RU/s billing rate, as throughput is replicated across each location.
- Last-Write-Wins conflict resolution relies on system timestamps; clock skew can occasionally cause the later logical update to overwrite earlier data.

## Remember

- Cosmos DB supports turnkey global distribution across any number of worldwide Azure regions.
- Multi-region writes deliver single-digit millisecond write response times globally and a 99.999% SLA.
- Each added global region replicates your provisioned Request Unit throughput and associated billing.
