# @agentping/http-api

> 🌐 **HTTP API** – REST and WebSocket adapter for AgentPing.

## Overview

This package exposes the AgentPing core via HTTP REST endpoints and WebSocket for real-time events. Built with [Hono](https://hono.dev) for lightweight, portable HTTP handling.

## 🔌 Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/pings` | Create a new ping |
| `GET` | `/api/v1/pings/:id` | Get ping status |
| `GET` | `/api/v1/pings/:id/wait` | Long-poll for response |
| `POST` | `/api/v1/pings/:id/respond` | Submit human response |
| `GET` | `/api/v1/pings` | List pending pings |

### WebSocket

```
WS /api/v1/ws
```

**Events:**
- `ping:created` – New ping received
- `ping:responded` – Human responded
- `ping:expired` – Ping timed out

## 🚀 Usage

```typescript
import { createHttpAdapter } from '@agentping/http-api';
import { PingService } from '@agentping/core';

const adapter = createHttpAdapter(pingService);
export default adapter; // Works with Hono/Bun/Node
```

## 📦 Features

- ✅ Zod request validation
- ✅ Long-polling support
- ✅ WebSocket real-time events
- ✅ CORS configuration
- ✅ Graceful error handling

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
