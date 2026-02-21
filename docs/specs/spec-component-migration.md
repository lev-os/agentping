---
title: "spec-component-migration"
type: spec
entity: "ui-components"
stage: crystallized
created: "2026-02-19"
author: "Antigravity"
status: draft
---

# UI Component Migration (Top-Level) — Behavioral Specification

## Executive Summary
This spec defines the top-level strategy and operating manual for migrating 343 UI components into an integrated, multi-themed UI system. Components will be mapped and styled to support **four** distinct themes (`agentping`, `lev/canvas`, `sofia`, and `lcars`). This is a long-range task decomposed into a series of specs per human-gated phase. We do NOT generically merge styles — we combine/choose the best **functionality** and then ensure we have full aesthetic support for all 4 themes.

## Context

### Existing State
- **343 components** tracked under epic `ap-4rs` in `.beads/issues.jsonl`.
- **69 actionable FAIL** components (js-crash, HOLLOW stubs, console errors).
- **54 structural debt** items (38 SHELL + 16 HOLLOW).
- Components use hardcoded classes (`bg-zinc-900`, `text-slate-400`, inline styles) preventing dynamic theming and breaking Light Mode.
- Previous QA passes (PASS2.5 / PASS5) verified basic rendering only — **zero checks** for light/dark mode, theming coherence, or CSS best practices.
- Legacy components lack consistent ARIA labels, keyboard focus, and WCAG contrast adherence.

### The 4 Existing Theme Sources (Already in Codebase)

| Theme | Source File(s) | Aesthetic | Key Traits |
|-------|---------------|-----------|------------|
| **agentping** | `adapters/web-ui/src/styles/tokens.css` | Cyber-premium, shadcn-compatible | Inter font, `#00e5ff` cyan primary, rounded corners (4-16px), full Light+Dark parity, glass effects, shadcn variable aliases |
| **lev/canvas** | `canvas/src/styles/tokens.css` | Glassmorphism, minimal | Inter + JetBrains Mono, `#00e5ff` primary, glass-panel backdrop blur, smooth radii (6-24px), dark-only currently |
| **sofia** | `adapters/web-ui/src/styles/theme-sofia.css` + `ui/src/theme/skynet.css` | Cyberpunk/military tactical | Orbitron headings, Rajdhani body, 0px radius, cut-corner clip-path panels, glow/scanline effects, grid patterns, dark-only currently |
| **lcars** | `adapters/web-ui/src/styles/lcars.css` + `~/clawd/jarvis/` prior art | Star Trek tactical + Jarvis voice mode | Antonio/Orbitron fonts, `#99ccff` blue/`#ff9900` orange/`#cc99ff` lavender, 40px elbow radii, pill-shaped end-caps, flat surfaces (no glass), container-query responsive, voice-first mobile-optimized, entity review queue |

### LCARS/Jarvis Deep Context
The LCARS theme rolls together multiple prior art sources:
- **`lcars.css`** (331 lines): Full Star Trek TNG/Picard/Nemesis color palette, elbow geometry, stripe widths, container queries for 5 breakpoints, `data-theme="lcars"`
- **`~/clawd/jarvis/`**: Voice-first Jarvis dashboard with entity review queue, `JarvisOrb` (CSS + WebGL Aurora), `Waveform` component (bars/wave/circle/pulse modes), `VoiceOverlay`, `BottomSheet`, `EntityCard`
- **`~/clawd/jarvis/src/styles/mobile.css`**: Mobile-first responsive patterns (touch-friendly 44px tap targets, bottom sheets, landscape handling)
- **KinglyAssistant** (`~/k/apps/production/KinglyAssistant`): reference implementation for ChatGPT-like chat interface upgrade
- **The "good" Jarvis**: The subtle, smooth light purple aesthetic with voice optimization and entity review queue (NOT the ugly one). Referenced in `~/.openclaw/media/browser/` screenshots.
- Components to port: `JarvisOrb`, `AuroraOrb` (WebGL), `Waveform`, `VoiceOverlay`, `BottomSheet`, `EntityCard`, `AgentPing` button

