---
slug: shared-access-signatures-sas
title: "Shared Access Signatures (SAS)"
topic: storage-and-blob
kind: technique
summary: "Delegate secure, time-bounded, permission-restricted access to storage resources without revealing account keys."
tags: [sas, tokens, security, delegation, storage]
related: [managing-blobs-with-azure-cli, storage-security-and-entra-id-rbac, avoiding-hardcoded-credentials]
---
> **In one line:** SAS tokens grant fine-grained, time-limited, signed URI access to storage without sharing account keys.

## The idea

Sharing storage resources securely with external clients, mobile applications, or third-party vendors presents a security dilemma. You cannot share your master storage account keys (which grant full root control), and external users may not possess accounts in your Microsoft Entra ID tenant.

A **Shared Access Signature (SAS)** solves this by generating a cryptographically signed URI parameter that grants granular, time-limited access to specific storage resources.

Every SAS token embeds strict security constraints:
1. **Allowed Permissions:** Restrict access to specific verbs (`r` for Read, `w` for Write, `d` for Delete, `l` for List).
2. **Time Window:** Explicit start time and expiration time (e.g., valid for exactly 15 minutes).
3. **Allowed IP Addresses:** Optional IP range restriction (e.g., only requests originating from corporate office IPs).
4. **Protocol:** Restrict to HTTPS only.

Azure supports three types of SAS tokens:
- **User Delegation SAS:** Signed with Entra ID credentials (the most secure approach). If the user's Entra account is revoked, the SAS immediately becomes invalid.
- **Service SAS:** Signed with the storage account key, scoping access to a single service (e.g., one blob).
- **Account SAS:** Signed with the storage account key, delegating access across all services.

| SAS Type | Signing Key | Revocation Method | Security Rating |
|---|---|---|---|
| **User Delegation SAS** | Entra ID User Token | Revoke user or change Entra ID role | **Highest (Recommended)** |
| **Service SAS with Stored Policy** | Storage Account Key | Modify or delete Stored Access Policy | High |
| **Ad-Hoc Service SAS** | Storage Account Key | Rotate Master Storage Key (Disruptive) | Moderate |

> **Tip:** Never create ad-hoc SAS tokens with multi-year expiration dates. Best practice dictates generating short-lived SAS tokens (e.g., 15 to 60 minutes) dynamically on demand through a backend API.

## See it

Generate a read-only SAS token for an individual blob using the Azure CLI:

```bash
# Generate a read-only SAS token valid for exactly 30 minutes
SAS_TOKEN=$(az storage blob generate-sas   --account-name stportaldata001   --container-name customer-documents   --name "reports/q3-summary.pdf"   --permissions r   --expiry $(date -u -d "30 minutes" '+%Y-%m-%dT%H:%MZ')   --https-only   --auth-mode login   --as-user   --output tsv)

# Construct the full authenticated URL for external download
BLOB_URL="https://stportaldata001.blob.core.windows.net/customer-documents/reports/q3-summary.pdf?${SAS_TOKEN}"
echo "Secure download URL: $BLOB_URL"
```

A client receiving this URL can download the file over HTTPS without possessing an Azure account or storage key. Once 30 minutes elapse, all download requests return HTTP 403 Forbidden.

## Go deeper

For Service SAS tokens, you should bind the SAS to a **Stored Access Policy** created on the container. A stored access policy decouples the token from its permissions. If a SAS token URL is accidentally leaked publicly, an administrator can revoke the token immediately by deleting the stored access policy without rotating master storage account keys.

## Watch out

- Never generate an ad-hoc SAS token with years of validity; anyone who intercepts the URL possesses full access until expiration.
- Generating account-level SAS tokens with delete permissions exposes the storage account to malicious data destruction.

## Remember

- SAS tokens grant granular, time-limited access to specific storage resources via signed URL queries.
- User Delegation SAS signed with Entra ID credentials is the most secure SAS pattern.
- Keep SAS token expiration windows as short as practical (15–60 minutes) to mitigate leak risks.
