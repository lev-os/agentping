# Step 2: Information Architecture

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Design Challenge:** Premium GenUI Component System for AgentPing
**Date:** 2026-02-10

---

## System Map

```
AgentPing GenUI System
│
├── Design Token Layer
│   ├── Color System (Semantic + Theme Scales)
│   ├── Spacing Scale (4px base, 8-step scale)
│   ├── Typography System (Size, Weight, Line Height)
│   ├── Shadow System (Elevation 0-4)
│   ├── Radius System (sm/md/lg/xl)
│   └── Animation System (Duration, Easing, Delays)
│
├── Polymorph Primitive Layer (12 → 18 Primitives)
│   ├── Content Primitives
│   │   ├── Text (heading/body/caption/code)
│   │   ├── Badge (status indicators)
│   │   ├── StatusDot (online/offline/busy/away)
│   │   └── MetricValue (KPI display)
│   │
│   ├── Input Primitives
│   │   ├── Button (primary/secondary/ghost/danger)
│   │   ├── InputField (text/number/email/password)
│   │   ├── CheckItem (checkbox with label)
│   │   ├── RadioItem [NEW] (radio with label)
│   │   ├── Select [NEW] (dropdown selector)
│   │   └── Slider [NEW] (range input)
│   │
│   ├── Layout Primitives
│   │   ├── Card (container with header/footer)
│   │   ├── Stack [NEW] (vertical/horizontal layout)
│   │   ├── Grid [NEW] (responsive grid)
│   │   └── Divider [NEW] (visual separator)
│   │
│   ├── Navigation Primitives
│   │   ├── NavItem (sidebar/tab navigation)
│   │   ├── ListItem (selectable list entries)
│   │   └── ActionBar (button groups)
│   │
│   ├── Feedback Primitives
│   │   ├── ProgressBar (determinate progress)
│   │   ├── Spinner [NEW] (indeterminate loading)
│   │   ├── Alert [NEW] (info/warning/error/success)
│   │   └── Toast [NEW] (temporary notifications)
│   │
│   └── Data Primitives
│       ├── Table [NEW] (sortable/filterable data)
│       ├── LineChart [NEW] (time series)
│       ├── BarChart [NEW] (comparisons)
│       └── PieChart [NEW] (proportions)
│
├── Renderer Layer (HTML/React/Pencil)
│   ├── HTML String Renderer
│   │   ├── CSS-in-JS (scoped classes, custom properties)
│   │   ├── Interactive JS (event listeners, state)
│   │   └── Responsive Layout (media queries)
│   │
│   ├── React Catalog Renderer
│   │   ├── Component Catalog (Studio consumption)
│   │   ├── React Hooks (useState, useEffect)
│   │   └── Context Providers (Theme, State)
│   │
│   └── Pencil Operations Renderer
│       ├── Frame Primitives (rectangles, text, groups)
│       ├── Design Tokens (colors, spacing as variables)
│       └── Layout Constraints (auto-layout, flex)
│
├── Streaming Layer [NEW]
│   ├── Chunk Protocol (component deltas)
│   ├── Accumulator (state management)
│   ├── Skeleton States (loading placeholders)
│   └── Entrance Animations (progressive reveal)
│
├── Interactivity Layer [NEW]
│   ├── Event Handlers (onClick, onChange, onSubmit)
│   ├── Action Service (emit ping:action events)
│   ├── State Store (persistent component state)
│   └── Callback Registry (per-primitive handlers)
│
└── Theme System [NEW]
    ├── Theme Provider (context wrapper)
    ├── Theme Presets (9 themes)
    │   ├── Enterprise (neutral, light/dark)
    │   ├── Terminal Swiss (current default)
    │   ├── Skynet (cyber blue)
    │   ├── System (follows OS)
    │   ├── Emerald (green accent)
    │   ├── Violet (purple accent)
    │   ├── Rose (pink accent)
    │   ├── Amber (orange accent)
    │   └── Monochrome (grayscale)
    │
    └── Custom Theme Builder (user-defined tokens)
```

---

## Design Token Architecture

### Color System

#### Semantic Colors (Theme-Independent)
```yaml
semantic:
  primary: "Main accent color for CTAs, links, active states"
  secondary: "Secondary actions, less prominent features"
  success: "Positive states (approved, completed, online)"
  warning: "Caution states (pending, at-risk, busy)"
  error: "Negative states (rejected, failed, offline)"
  info: "Informational states (notifications, tips)"

  bg-base: "Page background"
  bg-surface: "Card/panel backgrounds"
  bg-overlay: "Modal/dialog backgrounds"

  text-primary: "Headings, primary content"
  text-secondary: "Body text"
  text-muted: "Captions, labels, disabled states"

  border-subtle: "Default borders"
  border-strong: "Focused/active borders"
```

