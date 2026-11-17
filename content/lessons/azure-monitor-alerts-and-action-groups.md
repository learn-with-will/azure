---
slug: azure-monitor-alerts-and-action-groups
title: "Azure Monitor Alerts and Action Groups"
topic: monitoring-and-observability
kind: technique
summary: "Detect issues proactively with metric thresholds and log queries, triggering notifications via Action Groups."
tags: [alerts, action-groups, notifications, webhooks]
related: [azure-monitor-architecture-metrics-and-logs, querying-logs-with-kusto-query-language-kql, alert-fatigue-and-threshold-tuning]
---
> **In one line:** Azure Monitor Alerts evaluate conditions to notify teams or automate remediation via Action Groups.

## The idea

Monitoring telemetry is useless if engineers must stare at dashboards all day. **Azure Monitor Alerts** proactively notify operations teams and trigger automated remediation workflows the moment abnormal system behavior is detected.

An alert rule consists of two components:
1. **Alert Condition:** Defines *what* to monitor and *when* to fire:
   - **Metric Alerts:** Evaluates numeric counters against static or dynamic thresholds (e.g., fire if `Percentage CPU > 85%` for 5 consecutive minutes). Evaluated frequently (every 1 minute) with ultra-low latency.
   - **Log Search Alerts:** Evaluates a custom KQL query against Log Analytics on a periodic schedule (e.g., fire if `AppRequests | where ResultCode == 500` returns more than 10 rows over the last 15 minutes).
   - **Activity Log Alerts:** Fires when specific management plane events occur (e.g., an unauthorized administrator deletes a resource group).
2. **Action Group:** Defines *who* is notified and *what automation* is triggered when the alert fires.

| Action Type | Implementation | Primary Use Case |
|---|---|---|
| **Email / SMS / Push** | Built-in Azure notification | Human engineer notification |
| **Webhook** | HTTPS POST payload | Integrates with Slack, Microsoft Teams, PagerDuty |
| **Azure Logic App / Function** | Serverless execution | Automated self-healing (e.g. restart service) |
| **ITSM Integration** | ServiceNow / Jira integration | Automatic incident ticket generation |

> **Tip:** Decouple alert rules from notification channels by utilizing **Action Groups**. Multiple different alert rules (e.g., High CPU, Database Connection Errors, Storage Outages) can all link to a single `ag-oncall-devops` Action Group.

## See it

Create an Action Group and configure a high-CPU metric alert rule using the Azure CLI:

```bash
# Step 1: Create an Action Group with email notifications
az monitor action-group create   --resource-group rg-learning-portal   --name ag-oncall-devops   --short-name "OnCallOps"   --action email admin-alert alex@contoso.com   --output table

# Step 2: Create a Metric Alert firing when VM CPU exceeds 85% for 5 minutes
az monitor metrics alert create   --resource-group rg-learning-portal   --name alert-vm-high-cpu   --scopes "/subscriptions/{sub-id}/resourceGroups/rg-learning-portal/providers/Microsoft.Compute/virtualMachines/vm-web-prod"   --condition "avg Percentage CPU > 85"   --window-size 5m   --evaluation-frequency 1m   --action ag-oncall-devops   --severity 2   --output table
```

When average CPU breaches 85% for five minutes, Azure Monitor transitions the alert to `Fired` and dispatches notification emails immediately.

## Go deeper

Azure Monitor supports **Dynamic Thresholds**. Instead of guessing a static threshold number (like 80%), dynamic thresholds apply machine learning algorithms to learn seasonal traffic patterns. It automatically adjusts alert thresholds for business hours versus nights and weekends, firing only when behavior deviates statistically from historical baselines.

Azure Monitor supports **Dynamic Thresholds**. Instead of hardcoding fixed numeric limits (such as CPU > 80%), dynamic alerts utilize machine learning to establish seasonal baseline behavior. An alert triggers only when metric telemetry deviates significantly from expected historical patterns, drastically reducing alert fatigue.

## Watch out

- Log search alerts have higher latency than metric alerts; do not rely on 15-minute log query alerts for instantaneous outage detection.
- Avoid sending high-frequency email alerts directly to individual developer inboxes; route alerts to centralized webhook channels or incident response systems.

## Remember

- Alert rules evaluate conditions (metrics, log searches, activity logs) to detect problems proactively.
- Action Groups define notification recipients (email, SMS) and automated remediation actions (webhooks, runbooks).
- Dynamic Thresholds utilize machine learning to eliminate manual threshold tuning for seasonal traffic.
