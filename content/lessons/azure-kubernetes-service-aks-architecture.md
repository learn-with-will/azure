---
slug: azure-kubernetes-service-aks-architecture
title: "Azure Kubernetes Service (AKS) Architecture"
topic: containers-and-microservices
kind: concept
summary: "Deploy enterprise-grade managed Kubernetes with a free Microsoft-managed control plane and worker node pools."
tags: [aks, kubernetes, node-pools, control-plane]
related: [azure-container-options-decision-guide, aks-cluster-networking-and-ingress, container-security-and-acr-vulnerability-scanning]
---
> **In one line:** AKS provides enterprise managed Kubernetes with a free Microsoft control plane and flexible node pools.

## The idea

**Azure Kubernetes Service (AKS)** is Microsoft's enterprise-grade managed Kubernetes platform. Kubernetes has become the standard for orchestrating containerized applications at massive scale, but managing a self-hosted Kubernetes cluster (etcd databases, API servers, controller managers, security patching) requires immense operational overhead.

AKS eliminates this burden through a shared management model:
1. **Control Plane (Managed by Microsoft):** Microsoft provisions, monitors, upgrades, and backs up the Kubernetes API server, scheduler, and etcd database. **The standard control plane is provided completely free of charge ($0.00/hour)**.
2. **Worker Nodes (Managed by Customer):** Virtual machines running in your subscription grouped into **Node Pools**. Worker nodes run container workloads using standard Kubernetes components (`kubelet`, `containerd`, `kube-proxy`). You pay standard Azure rates for the underlying VM compute and managed disks.

AKS features:
- **System Node Pools vs User Node Pools:** System node pools run critical cluster pods (CoreDNS, metrics server). User node pools host application workloads.
- **Cluster Autoscaler:** Automatically adds worker VMs to node pools when pods cannot be scheduled due to CPU/memory limits.
- **Automated Upgrades:** Microsoft orchestrates rolling upgrades of Kubernetes minor and patch versions without application downtime.

| Component | Responsible Party | Cost | What Runs There |
|---|---|---|---|
| **Control Plane** | **Microsoft** | **Free ($0)** | API server, etcd, scheduler, controllers |
| **System Node Pool** | Shared | Standard VM rates | CoreDNS, metrics-server, CSI storage drivers |
| **User Node Pool** | Customer | Standard VM rates | Application pods, microservices, databases |

> **Tip:** Integrate AKS natively with **Azure Container Registry (ACR)** during cluster creation using `--attach-acr`. This automatically establishes Managed Identity authentication, allowing the cluster to pull private images without managing Kubernetes pull secrets.

## See it

Create a managed AKS cluster with 2 worker nodes and integrated ACR access using the Azure CLI:

```bash
# Provision a managed AKS cluster attached to your Azure Container Registry
az aks create   --resource-group rg-learning-portal   --name aks-cluster-prod   --node-count 2   --node-vm-size Standard_D2s_v5   --attach-acr acrportalprod001   --enable-managed-identity   --generate-ssh-keys   --output table

# Download cluster credentials to configure your local kubectl context
az aks get-credentials --resource-group rg-learning-portal --name aks-cluster-prod --overwrite-existing
```

Running `az aks get-credentials` updates your local `~/.kube/config` file, allowing you to manage the cluster directly using native `kubectl` commands.

## Go deeper

For enterprise mission-critical clusters, Microsoft offers the **AKS Uptime SLA** (Standard Tier). For a small flat monthly cluster fee, Microsoft guarantees a 99.95% availability SLA on the Kubernetes API server endpoint (or 99.99% for clusters utilizing Availability Zones).

## Watch out

- Kubernetes version lifecycles move quickly; older Kubernetes minor versions are deprecated and retired by Microsoft every 12 months.
- Never schedule user application pods onto system node pools; user pods can starve CoreDNS of resources and trigger cluster-wide outages.

## Remember

- Microsoft manages the Kubernetes control plane for free; you pay only for worker VM nodes.
- Cluster Autoscaler dynamically adds and removes worker nodes based on pending pod resource requests.
- Connect AKS to ACR seamlessly using the `--attach-acr` parameter for passwordless image pulling.
