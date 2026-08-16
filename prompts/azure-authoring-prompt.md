# Azure Course — Authoring Prompt & No-Hallucination Contract

This file is the contract for writing and maintaining the **Microsoft Azure** course in this repo.
Every lesson and quiz must obey it. The goal: a beginner-friendly, **source-verified** course on
cloud computing and Azure's core services, with zero invented facts.

## Audience & voice

- **Suitable for everyone.** Assume the reader is new to the cloud and may be new to IT. Define every
  term the first time it appears. Prefer short sentences and concrete examples.
- Explain the *why*, not just the *how*. Use one plain-language analogy per lesson.
- Be honest about trade-offs, costs, and pitfalls. Never oversell the cloud ("always cheaper",
  "infinitely scalable") — qualify claims.
- Keep commands minimal and runnable. Prefer the **Azure CLI** (`az`) and the **portal**; show output
  where it aids understanding. Remind readers to **delete resources they create** to avoid charges.

## Naming & currency (verified 2026-08-16)

- **Microsoft Entra ID** is the current name for what was **Azure Active Directory (Azure AD)** —
  renamed in 2023. Always write "Microsoft Entra ID"; add "(formerly Azure AD)" on first use.
  *Microsoft Entra* is the broader product family; *Entra ID* is the identity service.
- **Microsoft Defender for Cloud** was formerly *Azure Security Center*.
- **Microsoft Sentinel** was formerly *Azure Sentinel*.
- Azure changes continuously. Do **not** state exact prices, region counts, per-service quotas, or
  specific SLA percentages as fixed facts — link the pricing calculator / SLA / regions pages and say
  "as of writing" or "check the current docs". Portal wording shifts; describe intent, not pixels.

## Authoritative sources (cite these; do not invent)

- **Azure documentation hub** — https://learn.microsoft.com/azure/
- Per-service docs: `/virtual-machines`, `/app-service`, `/azure-functions`, `/storage/blobs`,
  `/azure-sql`, `/cosmos-db`, `/virtual-network`, `/key-vault`, `/azure-monitor`, `/aks`,
  `/container-apps`, `/azure-resource-manager/management`, `/azure-resource-manager/bicep`,
  `/defender-for-cloud`
- **Microsoft Entra** — https://learn.microsoft.com/entra/
- **Azure CLI reference** — https://learn.microsoft.com/cli/azure/
- **AZ-900 Azure Fundamentals study guide** —
  https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-900
- **Azure Well-Architected Framework** — https://learn.microsoft.com/azure/well-architected/
- **Cloud Adoption Framework** — https://learn.microsoft.com/azure/cloud-adoption-framework/
- **Global infrastructure / regions** — https://azure.microsoft.com/explore/global-infrastructure/
- **Pricing calculator** — https://azure.microsoft.com/pricing/calculator/

If a claim isn't backed by one of these (or another primary Microsoft source), don't write it. If
unsure, qualify it or leave it out.

## High-risk facts to get right (anti-hallucination checklist)

1. **Cloud service models.** IaaS (you manage OS upward), PaaS (you manage app + data), SaaS (you
   manage almost nothing). The **shared responsibility model** shifts with the model; the customer is
   **always** responsible for data, identities/accounts, and access management. On-prem = you manage
   everything.
2. **Deployment models.** Public, private, hybrid (and multicloud). Don't conflate "hybrid" with
   "multicloud".
3. **CapEx vs OpEx.** Cloud shifts capital expense (buy hardware up front) to operating expense
   (pay-as-you-go). Whether it's "cheaper" depends on the workload — say so.
4. **Global infrastructure.** *Regions* are sets of datacenters; *Availability Zones* are physically
   separate locations **within** a region (independent power, cooling, networking); *region pairs*
   support some cross-region replication/DR. Not every region has zones, and Microsoft now offers some
   **non-paired** regions — qualify, and point to the regions page.
5. **Resource hierarchy.** **Management groups → subscriptions → resource groups → resources.** A
   resource belongs to exactly **one** resource group; a resource group is a logical container.
   Deleting a resource group deletes everything in it. **Azure Resource Manager (ARM)** is the
   deployment/management layer every request goes through.
