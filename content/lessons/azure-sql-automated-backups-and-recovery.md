---
slug: azure-sql-automated-backups-and-recovery
title: "Automated Backups and Point-In-Time Restore"
topic: relational-and-nosql-databases
kind: concept
summary: "Rely on automatic full, differential, and transaction log backups for point-in-time database restoration."
tags: [backups, point-in-time, disaster-recovery, rpo]
related: [azure-sql-service-tiers-and-deployment-options, azure-backup-and-azure-site-recovery, recovery-objectives-rto-and-rpo]
---
> **In one line:** Azure SQL executes continuous automated backups to enable point-in-time restoration to any exact second.

## The idea

In traditional database administration, managing backups requires writing complex maintenance plans, monitoring disk capacity for backup files, and testing restoration scripts. Azure SQL Database completely automates this process natively.

Azure SQL Database automatically executes:
- **Full Database Backups:** Created weekly.
- **Differential Backups:** Created every 12 to 24 hours.
- **Transaction Log Backups:** Created automatically every **5 to 10 minutes**.

This continuous backup schedule enables **Point-in-Time Restore (PITR)**. If an engineer accidentally executes an unconstrained `DROP TABLE` or corrupts customer records at 2:14:32 PM, an administrator can restore the database to an exact historical timestamp (e.g., 2:14:31 PM)—down to the specific second.

| Backup Dimension | Default Retention | Extended Retention (LTR) | Storage Redundancy |
|---|---|---|---|
| **Short-Term Backups (PITR)** | 7 days (Configurable up to 35 days) | N/A | LRS, ZRS, or GRS (Matches DB) |
| **Long-Term Retention (LTR)** | N/A | **Up to 10 years** for regulatory audits | Replicated to GRS by default |

> **Note:** A Point-in-Time Restore does NOT overwrite the original corrupted database in place. Instead, it provisions a **brand new database** alongside the existing one, allowing you to extract damaged records or perform verification before redirecting application connection strings.

## See it

Configure backup retention policies and restore an Azure SQL database to an exact historical timestamp:

```bash
# Update the short-term Point-in-Time Restore retention window to 35 days
az sql db backup-policy set   --resource-group rg-learning-portal   --server sql-portal-prod-001   --database db-portal-production   --retention-days 35   --output table

# Restore the database to an exact point in time, creating a new database named 'db-recovered'
az sql db restore   --resource-group rg-learning-portal   --server sql-portal-prod-001   --name db-portal-production   --dest-name db-recovered   --time "2026-08-16T14:14:31Z"   --output table
```

The CLI commands extend PITR retention and orchestrate automatic transaction log replays to reconstruct the exact database state. Once provisioned, database integrity checks can be executed against the newly restored instance before migrating production traffic.

## Go deeper

For compliance mandates (such as SEC rules or financial tax laws requiring 7-year audit retention), configure **Long-Term Retention (LTR)**. LTR policies automatically take weekly, monthly, and yearly full database backups and archive them into cost-effective read-access geo-redundant blob storage for up to 10 years.

For organizations operating under strict regulatory retention rules, configure **Long-Term Retention (LTR)**. LTR policies automatically preserve weekly, monthly, and yearly full database backups in geo-redundant storage vaults for up to 10 years, ensuring complete compliance with financial and healthcare auditing mandates.

## Watch out

- Restoring a database creates a new resource with a new name; application connection strings must be updated to target the restored instance.
- Backup storage exceeding 100% of your database maximum storage size is billed separately on a per-gigabyte basis.

## Remember

- Azure SQL automatically executes full, differential, and continuous transaction log backups.
- Point-in-Time Restore allows database recovery to any exact historical second within the retention window.
- Long-Term Retention (LTR) preserves compliance archive backups for up to 10 years in cold storage.
