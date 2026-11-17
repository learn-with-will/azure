---
slug: static-website-hosting-in-blob-storage
title: "Static Website Hosting in Blob Storage"
topic: storage-and-blob
kind: technique
summary: "Host client-side SPAs directly from the special $web container with global CDN integration."
tags: [static-website, web-hosting, cdn, spa]
related: [managing-blobs-with-azure-cli, app-service-architecture-and-plans, custom-domains-and-managed-tls]
---
> **In one line:** Host single-page applications and static sites serverlessly directly from the $web storage container.

## The idea

Modern web applications built with frameworks like React, Angular, Vue, or static site generators (Next.js export, Astro) compile into static bundles of HTML, CSS, JavaScript, and SVG assets. Running an expensive dedicated web server or virtual machine to serve static files is an inefficient waste of cloud spend.

Azure Blob Storage provides **Static Website Hosting**:
1. **The `$web` Container:** When static website hosting is enabled, Azure automatically provisions a special root container named `$web`.
2. **Web Endpoint:** Azure generates a dedicated web endpoint (`<account-name>.z13.web.core.windows.net`) distinct from the standard blob REST endpoint.
3. **Index & Error Documents:** You configure default index documents (`index.html`) and custom 404 error documents (`404.html`), enabling Single Page Application (SPA) client-side routing.
4. **Zero Compute Maintenance:** There are no operating systems to patch, no web server daemons (Apache, Nginx) to configure, and zero compute costs. You pay only for the storage gigabytes consumed by your static files and outbound data egress.

| Hosting Option | Compute Cost | Maintenance | Custom Domain / TLS | Best Use Case |
|---|---|---|---|---|
| **Blob Static Web** | **$0.00 compute** | None | Yes (via CDN / Front Door) | SPAs, static blogs, docs |
| **Azure Static Web Apps** | Free / Standard | Minimal | Built-in | Full-stack SPAs with API backends |
| **App Service** | Hourly plan fee | Low | Built-in | Server-rendered SSR, PHP, .NET |
| **Virtual Machine** | Full hourly rate | High | Manual Nginx setup | Legacy monolithic architectures |

> **Tip:** Combine Blob Static Website Hosting with **Azure Front Door** or **Azure CDN**. This caches static assets at hundreds of global edge point-of-presence (PoP) locations, delivering sub-20ms page loads worldwide.

## See it

Enable static website hosting and upload a single-page application using the Azure CLI:

```bash
# Step 1: Enable static website hosting with default index and 404 documents
az storage blob service-properties update   --account-name stportaldata001   --static-website   --index-document index.html   --error-document404path 404.html   --auth-mode login   --output table

# Step 2: Upload all compiled web assets into the special $web container
az storage blob upload-batch   --account-name stportaldata001   --source ./dist/   --destination '$web'   --auth-mode login   --output table

# Step 3: Query the public static website web endpoint URL
az storage account show   --name stportaldata001   --resource-group rg-learning-portal   --query "primaryEndpoints.web" -o tsv
```

Navigating to the web endpoint URL immediately displays your single-page application served directly from Microsoft Azure storage infrastructure.

## Go deeper

For Single Page Applications (SPAs) utilizing client-side routing (e.g., Vue Router or React Router in HTML5 history mode), configure both `--index-document` and `--error-document404path` to point to `index.html`. This ensures direct deep links (e.g., `/dashboard/settings`) route to `index.html` where client-side JavaScript handles route rendering.

## Watch out

- The direct storage web endpoint does not support custom TLS certificates on custom domain names without an Azure CDN or Front Door profile.
- Blob storage static hosting only serves client-side static assets; it cannot execute server-side Node.js, Python, or PHP code.

## Remember

- Static website hosting serves HTML, CSS, JS, and images directly from the `$web` storage container.
- You pay only for data storage and network egress, with zero compute server costs.
- Integrate with Azure Front Door or Azure CDN for custom domain TLS and edge caching.
