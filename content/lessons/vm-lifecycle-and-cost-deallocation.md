---
slug: vm-lifecycle-and-cost-deallocation
title: "VM Power States: Stopped vs Deallocated"
topic: virtual-machines-and-compute
kind: pitfall
summary: "Avoid unexpected compute billing by stopping VMs via Azure CLI or portal to reach the Deallocated state."
tags: [billing, deallocated, power-states, cost, pitfall]
related: [deploying-vms-with-azure-cli, spot-vms-and-burstable-instances, azure-cost-management-and-budget-alerts]
---
> **In one line:** Shutting down an OS from inside the guest leaves compute billing active; you must deallocate via Azure.

## The idea

One of the most expensive and frequent operational mistakes in Microsoft Azure stems from misunderstanding virtual machine power states:

- **Stopped (Allocated):** If an administrator logs into a virtual machine guest OS and executes `sudo shutdown -h now` (Linux) or selects "Shut Down" from the Windows Start Menu, the operating system halts. **However, Azure continues to reserve physical CPU and RAM hardware blades on the datacenter host.** You continue to pay **100% of the compute hourly billing rate** even though the OS is not running!
- **Stopped (Deallocated):** If you initiate the stop operation through the Azure Portal, Azure CLI (`az vm deallocate`), or Azure PowerShell, Azure releases the physical CPU and memory hardware allocations back to the datacenter pool. **Compute billing drops to exactly $0.00 per hour.**

| Power State | How Initiated | Compute Billing | Static Private IP | Managed Disk Billing |
|---|---|---|---|---|
| **Running** | Normal operation | Full billing | Preserved | Standard billing |
| **Stopped (Allocated)** | Guest OS `shutdown` command | **Full billing continues** | Preserved | Standard billing |
| **Stopped (Deallocated)** | `az vm deallocate` or Portal | **$0.00 / hour** | Dynamic IP released | Standard billing continues |

> **Watch out:** When a VM reaches the Deallocated state, its dynamic public IP address is released. If your application requires the IP address to survive across deallocation cycles, configure a **Static Public IP**.

## See it

Inspect the power state of your virtual machine and safely deallocate it using the Azure CLI:

```bash
# Check the detailed instance power state (look for PowerState/deallocated)
az vm get-instance-view --resource-group rg-learning-portal --name vm-web-prod   --query "instanceView.statuses[?starts_with(code, 'PowerState/')].displayStatus" -o table

# Safely stop the VM and release compute hardware reservations to halt compute billing
az vm deallocate --resource-group rg-learning-portal --name vm-web-prod --output table

# Confirm VM is deallocated and compute charges have stopped
az vm show --resource-group rg-learning-portal --name vm-web-prod -d --query "powerState" -o tsv
```

The output returns `VM deallocated`, guaranteeing that compute billing has successfully ceased.

## Go deeper

You can automate non-production VM deallocation using the **Auto-Shutdown** feature built into Azure Virtual Machines. Configuring auto-shutdown (e.g., stopping all development VMs at 7:00 PM every weekday) immediately eliminates over 60% of dev/test monthly compute expenditures.

To prevent development and test environments from running unnecessarily over weekends and evenings, configure **Auto-Shutdown** on virtual machines. Azure can automatically deallocate non-production VMs at a scheduled daily hour, cutting monthly development compute spend by over 60% with zero engineering effort.

## Watch out

- Never tell developers to shut down cloud VMs from inside the guest operating system; compute charges persist.
- Deallocating a VM does not pause billing for attached Managed Disks or static Public IP reservations.

## Remember

- Shutting down a VM from within the guest OS leaves it in the 'Stopped (Allocated)' state with full compute billing.
- Always use `az vm deallocate` or the Azure Portal stop button to release compute hardware reservations.
- Configure Auto-Shutdown on development VMs to eliminate compute billing outside business hours.
