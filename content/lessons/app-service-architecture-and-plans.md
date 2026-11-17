---
slug: app-service-architecture-and-plans
title: "Azure App Service Architecture and Plans"
topic: app-service-and-serverless
kind: concept
summary: "Understand App Service plans, dedicated compute tiers, container support, and managed runtime stacks."
tags: [app-service, paas, web-hosting, plans]
related: [deploying-apps-to-app-service, app-service-scaling-up-and-out, deployment-slots-and-zero-downtime]
---
> **In one line:** App Service runs web apps on managed VMs defined by an App Service plan billing and compute tier.

## The idea

**Azure App Service** is an enterprise HTTP-based Platform as a Service (PaaS) engine for hosting web applications, REST APIs, and mobile backends. You write code in Node.js, .NET, Python, Java, or PHP (or deploy custom Docker containers), and Azure manages infrastructure provisioning, operating system patching, security hardening, and high-availability routing.

To understand App Service, you must distinguish between two core resources:
1. **App Service Plan:** Represents the dedicated virtual compute infrastructure and billing profile. It defines the region, operating system (Linux or Windows), hardware size (CPU cores and RAM), and pricing tier (Free, Basic, Standard, Premium v3, Isolated v2).
2. **Web App:** The application logic, code deployment, environment configuration, and custom domains running *on* the App Service plan.

You can host multiple web applications inside a single App Service plan. All apps in the plan share the underlying CPU and memory resources, allowing you to maximize server density and minimize cloud hosting expenses.

| Plan Tier | Max Instances | Custom Domains / TLS | Deployment Slots | VNet Integration |
|---|---|---|---|---|
| **Free / Shared** | 1 (Shared CPU) | No | 0 | No |
| **Basic** | Up to 3 | Yes | 0 | No |
| **Standard** | Up to 10 | Yes | 5 | Yes |
| **Premium v3** | Up to 30 | Yes | 20 | Yes (Enterprise) |
| **Isolated v2** | Up to 100 | Yes | 20 | Dedicated private network |

> **Tip:** In production, start with the **Premium v3** tier to unlock fast NVMe-based SSDs, rapid scale-out triggers, deployment slots, and regional VNet integration.

## See it

Create an App Service Plan and provision a Linux Node.js web application using the Azure CLI:

```bash
# Create a dedicated Linux App Service Plan in East US
az appservice plan create   --name plan-web-prod   --resource-group rg-learning-portal   --location eastus   --sku P1v3   --is-linux   --output table

# Create a web application running Node.js 20 LTS on that plan
az webapp create   --name webapp-portal-prod-001   --resource-group rg-learning-portal   --plan plan-web-prod   --runtime "NODE:20-lts"   --output table

# Verify the fully qualified public domain name (FQDN) assigned to the app
az webapp show --name webapp-portal-prod-001 --resource-group rg-learning-portal   --query "defaultHostName" -o tsv
```

The CLI returns `webapp-portal-prod-001.azurewebsites.net`, provisioned with valid Microsoft TLS certificates out of the box.

## Go deeper

App Service supports **App Service Environment (ASE v3)**. An ASE deploys dedicated, single-tenant compute infrastructure directly inside your private Virtual Network. Because an ASE has zero shared multi-tenant frontends, it meets the most rigorous banking and government isolation standards.

## Watch out

- Packing too many compute-intensive web apps into one small App Service plan causes noisy-neighbor CPU starvation.
- Free and Shared tiers do not support custom domains, TLS certificates, or scaling, and will shut down if idle.

## Remember

- The App Service Plan provides the compute resources (vCPU/RAM); the Web App hosts the code.
- Multiple web apps can run on a single App Service Plan to share compute capacity and lower costs.
- Production applications should use Standard or Premium tiers to enable deployment slots and autoscale.
