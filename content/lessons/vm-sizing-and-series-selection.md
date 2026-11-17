---
slug: vm-sizing-and-series-selection
title: "VM Sizing and Series Selection: D, E, F, and B Families"
topic: virtual-machines-and-compute
kind: technique
summary: "Match CPU, memory, and I/O requirements to general purpose, memory-optimized, and compute-optimized series."
tags: [vm-sizing, hardware, series, performance]
related: [deploying-vms-with-azure-cli, vm-managed-disks-and-storage-types, spot-vms-and-burstable-instances]
---
> **In one line:** Azure groups virtual machine sizes into lettered families tailored for specific workload characteristics.

## The idea

Azure offers hundreds of VM sizes categorized into specialized families. Sizing a VM involves choosing the right series letter and edition number:

- **B-Series (Burstable):** Economical VMs with low baseline CPU performance that accumulate credits to burst up to 100% CPU. Best for dev/test environments and low-traffic web applications.
- **D-Series (General Purpose):** Balanced ratio of vCPU to memory (typically 4 GB RAM per vCPU). Excellent for enterprise web servers, middle-tier backends, and small-to-medium databases. (e.g., `Standard_D4s_v5`).
- **E-Series (Memory Optimized):** High memory-to-vCPU ratio (typically 8 GB RAM per vCPU). Essential for relational database management systems (SQL Server, PostgreSQL), in-memory caches (Redis), and data analytics.
- **F-Series (Compute Optimized):** High CPU-to-memory ratio (2 GB RAM per vCPU) with high clock speeds. Ideal for batch data processing, web servers under high compute load, video encoding, and analytics.
- **N-Series (GPU Accelerated):** Equipped with dedicated NVIDIA GPUs for machine learning training, AI inference, and 3D graphics rendering.

| Series Family | CPU to Memory Ratio | Optimal Workload Scenarios |
|---|---|---|
| **B-Series** | Variable (Credit based) | Dev/test servers, low-traffic websites, build agents |
| **D-Series** | 1 vCPU : 4 GB RAM | Production web APIs, business applications |
| **E-Series** | 1 vCPU : 8 GB RAM | Relational databases, in-memory caches, analytics |
| **F-Series** | 1 vCPU : 2 GB RAM | CPU-intensive batch jobs, mathematical modeling |
| **N-Series** | Dedicated NVIDIA GPUs | Deep learning, AI inference, 3D visualization |

> **Note:** The lowercase `s` in a size name (e.g., `Standard_D4s_v5` vs `Standard_D4_v5`) signifies support for **Premium SSD managed disks**. Always choose sizes with the `s` suffix for production I/O performance.

## See it

Query available VM sizes and resize an existing virtual machine using the Azure CLI:

```bash
# Query memory-optimized sizes with at least 16 GB RAM in East US
az vm list-skus --location eastus --resource-type virtualMachines   --query "[?family=='standardESv5Family' && capabilities[?name=='vCPUs' && value=='4']].{Size:name, Cores:capabilities[?name=='vCPUs'].value | [0], RAM:capabilities[?name=='MemoryGB'].value | [0]}"   -o table

# Resize an existing running VM to a more powerful compute SKU
az vm resize --resource-group rg-learning-portal --name vm-web-prod --size Standard_D4s_v5 -o table
```

Resizing a virtual machine causes a brief reboot as Azure migrates the compute instance to a physical host supporting the larger SKU.

## Go deeper

Version numbers in Azure VM size names (e.g., `v3`, `v4`, `v5`) indicate underlying CPU processor generations. Newer generations (such as `v5` running on 3rd Gen Intel Xeon Platinum or AMD EPYC processors) often deliver higher clock speeds and superior performance per dollar compared to older legacy versions.

## Watch out

- Resizing a running VM reboots the guest operating system and drops active network connections.
- Choosing non-`s` sizes prevents attaching high-speed Premium SSDs, capping disk throughput to standard HDD performance.

## Remember

- D-series provides general purpose compute, E-series optimizes memory, and F-series optimizes raw CPU.
- Always select VM sizes with the `s` suffix to unlock Premium SSD and Ultra Disk support.
- Resizing an active VM triggers a guest reboot and brief downtime during host re-allocation.
