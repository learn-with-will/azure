---
id: lesson-08
slug: identity-and-access
title: "Identity and Access"
level: beginner
order: 8
duration: 18
tags:
  - entra-id
  - rbac
  - authentication
  - authorization
  - mfa
summary: "How Azure knows who you are and what you may do — Microsoft Entra ID (formerly Azure AD) as the cloud identity service, authentication versus authorization, Azure role-based access control (RBAC) with scopes and built-in roles, and stronger sign-in with MFA and Conditional Access."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe **Microsoft Entra ID** and how it differs from on-premises Active Directory.
- Distinguish **authentication** (who you are) from **authorization** (what you can do).
- Explain **Azure RBAC**: security principals, roles, and scope, and the main built-in roles.
- Explain how **MFA** and **Conditional Access** strengthen sign-in.
- Apply the principle of **least privilege**.

# Why It Matters

Identity is the **front door** of the cloud — and today, the primary security perimeter. Nearly every
breach involves stolen or misused credentials, and nearly every Azure action is checked against **who
you are** and **what you're allowed to do**. Understanding Entra ID and RBAC lets you give people
exactly the access they need — no more, no less.

# Concept Explanation

### Microsoft Entra ID (formerly Azure AD)

**Microsoft Entra ID** is Azure's cloud **identity and access management** service. It stores **users**
and **groups**, handles **sign-in**, and controls access to Azure and to thousands of apps (including
Microsoft 365). It was renamed from **Azure Active Directory (Azure AD)** in 2023 — the technology is
the same; you'll still see "Azure AD" in older material.

Importantly, Entra ID is **not** the same as on-premises **Active Directory Domain Services (AD DS)**.
It's a modern, internet-scale identity service using protocols like OAuth 2.0 and OpenID Connect — it
does **not** provide the on-premises domain model (organizational units, Group Policy, Kerberos domain
join). Many organizations run both and connect them.

### Authentication vs authorization

Two different questions, often confused:

- **Authentication (AuthN)** — **"Who are you?"** Proving identity, usually by signing in.
- **Authorization (AuthZ)** — **"What are you allowed to do?"** Deciding which actions/resources your
  identity may access.

You **authenticate once**, then Azure **authorizes** each action against your permissions.

### Azure RBAC: role-based access control

**Azure RBAC** is how authorization works for Azure resources. A grant — a **role assignment** — has
three parts:

1. **Security principal** — *who*: a user, group, service principal, or managed identity.
2. **Role definition** — *what they can do*: a set of permissions.
3. **Scope** — *where*: a management group, subscription, resource group, or a single resource.
   Assignments **inherit downward** (a role at the subscription applies to all resource groups under
   it).

Three common **built-in roles**:

- **Owner** — full access **including** managing others' access.
- **Contributor** — full access to **manage resources**, but **cannot** grant access to others.
- **Reader** — **view** resources only.

There are many more specific roles (for example, "Storage Blob Data Reader"). Prefer the **narrowest**
role at the **smallest** scope that does the job.

### Stronger sign-in: MFA and Conditional Access

- **Multifactor authentication (MFA)** — requires **two or more** proofs: something you know
  (password), something you have (a phone/app), or something you are (biometrics). It blocks the vast
  majority of password-based attacks.
- **Conditional Access** — policies that evaluate **signals** (user, device, location, risk) and then
  **decide**: allow, block, or require MFA. For example, "require MFA when signing in from an
  unfamiliar location." (Conditional Access is a capability of paid Entra ID tiers.)

### Least privilege

Give each identity the **minimum** access needed, at the **smallest scope**, for as **short a time** as
possible. It limits the damage if an account is compromised — the single most valuable access habit.

# Key Terminology

- **Microsoft Entra ID** — Azure's cloud identity/access service (formerly Azure AD).
- **Authentication (AuthN)** — proving who you are (sign-in).
- **Authorization (AuthZ)** — determining what you may do.
- **Azure RBAC** — authorization via role assignments (principal + role + scope).
- **Built-in roles** — Owner, Contributor, Reader (and many specific ones).
- **MFA** — requiring two or more verification factors.
- **Conditional Access** — signal-based policies that allow/block/step-up sign-in.
- **Least privilege** — grant only the access that's necessary.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Granting access | **Broad role** (Owner/Contributor) | **Narrow role** at small scope | Narrowest role and scope that works — least privilege reduces blast radius. |
| Assigning to | **Individual users** | **Groups** | Assign roles to groups for easier, consistent management as people change. |
| Sign-in strength | **Password only** | **MFA + Conditional Access** | Always prefer MFA; add Conditional Access to adapt to risk/location/device. |

# Worked Example

Grant a teammate read-only access to just one resource group:

```bash
# Assign the built-in "Reader" role at a resource-group scope
az role assignment create \
  --assignee dana@contoso.com \
  --role "Reader" \
  --resource-group shop-prod-rg

# See who has access to that resource group
az role assignment list --resource-group shop-prod-rg --output table
```

