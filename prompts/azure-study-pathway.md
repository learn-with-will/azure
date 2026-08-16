# Azure Course — Study Pathway

A phase-by-phase overview of the 24-lesson Azure course. It pairs with
`azure-authoring-prompt.md` (the no-hallucination contract). The course is designed to be taken in
order: concepts first, then hands-on core services, then operating at scale.

## Phase 1 — Beginner: cloud & Azure fundamentals (lessons 01–08)

Goal: understand what the cloud is, how Azure is organized, and what the core service families do —
at the level of Microsoft's **AZ-900 Azure Fundamentals**. No prior IT experience assumed.

1. **What is cloud computing?** — IaaS/PaaS/SaaS, public/private/hybrid, CapEx→OpEx, the shared
   responsibility model, and the real benefits (elasticity, scalability, reliability, global reach).
2. **What is Azure & getting started** — the Azure account and subscription, the portal, Cloud Shell,
   and the Azure CLI vs Azure PowerShell; create your first resource.
3. **Azure global infrastructure** — regions, availability zones, region pairs, geographies, and
   sovereign clouds; how to choose a region.
4. **Resource management & ARM** — management groups, subscriptions, resource groups, resources,
   tags, and Azure Resource Manager.
5. **Core compute overview** — VMs, VM Scale Sets, App Service, Functions, and containers, and when
   to use each.
6. **Core storage overview** — storage accounts, Blobs/Files/Queues/Tables, disks, access tiers, and
   redundancy options.
7. **Core networking overview** — virtual networks, subnets, NSGs, VPN/ExpressRoute, load balancing,
   and DNS.
8. **Identity & access** — Microsoft Entra ID, authentication vs authorization, Azure RBAC, MFA, and
   Conditional Access.

## Phase 2 — Intermediate: hands-on core services (lessons 09–16)

Goal: actually build things. Each lesson deploys or configures a real service, mostly with the Azure
CLI, and calls out cost and cleanup.

9. **Deploy a virtual machine** · 10. **Host web apps with App Service** · 11. **Serverless with
Azure Functions** · 12. **Store data with Blob storage** · 13. **Relational data with Azure SQL** ·
14. **NoSQL with Cosmos DB** · 15. **Networking hands-on** · 16. **Secrets & configuration with Key
Vault**.

## Phase 3 — Advanced: scale, automate, operate (lessons 17–24)

Goal: run Azure responsibly — observability, automation, cost control, security, and resilient design.

17. **Monitoring & observability** · 18. **Containers on Azure** · 19. **Infrastructure as code with
Bicep** · 20. **CI/CD to Azure** · 21. **Cost management & governance** · 22. **Security in Azure** ·
23. **Reliability & scaling** · 24. **Well-Architected & capstone** (design a small solution end to
end).

## Guardrails

- Every fact is traceable to a primary Microsoft source (see the authoring prompt's source list).
- Prices, quotas, region counts, and SLA numbers are **not** hard-coded — link the live pages.
- Language stays welcoming; every term is defined on first use; every lesson has one analogy.
- Every hands-on lesson reminds the reader to delete resources to avoid charges.