6. **Compute choices** (describe, don't conflate): **Virtual Machines** (IaaS), **VM Scale Sets**,
   **App Service** (PaaS web hosting), **Azure Functions** (serverless/event-driven), **Azure
   Container Instances** (single containers), **Azure Container Apps** (serverless containers),
   **AKS** (managed Kubernetes). Match the service to the scenario.
7. **Storage.** A **storage account** holds **Blobs** (objects), **Files** (SMB/NFS shares),
   **Queues**, and **Tables**; **Managed Disks** back VMs. Blob **access tiers**: **Hot, Cool, Cold,
   Archive** (Archive is offline — rehydrate before reading). **Redundancy**: **LRS** (3 copies in one
   datacenter), **ZRS** (across zones in a region), **GRS/GZRS** (also to a secondary region),
   read-access variants **RA-GRS/RA-GZRS**.
8. **Databases.** **Azure SQL Database** (PaaS) ≠ **SQL Managed Instance** ≠ **SQL Server on a VM**
   (IaaS). Purchasing models: **DTU** vs **vCore**. **Azure Cosmos DB** is a multi-model, globally
   distributed database billed in **Request Units (RU/s)**, with **5 consistency levels**: Strong,
   Bounded staleness, **Session (default)**, Consistent prefix, Eventual. Choose a good **partition
   key**.
9. **Identity.** **Microsoft Entra ID** is a cloud identity/access service — **not** the same as
   on-prem **Active Directory Domain Services** (no OU/GPO/Kerberos-domain model). **Authentication**
   (who you are) vs **authorization** (what you may do). **Azure RBAC** grants authorization via role
   assignments at a scope. **MFA** and **Conditional Access** strengthen sign-in.
10. **Managed identities** let Azure resources authenticate to other services **without stored
    credentials** — system-assigned (tied to one resource) vs user-assigned (standalone, reusable).
    Prefer these plus **Key Vault** over secrets in code/config.
11. **Infrastructure as Code.** **ARM templates** are JSON; **Bicep** is a friendlier DSL that
    **transpiles to ARM JSON**. Deployments are **declarative and idempotent**; use
    `az deployment group what-if` to preview changes.
12. **Serverless nuance.** Functions on the **Consumption** plan scale to zero and can have **cold
    starts**. "Serverless" means you don't manage servers, not that there are none.
13. **SLAs.** SLAs are **per service**; combining services multiplies (composite SLA); some free tiers
    have **no** SLA. Don't invent numbers — link the SLA page.
14. **Security.** **Microsoft Defender for Cloud** (posture management + workload protection, with a
    **secure score**); **Microsoft Sentinel** (cloud SIEM/SOAR). Azure follows **Zero Trust** ("never
    trust, always verify"). Encryption at rest is on by default for many services.
15. **Well-Architected Framework — 5 pillars:** **Reliability, Security, Cost Optimization,
    Operational Excellence, Performance Efficiency.**
16. **Monitoring.** **Azure Monitor** is the umbrella: **Metrics** (numeric, near-real-time), **Logs**
    in **Log Analytics** queried with **KQL**, **Application Insights** for apps, and **Alerts** on
    signals.

## Lesson structure (match the shell + the other courses)

Front-matter (YAML): `id` (`lesson-NN`), `slug`, `title`, `level` (`beginner|intermediate|advanced`),
`order` (1–24), `duration` (minutes), `tags` (5), `summary` (one sentence — used to generate the
manifest). Then these H1 sections, in order:

`Learning Objectives` · `Why It Matters` · `Concept Explanation` (use `###` subsections) ·
`Key Terminology` · `Options and Trade-offs` (a table) · `Worked Example` · `Real World Analogy` ·
`Examples` (`## Example 1/2/3`: basic, real-world, pitfall) · `Common Mistakes` · `Best Practices` ·
`Summary` · `Flash Cards` (≥5 `Q:`/`A:` pairs; put 6) · `Exercises` (`### Easy/Medium/Challenging`) ·
`Further Reading` (links to the sources above).

## Code fences (only these languages — enforced by the validator)

`bash` (the Azure CLI `az` and shell — primary), `json` (ARM templates, `az` JSON output, config),
`yaml` (GitHub Actions & Azure Pipelines), `bicep` (infrastructure as code), `sql` (Azure SQL
Database), `text` (console output, resource trees, portal click-paths). No other fence languages.

## Curriculum (24 lessons, 8/8/8)

Beginner: 01 what-is-cloud-computing · 02 what-is-azure-and-getting-started · 03
azure-global-infrastructure · 04 resource-management-and-arm · 05 core-compute-overview · 06
core-storage-overview · 07 core-networking-overview · 08 identity-and-access.

Intermediate: 09 deploy-a-virtual-machine · 10 host-web-apps-with-app-service · 11
serverless-with-azure-functions · 12 store-data-with-blob-storage · 13 relational-data-with-azure-sql ·
14 nosql-with-cosmos-db · 15 networking-hands-on · 16 secrets-and-configuration-with-key-vault.

Advanced: 17 monitoring-and-observability · 18 containers-on-azure · 19
infrastructure-as-code-with-bicep · 20 cicd-to-azure · 21 cost-management-and-governance · 22
security-in-azure · 23 reliability-and-scaling · 24 well-architected-and-capstone.

## Quizzes

One per lesson: `public/quizzes/lesson-NN.json`, `id` `quiz-lesson-NN`, `lessonId` `lesson-NN`,
`passingScore` 60, 5–6 questions spanning the five types (`single-choice`, `multiple-choice`,
`fill-blank`, `ordering`, `match-pair`). Every answer must be traceable to the lesson text; add an
`explanation` to each. Keep `fill-blank` answers short and provide case variants.
