---
title: "spec-component-migration-phase-0-foundation"
type: spec
entity: "ui-theming"
stage: crystallized
created: "2026-02-19"
author: "Antigravity"
status: draft
---

# Phase 0: Theming Foundation — Behavioral Specification

## Executive Summary
Phase 0 builds the unified CSS variable foundation for **4 themes** from existing source files. We select a small cross-section of foundational components, convert them to use semantic tokens, and iterate **until the User explicitly says "we nailed it."** Only then do we proceed.

## Context

### Existing State
Four separate theme files already exist but are disconnected:

| Theme | Source | Light Mode? | Variable Prefix | Key Aesthetic |
|-------|--------|-------------|-----------------|---------------|
| **agentping** | `adapters/web-ui/src/styles/tokens.css` (453 lines) | ✅ Full `[data-theme="light"]` + `prefers-color-scheme` fallback | `--bg-*`, `--text-*`, `--primary`, `--border-*` | Inter, rounded corners, cyan neon dark / blue light, glass effects, shadcn aliases |
| **lev/canvas** | `canvas/src/styles/tokens.css` (65 lines) | ❌ Dark only | `--bg-*`, `--text-*`, `--primary` | Inter, glass-panel blur, smooth radii (6-24px), minimal |
| **sofia** | `adapters/web-ui/src/styles/theme-sofia.css` (504 lines) + `ui/src/theme/skynet.css` (764 lines) | ❌ Dark only | `--sofia-*`, `--color-*` (skynet @theme inline) | Orbitron headings, Rajdhani body, 0px radius, clip-path cut corners, glow/scanline effects, grid overlays |
| **lcars** | `adapters/web-ui/src/styles/lcars.css` (331 lines) + `~/clawd/jarvis/` prior art | ❌ Dark only | `--lcars-*`, standard `--bg-*`/`--primary` overrides | Antonio/Orbitron fonts, `#99ccff`/`#ff9900`/`#cc99ff` palette, 40px elbow radii, pill end-caps, flat (no glass), container-query responsive, voice-first |

Components currently bypass all of these and use hardcoded Tailwind classes (`bg-zinc-900`, `text-slate-400`).

### Target State
A single unified `globals.css` (or theme layer) that exposes a consistent variable contract:
- `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--border`, `--ring`, `--radius-*`, `--font-*`
- Additional structural CSS variables: `--card-clip-path`, `--card-backdrop`, `--glow-*`, `--panel-shadow`, `--elbow-radius`
- These resolve differently per `[data-theme="agentping"]`, `[data-theme="canvas"]`, `[data-theme="sofia"]`, `[data-theme="lcars"]`
- Each theme has both `.dark` and `.light` variants
- **Structural theme-awareness**: Themes change geometry/effects, not just colors. The POC Card demonstrates:
  - **Sofia**: Cut-corner `clip-path`, cyan glow top-line, 0px radius
  - **Agentping**: Glass-bg with subtle border glow on hover, soft radii
  - **Canvas**: Backdrop-blur glass panel, generous radii, minimal
  - **LCARS**: Elbow radii (40px), thick colored top/bottom stripes, pill end-caps, flat surface
  - Token-only (colors/spacing) used where structural variation doesn't apply
- A few POC components (Button, Input, Card) perfectly demonstrate the 4 themes × 2 modes

### Derivation Strategy (A+C)
- **agentping**: Already has Light+Dark. Derive directly from `tokens.css`. This is our reference.
- **lev/canvas**: Derive dark from `canvas/src/styles/tokens.css`. Creatively propose a Light Mode that maintains glassmorphism feel with lighter backgrounds.
- **sofia**: Derive dark from `theme-sofia.css` + `skynet.css`. Creatively propose a Light Mode — tactical "day ops" palette (light slate backgrounds, dark accents, sharp edges preserved, glow effects muted).
- **lcars**: Derive dark from `lcars.css`. Creatively propose a Light Mode — the subtle smooth light purple "good Jarvis" aesthetic from `~/.openclaw/media/browser/` screenshots. Also reference `~/clawd/jarvis/src/styles/` for mobile patterns. Investigate `~/k/apps/production/KinglyAssistant` for ChatGPT-like chat patterns to inform voice mode upgrade.

## User Scenarios (BDD)

