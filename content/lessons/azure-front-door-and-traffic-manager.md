---
slug: azure-front-door-and-traffic-manager
title: "Global Routing: Azure Front Door vs Traffic Manager"
topic: networking-and-connectivity
kind: concept
summary: "Route global traffic using DNS-based Traffic Manager or Anycast Layer 7 reverse proxy Azure Front Door."
tags: [front-door, traffic-manager, global-routing, cdn, anycast]
related: [azure-load-balancer-vs-application-gateway, custom-domains-and-managed-tls, azure-regions-and-geographies]
---
> **In one line:** Traffic Manager routes global traffic via DNS; Azure Front Door routes via Layer 7 Anycast with CDN caching.

## The idea

When an enterprise deploys applications across multiple Azure regions to serve global users or ensure disaster recovery, it requires a global traffic routing layer. Azure provides two global services:

1. **Azure Traffic Manager (DNS-Based):** A global DNS load balancer. When a user queries `app.contoso.com`, Traffic Manager intercepts the DNS lookup and returns the IP address of the nearest or healthiest regional endpoint. Once the client receives the DNS answer, client traffic connects directly to that regional IP. Traffic Manager does NOT proxy traffic; it only resolves DNS.
2. **Azure Front Door (Layer 7 Anycast):** Microsoft's modern, global cloud Content Delivery Network (CDN) and application layer proxy. Front Door terminates client TLS connections at the nearest Microsoft **Point of Presence (PoP)** edge server across hundreds of global locations. Traffic travels across Microsoft's private global fiber network to the backend region. Provides instant failover, static asset edge caching, SSL offloading, and a global Web Application Firewall (WAF).

| Feature | Azure Traffic Manager | Azure Front Door |
|---|---|---|
| **Routing Mechanism** | DNS query resolution | Layer 7 Anycast reverse proxy |
| **Failover Speed** | Bound by DNS TTL (seconds to minutes) | **Instant (Sub-second socket failover)** |
| **SSL / TLS Termination** | No (Happens at backend) | **Yes (Terminated at global edge PoP)** |
| **Static Asset Caching** | No | **Yes (Global CDN edge caching)** |
| **Supported Protocols** | Any protocol (DNS is agnostic) | HTTP / HTTPS / WebSocket |

> **Tip:** Choose **Azure Front Door** for all modern web applications and APIs. It combines global load balancing, instant failover, CDN caching, and edge WAF protection into a single unified service.

## See it

Create an Azure Front Door standard profile and endpoint using the Azure CLI:

```bash
# Create an Azure Front Door profile in the global resource scope
az afd profile create   --resource-group rg-learning-portal   --profile-name afd-global-portal   --sku Standard_AzureFrontDoor   --output table

# Create a public endpoint for the Front Door profile
az afd endpoint create   --resource-group rg-learning-portal   --profile-name afd-global-portal   --endpoint-name portal-global   --enabled-state Enabled   --output table
```

The CLI outputs the generated global endpoint FQDN (`portal-global-xxxx.azurefd.net`), which terminates client connections at the nearest global Microsoft edge datacenter.

## Go deeper

Front Door uses **Split TCP**. Instead of a client in Sydney establishing a multi-round-trip TCP and TLS handshake with a web server in London across the public internet, the client handshakes with the Sydney edge PoP in milliseconds. Front Door maintains pre-warmed connection pools to London over private fiber, cutting page load times in half.

## Watch out

- Traffic Manager failovers can be delayed by intermediate DNS recursive resolvers caching old DNS records past their TTL.
- Azure Front Door only routes HTTP and HTTPS traffic; non-HTTP workloads (like gaming UDP or raw TCP) require Azure Traffic Manager.

## Remember

- Traffic Manager directs global traffic by resolving client DNS queries to healthy regional endpoints.
- Azure Front Door provides Layer 7 Anycast routing, instant failover, CDN edge caching, and WAF security.
- Front Door accelerates web application performance by terminating TLS connections at the local edge PoP.
