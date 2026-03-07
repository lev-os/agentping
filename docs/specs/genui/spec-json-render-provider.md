# Spec: AgentPing `json-render` Provider

## Purpose

Define the current concrete GenUI provider path in AgentPing.

## Provider Role

`json-render` is the first concrete provider/runtime below the abstract `LevUI IR` boundary.

It currently covers:

- catalog-driven composition
- spec validation
- state and action handling
- progressive/patch-capable rendering model

## Canonical Local Entry

Current local direction:

- `packages/adapters/web-ui/src/catalog.tsx`

This path should become the canonical component resolution index for the provider experiment, replacing stale `0.2.x` assumptions and reducing parallel resolution logic.

## Non-Goals

This provider does not own:

- Lev shell/layout/policy
- the abstract IR
- standalone host policy
