---
slug: diagnostic-settings-configuration
title: "Configuring Diagnostic Settings for Azure Resources"
topic: monitoring-and-observability
kind: pattern
summary: "Stream resource audit logs and metrics to Log Analytics, Storage Accounts, or Event Hubs."
tags: [diagnostic-settings, audit-logs, telemetry, streaming]
related: [log-analytics-workspaces-and-data-ingestion, azure-monitor-architecture-metrics-and-logs, microsoft-sentinel-cloud-native-siem]
---
> **In one line:** Diagnostic Settings configure where Azure resources stream their resource-level logs and metrics.

## The idea

By default, Azure automatically collects platform metrics (CPU, disk) and records control-plane management events in the Azure Activity Log (who created or deleted a resource).

However, **Resource Logs**—detailed telemetry detailing operations executed *against* a resource (e.g., individual Key Vault secret reads, Azure SQL executed query text, NSG allowed/blocked traffic flows)—are **NOT collected automatically**. To capture these rich logs, you must configure a **Diagnostic Setting** on each individual resource.

A Diagnostic Setting tells Azure:
1. **What to collect:** Specific log categories (e.g., `AuditEvent`, `Consents`, `QueryRuntimeStatistics`) and metric sets.
2. **Where to send it (Destinations):**
   - **Log Analytics Workspace:** Enables querying, KQL analysis, alerting, and integration with Microsoft Sentinel SIEM.
   - **Azure Storage Account:** Archives raw JSON logs to blob storage for long-term multi-year regulatory compliance retention at minimum cost.
   - **Azure Event Hubs:** Streams telemetry in real-time to external third-party observability tools (Splunk, Datadog, Dynatrace).
   - **Partner Solutions:** Direct integration with specialized SaaS monitoring partners.

| Destination | Primary Strength | Typical Consumer |
|---|---|---|
| **Log Analytics** | Instant KQL search, dashboards, and alerting | DevOps, SysAdmins, Security Teams |
| **Storage Account** | Lowest cost long-term cold archiving | Compliance Auditors (7-year retention) |
| **Event Hubs** | High-throughput streaming to external systems | Third-party SIEMs (Splunk, Elastic) |

> **Tip:** You can route telemetry to multiple destinations simultaneously within a single Diagnostic Setting (e.g., sending logs to Log Analytics for daily operational queries AND to Storage for 7-year archiving).

## See it

Configure a Diagnostic Setting on an Azure Key Vault to stream audit logs to Log Analytics via the Azure CLI:

```bash
# Query the Log Analytics workspace resource ID
LAW_ID=$(az monitor log-analytics workspace show -g rg-learning-portal -n law-corp-observability --query "id" -o tsv)

# Create a diagnostic setting streaming all audit events to the workspace
az monitor diagnostic-settings create   --name "ds-stream-to-loganalytics"   --resource "/subscriptions/{sub-id}/resourceGroups/rg-learning-portal/providers/Microsoft.KeyVault/vaults/kv-portal-prod-001"   --workspace "$LAW_ID"   --logs '[{"categoryGroup": "allLogs", "enabled": true}]'   --metrics '[{"category": "AllMetrics", "enabled": true}]'   --output table
```

Every subsequent secret read, key rotation, or unauthorized access attempt is streamed to the `AzureDiagnostics` table in Log Analytics within 60 seconds.

## Go deeper

Enterprises enforce uniform diagnostic logging across all subscriptions using **Azure Policy** with the `DeployIfNotExists` effect. If a developer provisions a new Key Vault or Azure SQL database without a Diagnostic Setting, Azure Policy automatically deploys the setting pointing to the corporate Log Analytics workspace.

Diagnostic settings can stream telemetry simultaneously to multiple destinations. For example, you can route logs to Log Analytics for immediate interactive KQL querying, stream to Event Hubs for real-time third-party SIEM ingestion (like Splunk), and archive to Azure Storage for 7-year regulatory compliance retention.

## Watch out

- Failing to enable Diagnostic Settings means security teams have zero audit visibility into who accessed Key Vault secrets or database tables.
- Streaming verbose data categories (like NSG Flow Logs or App Service detailed HTTP access logs) can generate significant data ingestion volume.

## Remember

- Diagnostic Settings stream detailed resource-level logs and metrics to designated destinations.
- Destinations include Log Analytics (queries/alerts), Storage Accounts (archive), and Event Hubs (streaming).
- Use Azure Policy to enforce automatic Diagnostic Setting deployment on all enterprise resources.
