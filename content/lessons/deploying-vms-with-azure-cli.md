---
slug: deploying-vms-with-azure-cli
title: "Deploying Linux and Windows VMs with Azure CLI"
topic: virtual-machines-and-compute
kind: tool
summary: "Create virtual machines from official market images using az vm create with SSH keys and network defaults."
tags: [vm, azure-cli, linux, windows, ssh]
related: [vm-sizing-and-series-selection, connecting-via-ssh-and-bastion, vm-lifecycle-and-cost-deallocation]
---
> **In one line:** The az vm create command provisions virtual machines, networking interfaces, and managed disks in one command.

## The idea

Provisioning a virtual machine involves multiple interrelated Azure infrastructure objects:
1. **Virtual Machine Compute Resource:** Defines vCPU count, memory, and OS profile.
2. **Managed OS Disk:** Persistent SSD storage housing the operating system.
3. **Network Interface Card (NIC):** Attaches the VM to a virtual network subnet.
4. **Network Security Group (NSG):** Firewall rules controlling inbound/outbound ports.
5. **Public IP Address:** Optional routable IP address for direct internet connectivity.

The Azure CLI command `az vm create` is intelligent. If you do not explicitly pass existing network interfaces, subnets, or security groups, it automatically creates matching default resources named after the virtual machine.

| Parameter | Linux Default | Windows Default | Purpose |
|---|---|---|---|
| `--image` | `Ubuntu2204`, `Debian11` | `Win2022Datacenter` | Base OS market image |
| `--admin-username` | `azureuser` | Custom admin name | Local administrator login |
| `--authentication-type` | `ssh` (default) | `password` | Authentication mechanism |
| `--generate-ssh-keys` | Generates `~/.ssh/id_rsa` | N/A | Automated cryptographic key pair |

> **Tip:** Always use `--generate-ssh-keys` for Linux VMs; password authentication exposes SSH port 22 to automated brute-force attacks across the public internet.

## See it

Provision a Linux virtual machine and open HTTP port 80 using the Azure CLI:

```bash
# Provision an Ubuntu 22.04 LTS VM with automated SSH key generation
az vm create   --resource-group rg-learning-portal   --name vm-web-prod   --image Ubuntu2204   --size Standard_B2s   --admin-username azureuser   --generate-ssh-keys   --output table

# Open HTTP port 80 through the generated Network Security Group
az vm open-port --resource-group rg-learning-portal --name vm-web-prod --port 80 --priority 100 -o table

# Capture the allocated public IP address of the newly provisioned VM
VM_IP=$(az vm show --resource-group rg-learning-portal --name vm-web-prod -d --query "publicIps" -o tsv)
echo "VM accessible at: $VM_IP"
```

The CLI outputs the public IP address, SSH configuration path, and provisioning status once the hypervisor finishes booting the image. You can immediately test remote terminal connectivity by passing the generated credentials directly to your local OpenSSH client.

## Go deeper

You can automate post-deployment software installation using the `--custom-data` parameter. Passing a cloud-init script or shell file allows `az vm create` to automatically install Docker, Nginx, or runtime packages upon the virtual machine's first operating system boot without requiring interactive SSH logins.

You can customize post-provisioning software setup using the `--custom-data` flag. By passing a cloud-init script or shell file, `az vm create` automatically installs web servers, runtime frameworks, and monitoring agents during the first operating system boot without requiring manual interactive SSH logins.

## Watch out

- Never use common administrator names like `admin` or `root`; Azure rejects these as high-risk security vulnerabilities.
- Opening management ports (SSH 22 or RDP 3389) directly to `0.0.0.0/0` invites continuous credential brute-forcing.

## Remember

- `az vm create` provisions the compute instance, managed disk, NIC, and NSG in a single automated step.
- Always prefer SSH public key authentication over static passwords for Linux virtual machines.
- Use `--custom-data` with cloud-init scripts to automate package installation during first boot.
