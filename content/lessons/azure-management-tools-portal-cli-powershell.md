---
slug: azure-management-tools-portal-cli-powershell
title: "Azure Management Tools: Portal, CLI, and Cloud Shell"
topic: cloud-fundamentals
kind: tool
summary: "Choose between Azure Portal, Azure CLI, Azure PowerShell, and browser-based Azure Cloud Shell."
tags: [azure-cli, portal, cloud-shell, powershell, tools]
related: [azure-cli-authentication-and-commands, what-is-azure, azure-resource-manager-control-plane]
---
> **In one line:** Interact with Azure through GUI portals, cross-platform CLI, PowerShell modules, or browser-based Cloud Shell.

## The idea

Microsoft provides multiple client tools to manage, configure, and monitor cloud infrastructure. Because all tools send HTTPS requests to the Azure Resource Manager (ARM) REST APIs, they offer identical authority and control:

1. **Azure Portal (Web GUI):** An interactive web-based graphical interface (<https://portal.azure.com>). Ideal for beginners, visual dashboards, exploring service catalogs, and inspecting diagnostic graphs. Not suitable for repeatable production deployments.
2. **Azure CLI (`az`):** A lightweight, cross-platform command-line tool built on Python. Available on Linux, macOS, and Windows. Uses standard POSIX-friendly syntax, returns JSON, and integrates cleanly into Bash and CI/CD pipelines.
3. **Azure PowerShell (`Az` module):** A set of PowerShell cmdlets (`New-AzResourceGroup`, `Get-AzVM`) designed for Windows and PowerShell Core administrators. Emits typed .NET objects down the pipeline.
4. **Azure Cloud Shell:** A browser-accessible terminal hosted directly within the Azure Portal. Comes pre-authenticated with the Azure CLI, Azure PowerShell, Git, Terraform, and Docker pre-installed, backed by an Azure Files share.

| Tool | Interface Style | Environment | Primary Strength |
|---|---|---|---|
| **Azure Portal** | Web GUI | Any modern web browser | Exploration, dashboards, metrics visualization |
| **Azure CLI** | Bash / Command line | Windows, macOS, Linux | Automation, scripting, CI/CD pipelines, DevOps |
| **Azure PowerShell** | Object-oriented cmdlets | PowerShell 7+ | Windows administration, pipeline object filtering |
| **Azure Cloud Shell** | Browser-hosted terminal | Portal / shell.azure.com | Zero local installation, instant authenticated access |

> **Tip:** Use the Azure Portal to discover settings and visually understand an unfamiliar service, then capture the configuration using Azure CLI or Bicep for automated repeatability.

## See it

Open a terminal and verify that your local Azure CLI tool is installed and up-to-date:

```bash
# Check installed CLI version and dependencies
az version

# Use interactive help to discover resource commands without leaving the terminal
az vm --help
```

The CLI executes locally, translating flags like `--name` and `--resource-group` into JSON payloads sent over HTTPS to Azure.

## Go deeper

Azure Cloud Shell provides two runtime environment flavors: **Bash** and **PowerShell**. When you launch Cloud Shell for the first time, Azure prompts you to attach an Azure Storage Account. This persists a 5 GB file share mounted at `$HOME`, ensuring scripts, SSH keys, and `.bashrc` profiles survive across browser sessions.

## Watch out

- Avoid managing production environments exclusively through the web Portal; manual clicks cannot be version-controlled or audited in Git.
- Do not mix old, deprecated `AzureRM` PowerShell cmdlets with modern `Az` module cmdlets.

## Remember

- All Azure management tools communicate with the identical ARM REST API control plane.
- Azure CLI is cross-platform, returns JSON, and is the standard for Linux and CI/CD automation.
- Azure Cloud Shell provides an instant, pre-authenticated browser terminal with zero local setup.
