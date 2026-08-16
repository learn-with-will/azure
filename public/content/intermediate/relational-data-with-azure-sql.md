---
id: lesson-13
slug: relational-data-with-azure-sql
title: "Relational Data with Azure SQL"
level: intermediate
order: 13
duration: 20
tags:
  - azure-sql
  - paas
  - database
  - vcore
  - firewall
summary: "Run relational databases on Azure — the difference between Azure SQL Database (PaaS), SQL Managed Instance, and SQL Server on a VM, the DTU vs vCore purchasing models (including serverless), configuring the firewall, and connecting to run queries, with backups handled for you."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Distinguish **Azure SQL Database**, **SQL Managed Instance**, and **SQL Server on a VM**.
- Compare the **DTU** and **vCore** purchasing models and the **serverless** option.
- Configure the **firewall** and connect to a database to run queries.
- Explain what the platform manages for you (patching, backups, HA).

# Why It Matters

Relational databases power a huge share of business apps. Azure offers several ways to run SQL Server
workloads, from fully managed to fully self-managed. Picking the right one — and the right pricing model
— controls how much you operate and how much you pay. This is one of the most common decisions in real
projects.

# Concept Explanation

### Three ways to run SQL on Azure

They differ by how much Azure manages:

- **Azure SQL Database (PaaS)** — a **fully managed** database service built on the SQL Server engine.
  Azure handles patching, **automated backups**, and high availability. You just design your database.
  Best for **new cloud apps**.
- **SQL Managed Instance (PaaS)** — a managed instance with **near-full SQL Server compatibility**,
  including instance-scoped features. Best for **lift-and-shift** of existing SQL Server databases that
  need those features.
- **SQL Server on an Azure VM (IaaS)** — you install and run **SQL Server yourself** on a VM. **Full
  control**, but you manage the OS, patching, and backups. Best when you need OS-level control or a
  specific configuration.

### Purchasing models: DTU vs vCore

For Azure SQL Database you pick how you buy capacity:

- **DTU (Database Transaction Unit)** — a **bundled** measure of compute, memory, and I/O in simple
  tiers (Basic/Standard/Premium). Easy to reason about for small, steady workloads.
- **vCore (virtual core)** — choose **compute (cores + memory)** and **storage** independently. More
  flexible and transparent, supports the **serverless** compute tier and **Azure Hybrid Benefit** (reuse
  existing licenses). **Microsoft recommends vCore** for most new work.

The **serverless** compute tier (vCore) **auto-scales** compute with demand and can **auto-pause** when
idle to save money — handy for intermittent workloads.

### Deployment shapes

- A **single database** — one isolated database with its own resources.
- An **elastic pool** — several databases **sharing** a pool of resources, smoothing cost when their
  peaks don't coincide.

### The firewall and connecting

A new Azure SQL server **blocks all connections** by default. You add **firewall rules** to allow
specific client IP addresses (or Azure services). Then connect with a **connection string** using tools
like **sqlcmd**, **Azure Data Studio**, or SQL Server Management Studio:

```sql
-- Once connected, it's ordinary T-SQL
SELECT name, create_date
FROM sys.databases
ORDER BY create_date DESC;
```

Prefer **Microsoft Entra authentication** to the database over SQL logins where possible, for centralized
identity and stronger security.

# Key Terminology

- **Azure SQL Database** — fully managed PaaS relational database (SQL Server engine).
- **SQL Managed Instance** — managed instance with near-full SQL Server compatibility.
- **SQL Server on a VM** — self-managed SQL Server (IaaS).
- **DTU** — a bundled compute/memory/I/O purchasing unit.
- **vCore** — a model where you size compute and storage separately (recommended).
- **Serverless (compute tier)** — auto-scaling, auto-pausing compute for intermittent use.
- **Firewall rule** — allows specific client IPs to reach the database.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Service | **Azure SQL Database** (PaaS) | **SQL Server on VM** (IaaS) | PaaS for new apps and least ops; VM when you need OS control or a special setup. |
| Compatibility | **SQL Database** | **SQL Managed Instance** | Managed Instance for lift-and-shift needing instance-level SQL Server features. |
| Purchasing | **DTU** (bundled) | **vCore** (separate compute/storage) | vCore for flexibility, serverless, and licensing benefits; DTU for simple, steady, small workloads. |
| Many small DBs | **Single databases** | **Elastic pool** | Pool when many databases have offset peaks and can share resources cost-effectively. |

# Worked Example

Create a managed Azure SQL Database and allow your client IP through the firewall:

```bash
# 1. Create the logical SQL server (admin login) and a database
az sql server create \
  --name mysqlsrv$RANDOM --resource-group data-rg --location eastus \
  --admin-user sqladmin --admin-password '<StrongP@ssw0rd!>'

az sql db create \
  --resource-group data-rg --server <your-server> \
  --name appdb --compute-model Serverless \
  --edition GeneralPurpose --family Gen5 --capacity 1

# 2. Allow your current public IP to connect
az sql server firewall-rule create \
  --resource-group data-rg --server <your-server> \
  --name my-ip --start-ip-address <your-ip> --end-ip-address <your-ip>
```