#### Color Scales (Per Theme)
Each theme defines 10-step scales for gray + accent:
```yaml
gray:
  50: "Lightest (light theme backgrounds)"
  100-400: "Light grays (borders, surfaces)"
  500: "Mid gray (muted text)"
  600-800: "Dark grays (text, icons)"
  900: "Darkest (dark theme text)"
  950: "Near-black (dark theme backgrounds)"

accent:
  50: "Lightest tint (backgrounds)"
  100-400: "Light shades (hover states)"
  500: "Base accent (primary actions)"
  600-800: "Dark shades (active states)"
  900: "Darkest shade (high contrast)"
```

### Spacing Scale
Base: 4px
Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64

```yaml
spacing:
  0: 0px
  1: 4px    # Tight (badge padding, icon margins)
  2: 8px    # Compact (button padding, input padding)
  3: 12px   # Base (card padding, list gaps)
  4: 16px   # Comfortable (section padding)
  5: 20px   # Spacious (panel padding)
  6: 24px   # Generous (page margins)
  8: 32px   # Large (section dividers)
  10: 40px  # XL (hero sections)
  12: 48px  # XXL (page headers)
  16: 64px  # XXXL (major sections)
```

### Typography System

```yaml
font_families:
  sans: "'Inter', 'SF Pro', system-ui, -apple-system, sans-serif"
  mono: "'SF Mono', 'Fira Code', 'JetBrains Mono', Consolas, monospace"

font_sizes:
  xs: 11px    # Captions, timestamps, badges
  sm: 12px    # Labels, secondary text
  base: 13px  # Body text, buttons
  md: 14px    # Emphasized body, subheadings
  lg: 16px    # Section headers
  xl: 18px    # Subsection titles
  2xl: 20px   # Page titles
  3xl: 24px   # Hero titles
  4xl: 28px   # Large metrics
  5xl: 36px   # Display metrics

font_weights:
  normal: 400
  medium: 500
  semibold: 600
  bold: 700

line_heights:
  tight: 1.2   # Headings, metrics
  base: 1.5    # Body text
  relaxed: 1.7 # Long-form content

letter_spacing:
  tighter: -0.02em  # Large headings
  tight: -0.01em    # Subheadings
  normal: 0         # Body text
  wide: 0.02em      # Labels
  wider: 0.04em     # All-caps labels
```

### Shadow System (Elevation)

```yaml
shadows:
  sm: "0 1px 2px rgba(0,0,0,0.04)"           # Subtle depth (inputs, badges)
  md: "0 2px 4px rgba(0,0,0,0.06)"           # Cards, dropdowns
  lg: "0 4px 8px rgba(0,0,0,0.08)"           # Modals, popovers
  xl: "0 8px 16px rgba(0,0,0,0.10)"          # Floating panels
  2xl: "0 16px 32px rgba(0,0,0,0.12)"        # Dialogs, overlays

  # Colored shadows for focus states
  ring-primary: "0 0 0 3px rgba(var(--accent),0.2)"
  ring-error: "0 0 0 3px rgba(var(--error),0.2)"
  ring-success: "0 0 0 3px rgba(var(--success),0.2)"
```

### Radius System

```yaml
radius:
  sm: 4px    # Badges, pills
  md: 8px    # Buttons, inputs
  lg: 12px   # Cards, panels
  xl: 20px   # Large cards, hero sections
  full: 9999px # Circular (status dots, avatars)
```

### Animation System

```yaml
durations:
  fast: 150ms      # Hover states, micro-interactions
  base: 250ms      # Transitions, fades
  slow: 350ms      # Entrance animations, modals
  slower: 500ms    # Page transitions

easings:
  ease-out: "cubic-bezier(0.4, 0, 0.2, 1)"    # Default (snappy)
  ease-in: "cubic-bezier(0.4, 0, 1, 1)"       # Exit animations
  ease-in-out: "cubic-bezier(0.4, 0, 0.2, 1)" # Smooth transitions
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" # Playful bounce

delays:
  stagger-1: 50ms   # First child
  stagger-2: 100ms  # Second child
  stagger-3: 150ms  # Third child
  stagger-4: 200ms  # Fourth child
  stagger-5: 250ms  # Fifth child
```

---

## Component Hierarchy

