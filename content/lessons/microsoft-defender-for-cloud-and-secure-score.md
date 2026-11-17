---
slug: microsoft-defender-for-cloud-and-secure-score
title: "Microsoft Defender for Cloud and Secure Score"
topic: governance-reliability-architecture
kind: tool
summary: "Assess cloud security posture, prioritize remediation using Secure Score, and detect active threats across workloads."
tags: [defender, secure-score, cspm, cwwp, security]
related: [zero-trust-architecture-in-azure, microsoft-sentinel-cloud-native-siem, azure-policy-and-compliance-enforcement]
---
> **In one line:** Microsoft Defender for Cloud unifies cloud security posture management and active workload threat protection.

## The idea

Securing complex multicloud environments requires continuous assessment of misconfigurations and real-time detection of cyberattacks. **Microsoft Defender for Cloud** is Azure's unified platform for cloud security.

Defender for Cloud combines two critical cybersecurity disciplines:
1. **Cloud Security Posture Management (CSPM):**
   - Continuously scans Azure, AWS, and GCP subscriptions for security misconfigurations (e.g., publicly exposed storage buckets, missing MFA, unencrypted disks).
   - Generates actionable remediation recommendations prioritized by risk.
   - Summarizes overall security health into a single numeric KPI: the **Secure Score**.
2. **Cloud Workload Protection Platform (CWPP):**
   - Provides advanced threat detection and behavioral analytics for specific cloud workloads (Defender for Servers, Defender for Storage, Defender for Containers, Defender for SQL).
   - Alerts security operations teams to brute-force attacks, crypto-mining malware, and anomalous data exfiltration.

| Defender Capability | Purpose | Key Metric / Feature |
|---|---|---|
| **Secure Score** | Measures posture against best practices | Percentage score (0% to 100%) |
| **Regulatory Compliance** | Measures posture against legal standards | CIS Azure, NIST SP 800-53, PCI-DSS |
| **Defender Plans (CWPP)** | Active real-time workload protection | Alerts for Containers, Storage, VMs, SQL |
| **Security Recommendations** | Step-by-step hardening guidance | Fix buttons with automated one-click remediation |

> **Tip:** Focus remediation efforts on security controls that yield the highest **Secure Score percentage increase**. Fixing high-impact recommendations (like enabling MFA on administrative accounts) delivers massive immediate risk reduction.

## See it

Query your subscription's real-time Secure Score and list prioritized security recommendations using the Azure CLI:

```bash
# Query the overall subscription Secure Score
az security secure-scores list   --query "[].{name:displayName, currentScore:current, maxScore:max, percentage:percentage}"   --output table

# List active high-severity security recommendations
az security assessment list   --query "[?status.code=='Unhealthy' && resourceDetails.source=='Azure'].{title:displayName, severity:metadata.severity}"   --output table
```

Defender for Cloud evaluates live resource telemetry and provides step-by-step instructions (and automated 'Quick Fix' buttons) to remediate vulnerabilities.

## Go deeper

Defender for Cloud features **Cloud Security Explorer**. This graph-based search engine models your cloud infrastructure as an interconnected attack path graph (e.g., finding all Virtual Machines that have high-severity vulnerabilities, unmanaged public internet exposure, AND write permissions to a production SQL database).

Defender for Cloud integrates with automated remediation using **Workflow Automation**. You can configure rules that automatically trigger Azure Logic Apps when a high-severity security alert is detected, automatically notifying SOC analysts or quarantining compromised resources without human delay.

## Watch out

- Enabling paid Defender workload protection plans (e.g., Defender for Servers) incurs hourly costs per protected resource.
- Secure Score assesses configuration hygiene but does not guarantee immunity from zero-day vulnerabilities or insider threats.

## Remember

- Defender for Cloud unifies Cloud Security Posture Management (CSPM) and Cloud Workload Protection (CWPP).
- Secure Score provides a transparent percentage benchmark of your cloud configuration security hygiene.
- Prioritize remediation tasks that deliver the greatest percentage increase to your organizational Secure Score.
