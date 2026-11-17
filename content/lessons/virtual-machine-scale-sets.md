---
slug: virtual-machine-scale-sets
title: "Virtual Machine Scale Sets (VMSS)"
topic: virtual-machines-and-compute
kind: concept
summary: "Deploy and manage groups of load-balanced, identical VMs with automatic horizontal autoscaling."
tags: [vmss, scale-sets, autoscaling, high-availability]
related: [azure-compute-decision-matrix, spot-vms-and-burstable-instances, vertical-vs-horizontal-autoscale-rules]
---
> **In one line:** Virtual Machine Scale Sets deploy identical pools of load-balanced VMs that scale horizontally on demand.

## The idea

When running IaaS workloads that require high availability and elasticity—such as big data compute clusters, stateless web server fleets, or batch processing pipelines—deploying individual standalone VMs creates administrative toil. **Virtual Machine Scale Sets (VMSS)** solve this by managing a pool of identical, homogeneous virtual machines.

Key architectural characteristics of VMSS:
1. **Automated Elasticity (Horizontal Scaling):** VMSS can dynamically add VM instances as CPU or memory demand increases (scale out), and safely terminate instances when demand subsides (scale in).
2. **Built-in High Availability:** VM instances are automatically distributed across multiple Availability Zones and fault domains, preventing hardware rack failures from bringing down the entire fleet.
3. **Integrated Load Balancing:** Integrates natively with Azure Load Balancer (Layer 4) and Azure Application Gateway (Layer 7) to distribute incoming traffic across healthy scale set instances.
4. **Flexible Orchestration Modes:** Modern VMSS supports **Flexible Orchestration**, allowing you to mix different VM sizes, spot instances, and availability models within a single scale set.

| Metric | Standalone Virtual Machines | Virtual Machine Scale Sets |
|---|---|---|
| **Instance Management** | Configured individually | Configured centrally from a master model |
| **Autoscaling** | Manual resizing | Automated metric-based scale in/out |
| **High Availability** | Manual placement in zones | Automatic cross-zone fault distribution |
| **OS Upgrades** | Manual patching per VM | Automatic rolling image upgrades |

> **Note:** VMSS instances are designed to be stateless and ephemeral. Any data written to a local VM disk is lost when that specific instance scales in. Shared state must be persisted externally in Blob storage, Azure Files, or an Azure SQL database.

## See it

Create a basic Linux Virtual Machine Scale Set distributed across availability zones using the CLI:

```bash
# Create a resource group for the compute cluster
az group create --name rg-compute-cluster --location eastus -o table

# Create a VMSS with 2 initial instances and automatic zone spreading
az vmss create   --resource-group rg-compute-cluster   --name vmss-web-fleet   --image Ubuntu2204   --vm-sku Standard_B2s   --instance-count 2   --zones 1 2 3   --admin-username azureuser   --generate-ssh-keys   --output table

# List active instances within the scale set
az vmss list-instances --resource-group rg-compute-cluster --name vmss-web-fleet -o table
```

The scale set provisions two identical Ubuntu VMs, places them in separate zones, and registers them behind a unified management model.

## Go deeper

VMSS supports **Rolling Upgrades**. When you update the base OS image (e.g., from Ubuntu 20.04 to 22.04), Azure upgrades a percentage of instances at a time (e.g., 20%), waits for health probes to confirm the new instances are serving traffic, and then proceeds to the next batch without taking the service offline.

## Watch out

- Never store persistent state or local database files on VMSS local disks; instances are terminated dynamically during scale-in events.
- Ensure application startup scripts complete quickly; slow VM boot times delay autoscale response during traffic spikes.

## Remember

- VMSS manages homogeneous pools of identical VMs with automated horizontal autoscaling.
- Instances are automatically distributed across Availability Zones for maximum resilience.
- Workloads running on VMSS must be stateless, offloading persistent data to external storage or databases.
