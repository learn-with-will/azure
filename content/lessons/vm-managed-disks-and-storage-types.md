---
slug: vm-managed-disks-and-storage-types
title: "Azure Managed Disks: Ultra, Premium, and Standard"
topic: virtual-machines-and-compute
kind: concept
summary: "Compare Ultra Disk, Premium SSD v1/v2, Standard SSD, and Standard HDD for virtual machine storage."
tags: [managed-disks, ssd, hdd, storage, iops]
related: [deploying-vms-with-azure-cli, vm-sizing-and-series-selection, storage-replication-lrs-zrs-grs]
---
> **In one line:** Azure Managed Disks provide block storage for virtual machines across four distinct performance tiers.

## The idea

**Azure Managed Disks** are high-performance, durable block storage volumes managed entirely by Microsoft and attached to Azure Virtual Machines. Microsoft abstracts the underlying storage accounts, handling hardware redundancy and replication behind the scenes.

Azure offers four primary managed disk tiers to balance IOPS, throughput, and storage expense:
1. **Ultra Disk:** Ultra-low latency (< 1ms) disk storage designed for IOPS-intensive enterprise databases (SAP HANA, high-transaction SQL). Allows dynamic tuning of IOPS and throughput independently without restarting the VM.
2. **Premium SSD (v1 & v2):** High-performance solid-state storage delivering single-digit millisecond latencies. The industry standard for production enterprise servers, relational databases, and high-throughput application servers.
3. **Standard SSD:** Cost-effective solid-state storage providing consistent baseline performance. Ideal for web servers with light I/O, development/test environments, and non-critical batch jobs.
4. **Standard HDD:** Magnetic platter storage providing the lowest cost per gigabyte. Suitable for infrequently accessed backup disks, non-critical workloads, and archive storage.

| Disk Tier | Target IOPS | Target Latency | Best Use Case |
|---|---|---|---|
| **Ultra Disk** | Up to 160,000 | Sub-millisecond | Top-tier mission-critical databases |
| **Premium SSD** | Up to 20,000 | Single-digit ms | Production enterprise application workloads |
| **Standard SSD** | Up to 6,000 | Single-digit ms | Web servers, dev/test environments |
| **Standard HDD** | Up to 2,000 | Tens of ms | Backups, secondary data, non-critical logs |

> **Tip:** Every virtual machine has a maximum disk throughput and IOPS ceiling determined by its compute size. Attaching a 10,000 IOPS disk to a VM size that caps disk throughput at 3,000 IOPS results in artificial throttling.

## See it

Create an empty 128 GB Premium SSD managed data disk and attach it to an existing virtual machine:

```bash
# Create a 128 GB Premium SSD data disk in East US
az disk create   --resource-group rg-learning-portal   --name disk-data-prod-01   --size-gb 128   --sku Premium_LRS   --location eastus   --output table

# Attach the managed disk to an existing virtual machine
az vm disk attach   --resource-group rg-learning-portal   --vm-name vm-web-prod   --name disk-data-prod-01   --lun 0   --output table
```

Once attached, the disk appears as an unformatted block device (`/dev/sdc` on Linux) ready to be partitioned and formatted with `mkfs.ext4`.

## Go deeper

Managed disks achieve 99.999% (five nines) availability by maintaining three automatic synchronous data replicas within the datacenter (Locally Redundant Storage). Furthermore, managed disks automatically distribute across different physical storage clusters to prevent single rack power failures from impacting multiple disks attached to an availability set.

## Watch out

- Managed disks continue accruing storage billing fees even when their attached virtual machine is stopped and deallocated.
- Data disks attached to Linux VMs must be added to `/etc/fstab` with the `nofail` flag to prevent OS boot failures if the disk is detached.

## Remember

- Managed disks offer four performance tiers: Ultra Disk, Premium SSD, Standard SSD, and Standard HDD.
- Production workloads should always use Premium SSD or Ultra Disk to avoid I/O bottlenecks.
- Storage costs for managed disks continue accruing even while the virtual machine is deallocated.
