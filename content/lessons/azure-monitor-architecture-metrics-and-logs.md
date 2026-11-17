---
slug: azure-monitor-architecture-metrics-and-logs
title: "Azure Monitor Architecture: Metrics and Logs"
topic: monitoring-and-observability
kind: concept
summary: "Understand how Azure Monitor collects, aggregates, and stores real-time numeric metrics and structured log records."
tags: [azure-monitor, metrics, logs, observability]
related: [log-analytics-workspaces-and-data-ingestion, querying-logs-with-kusto-query-language-kql, application-insights-apm-and-distributed-tracing]
---
> **In one line:** Azure Monitor is the unified platform for collecting, analyzing, and alerting on metrics and logs.

## The idea

Observability in modern cloud environments requires tracking application performance, infrastructure health, and security events across thousands of moving components. **Azure Monitor** is Microsoft's comprehensive full-stack monitoring solution.

Azure Monitor collects and stores operational telemetry in two fundamental data types:
1. **Metrics:** Lightweight, real-time numerical values describing some aspect of a system at a particular point in time. Collected at 1-minute intervals and stored in a high-performance time-series database. Ideal for real-time dashboards and triggering automated autoscaling or immediate alerts. Examples include: `% CPU Utilization`, `Network In/Out bytes`, `Disk IOPS`, `HTTP Request Count`.
2. **Logs:** Structured or semi-structured timestamped text records and events. Stored in **Log Analytics workspaces** and queried using the powerful **Kusto Query Language (KQL)**. Logs provide rich context explaining *why* an anomaly occurred. Examples include: Application exception traces, HTTP access logs, Azure Activity Log management audits, and firewall drops.

| Telemetry Type | Data Structure | Ingestion Latency | Retention Period | Primary Use Case |
|---|---|---|---|---|
| **Metrics** | Numeric time-series values | Real-time (< 1 minute) | 93 days | Autoscale triggers, live dashboard graphs, alerts |
| **Logs** | Structured records with schema | 1–3 minutes | Up to 2 years (or 12 years archive) | Root-cause analysis, security SIEM, audit compliance |

> **Tip:** Metrics tell you that something is wrong (e.g., CPU is at 99%); Logs tell you *why* it is wrong (e.g., an unindexed SQL query is running in a loop).

## See it

Query near real-time compute metrics for an active virtual machine using the Azure CLI:

```bash
# Query the average Percentage CPU metric over the last hour at 5-minute intervals
az monitor metrics list   --resource "/subscriptions/{sub-id}/resourceGroups/rg-learning-portal/providers/Microsoft.Compute/virtualMachines/vm-web-prod"   --metric "Percentage CPU"   --interval PT5M   --query "value[0].timeseries[0].data[-3:].{Time:timeStamp, AverageCPU:average}"   -o table

# List all available metrics supported by the target resource type
az monitor metrics list-definitions   --resource "/subscriptions/{sub-id}/resourceGroups/rg-learning-portal/providers/Microsoft.Compute/virtualMachines/vm-web-prod"   --query "[].name.localizedValue" -o tsv
```

The CLI queries Azure Monitor's time-series database directly, returning recent performance counters without impacting the running virtual machine.

## Go deeper

Azure Monitor collects data across three tiers of the cloud architecture:
- **Application Tier:** Application Insights SDK captures request rates, exception traces, and dependency calls.
- **Guest OS Tier:** Azure Monitor Agent (AMA) collects OS syslog, Windows Event Logs, and system memory metrics.
- **Platform Resource Tier:** Azure Resource Providers stream metric counters and diagnostic audit logs automatically.

Azure Monitor natively supports **Distributed Tracing via OpenTelemetry**. By instrumenting your application code with vendor-neutral OpenTelemetry SDKs, end-to-end HTTP request flows and database dependencies are visualized automatically in Application Insights Application Map without vendor lock-in.

## Watch out

- Metrics are retained for exactly 93 days; archiving numerical metrics beyond 93 days requires routing them to a Log Analytics workspace.
- Standard platform metrics are collected for free, but custom application metrics and high-volume log ingestion incur billing fees.

## Remember

- Azure Monitor unifies telemetry across lightweight numeric Metrics and rich structured Logs.
- Metrics power real-time dashboards, autoscale triggers, and fast threshold alerts.
- Logs are queried in Log Analytics using KQL to perform deep root-cause troubleshooting.
