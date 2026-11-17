---
slug: azure-sql-firewall-and-connectivity
title: "Azure SQL Server Firewalls and Private Endpoints"
topic: relational-and-nosql-databases
kind: technique
summary: "Lock down database access using server-level IP firewall rules, VNet service endpoints, and Private Link."
tags: [firewall, private-endpoint, networking, security, sql]
related: [azure-sql-service-tiers-and-deployment-options, private-endpoints-and-private-link, network-security-groups-and-security-rules]
---
> **In one line:** Secure Azure SQL Database using IP firewall rules and private endpoints to eliminate public internet routing.

## The idea

By default, an Azure SQL logical server rejects all incoming network connections from all IP addresses. To allow communication, you must configure network security boundaries:

1. **Server-Level IP Firewall Rules:** Explicitly permit specific client IP addresses or CIDR ranges (e.g., corporate office static IP addresses) to connect over port 1433. All requests from unlisted IPs are dropped at the perimeter.
2. **'Allow Azure Services and Resources' Setting:** A legacy checkbox (`0.0.0.0`). When enabled, it allows traffic from **any resource hosted in any Azure customer's subscription** to reach the SQL server login boundary. This is a security risk in production because it permits other Azure tenants to attempt brute-force authentication.
3. **Virtual Network Service Endpoints:** Route database traffic securely across the Microsoft backbone network directly from specific subnets.
4. **Azure Private Endpoints (Private Link):** The gold standard of database security. Projects a private IP address from your private VNet subnet directly to the SQL database. **Disables public internet access entirely**, ensuring database traffic never traverses public IP space.

| Connectivity Option | Route Taken | Public IP Exposure | Security Rating |
|---|---|---|---|
| **Public IP Firewall** | Public Internet | Server public FQDN | Moderate (Requires IP whitelisting) |
| **Allow Azure Services** | Azure Backbone | Open to any Azure tenant | **Weak (Avoid in production)** |
| **Virtual Network Endpoints** | Azure Backbone | Restricts to specific VNet | High |
| **Private Endpoint (Private Link)** | **Private VNet Subnet** | **Zero Public Access** | **Highest (Recommended Standard)** |

> **Tip:** In production enterprise environments, set `--public-network-access Disabled` on the Azure SQL Server and connect your application tiers strictly via Azure Private Endpoints.

## See it

Add an authorized client IP firewall rule and verify public network access settings via the Azure CLI:

```bash
# Add a server-level firewall rule permitting your office static public IP address
az sql server firewall-rule create   --resource-group rg-learning-portal   --server sql-portal-prod-001   --name "AllowCorporateOffice"   --start-ip-address 198.51.100.50   --end-ip-address 198.51.100.50   --output table

# Verify the list of active firewall rules on the server
az sql server firewall-rule list   --resource-group rg-learning-portal   --server sql-portal-prod-001   --output table
```

Any client attempting to connect from an IP outside `198.51.100.50` is rejected with an immediate TCP connection reset before reaching the SQL authentication engine.

## Go deeper

Azure SQL supports **Microsoft Entra ID Authentication** alongside standard SQL logins. Configuring Entra ID integration enables passwordless authentication from App Service using Managed Identities, eliminating database connection strings containing embedded plaintext passwords.

## Watch out

- Never leave 'Allow Azure services and resources to access this server' enabled in production; it allows any Azure customer to reach your login boundary.
- Forgetting to update client IP firewall rules when your local developer workstation IP changes results in immediate connection failures.

## Remember

- Azure SQL logical servers block all incoming connections by default until firewall rules are added.
- Avoid the 'Allow Azure Services' checkbox in production to prevent unauthorized cross-tenant connection attempts.
- Private Endpoints (Private Link) assign a private VNet IP to the database, eliminating public internet exposure.
