---
slug: azure-data-encryption-at-rest-and-in-transit
title: "Azure Data Encryption: At Rest and In Transit"
topic: governance-reliability-architecture
kind: concept
summary: "Protect data assets across Azure using platform-managed keys, customer-managed keys (CMK), and TLS encryption in transit."
tags: [encryption, security, key-vault, cmk, tls]
related: [zero-trust-architecture-in-azure, microsoft-defender-for-cloud-and-secure-score, azure-policy-and-compliance-enforcement]
---
> **In one line:** Secure enterprise data across Azure using transparent at-rest encryption and enforced TLS in transit.

## The idea

Enterprise compliance and regulatory mandates (GDPR, HIPAA, PCI-DSS) require stringent protection of sensitive data throughout its entire lifecycle. In Azure, data protection is divided into three critical states: data in transit, data at rest, and data in use.

1. **Encryption in Transit (Data in Motion):**
   - All network traffic traveling across Microsoft's global fiber backbone between Azure data centers is automatically encrypted at the physical layer (MACsec).
   - Services enforce modern Transport Layer Security (**TLS 1.2 or TLS 1.3**) for all external API endpoints, HTTPS web traffic, and database client connections.
   - Unencrypted protocols (HTTP, unencrypted FTP) can be systematically rejected via Azure Policy and service configuration.

2. **Encryption at Rest (Data Stored on Disk):**
   - **Azure Storage Service Encryption (SSE):** Automatically encrypts all data written to Blob storage, Managed Disks, and Azure Files using 256-bit AES encryption. Enabled by default; cannot be disabled.
   - **Transparent Data Encryption (TDE):** Automatically encrypts Azure SQL Database, MySQL, and PostgreSQL databases, backups, and transaction logs at rest.
   - **Azure Disk Encryption (ADE):** Uses Windows BitLocker or Linux DM-Crypt to encrypt OS and data disks inside Virtual Machines.

3. **Key Management Options:**
   - **Platform-Managed Keys (PMK):** Microsoft handles cryptographic key generation, storage, and automated rotation. Zero operational overhead.
   - **Customer-Managed Keys (CMK):** Enterprise stores root encryption keys in **Azure Key Vault** or **Azure Dedicated HSM**. Gives organizations complete control over key rotation schedules and the ability to instantly revoke access ('crypto-shredding').

| Encryption Model | Key Management Authority | Rotation Responsibility | Regulatory Suitability |
|---|---|---|---|
| **Platform-Managed (PMK)** | Microsoft Managed | Automated by Microsoft | Standard enterprise applications |
| **Customer-Managed (CMK)** | **Customer via Key Vault** | Managed by Customer | **Strict compliance (Banking, Healthcare)** |
| **Bring Your Own Key (BYOK)** | Customer via On-Premises HSM | Customer HSM import | Extreme sovereignty mandates |

> **Tip:** Enforce `minimumTlsVersion: "1.2"` across all Storage Accounts, App Services, and Azure SQL instances in your Bicep infrastructure templates.

## See it

Enforce TLS 1.2 and configure Customer-Managed Key encryption on an Azure Storage Account using the Azure CLI:

```bash
# Update storage account to enforce TLS 1.2 and reject unencrypted HTTP traffic
az storage account update   --name stportalprod001   --resource-group rg-learning-portal   --min-tls-version TLS1_2   --https-only true

# Inspect the encryption status of the storage account
az storage account show   --name stportalprod001   --resource-group rg-learning-portal   --query "encryption.services.blob.{enabled:enabled, keySource:keySource}"   --output table
```

By enforcing `min-tls-version TLS1_2` and `https-only true`, all legacy insecure client connections are terminated at the Azure front door.

## Go deeper

For the ultimate data protection tier, explore **Azure Confidential Computing**. By leveraging hardware-based Trusted Execution Environments (TEEs) like AMD SEV-SNP and Intel SGX, Azure encrypts **Data in Use** directly in memory during active processing, preventing hypervisors or cloud operators from ever inspecting cleartext data.

## Watch out

- If you lose access to or delete a Customer-Managed Key (CMK) in Azure Key Vault, all data encrypted by that key is permanently unrecoverable.
- Always enable 'Soft Delete' and 'Purge Protection' on Azure Key Vaults hosting Customer-Managed Keys.

## Remember

- Data at rest is automatically encrypted across Azure storage and database services using 256-bit AES encryption.
- Enforce TLS 1.2 or TLS 1.3 across all application endpoints to guarantee robust encryption in transit.
- Customer-Managed Keys (CMK) in Azure Key Vault provide full sovereign control and crypto-shredding capabilities.
