---
id: lesson-09
slug: deploy-a-virtual-machine
title: "Deploy a Virtual Machine"
level: intermediate
order: 9
duration: 20
tags:
  - virtual-machines
  - compute
  - ssh
  - disks
  - cost
summary: "Hands-on with Azure Virtual Machines — creating a Linux VM with the Azure CLI, understanding images, sizes, and managed disks, connecting over SSH, controlling inbound traffic, and (crucially) deallocating and deleting to stop the meter."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Create a **Linux VM** with the Azure CLI and connect to it over **SSH**.
- Explain **images**, **sizes**, and **managed disks**.
- Control inbound access to a VM with network rules.
- **Deallocate** and **delete** a VM to stop being charged.

# Why It Matters

Virtual Machines are the most fundamental compute service and a common first hands-on step. They're also
the easiest way to run up a surprise bill, because a running VM charges whether or not you're using it.
Learning to create, connect, and — just as importantly — **stop and clean up** a VM is a core cloud
skill.

# Concept Explanation

### What you choose when you create a VM

- **Image** — the OS and starting software (for example, **Ubuntu 22.04** or **Windows Server 2022**).
- **Size** — the hardware: how many vCPUs and how much memory (for example, a small burstable
  **B-series** size is cheap and fine for learning).
- **Region & resource group** — where it lives and how it's grouped.
- **Authentication** — an **SSH key** (recommended for Linux) or password; RDP for Windows.
- **Disks** — a required **OS disk** plus optional **data disks**, all **managed disks** (Azure handles
  the underlying storage).
- **Networking** — a VNet/subnet, a network interface, and rules for inbound traffic (lesson 7).

### Managed disks

A **managed disk** is a virtual hard disk that Azure manages for you. Every VM has an **OS disk**; you
add **data disks** for extra storage. Disk types trade performance for cost (from **Standard HDD** up to
**Premium/Ultra SSD**). Disks are billed even when the VM is stopped — deleting the VM's resource group
removes them.

### Connecting

After creation, connect over the network:

- **Linux** → **SSH** (`ssh user@public-ip`), typically on port 22.
- **Windows** → **RDP** (Remote Desktop), typically on port 3389.

Only open these ports to trusted sources — exposing SSH/RDP to the whole internet invites attacks.

### Stopping vs deallocating (the cost point)

This trips up almost everyone:

- **Stopping the OS from inside** (a shutdown command) leaves the VM **allocated** — you **still pay**
  for the compute.
- **Deallocating** (Stop in the portal, or `az vm deallocate`) **releases the compute** — you **stop
  paying for the vCPUs**, though **disks and static IPs still cost** a little.
- **Deleting** removes it entirely.

So to pause a learning VM without deleting it, **deallocate** it. To stop all charges, **delete** the
resource group.

# Key Terminology

- **Image** — the OS/software template a VM starts from.
- **Size (SKU)** — the VM's CPU/memory configuration.
- **Managed disk** — an Azure-managed virtual disk (OS disk + optional data disks).
- **SSH / RDP** — remote connection to Linux / Windows VMs.
- **Deallocate** — release compute so you stop paying for it (disks remain).
- **VM Scale Set** — many identical, auto-scaling VMs (lesson 5).

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Auth | **SSH key** | **Password** | SSH keys are far more secure — prefer them for Linux. |
| Disk type | **Standard HDD/SSD** | **Premium/Ultra SSD** | Cheaper storage for dev/test; premium for production I/O performance. |
| Pausing | **Deallocate** | **Delete** | Deallocate to resume later (still pay for disks); delete to stop all charges. |
| Scale | **Single VM** | **Scale Set** | One VM for a fixed workload; a scale set when you need elastic, load-balanced instances. |

# Worked Example

Create a small Ubuntu VM, connect, then clean up:

```bash
# 1. Resource group
az group create --name vm-lab-rg --location eastus

# 2. Create a small Ubuntu VM with a generated SSH key (opens port 22 by default here)
az vm create \
  --resource-group vm-lab-rg --name lab-vm \
  --image Ubuntu2204 --size Standard_B1s \
  --admin-username azureuser --generate-ssh-keys

# 3. The command prints the public IP — connect over SSH
ssh azureuser@<public-ip>

# 4a. Pause it (stop paying for compute; disks remain)
az vm deallocate --resource-group vm-lab-rg --name lab-vm

# 4b. Or remove everything to stop all charges
az group delete --name vm-lab-rg --yes --no-wait
```