### Scenario 1: Foundational theme switching in Storybook
```gherkin
Feature: Foundational Theme Tokens
  As a designer/developer reviewing the new system
  I want to look at Button, Input, and Card switching between the 4 themes in Storybook
  So that I can verify the exact aesthetic tokens before applying them to 300+ components

  Scenario: Human gates the theme
    Given the theme CSS variables are defined in a unified globals file
    When the POC Button is viewed in Storybook
    Then in `agentping/dark`: cyan accent, Inter font, 6px radius, neon glow hover
    And in `agentping/light`: blue accent, white bg, clean shadows
    And in `canvas/dark`: cyan accent, Inter, 12px radius, glass-panel backdrop
    And in `canvas/light`: lighter glass, soft shadows
    And in `sofia/dark`: cyan accent, Orbitron heading, 0px radius, cut-corner clip-path
    And in `sofia/light`: slate backgrounds, dark accents, 0px radius, no glow
    And in `lcars/dark`: blue/orange palette, Antonio font, 40px elbow radius, pill shape, flat
    And in `lcars/light`: light purple/lavender palette, smooth pill shapes, subtle glow
    And the process fully HALTS until the User approves each theme variant
```

## Behavioral Specification

### Inputs
- `packages/adapters/web-ui/src/styles/tokens.css` (agentping source of truth)
- `packages/canvas/src/styles/tokens.css` (lev/canvas source of truth)
- `packages/adapters/web-ui/src/styles/theme-sofia.css` (sofia source of truth)
- `packages/ui/src/theme/skynet.css` (sofia/skynet @theme inline, animations, utilities)
- `packages/adapters/web-ui/src/styles/lcars.css` (lcars source of truth)
- `~/clawd/jarvis/src/styles/` (jarvis mobile patterns)
- `~/clawd/jarvis/src/components/` (JarvisOrb, EntityCard source)
- `~/.openclaw/media/browser/` (reference screenshots for the "good Jarvis" light purple aesthetic)
- `~/k/apps/production/KinglyAssistant` (ChatGPT-like chat reference)
- **7 POC components** (smart sampled across component axes):

| # | Component | Axis | Structural Variation? | Why Selected |
|---|-----------|------|-----------------------|--------------|
| 1 | **Button** | Interactive / action | Token-only (colors, radii, typography) | Core primitive — validates base token system |
| 2 | **Card** | Container / panel | ✅ Heavy: sofia clip-path, agentping glass, canvas blur, lcars elbow stripes | Tests structural variation mechanics |
| 3 | **Input** | Form / text entry | Token-only (borders, focus rings, placeholder) | Validates focus states, input styling |
| 4 | **Badge** | Compact indicator | Token-only (status colors, tiny text contrast) | Tests semantic status colors |
| 5 | **JarvisOrb** | Voice / animation | ✅ Theme-adaptive glow, WebGL/CSS fallback | Validates LCARS identity + animation adaptation |
| 6 | **EntityCard** | Data display / review | ✅ Layout varies per theme breakpoints | Tests review building block, mobile patterns |
| 7 | **Modal/BottomSheet** | Overlay / layout | ✅ Glass/backdrop effects, responsive morph | Tests containment, responsive behavior |

### Processing
1. **Audit existing variables**: Map the union of all variables across the 4 theme files into a shared contract.
2. **Unify variable names**: All themes must resolve the same set of semantic names (`--background`, `--foreground`, `--primary`, `--card`, `--border`, `--ring`, `--radius-sm/md/lg`, `--font-sans/display/mono`).
3. **Create Light Mode for canvas + sofia + lcars**: 
   - Canvas light: softer glass backgrounds, lighter borders, reduced blur.
   - Sofia light: tactical "day ops" — light slate bg, dark text, sharp edges preserved, glow effects disabled or muted.
   - LCARS light: the "good Jarvis" — subtle smooth light purple/lavender backgrounds, soft elbow shapes, voice-optimized mobile layout.
4. **POC Component Refactor**: Strip hardcoded classes from all 7 POC components. Replace with semantic tokens + structural variants per theme via `[data-theme]` selectors where warranted (Card, JarvisOrb, EntityCard, Modal have structural variation; Button, Input, Badge are token-only).
5. **Storybook Theme Switcher (Dual Experience)**:
   - **Toolbar Dropdown**: A Storybook `globalTypes` toolbar item that sets `data-theme` and `data-mode` on the root for quick switching during browsing.
   - **8-Up Comparison Matrix Story**: A dedicated `ThemeMatrix.stories.tsx` that renders each POC component **8 times side-by-side** (4 themes × 2 modes) in a single view. This is the primary review surface for Phase 0 gating.