### Primitive Categorization (18 Total)

#### Tier 1: Foundation (6 primitives)
Essential building blocks used in 80% of use cases
- **Text** (content display)
- **Button** (primary actions)
- **Card** (content grouping)
- **InputField** (data entry)
- **Stack** (layout)
- **Badge** (status indicators)

#### Tier 2: Interactive (6 primitives)
Input and selection controls
- **CheckItem** (toggles)
- **RadioItem** (exclusive selection)
- **Select** (dropdown menus)
- **Slider** (range selection)
- **NavItem** (navigation)
- **ListItem** (selectable lists)

#### Tier 3: Feedback (6 primitives)
Status, progress, and notifications
- **ProgressBar** (determinate loading)
- **Spinner** (indeterminate loading)
- **Alert** (persistent messages)
- **Toast** (temporary notifications)
- **StatusDot** (connection state)
- **MetricValue** (KPI display)

#### Tier 4: Data (6 primitives)
Charts, tables, complex visualizations
- **Table** (sortable/filterable data)
- **LineChart** (time series)
- **BarChart** (comparisons)
- **PieChart** (proportions)
- **Grid** (responsive layout)
- **Divider** (visual separators)

**Total: 24 primitives (12 existing + 12 new)**

---

## Streaming Protocol Architecture

### Chunk Types

```typescript
type ComponentChunk =
  | { type: 'skeleton'; id: string; kind: PrimitiveKind }
  | { type: 'partial'; id: string; props: Partial<Record<string, unknown>> }
  | { type: 'complete'; id: string; primitive: PolymorphPrimitive }
  | { type: 'update'; id: string; props: Record<string, unknown> }
  | { type: 'remove'; id: string }
```

### Accumulation State Machine

```
EMPTY
  ↓ [receive skeleton]
SKELETON (show loading placeholder)
  ↓ [receive partial]
PARTIAL (show incomplete component)
  ↓ [receive complete]
COMPLETE (show full component with entrance animation)
  ↓ [receive update]
UPDATING (patch props, skip animation)
  ↓ [receive remove]
REMOVED (fade out, cleanup)
```

---

## Event System Architecture

### Event Handler Props (All Primitives)

```typescript
interface PrimitiveEventHandlers {
  onClick?: (data: unknown) => void;
  onChange?: (value: unknown) => void;
  onSubmit?: (data: unknown) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

### Action Event Payload

```typescript
interface ActionEvent {
  primitiveId: string;
  actionType: 'click' | 'change' | 'submit';
  actionData: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}
