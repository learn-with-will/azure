---
id: lesson-12
slug: store-data-with-blob-storage
title: "Store Data with Blob Storage"
level: intermediate
order: 12
duration: 20
tags:
  - blob-storage
  - sas
  - lifecycle
  - static-website
  - security
summary: "Work hands-on with Azure Blob storage — containers and blobs, uploading and downloading with the CLI, granting time-limited access with SAS tokens, automating tier changes and cleanup with lifecycle rules, hosting a static website, and preferring Entra ID over account keys."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Create a **container** and upload/download **blobs** with the CLI.
- Grant temporary, scoped access using a **SAS** token — and know its risks.
- Automate tier transitions and deletion with **lifecycle management** rules.
- Host a **static website** from Blob storage.
- Choose a secure **authorization** method (Entra ID vs keys/SAS).

# Why It Matters

Blob storage is where most cloud apps keep files: user uploads, images, documents, backups, logs, and
even entire static websites. It's cheap, massively scalable, and reachable over HTTP. Knowing how to
move data in and out, share it safely, and manage its lifecycle is an everyday cloud skill.

# Concept Explanation

### Containers and blobs

Inside a storage account, **Blob storage** organizes data into **containers** (like top-level folders).
Each container holds **blobs** (the objects — files, images, backups). A blob is addressed by a URL:

```text
https://<account>.blob.core.windows.net/<container>/<blob-name>
```

Uploading and downloading with the CLI (using **Entra ID** sign-in for auth):

```bash
# Create a container
az storage container create --account-name <account> --name media --auth-mode login

# Upload a file as a blob
az storage blob upload --account-name <account> --container-name media \
  --name logo.png --file ./logo.png --auth-mode login

# Download it again
az storage blob download --account-name <account> --container-name media \
  --name logo.png --file ./logo-copy.png --auth-mode login
```

### Authorizing access: keys, SAS, and Entra ID

There are three main ways to authorize access to blob data:

- **Account keys** — powerful master keys for the whole account. Convenient but **risky** — a leaked key
  exposes everything. Avoid using them in apps.
- **Shared Access Signature (SAS)** — a **time-limited, scoped** token in a URL that grants specific
  permissions (for example, read one container until Friday). Prefer a **user delegation SAS**, which is
  signed with **Entra ID** credentials rather than the account key.
- **Microsoft Entra ID + RBAC** — assign roles like **Storage Blob Data Reader/Contributor** to users
  or managed identities. The most secure and manageable option; use it wherever you can.

### Access tiers and lifecycle management

Each blob has an **access tier** (hot/cool/cold/archive from lesson 6). Rather than moving blobs by
hand, define **lifecycle management** rules on the account, such as: "move blobs to **cool** after 30
days, to **archive** after 90, and **delete** after 365." Azure applies them automatically, saving money
on aging data.

### Static website hosting

Blob storage can serve a **static website** (HTML, CSS, JS, images) directly. Enabling it creates a
special **`$web`** container and gives you a public endpoint — a cheap way to host front-end sites (often
paired with a CDN or Front Door). It serves static files only; there's no server-side code.

# Key Terminology

- **Container** — a top-level grouping of blobs in a storage account.
- **Blob** — a stored object (file, image, backup), addressed by URL.
- **Account key** — a master key for the whole account (avoid in apps).
- **SAS (Shared Access Signature)** — a time-limited, scoped access token; prefer user-delegation SAS.
- **Lifecycle management** — rules to auto-transition tiers or delete blobs by age.
- **Static website** — serving static files directly from the `$web` container.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Authorization | **Account key** | **Entra ID / user-delegation SAS** | Prefer Entra ID (or user-delegation SAS); reserve account keys for rare admin tasks. |
| Sharing a file | **Public container** | **Time-limited SAS** | SAS grants temporary, revocable, scoped access; public access risks over-exposure. |
| Managing old data | **Manual tiering** | **Lifecycle rules** | Automate with lifecycle rules so aging data moves/deletes without you remembering. |

# Worked Example

Generate a read-only SAS so someone can download one blob for a limited time:

```bash
# A user-delegation SAS (signed with your Entra ID login), read-only, expiring soon
end=$(date -u -d "1 hour" '+%Y-%m-%dT%H:%MZ')

az storage blob generate-sas \
  --account-name <account> --container-name media --name logo.png \
  --permissions r --expiry "$end" \
  --auth-mode login --as-user --full-uri
```

The command prints a full URL with the SAS attached; anyone with it can read **only** that blob, and
**only** until it expires.

