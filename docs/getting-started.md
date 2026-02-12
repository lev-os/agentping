# AgentPing Getting Started (Consolidated Runtime)

This guide reflects the current runtime topology in this repository.

For product definition and target architecture, read:

- `docs/architecture.md`
- `docs/web-ui-architecture.md`
- `docs/genui/readme.md`

## Prerequisites

- Node.js `>=18`
- `pnpm` (workspace package manager)

## Runtime Surfaces (Dashboard Runner Source of Truth)

| id | URL | package |
|---|---|---|
| `agentping` | `http://localhost:6006` | `packages/studio` Storybook |
| `sofia` | `http://localhost:6007` | `packages/ui` Storybook |
| `web-ui` | `http://localhost:5173` | `packages/adapters/web-ui` |
| `canvas` | `http://localhost:5174` | `packages/canvas` |
| `dashboard-manager-ui` | `http://localhost:5175` | `packages/dashboard-manager-ui` |
| `studio` | `http://localhost:5180` | `packages/studio` |

Use `localhost` for UI surfaces in this workspace. Some Vite apps bind localhost/IPv6 and may not answer on `127.0.0.1`.

## 1. Install And Build

```bash
pnpm install
pnpm -r build
```

## 2. Reset Old Dashboard Processes

```bash
pnpm dashboards:kill
```

This kills known legacy dashboard ports and common Next.js dev servers.

## 3. Start Dashboard Control Plane

```bash
pnpm dashboards:start
```

This starts the dashboard manager server on `localhost:3030` and launches surfaces from:
`packages/dashboard-runner/config/dashboards.yaml`

## 4. Verify Dashboard Status

```bash
pnpm dashboards:status
curl -s http://localhost:3030/api/dashboards | jq '.[] | {id, status: .status.status, port: .status.port}'
```

## 5. Start Protocol Daemon (API + Ping Runtime)

In a second terminal:

```bash
pnpm --filter @agentping/daemon dev
```

Daemon endpoints:

- API: `http://localhost:7890/api/v1`
- WebSocket: `ws://localhost:7890/api/v1/ws`

## 6. Start Full Workspace Dev (Optional)

If you want all package dev watchers at once:

```bash
pnpm dev
```

Use this only when you need broad parallel development; it is noisier than runner-managed startup.

## Theme Contract (Fail-Fast)

- Allowed themes: `agentping`, `skynet`, `syslog`
- Allowed modes: `light`, `dark`
- Invalid theme or mode should throw immediately (no fallback selection)

## Quick Ping Smoke Test

```bash
curl -X POST http://localhost:7890/api/v1/pings \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "smoke-agent",
    "agentName": "Smoke Agent",
    "sessionId": "smoke-1",
    "payload": {
      "type": "question",
      "question": "Smoke check?",
      "options": ["yes", "no"]
    }
  }'
```

Then check pending pings:

```bash
curl -s "http://localhost:7890/api/v1/pings"
```
