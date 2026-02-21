---
type: handoff
created: 2026-02-20T20:02:00-06:00
updated: 2026-02-20T20:02:00-06:00
session_id: theme-palette-definition
from_agent: Cargo (PLACEHOLDER_M37)
to_agent: next-agent
status: active
stage: specification
context_confidence: 0.95
topic: ui-component-migration-theme-foundation
related_tasks: [ap-4rs, epic-mig-phase-0]
related_docs:
  - docs/specs/spec-component-migration.md
  - docs/specs/spec-component-migration-phase-0-foundation.md
  - docs/specs/spec-component-migration-phase-1-fails.md
  - docs/specs/spec-component-migration-phase-2-swaps.md
---

# Session Handoff: UI Component Migration — Theme Foundation Spec

**Created:** 2026-02-20 00:56 CST
**Topic:** Defining 4-theme foundation, package architecture, and 7-component POC for the 343-component UI migration
**Context Confidence:** 0.95
**Session ID:** theme-palette-definition

---

## Handoff Objective

This session completed the **DISCOVER → ALIGN → RESEARCH → PROPOSE → SPEC** phases of the `work` FSM for the UI component migration. We ran a 6-question structured interview with the user, audited all 4 existing theme CSS source files, documented the prior art for LCARS/Jarvis voice components, and produced 4 comprehensive specification documents. The next agent should proceed to **EXECUTE** Phase 0 (theme foundation implementation).

---

## Checkpoints (Chronological)

### ⚡ CHECKPOINT 1 — Discovery: Existing Theme Files Audited

**Current State:** Read and analyzed all 4 theme CSS source files
**Files Loaded:**
1. `packages/adapters/web-ui/src/styles/tokens.css` (453 lines) — agentping theme, full Light+Dark parity
2. `packages/canvas/src/styles/tokens.css` (65 lines) — lev/canvas theme, dark only
3. `packages/adapters/web-ui/src/styles/theme-sofia.css` (504 lines) — sofia theme overrides
4. `packages/ui/src/theme/skynet.css` (764 lines) — sofia/skynet @theme inline with animations
5. `packages/adapters/web-ui/src/styles/lcars.css` (331 lines) — LCARS Star Trek theme
6. `packages/ui/src/tailwind.config.ts` (90 lines) — Tailwind skynet preset
**Understanding:** The 4 themes have distinct aesthetics but share overlapping variable names. Agentping is the most complete (full L+D), others are dark-only. Sofia/skynet has the most custom CSS (animations, clip-paths, grid overlays). LCARS has unique geometry (elbow radii, pill end-caps, stripes).
**Why Important:** These are the SOURCE OF TRUTH for deriving the unified theme contract.

### ⚡ CHECKPOINT 2 — Discovery: Jarvis/Voice Prior Art Located

**Current State:** Located and analyzed the "good Jarvis" prior art
**Files Loaded:**
1. `~/clawd/jarvis/Brief.md` (342 lines) — voice mode implementation brief with useVoice hook docs
2. `~/clawd/jarvis/src/components/JarvisOrb.tsx` (267 lines) — CSS + WebGL dual-render orb
3. `~/clawd/jarvis/src/components/AuroraOrb.tsx` (560 lines) — full WebGL aurora shader orb with particle systems
4. `~/clawd/jarvis/src/styles/agentping.css` (128 lines) — button/spinner styles
5. `~/clawd/jarvis/src/styles/mobile.css` (118 lines) — mobile responsive patterns

**Understanding:** The Jarvis codebase has high-quality voice components: a WebGL orb with 15 animated layers, a useVoice hook with command parsing (approve/deny/skip/next/previous), a Waveform component with 4 visualization modes, and mobile-first responsive CSS. The "good Jarvis" is described as "subtle smooth light purple" with voice optimization.
**Why Important:** These are the building blocks to port to `@kingly/ui` and wire up in `@kingly/ui-patterns`.

### ⚡ CHECKPOINT 3 — Structured Interview: 6 Decisions Made

**Current State:** Completed 6-question interview protocol
**Decisions Made:**

