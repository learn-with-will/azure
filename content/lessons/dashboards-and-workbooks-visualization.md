---
slug: dashboards-and-workbooks-visualization
title: "Azure Workbooks and Interactive Dashboards"
topic: monitoring-and-observability
kind: tool
summary: "Build rich interactive observability reports combining text, KQL grid queries, and time-series charts."
tags: [workbooks, dashboards, visualization, reports]
related: [querying-logs-with-kusto-query-language-kql, log-analytics-workspaces-and-data-ingestion, application-insights-apm-and-distributed-tracing]
---
> **In one line:** Azure Workbooks combine markdown text, KQL query grids, and charts into interactive operational reports.

## The idea

Visualizing cloud health across distributed systems requires sharing interactive operational views among developers, operations staff, and business stakeholders. Azure provides two visualization options:

1. **Azure Portal Dashboards:** Pinned tiles and charts arranged on a single canvas. Useful for live Network Operations Center (NOC) wall monitors showing basic CPU gauges, billing tiles, and static metric graphs. Limited interactivity and parameterization.
2. **Azure Workbooks:** A powerful, flexible reporting and visualization canvas. Workbooks combine:
   - **Rich Markdown Text:** Explains context, links playbooks, and documents standard operating procedures.
   - **KQL Log Query Grids:** Tabular data with conditional formatting (heatmaps, bar meters, threshold status icons).
   - **Time-Series Charts:** Multi-line charts, area charts, and bar graphs rendered from metrics or logs.
   - **Interactive Dropdown Parameters:** Filter reports by Subscription, Environment, Time Range, or Resource Group dynamically.

Workbooks can query data from multiple disparate sources simultaneously: Log Analytics workspaces, Azure Resource Graph, Azure Monitor Metrics, and external REST APIs.

| Visualization Tool | Canvas Type | Interactivity | Underlying Tech |
|---|---|---|---|
| **Portal Dashboard** | Tile grid | Static pinned views | Metric pins, markdown tiles |
| **Azure Workbooks** | Document narrative | **Dynamic dropdown parameters, tab navigation** | KQL queries, ARM APIs, Metric APIs |
| **Power BI** | Enterprise BI | Advanced business slicing | DirectQuery, Power BI datasets |

> **Tip:** Azure provides dozens of pre-built, production-ready **Workbook Templates** out of the box (e.g., App Service Diagnostics, Key Vault Access Audits, Storage Capacity Analysis). Always inspect pre-built templates before building custom workbooks.

## See it

Query workbook definitions and export visualization templates using the Azure CLI:

```bash
# Query existing Azure Workbook resources in your resource group
az monitor workbook list   --resource-group rg-learning-portal   --query "[].{Name:name, Title:displayName, Category:category}"   -o table

# Inspect the underlying JSON structure of an Azure Workbook definition
az monitor workbook show   --resource-group rg-learning-portal   --workbook-id "my-workbook-guid"   --query "{Title:displayName, SerializedData:serializedData}"   -o json
```

Workbook templates can be serialized as JSON files and checked into Git repositories alongside your application infrastructure code.

## Go deeper

Workbooks support **Azure Resource Graph Queries**. In a single workbook tile, you can query across all 50 subscriptions in your enterprise to list every unattached managed disk, every VM missing an antivirus agent, or every public IP address, rendering an executive compliance dashboard in seconds.

Azure Workbooks support parameterized interactive controls. Users can select dynamic dropdown filters (such as subscription, time range, or severity) that update multiple KQL visual charts simultaneously, creating powerful investigative workflows for incident management and capacity planning across engineering teams.

## Watch out

- Heavy workbooks with dozens of unoptimized KQL queries will slow down browser rendering and consume high query compute units.
- Remember that users viewing a workbook must have RBAC read permissions on the underlying Log Analytics workspaces.

## Remember

- Azure Workbooks combine markdown text, interactive parameters, KQL grids, and metric charts.
- Workbooks query across Log Analytics, Resource Graph, Metrics, and external APIs simultaneously.
- Workbook templates can be version-controlled in Git and deployed using ARM or Bicep templates.
