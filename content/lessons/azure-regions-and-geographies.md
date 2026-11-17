---
slug: azure-regions-and-geographies
title: "Azure Regions and Geographies"
topic: azure-architecture-and-governance
kind: concept
summary: "Understand how Azure groups datacenters into latency-defined regions and geopolitical geographies."
tags: [regions, geographies, infrastructure, datacenters]
related: [availability-zones-and-datacenter-resilience, region-pairs-and-sovereignty, selecting-azure-regions]
---
> **In one line:** Azure organizes physical datacenters into latency-defined regions within geopolitical geographies.

## The idea

Microsoft Azure delivers cloud capacity across the planet using a structured geographical taxonomy:

- **Datacenter:** A physical building with its own independent power, cooling, physical security, and networking, housing thousands of server blades. Datacenters are never exposed to customers directly as individual deployment targets.
- **Region:** A geographical area containing one or more datacenters networked together through a dedicated regional low-latency fiber network. When you deploy a resource, you specify its region (e.g., `eastus`, `westeurope`, `southeastasia`). Latency between datacenters within a region is strictly under two milliseconds round-trip.
- **Geography:** A defined geopolitical boundary containing two or more Azure regions (e.g., United States, Europe, Asia Pacific, Japan). Geographies ensure data residency, sovereign compliance, and privacy boundaries are preserved for enterprise customers.

| Level | Definition | Example | Purpose |
|---|---|---|---|
| **Geography** | Discrete market with 2+ regions | United States, Europe | Data residency & regulatory compliance |
| **Region** | Cluster of networked datacenters | `eastus`, `westeurope` | Target deployment location for services |
| **Datacenter** | Physical building with servers | Physical facility | Fault domain for physical hardware |

> **Note:** Not all Azure services are available in every region. Core services (VMs, Storage, Azure SQL) exist globally, while specialized hardware (GPU instances) or newer preview features deploy to select regional hubs first. Furthermore, network latency varies significantly depending on regional subsea fiber routes and physical terrestrial hops across continents.

## See it

Discover and query available Azure regions using the Azure CLI:

```bash
# Query all physical regions located in Europe with their regional display names
az account list-locations --query "[?metadata.regionType=='Physical' && metadata.geographyGroup=='Europe'].{Region:name, DisplayName:displayName}" -o table

# Check if a specific VM size family is supported in your target region
az vm list-skus --location westeurope --size Standard_B2s --output table

# Query latency metadata and paired disaster recovery targets for West Europe
az account list-locations --query "[?name=='westeurope'].{Region:name, Paired:metadata.pairedRegion[0].name, Geography:metadata.geographyGroup}" -o json
```

By querying regional capabilities before deploying, you verify hardware availability and ensure compliance with project residency constraints.

## Go deeper

Azure regions are connected by Microsoft's global wide-area network (WAN). Traffic between Azure regions travels entirely over Microsoft's private, encrypted terrestrial and subsea dark fiber optic cables rather than traversing the public internet. This ensures predictable latency, lower jitter, and protection against internet transit route hijacking.

When selecting regions for latency-sensitive applications, use the **Azure Latency Test** (<https://www.azurespeed.com/>) or Network Watcher to benchmark round-trip times from your customer base. Selecting an Azure region geographically closer to end users drastically reduces TCP handshake times and improves web responsiveness.

## Watch out

- Never assume prices are identical across regions; local electricity, land, and operational costs cause regional pricing variations.
- Do not pick a region solely based on proximity to developers; always position primary workloads near end consumers.

## Remember

- An Azure region is a cluster of datacenters connected via a low-latency network (< 2ms).
- Geographies preserve data residency and legal compliance boundaries within geopolitical markets.
- Always verify service and SKU availability in your target region prior to deployment.
