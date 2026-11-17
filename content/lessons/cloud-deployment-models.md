---
slug: cloud-deployment-models
title: "Public, Private, Hybrid, and Multicloud"
topic: cloud-fundamentals
kind: concept
summary: "Distinguish public, private, hybrid, and multicloud deployment architectures and their operational trade-offs."
tags: [deployment, hybrid, private-cloud, public-cloud]
related: [cloud-computing-principles, hybrid-connectivity-vpn-and-expressroute, capex-vs-opex-economics]
---
> **In one line:** Deployment models define where infrastructure physically lives and who owns the tenant boundaries.

## The idea

Organizations choose how to deploy cloud infrastructure based on compliance, existing capital investments, network latency, and data sovereignty:

- **Public Cloud:** Services and hardware are owned, operated, and maintained by a third-party cloud provider (Microsoft Azure). Infrastructure is multi-tenant and shared across millions of global organizations, but isolated securely via software virtualization and software-defined networking.
- **Private Cloud:** Cloud infrastructure dedicated exclusively to a single business or organization. It can reside physically in an organization's on-premises datacenter or be hosted by a third party. Delivers cloud-like self-service APIs while preserving full control over hardware and tenancy.
- **Hybrid Cloud:** An architecture combining public cloud services with private on-premises infrastructure, bound together by secure network connectivity (e.g., Azure ExpressRoute or IPSec Site-to-Site VPN). Enables bursting cloud compute while retaining sensitive data on-premises.
- **Multicloud:** The strategic adoption of multiple distinct public cloud providers (e.g., Azure alongside AWS or Google Cloud) to mitigate vendor lock-in or leverage best-of-breed specialized services.

| Deployment Model | Multi-Tenancy | Capital Expense | Operational Flexibility | Primary Use Case |
|---|---|---|---|---|
| **Public Cloud** | Multi-tenant | None (Pay-as-you-go) | Extreme scalability | Modern cloud-native apps |
| **Private Cloud** | Single-tenant | High (Hardware purchasing) | Constrained by local capacity | Strict regulatory isolation |
| **Hybrid Cloud** | Mixed | Moderate | High (Flexible migration) | Phased enterprise cloud transitions |
| **Multicloud** | Multi-tenant | None | High complexity | Redundancy & vendor diversification |

> **Note:** A hybrid cloud requires integrated network connectivity and coordinated identity management (e.g., Entra Connect syncing on-premises Active Directory). Do not conflate "hybrid" with simply running disconnected independent systems.

## See it

Azure Arc extends Azure Resource Manager control plane governance across hybrid and multicloud infrastructure, bringing consistent management to servers located on-premises:

```bash
# Inspect connected hybrid servers managed via Azure Arc outside of Azure datacenters
az connectedmachine list --query "[].{Server:name, OS:osName, Status:status, ResourceGroup:resourceGroup}" -o table
```

Through Azure Arc, an on-premises physical Linux server in a private datacenter can receive Azure Policy definitions and Defender security monitoring identically to a native Azure VM.

## Go deeper

Azure Stack Hub and Azure Stack HCI allow enterprises to deploy certified hardware appliances within private corporate datacenters that execute Azure PaaS and IaaS APIs locally. This allows disconnected or air-gapped industrial sites (e.g., oil rigs, submarines, secure defense installations) to run standard Azure services without public internet access.

For hybrid and multicloud management, Microsoft offers **Azure Arc**. Azure Arc extends Azure Resource Manager control plane capabilities to non-Azure infrastructure, allowing you to manage on-premises physical servers, VMware clusters, and multicloud Kubernetes clusters (AWS EKS, GCP GKE) using consistent Azure governance tools.

## Watch out

- Multicloud architectures drastically increase operational complexity, requiring teams to master distinct security models, networking tools, and CLIs.
- Private clouds still require physical capacity planning, cooling management, hardware depreciation cycles, and facility overhead.

## Remember

- Public clouds offer maximum scalability and zero physical hardware investment.
- Hybrid clouds connect on-premises datacenters to Azure for phased migration and data residency.
- Azure Arc extends Azure control plane and governance tools across on-premises and multicloud environments.
