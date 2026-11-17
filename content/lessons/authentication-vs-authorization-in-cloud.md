---
slug: authentication-vs-authorization-in-cloud
title: "Authentication vs Authorization in Azure"
topic: identity-and-security
kind: concept
summary: "Distinguish proving identity (authentication) from granting permissions to perform actions (authorization)."
tags: [authentication, authorization, security, principles]
related: [microsoft-entra-id-fundamentals, azure-role-based-access-control-rbac, zero-trust-architecture-in-azure]
---
> **In one line:** Authentication verifies who you are; authorization determines what actions you are permitted to take.

## The idea

Security in cloud computing rests upon two distinct, complementary concepts that are often mistakenly conflated:

1. **Authentication (AuthN):** The process of **verifying identity**. It answers the question: *"Who are you?"*
   - Involves presenting credentials: a username and password, an MFA biometric scan, an SSH private key, or an OAuth2 bearer token.
   - Handled in Azure by **Microsoft Entra ID**. Once authenticated, Entra ID issues a cryptographically signed JSON Web Token (JWT) containing your unique user or service identity claims.
2. **Authorization (AuthZ):** The process of **determining permissions**. It answers the question: *"What are you allowed to do?"*
   - Occurs *after* authentication succeeds. It checks whether the authenticated caller has permission to perform a specific operation on a specific resource.
   - Handled in Azure by **Azure Role-Based Access Control (RBAC)**. When you run `az vm restart`, the Azure Resource Manager checks your token's role assignments before allowing the restart action.

| Dimension | Authentication (AuthN) | Authorization (AuthZ) |
|---|---|---|
| **Question** | *"Who are you?"* | *"What may you do?"* |
| **Enforcing Service** | Microsoft Entra ID | Azure RBAC & Resource Providers |
| **Mechanism** | Passwords, MFA, Passkeys, Certificates | Role assignments, scopes, policy effects |
| **Output** | Signed identity token (JWT) | Access decision: **Allow** or **Deny** |
| **Example Error** | `AADSTS50034: User account does not exist` | `403 Forbidden: Missing Microsoft.Compute/virtualMachines/restart/action` |

> **Note:** Successful authentication does not grant any resource access by itself. A freshly created user who authenticates successfully into an Azure tenant has zero permissions until an administrator explicitly assigns them an RBAC role.

## See it

Inspect the current authenticated identity and test permissions using the Azure CLI:

```bash
# Verify the authenticated user identity (Authentication - AuthN)
az ad signed-in-user show --query "{DisplayName:displayName, UPN:userPrincipalName, Id:id}" -o table

# Check what authorization permissions you hold on a resource group (Authorization - AuthZ)
az role assignment list --assignee $(az ad signed-in-user show --query "id" -o tsv)   --query "[].{Role:roleDefinitionName, Scope:scope}" -o table
```

The first command queries who you are; the second queries the explicit role permissions authorized for your identity across the subscription hierarchy.

## Go deeper

Cloud systems should implement **Claims-Based Authorization**. Instead of checking a user's static job title, the authorization engine evaluates real-time token claims—such as whether the user authenticated using phishing-resistant FIDO2 MFA, whether their laptop is compliant in Microsoft Intune, and their current IP geolocation risk score.

Modern cloud applications implement Claims-Based Authorization. After authentication, Entra ID issues a JSON Web Token containing claims (such as roles, tenant ID, and groups). The receiving application validates the token signature against Microsoft's public OpenID metadata before parsing claims to make local authorization decisions.

## Watch out

- Never assume an authenticated user is authorized; failing to assign least-privilege RBAC roles leads to immediate 403 Forbidden errors.
- Do not confuse user authentication with application-level API token validation inside your custom microservices.

## Remember

- Authentication (AuthN) proves identity; Authorization (AuthZ) determines permitted actions.
- Microsoft Entra ID handles authentication; Azure RBAC handles authorization.
- Authenticating into a tenant provides zero access until explicit RBAC roles are assigned.