# Real World Analogy

A VM is like **renting an apartment**. The **image** is how it comes furnished; the **size** is how big
it is; the **disks** are the closets. **Deallocating** is like **moving out but keeping the storage
unit** — you stop paying rent on the apartment, but the storage still costs a little. **Deleting** is
ending the lease and clearing the unit entirely.

# Examples

## Example 1 — Basic: a throwaway test box

A developer needs a clean Linux machine to try a tool. They create a **B-series** VM, use it, and
**delete the resource group** when finished — total cost, a few cents.

**Why this works:** small sizes plus prompt cleanup keep experiments nearly free.

## Example 2 — Real-world: lock down remote access

Rather than exposing SSH to the internet, a team restricts port 22 to their office IP range in the NSG
(or uses Azure Bastion for browser-based access without a public IP).

**Why this works:** narrowing the source of remote access sharply reduces attack surface.

## Example 3 — Pitfall: "I shut it down, why am I billed?"

Someone runs `sudo shutdown` inside the VM and expects charges to stop. The VM is still **allocated**,
so compute keeps billing.

**Why this bites:** only **deallocating** (portal Stop / `az vm deallocate`) releases the compute. An
in-OS shutdown doesn't.

# Common Mistakes

- **Opening SSH/RDP to the whole internet.** Restrict the source or use Bastion.
- **Expecting an in-OS shutdown to stop billing.** Deallocate instead.
- **Oversizing the VM.** Start small; resize later if needed.
- **Forgetting disks cost while deallocated.** Delete the resource group to stop all charges.

# Best Practices

- Use **SSH keys**, not passwords, and restrict inbound management ports.
- **Right-size** and use **burstable (B-series)** VMs for light/learning workloads.
- **Deallocate** when idle; **delete the resource group** when done.
- Use **Scale Sets** when you need elastic capacity instead of a single VM.

# Summary

- Creating a VM means choosing an **image**, **size**, **disks**, **networking**, and **authentication**.
- Connect via **SSH** (Linux) or **RDP** (Windows), and expose those ports only to trusted sources.
- **Deallocating** releases compute so you stop paying for vCPUs; **disks still cost** until you delete.
- Group learning VMs in a resource group and **delete it** to guarantee cleanup.

# Flash Cards

Q: What do you choose when creating a VM?
A: An image (OS), a size (vCPU/memory), a region and resource group, authentication (SSH key or password), disks (OS + optional data disks), and networking with inbound rules.

Q: What is a managed disk?
A: An Azure-managed virtual hard disk backing a VM. Every VM has an OS disk; you can add data disks. Disk types range from Standard HDD to Premium/Ultra SSD, and disks are billed even while the VM is stopped.

Q: What's the difference between shutting a VM down from inside and deallocating it?
A: An in-OS shutdown leaves the VM allocated, so you keep paying for compute. Deallocating (portal Stop or `az vm deallocate`) releases the compute so you stop paying for vCPUs (disks still cost).

Q: How do you connect to a Linux VM versus a Windows VM?
A: SSH (usually port 22) for Linux; RDP/Remote Desktop (usually port 3389) for Windows. Expose these only to trusted sources.

Q: How do you guarantee a learning VM stops costing anything?
A: Delete its resource group — that removes the VM, its disks, and networking in one step.

Q: Why prefer SSH keys over passwords for Linux VMs?
A: SSH keys are much harder to brute-force or guess than passwords, so they significantly reduce the risk of compromise.

# Exercises

### Easy
List the six things you choose when creating a VM, and give an example value for each.

### Medium
Create a `Standard_B1s` Ubuntu VM, connect over SSH, then **deallocate** it and confirm (with
`az vm show -d`) that its power state is "deallocated." Finally, delete the resource group.

### Challenging
Explain how you'd let a teammate SSH into a VM *without* giving it a public IP or opening port 22 to the
internet. (Hint: research Azure Bastion and just-in-time access.)

# Further Reading

- Microsoft Learn — *Create a Linux VM with the Azure CLI*: <https://learn.microsoft.com/azure/virtual-machines/linux/quick-create-cli>
- Microsoft Learn — *Azure Virtual Machines overview*: <https://learn.microsoft.com/azure/virtual-machines/overview>
- Microsoft Learn — *States and billing of Azure VMs*: <https://learn.microsoft.com/azure/virtual-machines/states-billing>
- Microsoft Learn — *Azure managed disks overview*: <https://learn.microsoft.com/azure/virtual-machines/managed-disks-overview>
