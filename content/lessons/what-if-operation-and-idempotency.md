---
slug: what-if-operation-and-idempotency
title: "What-If Previews and Deployment Idempotency"
topic: iac-and-devops
kind: technique
summary: "Safely preview resource additions, modifications, and deletions using az deployment group what-if."
tags: [what-if, idempotency, safety, preview]
related: [deploying-bicep-with-azure-cli, bicep-modules-and-reusable-infrastructure, infrastructure-as-code-arm-vs-bicep]
---
> **In one line:** The What-If operation previews template changes before deployment, protecting against accidental deletions.

## The idea

Deploying infrastructure code directly into production environments without previewing changes beforehand is extremely risky. A minor typo in a Bicep parameter could inadvertently re-provision a database, destroy an IP address, or overwrite storage firewall rules.

Azure Resource Manager provides the **What-If Operation** (`az deployment group what-if`) to mitigate this risk.

What-If compares the desired state declared in your Bicep template against the real-time actual state of resources in Azure. Before making any changes or sending mutating API calls, it emits a color-coded predictive preview detailing exactly what will happen:
- **Create (Green `+`):** The resource does not exist in the target resource group and will be freshly created.
- **Delete (Orange `-`):** The resource exists in the resource group but is missing from the template (occurs when deploying in Complete deployment mode).
- **Modify (Purple `~`):** The resource exists and specific property values will be updated in place (e.g., scaling up an App Service SKU or updating firewall CIDRs).
- **NoChange (Gray `=`) / Ignore:** The resource matches the template perfectly; no action taken.

| Change Type | Indicator | Impact on Existing Resource |
|---|---|---|
| **Create** | `+` (Green) | New resource will be provisioned |
| **Delete** | `-` (Orange) | **Existing resource will be destroyed permanently** |
| **Modify** | `~` (Purple) | Specific properties will be updated in place |
| **NoChange** | `=` (Gray) | Resource is already in desired state |

> **Tip:** Integrate `what-if` as an automated gate in your CI/CD pull request pipelines. Engineers can review the color-coded change preview directly in GitHub Pull Request comments before merging code into the main branch.

## See it

Execute a What-If pre-flight preview against an existing resource group and inspect the granular property diff:

```bash
# Preview the exact changes Bicep will make without altering any live cloud assets
az deployment group what-if   --resource-group rg-learning-portal   --template-file main.bicep   --parameters environment=prod   --result-format FullResourcePayloads

# Alternatively use compact summary format for quick terminal inspection
az deployment group what-if   --resource-group rg-learning-portal   --template-file main.bicep   --output table
```

The terminal prints a color-coded diff showing exactly which properties will be modified, created, or deleted before you commit changes to your cloud infrastructure.

## Go deeper

What-If operations demonstrate **Idempotency**. An operation is idempotent if applying it multiple times yields the exact same outcome without accumulating unwanted side effects. If you run `az deployment group create` on a template, wait for completion, and immediately run What-If on the identical template, ARM returns `NoChange` across all resources. Declarative idempotency guarantees that running templates repeatedly stabilizes infrastructure without side effects.

## Watch out

- What-If occasionally reports 'noise' on properties populated by Azure platform defaults (like default TLS versions or automatic timestamps).
- What-If does not guarantee deployment success; it previews state changes, but runtime quota or policy blocks can still occur.

## Remember

- The What-If operation previews resource additions, modifications, and deletions without changing live assets.
- Use What-If in CI/CD pull request gates to catch accidental destructive changes before production deployment.
- Declarative Bicep templates are idempotent: reapplying unchanged templates produces zero side effects.
