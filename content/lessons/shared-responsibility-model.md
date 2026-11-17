---
slug: shared-responsibility-model
title: "The Shared Responsibility Model"
topic: cloud-fundamentals
kind: concept
summary: "Delineate security and management duties between Microsoft Azure and the customer across cloud service models."
tags: [security, shared-responsibility, governance, compliance]
related: [cloud-service-models-iaas-paas-saas, microsoft-entra-id-fundamentals, zero-trust-architecture-in-azure]
---
> **In one line:** Security in the cloud is shared between provider and customer, shifting by service tier but never zero.

## The idea

Security and compliance in Microsoft Azure operate under the **Shared Responsibility Model**. Security responsibilities do not vanish when migrating workloads to the cloud; rather, they divide between Microsoft (the cloud provider) and the customer organization.

A critical rule governs every cloud deployment: **regardless of the cloud model chosen (IaaS, PaaS, or SaaS), the customer ALWAYS retains sole responsibility for:**
- **Information and Data:** Classifying, encrypting, and safeguarding intellectual property and database contents.
- **Devices and Endpoints:** Securing developer workstations, mobile devices, and IoT hardware connecting to the cloud.
- **Accounts and Identities:** Managing user credentials, Multi-Factor Authentication (MFA), role assignments, and access policies.

In an on-premises datacenter, your organization owns 100% of the stack, from the physical concrete slab, cooling towers, and server chassis up to user identity. In IaaS, Microsoft assumes ownership of physical security, hardware replacement, and host virtualization. In PaaS, Microsoft additionally takes over operating system patching and runtime updates. In SaaS, Microsoft runs the software itself.

| Layer | On-Premises | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| **Data & Identities** | Customer | Customer | Customer | Customer |
| **Application Logic** | Customer | Customer | Customer | Microsoft |
| **Operating System** | Customer | Customer | Microsoft | Microsoft |
| **Virtualization & Hypervisor** | Customer | Microsoft | Microsoft | Microsoft |
| **Physical Datacenter & Power** | Customer | Microsoft | Microsoft | Microsoft |

> **Note:** Microsoft secures the cloud infrastructure itself (physical security, datacenter perimeters, network hardware, and hypervisors). You are responsible for security *in* the cloud.

## See it

Azure exposes security recommendations and compliance postures through Microsoft Defender for Cloud, verifying customer-side configurations across subscriptions:

```bash
# Verify whether data encryption at rest and customer identity controls are enforced
az security assessment list --query "[?status.code=='Unhealthy'].{Assessment:displayName, Severity:metadata.severity}" -o table

# Inspect specific identity recommendation details
az security auto-provisioning-setting list -o table
```

Even if Microsoft implements world-class datacenter physical security, an improperly configured storage bucket or public database credential remains an exploitable customer configuration error.

## Go deeper

Shared responsibility also impacts regulatory compliance standards such as ISO/IEC 27001, SOC 2, and PCI-DSS. Microsoft provides attestation reports for datacenter and infrastructure controls through the Microsoft Service Trust Portal, allowing auditors to verify the cloud provider's half of the compliance matrix.

Regardless of the cloud service model chosen (IaaS, PaaS, or SaaS), the **customer always retains sole responsibility for data classification, account security, and access governance**. Understanding where the cloud provider's physical boundaries end and your operational duties begin is the foundation of cloud security.

## Watch out

- Never assume moving to SaaS absolves you of security; stolen user credentials grant attackers access regardless of provider protections.
- Failing to patch operating systems inside IaaS virtual machines violates your side of the shared responsibility contract.

## Remember

- Customer data, user identities, and endpoint devices are always customer responsibilities across all cloud models.
- Microsoft manages physical datacenters, server hardware, power, cooling, and the hypervisor layer.
- Moving up the stack from IaaS to PaaS and SaaS shifts more operational security burden to Microsoft.
