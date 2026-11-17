---
slug: connecting-via-ssh-and-bastion
title: "Secure VM Access: SSH, RDP, and Azure Bastion"
topic: virtual-machines-and-compute
kind: technique
summary: "Connect securely to private VMs through a browser using Azure Bastion without exposing public IP addresses."
tags: [bastion, ssh, rdp, remote-access, security]
related: [deploying-vms-with-azure-cli, network-security-groups-and-security-rules, vm-lifecycle-and-cost-deallocation]
---
> **In one line:** Azure Bastion provides fully managed browser-based RDP and SSH access without exposing public IPs.

## The idea

Managing virtual machines requires administrative access: **SSH (port 22)** for Linux and **RDP (port 3389)** for Windows.

Historically, administrators attached public IP addresses directly to VMs and opened port 22 or 3389. This architectural anti-pattern exposes management interfaces to automated internet port scanners, credential stuffing, and zero-day vulnerabilities.

Azure provides **Azure Bastion**, a fully platform-managed PaaS proxy service provisioned inside a dedicated subnet (`AzureBastionSubnet`):
1. **Zero Public IP on VMs:** Your virtual machines remain entirely private, assigned only private internal IP addresses within your VNet.
2. **Encrypted Browser Access:** Administrators connect over TLS (HTTPS port 443) directly inside the Azure Portal. RDP and SSH sessions stream securely within any modern HTML5 browser window.
3. **Protection Against Port Scanning:** Because management ports (22 and 3389) are never exposed to the public internet, port-scanning botnets cannot target your workloads.

| Access Method | Public IP on VM | Open Internet Ports | Risk Profile |
|---|---|---|---|
| **Direct Public IP** | Required | Port 22 / 3389 open | Critical risk (Brute-force attacks) |
| **Jumpbox (Self-hosted VM)** | Required on Jumpbox | Port 22 / 3389 open | High risk (Requires OS patching & maintenance) |
| **Azure Bastion** | **None** | Only HTTPS (443) on Bastion | Minimal risk (Fully managed PaaS proxy) |

> **Tip:** When deploying a corporate Azure network, deploy a single Azure Bastion host in your Hub VNet to securely manage all private VMs across peered spoke networks without public IP exposure.

## See it

Connect to a private Linux VM through Azure Bastion using the Azure CLI tunnel capability:

```bash
# Connect securely to a private VM via Azure Bastion using standard local SSH client
az network bastion ssh   --name myBastionHost   --resource-group rg-networking   --target-resource-id "/subscriptions/{sub-id}/resourceGroups/rg-compute/providers/Microsoft.Compute/virtualMachines/vm-private-db"   --auth-type ssh-key   --username azureuser   --ssh-key ~/.ssh/id_rsa
```

The CLI establishes an encrypted TLS tunnel through Azure Bastion, allowing you to use your standard local terminal and SSH keys without a public IP on the target VM.

## Go deeper

Azure Bastion comes in multiple tiers:
- **Developer SKU:** Low-cost, shared lightweight proxy for single-VNet dev environments.
- **Basic SKU:** Supports browser-based SSH and RDP for VMs within a single virtual network.
- **Standard SKU:** Adds support for connecting across VNet Peering, native CLI tunneling (`az network bastion ssh/rdp`), shareable links, and session monitoring.

Azure Bastion supports native client connectivity via the Azure CLI (`az network bastion ssh`). This feature allows developers to use their preferred local terminal emulators, SSH key pairs, and tools like `scp` or VS Code Remote without ever exposing public IP addresses on cloud virtual machines.

## Watch out

- Azure Bastion must be deployed into a subnet named exactly `AzureBastionSubnet` with at least a `/26` prefix.
- Do not attach a public IP address to a production VM just to enable quick temporary SSH access; use Bastion instead.

## Remember

- Never expose SSH (port 22) or RDP (port 3389) directly to the public internet.
- Azure Bastion provides secure, browser-based management over TLS without public IPs on VMs.
- Bastion Standard supports native command-line SSH and RDP tunneling over encrypted HTTPS connections.
