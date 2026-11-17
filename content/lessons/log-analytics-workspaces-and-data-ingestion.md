---
slug: log-analytics-workspaces-and-data-ingestion
title: "Log Analytics Workspaces and Data Ingestion"
topic: monitoring-and-observability
kind: concept
summary: "Centralize diagnostic logs across subscriptions into dedicated Log Analytics workspaces for retention and analysis."
tags: [log-analytics, workspaces, ingestion, retention]
related: [azure-monitor-architecture-metrics-and-logs, querying-logs-with-kusto-query-language-kql, diagnostic-settings-configuration]
---
> **In one line:** Log Analytics workspaces serve as central queryable data repositories for logs collected across Azure.

## The idea

A **Log Analytics workspace** is a dedicated data repository in Azure Monitor. It aggregates, indexes, and stores log data collected from hundreds of disparate cloud and on-premises sources into structured tabular tables.

Data ingestion sources include:
- Azure Resource Diagnostic Logs (App Service, Azure SQL, Key Vault, NSGs).
- Operating System logs collected by the **Azure Monitor Agent (AMA)** on Linux and Windows.
- Application Insights telemetry (page views, requests, exceptions, dependencies).
- Microsoft Defender for Cloud security alerts and Microsoft Sentinel SIEM events.

Once ingested into a workspace, data is organized into structured tables (e.g., `AzureActivity`, `AppRequests`, `Syslog`, `Heartbeat`). You can execute cross-resource and cross-subscription analytical queries across millions of rows in seconds.

| Workspace Setting | Default Setting | Configurable Options | Impact |
|---|---|---|---|
| **Data Retention** | 30 days (Free tier) | Up to 730 days (2 years) | Long-term operational audit compliance |
| **Archive Retention** | N/A | Up to 12 years | Low-cost regulatory cold storage retention |
| **Daily Volume Cap** | Unlimited | Cap in GB/day | Prevents runaway billing during log spikes |
| **Pricing Tier** | Pay-as-you-go | Commitment Tiers (100–5000 GB/day) | Volume discounts for high-ingestion enterprises |

> **Tip:** Configure a **Daily Volume Cap** (e.g., 10 GB/day) on development and non-critical testing workspaces to prevent malfunctioning debug scripts from generating massive ingestion billing surprises.

## See it

Create a Log Analytics workspace and configure its data retention period using the Azure CLI:

```bash
# Create a Log Analytics workspace in East US
az monitor log-analytics workspace create   --resource-group rg-learning-portal   --workspace-name law-corp-observability   --location eastus   --retention-time 90   --output table

# Verify the configured retention period and daily ingestion cap settings
az monitor log-analytics workspace show   --resource-group rg-learning-portal   --workspace-name law-corp-observability   --query "{Name:name, RetentionDays:retentionInDays, DailyCapGB:dailyQuotaGb, State:provisioningState}"   -o json
```

The workspace is configured to retain operational logs for 90 days, ready to accept diagnostic streams from Azure resources.

## Go deeper

For data retention beyond 2 years, Log Analytics supports **Interactive Data vs Basic Logs / Archive Logs**. Ingesting high-volume debugging logs (like verbose network firewall logs) into the Basic Logs tier reduces ingestion costs by over 75%, preserving compliance archives without expensive search indexes.

To optimize costs on high-volume, low-value logs (such as verbose firewall logs), configure the **Basic Logs** table plan. Basic logs reduce data ingestion costs by over 70% compared to Analytics logs, providing an economical solution for retaining debugging logs that are queried only during incident triage.

## Watch out

- Log Analytics billing is based primarily on gigabytes of data ingested; verbose debug logging can generate unexpected invoices.
- Once a Daily Cap is reached, the workspace stops collecting logs for the remainder of the calendar day, creating blind spots.

## Remember

- Log Analytics workspaces aggregate structured log tables across subscriptions and hybrid servers.
- Data retention is configurable up to 730 days online, and up to 12 years in archive storage.
- Set daily data ingestion caps on dev/test environments to prevent runaway billing spikes.
