---
slug: oidc-workload-identity-federation
title: "Passwordless CI/CD with OIDC Workload Identity"
topic: iac-and-devops
kind: pattern
summary: "Authenticate GitHub Actions workflows to Azure securely using short-lived OpenID Connect tokens without secrets."
tags: [oidc, workload-identity, security, passwordless]
related: [cicd-fundamentals-github-actions-and-azure-pipelines, github-actions-azure-deployment-workflow, managed-identities-for-azure-resources]
---
> **In one line:** OIDC Workload Identity Federation authenticates GitHub Actions to Azure without storing secrets.

## The idea

Historically, authenticating a GitHub Actions workflow to Azure required creating a Service Principal with a client secret password (a 1-year or 2-year static token) and saving that password as a secret variable in GitHub.

This legacy pattern is a major security vulnerability:
- Secrets can be accidentally leaked, printed to pipeline console logs, or extracted by malicious pull requests.
- Secrets expire after a year, causing unexpected production pipeline outages when certificates lapse.
- Static credentials violate Zero Trust security principles.

**OpenID Connect (OIDC) Workload Identity Federation** completely eliminates static secrets:
1. When a GitHub Actions workflow job executes, GitHub's internal OIDC provider generates a **short-lived JSON Web Token (JWT)** signed by GitHub.
2. The workflow passes this GitHub token to Microsoft Entra ID.
3. Microsoft Entra ID inspects the token's cryptographic signature and validates its claims: *Is this coming from the repository `learn-with-will/azure`, and from the branch `refs/heads/main`?*
4. If the claims match the configured **Federated Credential**, Entra ID issues an ephemeral Azure access token valid for only one hour.
5. **Zero static secrets or passwords exist in GitHub!**

| Authentication Method | Stored Secrets in GitHub | Expiration & Maintenance | Security Risk |
|---|---|---|---|
| **Legacy Service Principal** | Client Secret Password stored in GitHub | Must manually rotate every 12–24 months | High (Secret leakage & expiration outages) |
| **OIDC Workload Identity** | **None (Zero passwords)** | **Automatic ephemeral 1-hour tokens** | **Minimal (Zero Trust standard)** |

> **Tip:** Microsoft and GitHub officially recommend OIDC Workload Identity Federation for all modern CI/CD pipelines. It is supported out of the box by `azure/login@v2`.

## See it

Configure the `azure/login` action using passwordless OIDC in your GitHub Actions workflow:

```yaml
# GitHub Actions job authenticating via OIDC Workload Identity
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Mandatory for requesting the GitHub OIDC JWT token
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Log in to Azure via OIDC
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

Notice that `AZURE_CLIENT_SECRET` is completely absent! Only the public Client ID, Tenant ID, and Subscription ID are provided; authentication relies strictly on cryptographic OIDC federation.

## Go deeper

Federated identity credentials can be locked down with precise **Subject Identifiers**. For instance, you can configure Entra ID to allow authentication *only* when the token originates from the `production` GitHub Environment, ensuring that feature branch pull requests cannot acquire production Azure credentials.

## Watch out

- Forgetting to declare `permissions: id-token: write` in the GitHub workflow causes `azure/login` to fail with a token acquisition error.
- Subject claims are strictly case-sensitive; verify exact repository casing (e.g., `repo:org/repo:ref:refs/heads/main`).

## Remember

- OIDC Workload Identity Federation enables passwordless authentication between GitHub Actions and Azure.
- Short-lived, ephemeral 1-hour access tokens eliminate secret leakage and rotation maintenance.
- Always include `permissions: id-token: write` in GitHub Actions workflows using OIDC.
