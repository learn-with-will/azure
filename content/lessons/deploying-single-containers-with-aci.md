---
slug: deploying-single-containers-with-aci
title: "Deploying Single Containers with Azure Container Instances"
topic: containers-and-microservices
kind: tool
summary: "Launch fast, isolated serverless containers with custom CPU and memory allocations using az container create."
tags: [aci, containers, serverless, az-cli]
related: [azure-container-options-decision-guide, azure-container-registry-acr-basics, azure-container-apps-serverless-containers]
---
> **In one line:** Azure Container Instances runs isolated serverless containers in seconds without cluster configuration.

## The idea

When you need to execute a single container—such as running a nightly data migration script, a headless web scraper, or a temporary testing utility—deploying a full Kubernetes cluster or virtual machine is excessive. **Azure Container Instances (ACI)** provides instantaneous, serverless container execution.

Key characteristics of ACI:
1. **Fast Startup:** Provisions containers in seconds directly from public registries (Docker Hub) or private registries (ACR).
2. **Hypervisor-Level Security Isolation:** Each container group in ACI executes within its own dedicated Hyper-V virtualized isolation boundary, guaranteeing that multi-tenant workloads never share hardware kernels.
3. **Exact Sizing:** You specify the exact CPU core fractional count (e.g., `1.5` vCPU) and memory (e.g., `2.0` GB RAM) required for the task.
4. **Per-Second Billing:** You pay strictly for the vCPU and memory allocated while the container process is running. When the process exits, billing stops immediately.
5. **Restart Policies:** Configure `Always` (for long-running web servers), `OnFailure`, or `Never` (for run-to-completion batch tasks).

| Parameter | Configuration Options | Purpose |
|---|---|---|
| `--image` | e.g. `mcr.microsoft.com/azuredocs/aci-helloworld` | OCI container image to execute |
| `--cpu` / `--memory` | e.g. `1.0` vCPU, `1.5` GB | Compute allocation for the container |
| `--restart-policy` | `Always`, `OnFailure`, `Never` | Determines behavior when container exits |
| `--ip-address` | `Public` or `Private` (VNet subnet) | Network connectivity exposure |

> **Tip:** Set `--restart-policy Never` when running batch data jobs in ACI. Once the containerized script completes its processing and exits with code 0, the container stops automatically to halt compute billing.

## See it

Deploy a public-facing container instance and inspect its running status using the Azure CLI:

```bash
# Deploy a single container instance with public internet routing
az container create   --resource-group rg-learning-portal   --name aci-demo-app   --image mcr.microsoft.com/azuredocs/aci-helloworld   --cpu 1   --memory 1.5   --dns-name-label aci-portal-demo-2026   --ports 80   --restart-policy Always   --output table

# Verify the container state and query its public IP address
az container show   --resource-group rg-learning-portal   --name aci-demo-app   --query "{State:containers[0].instanceView.currentState.state, IP:ipAddress.ip, FQDN:ipAddress.fqdn}"   -o json
```

The container provisions in seconds and is immediately reachable at its fully qualified domain name `aci-portal-demo-2026.eastus.azurecontainer.io`.

## Go deeper

ACI supports mounting persistent storage volumes directly into container filesystems. You can attach an **Azure Files** share as a volume mount, allowing containerized batch jobs to read input datasets and write output logs that persist after the container terminates.

Azure Container Instances supports mounting persistent **Azure Files shares** as volume mounts. This allows stateful containerized workloads to read configuration files and write persistent data across container restarts without requiring full Kubernetes cluster management overhead.

## Watch out

- ACI does not provide built-in autoscaling or zero-downtime rolling updates; use Azure Container Apps if you require scaling.
- DNS name labels must be unique within the target Azure region.

## Remember

- ACI runs single containers in seconds with hypervisor-level isolation and per-second billing.
- Use restart policies (`Always`, `OnFailure`, `Never`) to control lifecycle behavior.
- Ideal for batch jobs, CI/CD runners, and simple standalone testing tasks.
