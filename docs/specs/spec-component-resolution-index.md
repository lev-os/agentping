# Spec: Component Resolution Index

## Purpose

Define the canonical component resolution path in AgentPing.

## Current Problem

Component resolution currently exists in multiple places:

- component inventory docs
- manual registries
- hardcoded canvas/widget switchboards
- provider-specific catalogs

## Canonical Rule

There must be one canonical resolution index per active provider path.

For the current provider direction, that path should be the provider catalog/registry path, not ad-hoc switch statements.

## Component Source Rule

`packages/ui` is the canonical shared component estate.

Other packages may:

- consume it
- wrap it temporarily
- translate legacy payloads into it

They may not become alternate long-term sources of truth.
