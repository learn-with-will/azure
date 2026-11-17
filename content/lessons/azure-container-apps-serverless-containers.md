---
slug: azure-container-apps-serverless-containers
title: "Azure Container Apps for Serverless Microservices"
topic: containers-and-microservices
kind: concept
summary: "Run microservices and APIs with built-in HTTPS ingress, revision tracking, and scale-to-zero capability."
tags: [container-apps, serverless, microservices, ingress]
related: [azure-container-options-decision-guide, container-apps-dapr-and-keda-integration, azure-kubernetes-service-aks-architecture]
---
> **In one line:** Azure Container Apps provides serverless container hosting with built-in ingress, scaling, and revisions.

## The idea

**Azure Container Apps (ACA)** is Microsoft's fully managed serverless container service designed specifically for microservices and modern APIs. It provides the full power of Kubernetes and Envoy proxy while abstracting away the complex infrastructure management.

Core architectural components of Container Apps:
1. **Container Apps Environment:** A secure boundary around a group of container apps. Apps in the same environment share the same virtual network, log analytics workspace, and internal DNS discovery.
2. **Built-in Ingress:** Out-of-the-box Layer 7 HTTP/HTTPS reverse proxy routing with automatic free TLS certificates. Supports both external public internet access and internal private VNet access.
3. **Revisions and Traffic Splitting:** Every time you update a container image or environment variable, ACA creates a new immutable **Revision**. You can split traffic across revisions (e.g., 90% to v1, 10% to v2 for canary testing) or execute zero-downtime blue-green swaps.
4. **Scale to Zero:** When an app receives zero incoming HTTP requests or queue messages, ACA deallocates all container instances, dropping compute billing to exactly $0.00.

| Architectural Feature | Azure Container Apps | Self-Hosted Kubernetes (AKS) |
|---|---|---|
| **Control Plane Management** | 100% managed by Microsoft | Managed by customer & Microsoft |
| **Ingress & TLS** | Built-in Envoy proxy with free TLS | Manual Ingress Controller (Nginx/Traefik) + Cert-Manager |
| **Autoscaling Engine** | Native **KEDA** (HTTP, Queue, Cron) | Requires installing and tuning KEDA operators |
| **Microservice Framework** | Native **Dapr** integration | Requires installing Dapr sidecars manually |
| **Pricing Model** | Serverless per-second execution | Fixed 24/7 worker VM node pool fees |

> **Tip:** Container Apps is the modern default choice for microservices architectures. It gives development teams microservice superpowers without requiring dedicated Kubernetes platform operations engineers.

## See it

Create a Container Apps environment and deploy a serverless microservice using the Azure CLI:

```bash
# Step 1: Create a Container Apps Environment linked to Log Analytics
az containerapp env create   --name env-microservices-prod   --resource-group rg-learning-portal   --location eastus   --output table

# Step 2: Deploy a containerized API with HTTP ingress and scale-to-zero capability
az containerapp create   --name app-orders-api   --resource-group rg-learning-portal   --environment env-microservices-prod   --image mcr.microsoft.com/k8se/quickstart:latest   --target-port 80   --ingress external   --min-replicas 0   --max-replicas 5   --output table
```

The CLI outputs the generated public application URL. When idle, the replica count drops to 0; when requests arrive, ACA instantly spins up instances to handle traffic.

## Go deeper

Container Apps supports **Background Worker Microservices**. By configuring `--ingress internal` or omitting ingress entirely, you can run headless consumer worker containers that scale dynamically based on the number of messages waiting in an Azure Service Bus queue or Kafka topic.

## Watch out

- Apps configured with `--min-replicas 0` will experience brief cold-start latency when the first request arrives after an idle window.
- Container Apps environments deployed inside private VNets require a dedicated delegated subnet with at least a `/27` CIDR prefix.

## Remember

- Container Apps provides serverless microservice hosting with built-in HTTPS ingress and TLS.
- Supports automated blue-green deployments and percentage-based traffic splitting across revisions.
- Native scale-to-zero capability reduces compute costs to zero during idle traffic periods.
