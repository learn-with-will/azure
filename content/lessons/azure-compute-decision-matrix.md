---
slug: azure-compute-decision-matrix
title: "Azure Compute Decision Matrix"
topic: virtual-machines-and-compute
kind: technique
summary: "Navigate trade-offs between IaaS VMs, PaaS App Service, serverless Functions, and container platforms."
tags: [compute, architecture, decision-tree, iaas, paas]
related: [virtual-machine-scale-sets, app-service-architecture-and-plans, azure-functions-event-driven-serverless]
---
> **In one line:** Choose an Azure compute hosting option based on architectural control, scaling needs, and operational overhead.

## The idea

Azure provides a broad spectrum of compute hosting services ranging from raw infrastructure to fully abstract serverless engines. Selecting the optimal compute platform requires balancing architectural control against ongoing operational maintenance.

Key Azure compute platforms include:
1. **Virtual Machines (IaaS):** Full OS-level control (custom kernels, legacy Windows services, third-party agents). Maximum flexibility with highest maintenance burden.
2. **Virtual Machine Scale Sets (VMSS):** Groups of identical, load-balanced VMs with automated horizontal autoscaling.
3. **Azure App Service (PaaS):** Fully managed hosting for web applications, REST APIs, and background mobile backends with built-in TLS, continuous deployment, and auto-patching.
4. **Azure Functions (Serverless):** Event-driven micro-billing execution for short-lived, stateless tasks that scale dynamically to zero.
5. **Azure Container Apps (Serverless Containers):** Managed microservices platform supporting Dapr, KEDA autoscaling, and containerized HTTP APIs.
6. **Azure Kubernetes Service (AKS):** Full cloud-native container orchestration for complex distributed microservice systems.

| Compute Option | Control Level | Scaling Unit | Primary Responsibility |
|---|---|---|---|
| **Virtual Machines** | Full OS control | Individual VMs | OS patching, backup, security agents |
| **App Service** | Application runtime | App Service Plan instances | Application code and data |
| **Azure Functions** | Function code | Individual event executions | Function code and event triggers |
| **Container Apps** | Container image | Container replicas | Dockerfile, container images, config |
| **AKS** | Kubernetes cluster | Pods & Worker Node Pools | Kubernetes manifests, helm charts |

> **Tip:** Default to PaaS (App Service) or Serverless (Container Apps, Functions) for new cloud-native workloads; reserve Virtual Machines for workloads with hard C++ runtime, custom kernel driver, or legacy software requirements.

## See it

Evaluate compute choices programmatically by querying available compute resource providers in your subscription:

```bash
# List all registered Microsoft.Compute resource types available for deployment
az provider show --namespace Microsoft.Compute --query "resourceTypes[?resourceType=='virtualMachines' || resourceType=='virtualMachineScaleSets'].resourceType" -o table

# Check App Service plan and web app capabilities
az appservice plan list --query "[].{Plan:name, Tier:sku.tier, Workers:numberOfWorkers}" -o table
```

These queries reveal whether your subscription has active compute providers and verify the provisioned capacity tiers across IaaS and PaaS boundaries.

## Go deeper

Azure provides an interactive architectural decision tree in the Azure Architecture Center. The initial decision pivots on application architecture:
- If containerized -> choose AKS for complex orchestration, or Container Apps for microservices.
- If web application / API -> choose App Service.
- If event-driven background processing -> choose Azure Functions.
- If commercial off-the-shelf (COTS) software requiring desktop GUI or Windows Active Directory domain joining -> choose Virtual Machines.

## Watch out

- Defaulting to Virtual Machines out of familiarity increases operational labor and misses out on built-in PaaS high availability.
- Choosing serverless Functions for long-running batch computing (over 10 minutes) can hit execution timeouts and exceed VM costs.

## Remember

- Match compute selections to business requirements: VMs for OS control, App Service for web apps, Functions for events.
- Higher-level PaaS and serverless services drastically reduce ongoing maintenance and operational patching.
- Containers can be hosted across ACI (simple), Container Apps (microservices), or AKS (full orchestration).
