---
slug: azure-sql-service-tiers-and-deployment-options
title: "Azure SQL Deployment: Database, Managed Instance, and VM"
topic: relational-and-nosql-databases
kind: concept
summary: "Choose between fully managed single databases, SQL Managed Instance, and self-hosted SQL Server on VMs."
tags: [azure-sql, sql-database, managed-instance, rdbms, paas]
related: [azure-sql-dtu-vs-vcore-purchasing-models, azure-sql-serverless-and-auto-pause, azure-compute-decision-matrix]
---
> **In one line:** Azure SQL delivers SQL Server capabilities across Single Database, Managed Instance, and IaaS VM deployment shapes.

## The idea

When running relational database workloads on Microsoft SQL Server in the cloud, Azure provides three distinct deployment shapes:

1. **Azure SQL Database (PaaS):** Fully managed, cloud-native relational database service. High availability (99.99%), automated backups, OS patching, and database engine upgrades are managed entirely by Microsoft. Best for new cloud-native web applications and multi-tenant SaaS systems. Available as single databases or grouped into **Elastic Pools** that share compute resources.
2. **Azure SQL Managed Instance (PaaS):** Enterprise platform service designed for seamless 'lift-and-shift' of existing on-premises SQL Server instances. Provides near 100% compatibility with on-premises SQL Server engine features—including cross-database queries, SQL Server Agent jobs, linked servers, and Service Broker—without operating system management.
3. **SQL Server on Azure Virtual Machines (IaaS):** SQL Server installed on a full Windows Server or Linux VM. Delivers 100% full OS and administrative control. You are responsible for OS updates, SQL Server version upgrades, manual backup configuration, and high availability clustering.

| Dimension | Azure SQL Database | Azure SQL Managed Instance | SQL Server on VM (IaaS) |
|---|---|---|---|
| **Service Tier** | PaaS (Single DB / Pool) | PaaS (Full Instance) | IaaS (Virtual Machine) |
| **OS Access** | None (Fully abstract) | None (Fully abstract) | Full Administrator / Root |
| **Instance Compatibility** | Subset (No SQL Agent / Cross-DB) | ~100% compatibility | 100% complete compatibility |
| **High Availability** | Built-in (99.99% SLA) | Built-in (99.99% SLA) | Manual Always On configuration |
| **Patching & Updates** | Automated by Microsoft | Automated by Microsoft | Customer managed |

> **Tip:** Choose **Azure SQL Database** for modern greenfield microservices; choose **SQL Managed Instance** when migrating legacy on-premises databases with cross-database joins and SQL Agent dependencies.

## See it

Create a logical Azure SQL Database server and database using the Azure CLI:

```bash
# Step 1: Create an Azure SQL logical server in East US
az sql server create   --name sql-portal-prod-001   --resource-group rg-learning-portal   --location eastus   --admin-user sqladminuser   --admin-password "P@ssw0rdSecure2026!"   --output table

# Step 2: Create a serverless General Purpose database on that server
az sql db create   --resource-group rg-learning-portal   --server sql-portal-prod-001   --name db-portal-production   --edition GeneralPurpose   --compute-model Serverless   --family Gen5   --capacity 2   --output table
```

The logical server provides an administrative connection endpoint (`sql-portal-prod-001.database.windows.net`) to route incoming client queries.

## Go deeper

For software vendors operating multi-tenant SaaS applications, **Elastic Pools** allow hundreds of individual isolated Azure SQL databases to share a single shared pool of vCores or DTUs. Unused database capacity from inactive tenants is automatically shared with active tenants, dramatically lowering total database licensing and hosting costs.

## Watch out

- Azure SQL Database does not support SQL Server Agent jobs; use Azure Logic Apps, Azure Functions, or Azure Automation for scheduled database tasks.
- Never open SQL Server on an IaaS VM directly to port 1433 on the public internet without a private network or VPN.

## Remember

- Azure SQL Database is a managed PaaS service ideal for modern cloud-native applications.
- SQL Managed Instance provides near 100% on-premises SQL Server feature compatibility for migration.
- SQL on VMs provides full operating system access at the cost of manual administrative maintenance.