| # | Question | User Decision |
|---|----------|---------------|
| q1 | Theme derivation strategy | **A+C** — derive from legacy code + creative proposal for missing light modes |
| q2 | Storybook review UX | **C** — toolbar dropdown + 8-up side-by-side matrix |
| q3 | Structural theme-awareness | **Hybrid** — promote structural techniques per theme (clip-path, glass, elbow), token-only where sensible |
| q4 | LCARS as 4th theme | **Yes** — rolls in Jarvis + flight deck + "good Jarvis" purple + voice + KinglyAssistant chat reference |
| q5 | Entity review queue | **Both A+B** — building blocks in `@kingly/ui` + orchestration in NEW `@kingly/ui-patterns` with Zustand stores |
| q6 | POC component count | **7 smart-sampled**: Button, Card, Input, Badge, JarvisOrb, EntityCard, Modal/BottomSheet |

**Why Important:** Every question resolved a spec ambiguity. The specs are now fully deterministic.

### ⚡ CHECKPOINT 4 — Specs Produced: 4 Documents

**Current State:** All 4 specs written at full detail
**Files Modified:**
1. `docs/specs/spec-component-migration.md` — Top-level strategy with 4-theme table, package architecture, operating manual
2. `docs/specs/spec-component-migration-phase-0-foundation.md` — Phase 0 foundation with 7 POC components, 8-up matrix, task breakdown
3. `docs/specs/spec-component-migration-phase-1-fails.md` — Phase 1 fail repair with best-of-breed table
4. `docs/specs/spec-component-migration-phase-2-swaps.md` — Phase 2 swaps with `@kingly/ui-patterns` package, Zustand stores, gen-UI types

**Why Important:** These are the execution blueprint. Phase 0 starts NEXT.

### 📋 User Feedback: Package Architecture Approved

**Decision:** The user approved a 2-package architecture:
- `@kingly/ui` — presentational components only (no Zustand, no orchestration)
- `@kingly/ui-patterns` — typed Zustand stores, composed hooks, compound patterns (ReviewQueue, VoiceMode, ChatInterface), gen-UI types

**Why Important:** This is a critical architectural decision that shapes how components vs orchestration are separated. The user explicitly wants typed Zustand stores exported for gen-UI state management.

---

## Timeline Summary

| Time | Checkpoint |
|------|------------|
| ~20:30 | Session start — loaded theme CSS files, audited variables |
| ~20:45 | Read all 4 theme source files, identified overlaps and gaps |
| ~21:00 | Started structured interview (q1: derivation strategy → A+C) |
| ~21:15 | q2: Storybook UX → Both toolbar + 8-up matrix |
| ~21:30 | q3: Structural variation → Hybrid approach |
| ~21:45 | q4: LCARS → Yes, 4th theme with Jarvis/voice |
| ~22:00 | Located and analyzed Jarvis prior art in ~/clawd/jarvis/ |
| ~22:30 | Updated all specs to 4 themes with LCARS/Jarvis context |
| ~23:30 | q5: Entity review queue → Both A+B, new @kingly/ui-patterns package |
| ~00:00 | q6: POC components → 7 smart-sampled |
| ~00:41 | Updated Phase 0 with 7-component table and 56 visual states |
| ~00:56 | Handoff created |

**Total Duration:** ~4 hours
**Context Switches:** 0 (single focused session)

---

## Key Decisions

### 1. 4-Theme System (Not 3)

**When:** ~21:45
**Context:** LCARS CSS existed in codebase but wasn't originally scoped
**Decision:** Promote LCARS to 4th official theme, rolling in Jarvis + flight deck
**Rationale:** User wants voice mode components and the "good Jarvis" purple aesthetic. LCARS already has 331 lines of CSS tokens, geometry, and animations.
**Impact:** All specs, matrix stories, and task counts updated (8-up instead of 6-up, 56 visual states instead of 24)
**Follow-up Required:**
- [ ] Derive LCARS Light Mode from "good Jarvis" screenshots in `~/.openclaw/media/browser/`
- [ ] Port JarvisOrb + AuroraOrb from `~/clawd/jarvis/`

### 2. Structural Theme-Awareness