# Real World Analogy

Blob storage is a **self-storage facility**. A **container** is a **unit**; **blobs** are the **boxes**
inside. An **account key** is the **master key to the whole facility** — you'd never hand it out. A
**SAS** is a **temporary visitor pass** for one unit that **expires** at a set time. **Lifecycle rules**
are a standing instruction to the staff: "move anything older than a year to the cheap back room, and
shred it after three years."

# Examples

## Example 1 — Basic: serve images to a website

An app stores product images as blobs in a `media` container and serves them by URL directly to
browsers, optionally through a CDN for speed.

**Why this works:** blobs are built for large objects served over HTTP at scale.

## Example 2 — Real-world: cut costs automatically

A logging system writes lots of data. A lifecycle rule moves logs to **cool** after 30 days and
**deletes** them after 90, so storage costs stay low without manual cleanup.

**Why this works:** lifecycle rules match spend to the data's declining value over time.

## Example 3 — Pitfall: a long-lived, over-scoped SAS

A developer creates a SAS with full permissions and a one-year expiry, then pastes it into client code.
It leaks — and grants broad access for a year.

**Why this bites:** SAS tokens should be **narrowly scoped** and **short-lived**. Prefer Entra ID/RBAC,
and use user-delegation SAS when a token is unavoidable.

# Common Mistakes

- **Using account keys in application code.** Prefer Entra ID/managed identities.
- **Making a container public to "just share a file."** Use a scoped, short SAS instead.
- **Creating broad, long-lived SAS tokens.** Keep permissions minimal and expiry short.
- **Manually managing tiers.** Automate with lifecycle rules.

# Best Practices

- Authorize with **Entra ID + RBAC**; when you must use SAS, use **user-delegation SAS**, least
  privilege, and short expiry.
- Turn on **lifecycle management** to tier and delete aging data automatically.
- Keep account keys out of apps; rotate them if they're ever exposed.
- Front a **static website** with a CDN/Front Door for performance and HTTPS on a custom domain.

# Summary

- Blob storage organizes data as **containers → blobs**, reachable by URL and managed with the CLI.
- Authorize with **account keys**, **SAS**, or (best) **Entra ID + RBAC**; prefer **user-delegation
  SAS** over key-based SAS.
- **Lifecycle rules** automate tier transitions and deletion to control cost.
- Blob storage can host a **static website** from the `$web` container.

# Flash Cards

Q: How is data organized in Blob storage?
A: A storage account holds containers (top-level groupings), and each container holds blobs (objects like files and images), each addressable by a URL.

Q: What is a SAS (Shared Access Signature)?
A: A time-limited, scoped token (usually in a URL) that grants specific permissions to storage data. A user-delegation SAS is signed with Entra ID credentials rather than the account key, and is preferred.

Q: What's the most secure way to authorize access to blobs?
A: Microsoft Entra ID with RBAC (roles like Storage Blob Data Reader/Contributor), ideally via managed identities — no shared secrets to leak.

Q: What does blob lifecycle management do?
A: Applies rules to automatically transition blobs between access tiers (e.g., to cool/archive) or delete them based on age, reducing cost without manual work.

Q: How do you host a static website from Blob storage?
A: Enable static website hosting, which creates a special `$web` container and a public endpoint that serves your static files (HTML/CSS/JS). It serves static content only — no server-side code.

Q: Why avoid using account keys in application code?
A: Account keys grant full access to the entire storage account, so a leak exposes everything. Use Entra ID/managed identities or scoped, short-lived SAS instead.

# Exercises

### Easy
Create a container, upload a file to it, and download it again using the CLI with `--auth-mode login`.
Note the blob's URL.

### Medium
Generate a read-only, one-hour user-delegation SAS for a single blob and test it in a browser. Explain
why you scoped it to read-only and a short expiry.

### Challenging
Design a lifecycle policy for an app that stores invoices: they're read often for 60 days, rarely for a
year, and must be retained for seven years. Specify the tier transitions and deletion timing, and
justify them against cost and access needs.

# Further Reading

- Microsoft Learn — *Introduction to Blob storage*: <https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction>
- Microsoft Learn — *Grant limited access with SAS*: <https://learn.microsoft.com/azure/storage/common/storage-sas-overview>
- Microsoft Learn — *Optimize costs with lifecycle management*: <https://learn.microsoft.com/azure/storage/blobs/lifecycle-management-overview>
- Microsoft Learn — *Static website hosting in Blob storage*: <https://learn.microsoft.com/azure/storage/blobs/storage-blob-static-website>