Azure now runs the database — including **backups** and **patching** — while you connect and query.

# Real World Analogy

Choosing how to run SQL is like choosing transport for a team. **Azure SQL Database (PaaS)** is a
**taxi**: you say where to go; the driver (Azure) handles the car, fuel, and maintenance. **Managed
Instance** is a **chauffeured company car** that behaves almost exactly like the car you already own.
**SQL Server on a VM** is **buying your own car** — total control, and every oil change is on you.

# Examples

## Example 1 — Basic: a new app database

A startup building a new app picks **Azure SQL Database** on **vCore serverless**. It scales with usage,
pauses when idle overnight, and Azure handles backups — minimal ops, minimal idle cost.

**Why this works:** PaaS + serverless matches a small, variable workload with almost no maintenance.

## Example 2 — Real-world: move a legacy database

A company migrating an on-premises SQL Server app that relies on cross-database queries and SQL Agent
jobs chooses **SQL Managed Instance** for its high compatibility.

**Why this works:** Managed Instance supports instance-level features the app depends on, easing the
move.

## Example 3 — Pitfall: "I can't connect!"

A developer creates a database and immediately fails to connect from their laptop.

**Why this bites:** the server **denies all connections** until you add a **firewall rule** for your
client IP. Add the rule (and prefer Entra authentication) and it connects.

# Common Mistakes

- **Reaching for a VM by default.** PaaS (SQL Database) removes most ops — prefer it for new apps.
- **Forgetting the firewall.** New servers block everything until you allow your IP.
- **Choosing DTU without thinking.** vCore is more flexible and usually recommended.
- **Ignoring serverless for intermittent workloads.** Auto-pause can cut idle cost significantly.

# Best Practices

- Prefer **Azure SQL Database (PaaS)** for new apps; use **vCore** (and **serverless** for intermittent
  use).
- Restrict the **firewall** to needed IPs and use **Entra authentication** where possible.
- Rely on built-in **automated backups** and **point-in-time restore**; test your restore process.
- Use **elastic pools** when you run many small databases with offset peaks.

# Summary

- Azure runs SQL three ways: **Azure SQL Database** (PaaS), **SQL Managed Instance** (PaaS, high
  compatibility), and **SQL Server on a VM** (IaaS, full control).
- Buy capacity with **DTU** (bundled) or **vCore** (separate compute/storage, recommended); the
  **serverless** tier auto-scales and auto-pauses.
- New servers **block connections** until you add **firewall rules**; connect with standard tools and
  T-SQL.
- PaaS handles **patching, backups, and HA** for you.

# Flash Cards

Q: What's the difference between Azure SQL Database, SQL Managed Instance, and SQL Server on a VM?
A: SQL Database is a fully managed PaaS database for new apps; Managed Instance is a managed instance with near-full SQL Server compatibility for lift-and-shift; SQL Server on a VM is self-managed IaaS with full OS control.

Q: How do the DTU and vCore purchasing models differ?
A: DTU bundles compute, memory, and I/O into simple tiers; vCore lets you size compute (cores + memory) and storage independently, supports serverless and Azure Hybrid Benefit, and is generally recommended.

Q: What does the serverless compute tier do?
A: It auto-scales compute with demand and can auto-pause when the database is idle, so you pay less for intermittent workloads.

Q: Why might a new connection to Azure SQL be refused?
A: A new logical SQL server blocks all connections by default; you must add a firewall rule allowing your client IP (or Azure services) before you can connect.

Q: What does Azure manage for you with Azure SQL Database?
A: Patching, automated backups (with point-in-time restore), and high availability — you focus on the database design and queries.

Q: When would you choose an elastic pool?
A: When you run many small databases whose usage peaks at different times, so they can share a pool of resources cost-effectively.

# Exercises

### Easy
In one sentence each, say when you'd pick Azure SQL Database, SQL Managed Instance, and SQL Server on a
VM.

### Medium
Create an Azure SQL Database (serverless vCore), add a firewall rule for your IP, connect, and run
`SELECT @@VERSION;`. Note what Azure is managing on your behalf.

### Challenging
A workload is busy during business hours and idle at night, with unpredictable growth. Recommend a
service, purchasing model, and compute tier, and justify each choice on cost and operations.

# Further Reading

- Microsoft Learn — *What is Azure SQL Database?*: <https://learn.microsoft.com/azure/azure-sql/database/sql-database-paas-overview>
- Microsoft Learn — *Azure SQL deployment options*: <https://learn.microsoft.com/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview>
- Microsoft Learn — *vCore vs DTU purchasing models*: <https://learn.microsoft.com/azure/azure-sql/database/purchasing-models>
- Microsoft Learn — *Serverless compute tier*: <https://learn.microsoft.com/azure/azure-sql/database/serverless-tier-overview>