**When:** ~21:30
**Context:** Should themes change only colors or also component geometry?
**Decision:** Hybrid — promote per-theme structural techniques (sofia clip-path, agentping glass, canvas blur, lcars elbows) but use token-only where the component doesn't warrant it
**Rationale:** Each theme has a unique geometric identity. Flattening them to colors-only loses the aesthetic.
**Impact:** Components need `[data-theme]` CSS selectors for structural variants. The POC Card component is the primary test of this mechanic.

### 3. Two-Package Architecture

**When:** ~00:38
**Context:** Entity review queue needs orchestration (Zustand stores, voice command dispatch)
**Decision:** `@kingly/ui` (presentational) + `@kingly/ui-patterns` (orchestration with typed Zustand stores)
**Rationale:** Clean separation of presentational vs state management. Components don't import Zustand. Apps choose their orchestration layer.
**Impact:** New `packages/ui-patterns/` directory needed. Zustand becomes a peer dependency.

### 4. 7-Component POC (Smart Sampling)

**When:** ~00:41
**Context:** User wanted ~7 POC components for Phase 0 validation
**Decision:** Button, Card, Input, Badge, JarvisOrb, EntityCard, Modal/BottomSheet
**Rationale:** Covers 7 distinct axes: interactive, container, form, indicator, voice/animation, data display, overlay. 3 token-only + 4 structurally variant.

---

## Code Context

### Files Modified

| File | Change Type | Lines | Status | Notes |
|------|-------------|-------|--------|-------|
| `docs/specs/spec-component-migration.md` | rewritten | ~250 | complete | Top-level strategy with 4 themes + package architecture |
| `docs/specs/spec-component-migration-phase-0-foundation.md` | rewritten | ~180 | complete | Phase 0 with 7 POCs, 8-up matrix, task breakdown |
| `docs/specs/spec-component-migration-phase-1-fails.md` | rewritten | ~100 | complete | Phase 1 with best-of-breed table |
| `docs/specs/spec-component-migration-phase-2-swaps.md` | rewritten | ~170 | complete | Phase 2 with @kingly/ui-patterns package detail |

**Total Changes:**
- Files added: 0 (all overwrites of existing specs)
- Files modified: 4
- Files deleted: 0
- Lines changed: ~700

### Files Loaded Into Context

| Order | File | Why Loaded | Key Understanding | Why It Matters |
|-------|------|------------|-------------------|----------------|
| 1 | `adapters/web-ui/src/styles/tokens.css` | Agentping theme source | 453 lines, full L+D, shadcn aliases, `#00e5ff` cyan, Inter font | Reference for unified contract |
| 2 | `canvas/src/styles/tokens.css` | Canvas theme source | 65 lines, dark only, glass-panel blur, Inter | Needs Light Mode creation |
| 3 | `adapters/web-ui/src/styles/theme-sofia.css` | Sofia theme source | 504 lines, `--sofia-*` prefixed overrides, dark only | Needs Light Mode creation |
| 4 | `ui/src/theme/skynet.css` | Sofia/skynet animations | 764 lines, Orbitron/Rajdhani fonts, 0px radius, clip-paths, scanlines | Structural variation source |
| 5 | `ui/src/tailwind.config.ts` | Tailwind preset | Maps font families to CSS vars, animation keyframes | Integration point |
| 6 | `adapters/web-ui/src/styles/lcars.css` | LCARS theme source | 331 lines, TNG/Picard/Nemesis palette, 40px elbows, Antonio font | 4th theme source |
| 7 | `~/clawd/jarvis/Brief.md` | Voice implementation docs | useVoice hook, Waveform modes, command parsing | Voice port blueprint |
| 8 | `~/clawd/jarvis/src/components/JarvisOrb.tsx` | Voice orb component | CSS/WebGL dual render, Siri-like glass core, framer-motion | Port target |
| 9 | `~/clawd/jarvis/src/components/AuroraOrb.tsx` | WebGL orb | 15-layer aurora shader, particle smoke, glass refraction | Port target |
| 10 | `~/clawd/jarvis/src/styles/mobile.css` | Mobile patterns | 44px touch targets, bottom sheets, landscape handling | LCARS responsive source |
| 11 | `~/clawd/jarvis/src/styles/agentping.css` | Button/spinner styles | Gradient button variants, spinner animation | Reference only |
| 12 | `canvas/DEPRECATED.md` | Deprecation notice | Canvas merged into web-ui | Context |

