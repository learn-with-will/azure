---
slug: blob-lifecycle-management-rules
title: "Automated Blob Lifecycle Management"
topic: storage-and-blob
kind: pattern
summary: "Write JSON lifecycle rules to transition aged blobs to cheaper access tiers and delete expired objects."
tags: [lifecycle-management, cost-optimization, retention, automation]
related: [blob-storage-containers-and-tiers, azure-storage-account-types, azure-cost-management-and-budget-alerts]
---
> **In one line:** Lifecycle management rules automatically move aging blobs to cheaper tiers and delete expired data.

## The idea

In production systems, data value changes over time. Application log files, raw database backups, and customer uploads are accessed frequently during the first few days, rarely after 30 days, and almost never after 90 days. Manually tracking and changing blob tiers is error-prone.

**Blob Lifecycle Management** provides a declarative, rule-based policy engine built directly into Azure Storage. You define rules in JSON that automatically transition blobs to cooler, cheaper access tiers or permanently delete them as they age.

A lifecycle policy rule contains:
- **Filters:** Scopes the rule to specific blob types (`blockBlob`) and prefix paths (e.g., `container1/logs/`).
- **Actions:** The state transitions executed when conditions are met:
  - `tierToCool`: Move to Cool tier (e.g., 30 days after last modification).
  - `tierToCold`: Move to Cold tier (e.g., 90 days after last modification).
  - `tierToArchive`: Move to Archive tier (e.g., 180 days after last modification).
  - `delete`: Permanently delete the blob (e.g., 365 days after creation).

| Stage | Days Since Last Modified | Access Tier | Financial Benefit |
|---|---|---|---|
| **Creation** | Day 0 | Hot Tier | Instant read performance |
| **Aging** | Day 30 | Cool Tier | ~50% storage cost reduction |
| **Long-Term** | Day 90 | Cold Tier | ~75% storage cost reduction |
| **Compliance** | Day 180 | Archive Tier | ~95% storage cost reduction |
| **Expiration** | Day 730 | Deleted | Zero storage cost |

> **Tip:** You can base lifecycle rules on **Last Modified Time** or enable **Last Access Time Tracking** to transition blobs based on when they were actually last read by an application.

## See it

Apply an automated lifecycle management policy rule to a storage account using the Azure CLI:

```bash
# Define a declarative JSON lifecycle management policy
cat << 'EOF' > policy.json
{
  "rules": [
    {
      "enabled": true,
      "name": "tier-and-delete-old-logs",
      "type": "Lifecycle",
      "definition": {
        "filters": { "blobTypes": [ "blockBlob" ], "prefixMatch": [ "logs/" ] },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 90 },
            "delete": { "daysAfterModificationGreaterThan": 365 }
          }
        }
      }
    }
  ]
}
EOF

# Apply the lifecycle policy to the storage account
az storage account management-policy create   --account-name stportaldata001   --resource-group rg-learning-portal   --policy @policy.json   --output table
```

Azure's background lifecycle daemon runs daily, evaluating all blobs in the `logs/` path and moving or deleting matching objects automatically.

## Go deeper

Lifecycle management policies also support managing **Blob Snapshots** and **Blob Versions**. You can configure rules that automatically delete old, non-current versions of modified blobs after 14 days, preventing stale historical versions from consuming storage quota.

## Watch out

- Be aware of minimum retention periods; transitioning a blob to Cool at day 10 and deleting it at day 20 incurs an early deletion penalty fee.
- Lifecycle rules run once per day; execution is asynchronous and does not occur instantly upon reaching the exact minute threshold.

## Remember

- Lifecycle management policies automate blob tier transitions and permanent expirations.
- Rules can filter by container name, blob prefix path, and blob type.
- Automating transitions from Hot -> Cool -> Archive -> Delete drastically slashes long-term storage spend.
