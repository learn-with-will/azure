---
slug: azure-files-shares-and-protocols
title: "Azure Files: SMB and NFS Cloud File Shares"
topic: storage-and-blob
kind: concept
summary: "Mount shared cloud file systems directly from Windows, Linux, and macOS using SMB 3.0 and NFS."
tags: [azure-files, smb, nfs, file-storage, mount]
related: [azure-storage-account-types, blob-storage-containers-and-tiers, vm-managed-disks-and-storage-types]
---
> **In one line:** Azure Files provides fully managed cloud file shares mounted via standard SMB 3.0 and NFS protocols.

## The idea

Many legacy enterprise applications rely on shared folder trees on local network-attached storage (NAS) or Windows File Servers. Migrating these systems to object storage (Blob) requires rewriting code to use REST APIs. **Azure Files** solves this by providing fully managed cloud file shares accessible via standard operating system file sharing protocols:

1. **Server Message Block (SMB 3.0):** The native file sharing protocol for Windows and modern Linux/macOS. Azure Files supports SMB 3.0 encryption over transit, allowing you to mount a cloud file share directly over the public internet (port 445) or private VPN without deploying a server.
2. **Network File System (NFS 4.1):** High-performance, POSIX-compliant protocol designed for Linux enterprise workloads, container persistent storage (Kubernetes CSI), and high-throughput analytics. Requires Premium SSD storage accounts and virtual network private endpoints.

| Protocol | Client OS | Public Internet Mount | Authentication | Best Use Case |
|---|---|---|---|---|
| **SMB 3.0** | Windows, Linux, macOS | Yes (Encrypted port 445) | Entra ID Kerberos, Storage Key | Enterprise user shares, lift-and-shift apps |
| **NFS 4.1** | Linux | No (Private VNet only) | POSIX UID / GID permissions | Linux databases, HPC compute, Kubernetes PVs |

> **Note:** Many residential Internet Service Providers (ISPs) block outbound TCP port 445 to prevent historic Windows malware propagation. If port 445 is blocked by your ISP, use **Azure File Sync** or mount the share through a VPN/ExpressRoute connection.

## See it

Create an SMB file share and generate the bash mounting script using the Azure CLI:

```bash
# Create a 100 GB quota file share inside your storage account
az storage share-rm create   --resource-group rg-learning-portal   --storage-account stportaldata001   --name shared-app-data   --quota 100   --enabled-protocols SMB   --output table

# Verify the share exists and query its allocated capacity
az storage share-rm show   --resource-group rg-learning-portal   --storage-account stportaldata001   --name shared-app-data   --query "{Name:name, QuotaGB:quota, ProvisionedState:provisioningState}" -o json
```

Once created, you can mount this share as `/mnt/share` on Linux or `Z:` drive on Windows using standard OS mount utilities.

## Go deeper

**Azure File Sync** allows organizations to transform on-premises Windows Servers into local caching appliances for Azure Files. Frequently accessed 'hot' files are kept locally on fast on-premises SSDs, while infrequently accessed 'cold' files are automatically tiered to Azure Files, eliminating on-premises NAS backup overhead.

For enterprise hybrid deployments, **Azure File Sync** synchronizes on-premises Windows Servers directly with Azure Files shares. This transforms local file servers into fast local caches while tiering rarely accessed cold files to cloud storage, keeping local disk footprint minimal while maintaining low-latency SMB access.

## Watch out

- Outbound TCP port 445 must be open on firewalls to mount SMB shares over the public internet.
- NFS file shares do not support multi-protocol access with SMB and cannot be accessed over public internet IPs.

## Remember

- Azure Files provides managed cloud file shares using standard SMB 3.0 and NFS 4.1 protocols.
- Applications can mount file shares directly without rewriting legacy code for object storage APIs.
- Azure File Sync caches cloud shares on local on-premises Windows Servers to minimize local latency.
