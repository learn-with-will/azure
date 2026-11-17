---
slug: azure-load-balancer-vs-application-gateway
title: "Azure Load Balancer vs Application Gateway"
topic: networking-and-connectivity
kind: concept
summary: "Compare Layer 4 TCP/UDP transport balancing with Layer 7 HTTP/HTTPS Application Gateway and WAF."
tags: [load-balancer, application-gateway, layer4, layer7, waf]
related: [azure-front-door-and-traffic-manager, virtual-networks-and-subnet-design, vertical-vs-horizontal-autoscale-rules]
---
> **In one line:** Azure Load Balancer handles Layer 4 TCP/UDP traffic; Application Gateway handles Layer 7 HTTP/HTTPS with WAF.

## The idea

Distributing incoming network traffic across multiple backend virtual machines or containers requires choosing between two distinct regional load-balancing services:

1. **Azure Load Balancer (Layer 4):** Operates at the transport layer (TCP and UDP). It is an ultra-high performance, ultra-low latency hardware-routed load balancer. It does not inspect packet payloads or decrypt TLS. It distributes traffic based strictly on 5-tuple network hashing. Can be **Public** (internet-facing) or **Internal** (private).
2. **Azure Application Gateway (Layer 7):** Operates at the application layer (HTTP, HTTPS, HTTP/2, WebSocket). It acts as a full reverse proxy. It terminates TLS encryption, inspects HTTP headers and URLs, performs cookie-based session affinity, and routes requests based on URL paths (e.g., `/images` to one backend pool and `/api` to another). Includes an integrated **Web Application Firewall (WAF)** that detects OWASP Top 10 vulnerabilities (SQL injection, cross-site scripting).

| Architectural Feature | Azure Load Balancer | Azure Application Gateway |
|---|---|---|
| **OSI Layer** | Layer 4 (Transport: TCP / UDP) | Layer 7 (Application: HTTP / HTTPS) |
| **Latency** | Ultra-low (Microseconds) | Low (Milliseconds, reverse proxy) |
| **TLS / SSL Termination** | No (Pass-through only) | **Yes (Decodes TLS at the perimeter)** |
| **Path-Based Routing** | No (IP/port only) | **Yes (e.g. `/api/*` vs `/static/*`)** |
| **Web App Firewall (WAF)** | No | **Yes (OWASP rule sets)** |
| **Cookie Session Affinity** | No | Yes |

> **Tip:** If your application serves HTTP/HTTPS web traffic and requires security inspection or path routing, choose **Application Gateway**. If you balance raw TCP, gaming protocols, VoIP, or internal database connections, choose **Azure Load Balancer**.

## See it

Create an Azure Standard Load Balancer with a frontend public IP using the Azure CLI:

```bash
# Create a public IP address with standard SKU
az network public-ip create   --resource-group rg-learning-portal   --name pip-lb-prod   --sku Standard   --location eastus   --output table

# Create a Layer 4 Standard Azure Load Balancer
az network lb create   --resource-group rg-learning-portal   --name lb-web-tier   --sku Standard   --public-ip-address pip-lb-prod   --frontend-ip-name LoadBalancerFrontend   --backend-pool-name BackendServers   --output table
```

The load balancer receives public internet traffic and routes TCP connections directly to backend VMs without modifying application payloads.

## Go deeper

Both load balancers rely on **Health Probes**. A health probe pings backend pool instances on a designated port (e.g., HTTP port 80 path `/healthz`) every 5 seconds. If a backend VM fails to respond to consecutive probes, the load balancer automatically stops routing traffic to that instance until health recovers.

## Watch out

- Azure Load Balancer Basic SKU is retired; always deploy **Standard SKU** load balancers in production.
- Application Gateway requires its own dedicated subnet that cannot share hosting space with standard virtual machines.

## Remember

- Azure Load Balancer routes Layer 4 TCP/UDP traffic with microsecond latency.
- Application Gateway provides Layer 7 reverse proxy routing, TLS termination, and WAF security.
- Health probes continuously monitor backend pool servers to remove failed nodes automatically.
