---
slug: spot-vms-and-burstable-instances
title: "Azure Spot VMs and Burstable B-Series Instances"
topic: virtual-machines-and-compute
kind: technique
summary: "Leverage unused Azure capacity with Spot VMs and burstable B-series for cost-effective batch workloads."
tags: [spot-vms, b-series, cost-optimization, compute]
related: [azure-compute-decision-matrix, vm-sizing-and-series-selection, vm-lifecycle-and-cost-deallocation]
---
> **In one line:** Cut compute costs up to 90% using interruptible Spot VMs and economical burstable B-series instances.

## The idea

Azure offers two specialized compute pricing mechanisms designed for variable, batch, or non-critical development workloads:

1. **Azure Spot Virtual Machines:** Azure datacenters maintain excess unallocated server capacity. Microsoft sells this spare compute at massive discounts—up to **90% off standard pay-as-you-go rates**. The trade-off: **eviction**. When Azure requires that physical capacity for full-price pay-as-you-go customers, Microsoft evicts your Spot VM with a 30-second warning notification. Ideal for stateless batch rendering, CI/CD runners, scientific simulations, and testing.
2. **Burstable B-Series VMs:** Standard VMs provide baseline CPU performance (e.g., 20% or 40% of a core) while accumulating CPU credits during idle periods. When traffic spikes arrive, the VM consumes credits to burst up to 100% CPU capacity. Perfect for web servers with variable traffic, small databases, and developer workstations that sit idle overnight.

| Feature | Standard Pay-As-You-Go | Azure Spot VMs | Burstable B-Series |
|---|---|---|---|
| **Discount** | Standard list price | Up to 90% discount | Low baseline pricing |
| **Eviction Risk** | None (guaranteed SLA) | Yes (evicted on 30s notice) | None (guaranteed SLA) |
| **CPU Performance** | Fixed allocated cores | Fixed allocated cores | Credits-based bursting |
| **Target Workload** | Mission-critical 24/7 apps | Fault-tolerant batch / CI | Dev/test, low-traffic APIs |

> **Tip:** In a Spot VM, configure the eviction policy to `Deallocate` (default) rather than `Delete`. This preserves the VM's managed OS disk and configuration so you can restart the VM once spot capacity becomes available again.

## See it

Deploy a Spot VM with a maximum price threshold and query eviction policy settings via the CLI:

```bash
# Create a low-cost Spot VM with deallocation eviction policy
az vm create   --resource-group rg-compute-cluster   --name vm-batch-spot   --image Ubuntu2204   --size Standard_D2s_v5   --priority Spot   --eviction-policy Deallocate   --max-price -1   --admin-username azureuser   --generate-ssh-keys   --output table

# Inspect the priority and billing profile of the Spot instance
az vm show --resource-group rg-compute-cluster --name vm-batch-spot --query "{Priority:priority, EvictionPolicy:evictionPolicy}" -o json
```

Setting `--max-price -1` indicates that you agree to pay the current spot market rate as long as capacity exists, up to the standard pay-as-you-go price ceiling.

## Go deeper

Applications running on Spot VMs can listen to the **Azure Scheduled Events** metadata service endpoint (`http://169.254.169.254/metadata/scheduledevents?api-version=2020-07-01`). This local endpoint broadcasts the 30-second eviction notification, giving your automation script time to save checkpoints to Blob storage, flush database queues, and gracefully deregister from load balancers.

Azure provides the **Scheduled Events API** for Spot instances. When Azure needs to reclaim Spot compute capacity, it dispatches an automated notice 30 seconds before deallocation. Applications can listen for this event to gracefully drain active requests, commit transactions, and terminate cleanly before eviction.

## Watch out

- Never run production databases, domain controllers, or real-time payment APIs on Spot instances.
- Burstable B-series VMs that deplete all CPU credits suffer severe performance throttling down to their fractional baseline.

## Remember

- Spot VMs provide up to 90% discounts for interruptible, fault-tolerant batch computing workloads.
- Azure can evict Spot VMs with 30 seconds notice whenever regional compute capacity is required.
- Burstable B-series VMs accumulate CPU credits during idle windows to power intermittent traffic bursts.