Dana can now **view** everything in `shop-prod-rg` and nothing else — exactly least privilege in
action.

# Real World Analogy

Think of an office building. **Authentication** is showing your **ID at the front desk** to prove who
you are. **Authorization (RBAC)** is what your **keycard** opens — some cards reach every floor
(Owner), some let you rearrange one floor but not issue new cards (Contributor), and some only let you
look through the glass (Reader). **MFA** is needing **both** your card **and** a PIN. **Conditional
Access** is the guard who asks for extra proof when you show up at 3 a.m. from another city.

# Examples

## Example 1 — Basic: read-only auditor

An auditor needs to review resources but must not change anything. They get the **Reader** role at the
subscription scope — full visibility, zero ability to modify.

**Why this works:** the role matches the need exactly, with no extra power.

## Example 2 — Real-world: access by group

Instead of assigning roles to ten developers one by one, an admin creates a **"Developers"** group,
assigns **Contributor** on the dev resource group to the group, and adds/removes people from the group
as the team changes.

**Why this works:** group-based assignments scale and stay consistent as membership changes.

## Example 3 — Pitfall: Owner for everyone

To avoid "permission problems," an admin makes everyone **Owner** on the subscription. Now anyone can
delete resources *and* grant access to others — a huge risk if a single account is phished.

**Why this bites:** over-permissioning turns one compromised account into a full breach. Use least
privilege and MFA.

# Common Mistakes

- **Confusing authentication with authorization.** Signing in isn't the same as being allowed to act.
- **Handing out Owner/Contributor broadly.** Prefer specific roles at the smallest scope.
- **Assigning roles to individuals instead of groups.** Groups are easier to manage at scale.
- **Treating Entra ID like on-premises AD DS.** It doesn't provide OUs, Group Policy, or domain join.
- **Skipping MFA.** Passwords alone are not enough.

# Best Practices

- Enforce **MFA** for everyone, and add **Conditional Access** policies for risky sign-ins.
- Apply **least privilege**: the narrowest role at the smallest scope, for the shortest time.
- Assign access to **groups**, not individuals, and review assignments regularly.
- Reserve **Owner** for a small number of administrators.

# Summary

- **Microsoft Entra ID** (formerly Azure AD) is Azure's cloud identity service — distinct from
  on-premises AD DS.
- **Authentication** proves who you are; **authorization** decides what you can do.
- **Azure RBAC** grants access via **principal + role + scope**, inheriting downward; **Owner**,
  **Contributor**, and **Reader** are the core built-in roles.
- **MFA** and **Conditional Access** harden sign-in; **least privilege** limits damage from compromise.

# Flash Cards

Q: What is Microsoft Entra ID, and what was it called before?
A: Azure's cloud identity and access management service — users, groups, and sign-in for Azure and other apps. It was formerly named Azure Active Directory (Azure AD), renamed in 2023.

Q: How does authentication differ from authorization?
A: Authentication answers "who are you?" (proving identity by signing in); authorization answers "what may you do?" (which actions and resources you're permitted to access).

Q: What three parts make up an Azure RBAC role assignment?
A: A security principal (who — user, group, service principal, or managed identity), a role definition (what permissions), and a scope (where — management group, subscription, resource group, or resource).

Q: What's the difference between the Owner, Contributor, and Reader roles?
A: Owner has full access including managing others' access; Contributor can manage resources but not grant access to others; Reader can only view resources.

Q: How is Microsoft Entra ID different from on-premises Active Directory Domain Services?
A: Entra ID is an internet-scale identity service using modern protocols (OAuth/OIDC); it does not provide the on-premises domain model — no organizational units, Group Policy, or Kerberos domain join.

Q: What is the principle of least privilege?
A: Grant each identity only the minimum access it needs, at the smallest scope, for the shortest time — limiting the damage if the account is compromised.

# Exercises

### Easy
Write a one-sentence definition of authentication and one of authorization, then give an everyday
(non-computer) example of each.

### Medium
Assign the Reader role to a user (or describe doing so) at a resource-group scope, and list who has
access to that group. Explain why Reader — not Contributor — fits an auditor.

### Challenging
Design an access plan for a team of five developers and two auditors on a subscription with `dev` and
`prod` resource groups. Specify roles, scopes, group usage, and MFA/Conditional Access, and justify each
choice with least privilege.

# Further Reading

- Microsoft Learn — *What is Microsoft Entra ID?*: <https://learn.microsoft.com/entra/fundamentals/whatis>
- Microsoft Learn — *What is Azure RBAC?*: <https://learn.microsoft.com/azure/role-based-access-control/overview>
- Microsoft Learn — *Azure built-in roles*: <https://learn.microsoft.com/azure/role-based-access-control/built-in-roles>
- Microsoft Learn — *What is Conditional Access?*: <https://learn.microsoft.com/entra/identity/conditional-access/overview>
