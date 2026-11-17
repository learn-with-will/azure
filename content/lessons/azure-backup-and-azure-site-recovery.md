---
slug: azure-backup-and-azure-site-recovery
title: "Disaster Recovery: Azure Backup and Azure Site Recovery"
topic: governance-reliability-architecture
kind: tool
summary: "Protect enterprise data with Azure Backup and orchestrate automated business continuity with Azure Site Recovery (ASR)."
tags: [backup, site-recovery, bcdr, disaster-recovery]
related: [recovery-objectives-rto-and-rpo, azure-slas-and-composite-availability, resource-locks-preventing-accidental-deletion]
---
> **In one line:** Azure Backup safeguards historical data against corruption, while Azure Site Recovery replicates running workloads.

## The idea

Enterprise Business Continuity and Disaster Recovery (BCDR) plans require two distinct capabilities: recovering lost or corrupted historical data, and keeping mission-critical services operating during regional cloud outages. Microsoft addresses these needs through two complementary services:

1. **Azure Backup:**
   - Focuses on **data protection, compliance retention, and restore**.
   - Creates point-in-time snapshots and immutable backups of Virtual Machines, SQL Databases, Azure Files, and Blob storage.
   - Protects against ransomware attacks, human operational mistakes (accidental deletion), and malicious database wipes.
   - Supports Long-Term Retention (LTR) policies storing regulatory backups for up to 99 years.

2. **Azure Site Recovery (ASR):**
   - Focuses on **workload replication, orchestration, and rapid failover**.
   - Continuously replicates live running Virtual Machines (Azure-to-Azure, or on-premises to Azure) to a secondary paired region.
   - When a primary data center suffers a major catastrophe (e.g., natural disaster or major power failure), ASR orchestrates automated failover, spinning up cloned VMs in the secondary region within minutes.

| Feature | Azure Backup | Azure Site Recovery (ASR) |
|---|---|---|
| **Primary Goal** | Data backup and historical restore | **Workload replication and rapid failover** |
| **Typical Target** | Files, databases, disks, historical points | Live VMs, operating systems, applications |
| **Data Retention** | Days, months, or years (Up to 99 years) | Ephemeral real-time replication stream |
| **Failover Orchestration** | None (Restore operation required) | **Automated multi-tier recovery plans** |
| **Storage Vault** | Recovery Services Vault / Backup Vault | Recovery Services Vault |

> **Tip:** Regularly execute **ASR Test Failovers**. A test failover provisions replicated VMs in an isolated, sandboxed virtual network in the secondary region without impacting production replication or disrupting end users.

## See it

Enable automated backup protection for an Azure Virtual Machine using the Azure CLI:

```bash
# Create a centralized Recovery Services Vault
az backup vault create   --resource-group rg-learning-portal   --name rsv-portal-prod   --location eastus

# Enable daily backup protection for a production Virtual Machine
az backup protection enable-for-vm   --resource-group rg-learning-portal   --vault-name rsv-portal-prod   --vm vm-portal-prod   --policy-name DefaultPolicy

# Query backup jobs and protection status
az backup job list   --resource-group rg-learning-portal   --vault-name rsv-portal-prod   --output table
```

The virtual machine is snapshot-protected daily with instant restore capabilities and immutable cloud vault storage.

## Go deeper

Azure Backup features **Immutable Vaults and Multi-User Authorization (MUA)**. Immutable vaults prevent backups from being deleted or retention periods shortened, even by compromised subscription admin credentials, providing ironclad defense against ransomware extortion.

## Watch out

- Replicating virtual machines with Azure Site Recovery incurs ongoing costs for target managed disks and data replication bandwidth.
- Always verify application-consistent replication for database servers so transaction logs are cleanly restored upon failover.

## Remember

- Azure Backup protects data assets against accidental deletion, corruption, and ransomware attacks.
- Azure Site Recovery (ASR) provides near real-time replication and automated failover to secondary cloud regions.
- Execute periodic non-disruptive ASR test failovers to validate disaster recovery preparedness.
