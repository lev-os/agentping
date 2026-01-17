# @agentping/webhook

> 🔗 **Webhook Adapter** – Send pings to external systems via HTTP webhooks.

## Overview

Generic webhook adapter for integrating AgentPing with custom systems. Send ping events to any HTTP endpoint and receive responses asynchronously.

## 📤 Webhook Payload

When a ping is created:

```json
{
  "event": "ping.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "ping": {
    "id": "abc123",
    "type": "step_approval",
    "payload": { ... },
    "parsedInteraction": { ... }
  },
  "response_url": "https://your-server/api/v1/pings/abc123/respond"
}
```

## 📥 Response Options

1. **Synchronous** – Return response in webhook reply
2. **Async** – POST back to `response_url` later
3. **Ignore** – For notification-only integrations

## ⚙️ Configuration

```json
{
  "webhooks": [
    {
      "url": "https://my-system.com/agentping-hook",
      "events": ["ping.created", "ping.expired"],
      "secret": "your-hmac-secret",
      "filters": {
        "types": ["approval", "step_approval"],
        "agents": ["prod-*"]
      }
    }
  ]
}
```

## 🔒 Security

- HMAC signature verification (`X-AgentPing-Signature`)
- Secret-based authentication
- Event filtering by type/agent

## 📡 Event Types

| Event | Trigger |
|-------|---------|
| `ping.created` | New ping submitted |
| `ping.responded` | Human responded |
| `ping.expired` | Timeout reached |
| `ping.dismissed` | Manually dismissed |

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