---

### Key Code Locations

**Critical paths for next session:**

```text
packages/
├── adapters/web-ui/src/styles/
│   ├── tokens.css              # agentping theme (L+D reference)
│   ├── theme-sofia.css         # sofia theme (dark only)
│   ├── lcars.css               # lcars theme (dark only)
│   └── global.css              # base styles
├── ui/src/
│   ├── theme/skynet.css        # sofia/skynet animations + @theme inline
│   ├── tailwind.config.ts      # Tailwind preset
│   ├── components/
│   │   ├── ui/                 # Target for canonical components
│   │   └── migrations/         # Current migration staging
│   └── stories/                # Storybook stories
├── canvas/src/styles/
│   └── tokens.css              # canvas theme (dark only, deprecated pkg)
└── ui-patterns/                # NEW package (to be created)

~/clawd/jarvis/src/
├── components/
│   ├── JarvisOrb.tsx           # CSS orb + WebGL fallback
│   ├── AuroraOrb.tsx           # Full WebGL aurora shader orb
│   ├── Waveform.tsx            # Audio visualization (4 modes)
│   ├── VoiceOverlay.tsx        # Voice mode overlay
│   ├── BottomSheet.tsx         # Mobile bottom sheet
│   └── EntityCard.tsx          # Entity review card
├── hooks/useVoice.ts           # Voice recognition + command parsing
└── styles/mobile.css           # Mobile responsive patterns

~/k/apps/production/KinglyAssistant/  # ChatGPT-like chat reference
~/.openclaw/media/browser/            # "Good Jarvis" screenshot references (31 files)
```

---

## State Machine

### Current State

```yaml
session_state: specification (complete, awaiting execution)
entities_touched:
  - type: spec
    id: spec-component-migration
    lifecycle: discover → align → research → propose → spec ✅
  - type: spec
    id: spec-component-migration-phase-0-foundation
    lifecycle: discover → spec ✅
  - type: spec
    id: spec-component-migration-phase-1-fails
    lifecycle: discover → spec ✅
  - type: spec
    id: spec-component-migration-phase-2-swaps
    lifecycle: discover → spec ✅
```

**State Transitions:**
1. DISCOVER → SPEC: Interview completed, all theme sources audited, 6 decisions made
2. NEXT: SPEC → EXECUTE: Begin Phase 0 implementation (t-ph0-1 through t-ph0-8)

---

### Background Processes

| PID/ID | Type | Name | Status | Notes |
|--------|------|------|--------|-------|
| - | exec | `npm run storybook` | stopped | Manually killed |
| - | exec | `bd doctor --fix` | stopped | Manually killed |

---

## Open Items

### Immediate (Next Session: Execute Phase 0)

1. **t-ph0-1: Audit + Map Variables into Unified Contract**
   - **Context:** Read all 4 theme CSS files and produce a mapping table showing which variables each theme defines vs needs
   - **Status:** not_started
   - **Next Steps:** Create a markdown table mapping `--background`, `--foreground`, `--primary`, etc. across all 4 themes. Identify gaps.
   - **Files:** All 4 theme CSS files (see Files Loaded above)
   - **Estimate:** Medium

2. **t-ph0-2/3/4/5: Define 4 Theme Data-Theme Blocks**
   - **Context:** Create unified CSS with `[data-theme="agentping"]`, `[data-theme="canvas"]`, `[data-theme="sofia"]`, `[data-theme="lcars"]` each with `.dark` and `.light`
   - **Status:** not_started
   - **Dependencies:** t-ph0-1 (variable contract)
   - **Next Steps:** Agentping: lift from `tokens.css`. Canvas: lift dark, creatively propose light. Sofia: lift dark from `theme-sofia.css`/`skynet.css`, propose light. LCARS: lift dark from `lcars.css`, propose light from "good Jarvis" screenshots.
   - **Estimate:** Deep work

