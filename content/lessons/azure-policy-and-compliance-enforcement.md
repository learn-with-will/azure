---
slug: azure-policy-and-compliance-enforcement
title: "Azure Policy and Compliance Enforcement"
topic: governance-reliability-architecture
kind: tool
summary: "Enforce corporate governance, restrict resource deployment options, and audit cloud compliance using Azure Policy."
tags: [azure-policy, governance, compliance, guardrails]
related: [resource-locks-preventing-accidental-deletion, zero-trust-architecture-in-azure, microsoft-defender-for-cloud-and-secure-score]
---
> **In one line:** Enforce organizational standards and automatically prevent non-compliant resource deployments across Azure.

## The idea

While Role-Based Access Control (RBAC) answers *who* has permission to take actions, **Azure Policy** evaluates *what* properties and configurations those resources are allowed to have. Azure Policy creates declarative guardrails that prevent non-compliant infrastructure from ever being provisioned.

How Azure Policy operates:
1. **Policy Definition:** A JSON document describing the conditions under which a resource is evaluated and the resulting action effect (e.g., requiring HTTPS on all storage accounts).
2. **Policy Assignment:** The scope where the policy is enforced (Management Group, Subscription, or Resource Group).
3. **Initiative (Policy Set):** A collection of multiple policy definitions bundled together to meet a broad compliance standard (e.g., ISO 27001, PCI-DSS, or CIS Benchmarks).

Azure Policy Effects:
- `Deny`: Blocks the resource creation or update immediately if it violates the policy rule.
- `Audit`: Allows the resource deployment to succeed, but flags it as non-compliant in compliance reporting dashboards.
- `Modify`: Automatically injects or corrects missing configurations during deployment (e.g., automatically appending required corporate tags).
- `DeployIfNotExists`: Automatically deploys a secondary child resource if missing (e.g., automatically deploying Log Analytics diagnostic settings).

| Policy Effect | Action on Violation | Use Case |
|---|---|---|
| **Deny** | **Blocks deployment immediately** | Restricting allowed regions (`eastus`, `westeurope`) |
| **Audit** | Records compliance failure | Monitoring unencrypted resources without breaking builds |
| **Modify** | Injects properties before saving | Enforcing mandatory tags (`costCenter`, `env`) |
| **DeployIfNotExists** | Provisions missing child resource | Deploying monitoring agents or diagnostic settings |

> **Tip:** Always deploy new governance policies in `Audit` mode first. Review the compliance dashboard for several days to evaluate potential disruption before switching the effect to `Deny`.

## See it

Assign a built-in Azure Policy that restricts resource deployments to approved geographical regions:

```bash
# Assign the built-in 'Allowed Locations' policy to a resource group
az policy assignment create   --name 'enforce-allowed-locations'   --scope '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-learning-portal'   --policy 'e56962a6-4747-49cd-b67b-1fa870199742'   --params '{"listOfAllowedLocations":{"value":["eastus","eastus2"]}}'

# Query compliance state of resources under the target assignment
az policy state list   --policy-assignment 'enforce-allowed-locations'   --query "[].{resource:resourceId, complianceState:complianceState}"   --output table
```

If a developer attempts to deploy a virtual machine in `westeurope`, the Azure Resource Manager API instantly rejects the request with a policy violation error.

## Go deeper

Azure Policy integrates with **Bicep and CI/CD pipelines**. Using the Azure Policy extension for GitHub Actions or the Azure CLI What-If command, pull request checks evaluate whether proposed Bicep templates violate enterprise policies *before* code is merged into main.

## Watch out

- Policy assignments at higher management group scopes are inherited by all child subscriptions and cannot be overridden by local admins.
- Modifying existing policies triggers background compliance evaluation scans that can take 15 to 30 minutes to reflect in the portal.

## Remember

- Azure Policy enforces declarative organizational guardrails across Management Groups, Subscriptions, and Resource Groups.
- Common policy effects include Deny (blocking violations), Audit (reporting non-compliance), and Modify (auto-fixing tags).
- Bundle related policies into Initiatives to track compliance against industry standards like CIS and ISO 27001.
