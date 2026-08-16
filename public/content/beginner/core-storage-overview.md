---
id: lesson-06
slug: core-storage-overview
title: "Core Storage Overview"
level: beginner
order: 6
duration: 18
tags:
  - storage
  - blob
  - files
  - redundancy
  - access-tiers
summary: "Azure's core storage building blocks — the storage account and its Blob, File, Queue, and Table services (plus managed disks for VMs), the hot/cool/cold/archive access tiers for blobs, and the LRS/ZRS/GRS/GZRS redundancy options that decide how many copies of your data exist and where."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the **Azure Storage account** and the four data services it provides.
- Explain what **Blob storage** is and when to use **Files**, **Queues**, and **Tables**.
- Choose a blob **access tier** (hot, cool, cold, archive) based on how often data is read.
- Explain **redundancy** options (LRS, ZRS, GRS, GZRS) and what each protects against.

# Why It Matters

Almost every application stores something — images, documents, backups, logs, app data. Azure Storage
is the durable, scalable foundation for all of it, and it's cheap and everywhere. Choosing the right
**tier** and **redundancy** balances **cost** against **performance** and **resilience**, so these
choices show up constantly.

# Concept Explanation

### The storage account and its services

An **Azure Storage account** is a container for several data services that share settings like
redundancy and access keys:

- **Blob storage** — **object storage** for unstructured data: files, images, video, backups, logs.
  The workhorse. ("Blob" = Binary Large Object.)
- **Azure Files** — fully managed **file shares** you can mount over **SMB** or **NFS**, like a network
  drive in the cloud.
- **Queue storage** — a simple **message queue** for decoupling parts of an app (a producer adds
  messages; a consumer processes them).
- **Table storage** — a **NoSQL key/value** store for large amounts of simple structured data.

Separately, **Managed Disks** provide the disks that back **virtual machines** — a related storage
service, but its own resource type rather than something inside a general-purpose storage account.

### Blob access tiers: pay for how often you read

Blob data can sit in different **access tiers** priced by how often you touch it. Cooler tiers cost
**less to store** but **more to access** (and have minimums on how long data should stay there):

- **Hot** — frequent access; highest storage cost, lowest access cost.
- **Cool** — infrequent access (kept ~30+ days); cheaper storage.
- **Cold** — rarely accessed (kept ~90+ days); cheaper still.
- **Archive** — **offline**, lowest storage cost, for long-term retention; you must **rehydrate** a blob
  (which takes time) before you can read it.

Match the tier to the data's real access pattern — for example, this month's uploads in **hot**, old
backups in **archive**.

### Redundancy: how many copies, and where

**Redundancy** decides how many copies of your data Azure keeps and how far apart. More redundancy costs
more but survives bigger failures:

- **LRS (Locally Redundant Storage)** — three copies within a **single datacenter**. Protects against
  disk/server failure; not a datacenter outage.
- **ZRS (Zone-Redundant Storage)** — copies across **availability zones** in the region. Survives a
  datacenter (zone) outage.
- **GRS (Geo-Redundant Storage)** — LRS **plus** an asynchronous copy to a **secondary region**.
  Survives a regional disaster.
- **GZRS (Geo-Zone-Redundant Storage)** — ZRS **plus** a secondary-region copy. The most resilient.
- **RA-GRS / RA-GZRS** — the "read-access" variants that also let you **read** from the secondary
  region.

```text
LRS   → 3 copies, one datacenter          (cheapest; local failures)
ZRS   → across zones in the region        (datacenter/zone outage)
GRS   → local + async copy to a 2nd region (regional disaster)
GZRS  → zonal + a 2nd region              (most resilient)
```

# Key Terminology

- **Storage account** — the top-level resource holding Blob, File, Queue, and Table services.
- **Blob storage** — object storage for unstructured data (files, media, backups, logs).
- **Azure Files** — managed SMB/NFS file shares.
- **Queue storage** — a simple message queue for decoupling components.
- **Table storage** — a NoSQL key/value store for structured data.
- **Access tier** — hot/cool/cold/archive; trades storage cost against access cost.
- **Redundancy (LRS/ZRS/GRS/GZRS)** — how many copies exist and how far apart.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Data type | **Blob** (objects) | **Files** (mounted share) | Blob for app objects/media/backups; Files when apps expect a mounted drive/share. |
| Access tier | **Hot** (frequent) | **Cool/Cold/Archive** (rare) | Hot for active data; cooler tiers for aging or archival data to cut storage cost. |
| Redundancy | **LRS** (cheapest) | **ZRS / GRS / GZRS** | LRS for non-critical/replaceable data; ZRS+ for uptime; GRS/GZRS for disaster recovery. |

# Worked Example

Create a storage account and a blob container, then upload a file:

