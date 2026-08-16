---
id: lesson-16
slug: secrets-and-configuration-with-key-vault
title: "Secrets and Configuration with Key Vault"
level: intermediate
order: 16
duration: 19
tags:
  - key-vault
  - managed-identity
  - secrets
  - app-configuration
  - security
summary: "Keep credentials out of your code — store secrets, keys, and certificates in Azure Key Vault, let apps authenticate with managed identities instead of stored passwords, reference secrets from App Service and Functions, and centralize non-secret settings with App Configuration."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what **Azure Key Vault** stores and why to use it.
- Use a **managed identity** so an app authenticates **without stored credentials**.
- Reference Key Vault **secrets** from App Service/Functions settings.
- Know when to add **Azure App Configuration** for non-secret settings.

# Why It Matters

Hard-coded passwords and connection strings are one of the most common — and most damaging — security
mistakes. They leak through source control, logs, and screenshots. Key Vault plus managed identities let
your apps get the secrets they need **without any secret ever living in your code or config**. This is a
foundational secure-by-default pattern.

# Concept Explanation

### What Key Vault stores

**Azure Key Vault** is a secure, centralized store for three kinds of sensitive data:

- **Secrets** — arbitrary strings like passwords, connection strings, and API keys.
- **Keys** — cryptographic keys used for encryption/signing (with options backed by hardware security
  modules, HSMs).
- **Certificates** — TLS/SSL certificates, with lifecycle management.

Key Vault centralizes these, controls access, and logs usage — far safer than scattering secrets across
apps.

### Controlling access

Two access models exist; use **Azure RBAC** (roles like *Key Vault Secrets User*) — the recommended,
consistent approach — over the older **vault access policies**. Grant the **least privilege** needed
(for example, read-only access to secrets).

Turn on **soft delete** and **purge protection** so deleted vaults/secrets can be recovered and can't be
permanently wiped prematurely.

### Managed identities: no credentials in code

A **managed identity** is an automatically managed identity in **Microsoft Entra ID** that an Azure
resource (like a web app or function) uses to authenticate to other services — **without you storing any
credentials**. Two kinds:

- **System-assigned** — created for and tied to a **single** resource; deleted with it.
- **User-assigned** — a **standalone** identity you can attach to **multiple** resources and reuse.

The pattern: give your app a managed identity, grant that identity access to Key Vault, and the app
fetches secrets at runtime by authenticating **as itself** — no password anywhere.

```bash
# Give a web app a system-assigned managed identity
az webapp identity assign --name my-app --resource-group web-rg

# Grant that identity permission to read secrets (RBAC on the vault)
az role assignment create \
  --assignee <app-identity-principal-id> \
  --role "Key Vault Secrets User" \
  --scope <key-vault-resource-id>
```

### Referencing secrets from App Service / Functions

You often don't need code changes at all: App Service and Functions support **Key Vault references** in
app settings. You set an app setting to a reference like:

```text
@Microsoft.KeyVault(SecretUri=https://<vault>.vault.azure.net/secrets/DbPassword/)
```

