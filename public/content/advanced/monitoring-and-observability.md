---
id: lesson-17
slug: monitoring-and-observability
title: "Monitoring and Observability"
level: advanced
order: 17
duration: 20
tags:
  - azure-monitor
  - log-analytics
  - application-insights
  - alerts
  - kql
summary: "See what your systems are doing — Azure Monitor as the umbrella for metrics and logs, Log Analytics workspaces queried with KQL, Application Insights for application performance, and alerts with action groups that notify or automate a response."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe **Azure Monitor** and the two core data types: **metrics** and **logs**.
- Explain **Log Analytics** and query logs with **KQL**.
- Use **Application Insights** to monitor an application.
- Create **alerts** with **action groups** that notify or automate.

# Why It Matters

You can't operate what you can't see. When something is slow or broken, monitoring is how you find out —
ideally **before** users do. Azure Monitor gives you metrics, logs, tracing, and alerting in one place.
Setting it up well is the difference between calm operations and firefighting in the dark.

# Concept Explanation

### Azure Monitor: the umbrella

**Azure Monitor** is the platform that **collects, analyzes, and acts on telemetry** from your Azure
(and other) resources. Its data comes in two fundamental shapes:

- **Metrics** — **numeric** values sampled over time (CPU %, request count, latency). They're
  lightweight, **near real-time**, and great for dashboards and quick alerts. Explore them in **Metrics
  Explorer**.
- **Logs** — **structured records** of events and telemetry, stored in a **Log Analytics workspace** and
  queried with **KQL** (see below). Logs are richer and better for investigation and correlation.

### Log Analytics and KQL

A **Log Analytics workspace** is where log data lands. You query it with the **Kusto Query Language
(KQL)** — a readable, pipe-based language for filtering and aggregating. For example, find the most
recent errors:

```text
AppRequests
| where TimeGenerated > ago(1h)
| where Success == false
| summarize failures = count() by bin(TimeGenerated, 5m)
| order by TimeGenerated desc
```

KQL powers log queries, log-based alerts, and workbooks.

### Application Insights

**Application Insights** is Azure Monitor's **application performance monitoring (APM)**. Added to a web
app or API, it automatically tracks **requests, dependencies, exceptions, and performance**, plus
**availability** tests and an **application map** of how components call each other. Its data is stored
in a Log Analytics workspace, so you query it with KQL too. It's the fastest way to answer "why is my app
slow or erroring?"

### Alerts and action groups

An **alert rule** watches a signal — a **metric** threshold, a **log** query result, or an **activity
log** event — and fires when a condition is met. What happens next is defined by an **action group**:
send email/SMS, call a webhook, trigger a Logic App or Function, or open a ticket. Together they let you
**notify people or automate a response** the moment something goes wrong.

### Related health signals

Two adjacent services help you know **whose** problem it is: **Azure Service Health** (Azure-wide
incidents affecting you) and **Resource Health** (the health of a specific resource).

# Key Terminology

- **Azure Monitor** — the umbrella platform for telemetry, analysis, and alerting.
- **Metric** — a numeric, near-real-time time-series value.
- **Log / Log Analytics workspace** — structured event data and where it's stored/queried.
- **KQL** — the Kusto Query Language for querying logs.
- **Application Insights** — application performance monitoring within Azure Monitor.
- **Alert rule / action group** — a condition that fires and the response it triggers.

# Options and Trade-offs

| Need | Option A | Option B | How to choose |
| ---- | -------- | -------- | ------------- |
| Quick health signal | **Metrics** | **Logs** | Metrics for fast, numeric dashboards/alerts; logs for rich investigation and correlation. |
| App-level insight | **Application Insights** | Resource metrics only | App Insights for request/dependency/exception detail; resource metrics for infrastructure health. |
| Responding | **Notify** (email/SMS) | **Automate** (webhook/Function/Logic App) | Notify for human triage; automate for known, repeatable remediations. |

# Worked Example

Create a metric alert on VM CPU that emails an action group:

```bash
# 1. An action group that emails the on-call address
az monitor action-group create \
  --resource-group ops-rg --name oncall \
  --short-name oncall --action email admin admin@contoso.com

# 2. Alert when average CPU exceeds 80% over 5 minutes
az monitor metrics alert create \
  --resource-group ops-rg --name high-cpu \
  --scopes <vm-resource-id> \
  --condition "avg Percentage CPU > 80" \
  --window-size 5m --evaluation-frequency 1m \
  --action oncall
```

