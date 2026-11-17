---
slug: availability-zones-and-datacenter-resilience
title: "Availability Zones and Datacenter Resilience"
topic: azure-architecture-and-governance
kind: concept
summary: "Protect workloads against datacenter-level failures using physically separate Availability Zones."
tags: [availability-zones, high-availability, resilience, zones]
related: [azure-regions-and-geographies, region-pairs-and-sovereignty, azure-slas-and-composite-availability]
---
> **In one line:** Availability Zones provide physically isolated datacenters within an Azure region to survive local outages.

## The idea

Within an Azure region, an **Availability Zone** is a unique physical location with independent power, cooling, and networking infrastructure. If a catastrophic event—such as a flood, electrical substation explosion, or cooling failure—destroys one datacenter building, the remaining zones in the region continue operating without interruption.

An availability zone-enabled region contains at least **three** separate physical zones (labeled Zone 1, Zone 2, and Zone 3). Because zones are connected by high-speed fiber networks with round-trip latency under two milliseconds, applications can execute synchronous data replication across zones without noticeable performance degradation.

Azure services support zones in two distinct architectures:
- **Zonal Services:** You explicitly pin a resource to a specific zone (e.g., pinning a Virtual Machine or Managed Disk to Zone 1).
- **Zone-Redundant Services:** The Azure platform automatically replicates data and load balances traffic across multiple zones without manual server management (e.g., Zone-Redundant Storage, Azure SQL ZRS, App Service multi-zone).

| Dimension | Single Datacenter | Availability Zones (AZs) | Multi-Region |
|---|---|---|---|
| **Failure Protection** | Server blade / rack outage | Complete datacenter destruction | Widespread natural disaster / regional blackout |
| **Replication Latency** | Sub-millisecond | Under 2 milliseconds | Tens of milliseconds (asynchronous) |
| **Typical Uptime SLA** | 99.9% | 99.99% for VMs across AZs | 99.99%+ active-active |

> **Tip:** Whenever architecting production virtual machines or database instances, deploy across two or three Availability Zones to qualify for Microsoft's 99.99% VM availability SLA.

## See it

Deploy a virtual machine explicitly pinned to Availability Zone 1 using the Azure CLI:

```bash
# Create an Ubuntu VM pinned to Availability Zone 1 in East US
az vm create   --resource-group rg-resilience   --name vm-prod-zone1   --image Ubuntu2204   --zone 1   --admin-username azureuser   --generate-ssh-keys   --output table

# Verify the assigned availability zone on the deployed VM
az vm show --resource-group rg-resilience --name vm-prod-zone1 --query "{Name:name, Zone:zones[0]}" -o json
```

Pinning the VM to Zone 1 guarantees its compute blades, network interfaces, and managed OS disks reside together within that isolated physical datacenter.

## Go deeper

Availability zone numbers (1, 2, 3) are logically mapped per subscription. Zone 1 in Subscription A may physically correspond to a different physical building than Zone 1 in Subscription B. This logical mapping prevents all Azure customers from concentrating their workloads inside the same physical building.

Azure differentiates between zone-redundant and zonal services. A **zone-redundant** service (like zone-redundant Storage or App Service) automatically distributes traffic and data replicas across three zones behind the scenes, whereas a **zonal** deployment pins a specific resource (like a virtual machine) to a single designated zone.

## Watch out

- Not all Azure regions support Availability Zones; always check regional documentation before committing an architecture.
- Cross-zone network egress within the same region incurs a minor per-gigabyte data transfer fee.

## Remember

- Availability Zones are physically separate datacenters within one region with independent power and networking.
- Zone-redundant services replicate data automatically across zones to achieve 99.99% availability SLAs.
- Zone numbers are logical mappings unique to your Azure subscription to balance physical datacenter load.
