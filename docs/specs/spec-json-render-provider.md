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

It does not define the abstract UI contract. It is a provider choice beneath that contract.

## Canonical Local Entry

Current local direction:

- `packages/adapters/web-ui/src/catalog.tsx`

This path should become the canonical component resolution index for the provider experiment, replacing stale `0.2.x` assumptions and reducing parallel resolution logic.

Related current-slice seams:

- `packages/adapters/web-ui/src/lib/host-envelope.ts`
- `packages/adapters/web-ui/src/components/canvas/envelope.ts`

## Current Provider Input

For this batch, `json-render` should receive only provider-appropriate material:

- provider primitives from `packages/ui`
- stable composite recipes that are explicitly classified as provider-safe
- normalized host-envelope data passed through an adapter boundary

It should not directly absorb:

- host shell chrome
- dashboard-manager operator widgets
- studio-only navigator/terminal/voice shells
- raw legacy `sofia-widget` payload contracts

## Protocol Separation

`json-render` is not:

- AG-UI
- MCP Apps
- WebMCP

Those are transport or host integration protocols that may carry or embed provider-rendered surfaces.

Rule:

- one provider can be used with multiple protocols
- one protocol can host multiple providers

## Component Source Rule

The current provider palette should be sourced from:

- `packages/ui`
- the active classification rules in `docs/specs/spec-component-resolution-index.md`

The provider must not invent a parallel long-term component estate inside `packages/adapters/web-ui`.

## Current Gaps

Known current-slice gaps:

- the compare path exists, but not all live surfaces mount through it yet
- `canvas` still relies on translator behavior for legacy contracts
- `studio` still has runtime-truth gaps before it can be considered a clean provider host
- manual React resolution still exists in `packages/adapters/web-ui/src/renderers.tsx`
- live runtime handling still bypasses the provider boundary in parts of `packages/adapters/web-ui/src/hooks/useAgentPing.ts`

## Non-Goals

This provider does not own:

- Lev shell/layout/policy
- the abstract IR
- standalone host policy
- AG-UI event protocol
- MCP Apps packaging
- WebMCP browser transport

## Acceptance For `lev-rch`

The provider/protocol fit is acceptable for the current slice when:

- `json-render` is described as one provider beneath `LevUI IR`
- provider inputs are constrained by the component classification rules
- protocol concerns are documented as separate host/transport concerns
