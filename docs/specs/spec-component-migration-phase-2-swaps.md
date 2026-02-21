---
title: "spec-component-migration-phase-2-swaps"
type: spec
entity: "ui-swaps"
stage: crystallized
created: "2026-02-19"
author: "Antigravity"
status: draft
---

# Phase 2: Systematic Swaps, Polish, and Voice Port — Behavioral Specification

## Executive Summary
The final phase. The remaining ~270 components that functionally render undergo Theme Coherence alignment for all **4 themes** (including Light/Dark modes). All legacy import statements are rewritten to `@kingly/ui` via `P3_SWAP_PROTOCOL_V1`. Voice-mode components from `~/clawd/jarvis/` are ported. Chat is upgraded referencing KinglyAssistant. Legacy source deleted.

## Context

### Existing State
- ~270 components pass basic rendering but still use hardcoded utility classes.
- Host apps import from legacy directories.
- Voice components (`JarvisOrb`, `AuroraOrb`, `Waveform`, `VoiceOverlay`, `BottomSheet`, `EntityCard`) live in `~/clawd/jarvis/` and have never been ported to `@kingly/ui`.
- Chat interface needs ChatGPT-like upgrade (reference: `~/k/apps/production/KinglyAssistant`).

### Target State
- Host apps exclusively import from `@kingly/ui` (components) and `@kingly/ui-patterns` (orchestration).
- All components use semantic theme tokens, support 4 themes × 2 modes.
- Voice components ported, themed (primarily LCARS but functional across all themes).
- Chat upgraded to modern conversational UI patterns.
- **NEW `@kingly/ui-patterns` package** with:
  - Typed Zustand stores: `ReviewQueueStore`, `VoiceModeStore`, `ChatStore`, `GenUIStore`
  - Composed hooks: `useReviewQueue`, `useVoiceCommands`, `useGenUI`
  - Compound patterns: `ReviewQueue`, `VoiceMode`, `ChatInterface`
  - Gen-UI types: `Entity`, `VoiceCommand`, `GenUIComponent`, `GenUILayout`
- Legacy source deleted.

## User Scenarios (BDD)

### Scenario 1: Import swap with P3 protocol
```gherkin
Feature: Monolithic UI package with P3 protocol
  As the codebase
  I want all imports consolidated to @kingly/ui

  Scenario: Full swap lifecycle
    Given a component passes functional rendering
    When Theme Coherence Check validates across 4 themes + Light/Dark
    Then Studio imports are rewritten first, Web-UI second
    And `swapped=pass` ONLY after migrated, visual QA, human QA, G1..G12 gates pass
    And evidence is written as a `bd` comment (NOT a sidecar)
```

### Scenario 2: Voice component port
```gherkin
Feature: Voice components in @kingly/ui
  As a developer using @kingly/ui
  I want voice-mode components available as first-class imports

  Scenario: Porting JarvisOrb
    Given JarvisOrb exists in ~/clawd/jarvis/src/components/
    When it is ported to packages/ui/src/components/voice/
    Then it uses semantic theme tokens (primary from LCARS in default, adaptive in other themes)
    And the WebGL AuroraOrb is lazy-loaded with CSSOrb fallback
    And Storybook stories demonstrate it across 4 themes × 2 modes
```

### Scenario 3: Entity review queue pattern
```gherkin
Feature: Codified entity review queue pattern
  As a developer building review workflows
  I want a typed Zustand store + composed hook + compound component
  So that I can wire up approve/deny/skip queues with optional voice control

  Scenario: Using ReviewQueue from @kingly/ui-patterns
    Given I import ReviewQueue from @kingly/ui-patterns
    And I import useReviewQueue hook
    When I pass entities to the store
    Then the compound component renders EntityCards in a swipeable queue
    And I can approve/deny/skip entities via buttons or voice commands
    And the store tracks state transitions with typed actions
    And the component is themed across all 4 themes
```

## Behavioral Specification

### Inputs
- ~270 QA beads with `status:open`
- Phase 0 theme contract
- Phase 1 completed
- Voice components from `~/clawd/jarvis/src/components/`: JarvisOrb, AuroraOrb, Waveform, VoiceOverlay, BottomSheet, EntityCard, AgentPingButton
- Chat reference from `~/k/apps/production/KinglyAssistant`

### Processing (Per Component)
1. **Theme Coherence Check**: Identify origin → strip hardcoded → apply semantic tokens → verify Light/Dark across 4 themes
2. **Best Practices**: Remove inline styles, ensure ARIA labels, fix WCAG contrast, 44px touch targets
3. **P3_SWAP_PROTOCOL_V1 Execution**:
   - **G9**: `rg` to discover import targets
   - **G10**: Rewrite Studio first, Web-UI second
   - **G11**: Runtime smoke — `pnpm typecheck` + Storybook
   - **G12**: Zero legacy imports remaining
4. **Voice Port** (new work):
   - Port `JarvisOrb`, `AuroraOrb`, `Waveform`, `VoiceOverlay`, `BottomSheet`, `EntityCard` to `packages/ui/src/components/voice/` and `packages/ui/src/components/review/`
   - Theme them with semantic tokens (LCARS primary, adaptable to other themes)
   - Port `useVoice` hook to `packages/ui/src/hooks/`
   - Port mobile patterns from `~/clawd/jarvis/src/styles/mobile.css`
