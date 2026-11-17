---
slug: querying-logs-with-kusto-query-language-kql
title: "Querying Logs with Kusto Query Language (KQL)"
topic: monitoring-and-observability
kind: technique
summary: "Filter, project, summarize, and chart millions of log entries using pipe-delimited KQL query pipelines."
tags: [kql, kusto, log-analytics, queries]
related: [log-analytics-workspaces-and-data-ingestion, application-insights-apm-and-distributed-tracing, azure-monitor-alerts-and-action-groups]
---
> **In one line:** KQL is a fast, read-only query language for filtering, aggregating, and visualizing log data in Azure.

## The idea

**Kusto Query Language (KQL)** is the powerful, read-only query language used across Azure Monitor, Log Analytics, Application Insights, and Microsoft Sentinel. It is optimized for lightning-fast querying, filtering, and statistical analysis across billions of streaming log records.

A KQL query flows as a **pipe-delimited pipeline** (`|`), reading left-to-right and top-to-bottom. The output of each tabular operator flows directly as input to the next operator:

```text
TableSource
| where Timestamp >= ago(24h) and Status == 500
| summarize ErrorCount = count() by bin(Timestamp, 1h), OperationName
| order by ErrorCount desc
| render timechart
```

Common KQL operators:
- `where`: Filters rows matching boolean conditions.
- `project`: Selects and renames specific columns.
- `extend`: Calculates and appends new calculated columns.
- `summarize`: Aggregates data (`count()`, `avg()`, `percentiles()`) grouped by dimensions.
- `bin()`: Groups continuous values (like timestamps) into discrete time buckets (e.g., 5-minute intervals).
- `render`: Visualizes results directly as charts (`timechart`, `barchart`, `piechart`).

| SQL Equivalent | KQL Operator | Purpose |
|---|---|---|
| `FROM Table` | `TableName` | Primary data source table |
| `WHERE condition` | `| where condition` | Row-level filtering |
| `SELECT col1, col2` | `| project col1, col2` | Column projection |
| `GROUP BY ... COUNT(*)` | `| summarize count() by ...` | Dimensional data aggregation |
| `ORDER BY col DESC` | `| order by col desc` | Row sorting |

> **Tip:** Always place your `where` filter operators as close to the top of the KQL pipeline as possible. Filtering early drastically reduces the dataset size for subsequent operations, cutting query latency and resource consumption.

## See it

Execute a KQL query against a Log Analytics workspace using the Azure CLI:

```bash
# Query the Log Analytics workspace using a KQL pipe expression
az monitor log-analytics query   --workspace $(az monitor log-analytics workspace show -g rg-learning-portal -n law-corp-observability --query "customerId" -o tsv)   --analytics-query "AzureActivity | where TimeGenerated >= ago(7d) | where Level == 'Error' | summarize FailureCount = count() by Caller, OperationNameValue | order by FailureCount desc | take 5"   --output table
```

The query filters errors from the last 7 days, aggregates counts by caller and operation, and returns the top 5 failing administrative operations.

## Go deeper

KQL supports advanced text parsing and machine learning operators:
- `parse`: Extracts structured fields from unstructured raw log strings using string templates.
- `extract()`: Uses regular expressions to capture specific token values.
- `series_decompose_anomalies()`: Automatically detects statistical anomalies and spikes in time-series data without writing custom thresholds.

KQL provides advanced machine learning operators such as `series_decompose_anomalies` and `basket`. These native statistical functions allow security analysts and site reliability engineers to detect anomalous metric spikes and recurring log pattern clusters across millions of records with single-line query expressions.

## Watch out

- KQL is strictly case-sensitive for both operator names (`where`, not `WHERE`) and table/column identifiers.
- Queries without time filters scan the entire multi-year retention history, causing slow performance.

## Remember

- KQL is a fast, pipe-delimited read-only query language for logs, metrics, and security events.
- Pipelines flow tabular data from left to right: filter (`where`) -> aggregate (`summarize`) -> visualize (`render`).
- Place time and status filter conditions at the very top of queries for maximum execution performance.
