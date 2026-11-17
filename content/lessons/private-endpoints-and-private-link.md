---
slug: private-endpoints-and-private-link
title: "Private Endpoints and Azure Private Link"
topic: networking-and-connectivity
kind: pattern
summary: "Access Azure PaaS services through private IP addresses inside your VNet, eliminating public internet exposure."
tags: [private-endpoint, private-link, paas, security]
related: [vnet-peering-hub-and-spoke-architecture, azure-sql-firewall-and-connectivity, storage-security-and-entra-id-rbac]
---
> **In one line:** Private Endpoints bring Azure PaaS services securely inside your VNet using private internal IP addresses.

## The idea

By default, Azure Platform as a Service (PaaS) offerings—such as Azure SQL Database, Azure Key Vault, Cosmos DB, and Blob Storage—expose public DNS endpoints accessible over the public internet (e.g., `stportaldata001.blob.core.windows.net`). Even if protected by firewalls, public IP endpoints remain exposed to scanning and data exfiltration risks.

**Azure Private Link** and **Private Endpoints** completely eliminate this security exposure:
- A **Private Endpoint** is a special Network Interface (NIC) provisioned directly inside a subnet of your private Virtual Network.
- It is assigned a **private IP address** from your subnet's CIDR range (e.g., `10.0.1.5`).
- The private endpoint connects privately to the specific target Azure PaaS resource over the Microsoft backbone.
- You can disable public network access on the PaaS service entirely.

When an internal virtual machine or App Service accesses `stportaldata001.blob.core.windows.net`, an **Azure Private DNS Zone** intercepts the lookup and resolves the domain directly to the internal private IP `10.0.1.5`.

| Architectural Aspect | Public PaaS with Firewall | Azure Private Endpoint (Private Link) |
|---|---|---|
| **IP Address Used** | Public IP address | **Private IP from your VNet subnet (e.g. 10.0.1.5)** |
| **Data Exfiltration Risk** | Present (Credentials can target other public accounts) | **Eliminated (Tied strictly to that specific resource ID)** |
| **Public Internet Exposure** | Exposes public DNS and port 443 | **Disabled (`--public-network-access Disabled`)** |
| **Compliance** | Requires justification | **Standard for FedRAMP, HIPAA, PCI-DSS** |

> **Tip:** Private Endpoints protect against **data exfiltration**. Because the private endpoint binds strictly to your designated storage account instance, rogue software running on internal VMs cannot exfiltrate data to an attacker's personal public storage account.

## See it

Create a Private Endpoint linking a storage account to a private subnet using the Azure CLI:

```bash
# Disable public network access entirely on the target storage account
az storage account update   --name stportaldata001   --resource-group rg-learning-portal   --public-network-access Disabled   --output table

# Provision a Private Endpoint assigning a private VNet IP to the Blob service
az network private-endpoint create   --resource-group rg-learning-portal   --name pe-storage-blob   --vnet-name vnet-ecommerce-prod   --subnet snet-web   --private-connection-resource-id "/subscriptions/{sub-id}/resourceGroups/rg-learning-portal/providers/Microsoft.Storage/storageAccounts/stportaldata001"   --group-id blob   --connection-name conn-pe-blob   --output table
```

The storage account's public internet endpoint is disabled, and a private IP from `snet-web` is bound exclusively to the Blob service.

## Go deeper

To resolve the storage account FQDN to its private IP address automatically, link an **Azure Private DNS Zone** (`privatelink.blob.core.windows.net`) to your VNet. Applications continue using standard connection strings (`https://stportaldata001.blob.core.windows.net`) without hardcoding changing private IP addresses.

## Watch out

- Attempting to connect to a Private Endpoint from on-premises over VPN requires configuring DNS forwarding to Azure Private DNS resolvers.
- Private Endpoints incur a small hourly endpoint uptime fee and minor data transfer processing charges.

## Remember

- Private Endpoints assign private internal VNet IPs to Azure PaaS services.
- Public internet access can be completely disabled on the target PaaS resource.
- Private DNS zones resolve public service FQDNs seamlessly to internal private IP addresses.