### Target State
A canonical set of UI components in `@kingly/ui`. Each component:
1. **Functionally**: Uses the best implementation among competing variants. We fix/polish broken variants — we do NOT delete functionality.
2. **Aesthetically**: Dynamically adopts the active theme's tokens via CSS variables.
3. **Structurally Theme-Aware**: Themes can change component **geometry and effects**, not just colors:
   - **Sofia**: Cut-corner `clip-path`, glow/scanline effects, 0px radius
   - **Agentping**: Glass morphism panels, neon glow hover states, subtle radii
   - **Canvas**: Backdrop-blur glass panels, smooth generous radii, minimal effects
   - **LCARS**: Elbow radii (40px), pill-shaped end-caps, thick colored horizontal stripes, flat surfaces
   - Token-only (colors/spacing) where structural variation doesn't apply.
4. **Mode Support**: All 4 themes support explicit Light AND Dark modes.
5. **Voice Mode**: LCARS theme drives voice-mode components (JarvisOrb, Waveform, VoiceOverlay) and the chat must be upgraded to ChatGPT-like quality (reference: KinglyAssistant).
6. **Accessibility**: ARIA roles, labels, keyboard focus, WCAG AA contrast ratios.

### Package Architecture
The migration produces a multi-package system. Components live in `@kingly/ui`, but app-level orchestration patterns (review queues, voice mode, gen-UI state) live in a sibling package for clean separation:

```
packages/
├── ui/                          # @kingly/ui — Presentational components
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Canonical themed components (Button, Card, Input...)
│   │   │   ├── voice/           # JarvisOrb, AuroraOrb, Waveform, VoiceOverlay
│   │   │   ├── chat/            # ChatGPT-like chat components
│   │   │   └── review/          # EntityCard, ReviewQueueItem (building blocks)
│   │   ├── hooks/               # useVoice, useTheme (presentational hooks)
│   │   ├── theme/               # skynet.css, unified globals, theme switcher
│   │   └── stories/             # Storybook stories + ThemeMatrix
│   └── package.json
│
├── ui-patterns/                 # @kingly/ui-patterns — App-level orchestration (NEW)
│   ├── src/
│   │   ├── stores/              # Typed Zustand stores
│   │   │   ├── review-queue.ts  # ReviewQueueStore (entities, approve/deny/skip state machine)
│   │   │   ├── voice-mode.ts    # VoiceModeStore (listening state, last command, transcript)
│   │   │   ├── chat.ts          # ChatStore (messages, streaming, tool calls)
│   │   │   └── gen-ui.ts        # GenUIStore (dynamic component rendering, layout state)
│   │   ├── hooks/               # Composed hooks bridging stores → components
│   │   │   ├── useReviewQueue.ts # ReviewQueue orchestration (approve/deny/skip + voice dispatch)
│   │   │   ├── useVoiceCommands.ts # Voice command → store action mapping
│   │   │   └── useGenUI.ts      # Gen-UI rendering helpers
│   │   ├── patterns/            # Composed patterns
│   │   │   ├── ReviewQueue.tsx   # Full ReviewQueue compound component (EntityCard + queue + voice)
│   │   │   ├── VoiceMode.tsx     # VoiceOverlay + BottomSheet + Orb wired together
│   │   │   └── ChatInterface.tsx # ChatGPT-like chat composed from ui primitives
│   │   └── types/               # Shared types for gen-UI
│   │       ├── entity.ts        # Entity, EntityAction, EntityStatus
│   │       ├── voice.ts         # VoiceCommand, VoiceIntent
│   │       └── gen-ui.ts        # GenUIComponent, GenUILayout
│   └── package.json
│
├── studio/                      # Consumer
├── adapters/web-ui/             # Consumer
└── canvas/                      # DEPRECATED
```

