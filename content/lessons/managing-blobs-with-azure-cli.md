---
slug: managing-blobs-with-azure-cli
title: "Uploading and Managing Blobs with Azure CLI"
topic: storage-and-blob
kind: tool
summary: "Create containers, upload files, download blobs, and inspect metadata using az storage blob commands."
tags: [azure-cli, blob-storage, upload, download, cli]
related: [blob-storage-containers-and-tiers, shared-access-signatures-sas, static-website-hosting-in-blob-storage]
---
> **In one line:** The Azure CLI manages containers and transfers blob objects securely using Entra ID or storage keys.

## The idea

The Azure CLI provides robust command sets (`az storage container` and `az storage blob`) to automate object storage operations.

Key authentication mechanisms for CLI blob commands:
1. **Entra ID Role-Based Access (`--auth-mode login`):** The secure enterprise standard. Uses your logged-in Azure user account or service principal identity with RBAC roles (such as *Storage Blob Data Contributor*). Does not require revealing or storing static account keys.
2. **Account Key Authentication (`--account-key`):** The legacy fallback. Uses the all-powerful 512-bit master storage account key. Grants full administrative root control over the entire storage account.

Common blob management actions include:
- `az storage blob upload`: Uploads a single file to a container.
- `az storage blob download`: Downloads a blob to local disk.
- `az storage blob list`: Lists blobs with JMESPath filtering.
- `az storage blob set-tier`: Manually transitions blobs between Hot, Cool, Cold, and Archive tiers.

| Command | Action | Key Flags |
|---|---|---|
| `az storage blob upload` | Upload single file | `--container-name`, `--file`, `--name` |
| `az storage blob download` | Download to local | `--container-name`, `--name`, `--file` |
| `az storage blob list` | Query container objects | `--container-name`, `--prefix` |
| `az storage blob set-tier` | Change access tier | `--tier` (Hot, Cool, Cold, Archive) |

> **Tip:** Always pass `--auth-mode login` in your CLI scripts. This verifies that your Entra ID user identity has explicit RBAC permissions and avoids exposing raw storage master keys in shell logs.

## See it

Upload a local document, query its properties, and change its access tier using the Azure CLI:

```bash
# Upload a file to the blob container using Entra ID authentication
az storage blob upload   --account-name stportaldata001   --container-name customer-documents   --name "reports/q3-summary.pdf"   --file ./summary.pdf   --auth-mode login   --output table

# Transition the uploaded blob to the Cool tier to save storage costs
az storage blob set-tier   --account-name stportaldata001   --container-name customer-documents   --name "reports/q3-summary.pdf"   --tier Cool   --auth-mode login

# Verify the blob's active access tier and content length
az storage blob show   --account-name stportaldata001   --container-name customer-documents   --name "reports/q3-summary.pdf"   --auth-mode login   --query "{Name:name, Tier:properties.blobTier, Bytes:properties.contentLength}" -o json
```

The output confirms the blob was uploaded to the virtual path `reports/q3-summary.pdf` and set to the Cool access tier.

## Go deeper

For transferring terabytes of data or synchronizing entire directory trees to Azure Blob storage, Microsoft provides **AzCopy**, a dedicated high-performance multithreaded command-line utility. AzCopy utilizes concurrent HTTP/2 connections and supports resuming interrupted large file uploads.

For massive bulk data transfers involving millions of files or petabytes of data, use **AzCopy** instead of the standard Azure CLI. AzCopy is a specialized, multi-threaded command-line utility optimized for maximum throughput, automated retry resumption, and high-concurrency blob uploads and downloads.

## Watch out

- Forgetting `--auth-mode login` causes the CLI to attempt discovering local storage keys, which fails if keys are disabled by policy.
- Blob names containing forward slashes (`/`) create virtual directories; they are not true physical filesystem folders.

## Remember

- Use `--auth-mode login` to authenticate storage CLI commands securely with Microsoft Entra ID.
- Use `az storage blob set-tier` to optimize costs by moving aging blobs to Cool or Archive.
- Use AzCopy for bulk file transfers, synchronization, and multi-gigabyte object uploads.
