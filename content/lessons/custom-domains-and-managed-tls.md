---
slug: custom-domains-and-managed-tls
title: "Custom Domains and Free Managed TLS Certificates"
topic: app-service-and-serverless
kind: technique
summary: "Bind custom DNS domain names and provision auto-renewing free Azure App Service Managed Certificates."
tags: [custom-domain, tls, ssl, certificates, dns]
related: [app-service-architecture-and-plans, deployment-slots-and-zero-downtime, azure-key-vault-secrets-keys-certificates]
---
> **In one line:** Bind custom domains and secure them with auto-renewing, free Azure App Service Managed TLS Certificates.

## The idea

Default App Service domains (`<app-name>.azurewebsites.net`) are suitable for testing, but commercial production systems require custom branding (e.g., `learn.example.com`) secured by **HTTPS**.

Configuring custom domains and TLS in Azure involves two core steps:
1. **Domain Verification & DNS Mapping:** Add DNS records at your domain registrar. You create a `CNAME` record pointing your subdomain (e.g., `learn`) to `<app-name>.azurewebsites.net`, and a verification `TXT` record (`asuid.learn`) with your verification ID to prove domain ownership.
2. **TLS Binding with Managed Certificates:** Azure offers **App Service Managed Certificates**—free, fully automated TLS/SSL certificates created directly within App Service. Azure handles certificate provisioning, domain validation, and automatic 6-month certificate renewals with zero administrator intervention.

| Certificate Option | Cost | Auto-Renewal | Wildcard Support | Exportable Private Key |
|---|---|---|---|---|
| **App Service Managed** | **Free ($0)** | Fully automatic | No (SNI single-domain) | No (Stored in App Service) |
| **Azure Key Vault Cert** | Standard Vault fee | Automated via Vault | Yes | Yes |
| **Third-Party Certificate** | Commercial purchase | Manual re-upload | Yes | Yes (PFX upload) |

> **Tip:** Enforce **HTTPS Only** in your Web App configuration. This causes the App Service frontend load balancer to automatically return HTTP 301 redirects for any incoming insecure HTTP port 80 requests.

## See it

Bind a custom domain and attach a free auto-renewing Azure Managed Certificate using the CLI:

```bash
# Step 1: Bind the validated custom domain name to the web app
az webapp config hostname add   --webapp-name webapp-portal-prod-001   --resource-group rg-learning-portal   --hostname learn.example.com   --output table

# Step 2: Create a free auto-renewing App Service Managed TLS Certificate
az webapp config ssl create   --name webapp-portal-prod-001   --resource-group rg-learning-portal   --hostname learn.example.com   --output table

# Step 3: Bind the certificate and enforce strict HTTPS redirection
az webapp update --name webapp-portal-prod-001 --resource-group rg-learning-portal --https-only true -o table
```

These commands bind the custom hostname, provision the managed certificate, and ensure all incoming web traffic is strictly encrypted over TLS.

## Go deeper

For apex / naked domains (e.g., `example.com` without a `www` prefix), DNS standards historically prohibited CNAME records. To support apex custom domains, Azure provides **Azure DNS Alias Records**, which allow root domains to point directly to Azure App Service resources without breaking standard DNS RFC specifications.

Azure App Service Managed Certificates are automatically renewed by Microsoft at zero cost approximately 45 days before expiration. Note that managed certificates do not support wildcard domains; if wildcard certificates (`*.yourdomain.com`) are required, purchase an App Service Certificate or import your own PFX certificate from Azure Key Vault.

## Watch out

- App Service Managed Certificates do not support wildcard domains (`*.example.com`); wildcards require Key Vault or imported commercial certificates.
- You cannot create an App Service Managed Certificate until DNS records are fully propagated and verified by Azure.

## Remember

- Verify custom domain ownership using DNS CNAME and TXT verification records.
- Azure App Service Managed Certificates provide free, auto-renewing TLS certificates for standard custom hostnames.
- Always enable the 'HTTPS Only' setting to automatically redirect insecure HTTP requests.
