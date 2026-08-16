---
id: lesson-19
slug: infrastructure-as-code-with-bicep
title: "Infrastructure as Code with Bicep"
level: advanced
order: 19
duration: 20
tags:
  - bicep
  - iac
  - arm
  - deployment
  - idempotency
summary: "Define your Azure infrastructure in code — why infrastructure as code matters, how ARM templates and the friendlier Bicep language relate, writing and deploying a Bicep file, using parameters for reuse, and previewing changes safely with what-if because deployments are declarative and idempotent."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain **infrastructure as code (IaC)** and its benefits.
- Describe how **ARM templates** and **Bicep** relate.
- Write and **deploy** a simple Bicep file with **parameters**.
- Explain **idempotency** and preview changes with **what-if**.

# Why It Matters

Clicking through the portal to build infrastructure is fine for learning, but it isn't repeatable,
reviewable, or reliable at scale. **Infrastructure as code** captures your environment in files you can
version, review, and redeploy identically — dev, test, and prod from the same source. Bicep is Azure's
clean, purpose-built language for exactly this.

# Concept Explanation

### What infrastructure as code is

**Infrastructure as code (IaC)** means describing your resources in **text files** and deploying them
with tooling, instead of clicking or running ad-hoc commands. Benefits:

- **Repeatable & consistent** — the same file produces the same environment every time.
- **Version-controlled** — infrastructure changes get reviewed like application code.
- **Auditable** — the files are the record of what exists and why.

### ARM templates and Bicep

Every deployment ultimately goes through **Azure Resource Manager** (lesson 4). Two ways to author for
it:

- **ARM templates** — **JSON** documents describing resources. Powerful but verbose and hard to read.
- **Bicep** — a **domain-specific language** that is much **cleaner** and **transpiles to ARM JSON**.
  Anything ARM can do, Bicep can express — with far less noise. Microsoft recommends Bicep for new
  authoring.

Bicep is **declarative**: you describe the **desired end state**, not the steps to get there.

### A first Bicep file

```bicep
// main.bicep — a storage account, parameterized for reuse
param location string = resourceGroup().location
param storageName string

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageId string = storage.id
```

- **`param`** values are supplied at deploy time (reuse the file across environments).
- **`resource`** declares what to create.
- **`output`** returns useful values (like the resource id) after deployment.

### Deploying — declarative and idempotent

Deploy a Bicep file to a resource group with the CLI:

```bash
# Preview the changes first (safe — makes no changes)
az deployment group what-if \
  --resource-group iac-rg --template-file main.bicep \
  --parameters storageName=iacdemo$RANDOM

# Then deploy
az deployment group create \
  --resource-group iac-rg --template-file main.bicep \
  --parameters storageName=iacdemo12345
```

Deployments are **idempotent**: applying the same file repeatedly converges to the described state
without creating duplicates. If a resource already matches, nothing changes; if it drifted, ARM brings it
back in line. **`what-if`** shows exactly what a deployment *would* change **before** you run it — a
safety net you should use habitually.

### Modules for reuse

Bicep **modules** let you factor common pieces (a network, a database) into reusable files that other
templates call with parameters — the same DRY idea as functions in code.

# Key Terminology

- **Infrastructure as code (IaC)** — defining infrastructure in version-controlled files.
- **ARM template** — a JSON deployment document for Azure Resource Manager.
- **Bicep** — a concise DSL that transpiles to ARM JSON.
- **Declarative** — you describe the desired end state, not the steps.
- **Idempotent** — redeploying the same file converges to the same state without duplication.
- **what-if** — a preview of the changes a deployment would make.
- **Module** — a reusable Bicep file called with parameters.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Authoring | **Bicep** | **ARM JSON** | Bicep for readability and new work; raw ARM JSON only if a tool requires it. |
| Building infra | **IaC files** | **Portal clicks** | IaC for anything repeatable, reviewed, or multi-environment; portal for quick learning/experiments. |
| Before deploying | **Run what-if** | Deploy directly | Always what-if for changes to shared/prod environments to avoid surprises. |
| Reuse | **Modules** | Copy-paste templates | Modules to avoid duplication and drift across environments. |

# Worked Example

The snippet above, end to end: author `main.bicep`, **preview** with `what-if`, then **deploy**. Change a
parameter (say the SKU) and redeploy — because it's **idempotent**, only the difference is applied, not a
second storage account.

