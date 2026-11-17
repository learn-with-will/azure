---
slug: azure-storage-account-types
title: "Azure Storage Account Types and Services"
topic: storage-and-blob
kind: concept
summary: "Explore StorageV2 accounts, Blob storage, Azure Files, Queue storage, and Table storage."
tags: [storage-accounts, blobs, files, queues, tables]
related: [storage-replication-lrs-zrs-grs, blob-storage-containers-and-tiers, azure-files-shares-and-protocols]
---
> **In one line:** An Azure Storage Account provides unified object, file, queue, and NoSQL table cloud persistence.

## The idea

An **Azure Storage Account** is a top-level container that groups together four distinct, highly available, scalable cloud data persistence services under a unified namespace:

1. **Blob Storage (Binary Large Objects):** Massive, unstructured object storage designed for text, media, documents, backups, and data lake big data analytics.
2. **Azure Files:** Fully managed enterprise cloud file shares accessible via standard industry protocols (SMB 3.0 and NFS). Can be mounted directly as network drives on Windows, Linux, and macOS.
3. **Queue Storage:** Reliable asynchronous message queuing for decoupling distributed cloud application components with simple FIFO-style messaging.
4. **Table Storage:** A cost-effective, schemaless key-value NoSQL store for rapid querying of structured non-relational datasets.

Azure supports several account types:
- **General-Purpose v2 (Standard):** The default recommendation. Supports all four services (Blobs, Files, Queues, Tables) with full access tier and redundancy support.
- **Premium Block Blobs:** High-performance SSD storage with low single-digit millisecond latency for transactional analytics.
- **Premium File Shares:** SSD-backed file shares optimized for enterprise I/O workloads.
- **Premium Page Blobs:** Specialized for virtual machine VHD random read/write operations.

| Service | Primary Data Type | Typical Protocol | Primary Use Case |
|---|---|---|---|
| **Blob** | Unstructured objects | HTTP / HTTPS / REST | Media streaming, images, data lake, backups |
| **Files** | Shared folder tree | SMB 3.0 / NFS | Lift-and-shift VM shares, shared app configs |
| **Queue** | Small text messages (up to 64 KB) | REST API | Asynchronous task decoupling, background jobs |
| **Table** | Schemaless entities (Key-Value) | REST API / OData | Diagnostics, IoT telemetry, device metadata |

> **Note:** A storage account name must be globally unique across all of Azure, between 3 and 24 characters in length, and contain ONLY lowercase letters and numbers.

## See it

Create a standard General-Purpose v2 storage account and inspect its service endpoints using the Azure CLI:

```bash
# Provision a standard general-purpose v2 storage account in East US
az storage account create   --name stportaldata001   --resource-group rg-learning-portal   --location eastus   --sku Standard_LRS   --kind StorageV2   --output table

# Query the regional HTTPS REST endpoints generated for each storage service
az storage account show   --name stportaldata001   --resource-group rg-learning-portal   --query "{Blob:primaryEndpoints.blob, File:primaryEndpoints.file, Queue:primaryEndpoints.queue, Table:primaryEndpoints.table}"   -o json
```

The output reveals the dedicated subdomains provisioned for each service: `<name>.blob.core.windows.net`, `<name>.file.core.windows.net`, etc.

## Go deeper

For big data analytics (Spark, Hadoop, Databricks), Azure allows enabling **Hierarchical Namespace (Azure Data Lake Storage Gen2)** on a StorageV2 account. This replaces flat blob virtual folders with true POSIX-compliant directory structures and atomic folder renames, accelerating analytic query performance.

## Watch out

- Do not use legacy General-Purpose v1 or BlobStorage account kinds; StorageV2 provides superior features at lower pricing.
- Storage account names cannot contain hyphens, underscores, or uppercase letters.

## Remember

- StorageV2 accounts provide unified access to Blobs, Files, Queues, and Tables.
- Storage account names must be globally unique and use 3–24 lowercase alphanumeric characters.
- Each storage service is exposed through a dedicated HTTPS subdomain endpoint.
