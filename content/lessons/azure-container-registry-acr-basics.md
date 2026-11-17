---
slug: azure-container-registry-acr-basics
title: "Azure Container Registry (ACR) and Image Management"
topic: containers-and-microservices
kind: tool
summary: "Store, build, and secure private OCI container images with az acr create and geo-replication."
tags: [acr, container-registry, docker, images]
related: [azure-container-options-decision-guide, deploying-single-containers-with-aci, container-security-and-acr-vulnerability-scanning]
---
> **In one line:** Azure Container Registry is a managed private Docker registry for storing and building container images.

## The idea

Public container registries like Docker Hub are suitable for open-source software, but enterprise applications require private, secure storage for intellectual property and proprietary container images. **Azure Container Registry (ACR)** is a fully managed, private OCI (Open Container Initiative) compliant registry service.

Key capabilities of Azure Container Registry:
1. **Private Image Storage:** Store Docker container images, OCI artifacts, and Helm charts close to your Azure compute deployments.
2. **ACR Tasks (Cloud Building):** Build container images directly in the cloud using `az acr build` without installing Docker locally on your developer workstation.
3. **Geo-Replication (Premium Tier):** Replicates a single registry namespace across multiple worldwide Azure regions. A cluster in West Europe and a cluster in East US pull images locally from their regional datacenter, slashing network latency and cross-region egress fees.
4. **Passwordless Authentication:** Integrates natively with Microsoft Entra ID. AKS and Container Apps authenticate to ACR using Managed Identities with the *AcrPull* RBAC role, eliminating hardcoded registry passwords.

| ACR Tier | Included Storage | Key Feature | Best Use Case |
|---|---|---|---|
| **Basic** | 10 GB | Standard private registry | Dev/test, small single-region workloads |
| **Standard** | 100 GB | Higher throughput, webhooks | Standard production environments |
| **Premium** | 500 GB | **Geo-replication, Private Link, Content Trust** | Global enterprise production clusters |

> **Tip:** Use `az acr build` to build container images in the cloud. It uploads your source directory to Azure, executes the `docker build` remotely on managed compute, and pushes the image directly into ACR with zero local Docker daemon dependencies.

## See it

Create a private Azure Container Registry and build a container image directly in the cloud:

```bash
# Step 1: Create a private Azure Container Registry in East US
az acr create   --resource-group rg-learning-portal   --name acrportalprod001   --sku Standard   --location eastus   --admin-enabled false   --output table

# Step 2: Build a container image directly in Azure without a local Docker daemon
az acr build   --registry acrportalprod001   --image webapp-frontend:v1   ./app/

# Step 3: Query repositories and image tags stored in the registry
az acr repository list --name acrportalprod001 --output table
```

The image `acrportalprod001.azurecr.io/webapp-frontend:v1` is stored securely, ready to be pulled by AKS, Container Apps, or ACI.

## Go deeper

ACR supports **Artifact Streaming**. Instead of forcing worker nodes to wait for a 2 GB container image to download completely over the network before starting, artifact streaming fetches only the specific image layers needed to boot the application immediately, accelerating container startup times by up to 5x.

## Watch out

- Leaving `--admin-enabled true` on ACR creates static master credentials; always disable admin users and use Entra ID Managed Identities.
- ACR names must be globally unique across all of Azure and consist of only alphanumeric characters (no hyphens or underscores).

## Remember

- ACR is a private, managed OCI registry for container images and Helm charts.
- Use `az acr build` to compile Dockerfiles in the cloud without a local Docker engine.
- Authenticate compute services to ACR using Entra ID Managed Identities with the `AcrPull` role.
