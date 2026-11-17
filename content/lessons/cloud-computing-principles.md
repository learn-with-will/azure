---
slug: cloud-computing-principles
title: "Principles of Cloud Computing"
topic: cloud-fundamentals
kind: concept
summary: "Understand on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service."
tags: [cloud, fundamentals, elasticity, on-demand]
related: [cloud-service-models-iaas-paas-saas, shared-responsibility-model, capex-vs-opex-economics]
---
> **In one line:** Cloud computing delivers scalable computing resources over the internet on a pay-as-you-go consumption model.

## The idea

**Cloud computing** is the delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet ("the cloud"). Instead of purchasing, operating, and maintaining physical datacenters and on-premises server racks, organizations rent compute capacity from cloud providers like Microsoft Azure.

The National Institute of Standards and Technology (NIST) defines five essential characteristics that establish genuine cloud computing:
1. **On-Demand Self-Service:** Provision compute resources programmatically or via a web console without human intervention from the provider.
2. **Broad Network Access:** Access services across standard internet protocols from heterogeneous client platforms (workstations, mobile devices, IoT).
3. **Resource Pooling:** Multi-tenant architecture dynamically assigns physical resources to meet customer demand without exposing physical hardware boundaries.
4. **Rapid Elasticity:** Scale workloads outward or inward seamlessly as traffic peaks and recedes.
5. **Measured Service:** Resource usage is metered transparently, supporting exact pay-as-you-go operational accounting.

| Characteristic | Traditional Datacenter | Microsoft Azure Cloud |
|---|---|---|
| **Procurement Cycle** | Weeks to months for hardware quotes and racking | Seconds to minutes via CLI or Portal |
| **Capacity Sizing** | Over-provisioned peak capacity | Dynamically scaled to match real-time load |
| **Cost Model** | Upfront Capital Expenditures (CapEx) | Variable Operating Expenditures (OpEx) |
| **Maintenance** | Local facility, power, cooling, and server repairs | Managed entirely by Microsoft |

> **Note:** Cloud elasticity differs from scalability: scalability is the ability to handle increased load, while elasticity is the ability to automatically shrink capacity when demand falls, eliminating idle server costs.

## See it

Provisioning and inspecting cloud resources does not require physical cabling or hardware installation. You interact with cloud infrastructure through standardized declarative APIs or CLI commands:

```bash
# Query available Azure physical locations and region display names
az account list-locations --query "[?metadata.regionType=='Physical'].{Name:name, Display:displayName}" -o table

# Check current resource group provisioning status in your subscription
az group list --query "[].{Name:name, Location:location, Status:properties.provisioningState}" -o table
```

The Azure CLI communicates directly with the Azure Resource Manager (ARM) API endpoint, demonstrating on-demand self-service and broad network access without operator mediation.

## Go deeper

Cloud computing eliminates hardware obsolescence risks. Microsoft continuously upgrades physical datacenter servers, optical networking backbones, and cooling systems without interrupting running virtual services. Furthermore, resource pooling provides global economies of scale that individual private datacenters cannot replicate.

Cloud computing delivers unprecedented elasticity through automation APIs. Instead of purchasing redundant physical servers to accommodate annual peak traffic spikes, cloud infrastructure scales dynamically in minutes and contracts during low-traffic periods, aligning infrastructure expenditure directly with real user demand.

## Watch out

- Never assume the cloud is automatically cheaper; unmanaged idle resources accrue continuous billing.
- Do not equate high availability with automatic disaster recovery; cross-region continuity requires deliberate design.

## Remember

- Cloud computing replaces upfront hardware procurement with elastic pay-as-you-go capacity.
- Five essential characteristics define the cloud: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.
- Workloads can scale dynamically up or down based on real-time application traffic demands.