At runtime the platform (using the app's managed identity) fetches the secret and exposes it to your app
as an ordinary setting — the real value never appears in your configuration.

### App Configuration for non-secret settings

**Azure App Configuration** is a separate service for centralizing **non-secret** application settings
and **feature flags** across apps and environments. Keep **secrets in Key Vault** and **settings in App
Configuration** — the two are designed to work together.

# Key Terminology

- **Azure Key Vault** — a managed store for secrets, keys, and certificates.
- **Secret / key / certificate** — a string, a crypto key, or a TLS certificate.
- **Managed identity** — an Entra ID identity for a resource, with no stored credentials.
- **System- vs user-assigned** — tied to one resource vs standalone and reusable.
- **Key Vault reference** — an app setting that resolves to a vault secret at runtime.
- **Azure App Configuration** — centralized non-secret settings and feature flags.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| App auth to Key Vault | **Managed identity** | **Stored secret/credential** | Always prefer a managed identity — no secret to leak. |
| Identity type | **System-assigned** | **User-assigned** | System-assigned for a single resource's own identity; user-assigned to share one identity across resources. |
| Where settings live | **Key Vault** | **App Configuration** | Secrets → Key Vault; non-secret settings and feature flags → App Configuration. |
| Access model | **Azure RBAC** | **Vault access policies** | Prefer RBAC for consistency with the rest of Azure. |

# Worked Example

Store a secret, then let a web app read it with a managed identity and a Key Vault reference:

```bash
# 1. Create a vault (RBAC-authorization) and add a secret
az keyvault create --name myvault$RANDOM --resource-group sec-rg \
  --location eastus --enable-rbac-authorization true
az keyvault secret set --vault-name <vault> --name DbPassword --value '<StrongP@ss!>'

# 2. Give the web app an identity and grant it read access (see commands above),
#    then set an app setting to a Key Vault reference:
az webapp config appsettings set --name my-app --resource-group web-rg \
  --settings "DB_PASSWORD=@Microsoft.KeyVault(SecretUri=https://<vault>.vault.azure.net/secrets/DbPassword/)"
```

The app reads `DB_PASSWORD` like any setting; the actual secret is fetched securely at runtime and never
stored in the app's config.

# Real World Analogy

Key Vault is a **bank vault** for your secrets. A **managed identity** is a **biometric badge** issued to
your app: instead of carrying a copy of the vault key (which could be stolen), the app proves **who it
is** at the door, and the vault hands over exactly what it's permitted to take. Nobody ever writes the
combination on a sticky note (in your code).

# Examples

## Example 1 — Basic: connection string out of config

Instead of putting a database connection string in a config file, a team stores it in Key Vault and uses
a **Key Vault reference**. The repository and config contain only a pointer, never the secret.

**Why this works:** the secret can't leak through source control because it isn't there.

## Example 2 — Real-world: shared identity for a fleet

Several functions need the same database. The team creates one **user-assigned managed identity**,
grants it read access to the vault, and attaches it to all the functions — one identity to manage.

**Why this works:** user-assigned identities are reusable across resources, simplifying access
management.

## Example 3 — Pitfall: secret in the repo "temporarily"

A developer commits an API key "just to test," planning to remove it later. It's now in git history —
effectively public and hard to erase.

**Why this bites:** once a secret hits source control it must be treated as compromised and rotated. Use
Key Vault from the start.

# Common Mistakes

- **Hard-coding secrets** in code or config, or committing them to git.
- **Storing a credential to reach Key Vault.** Use a **managed identity** instead — no secret needed.
- **Granting broad vault access.** Use RBAC with least privilege (e.g., Secrets User).
- **Putting non-secret settings in Key Vault.** Use App Configuration for those.

# Best Practices

- Store all secrets, keys, and certificates in **Key Vault**; keep them out of code and config.
- Authenticate apps with **managed identities**; never store credentials to reach the vault.
- Use **Azure RBAC** with **least privilege**, and enable **soft delete** and **purge protection**.
- Split concerns: **Key Vault** for secrets, **App Configuration** for settings and feature flags.

# Summary

- **Key Vault** securely stores **secrets, keys, and certificates**, with access control and logging.
- **Managed identities** let apps authenticate **without stored credentials** (system-assigned vs
  user-assigned).
- **Key Vault references** inject secrets into App Service/Functions settings at runtime.
- Keep **secrets in Key Vault** and **non-secret settings/feature flags in App Configuration**.

# Flash Cards

Q: What three kinds of data does Azure Key Vault store?
A: Secrets (strings like passwords and connection strings), keys (cryptographic keys, optionally HSM-backed), and certificates (TLS/SSL, with lifecycle management).

Q: What is a managed identity and why is it valuable?
A: An automatically managed Entra ID identity for an Azure resource that lets it authenticate to services like Key Vault without any stored credentials — so there's no secret to leak.

Q: What's the difference between a system-assigned and a user-assigned managed identity?
A: System-assigned is created for and tied to a single resource (deleted with it); user-assigned is a standalone identity you can attach to and reuse across multiple resources.

Q: What is a Key Vault reference in App Service/Functions?
A: An app setting whose value is a pointer like @Microsoft.KeyVault(SecretUri=...). At runtime the platform uses the app's managed identity to fetch the secret, so the real value never lives in config.

Q: When should you use Azure App Configuration instead of Key Vault?
A: For non-secret application settings and feature flags. Keep secrets in Key Vault and use App Configuration for regular configuration — they're designed to work together.

Q: Why should you prefer Azure RBAC over vault access policies for Key Vault?
A: RBAC gives consistent, centralized access management aligned with the rest of Azure, with least-privilege roles like Key Vault Secrets User.

# Exercises

### Easy
Explain why hard-coding a database password in your app's config file is risky, and what you'd use
instead.

### Medium
Create a Key Vault, add a secret, give a web app a system-assigned managed identity, grant it read
access, and wire the secret into an app setting via a Key Vault reference.

### Challenging
Design secret and configuration management for an app with `dev`, `test`, and `prod` environments:
describe how you'd use Key Vault, managed identities, and App Configuration so no secret ever appears in
source control and each environment gets the right values.

# Further Reading

- Microsoft Learn — *About Azure Key Vault*: <https://learn.microsoft.com/azure/key-vault/general/overview>
- Microsoft Learn — *What are managed identities?*: <https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview>
- Microsoft Learn — *Use Key Vault references in App Service*: <https://learn.microsoft.com/azure/app-service/app-service-key-vault-references>
- Microsoft Learn — *What is Azure App Configuration?*: <https://learn.microsoft.com/azure/azure-app-configuration/overview>