```bash
# Storage account names are globally unique and lowercase (3–24 chars)
az storage account create \
  --name learnstore$RANDOM \
  --resource-group learn-rg \
  --location eastus \
  --sku Standard_LRS \
  --access-tier Hot

# Create a container (a folder-like grouping for blobs)
az storage container create --account-name <your-account> --name uploads --auth-mode login

# Upload a local file as a blob
az storage blob upload \
  --account-name <your-account> --container-name uploads \
  --name notes.txt --file ./notes.txt --auth-mode login
```

The `--sku Standard_LRS` sets redundancy; `--access-tier Hot` sets the default tier. You can change the
tier of individual blobs later as they age.

# Real World Analogy

Storage tiers are like where you keep your belongings. **Hot** is your **desk** — instantly reachable
but prime real estate. **Cool/Cold** is a **closet** — cheaper space, a little effort to fetch.
**Archive** is a **deep-storage warehouse** — very cheap, but you must **request** an item and **wait**
for it to arrive. **Redundancy** is how many backup copies you keep and whether one lives in another
city in case yours floods.

# Examples

## Example 1 — Basic: store user uploads

A photo app keeps user images in **Blob storage** in the **hot** tier while they're active, serving them
directly to browsers.

**Why this works:** blobs are built for large, unstructured objects served over HTTP.

## Example 2 — Real-world: cheap long-term backups

A company keeps daily database backups. Recent ones stay in **cool**, and anything older than a year
moves to **archive**, cutting storage cost dramatically for data that's almost never read.

**Why this works:** matching tier to access pattern trades a little retrieval delay for big savings.

## Example 3 — Pitfall: LRS for critical data

A team stores their only copy of important data as **LRS** and assumes it's "in the cloud, so it's
safe." A regional incident makes it temporarily unavailable with no secondary copy.

**Why this bites:** LRS protects against local hardware failure, not a regional outage. Critical data
needs **ZRS** or **geo-redundant** options.

# Common Mistakes

- **Leaving everything in hot.** Aging data in cooler tiers saves money.
- **Forgetting archive is offline.** You must rehydrate before reading — plan for the delay.
- **Using LRS for irreplaceable data.** Choose ZRS/GRS/GZRS based on the failure you must survive.
- **Confusing Blob and Files.** Blob = objects via API/HTTP; Files = a mounted SMB/NFS share.

# Best Practices

- Pick the **access tier** from the data's real read pattern; automate tier transitions with
  **lifecycle** rules (lesson 12).
- Choose **redundancy** by the failure you must survive, not by habit.
- Keep storage account names planned — they're **globally unique** and hard to change later.
- Prefer **Microsoft Entra ID (`--auth-mode login`)** over account keys for access where possible.

# Summary

- A **storage account** provides **Blob**, **File**, **Queue**, and **Table** services; **Managed
  Disks** back VMs separately.
- **Blob** access tiers — **hot, cool, cold, archive** — trade storage cost against access cost and
  speed (archive is offline).
- **Redundancy** — **LRS, ZRS, GRS, GZRS** (+ read-access variants) — decides how many copies exist and
  whether one lives in another region.
- Match tier and redundancy to each dataset's **access pattern** and **resilience needs**.

# Flash Cards

Q: What four data services does an Azure Storage account provide?
A: Blob storage (objects), Azure Files (SMB/NFS shares), Queue storage (messages), and Table storage (NoSQL key/value). Managed Disks back VMs as a separate service.

Q: What is Blob storage best for?
A: Unstructured object data — files, images, video, backups, and logs — accessed over HTTP/APIs.

Q: What are the blob access tiers, and how do they trade off?
A: Hot, cool, cold, and archive. Cooler tiers cost less to store but more (and slower) to access; archive is offline and must be rehydrated before reading.

Q: What does LRS protect against, and what doesn't it protect against?
A: LRS keeps three copies in a single datacenter — it protects against disk/server failure but not a whole-datacenter or regional outage.

Q: What's the difference between ZRS and GRS?
A: ZRS spreads copies across availability zones within one region (survives a datacenter outage); GRS also copies asynchronously to a secondary region (survives a regional disaster).

Q: Why must storage account names be chosen carefully?
A: They are globally unique across all of Azure and lowercase (3–24 chars), and are hard to change later.

# Exercises

### Easy
Match each to a storage service: (a) user-uploaded photos, (b) a shared network drive for an app, (c)
messages between two components, (d) the disk for a virtual machine.

### Medium
Create a storage account with LRS, upload a file to a blob container, then check its access tier. Write
down when you'd move it to cool or archive.

### Challenging
For a dataset that must survive a full regional outage *and* be readable during one, choose a redundancy
option and justify it against the alternatives, including the cost implication.

# Further Reading

- Microsoft Learn — *Introduction to Azure Storage*: <https://learn.microsoft.com/azure/storage/common/storage-introduction>
- Microsoft Learn — *Azure Storage redundancy*: <https://learn.microsoft.com/azure/storage/common/storage-redundancy>
- Microsoft Learn — *Blob access tiers (hot, cool, cold, archive)*: <https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview>
- Microsoft Learn — *Introduction to Blob storage*: <https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction>
