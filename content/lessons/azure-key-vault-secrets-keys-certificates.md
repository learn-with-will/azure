---
slug: azure-key-vault-secrets-keys-certificates
title: "Azure Key Vault: Secrets, Keys, and Certificates"
topic: identity-and-security
kind: concept
summary: "Centralize and safeguard cryptographic keys, application passwords, connection strings, and TLS certificates."
tags: [key-vault, secrets, encryption-keys, certificates]
related: [managed-identities-for-azure-resources, app-service-key-vault-references, avoiding-hardcoded-credentials]
---
> **In one line:** Azure Key Vault centralizes and protects secrets, encryption keys, and TLS certificates in hardware HSMs.

## The idea

Storing database connection strings, third-party API tokens, and private encryption keys in application source code, Git repositories, or environment configuration files is a critical vulnerability. **Azure Key Vault** provides a secure, centralized cloud repository for safeguarding sensitive credentials.

Key Vault organizes sensitive data into three distinct asset types:
1. **Secrets:** Plaintext strings up to 25 KB in size—database passwords, API tokens, third-party private keys, and connection strings. Key Vault encrypts them at rest and returns them over HTTPS to authorized applications.
2. **Keys:** Cryptographic encryption keys (RSA or Elliptic Curve). Used for data encryption, decryption, and digital signatures. Keys can be software-protected (Standard tier) or hardware-protected using FIPS 140-2 Level 2/3 validated **Hardware Security Modules (HSMs)** in the Premium tier. The private key material **never leaves the HSM**.
3. **Certificates:** X.509 TLS/SSL certificates. Key Vault automates certificate provisioning, lifecycle enrollment, and automated renewals with public Certificate Authorities (DigiCert, GlobalSign).

| Vault Object | Primary Content | Common Example | Typical Consumers |
|---|---|---|---|
| **Secret** | Sensitive configuration text | Database connection string | App Service, Azure Functions, VMs |
| **Key** | Asymmetric encryption key | Transparent Data Encryption (TDE) key | Storage SSE, SQL TDE, BitLocker |
| **Certificate** | X.509 TLS certificate | Wildcard web domain certificate | Application Gateway, Front Door |

> **Tip:** Enable **Soft-Delete** and **Purge Protection** on all production Key Vaults. This prevents malicious attackers or accidental deletion scripts from permanently erasing critical encryption keys without a mandatory 90-day retention hold.

## See it

Create an Azure Key Vault and store a database password secret using the Azure CLI:

```bash
# Step 1: Create a secure Azure Key Vault with soft-delete enabled
az keyvault create   --name kv-portal-prod-001   --resource-group rg-learning-portal   --location eastus   --enable-rbac-authorization true   --output table

# Step 2: Store an application secret inside the Key Vault
az keyvault secret set   --vault-name kv-portal-prod-001   --name "DbConnectionString"   --value "Server=tcp:sql-prod.database.windows.net;Database=orders;User ID=appuser;"   --output table

# Step 3: Retrieve the secret value programmatically
az keyvault secret show   --vault-name kv-portal-prod-001   --name "DbConnectionString"   --query "value" -o tsv
```

The secret is encrypted at rest in Key Vault, accessible only by security principals holding explicit RBAC permissions.

## Go deeper

Key Vault supports **Azure RBAC Permission Model** (recommended) or legacy **Vault Access Policies**. Using the Azure RBAC model allows administrators to grant roles like *Key Vault Secrets User* or *Key Vault Crypto Officer* at the individual secret level, providing exact least-privilege scoping.

## Watch out

- Key Vault names must be globally unique across all of Azure and are limited to 3–24 alphanumeric characters and hyphens.
- Purge Protection prevents deleting the vault immediately; testing teardown scripts on purge-protected vaults requires unique vault names.

## Remember

- Azure Key Vault secures Secrets (passwords), Keys (HSM encryption), and Certificates (TLS).
- Enable Soft-Delete and Purge Protection to prevent catastrophic accidental credential deletion.
- Use the Azure RBAC model to assign least-privilege access roles to specific secrets.
