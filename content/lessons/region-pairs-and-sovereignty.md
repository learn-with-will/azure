---
slug: region-pairs-and-sovereignty
title: "Region Pairs, Non-Paired Regions, and Data Sovereignty"
topic: azure-architecture-and-governance
kind: concept
summary: "Evaluate Azure regional pairs for disaster recovery replication alongside data sovereignty compliance."
tags: [region-pairs, disaster-recovery, replication, compliance]
related: [azure-regions-and-geographies, availability-zones-and-datacenter-resilience, selecting-azure-regions]
---
> **In one line:** Regional pairs link regions within the same geography for prioritized disaster recovery and replication.

## The idea

To survive catastrophic multi-datacenter disasters—such as hurricanes, regional power grid failures, or earthquakes—Azure links regions into **Region Pairs**.

Each regional pair resides within the same geography (at least 300 miles apart) to prevent a single physical disaster from impacting both locations simultaneously, while maintaining data residency inside national boundaries (with Brazil South being a historical exception paired to South Central US).

Key operational benefits of Azure Region Pairs include:
1. **Planned Platform Updates:** Azure never rolls out host updates or hypervisor patches to both paired regions at the same time. One region is updated while the other remains untouched to prevent bad software rollouts from causing global outages.
2. **Prioritized Recovery:** During an unprecedented catastrophic outage affecting multiple regions, Azure prioritizes the primary region in every pair for emergency restoration.
3. **Turnkey Geo-Replication:** Services like Geo-Redundant Storage (GRS) automatically replicate data snapshots to the paired region without custom networking pipelines.

| Primary Region | Paired Disaster Recovery Region | Geography Boundary |
|---|---|---|
| East US | West US | United States |
| North Europe (Ireland) | West Europe (Netherlands) | Europe |
| Southeast Asia (Singapore) | East Asia (Hong Kong) | Asia Pacific |
| UK South (London) | UK West (Cardiff) | United Kingdom |

> **Note:** Microsoft has introduced newer regions without standard regional pairs (such as Qatar Central or Spain Central). For non-paired regions, high availability must be achieved via Availability Zones, or custom cross-region replication must be manually configured.

## See it

Inspect the paired region attribute of your target primary region using the CLI:

```bash
# Query the official paired disaster recovery region for East US
az account list-locations   --query "[?name=='eastus'].{Primary:name, PairedRegion:metadata.pairedRegion[0].name}"   -o table

# Verify storage account geo-replication endpoints targeting the pair
az storage account show   --name stappprod001   --resource-group rg-prod   --query "primaryEndpoints.blob && secondaryEndpoints.blob"   -o json
```

The secondary blob endpoint directs traffic to the paired disaster recovery region automatically if geo-redundancy is enabled.

## Go deeper

Data sovereignty laws (such as GDPR in Europe or HIPAA in the United States) strictly forbid transmitting sensitive personal records across national borders. By keeping regional pairs within the same country or geopolitical jurisdiction, Azure allows healthcare and financial enterprises to meet disaster recovery standards without violating legal data residency requirements.

During simultaneous multi-region incidents, Microsoft prioritizes restoring one region in each pair first. This phased restoration guarantee ensures that organizations architected around paired regions regain application services and database access as quickly as possible following widespread catastrophic regional disruptions.

## Watch out

- Asynchronous geo-replication across region pairs means a small window of uncommitted data can be lost during an ungraceful failover.
- Do not deploy database replicas to a paired region without accounting for cross-region latency in application write paths.

## Remember

- Region pairs are separated by at least 300 miles within the same geography to prevent simultaneous physical disasters.
- Azure updates paired regions sequentially to prevent platform update rollouts from disrupting both locations.
- Newer non-paired regions require Availability Zones or customer-managed cross-region replication strategies.
