---
slug: aks-cluster-networking-and-ingress
title: "AKS Networking Models: Kubenet vs Azure CNI"
topic: containers-and-microservices
kind: technique
summary: "Choose between basic Kubenet routing with IP masquerading and high-performance Azure CNI subnet integration."
tags: [aks, kubenet, azure-cni, networking]
related: [azure-kubernetes-service-aks-architecture, virtual-networks-and-subnet-design, azure-load-balancer-vs-application-gateway]
---
> **In one line:** Kubenet conserves IP space using virtual overlays; Azure CNI assigns full private VNet IPs to every pod.

## The idea

When designing an Azure Kubernetes Service (AKS) cluster, selecting the container networking plugin is a permanent foundational architecture choice. AKS provides two primary networking models:

1. **Kubenet (Basic Networking):**
   - Conserves IP address space. Only the worker node VMs receive real IP addresses from your Azure Virtual Network subnet.
   - Pods receive private IP addresses from an internal, user-defined virtual overlay address space (e.g., `10.244.0.0/16`).
   - Communication from pods to resources outside the cluster requires **Network Address Translation (NAT / IP masquerading)** at the node level.
   - Ideal when your corporate VNet has constrained, limited IP address spaces.

2. **Azure CNI (Advanced Networking):**
   - Every single pod receives a real, routable private IP address directly from the Azure Virtual Network subnet.
   - Eliminates NAT overhead, delivering maximum network throughput and minimal latency.
   - Pods can communicate directly with other VMs, on-premises servers, and database Private Endpoints across the VNet.
   - Requires massive IP address planning (e.g., a 30-node cluster supporting 30 pods per node consumes 900+ VNet IP addresses!).

| Dimension | Kubenet | Azure CNI |
|---|---|---|
| **Pod IP Addressing** | Internal virtual overlay (NAT) | **Real private VNet IP address** |
| **VNet IP Consumption** | Low (Only nodes consume VNet IPs) | **High (Every pod consumes a VNet IP)** |
| **Network Performance** | Slight NAT overhead | **Direct wire speed (No NAT)** |
| **External VNet Access** | Routed via node IP | Direct pod-to-resource connectivity |
| **Network Policies** | Calico | Azure Network Policies or Calico |

> **Tip:** Modern AKS clusters support **Azure CNI Overlay**. It combines the best of both worlds: pods use an internal private overlay network (conserving VNet IPs like Kubenet) while leveraging the high performance and native network policies of Azure CNI.

## See it

Check the active network plugin and subnet allocations of an AKS cluster using the Azure CLI:

```bash
# Query the network plugin model and pod CIDR settings on an existing AKS cluster
az aks show   --resource-group rg-learning-portal   --name aks-cluster-prod   --query "{NetworkPlugin:networkProfile.networkPlugin, NetworkPolicy:networkProfile.networkPolicy, PodCidr:networkProfile.podCidr}"   -o json
```

The output indicates whether the cluster is running standard `kubenet` or high-performance `azure` CNI plugin networking.

## Go deeper

To route external traffic to services inside AKS, deploy an **Ingress Controller** (such as Nginx Ingress or Application Gateway Ingress Controller - AGIC). AGIC translates Kubernetes Ingress YAML resources directly into Azure Application Gateway configuration, delivering hardware-accelerated WAF protection at the cluster perimeter.

## Watch out

- You cannot switch an AKS cluster between Kubenet and Azure CNI after the cluster is deployed; changing models requires rebuilding the cluster.
- Deploying Azure CNI without generous subnet sizing will cause cluster node upgrades to fail due to IP address exhaustion.

## Remember

- Kubenet conserves corporate VNet IP space by using internal pod overlay addresses with NAT.
- Azure CNI assigns real private VNet IP addresses to every pod for direct wire-speed communication.
- Azure CNI Overlay combines IP conservation with high-performance Azure network policies.
