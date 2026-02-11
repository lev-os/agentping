# Architecture

> Detailed technical architecture of AgentPing v2

## Overview

AgentPing uses **Hexagonal Architecture** (Ports & Adapters) to keep the core domain logic completely decoupled from external concerns like HTTP frameworks, databases, and UI libraries.

### Situation Report (2026-02-11)

This section documents **actual current state** and **target state** for dashboard/canvas/UI consolidation.

#### Current Runtime Topology

Runtime surfaces are declared in `packages/dashboard-runner/config/dashboards.yaml` and currently include:

- `agentping` (Studio Storybook)
- `sofia` (local `packages/ui` Storybook)
- `web-ui`
- `canvas`
- `dashboard-manager-ui`
- `studio`

Runtime stack components:

- `@lev-os/dashboard-runner`: process lifecycle, port allocation, health, restart policy
- `@lev-os/dashboard-manager-server`: REST/WebSocket API (`/api/dashboards`)
- Studio renderer navigator: consumes dashboard-manager API

Important current-state caveat:

- Studio also starts an embedded dashboard manager + embedded API server in Electron main process.
- This means two valid control-plane entrypoints exist in practice: external runner/server via root scripts, and embedded runner/server via Studio startup.

#### Why `@agentping/web-ui` Is Driving the Gallery Today

`@agentping/web-ui` is currently a hybrid package:

- adapter runtime for pings
- gallery host (`AppView` includes `gallery`)
- canvas preview host (`AppView` includes `studio`)

`PrimitivesGallery` and the Sofia gallery section still live under `packages/adapters/web-ui/src/components`, so adapter code owns UI-catalog behavior instead of a dedicated first-class UI kit package.

#### Current Architecture Gaps

- Multiple canvas implementations/surfaces exist at once:
  - `packages/canvas` app
  - web-ui "studio" view canvas renderer
  - Studio design canvas (`CanvasWorkspace`)

- Canvas render contract is Sofia-first and strict at core schema level, but renderer/hook code is duplicated between packages.

- Theme contract is mostly fail-fast (`agentping | skynet | syslog`, `dark | light`) in Studio/web-ui, but legacy polymorph theme variants still exist in web-ui (`terminal-swiss`, `system`) with fallback behavior.

- `packages/ui` (Sofia import) now exists locally, but is not yet the sole source for all shared components consumed by Studio/web-ui/canvas.

#### Ideal Future State (Production Target)

1. One UI kit package.
`packages/ui` is the only reusable component library, and adapter-owned component trees are not the source of record.

2. One canvas implementation with modes.
Modes are `render`, `inspect`, `compose`; Studio and web-ui consume the same canvas package APIs.

3. One dashboard control plane.
Dashboard lifecycle is managed only through runner + manager server; Studio is a client of the dashboard API, not a second orchestrator.

4. Strict fail-fast theming everywhere.
Allowed themes are `agentping`, `skynet`, `syslog`; allowed modes are `light`, `dark`; invalid theme/mode must hard fail (no fallback resolution).

5. Showcase model.
Storybook #1 is the unified component kit (`packages/ui`) with full inventory; Storybook #2 is Studio shell/components only; runtime gallery surfaces render from shared UI-kit exports, not duplicated adapter copies.

### Package Migration Map

| Package | Keep | Move In | Move Out | Remove/Deprecate | Temporary Compatibility |
|---|---|---|---|---|---|
| `packages/ui` | Canonical shared component kit | Sofia primitives, merged AgentPing primitives, tokens/themes | none (becomes source) | n/a | Keep old import aliases for one cutover window |
| `packages/adapters/web-ui` | Adapter shell for queue/history/review flows | UI-kit consumption (`@kingly/ui` or renamed internal package) | `components/sofia`, gallery ownership, duplicated canvas renderer/hook | adapter-local component ownership | Temporary wrapper exports that re-export from `packages/ui` |
| `packages/canvas` | Canonical canvas app + mode system | shared renderer contracts and mode controllers | none | duplicate render logic outside package | Accept canonical payload only; reject legacy shapes |
| `packages/studio` | Desktop shell + orchestration UX | dashboard API client, shared UI-kit usage, canvas mode integrations | embedded dashboard-runner bootstrapping | local runner startup path in Electron main | Keep `/navigator` route alias to `/dashboards` during transition |
| `packages/dashboard-runner` | process manager | none | none | none | n/a |
| `packages/dashboard-manager-server` | single dashboard API | none | none | none | n/a |
| `packages/dashboard-manager-ui` | ops/admin UI for dashboard runtime | none | none | none | n/a |

### Hard Cutover Rules

1. Do not allow package-local component forks once a component exists in `packages/ui`.
2. Do not allow runtime theme fallback to unregistered names.
3. Do not allow multiple dashboard orchestration entrypoints in steady state.
4. Do not allow non-canonical canvas payload contracts in production mode.

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
@agentping/studio (desktop shell)
    │
    ├── @lev-os/dashboard-runner (process control)
    │
    ├── @lev-os/dashboard-manager-server (dashboard API)
    │
    └── @kingly/ui (target shared kit; currently partial adoption)
            │
            ├── studio renderer
            ├── web-ui adapter
            └── canvas

@agentping/daemon (entry point for protocol runtime)
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
    └── @agentping/web-ui (React adapter shell)
            │
            └── react, vite, @agentping/core
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