**Key Design Decisions:**
- `@kingly/ui` is purely presentational. No Zustand, no orchestration logic. Just themed React components + presentational hooks.
- `@kingly/ui-patterns` is the orchestration layer. It exports typed Zustand stores, composed hooks, and compound pattern components. Apps import from here for wired-up experiences.
- Both packages are consumers of the unified theme contract (CSS variables).
- The EntityReviewQueue pattern is codified as: individual building blocks in `@kingly/ui` + composed pattern + store in `@kingly/ui-patterns`.

### Operating Manual: Theme Coherence Effort (Per-Component)
When processing ANY component (in any phase), the agent MUST:
1. **Identify origin**: Which of the 4 themes does this component historically belong to?
2. **Ensure token support**: Verify the global CSS has aesthetic tokens for this component type across all 4 themes.
3. **Assess structural variation**: Does this component warrant theme-specific geometry? (e.g., Card → sofia clip-path, agentping glass, canvas blur, lcars elbow. StatusDot → token-only.)
4. **Implement structural variants**: Use `[data-theme]` selectors to apply structural changes.
5. **Clean up**: Remove hardcoded classes/inline styles → replace with semantic variables.
6. **Light mode**: Ensure the component renders correctly in both Light and Dark for all themes.
7. **Track**: Update the `bd` bead with evidence (NO CSV/TXT sidecars).

## User Scenarios (BDD)

### Scenario 1: Theme switching
```gherkin
Feature: Multi-theme component rendering
  As a developer building across different apps (Studio, Sofia, Canvas, LCARS)
  I want a single canonical component library
  So that I can use the identical functional component but render it in my app's specific aesthetic theme

  Scenario: Switching application themes
    Given a Button component is imported from `@kingly/ui`
    When rendered in `lcars` theme
    Then it uses Antonio font, pill-shaped end-caps, thick colored borders, snappy transitions
    And differs from `sofia` (sharp edges, Orbitron, glow) and `agentping` (glass, Inter, soft radii)
```

### Scenario 2: Voice mode via LCARS
```gherkin
Feature: Voice-first LCARS experience
  As a user on mobile
  I want voice commands to control the entity review queue
  So that I can approve/deny/skip hands-free

  Scenario: Activating voice mode
    Given the app is in `lcars` theme on mobile
    When the user taps the JarvisOrb
    Then the VoiceOverlay appears with waveform visualization
    And voice commands ("approve", "deny", "next") control the entity queue
```

### Scenario 3: Functional best-of-breed
```gherkin
Feature: Functional variant selection
  As a developer
  I want the best functional implementation of each component
  So that broken or incomplete variants are replaced with polished ones

  Scenario: Loading indicator
    Given there are two Spinner variants: one static (broken), one with 3-dots animation (working)
    When the component is canonicalized
    Then we pick the 3-dots animation as canonical
    And we also fix/polish the static variant so both styles are available
    And both support the 4 themes
```

## Behavioral Specification

### Inputs
- Source components from `adapters/web-ui`, `packages/studio/src`, `packages/ui/src/components/migrations`
- Voice components from `~/clawd/jarvis/src/components/`
- Chat reference from `~/k/apps/production/KinglyAssistant`
- Theme CSS files (see table above)
- `ap-4rs` Beads database

### Processing
1. **Beads-Only Tracking**: All progress via `bd` comments with `P3_SWAP_PROTOCOL_V1`. No sidecars.
2. **Combine Functionality**: Pick best functional variant. Fix/polish all variants. Do NOT blindly delete.
3. **Theme Coherence Check**: Per-component (see Operating Manual).
4. **Voice Components**: Port JarvisOrb, Waveform, VoiceOverlay, BottomSheet, EntityCard from `~/clawd/jarvis/` to `@kingly/ui`.
5. **Chat Upgrade**: Reference KinglyAssistant for ChatGPT-like chat patterns.
6. **ADA Compliance**: ARIA properties, semantic HTML, WCAG AA contrast, 44px touch targets.
7. **Human Gating**: Strict phase boundaries with explicit User approval.

