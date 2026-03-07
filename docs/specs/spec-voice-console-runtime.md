# Spec: Voice Console Runtime

## Purpose

Define how AgentPing hosts and renders voice-first interaction flows.

## Core Rule

Voice is first-class in AgentPing, not a secondary decoration on top of text UI.

## Responsibilities

AgentPing voice runtime may own:

- voice console surfaces
- transcript and waveform UI
- voice-to-GenUI escalation UX
- user-facing review and approval checkpoints driven from voice interaction

## Relationship To Lev

Lev owns the top-level voice-first product semantics.
AgentPing owns the concrete host/runtime implementation of voice surfaces.
