# Spec: Dashboard Host Runtime

## Purpose

Define AgentPing’s host/runtime responsibilities as the default surface host for Lev.

## Core Runtime Pieces

- `packages/dashboard-runner`
- `packages/dashboard-manager-server`
- `packages/dashboard-manager-ui`
- `packages/studio`

## Runtime Rule

Dashboard-runner is the canonical process lifecycle authority.

The manager server is the canonical API/control plane.

Browser/UI surfaces must reflect that truth accurately.

## Standalone Rule

AgentPing must remain runnable on its own, with its own runner, server, and UI surfaces, even when Lev is not present.
