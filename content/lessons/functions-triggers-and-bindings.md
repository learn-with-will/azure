---
slug: functions-triggers-and-bindings
title: "Azure Functions Triggers and Bindings"
topic: app-service-and-serverless
kind: api
summary: "Connect functions declaratively to event sources and data targets without writing boilerplate SDK client code."
tags: [triggers, bindings, input-output, serverless]
related: [azure-functions-event-driven-serverless, creating-functions-with-azure-cli, blob-storage-containers-and-tiers]
---
> **In one line:** Triggers invoke functions when events occur; bindings connect data inputs and outputs declaratively.

## The idea

A major source of boilerplate code in cloud applications involves writing connection strings, instantiating SDK client objects, opening network sockets, and serializing payloads. Azure Functions eliminates this through **Triggers and Bindings**:

1. **Trigger:** Defines *how* a function is invoked. A function must have **exactly one trigger**. Examples include:
   - `httpTrigger`: Executes when an HTTP request arrives.
   - `blobTrigger`: Executes when a new file is uploaded to a Blob container.
   - `cosmosDBTrigger`: Executes when documents are inserted or modified in Cosmos DB.
   - `timerTrigger`: Executes on a scheduled cron schedule.
2. **Input Binding:** Declaratively pulls data from an external source into your function as a method parameter without writing manual SDK query code.
3. **Output Binding:** Declaratively pushes return values or output parameters to an external target (e.g., writing a record to Cosmos DB, sending an email via SendGrid, or enqueuing a message).

| Component | Multiplicity | Role | Example |
|---|---|---|---|
| **Trigger** | Exactly one | Starts execution | Blob uploaded to container |
| **Input Binding** | Zero or more | Fetches contextual data | Reads customer record from Cosmos DB |
| **Output Binding** | Zero or more | Writes processed data | Emits notification message to Queue |

> **Tip:** Using bindings decouples application code from underlying infrastructure SDKs, simplifying automated unit testing and mocking.

## See it

Notice how clean a function's code becomes when using declarative bindings in Python or Node.js. The function receives the blob payload directly as a parameter and writes to a queue via return value:

```json
{
  "bindings": [
    {
      "name": "myBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "incoming-images/{name}",
      "connection": "AzureWebJobsStorage"
    },
    {
      "name": "outputQueueItem",
      "type": "queue",
      "direction": "out",
      "queueName": "processed-images",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

When a user uploads a photo to `incoming-images`, Azure automatically triggers the function, passes the photo bytes into `myBlob`, and automatically delivers the function output to the `processed-images` queue.

## Go deeper

In modern isolated-worker .NET and Python v2 programming models, triggers and bindings are declared using native language **decorators / attributes** directly above the function signature in code, removing the need for separate `function.json` metadata files while preserving full type safety.

## Watch out

- Never configure more than one trigger on a single function; Azure Functions strictly mandates exactly one trigger per function.
- High-frequency triggers (like processing millions of stream events) require tuning batch sizes in `host.json` to avoid function throttling.

## Remember

- A trigger defines what starts a function; every function must have exactly one trigger.
- Input and output bindings declaratively read and write data without manual SDK connection code.
- Bindings eliminate boilerplate connection logic and streamline automated unit testing.