### Outputs
- Canonical components in `packages/ui/src/components/ui/`
- Voice components in `packages/ui/src/components/voice/` and `packages/ui/src/components/chat/`
- Updated Storybook stories across all 4 themes × 2 modes (8 visual states per component)
- NEW `@kingly/ui-patterns` package with typed Zustand stores, composed hooks, and compound patterns (ReviewQueue, VoiceMode, ChatInterface)
- Deprecated legacy components safely removed

### Performance
CSS variables = zero runtime JS cost. WebGL orb uses lazy loading with CSS fallback.

## Contract

### Dependencies
- TailwindCSS v4 (`@theme inline`)
- Radix UI primitives
- `next-themes` / `data-theme` attribute switching
- `@react-three/fiber` + `@react-three/drei` (for AuroraOrb WebGL)
- `framer-motion` (for JarvisOrb animations)
- `zustand` (for `@kingly/ui-patterns` stores)
- Web Speech API (voice mode)
- `bd` tracking

### Integration Points
- `packages/ui` (Presentational components)
- `packages/ui-patterns` (Orchestration — NEW)
- `packages/studio/src` (Consumer)
- `packages/adapters/web-ui` (Consumer)
- `packages/canvas/src` (Consumer — DEPRECATED)

### Breaking Changes
Direct utility classes stripped. Theme variable contract replaces all hardcoded values. LCARS elbow geometry requires structural CSS selectors. New `@kingly/ui-patterns` package introduces Zustand as a peer dependency for consuming apps.

## Implementation Guidance

### Workstreams
- **Phase 0 (Foundation)**: Build 4 theme CSS tokens + POC components + Storybook theme switcher + 8-up matrix
- **Phase 1 (Fixing Fails)**: Fix 69 failed + 54 structural debt components, applying theme coherence
- **Phase 2 (Swaps & Polish)**: Mass import swap + polish remaining ~270 components + port voice components

## BD Task Decomposition

### Epic Mapping
| Epic ID | Title | Scope | Success Signal |
|---------|-------|-------|----------------|
| `epic-mig-phase-0` | Theme Foundation | 4 theme CSS + POC components | User says "we nailed it" |
| `epic-mig-phase-1` | Fixing Fails | 69 fails + 54 structural debt | Render clean in all 4 themes + Light/Dark |
| `epic-mig-phase-2` | Swaps & Polish | ~270 remaining + voice port | Zero legacy imports, P3 complete |

### Dependency Ordering
| Blocking | Dependent | Reason |
|----------|-----------|--------|
| Phase 0 | Phase 1 | Must nail themes before fixing components to them |
| Phase 1 | Phase 2 | Must fix crashes before mass import swaps |

## Success Criteria
- Global CSS establishes 4 canonical themes from existing source files.
- Light/Dark mode visually correct for all 4 themes.
- Best functional implementation chosen and polished for every component.
- Voice components (JarvisOrb, Waveform, VoiceOverlay) ported to `@kingly/ui`.
- Chat upgraded to ChatGPT-like quality.
- `@kingly/ui-patterns` package exists with typed Zustand stores (ReviewQueue, VoiceMode, Chat, GenUI).
- Entity review queue is fully codified as a compound pattern with voice control.
- 0 legacy imports remaining.
- All Storybook stories render without typecheck or console errors.

## Rollback Plan
### Rollback Trigger
Component swap introduces regressions.
### Rollback Steps
1. `git restore` the affected files.
2. Re-open the corresponding bead in `bd`.

## Open Questions
- What is the exact light-purple palette for the "good Jarvis"? (To be derived from `~/.openclaw/media/browser/` screenshots in Phase 0)
- Should LCARS Light Mode use a "day bridge" aesthetic (lighter tan/beige panels)?
- How much of KinglyAssistant's chat patterns should we port vs build fresh?
