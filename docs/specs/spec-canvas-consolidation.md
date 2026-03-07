# Spec: Canvas Consolidation

## Purpose

Define the convergence path for AgentPing’s current multiple canvas/runtime surfaces.

## Current Surfaces

Runner-managed surfaces include:

- `web-ui`
- `canvas`
- `studio`
- `dashboard-manager-ui`

## Problem

Process health and UI truth are currently divergent.

Examples observed:

- manager API can report live dashboards while the manager UI shows none
- canvas can be online as a process while disconnected in the browser
- studio shell can render while adapters remain offline

## Consolidation Rule

AgentPing should converge toward:

- one canonical host path for GenUI surfaces
- one canonical provider path
- legacy translators for older payload contracts

`CanvasRenderer`-style hardcoded widget switching should be transitional, not the end-state architecture.