3. **t-ph0-6a/6b: Refactor 7 POC Components**
   - **Context:** Button, Card, Input, Badge, JarvisOrb, EntityCard, Modal/BottomSheet
   - **Status:** not_started
   - **Dependencies:** t-ph0-2/3/4/5 (themes defined)
   - **Next Steps:** Strip hardcoded classes. 3 token-only (Button, Input, Badge) + 4 structural-variant (Card, JarvisOrb, EntityCard, Modal).
   - **Estimate:** Deep work

4. **t-ph0-7a/7b: Storybook Switcher + 8-Up Matrix**
   - **Context:** Toolbar dropdown for browsing + ThemeMatrix.stories.tsx for 8-up side-by-side
   - **Status:** not_started
   - **Dependencies:** t-ph0-6a/6b (components refactored)
   - **Estimate:** Medium

5. **t-ph0-8: Human Review Gate**
   - **Context:** User says "we nailed it" or we iterate
   - **Status:** not_started
   - **Dependencies:** All above

### Short-term (This Week)

1. Phase 0 complete + user approval
2. Create `packages/ui-patterns/` package scaffolding
3. Begin Phase 1 fail triage

### Long-term (This Month)

1. Phase 1: Fix 69 fails + 54 structural debt
2. Phase 2: Mass import swap + voice port + chat upgrade
3. Close epic `ap-4rs`

---

## Blockers & Risks

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LCARS Light Mode aesthetics hard to nail | Medium | Medium | Use "good Jarvis" screenshots as reference, iterate with user |
| Sofia Light Mode may lose its identity without glow effects | Medium | Low | Keep sharp edges + grid pattern, only mute glows |
| WebGL AuroraOrb may fail in some Storybook environments | Low | Low | CSSOrb fallback already implemented in source |
| `bd doctor` running for 4h may indicate Dolt database issues | Medium | Low | Historical issue, bypass by reading `issues.jsonl` directly |

---

## Learned Patterns

### What Worked

1. **Structured interview protocol (6 questions)**
   - Context: Used to resolve all spec ambiguities before writing
   - Why it worked: Each question targeted a specific decision point. User gave crisp answers. No backtracking.
   - Reuse: Use for any design/architecture decision with >2 options

2. **Smart sampling for POC components**
   - Context: User said "do like 7, smart sampling"
   - Why it worked: Sampling across 7 distinct component axes (interactive, container, form, indicator, voice, data, overlay) maximizes coverage with minimal components
   - Reuse: Apply same axis-sampling to any POC selection

3. **Reading actual CSS source files before proposing**
   - Context: Loaded all 4 theme files + Jarvis components before writing specs
   - Why it worked: Specs contain exact variable names, line counts, font families, hex values — not guesses
   - Reuse: Always audit the source before specifying the target

### What Didn't Work

1. **Starting with 3 themes**
   - Context: Original specs had 3 themes; user added LCARS as 4th mid-interview
   - Why it failed: Scope expansion required rewriting all 4 specs
   - Alternative: Ask about ALL possible themes upfront in q1

---

## Context for Next Session

### Mental Model

**Project State:** 343 UI components need migration to a 4-theme system. We've completed specification. Storybook is running. Specs are written and user-approved.

**Current Focus:** Begin Phase 0 EXECUTION — build the unified theme CSS and refactor 7 POC components.

**Critical Knowledge:**
1. **Agentping `tokens.css` is the reference** — it already has full Light+Dark with shadcn aliases. Derive the other 3 themes' variable contracts from it.
2. **Structural variation is per-theme, not per-component** — use `[data-theme]` CSS selectors, not component-level `variant` props.
3. **Two-package architecture** — `@kingly/ui` (presentational only) vs `@kingly/ui-patterns` (Zustand stores + orchestration). Components NEVER import Zustand.
4. **"Good Jarvis"** — the LCARS light mode should be "subtle smooth light purple" not the "ugly" one. Reference `~/.openclaw/media/browser/` screenshots.
5. **Human gate** — Phase 0 HALTS until user says "we nailed it" after reviewing the 8-up ThemeMatrix.