```

### State Persistence Schema

```typescript
interface ComponentState {
  primitiveId: string;
  stateKey: string;
  stateValue: unknown;
  scope: 'session' | 'ping' | 'global';
  updatedAt: number;
}
```

---

## Theme System Architecture

### Theme Definition Schema

```typescript
interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark' | 'auto';
  tokens: {
    colors: {
      semantic: SemanticColors;
      gray: ColorScale;
      accent: ColorScale;
    };
    spacing: SpacingScale;
    typography: TypographyTokens;
    shadows: ShadowTokens;
    radius: RadiusTokens;
    animation: AnimationTokens;
  };
}
```

### Theme Presets (9 Total)

1. **Enterprise** (Default)
   - Light mode: Clean whites, subtle grays, blue accent
   - Dark mode: Charcoal backgrounds, medium contrast
   - Use case: Business dashboards, SaaS products

2. **Terminal Swiss** (Current AgentPing)
   - Dark only, monospace font, neon green accent
   - Use case: Developer tools, CLI dashboards

3. **Skynet** (GitHub-inspired)
   - Dark mode: GitHub dark theme colors
   - Light mode: GitHub light theme colors
   - Use case: Code-related UIs

4. **System** (OS-native)
   - Auto-detects OS light/dark preference
   - Uses system fonts, neutral colors
   - Use case: Native-feeling desktop apps

5. **Emerald**
   - Green accent, nature-inspired palette
   - Light/dark modes
   - Use case: Sustainability, health apps

6. **Violet**
   - Purple accent, creative palette
   - Light/dark modes
   - Use case: Creative tools, design apps

7. **Rose**
   - Pink accent, warm palette
   - Light/dark modes
   - Use case: Consumer apps, lifestyle

8. **Amber**
   - Orange accent, energetic palette
   - Light/dark modes
   - Use case: Productivity, focus apps

9. **Monochrome**
   - Grayscale only, high contrast
   - Light/dark modes
   - Use case: Accessibility, minimal aesthetic

---

## File Structure (Updated)

```
community/agentping/packages/canvas/src/
├── polymorph/
│   ├── primitives.ts           # 24 primitive factories
│   ├── types.ts                # Core types + event handlers
│   ├── sizes.ts                # Size tokens (sm/md/lg)
│   │
│   ├── tokens/                 # NEW: Design token system
│   │   ├── index.ts
│   │   ├── colors.ts           # Semantic + scale definitions
│   │   ├── spacing.ts          # 4px-based scale
│   │   ├── typography.ts       # Font stacks, sizes, weights
│   │   ├── shadows.ts          # Elevation system
│   │   ├── radius.ts           # Border radius scale
│   │   └── animation.ts        # Durations, easings, delays
│   │
│   ├── themes/                 # NEW: Theme presets
│   │   ├── index.ts
│   │   ├── enterprise.ts       # Default professional theme
│   │   ├── terminal-swiss.ts   # Current cyber theme
│   │   ├── skynet.ts           # GitHub-inspired
│   │   ├── system.ts           # OS-native
│   │   ├── emerald.ts
│   │   ├── violet.ts
│   │   ├── rose.ts
│   │   ├── amber.ts
│   │   └── monochrome.ts
│   │
│   ├── streaming/              # NEW: Progressive render
│   │   ├── index.ts
│   │   ├── chunk-protocol.ts   # Chunk type definitions
│   │   ├── accumulator.ts      # State machine
│   │   └── skeleton.ts         # Loading placeholders
│   │
│   ├── state/                  # NEW: Component state
│   │   ├── index.ts
│   │   ├── store.ts            # Key-value persistence
│   │   └── hooks.ts            # useAgentPingState
│   │
│   ├── renderers/
│   │   ├── html.ts             # Enhanced with tokens
│   │   ├── react.ts            # Hook integration
│   │   └── pencil.ts           # Token-aware operations
│   │
│   └── templates/              # Existing templates
│       ├── design.ts
│       ├── data.ts
│       ├── concept.ts
│       └── critique.ts
```

---

## Navigation Structure (User-Facing)

### Studio App: Component Gallery View [NEW]

```
Studio Sidebar
├── Pings (existing)
├── Gallery [NEW]
│   ├── Foundation
│   ├── Interactive
│   ├── Feedback
│   └── Data
├── Themes [NEW]
│   ├── Light Themes
│   ├── Dark Themes
│   └── Custom Builder
└── Settings (existing)
```

### MCP Tool: Theme Selection

```
generate_playground(
  primitives: [...],
  theme: 'enterprise' | 'terminal-swiss' | 'skynet' | ...,
  mode: 'light' | 'dark' | 'auto',
  streaming: boolean
)
```

---

## Key Architectural Decisions

### Decision 1: Token-First Design
**Rationale:** All visual properties must derive from design tokens, not hardcoded values
**Impact:** Themes become trivial to add/swap; consistency is enforced at compile time

### Decision 2: Streaming as Core, Not Addon
**Rationale:** Premium perception requires progressive rendering; make it the default path
**Impact:** Renderers must support both static and streaming modes; chunk protocol is first-class

### Decision 3: Event Handlers on All Primitives
**Rationale:** Interactivity unlocks bidirectional agent-human flow
**Impact:** Every primitive gets optional `onClick`, `onChange`, `onSubmit` props; renderers emit events

### Decision 4: Maintain Multi-Format Parity
**Rationale:** HTML, React, Pencil outputs should all feel equally polished
**Impact:** Design tokens must translate to all 3 renderer targets; consistent visual language

### Decision 5: Professional Default, Cyber Optional
**Rationale:** Enterprise adoption blocked by neon aesthetic
**Impact:** 'Enterprise' theme becomes default; 'Terminal Swiss' is opt-in for developer UIs

---

## Success Metrics

- **Theme adoption:** 60% of pings use non-cyber themes within 3 months
- **Streaming usage:** 80% of pings use streaming mode (when available)
- **Interactivity:** 40% of pings include at least one event handler
- **Component quality:** User rating of "polished" increases from 6/10 → 9/10
- **Multi-format parity:** Pencil output quality rated within 1 point of HTML/React

---

## Next Steps

- **Step 3:** Define user flows for streaming pipeline, theme switching, event handling
- **Step 4:** Design interaction model (click → action → agent response)
- **Step 5:** Establish visual identity (create token values for Enterprise theme)
- **Step 6:** Design 18 core primitives with variants
- **Step 7:** Wireframe GenUI pipeline end-to-end

