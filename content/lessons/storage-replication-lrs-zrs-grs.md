---
slug: storage-replication-lrs-zrs-grs
title: "Data Redundancy: LRS, ZRS, GRS, and GZRS"
topic: storage-and-blob
kind: concept
summary: "Select local, zone-redundant, geo-redundant, and geo-zone-redundant storage replication models."
tags: [replication, lrs, zrs, grs, gzrs, durability]
related: [azure-storage-account-types, availability-zones-and-datacenter-resilience, region-pairs-and-sovereignty]
---
> **In one line:** Storage redundancy models balance replication costs against datacenter and regional disaster resilience.

## The idea

Azure Storage always maintains multiple copies of your data so that it is protected against hardware failures, disk corruption, and natural disasters. You choose the redundancy tier that matches your business continuity requirements:

1. **Locally Redundant Storage (LRS):** Replicates your data **three times** synchronously within a single physical datacenter in the primary region. Delivers 99.999999999% (11 nines) of durability over a given year. The most economical tier, but vulnerable if the entire physical datacenter building is destroyed.
2. **Zone-Redundant Storage (ZRS):** Replicates your data synchronously across **three separate Availability Zones** in the primary region. Delivers 12 nines of durability and survives complete single-datacenter destruction without downtime.
3. **Geo-Redundant Storage (GRS):** Replicates your data three times via LRS in the primary region, then replicates it asynchronously to a secondary paired region hundreds of miles away (where it is stored three times via LRS). Delivers 16 nines of durability and survives regional disasters.
4. **Geo-Zone-Redundant Storage (GZRS):** The ultimate resilience tier. Replicates across three Availability Zones in the primary region (ZRS), plus replicates asynchronously to the secondary paired region (LRS). Delivers 16 nines of durability with high local availability.

| Redundancy | Physical Copies | Primary Region Resilience | Secondary Region Resilience | Annual Durability |
|---|---|---|---|---|
| **LRS** | 3 copies | Single datacenter | None | 11 nines (99.999999999%) |
| **ZRS** | 3 copies | Across 3 Availability Zones | None | 12 nines (99.9999999999%) |
| **GRS** | 6 copies (3 primary + 3 secondary) | Single datacenter | Yes (Paired region) | 16 nines (99.99999999999999%) |
| **GZRS** | 6 copies (3 primary + 3 secondary) | Across 3 Availability Zones | Yes (Paired region) | 16 nines (99.99999999999999%) |

> **Tip:** By default, the secondary copy in GRS is invisible and unreachable unless a regional failover occurs. To enable read access to the secondary region at all times, choose **Read-Access Geo-Redundant Storage (RA-GRS)**.

## See it

Configure and inspect the replication redundancy setting on an Azure Storage Account using the CLI:

```bash
# Update an existing storage account to Zone-Redundant Storage (ZRS)
az storage account update   --name stportaldata001   --resource-group rg-learning-portal   --sku Standard_ZRS   --output table

# Verify replication health and secondary regional replication status
az storage account show   --name stportaldata001   --resource-group rg-learning-portal   --query "{SKU:sku.name, StatusOfPrimary:statusOfPrimary, StatusOfSecondary:statusOfSecondary}"   -o json
```

The output confirms that storage blocks are synchronously distributed across availability zones in the primary region.

## Go deeper

In an ungraceful regional disaster where Microsoft fails over a GRS account to the secondary region, any asynchronous writes that were pending replication are permanently lost. To evaluate exposure, the storage account exposes a metric called **Last Sync Time**. This timestamp indicates how recently the secondary region was synchronized with primary writes.

## Watch out

- ZRS cannot be enabled in Azure regions that lack Availability Zones.
- Asynchronous replication in GRS means a small Recovery Point Objective (RPO) gap exists during regional disaster failovers.

## Remember

- LRS replicates 3 times in one datacenter; ZRS replicates across 3 Availability Zones.
- GRS replicates across regions to protect against widespread regional disasters.
- RA-GRS unlocks read-only access to secondary regional replicas for high-availability reporting.
