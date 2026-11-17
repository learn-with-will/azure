---
slug: blob-storage-containers-and-tiers
title: "Blob Containers and Access Tiers: Hot, Cool, Cold, Archive"
topic: storage-and-blob
kind: concept
summary: "Optimize storage costs across Hot, Cool, Cold, and offline Archive access tiers for unstructured data."
tags: [blob, access-tiers, hot, cool, archive]
related: [azure-storage-account-types, blob-lifecycle-management-rules, managing-blobs-with-azure-cli]
---
> **In one line:** Blob storage organizes unstructured data into containers with four tiers balancing capacity and access costs.

## The idea

**Azure Blob Storage** is massively scalable object storage for unstructured data (images, video, documents, log files, backups). Blobs are organized inside **Containers** (analogous to directories, but existing in a flat hierarchy under the storage account).

Azure Blob Storage provides four distinct **Access Tiers** that allow organizations to dramatically reduce storage expenses based on data access frequency:

1. **Hot Tier:** Optimized for data that is actively accessed, read, or modified daily. High storage cost per gigabyte, but lowest transaction and read fees.
2. **Cool Tier:** Optimized for data stored for at least 30 days and accessed infrequently (e.g., short-term backups, historical raw logs). Lower storage costs than Hot, but higher read and retrieval fees.
3. **Cold Tier:** Optimized for data stored for at least 90 days and accessed rarely (e.g., historical audit logs, quarterly financial backups). Extremely low storage costs with higher retrieval fees.
4. **Archive Tier:** Offline storage for data stored for at least 180 days that is rarely accessed (e.g., multi-year regulatory records). Lowest storage cost in Azure. **Archive blobs are offline and cannot be read immediately**; they must be **rehydrated** back to Hot or Cool (which takes several hours) before reading.

| Tier | Storage Cost | Read / Retrieval Cost | Min Retention | Latency |
|---|---|---|---|---|
| **Hot** | Highest ($$) | Lowest ($) | None | Milliseconds (Online) |
| **Cool** | Moderate ($) | Moderate ($$) | 30 days | Milliseconds (Online) |
| **Cold** | Low ($) | High ($$$) | 90 days | Milliseconds (Online) |
| **Archive** | Lowest (Pennies) | Highest ($$$$) | 180 days | **Hours (Offline rehydration)** |

> **Watch out:** If you delete or transition a blob out of the Cool tier before 30 days (or Archive before 180 days), Azure bills an **early deletion penalty fee** for the remaining days.

## See it

Create a blob container and inspect the default access tier of your storage account:

```bash
# Create a private blob container named 'customer-documents'
az storage container create   --account-name stportaldata001   --name customer-documents   --auth-mode login   --output table

# Verify container creation and list containers in the storage account
az storage container list   --account-name stportaldata001   --auth-mode login   --query "[].{Name:name, PublicAccess:properties.publicAccess}" -o table
```

By default, newly created containers are completely private, blocking all anonymous public internet reads.

## Go deeper

Rehydrating an archived blob can be done using two priority levels:
- **Standard Priority:** Rehydrates the blob in under 15 hours.
- **High Priority:** Rehydrates small blobs (under 10 GB) in under one hour for emergency data recovery, but incurs higher retrieval transaction fees.

## Watch out

- Never place active, frequently read files into the Archive or Cool tiers; retrieval transaction fees will rapidly exceed Hot storage costs.
- Remember that Archive blobs cannot be read, downloaded, or copied until they complete the rehydration process.

## Remember

- Hot tier is for active data, Cool for 30+ days, Cold for 90+ days, and Archive for 180+ days.
- Archive tier is offline; blobs must be rehydrated over several hours before they can be read.
- Early deletion penalties apply if blobs are removed before their minimum retention period.