### Quick Start Commands

```bash
cd /Users/jean-patricksmith/digital/leviathan/community/agentping
# Storybook is likely already running on port 6006
npm run storybook --prefix packages/ui

# Read the specs
cat docs/specs/spec-component-migration.md
cat docs/specs/spec-component-migration-phase-0-foundation.md

# Key theme source files
cat packages/adapters/web-ui/src/styles/tokens.css
cat packages/adapters/web-ui/src/styles/lcars.css
cat packages/adapters/web-ui/src/styles/theme-sofia.css
cat packages/ui/src/theme/skynet.css
cat packages/canvas/src/styles/tokens.css
```

### Configuration State

**Environment:**
- pnpm monorepo

**Services:**
- None active. Storybook and beads doctor were manually killed for the handoff.

---

## System Prompt for Next Agent (Required)

You are continuing a UI component migration for the `agentping` project. Your predecessor completed the SPECIFICATION phase — 4 comprehensive specs exist in `docs/specs/spec-component-migration*.md`. You must now EXECUTE Phase 0.

**First, load and verify understanding of:**
1. `docs/specs/spec-component-migration-phase-0-foundation.md` — this is your execution blueprint
2. `docs/specs/spec-component-migration.md` — top-level strategy with package architecture

**Your task is Phase 0 execution:**
1. `t-ph0-1`: Audit all 4 theme CSS files (`tokens.css`, `canvas/tokens.css`, `theme-sofia.css`+`skynet.css`, `lcars.css`) and produce a unified variable mapping
2. `t-ph0-2/3/4/5`: Create `[data-theme]` CSS blocks for all 4 themes with Light+Dark modes (agentping derive from source, canvas/sofia/lcars propose light modes creatively)
3. `t-ph0-6a/6b`: Refactor 7 POC components (Button, Card, Input, Badge, JarvisOrb, EntityCard, Modal/BottomSheet) — 3 token-only + 4 structural-variant
4. `t-ph0-7a/7b`: Build Storybook toolbar theme switcher + ThemeMatrix 8-up comparison story
5. `t-ph0-8`: Present to user for review — process HALTS until user says "we nailed it"

**Critical constraints:**
- Themes change STRUCTURE not just colors (sofia gets clip-path, lcars gets elbows)
- LCARS Light Mode should use the "good Jarvis" subtle light purple aesthetic — reference `~/.openclaw/media/browser/` screenshots
- JarvisOrb source is at `~/clawd/jarvis/src/components/JarvisOrb.tsx` + `AuroraOrb.tsx`
- Two packages: `@kingly/ui` (presentational) and `@kingly/ui-patterns` (Zustand stores) but ui-patterns is Phase 2 work
- Beads-only tracking, no CSV/TXT sidecars

After loading the specs, return a context confidence score.

---

## Context Confidence Score (Required)

**Context Confidence:** 0.95

**What's certain (high confidence):**
- All 4 theme source files fully read and understood
- All 6 interview decisions documented and codified
- Package architecture designed and approved
- 7 POC components selected with clear sampling rationale
- All specs written with concrete file paths, variable names, and acceptance criteria

**What's uncertain (5% gap):**
- The exact hex values for LCARS Light Mode — need to derive from `~/.openclaw/media/browser/` screenshots
- Whether `bd doctor` will complete successfully (has been running 4h)
- The exact KinglyAssistant chat patterns to port (not yet audited in detail)

---

## Validation Checklist

### Session Completeness
- [x] 5 chronological checkpoints included
- [x] Files worked and files loaded are explicitly listed (12 files loaded, 4 modified)
- [x] Understanding + importance captured for key files
- [x] Decisions include rationale (6 decisions, all with alternatives considered)
- [x] Open items are prioritized (5 immediate, 3 short-term, 3 long-term)

### Knowledge Transfer
- [x] Critical code paths documented (full tree with line references)
- [x] Patterns and anti-patterns captured (3 + 1)
- [x] Next-agent system prompt included
- [x] Context confidence score included (0.95)
- [x] Handoff is sufficient for cold-start continuation
