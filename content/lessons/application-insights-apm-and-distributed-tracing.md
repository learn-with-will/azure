---
slug: application-insights-apm-and-distributed-tracing
title: "Application Insights APM and Distributed Tracing"
topic: monitoring-and-observability
kind: tool
summary: "Monitor live application requests, response times, exceptions, dependencies, and end-to-end distributed transaction traces."
tags: [application-insights, apm, telemetry, tracing]
related: [azure-monitor-architecture-metrics-and-logs, querying-logs-with-kusto-query-language-kql, azure-monitor-alerts-and-action-groups]
---
> **In one line:** Application Insights delivers Application Performance Monitoring (APM) and distributed request tracing.

## The idea

When a user experiences a slow page load or a payment transaction fails, infrastructure metrics (CPU/RAM) cannot pinpoint the faulty line of code. **Azure Application Insights** is an **Application Performance Monitoring (APM)** service that instruments running software to monitor live application requests, exceptions, dependencies, and user telemetry.

Core capabilities of Application Insights:
1. **Request Tracking:** Measures request rates, execution duration, HTTP status codes, and failure counts across every API endpoint.
2. **Dependency Tracking:** Automatically detects and times outbound calls to external dependencies—database queries (SQL, Cosmos DB), Redis caches, HTTP REST APIs, and message queues. Pinpoints whether latency is caused by application code or slow database queries.
3. **Exception Diagnostics:** Captures full stack traces, parameter values, and unhandled exception details automatically when runtime crashes occur.
4. **Application Map:** Automatically draws a visual topology map of all interconnected microservices, background queues, and databases, displaying live throughput and health metrics.
5. **Distributed Tracing:** Generates an end-to-end transaction timeline linking a user's initial browser click, through multiple backend microservices, to the final database write.

| Telemetry Table | Data Captured | Example Information |
|---|---|---|
| `requests` | Inbound HTTP requests | Route (`/api/checkout`), Duration (142ms), ResultCode (200) |
| `dependencies` | Outbound external calls | SQL query text, HTTP dependency target, Duration |
| `exceptions` | Runtime crashes | Stack trace, exception type, error message |
| `pageViews` | Client browser telemetry | Browser type, screen resolution, client load time |

> **Tip:** Modern Application Insights accounts are **workspace-based**, meaning all telemetry is stored directly in a standard Log Analytics workspace where it can be joined with infrastructure logs using KQL.

## See it

Create an Application Insights component linked to a Log Analytics workspace using the Azure CLI:

```bash
# Query the Log Analytics workspace resource ID
LAW_ID=$(az monitor log-analytics workspace show -g rg-learning-portal -n law-corp-observability --query "id" -o tsv)

# Create an Application Insights resource linked to that workspace
az monitor app-insights component create   --app appi-portal-prod   --location eastus   --resource-group rg-learning-portal   --workspace "$LAW_ID"   --output table

# Retrieve the Connection String used to instrument application code
az monitor app-insights component show   --app appi-portal-prod   --resource-group rg-learning-portal   --query "connectionString" -o tsv
```

Developers provide this single `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable to their web application to begin automatic telemetry collection.

## Go deeper

Application Insights supports **Auto-Instrumentation (Codeless Monitoring)** for App Service and Azure Functions. You can enable full APM request tracking, dependency discovery, and exception capture directly through an Azure Portal toggle without modifying a single line of application source code or recompiling packages.

## Watch out

- High-traffic websites must configure **Adaptive Sampling** to prevent millions of telemetry requests from consuming excessive ingestion bandwidth.
- Do not log sensitive customer Personally Identifiable Information (PII) or credit card numbers inside custom telemetry properties.

## Remember

- Application Insights provides APM tracking for requests, dependencies, exceptions, and page views.
- Application Map visualizes dependencies and highlights microservice bottlenecks automatically.
- Instrument apps by configuring the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable.
