# Web UI Surface Architecture

This document defines how AgentPing UI surfaces should be organized during consolidation.

## Current State (What Exists Today)

### Runtime Surfaces

- `packages/adapters/web-ui`: agent-facing web app plus adapter-owned gallery/canvas wiring.
- `packages/studio`: Electron shell and renderer; also includes Storybook stories and studio-only components.
- `packages/canvas`: standalone canvas app.
- `packages/dashboard-manager-ui`: dashboard process control UI.
- `packages/ui`: imported Sofia-style shared component package with its own Storybook.

### Control Plane

- External control plane exists via:
  - `packages/dashboard-runner`
  - `packages/dashboard-manager-server`
  - `packages/dashboard-runner/config/dashboards.yaml`
- Studio main process still has embedded dashboard-runner startup logic, creating dual orchestration paths.

### Why `@agentping/web-ui` Is Driving Gallery Today

- Gallery primitives and old Sofia subtree live in `packages/adapters/web-ui/src/components`.
- That package became both:
  - protocol adapter shell
  - UI component host
- Result: adapter owns UI inventory concerns that should live in shared UI kit.

## Ideal State (Production Target)

### 1) Single Shared UI Kit

- `packages/ui` is the only source of reusable components.
- `packages/adapters/web-ui`, `packages/studio`, and `packages/canvas` consume from `packages/ui`.
- Adapter package does not own canonical primitives.

### 2) Single Canvas Package With Modes

- Canonical canvas engine lives in `packages/canvas`.
- Modes are explicit and config-driven (`render`, `inspect`, `compose`).
- Studio and web-ui use canvas APIs, not duplicated renderer forks.

### 3) Single Dashboard Control Plane

- Dashboard lifecycle is managed only by runner + manager server.
- Studio acts as API client.
- No embedded runner bootstrap in Studio steady state.

### 4) Fail-Fast Theme Contract

- Allowed themes: `agentping`, `skynet`, `syslog`.
- Allowed modes: `light`, `dark`.
- Invalid theme or mode throws and blocks startup/config load.
- No hidden fallback theme resolution.

### 5) Two Storybooks, Distinct Purpose

- Storybook A (`agentping`, `:6006`): Studio shell + composition surfaces.
- Storybook B (`sofia`, `:6007`): shared UI kit inventory (`packages/ui`).

### 6) Adapter-First Surface Expansion

- Browser extension becomes a first-class AgentPing output surface.
- Mobile adapters (including iOS/SwiftUI) consume the same primitive + action contracts.
- New surfaces should add adapter packages, not fork core UI logic.

## Package Responsibility Matrix

| Package | Owns | Must Not Own |
|---|---|---|
| `packages/ui` | reusable primitives, tokens, themes, shared patterns | adapter runtime concerns |
| `packages/adapters/web-ui` | ping/session/protocol UX flows | canonical primitive source trees |
| `packages/canvas` | canvas runtime and mode system | app-specific duplicated render contracts |
| `packages/studio` | desktop shell and orchestration UX | process orchestration internals in steady state |
| `packages/dashboard-runner` | process lifecycle and config-driven launches | UI components |
| `packages/dashboard-manager-ui` | dashboard operator UI | component canon |

## Required Consolidation Steps

1. Move or re-export Sofia components into `packages/ui` as canonical source.
2. Replace adapter-owned gallery source usage with `packages/ui` exports.
3. Remove duplicated canvas render/hook implementations outside `packages/canvas`.
4. Remove Studio embedded dashboard boot path after runner/server parity checks.
5. Keep dashboard inventory fully config-driven from `dashboards.yaml`.
6. Define and publish adapter starter contracts for extension + mobile surfaces.

## Validation Checklist

- `pnpm dashboards:kill`
- `pnpm dashboards:start`
- `pnpm dashboards:status`
- `curl -s http://127.0.0.1:3030/api/dashboards | jq`
- Verify `agentping` (`:6006`) and `sofia` (`:6007`) Storybooks are online.
- Verify unknown theme or mode errors immediately instead of fallback rendering.
