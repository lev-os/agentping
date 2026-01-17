# Architecture

> Detailed technical architecture of AgentPing v2

## Overview

AgentPing uses **Hexagonal Architecture** (Ports & Adapters) to keep the core domain logic completely decoupled from external concerns like HTTP frameworks, databases, and UI libraries.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            OUTPUT ADAPTERS                                  │
│                     (where humans see & respond)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│   Web UI        Slack App      Discord Bot      VS Code      Webhook        │
└───────────────────────────────────▲─────────────────────────────────────────┘
                                    │
                                    │ Output Port: INotificationChannel
                                    │
┌───────────────────────┐     ┌─────┴──────────────────┐     ┌────────────────┐
│    INPUT ADAPTERS     │     │                        │     │    PARSERS     │
│                       │     │     CORE DOMAIN        │     │                │
│  • CLI Tool           │────▶│                        │────▶│ • StepApproval │
│  • HTTP API           │     │  • PingService         │     │ • Research     │
│  • MCP Server         │     │  • Domain Models       │     │ • Selection    │
│  • WebSocket          │◀────│  • Event Bus           │◀────│ • CodeReview   │
│                       │     │                        │     │                │
└───────────────────────┘     └──────────┬─────────────┘     └────────────────┘
                                         │
                                         │ Storage Port: IPingStore
                                         │
                              ┌──────────▼─────────────┐
                              │    STORAGE ADAPTERS    │
                              │                        │
                              │  • SQLite (sql.js)     │
                              │  • PostgreSQL (todo)   │
                              │  • In-Memory (testing) │
                              └────────────────────────┘
```

## Core Domain

The core domain (`@agentping/core`) has **zero external dependencies**. It defines:

### Domain Models

| Model | Purpose |
|-------|---------|
| `Ping` | The fundamental unit of agent-human communication |
| `HumanResponse` | Structured response with enrichments |
| `ParsedInteraction` | UI hints produced by parsers |
| `Directive` | Quick actions ("focus on...", "skip...") |

### Ports (Interfaces)

| Port | Direction | Purpose |
|------|-----------|---------|
| `IPingSubmitter` | Input | How pings enter the system |
| `INotificationChannel` | Output | How humans get notified |
| `IPingStore` | Storage | Persistence abstraction |
| `IInteractionParser` | Parser | Turn payloads → UI hints |
| `IEventBus` | Events | Internal communication |

### Services

| Service | Responsibility |
|---------|----------------|
| `PingService` | Orchestrates ping lifecycle |
| `ResponseRouter` | Routes responses to agents |

## Data Flow

### 1. Creating a Ping

```
Agent (CLI/MCP/HTTP)
    │
    ▼
Input Adapter → validates & transforms
    │
    ▼
PingService.submitPing()
    │
    ├─▶ Parser transforms payload → ParsedInteraction
    │
    ├─▶ Store.save() → persists to database
    │
    ├─▶ EventBus.emit('ping:created')
    │
    └─▶ NotificationChannels.notify() → Web UI, Slack, etc.
```

### 2. Responding to a Ping

```
Human (Web UI / Slack / CLI)
    │
    ▼
Output Adapter → validates response
    │
    ▼
PingService.respond()
    │
    ├─▶ Store.update() → updates status to 'responded'
    │
    ├─▶ EventBus.emit('ping:responded')
    │
    └─▶ Long-poll waiters receive response
            │
            ▼
        Agent receives structured response
```

## Ping Lifecycle

```
┌──────────┐      ┌───────────┐      ┌───────────┐
│ PENDING  │─────▶│ RESPONDED │      │  EXPIRED  │
└──────────┘      └───────────┘      └───────────┘
     │                                     ▲
     │            ┌───────────┐            │
     └───────────▶│ DISMISSED │────────────┘
                  └───────────┘
```

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting human response |
| `responded` | Human provided response |
| `expired` | Timeout reached with no response |
| `dismissed` | Manually dismissed without action |

## Package Dependencies

```
@agentping/daemon (entry point)
    │
    ├── @agentping/core (domain logic)
    │       │
    │       └── zero external dependencies
    │
    ├── @agentping/http-api (REST/WS adapter)
    │       │
    │       └── hono, @agentping/core
    │
    ├── @agentping/storage-sqlite (persistence)
    │       │
    │       └── sql.js, @agentping/core
    │
    └── @agentping/web-ui (React UI)
            │
            └── react, vite
```

## Design Decisions

### Why Hexagonal Architecture?

1. **Testability**: Core logic can be tested without HTTP/database
2. **Flexibility**: Swap adapters without changing business logic
3. **Clarity**: Clear boundaries between layers

### Why sql.js over native SQLite?

1. **No native bindings**: Works everywhere without compilation
2. **Portable**: Same code runs in Node, Bun, Edge
3. **Simple deployment**: Single JavaScript bundle

### Why Hono for HTTP?

1. **Lightweight**: Minimal dependencies
2. **Universal**: Runs on Node, Bun, Deno, Cloudflare Workers
3. **Type-safe**: First-class TypeScript support

---

<p align="center">
  Built by <a href="https://github.com/Kingly-Agency">Kingly Agency</a>
</p>
