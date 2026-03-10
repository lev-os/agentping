# Spec: AgentPing `LevUI IR` Adapter

## Purpose

Define how AgentPing consumes `LevUI IR` without owning or redefining it.

## Ownership

Lev owns:

- `LevUI IR`
- abstract host/provider/transport boundaries

AgentPing owns:

- how its hosts consume that IR
- how local runtime paths translate into it

## Adapter Responsibilities

The AgentPing adapter layer must:

- accept `LevUI IR`-compatible surface descriptions
- map them into the selected local provider/runtime
- preserve typed actions and state feedback back into the interaction layer
- keep provider, host, and transport responsibilities separated

## Current Slice Boundary

For the current host-envelope slice, AgentPing consumes `LevUI IR` through three local layers:

1. host-owned surfaces
2. provider adapters
3. transport adapters

These layers are related, but they are not the same interface.

## Local Layer Model

### 1. Host Layer

Host-owned responsibilities:

- dashboard runner surface lifecycle
- manager/operator truth
- canvas and studio mounting
- shell chrome, approval shells, voice shells, diagnostics
- local host-envelope normalization

Current concrete seam:

- `packages/adapters/web-ui/src/lib/host-envelope.ts`

### 2. Provider Layer

Provider-owned responsibilities:

- compile or render the local surface spec
- expose a bounded component catalog/registry
- manage provider-local state and actions
- degrade gracefully when a surface shape exceeds provider support

Current concrete provider direction:

- `json-render`

Possible future providers:

- `a2ui`
- direct React
- other GenUI runtimes

### 3. Transport Layer

Transport-owned responsibilities:

- carry events, actions, and updates across process or host boundaries
- package surfaces for specific embedding/runtime environments
- stream patches or host callbacks

Current protocol family examples:

- AG-UI
- MCP Apps
- WebMCP

Rule:

- protocols are orthogonal to providers
- the same provider may be used over multiple transports
- the same transport may carry surfaces rendered by different providers

## Many-To-Many Rule

AgentPing must not model provider and transport boundaries as a 1:1 pairing.

Good:

- `LevUI IR` -> AgentPing host envelope -> `json-render` provider -> AG-UI transport
- `LevUI IR` -> AgentPing host envelope -> `json-render` provider -> MCP Apps host
- `LevUI IR` -> AgentPing host envelope -> `a2ui` provider -> WebMCP transport

Bad:

- "AG-UI is the provider"
- "MCP Apps is the component model"
- "A2UI is the abstract contract"

## Current Direction

Current implementation work is moving toward:

- one canonical host path
- one canonical provider path
- legacy translator paths for Sofia widgets / polymorph / ad-hoc registries

For this batch, the working path is:

`LevUI IR` -> local host envelope -> provider-specific catalog/registry -> host action channel

That direction is still incomplete in code. The current local host envelope exists, but it is still entering the system through the canvas lane first rather than through every active host surface.

## Current Entry Points

- host envelope: `packages/adapters/web-ui/src/lib/host-envelope.ts`
- legacy translator: `packages/adapters/web-ui/src/components/canvas/envelope.ts`
- current provider catalog: `packages/adapters/web-ui/src/catalog.tsx`

Parallel systems still present:

- `packages/adapters/web-ui/src/renderers.tsx`
- host-local surface logic in `packages/adapters/web-ui/src/App.tsx`
- direct legacy runtime handling in `packages/adapters/web-ui/src/hooks/useAgentPing.ts`

## Non-Goals

This adapter spec does not:

- redefine `LevUI IR`
- force all AgentPing host surfaces through one provider immediately
- collapse AG-UI, MCP Apps, or WebMCP into provider concerns
- declare `a2ui` or `json-render` as the abstract root contract

## Acceptance For `lev-rch`

`lev-rch` is complete when:

- the local host-envelope boundary is clearly below `LevUI IR`
- provider and transport ownership are separated in writing
- the current `json-render` path is defined as a provider choice, not the architecture itself
