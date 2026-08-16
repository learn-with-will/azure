---
id: lesson-22
slug: security-in-azure
title: "Security in Azure"
level: advanced
order: 22
duration: 20
tags:
  - defender-for-cloud
  - zero-trust
  - encryption
  - sentinel
  - security
summary: "A tour of Azure security — defense in depth and Zero Trust, Microsoft Defender for Cloud with its secure score, Microsoft Sentinel for SIEM/SOAR, encryption at rest and in transit, and the identity and network controls that tie it all together."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **defense in depth** and **Zero Trust**.
- Describe **Microsoft Defender for Cloud** and the **secure score**.
- Explain what **Microsoft Sentinel** does.
- Summarize **encryption** at rest and in transit, and key identity/network controls.

# Why It Matters

Security in the cloud isn't a single feature you switch on — it's layers working together across
identity, network, data, and monitoring. Azure provides tools for each layer, but you must configure and
watch them. Understanding the landscape helps you build systems that are secure **by design**, not
patched after an incident.

# Concept Explanation

### Defense in depth and Zero Trust

- **Defense in depth** — use **multiple layers** of protection (identity, network, host, app, data) so
  no single failure exposes everything.
- **Zero Trust** — a modern security model summarized as **"never trust, always verify."** Its
  principles: **verify explicitly** (authenticate/authorize every request), use **least-privilege
  access**, and **assume breach** (limit blast radius, segment, monitor). Identity — not the network
  perimeter — is the primary control.

### Microsoft Defender for Cloud

**Microsoft Defender for Cloud** (formerly **Azure Security Center**) is Azure's tool for **security
posture management and workload protection**. It continuously assesses your resources, surfaces
**recommendations**, and gives you a **secure score** — a single percentage that summarizes how well
your environment follows security best practices, with prioritized steps to raise it. Its **Defender
plans** add threat protection for specific workloads (servers, storage, databases, containers).

### Microsoft Sentinel

**Microsoft Sentinel** (formerly **Azure Sentinel**) is a cloud-native **SIEM** (Security Information and
Event Management) and **SOAR** (Security Orchestration, Automation, and Response). It **collects security
data** across your estate, **detects** threats with analytics, and can **automate responses** to
incidents. Where Defender for Cloud focuses on posture and workload protection, Sentinel is the
**security operations** brain that hunts and responds across everything.

### Encryption

- **At rest** — data stored in Azure is **encrypted by default** for many services (for example, Storage
  Service Encryption, and Transparent Data Encryption for Azure SQL).
- **In transit** — data moving over the network is protected with **TLS/HTTPS**.
- **Key management** — Azure manages keys by default; for stricter control you can use **customer-managed
  keys** stored in **Key Vault**.

### Identity and network controls (recap in a security frame)

- **Identity:** **MFA**, **Conditional Access**, least-privilege **RBAC**, and **Privileged Identity
  Management (PIM)** for just-in-time elevation of admin roles.
- **Network:** **NSGs**, **Azure Firewall**, **DDoS Protection**, **Web Application Firewall (WAF)**, and
  **private endpoints** to keep traffic off the public internet.

These earlier topics are security controls too — Zero Trust ties them together.

# Key Terminology

- **Defense in depth** — layered security so one failure isn't fatal.
- **Zero Trust** — verify explicitly, least privilege, assume breach.
- **Defender for Cloud** — posture management + workload protection, with a **secure score**.
- **Microsoft Sentinel** — cloud-native SIEM/SOAR for detection and response.
- **Encryption at rest / in transit** — protecting stored vs moving data.
- **Customer-managed keys** — your own keys in Key Vault for encryption.
- **PIM** — just-in-time elevation of privileged roles.

# Options and Trade-offs

| Concern | Option A | Option B | How to choose |
| ------- | -------- | -------- | ------------- |
| Key management | **Microsoft-managed keys** | **Customer-managed keys (Key Vault)** | Microsoft-managed for simplicity; customer-managed when compliance requires you to control keys. |
| Security focus | **Defender for Cloud** (posture) | **Sentinel** (SIEM/SOAR) | Defender to harden posture and protect workloads; Sentinel to detect, investigate, and respond org-wide. |
| Admin access | **Standing admin roles** | **PIM just-in-time** | PIM grants admin rights only when needed, for a limited time — far safer than standing access. |

# Worked Example

Raising the **secure score** is a concrete first step:

```text
1. Open Microsoft Defender for Cloud → Secure Score.
2. Review the prioritized recommendations (e.g., "enable MFA for accounts with
   owner permissions", "restrict public network access on storage").
3. Remediate the high-impact items first; the score rises as you comply.
4. Turn on relevant Defender plans for the workloads you run.
```

The score turns "are we secure?" into a measurable, improvable number with a to-do list.

# Real World Analogy

