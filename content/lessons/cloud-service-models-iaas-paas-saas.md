---
slug: cloud-service-models-iaas-paas-saas
title: "IaaS, PaaS, and SaaS Service Models"
topic: cloud-fundamentals
kind: concept
summary: "Compare Infrastructure, Platform, and Software as a Service to choose the right control and management balance."
tags: [iaas, paas, saas, service-models]
related: [cloud-computing-principles, shared-responsibility-model, azure-compute-decision-matrix]
---
> **In one line:** Cloud services divide management responsibilities across Infrastructure, Platform, and Software tiers.

## The idea

Cloud computing services fall into three foundational service models that define how much control and maintenance responsibility remains with the customer versus the cloud vendor:

1. **Infrastructure as a Service (IaaS):** You rent foundational computing infrastructure—virtual machines, raw disks, virtual networks, and firewalls. You retain full control over the operating system, middleware, runtime environment, and application stack. Azure examples include Virtual Machines, Virtual Machine Scale Sets, and Virtual Networks.
2. **Platform as a Service (PaaS):** The cloud provider manages physical hardware, operating system installation, OS security patching, and runtime scaling. You deploy application code and database schemas directly. Azure examples include Azure App Service, Azure Functions, Azure SQL Database, and Cosmos DB.
3. **Software as a Service (SaaS):** The vendor delivers and operates end-to-end applications over the web. You consume finished capabilities and configure user access and data policies. Examples include Microsoft 365, Power BI, and GitHub.

| Service Tier | Customer Manages | Provider Manages | Azure Example |
|---|---|---|---|
| **IaaS** | OS, Runtime, Middleware, Apps, Data | Physical Servers, Storage, Hypervisor, Network | Azure Virtual Machines |
| **PaaS** | Application Code, Configurations, Data | Hardware, OS, Patching, Scaling, Network Fabric | Azure App Service |
| **SaaS** | User Accounts, Permissions, Data | Everything (Application, OS, Servers, Storage) | Microsoft 365 |

> **Tip:** Start greenfield cloud initiatives on PaaS or serverless abstractions whenever possible; reserve IaaS for legacy commercial software with rigid OS-level dependencies.

## See it

Notice the architectural difference when viewing a PaaS web application versus an IaaS virtual machine in the CLI. A PaaS app exposes only application-layer configuration parameters:

```bash
# Inspect runtime stack settings on a PaaS Web App without OS management
az webapp config show --name my-express-app --resource-group rg-prod --query "{LinuxFxVersion:linuxFxVersion, AutoHeal:autoHealEnabled}" -o json

# Compare with an IaaS Virtual Machine where OS profile and storage disks are explicit
az vm show --name vm-legacy-db --resource-group rg-prod --query "{OS:storageProfile.osDisk.osType, Image:storageProfile.imageReference.offer}" -o json
```

PaaS abstracts the underlying operating system kernel entirely, allowing development teams to focus strictly on business logic.

## Go deeper

Container platforms like Azure Container Apps and Azure Kubernetes Service (AKS) bridge the space between IaaS and PaaS. In AKS, Microsoft provides the Kubernetes control plane for free (PaaS style), while customer workloads execute on either managed worker node pools (IaaS compute) or virtual nodes (serverless container instances).

Modern cloud architecture favors PaaS and serverless offerings to minimize operational overhead. By delegating operating system patching, runtime maintenance, and infrastructure scaling to the cloud provider, software engineering teams focus their valuable development cycles strictly on core application logic and user experience.

## Watch out

- Choosing IaaS requires your operations team to manage ongoing OS kernel patching and vulnerability maintenance.
- Choosing PaaS may introduce vendor-specific framework constraints and prevent installing custom OS drivers.

## Remember

- IaaS gives maximum architectural control but requires operating system maintenance and patching.
- PaaS abstracts server and OS operations so engineering teams can focus on application code and data.
- SaaS delivers fully hosted software consumed directly via web browsers and APIs.
