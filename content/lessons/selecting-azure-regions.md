---
slug: selecting-azure-regions
title: "Criteria for Selecting Azure Regions"
topic: azure-architecture-and-governance
kind: technique
summary: "Balance latency, service availability, pricing differences, and regulatory compliance when choosing regions."
tags: [regions, architecture, latency, cost, compliance]
related: [azure-regions-and-geographies, region-pairs-and-sovereignty, well-architected-framework-five-pillars]
---
> **In one line:** Choose Azure regions by evaluating user latency, legal data sovereignty, service catalogs, and pricing.

## The idea

Choosing the right Azure region for an application architecture is a permanent decision with major latency, financial, and regulatory consequences. Architects evaluate four fundamental criteria:

1. **User Proximity and Network Latency:** Position compute and database resources geographically close to the primary user base or interconnected corporate datacenters to minimize round-trip times (RTT).
2. **Data Sovereignty and Compliance:** Laws like GDPR (EU), CCPA (California), or FedRAMP (US Government) mandate that user personal data and financial records reside strictly within authorized legal boundaries.
3. **Service Availability and SKU Depth:** Not every service is deployed in every region. For example, specialized GPU VMs (NC-series), Azure NetApp Files, or newer AI models may only exist in select anchor regions.
4. **Cost and Pricing Variations:** The identical VM size or storage gigabyte can cost 10% to 30% more in regions with expensive real estate, labor, or electricity costs (e.g., Brazil South vs East US).

| Evaluation Factor | Primary Question to Answer | High-Risk Mistake |
|---|---|---|
| **Latency** | Where are the majority of active users? | Placing backend APIs on another continent from users |
| **Sovereignty** | Do local laws require in-country data storage? | Violating national compliance by replicating abroad |
| **Service Catalog** | Does this region support all needed PaaS features? | Choosing a region that lacks required VM sizes |
| **Cost** | What is the total pricing difference across regions? | Incurring 25% higher monthly spend unintentionally |

> **Tip:** Use the public Azure Latency Test (<https://www.azurespeed.com>) to measure real-time latency between your target user locations and candidate Azure datacenters.

## See it

Check whether your required services and VM families exist in candidate regions before writing infrastructure code:

```bash
# Check if Azure Container Apps is supported in North Europe vs Norway East
az provider show --namespace Microsoft.App --query "resourceTypes[?resourceType=='containerApps'].locations" -o table

# Verify GPU compute SKU availability in candidate regions
az vm list-skus --location eastus --size Standard_NC6 --query "[].{Name:name, Restrictions:restrictions}" -o table
```

Confirming provider registration prevents failed deployments caused by missing regional resource providers.

## Go deeper

Global enterprises frequently adopt a multi-region deployment topology:
- **Primary Regional Hub:** Hosts full application stack and primary relational database.
- **Secondary Failover Region:** Receives asynchronous read replicas and warm standby compute instances.
- **Edge Routing (Azure Front Door):** Directs incoming user HTTP requests dynamically to the nearest healthy region via global Anycast routing.

## Watch out

- Never select a region without verifying that Availability Zones are fully supported if 99.99% SLAs are required.
- Cross-region data egress charges accumulate quickly when databases and application tiers are accidentally placed in separate regions.

## Remember

- Primary criteria for selecting regions: latency, legal data compliance, service availability, and pricing.
- Services and specific VM SKUs vary by region; always query availability in advance.
- Keep application compute and dependent database services in the same region to avoid high network latency and egress fees.
