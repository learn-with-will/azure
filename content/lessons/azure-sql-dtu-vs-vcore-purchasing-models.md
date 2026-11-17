---
slug: azure-sql-dtu-vs-vcore-purchasing-models
title: "Azure SQL Purchasing Models: DTU vs vCore"
topic: relational-and-nosql-databases
kind: concept
summary: "Compare pre-bundled Database Transaction Units (DTU) with flexible, independent compute/storage vCore models."
tags: [dtu, vcore, billing, capacity, azure-sql]
related: [azure-sql-service-tiers-and-deployment-options, azure-sql-serverless-and-auto-pause, azure-cost-management-and-budget-alerts]
---
> **In one line:** The DTU model bundles compute and storage; the vCore model scales CPU, RAM, and storage independently.

## The idea

When configuring Azure SQL Database, you select between two distinct purchasing models that define how hardware capacity is measured and billed:

1. **Database Transaction Unit (DTU) Model:** A blended, pre-packaged measure of compute (CPU), memory, and read/write I/O performance bundled together. Tiers include Basic (light dev/test), Standard (up to 3,000 DTUs for standard workloads), and Premium (for high-transaction systems). Simple and predictable, but compute and storage cannot be scaled independently.
2. **Virtual Core (vCore) Model:** The modern enterprise standard. Provides explicit, independent allocation of compute cores (vCPUs), memory (RAM), and storage gigabytes. Enables you to scale compute independently from storage volume size. Tiers include General Purpose, Business Critical (with low-latency local SSDs), and Hyperscale (for multi-terabyte architectures).

| Feature | DTU-Based Model | vCore-Based Model |
|---|---|---|
| **Measurement Unit** | Blended DTU package | Explicit vCPU count, RAM, and GB storage |
| **Independent Scaling** | No (Storage tied to DTU tier) | Yes (Scale compute and storage separately) |
| **Compute Options** | Provisioned only | Provisioned OR Serverless (Auto-scaling) |
| **Azure Hybrid Benefit** | Not supported | **Supported (Save up to 55% using on-premises licenses)** |
| **Best For** | Simple web apps with fixed needs | Enterprise workloads, hybrid migrations |

> **Tip:** Always choose the **vCore purchasing model** for enterprise production environments. It unlocks the Azure Hybrid Benefit discount, serverless auto-pausing, and independent storage scaling.

## See it

Scale the compute capacity of a vCore-based Azure SQL database using the Azure CLI:

```bash
# Query the active purchasing model and SKU properties of an Azure SQL database
az sql db show   --resource-group rg-learning-portal   --server sql-portal-prod-001   --name db-portal-production   --query "{Edition:sku.tier, CapacityCores:sku.capacity, Family:sku.family}"   -o table

# Scale the database compute capacity up to 4 vCores online without data migration
az sql db update   --resource-group rg-learning-portal   --server sql-portal-prod-001   --name db-portal-production   --capacity 4   --output table
```

Scaling compute takes effect within seconds with minimal failover interruption as the underlying container allocates additional vCores.

## Go deeper

The vCore model unlocks **Azure SQL Database Hyperscale**. Hyperscale architecture separates compute nodes from storage page servers. It supports databases up to **100 TB in size**, instantaneous backups (regardless of database volume size), and rapid database restoration in minutes by utilizing Azure storage snapshots.

The vCore model unlocks **Azure Hybrid Benefit (AHB)** and **Reserved Capacity**. If your organization holds active Software Assurance on on-premises SQL Server core licenses, applying AHB to Azure SQL vCore instances reduces compute costs by up to 55% compared to standard retail pay-as-you-go pricing.

## Watch out

- DTU purchasing model databases cannot be converted to Serverless compute tiers.
- In DTU tiers, reaching the allocated storage limit forces an expensive upgrade to a higher DTU compute tier just to obtain additional disk space.

## Remember

- DTUs offer pre-packaged bundles of CPU, memory, and I/O for simple, predictable workloads.
- vCore provides independent scaling of CPU, memory, and storage with Azure Hybrid Benefit support.
- vCore is the modern recommended model for all enterprise applications and database migrations.