6. **Human Review Gate**: Present the 8-up matrix in Storybook. Iterate indefinitely until User says "we nailed it."

### Outputs
- Unified theme CSS file (or files per theme)
- 7 POC components demonstrating 4 themes × 2 modes (56 total visual states)
- Storybook toolbar theme switcher (global decorator)
- Storybook `ThemeMatrix` comparison story (8-up side-by-side per component, 7 components = 7 stories)
- Clear variable contract for follow-on phases

### Performance
Negligible — pure CSS variable resolution.

## Contract

### Dependencies
- `@kingly/ui` CSS and Tailwind CSS v4 `@theme inline`
- Existing theme files (see Inputs)

### Integration Points
Global UI package CSS entry point.

### Breaking Changes
`globals.css` rewritten. Unmigrated components may temporarily lose styling until Phase 1/2 brings them into the new standard.

## Implementation Guidance

### Team Structure
Direct agent execution with live User feedback loop.

## BD Task Decomposition

### Epic Mapping
| Epic ID | Title | Scope | Success Signal |
|---------|-------|-------|----------------|
| `epic-mig-phase-0` | Theme Foundation | 4 themes, tokens, POC components | User says "we nailed it" |

### Task Breakdown
| Task ID | Summary | Owner | Acceptance Signal |
|---------|---------|-------|-------------------|
| `t-ph0-1` | Audit + map all existing theme variables into unified contract | Agent | Variable mapping document complete |
| `t-ph0-2` | Define `[data-theme="agentping"]` dark + light from `tokens.css` | Agent | Variables resolve correctly |
| `t-ph0-3` | Define `[data-theme="canvas"]` dark from `canvas/tokens.css` + propose light | Agent | Both modes render |
| `t-ph0-4` | Define `[data-theme="sofia"]` dark from `theme-sofia.css`/`skynet.css` + propose light | Agent | Both modes render |
| `t-ph0-5` | Define `[data-theme="lcars"]` dark from `lcars.css` + propose light (good Jarvis purple) | Agent | Both modes render |
| `t-ph0-6a` | Refactor token-only POCs: Button, Input, Badge | Agent | No hardcoded classes, themed via tokens |
| `t-ph0-6b` | Refactor structural-variant POCs: Card, JarvisOrb, EntityCard, Modal/BottomSheet | Agent | Structural variation works per theme |
| `t-ph0-7a` | Storybook toolbar theme switcher (globalTypes decorator) | Agent | Dropdown toggles 4 themes × 2 modes |
| `t-ph0-7b` | Storybook `ThemeMatrix` 8-up comparison story (×7 components) | Agent | All 56 visual states render correctly |
| `t-ph0-8` | Human review + iterate | User | "we nailed it" |

### Dependency Ordering
| Blocking | Dependent | Reason |
|----------|-----------|--------|
| `t-ph0-1` | `t-ph0-2`, `t-ph0-3`, `t-ph0-4`, `t-ph0-5` | Need unified contract before defining themes |
| `t-ph0-2/3/4/5` | `t-ph0-6` | Need themes before refactoring POC components |
| `t-ph0-6` | `t-ph0-7a`, `t-ph0-7b` | Need components before adding switcher/matrix |
| `t-ph0-7a/7b` | `t-ph0-8` | Need both review tools before human review |

## Test Coverage
- Storybook visual matrix: 4 themes × 2 modes × 7 components = 56 visual states
- Token-only components (Button, Input, Badge): verify colors/radii/typography change per theme
- Structural components (Card, JarvisOrb, EntityCard, Modal): verify geometry/effects change per theme
- `pnpm typecheck` passes

## Success Criteria
- User explicitly signs off on the POC.
- Light + Dark mode works for all 4 themes.
- No hardcoded color classes in POC components.
- LCARS light mode captures the "good Jarvis" subtle purple aesthetic.

## Rollback Plan
### Rollback Trigger
User determines the themes cannot be consolidated.
### Rollback Steps
1. Revert globals.css and Tailwind config via git.
2. Maintain legacy styling approach.

## Open Questions
- Should canvas Light Mode keep the glassmorphism backdrop-filter or switch to subtle shadows?
- Should sofia Light Mode retain the grid pattern or remove it?
- What exact lavender/purple hex values define the "good Jarvis" light mode? (To be derived from screenshots)
