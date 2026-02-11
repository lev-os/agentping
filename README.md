# AgentPing

AgentPing is an AI-native interaction protocol: agents emit structured intent, and humans respond through rich action surfaces instead of plain chat.

## What This Product Is

AgentPing is built around one idea:

- Any action surface can be an AgentPing surface.

That includes:

- web apps
- desktop apps
- browser extension surfaces
- mobile surfaces (including iOS/Swift adapters)
- chat channels (Telegram, Slack, Discord)

Chat is supported, but it is not the primary UX model.

## Current State (2026-02-11)

What is working now in this repo:

- Hexagonal core domain (`@agentping/core`) with ports and adapters
- Dashboard runner control plane (`dashboard-runner` + `dashboard-manager-server`)
- Active UI surfaces:
  - Studio Storybook (`:6006`)
  - Sofia/UI-kit Storybook (`:6007`)
  - web-ui (`:5173`)
  - canvas (`:5174`)
  - dashboard-manager-ui (`:5175`)
  - studio web shell (`:5180`)
- Canonical canvas payload is Sofia-first for render pings
- Fail-fast theme contract in Studio/web-ui: `agentping | skynet | syslog` and `light | dark`

Known consolidation gaps:

- Duplicate canvas/renderer logic still exists across packages
- Adapter-owned component trees still exist outside `packages/ui`
- Studio still has embedded dashboard orchestration paths alongside runner/server

## End-State Goals

1. One UI kit (`packages/ui`) as shared source of primitives.
2. One canvas implementation with explicit modes.
3. One dashboard control plane (runner + manager server only).
4. Strict fail-fast config (no hidden theme/mode fallback).
5. Open-source adapter model so new channels are easy to build.

## Immediate Handoff Scope

Current dev handoff focuses on three items:

1. Make Sofia primitives generic (remove aviation/domain-bound naming from canonical shared components).
2. Enforce single component library ownership in `packages/ui`.
3. Execute GenUI upgrades against target architecture while clearly labeling temporary current-state exceptions.

## Open-Source Adapter Vision

The target developer experience:

- install AgentPing core/runtime packages
- implement one adapter contract
- render AgentPing primitives in your surface (browser extension, SwiftUI, Telegram, etc.)
- receive typed action callbacks back to your agent runtime

Design principle:

- strong primitives + typed contracts + deterministic rendering

This is the base needed for voice-driven generative UI where chat is secondary.

## Quick Start (Consolidated Runtime)

```bash
pnpm install
pnpm -r build
pnpm dashboards:kill
pnpm dashboards:start
pnpm dashboards:status
```

In another terminal, run protocol daemon:

```bash
pnpm --filter @agentping/daemon dev
```

## Docs Map

Single handoff file (use this first):

- `/Users/jean-patricksmith/digital/leviathan/community/agentping/docs/architecture.md`

- Product + architecture:
  - `docs/architecture.md`
  - `docs/web-ui-architecture.md`
- Runtime + commands:
  - `docs/getting-started.md`
- Component inventory:
  - `docs/component-catalog.md`
- GenUI research and implementation specs:
  - `docs/genui/readme.md`

## GenUI Relationship

Thesys/C1 reverse-engineering artifacts are promoted into `docs/genui/` as research + implementation inputs.

Important:

- `docs/genui/` contains candidate patterns and design direction.
- Runtime truth and cutover rules are defined in `docs/architecture.md` and `docs/web-ui-architecture.md`.