Cloud security is like protecting a **building**. **Defense in depth** is having a **fence, locked
doors, guards, and a safe** — not just one lock. **Zero Trust** is checking **everyone's ID at every
door**, even people already inside. **Defender for Cloud** is a **security inspector** who scores your
building and lists what to fix. **Sentinel** is the **central security office** watching all the cameras,
spotting intruders, and dispatching a response. **Encryption** is keeping documents in a **safe** and
sending them in **sealed, armored couriers**.

# Examples

## Example 1 — Basic: enforce MFA

Following a Defender for Cloud recommendation, a team enables **MFA** for all admin accounts, closing the
most common attack path and raising their secure score.

**Why this works:** identity is the primary perimeter; MFA blocks the vast majority of account attacks.

## Example 2 — Real-world: detect and respond

A company uses **Sentinel** to collect sign-in and resource logs. An analytics rule flags impossible
travel (logins from two distant countries minutes apart) and an automated playbook disables the account
and alerts the SOC.

**Why this works:** Sentinel correlates signals across the estate and can respond automatically.

## Example 3 — Pitfall: assuming "cloud = secure"

A team leaves a storage account publicly accessible and grants broad permissions, assuming Azure secures
everything.

**Why this bites:** the provider secures the platform, but **configuration and access are yours** (shared
responsibility). Defender for Cloud would flag exactly these issues.

# Common Mistakes

- **Relying on the network perimeter alone.** Adopt Zero Trust — verify every request.
- **Ignoring the secure score.** It's a prioritized, measurable to-do list.
- **Standing admin access for everyone.** Use PIM for just-in-time elevation.
- **Leaving PaaS services public.** Restrict access and use private endpoints.

# Best Practices

- Apply **defense in depth** and **Zero Trust**: MFA, least privilege, segmentation, monitoring.
- Use **Defender for Cloud** to raise your **secure score** and turn on relevant Defender plans.
- Centralize detection and response with **Microsoft Sentinel**.
- Rely on **encryption** (default at rest, TLS in transit); use **customer-managed keys** if required.

# Summary

- Security is **layered** (defense in depth) and governed by **Zero Trust**: verify explicitly, least
  privilege, assume breach.
- **Microsoft Defender for Cloud** manages posture and workloads and gives a **secure score**;
  **Microsoft Sentinel** is the SIEM/SOAR for detection and response.
- Data is **encrypted at rest** (by default) and **in transit** (TLS); **customer-managed keys** offer
  extra control.
- Identity and network controls (**MFA, Conditional Access, RBAC, PIM, firewalls, private endpoints**)
  are the building blocks.

# Flash Cards

Q: What is Zero Trust, in three principles?
A: "Never trust, always verify" — verify explicitly (authenticate/authorize every request), use least-privilege access, and assume breach (segment, limit blast radius, monitor). Identity is the primary control, not the network perimeter.

Q: What is Microsoft Defender for Cloud, and what was it called before?
A: Azure's security posture management and workload protection tool (formerly Azure Security Center). It assesses resources, gives prioritized recommendations, and provides a secure score; Defender plans add threat protection for specific workloads.

Q: What is Microsoft Sentinel?
A: A cloud-native SIEM and SOAR (formerly Azure Sentinel) that collects security data across your estate, detects threats with analytics, and can automate incident response.

Q: How is data encryption handled in Azure?
A: Data at rest is encrypted by default for many services (e.g., Storage Service Encryption, TDE for SQL); data in transit is protected with TLS/HTTPS. You can use customer-managed keys in Key Vault for stricter control.

Q: What does the secure score tell you?
A: A single percentage summarizing how well your environment follows security best practices, with a prioritized list of recommendations to improve it.

Q: What is Privileged Identity Management (PIM)?
A: An Entra ID capability that grants privileged (admin) roles just-in-time, for a limited time and with approval — reducing the risk of standing administrative access.

# Exercises

### Easy
State the three principles of Zero Trust and give a one-line example of each in Azure.

### Medium
Open (or describe) Microsoft Defender for Cloud's secure score, pick two recommendations, and explain how
remediating them reduces risk.

### Challenging
Design a layered (defense-in-depth) security plan for a public web app on Azure: cover identity, network,
data, and monitoring, naming the specific Azure controls at each layer and how Zero Trust guides them.

# Further Reading

- Microsoft Learn — *What is Microsoft Defender for Cloud?*: <https://learn.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction>
- Microsoft Learn — *What is Microsoft Sentinel?*: <https://learn.microsoft.com/azure/sentinel/overview>
- Microsoft Learn — *Zero Trust guidance*: <https://learn.microsoft.com/security/zero-trust/zero-trust-overview>
- Microsoft Learn — *Azure encryption overview*: <https://learn.microsoft.com/azure/security/fundamentals/encryption-overview>
