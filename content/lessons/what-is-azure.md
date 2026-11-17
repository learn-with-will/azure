---
slug: what-is-azure
title: "What is Microsoft Azure"
topic: cloud-fundamentals
kind: concept
summary: "Explore Microsoft Azure's cloud platform, global infrastructure footprint, and enterprise capabilities."
tags: [azure, overview, cloud, microsoft]
related: [cloud-computing-principles, azure-management-tools-portal-cli-powershell, azure-subscriptions-and-accounts]
---
> **In one line:** Microsoft Azure is a global enterprise cloud platform offering hundreds of managed infrastructure and platform services.

## The idea

**Microsoft Azure** is Microsoft's public cloud computing platform. It provides an extensive ecosystem of hundreds of managed cloud services spanning compute, storage, networking, relational and NoSQL databases, AI and machine learning, IoT, developer tools, and enterprise security.

Azure operates across more global regions and datacenters than any other cloud provider, interconnected by over 175,000 miles of Microsoft-owned terrestrial and subsea fiber-optic network cable.

Key architectural pillars of Azure include:
- **Global Reach & Low Latency:** Workloads can be provisioned in proximity to end users worldwide, backed by strict enterprise Service Level Agreements (SLAs).
- **Hybrid by Design:** Seamless interoperability with on-premises enterprise environments through Windows Server, Active Directory, Azure Arc, and Azure Stack.
- **Enterprise Identity Backbone:** Native integration with Microsoft Entra ID (formerly Azure Active Directory), the identity provider powering millions of businesses and Microsoft 365.
- **Unified Governance:** Every resource deployment is managed, authenticated, and audited through a single uniform control plane: the Azure Resource Manager (ARM).

| Layer | Functionality | Primary Azure Technologies |
|---|---|---|
| **Identity & Access** | Authentication and authorization | Microsoft Entra ID, Azure RBAC |
| **Control Plane** | Management, deployment, auditing | Azure Resource Manager (ARM), Bicep |
| **Compute & Containers** | Code and container execution | Virtual Machines, App Service, Functions, AKS |
| **Data & Storage** | Structured and unstructured persistence | Blob Storage, Azure SQL, Azure Cosmos DB |
| **Networking** | Private networks and routing | Virtual Networks, ExpressRoute, Front Door |

> **Tip:** Every interaction with Azure—whether clicking buttons in the Azure Portal, running terminal commands in the Azure CLI, or executing Bicep templates—communicates with the exact same ARM REST API endpoints.

## See it

Verify the active cloud environment and verify connectivity to the global Azure public cloud control plane:

```bash
# Display active Azure cloud environment endpoints
az cloud show --name AzureCloud --query "{Cloud:name, ManagementEndpoint:endpoints.management, Active:isActive}" -o json

# Display the logged-in user identity and assigned tenant directory
az account show --query "{TenantId:tenantId, Subscription:name, User:user.name}" -o json
```

The output confirms you are targeting the standard global `AzureCloud` environment and indicates the tenant directory validating your identity.

## Go deeper

In addition to the standard commercial public cloud, Microsoft operates physically and logically isolated **sovereign clouds** for specialized compliance:
- **Azure Government (US):** Dedicated exclusively to US federal, state, and local government agencies and defense contractors.
- **Azure China (21Vianet):** An independent physical cloud operated by 21Vianet to comply with mainland Chinese telecommunications regulations.

## Watch out

- Never confuse Microsoft Azure with Microsoft 365; M365 is a SaaS productivity suite, while Azure is the underlying cloud infrastructure platform.
- Do not assume every Azure region offers identical service catalogs; verify regional service availability in documentation.

## Remember

- Microsoft Azure provides hundreds of cloud services spanning compute, data, AI, and networking.
- All administrative interactions route through the uniform Azure Resource Manager (ARM) API.
- Native integration with Microsoft Entra ID provides unified enterprise identity and role-based security.
