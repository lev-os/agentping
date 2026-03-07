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

## Current Direction

Current implementation work is moving toward:

- one canonical host path
- one canonical provider path
- legacy translator paths for Sofia widgets / polymorph / ad-hoc registries
