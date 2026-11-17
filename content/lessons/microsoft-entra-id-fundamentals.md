---
slug: microsoft-entra-id-fundamentals
title: "Microsoft Entra ID Fundamentals"
topic: identity-and-security
kind: concept
summary: "Understand Microsoft Entra ID (formerly Azure AD) as a cloud-native identity and access management service."
tags: [entra-id, identity, iam, cloud-directory]
related: [authentication-vs-authorization-in-cloud, azure-role-based-access-control-rbac, mfa-and-conditional-access-policies]
---
> **In one line:** Microsoft Entra ID is the multi-tenant, cloud-native identity and access management service powering Azure.

## The idea

**Microsoft Entra ID** (formerly **Azure Active Directory / Azure AD**, renamed in 2023) is Microsoft's cloud-based identity and access management (IAM) platform. It provides single sign-on (SSO), multi-factor authentication (MFA), and conditional access security for Microsoft Azure, Microsoft 365, and thousands of third-party SaaS applications (Salesforce, ServiceNow, GitHub).

It is vital to distinguish modern cloud Entra ID from legacy on-premises **Active Directory Domain Services (AD DS)**:
- **On-Premises AD DS:** Designed for corporate local area networks. Organizes servers and workstations into Organizational Units (OUs), enforces Group Policy Objects (GPOs), and uses legacy Kerberos and NTLM protocols over LDAP.
- **Microsoft Entra ID:** A cloud-native identity service accessed over the public internet. Uses modern HTTP-based web identity protocols: **OAuth 2.0, OpenID Connect (OIDC), and SAML 2.0**. It does not use OUs, GPOs, or Kerberos tickets natively.

| Feature | On-Premises Active Directory (AD DS) | Microsoft Entra ID |
|---|---|---|
| **Primary Protocols** | Kerberos, NTLM, LDAP, DNS | OpenID Connect, OAuth 2.0, SAML, REST |
| **Device Management** | Group Policy Objects (GPOs), Domain Join | Microsoft Intune, Entra Join, Conditional Access |
| **Target Scope** | Corporate internal office LAN | Global internet-facing cloud SaaS and Azure |
| **Trust Model** | Perimeter network trust | **Zero Trust ("Verify explicitly")** |

> **Tip:** You can synchronize on-premises Active Directory user accounts, groups, and password hashes into Microsoft Entra ID using **Microsoft Entra Connect Sync**, providing employees with a single identity across hybrid infrastructure.

## See it

Inspect your tenant directory, active users, and service principals using the Azure CLI:

```bash
# Query the tenant domain name and directory ID for your active session
az account show --query "{TenantDomain:user.name, TenantId:tenantId}" -o json

# Query user accounts defined within the Microsoft Entra ID tenant
az ad user list --upn "alex@contoso.com" --query "[].{DisplayName:displayName, UPN:userPrincipalName, AccountEnabled:accountEnabled}" -o table
```

The output confirms the authenticated user account and tenant directory context recognized across the Microsoft cloud identity fabric.

## Go deeper

Microsoft Entra is the broader product family encompassing modern identity solutions:
- **Entra ID:** Core cloud directory and access management.
- **Entra ID Governance:** Identity lifecycle, access reviews, and entitlement management.
- **Entra External ID:** Identity management for consumer-facing customer applications (B2C).
- **Entra Verified ID:** Decentralized, verifiable identity credentials based on open standards.

Microsoft Entra ID connects seamlessly to on-premises Active Directory Domain Services using **Microsoft Entra Connect**. This hybrid synchronization engine syncs user accounts, password hashes, and group memberships into the cloud, enabling seamless single sign-on across legacy on-premises assets and modern cloud apps.

## Watch out

- Do not assume on-premises GPOs or Kerberos domains apply to cloud VMs without deploying Microsoft Entra Domain Services.
- Deleting an Entra user account immediately revokes access across all linked Azure subscriptions and Microsoft 365 services.

## Remember

- Microsoft Entra ID (formerly Azure AD) is Microsoft's cloud-native identity service.
- Entra ID uses modern web protocols (OAuth 2.0, OIDC, SAML), not legacy Kerberos or LDAP.
- Entra Connect synchronizes on-premises enterprise Active Directory identities into the cloud.