5. **Chat Upgrade**:
   - Study `~/k/apps/production/KinglyAssistant` for ChatGPT-like patterns
   - Build chat components in `packages/ui/src/components/chat/`
6. **Create `@kingly/ui-patterns` package** (new work):
   - Initialize `packages/ui-patterns/` with `package.json`, `tsconfig.json`
   - **Typed Zustand stores:**
     - `ReviewQueueStore`: entity list, current index, approve/deny/skip actions, status transitions
     - `VoiceModeStore`: listening state, transcript, last command, command history
     - `ChatStore`: messages array, streaming state, tool call state, message submission
     - `GenUIStore`: dynamic component registry, layout state, component lifecycle
   - **Composed hooks:**
     - `useReviewQueue`: bridges ReviewQueueStore + VoiceModeStore, dispatches approve/deny/skip from voice commands
     - `useVoiceCommands`: maps voice intents to store actions
     - `useGenUI`: dynamic component rendering helpers, layout computation
   - **Compound patterns:**
     - `ReviewQueue.tsx`: EntityCard + queue navigation + optional voice overlay, fully themed
     - `VoiceMode.tsx`: JarvisOrb + VoiceOverlay + BottomSheet, wired with VoiceModeStore
     - `ChatInterface.tsx`: ChatGPT-like chat composed from `@kingly/ui` chat primitives + ChatStore
   - **Types:**
     - `entity.ts`: Entity, EntityAction, EntityStatus, EntityMeta
     - `voice.ts`: VoiceCommand, VoiceIntent, VoiceConfig
     - `gen-ui.ts`: GenUIComponent, GenUILayout, GenUISlot
7. **Bead Update**: Write evidence block in `bd` comment
8. **Delete Legacy Source**: Remove old files

### Outputs
- ~270 pristine components using semantic tokens
- Voice building blocks in `packages/ui/src/components/voice/`
- Chat building blocks in `packages/ui/src/components/chat/`
- Review building blocks in `packages/ui/src/components/review/`
- NEW `@kingly/ui-patterns` package with typed Zustand stores, composed hooks, and compound patterns
- Chat component upgraded to ChatGPT-like quality
- Zero legacy imports in monorepo
- All beads closed with evidence

### Performance
Monorepo size reduction. WebGL orb uses lazy loading. Zustand stores are tree-shakeable.

## Contract

### Dependencies
- Phase 0 + Phase 1 completed and approved
- `@react-three/fiber` + `@react-three/drei` (for AuroraOrb)
- `framer-motion` (for JarvisOrb)
- `zustand` (for `@kingly/ui-patterns` stores)
- Web Speech API (voice mode)

### Integration Points
- `packages/ui` (presentational building blocks)
- `packages/ui-patterns` (orchestration, stores, compound patterns — NEW)
- Every UI-consuming package + voice infrastructure

### Breaking Changes
Massive import path modifications. Voice components are NEW additions. `@kingly/ui-patterns` introduces `zustand` as a peer dependency.

## BD Task Decomposition

### Epic Mapping
| Epic ID | Title | Scope | Success Signal |
|---------|-------|-------|----------------|
| `epic-mig-phase-2` | Swaps, Polish & Voice Port | ~270 components + voice port + chat upgrade | Zero legacy imports, voice components in @kingly/ui |

### Task Breakdown
- ~270 tasks mapped from existing beads
- Additional tasks for voice component port (JarvisOrb, Waveform, VoiceOverlay, etc.)
- Chat upgrade task

### Execution Order
1. Core structural components (Button, Card, Input, Modal)
2. Layout components (Sidebar, TabBar, MenuList)
3. Data display components (StatusDot, Badge, Progress)
4. Voice components (JarvisOrb, Waveform, VoiceOverlay, BottomSheet, EntityCard)
5. Chat upgrade
6. Specialized/leaf components

### Dependency Ordering
MANDATORY: Phase 0 + Phase 1 closed and user-approved.

## Success Criteria
- 100% of 343 components canonicalized with 4-theme support
- Voice building blocks (JarvisOrb, Waveform, VoiceOverlay) ported to `packages/ui/src/components/voice/`
- Chat components ported to `packages/ui/src/components/chat/`
- `@kingly/ui-patterns` package created and published with:
  - 4 typed Zustand stores (ReviewQueue, VoiceMode, Chat, GenUI)
  - 3 composed hooks (useReviewQueue, useVoiceCommands, useGenUI)
  - 3 compound patterns (ReviewQueue, VoiceMode, ChatInterface)
  - Full gen-UI type exports
- Entity review queue codified as a compound pattern with voice control
- Chat upgraded to ChatGPT-like quality
- Zero legacy component/import paths remain
- All `ap-4rs` child beads closed
- Parent epic `ap-4rs` closed

## Rollback Plan
### Rollback Trigger
Mass replacement corrupts source or cascading build failures.
### Rollback Steps
1. `git restore packages/studio/src packages/adapters/web-ui/src`
2. Reopen affected beads
3. Retry in smaller batches
