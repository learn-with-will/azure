---
slug: avoiding-hardcoded-credentials
title: "Avoiding Hardcoded Credentials and Leaked Keys"
topic: identity-and-security
kind: pitfall
summary: "Prevent high-severity credential compromise by combining Managed Identities, Key Vault, and RBAC."
tags: [secrets-management, credentials, security, pitfall]
related: [azure-key-vault-secrets-keys-certificates, managed-identities-for-azure-resources, shared-access-signatures-sas]
---
> **In one line:** Never commit credentials to Git; use Managed Identities and Key Vault to eliminate secrets in code.

## The idea

One of the most catastrophic security failures in cloud computing is the **credential leak**. Developers frequently hardcode database connection strings, storage account keys, or API passwords into source code files, `.env` files, or Dockerfiles for convenience during local testing.

When that code is committed to a Git repository—especially public GitHub or shared enterprise repos—automated botnets discover the secrets within seconds. Attackers use compromised credentials to deploy high-spec GPU virtual machines for cryptocurrency mining, exfiltrate private database rows, or delete production infrastructure.

The modern cloud security architecture eliminates hardcoded credentials using a three-tier defense:
1. **Tier 1: Passwordless Managed Identities:** Whenever an Azure service talks to another Azure service (App Service to Azure SQL, Functions to Blob Storage), use **Managed Identities**. Zero credentials exist anywhere in the code or configuration.
2. **Tier 2: Azure Key Vault:** When talking to external third-party systems that require passwords (e.g., Stripe API, SendGrid), store the credentials in **Azure Key Vault** and inject them via Key Vault references.
3. **Tier 3: Automated Secret Scanning:** Enable **GitHub Secret Scanning** and Azure DevOps credential scanners to block commits containing high-entropy tokens before they are pushed to remote repositories.

| Vulnerable Anti-Pattern | Secure Production Alternative |
|---|---|
| Hardcoded SQL password in `appsettings.json` | **Entra ID Managed Identity authentication** |
| Master Storage Account Key in code | **Azure RBAC (`Storage Blob Data Contributor`)** |
| Private SSH key committed to Git | **Azure Bastion or Key Vault stored keys** |
| Long-lived API token in shell script | **Short-lived Azure CLI tokens (`az account get-access-token`)** |

> **Watch out:** Even in private Git repositories, hardcoded secrets remain accessible in the permanent Git commit history forever unless purged with specialized tools like `git-filter-repo`.

## See it

Audit a resource group for hardcoded credentials and review secret rotation practices via the Azure CLI:

```bash
# Query storage accounts to verify shared key access is explicitly blocked
az storage account list --resource-group rg-learning-portal   --query "[].{Account:name, AllowSharedKey:allowSharedKeyAccess}" -o table

# Check Key Vault secret expiration dates to identify unrotated credentials
az keyvault secret list --vault-name kv-portal-prod-001   --query "[].{Name:name, Enabled:attributes.enabled, Expires:attributes.expires}" -o table
```

Enforcing `--allow-shared-key-access false` ensures that even if an ancient storage master key is leaked, attackers cannot authenticate with it.

## Go deeper

Microsoft Defender for Cloud includes **Container and Code Secret Scanning**. It continuously inspects deployed container images in Azure Container Registry (ACR) and running virtual machine filesystems, alerting security operations teams immediately if plaintext private keys, AWS access tokens, or SQL credentials are discovered on disk.

## Watch out

- Never assume private Git repositories are safe; compromised developer laptops or contractor access can expose private repositories.
- Rotating a leaked credential without revoking active sessions or checking audit logs leaves the door open to persistent backdoors.

## Remember

- Never commit secrets, passwords, or storage keys into source code or Git repositories.
- Use Managed Identities for passwordless service-to-service authentication inside Azure.
- Use Azure Key Vault with secret scanning to detect and protect third-party credentials.
