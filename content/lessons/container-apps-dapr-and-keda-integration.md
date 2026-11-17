---
slug: container-apps-dapr-and-keda-integration
title: "KEDA Event-Driven Scaling and Dapr in Container Apps"
topic: containers-and-microservices
kind: pattern
summary: "Leverage Kubernetes Event-Driven Autoscaling (KEDA) and Distributed Application Runtime (Dapr) without cluster overhead."
tags: [keda, dapr, autoscale, microservices]
related: [azure-container-apps-serverless-containers, azure-functions-event-driven-serverless, vertical-vs-horizontal-autoscale-rules]
---
> **In one line:** Container Apps natively integrates KEDA for event scaling and Dapr for distributed microservice plumbing.

## The idea

Two powerful open-source Cloud Native Computing Foundation (CNCF) technologies are built directly into Azure Container Apps: **KEDA** and **Dapr**.

1. **KEDA (Kubernetes Event-Driven Autoscaling):**
   Standard container scaling only monitors CPU or memory utilization. But a message processing worker might be using only 5% CPU while 50,000 messages accumulate in an Azure Service Bus queue.
   KEDA monitors external **event sources** directly. It can scale your container replicas from 0 to 50 based on:
   - Queue depth in Azure Storage Queues or Azure Service Bus.
   - Incoming HTTP concurrent request rates.
   - Kafka topic partition lag or Redis stream length.
   - Cron time schedules (e.g., scale up to 10 instances every weekday at 8:00 AM).

2. **Dapr (Distributed Application Runtime):**
   A microservices building-block framework. Dapr runs as a lightweight sidecar container alongside your application, exposing simple HTTP/gRPC APIs that handle complex distributed patterns:
   - **Service-to-Service Invocation:** Reliable communication between microservices with built-in mTLS encryption and retries.
   - **State Management:** Save state to Redis or Cosmos DB without writing vendor-specific SDK code.
   - **Pub/Sub Messaging:** Publish and subscribe to events across Azure Service Bus, Kafka, or RabbitMQ using a single unified API.

| Technology | Architectural Problem Solved | Scaling / Integration Mechanism |
|---|---|---|
| **KEDA** | Scaling on business events instead of just CPU | Monitors event sources (Queue depth, HTTP concurrency, Kafka) |
| **Dapr** | Decoupling microservices from vendor SDKs | Sidecar container exposing HTTP/gRPC APIs for state, pub/sub, secrets |

> **Tip:** With Dapr, your microservice code simply posts a JSON payload to `http://localhost:3500/v1.0/publish/orderpubsub/orders`. Dapr handles message serialization, retries, and delivery to Azure Service Bus transparently.

## See it

Configure KEDA queue-based autoscaling on an Azure Container App using the Azure CLI:

```bash
# Configure KEDA autoscale rule to scale out based on Azure Queue message depth
az containerapp update   --name app-orders-api   --resource-group rg-learning-portal   --scale-rule-name "queue-scaler"   --scale-rule-type "azure-queue"   --scale-rule-metadata "queueName=incoming-orders" "queueLength=20"   --scale-rule-auth "connection=storage-connection-secret"   --output table
```

For every 20 messages waiting in `incoming-orders`, KEDA adds one container replica (up to your configured max replicas limit). When the queue is empty, it scales down to zero.

## Go deeper

Dapr provides built-in **Distributed Tracing**. When Service A calls Service B through Dapr, Dapr automatically injects W3C trace-context headers and streams distributed telemetry directly to your Log Analytics workspace, rendering full end-to-end trace maps in Application Insights automatically.

## Watch out

- Ensure the identity connecting KEDA to the event source holds proper read permissions on the queue or streaming topic.
- Dapr sidecars consume a small fraction of memory and CPU; account for sidecar overhead when sizing container resources.

## Remember

- KEDA scales containers dynamically based on external events like queue depth or message streams.
- Dapr provides microservice building blocks for state management, pub/sub, and secure service invocation.
- Both KEDA and Dapr are fully managed and built into Container Apps without requiring Kubernetes expertise.