Now sustained high CPU pages the on-call engineer automatically.

# Real World Analogy

Monitoring is the **dashboard and warning lights** in a car. **Metrics** are the live gauges (speed,
fuel, temperature) — a quick glance tells you if things are normal. **Logs** are the detailed **trip
computer/diagnostics** you dig into when a light comes on. **Application Insights** is a mechanic riding
along, noting exactly which part is struggling. **Alerts** are the warning chime that goes off *before*
the engine overheats.

# Examples

## Example 1 — Basic: watch a web app

A team adds **Application Insights** to their App Service app and immediately sees request rates,
response times, failed requests, and the slowest dependencies — no custom code.

**Why this works:** App Insights auto-collects the signals that explain app behavior.

## Example 2 — Real-world: alert then auto-heal

An alert fires when queue length grows too large; its action group triggers a **Function** that scales
out the consumer. Humans are notified, but the fix starts instantly.

**Why this works:** action groups can **automate** a known remediation, shrinking downtime.

## Example 3 — Pitfall: alert fatigue

A team sets dozens of noisy, low-threshold alerts. Everyone starts ignoring them — and misses the real
incident buried in the noise.

**Why this bites:** too many alerts train people to ignore them. Alert on **meaningful, actionable**
conditions with sensible thresholds.

# Common Mistakes

- **No Log Analytics workspace planned.** Logs need somewhere to go — set up a workspace.
- **Confusing metrics and logs.** Metrics = fast numeric; logs = rich, KQL-queried records.
- **Skipping Application Insights.** You lose request/dependency/exception visibility into your app.
- **Over-alerting.** Noise causes alert fatigue; alert only on actionable conditions.

# Best Practices

- Add **Application Insights** to every app and a **Log Analytics workspace** for logs.
- Alert on a **few meaningful signals** with action groups that notify **and/or** automate.
- Learn enough **KQL** to investigate incidents and build **workbooks/dashboards**.
- Use **Service Health** and **Resource Health** to tell platform issues from your own.

# Summary

- **Azure Monitor** unifies **metrics** (fast, numeric) and **logs** (rich, in **Log Analytics**, queried
  with **KQL**).
- **Application Insights** provides application performance monitoring — requests, dependencies,
  exceptions, and maps.
- **Alerts** watch signals and use **action groups** to notify people or automate responses.
- Good monitoring is **actionable, not noisy** — alert on what matters.

# Flash Cards

Q: What two core data types does Azure Monitor collect, and how do they differ?
A: Metrics (numeric, near-real-time time-series, great for dashboards and quick alerts) and logs (structured event records stored in a Log Analytics workspace and queried with KQL for deeper investigation).

Q: What is KQL and where is it used?
A: The Kusto Query Language — a pipe-based query language used to query logs in a Log Analytics workspace, power log-based alerts, and build workbooks.

Q: What does Application Insights provide?
A: Application performance monitoring within Azure Monitor — automatic tracking of requests, dependencies, exceptions, performance, availability tests, and an application map. Its data lands in a Log Analytics workspace.

Q: What is the relationship between an alert rule and an action group?
A: An alert rule defines the condition to watch (metric threshold, log query, or activity event); an action group defines the response when it fires (email/SMS, webhook, Function, Logic App, etc.).

Q: What's the difference between Azure Service Health and Resource Health?
A: Service Health reports Azure-wide incidents and maintenance that affect you; Resource Health reports the current health of a specific resource — together they help you tell platform problems from your own.

Q: Why is over-alerting harmful?
A: Too many noisy alerts cause "alert fatigue" — people start ignoring them and miss the real incident. Alert only on meaningful, actionable conditions.

# Exercises

### Easy
Explain the difference between a metric and a log, and give one example of each for a web app.

### Medium
Create an action group (email) and a metric alert on a resource (for example, VM CPU > 80% over 5
minutes). Describe what happens when it fires.

### Challenging
Write (in words or KQL) a query to find the top five slowest requests for an app over the last 24 hours,
and describe an alert you'd build from a similar query — including why its threshold avoids alert
fatigue.

# Further Reading

- Microsoft Learn — *Azure Monitor overview*: <https://learn.microsoft.com/azure/azure-monitor/overview>
- Microsoft Learn — *Log Analytics and KQL*: <https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview>
- Microsoft Learn — *Application Insights overview*: <https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview>
- Microsoft Learn — *Azure Monitor alerts overview*: <https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-overview>
