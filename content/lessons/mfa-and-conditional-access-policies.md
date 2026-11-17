---
slug: mfa-and-conditional-access-policies
title: "MFA and Conditional Access Policies"
topic: identity-and-security
kind: technique
summary: "Enforce Multi-Factor Authentication and contextual access checks based on user, device, location, and risk."
tags: [mfa, conditional-access, zero-trust, identity]
related: [microsoft-entra-id-fundamentals, zero-trust-architecture-in-azure, microsoft-defender-for-cloud-and-secure-score]
---
> **In one line:** Conditional Access evaluates contextual user and device signals before granting access to cloud resources.

## The idea

Static usernames and passwords are the weakest link in enterprise cloud security. Over 99.9% of compromised accounts do not have Multi-Factor Authentication (MFA) enabled.

Microsoft addresses modern identity threats through **Conditional Access Policies**:
Conditional Access acts as an intelligent 'if-then' gatekeeper in Microsoft Entra ID. It analyzes real-time contextual **signals** before deciding whether to grant access, require additional authentication challenges, or block access entirely:

1. **Signals (Conditions):**
   - *User or Group:* Who is signing in? (e.g., All users, or specifically Global Admins).
   - *IP Location:* Is the request originating from a trusted corporate network or an untrusted foreign country?
   - *Device Health:* Is the workstation managed by Microsoft Intune and compliant with corporate antivirus policies?
   - *Client App:* Is the user connecting via a modern browser or an obsolete legacy protocol?
   - *Risk Level:* Did Microsoft Entra ID Protection detect impossible travel (e.g., signing in from New York and Paris 10 minutes apart)?
2. **Access Decision (Controls):**
   - **Grant Access:** Require Multi-Factor Authentication (MFA) or require a compliant device.
   - **Block Access:** Reject the authentication attempt immediately.

| Signal Evaluated | Contextual Condition | Policy Enforcement Action |
|---|---|---|
| **Administrative Role** | User possesses Global Admin role | **Always require phishing-resistant MFA** |
| **Location** | Untrusted IP outside home country | Require MFA challenge + compliant device |
| **High User Risk** | Leaked credentials detected on dark web | **Block access until password reset via MFA** |
| **Legacy Protocol** | IMAP / POP3 connection attempt | **Block access permanently (No MFA support)** |

> **Tip:** Always configure a policy that **blocks legacy authentication protocols** (such as basic POP3 or IMAP). Attackers use legacy protocols specifically because they cannot enforce MFA challenges.

## See it

Inspect active Conditional Access policies configured in your Microsoft Entra tenant using the Azure CLI:

```bash
# Query active Conditional Access policies in the tenant
az rest --method GET   --url "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies"   --query "value[].{Name:displayName, State:state, GrantControls:grantControls.builtInControls}"   -o table
```

The output confirms policy names and displays the enforced security controls (e.g., `["mfa"]` or `["compliantDevice"]`).

## Go deeper

For ultimate security against adversary-in-the-middle (AiTM) phishing attacks, configure Conditional Access to enforce **Phishing-Resistant MFA**. This requires hardware security keys (FIDO2 / YubiKey) or Windows Hello for Business, which bind authentication cryptographically to the exact website domain name.

Always configure at least two 'break-glass' emergency access accounts in Microsoft Entra ID. These accounts should have complex, physically secured passwords, exclude Conditional Access and MFA policies, and be monitored with real-time alerting whenever they log in to prevent tenant lockout during third-party MFA provider outages.

## Watch out

- Always maintain at least two 'break-glass' emergency emergency-access accounts excluded from all Conditional Access policies to prevent administrative tenant lockout.
- Testing policies in 'Report-only' mode before full enforcement is essential to avoid accidentally blocking all corporate employee logins.

## Remember

- Multi-Factor Authentication (MFA) blocks over 99.9% of automated identity-based cyberattacks.
- Conditional Access evaluates real-time signals (user, location, device, risk) to enforce dynamic access controls.
- Always exclude designated emergency break-glass accounts from Conditional Access policies.