# Real World Analogy

IaC is like an **architect's blueprint** instead of describing a house room by room over the phone. The
blueprint (**Bicep file**) can be reviewed, versioned, and used to build **identical** houses (dev/test/
prod). **what-if** is walking through the proposed changes on paper before anyone picks up a hammer. And
because the plan describes the **finished house** (declarative), handing it to the builder twice doesn't
give you two houses (**idempotent**).

# Examples

## Example 1 — Basic: one file, three environments

A team keeps `main.bicep` and three parameter files (`dev`, `test`, `prod`). The same template deploys
each environment consistently — only the parameters differ.

**Why this works:** parameters separate *what* from *where/how big*, so one template serves all
environments.

## Example 2 — Real-world: reviewed infrastructure changes

An engineer proposes adding a database via a pull request that changes the Bicep. Teammates review it,
`what-if` runs in the pipeline to show the impact, and it deploys only after approval.

**Why this works:** infrastructure changes get the same scrutiny and traceability as code.

## Example 3 — Pitfall: portal drift

Someone tweaks a resource by hand in the portal. The next IaC deployment **overwrites** the manual change
back to what the file says.

**Why this bites:** with IaC, the **files are the source of truth**. Make changes in the code, not the
portal, or they'll be reverted.

# Common Mistakes

- **Editing resources in the portal after adopting IaC.** Causes drift; change the code instead.
- **Skipping what-if.** Preview changes before deploying to shared environments.
- **Hard-coding values.** Use **parameters** so one template serves many environments.
- **Copy-pasting templates.** Factor shared pieces into **modules**.

# Best Practices

- Author in **Bicep**, store templates in **source control**, and review changes via pull requests.
- Always run **what-if** before deploying to shared/production environments.
- **Parameterize** environment-specific values and reuse via **modules**.
- Treat the **files as the source of truth** — avoid manual portal changes.

# Summary

- **Infrastructure as code** makes environments repeatable, reviewable, and auditable.
- **Bicep** is a concise language that **transpiles to ARM JSON**; both deploy through ARM.
- Deployments are **declarative and idempotent** — redeploying converges to the described state.
- Use **parameters** and **modules** for reuse, and **what-if** to preview changes safely.

# Flash Cards

Q: What is infrastructure as code (IaC)?
A: Defining your infrastructure in version-controlled text files and deploying it with tooling, so environments are repeatable, reviewable, and auditable — instead of clicking in the portal.

Q: How do Bicep and ARM templates relate?
A: ARM templates are verbose JSON deployment documents. Bicep is a concise domain-specific language that transpiles to ARM JSON — anything ARM can do, Bicep can express more readably. Both deploy through Azure Resource Manager.

Q: What does it mean that Bicep deployments are declarative and idempotent?
A: Declarative means you describe the desired end state, not the steps. Idempotent means redeploying the same file converges to that state without creating duplicates — matching resources are left alone, drifted ones are corrected.

Q: What does `az deployment group what-if` do?
A: It previews exactly what a deployment would create, change, or delete — without making any changes — so you can review the impact before deploying.

Q: What are Bicep parameters and modules for?
A: Parameters supply environment-specific values at deploy time so one template serves dev/test/prod; modules factor reusable pieces into separate files to avoid duplication and drift.

Q: Why can a manual portal change get overwritten when using IaC?
A: Because the IaC files are the source of truth. A later deployment reconciles resources back to what the files describe, reverting undocumented manual changes (drift).

# Exercises

### Easy
List three benefits of infrastructure as code over building resources by hand in the portal.

### Medium
Write a small Bicep file that creates a storage account with a `storageName` parameter, run `what-if`,
then deploy it. Redeploy unchanged and confirm nothing new is created (idempotency).

### Challenging
Design how you'd manage `dev`, `test`, and `prod` with one Bicep template: describe the parameter files,
how `what-if` fits into review, and how you'd prevent configuration drift across the three environments.

# Further Reading

- Microsoft Learn — *What is Bicep?*: <https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview>
- Microsoft Learn — *What is infrastructure as code?*: <https://learn.microsoft.com/devops/deliver/what-is-infrastructure-as-code>
- Microsoft Learn — *Deploy Bicep with the Azure CLI*: <https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli>
- Microsoft Learn — *Preview changes with what-if*: <https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-what-if>
