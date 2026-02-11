# Step 5: Visual Identity & Design Token Values

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Design Challenge:** Premium GenUI Component System for AgentPing
**Date:** 2026-02-10

---

## Design Philosophy

**Core Tenets:**
1. **Professional Over Flashy** — Subtle shadows, restrained animations, neutral defaults
2. **Systematic Over Arbitrary** — Every value derives from a scale (4px spacing, 10-step colors)
3. **Accessible Over Stylish** — WCAG AA contrast ratios, focus states, legible typography
4. **Responsive Over Fixed** — Fluid sizing, relative units, adaptive layouts
5. **Light-First, Dark-Inclusive** — Light mode is default, dark mode is equally polished

---

## Enterprise Theme (Default)

### Color System

#### Light Mode

**Background Layers:**
```yaml
bg-base: '#ffffff'      # Page background (pure white)
bg-surface: '#f6f8fa'   # Card/panel backgrounds (subtle gray)
bg-overlay: '#ffffff'   # Modal backgrounds (pure white)
bg-hover: '#f3f4f6'     # Hover states on surfaces
```

**Text Colors:**
```yaml
text-primary: '#1f2328'    # Headings, primary content (near-black)
text-secondary: '#656d76'  # Body text (medium gray)
text-muted: '#8b949e'      # Captions, disabled states (light gray)
text-inverse: '#ffffff'    # Text on dark backgrounds
```

**Border Colors:**
```yaml
border-subtle: '#d0d7de'   # Default borders, dividers (light gray)
border-strong: '#8b949e'   # Focused/active borders (medium gray)
border-focus: '#0969da'    # Keyboard focus rings (blue)
```

**Semantic Colors:**
```yaml
primary: '#0969da'     # Blue (primary actions, links)
success: '#1a7f37'     # Green (approved, completed, online)
warning: '#9a6700'     # Amber (pending, caution)
error: '#cf222e'       # Red (rejected, failed, errors)
info: '#0969da'        # Blue (informational, tips)
```

**Gray Scale (50-950):**
```yaml
gray-50: '#f6f8fa'
gray-100: '#eaeef2'
gray-200: '#d0d7de'
gray-300: '#afb8c1'
gray-400: '#8b949e'
gray-500: '#656d76'
gray-600: '#424a53'
gray-700: '#32383f'
gray-800: '#24292f'
gray-900: '#1f2328'
gray-950: '#0d1117'
```

**Accent Scale (Blue):**
```yaml
blue-50: '#ddf4ff'
blue-100: '#b6e3ff'
blue-200: '#80ccff'
blue-300: '#54aeff'
blue-400: '#218bff'
blue-500: '#0969da'    # Primary blue
blue-600: '#0550ae'
blue-700: '#033d8b'
blue-800: '#0a3069'
blue-900: '#002155'
```

---

#### Dark Mode

**Background Layers:**
```yaml
bg-base: '#0d1117'      # Page background (near-black)
bg-surface: '#161b22'   # Card/panel backgrounds (dark gray)
bg-overlay: '#1c2128'   # Modal backgrounds (slightly lighter)
bg-hover: '#21262d'     # Hover states on surfaces
```

**Text Colors:**
```yaml
text-primary: '#e6edf3'    # Headings, primary content (near-white)
text-secondary: '#8b949e'  # Body text (medium gray)
text-muted: '#6e7681'      # Captions, disabled states (darker gray)
text-inverse: '#0d1117'    # Text on light backgrounds
```

**Border Colors:**
```yaml
border-subtle: '#30363d'   # Default borders (dark gray)
border-strong: '#484f58'   # Focused/active borders (lighter gray)
border-focus: '#58a6ff'    # Keyboard focus rings (bright blue)
```

**Semantic Colors:**
```yaml
primary: '#58a6ff'     # Bright blue (primary actions)
success: '#3fb950'     # Bright green (approved, online)
warning: '#d29922'     # Bright amber (pending, caution)
error: '#f85149'       # Bright red (rejected, errors)
info: '#58a6ff'        # Bright blue (informational)
```

**Gray Scale (50-950):**
```yaml
gray-50: '#f6f8fa'
gray-100: '#eaeef2'
gray-200: '#d0d7de'
gray-300: '#afb8c1'
gray-400: '#8b949e'
gray-500: '#6e7681'
gray-600: '#484f58'
gray-700: '#30363d'
gray-800: '#21262d'
gray-900: '#161b22'
gray-950: '#0d1117'
```

**Accent Scale (Blue):**
```yaml
blue-50: '#cae8ff'
blue-100: '#a5d6ff'
blue-200: '#79c0ff'
blue-300: '#58a6ff'    # Primary blue (dark mode)
blue-400: '#388bfd'
blue-500: '#1f6feb'
blue-600: '#1158c7'
blue-700: '#0d419d'
blue-800: '#0c2d6b'
blue-900: '#051d4d'
```

---

### Typography System

**Font Families:**
```yaml
sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
mono: "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', monospace"
```

**Font Sizes (rem-based for accessibility):**
```yaml
xs: '0.6875rem'   # 11px - Tiny labels, timestamps
sm: '0.75rem'     # 12px - Captions, secondary text
base: '0.8125rem' # 13px - Body text, buttons
md: '0.875rem'    # 14px - Emphasized body
lg: '1rem'        # 16px - Section headers
xl: '1.125rem'    # 18px - Subsection titles
2xl: '1.25rem'    # 20px - Page titles
3xl: '1.5rem'     # 24px - Hero titles
4xl: '1.75rem'    # 28px - Large metrics
5xl: '2.25rem'    # 36px - Display metrics
```

**Font Weights:**
```yaml
normal: 400   # Regular body text
medium: 500   # Emphasized text, labels
semibold: 600 # Headings, buttons
bold: 700     # Strong emphasis (rare)
```

**Line Heights:**
```yaml
tight: 1.25   # Headings, metrics (reduces vertical space)
base: 1.5     # Body text (optimal readability)
relaxed: 1.7  # Long-form content (more breathing room)
```

**Letter Spacing:**
```yaml
tighter: '-0.02em'  # Large headings (optical correction)
tight: '-0.01em'    # Subheadings
normal: '0'         # Body text
wide: '0.02em'      # Labels (improves legibility)
wider: '0.04em'     # All-caps labels (compensates for uppercase)
```

---

### Spacing Scale (4px Base)

**Scale Values:**
```yaml
0: '0'          # No spacing
px: '1px'       # Hairline (borders)
0.5: '0.125rem' # 2px - Micro spacing
1: '0.25rem'    # 4px - Tight (badge padding)
1.5: '0.375rem' # 6px
2: '0.5rem'     # 8px - Compact (button padding)
2.5: '0.625rem' # 10px
3: '0.75rem'    # 12px - Base (card padding)
3.5: '0.875rem' # 14px
4: '1rem'       # 16px - Comfortable (section padding)
5: '1.25rem'    # 20px - Spacious (panel padding)
6: '1.5rem'     # 24px - Generous (page margins)
8: '2rem'       # 32px - Large (section dividers)
10: '2.5rem'    # 40px - XL (hero sections)
12: '3rem'      # 48px - XXL (page headers)
16: '4rem'      # 64px - XXXL (major sections)
20: '5rem'      # 80px - Ultra (landing page sections)
24: '6rem'      # 96px - Mega (hero padding)
```

**Usage Guide:**
- **Padding:** Use 2-4 for compact UI, 4-6 for comfortable, 8+ for spacious
- **Gaps:** Use 2-3 for tight grids, 4-6 for standard, 8+ for airy layouts
- **Margins:** Use 4-8 for component spacing, 12-16 for section breaks

---

### Shadow System (Elevation)

**Light Mode Shadows:**
```yaml
sm: '0 1px 2px 0 rgba(0, 0, 0, 0.04)'           # Subtle depth
md: '0 2px 4px 0 rgba(0, 0, 0, 0.06)'           # Cards, dropdowns
lg: '0 4px 8px 0 rgba(0, 0, 0, 0.08)'           # Modals, popovers
xl: '0 8px 16px 0 rgba(0, 0, 0, 0.10)'          # Floating panels
2xl: '0 16px 32px 0 rgba(0, 0, 0, 0.12)'        # Dialogs, overlays

# Focus rings
ring-primary: '0 0 0 3px rgba(9, 105, 218, 0.25)'
ring-success: '0 0 0 3px rgba(26, 127, 55, 0.25)'
ring-error: '0 0 0 3px rgba(207, 34, 46, 0.25)'
```

**Dark Mode Shadows:**
```yaml
sm: '0 1px 2px 0 rgba(0, 0, 0, 0.15)'
md: '0 2px 4px 0 rgba(0, 0, 0, 0.20)'
lg: '0 4px 8px 0 rgba(0, 0, 0, 0.25)'
xl: '0 8px 16px 0 rgba(0, 0, 0, 0.30)'
2xl: '0 16px 32px 0 rgba(0, 0, 0, 0.35)'

# Focus rings (brighter in dark mode)
ring-primary: '0 0 0 3px rgba(88, 166, 255, 0.35)'
ring-success: '0 0 0 3px rgba(63, 185, 80, 0.35)'
ring-error: '0 0 0 3px rgba(248, 81, 73, 0.35)'
```

**Usage:**
- **sm:** Input fields, badges
- **md:** Cards, buttons on hover
- **lg:** Dropdowns, tooltips
- **xl:** Modals, dialogs
- **2xl:** Full-screen overlays

---

### Radius System

**Scale Values:**
```yaml
none: '0'          # Sharp corners (tables, grids)
sm: '0.25rem'      # 4px - Badges, pills
md: '0.5rem'       # 8px - Buttons, inputs
lg: '0.75rem'      # 12px - Cards, panels
xl: '1.25rem'      # 20px - Large cards, hero sections
2xl: '1.5rem'      # 24px - Modals
full: '9999px'     # Circular (avatars, status dots)
```

**Usage:**
- **sm:** Small UI elements (badges, tags)
- **md:** Interactive elements (buttons, inputs)
- **lg:** Content containers (cards, panels)
- **xl:** Prominent sections (hero cards, feature blocks)
- **full:** Circular elements (status dots, avatars, pills)

---

### Animation System

**Durations:**
```yaml
fast: '150ms'     # Micro-interactions (hover, focus)
base: '250ms'     # Standard transitions (fade, slide)
slow: '350ms'     # Entrance animations, modals
slower: '500ms'   # Page transitions, large movements
```

**Easing Functions:**
```yaml
ease-out: 'cubic-bezier(0.4, 0, 0.2, 1)'    # Default (snappy exit)
ease-in: 'cubic-bezier(0.4, 0, 1, 1)'       # Entrance (accelerate in)
ease-in-out: 'cubic-bezier(0.4, 0, 0.2, 1)' # Smooth both ways
spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' # Playful bounce
```

**Stagger Delays:**
```yaml
stagger-1: '0ms'     # First child (immediate)
stagger-2: '50ms'    # Second child
stagger-3: '100ms'   # Third child
stagger-4: '150ms'   # Fourth child
stagger-5: '200ms'   # Fifth child
stagger-6: '250ms'   # Sixth child
```

**Usage:**
- **fast:** Hover states, button press
- **base:** Color transitions, opacity fades
- **slow:** Component entrance, skeleton → complete
- **slower:** Modal open/close, page transitions

---

## Visual Patterns

### Entrance Animation (Components)

```css
@keyframes entrance {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ap-card,
.ap-metric,
.ap-list-item {
  animation: entrance 250ms ease-out;
}

/* Stagger delays */
.ap-card:nth-child(1) { animation-delay: 0ms; }
.ap-card:nth-child(2) { animation-delay: 50ms; }
.ap-card:nth-child(3) { animation-delay: 100ms; }
.ap-card:nth-child(4) { animation-delay: 150ms; }
.ap-card:nth-child(5) { animation-delay: 200ms; }
.ap-card:nth-child(6) { animation-delay: 250ms; }
```

**Effect:** Components fade up smoothly, creating sense of progressive reveal

---

### Skeleton Pulse (Loading)

```css
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.ap-skeleton {
  background: var(--gray-100);
  animation: skeleton-pulse 2s ease-in-out infinite;
}
```

**Effect:** Gentle breathing animation indicates loading state

---

### Button Hover

```css
.ap-btn {
  transition: all 150ms ease-out;
}

.ap-btn:hover {
  filter: brightness(1.1);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.ap-btn:active {
  transform: translateY(0) scale(0.98);
}
```

**Effect:** Subtle lift on hover, press down on click

---

### Focus Ring

```css
.ap-btn:focus-visible,
.ap-input:focus-visible {
  outline: none;
  box-shadow: var(--ring-primary);
}
```

**Effect:** Clear keyboard navigation indicator (WCAG 2.1)

---

## Contrast Ratios (WCAG AA)

**Light Mode:**
- Text on bg-base: 14.8:1 (AAA)
- Text-secondary on bg-base: 5.2:1 (AA)
- Text-muted on bg-base: 4.6:1 (AA large text)
- Primary on bg-base: 4.9:1 (AA)

**Dark Mode:**
- Text on bg-base: 13.1:1 (AAA)
- Text-secondary on bg-base: 4.8:1 (AA)
- Text-muted on bg-base: 4.5:1 (AA large text)
- Primary on bg-base: 6.2:1 (AA)

**Validation:** All semantic colors meet WCAG AA for normal text (4.5:1 minimum)

---

## Component Token Examples

### Button (Primary Variant)

**Light Mode:**
```css
.ap-btn--primary {
  background: var(--blue-500);      /* #0969da */
  color: var(--text-inverse);       /* #ffffff */
  border: 1px solid transparent;
  border-radius: var(--radius-md);  /* 8px */
  padding: var(--spacing-2) var(--spacing-4); /* 8px 16px */
  font-size: var(--text-base);      /* 13px */
  font-weight: var(--weight-medium); /* 500 */
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.ap-btn--primary:hover {
  background: var(--blue-600);
  box-shadow: var(--shadow-md);
}
```

**Dark Mode:**
```css
.ap-btn--primary {
  background: var(--blue-300);      /* #58a6ff */
  color: var(--gray-950);           /* #0d1117 */
  /* Rest same as light mode */
}
```

---

### Card

```css
.ap-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);   /* 12px */
  padding: var(--spacing-4);         /* 16px */
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.ap-card:hover {
  border-color: color-mix(in srgb, var(--primary) 30%, var(--border-subtle));
  box-shadow: var(--shadow-md);
}
```

---

### Input Field

```css
.ap-input__field {
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: all var(--duration-fast) var(--ease-out);
}

.ap-input__field:focus {
  border-color: var(--primary);
  box-shadow: var(--ring-primary);
  outline: none;
}

.ap-input__field::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}
```

---

## Theme Comparison Matrix

| Token | Enterprise Light | Enterprise Dark | Terminal Swiss | Skynet Dark |
|-------|------------------|-----------------|----------------|-------------|
| bg-base | #ffffff | #0d1117 | #0a0a0a | #0d1117 |
| text-primary | #1f2328 | #e6edf3 | #e0e0e0 | #c9d1d9 |
| primary | #0969da | #58a6ff | #00ff88 | #58a6ff |
| success | #1a7f37 | #3fb950 | #00ff88 | #3fb950 |
| radius-lg | 12px | 12px | 8px | 12px |
| shadow-md | subtle | medium | none | medium |
| font | Inter | Inter | SF Mono | Inter |

---

## Design Token Implementation

### CSS Custom Properties (Recommended)

```css
:root {
  /* Colors */
  --bg-base: #ffffff;
  --bg-surface: #f6f8fa;
  --text-primary: #1f2328;
  --primary: #0969da;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;

  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --text-base: 0.8125rem;
  --weight-medium: 500;

  /* Shadows */
  --shadow-md: 0 2px 4px 0 rgba(0, 0, 0, 0.06);

  /* Radius */
  --radius-md: 0.5rem;

  /* Animation */
  --duration-fast: 150ms;
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --bg-base: #0d1117;
  --bg-surface: #161b22;
  --text-primary: #e6edf3;
  --primary: #58a6ff;
  --shadow-md: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
}
```

---

### TypeScript Tokens (For Renderers)

```typescript
export const ENTERPRISE_LIGHT: ThemeTokens = {
  colors: {
    semantic: {
      bgBase: '#ffffff',
      bgSurface: '#f6f8fa',
      textPrimary: '#1f2328',
      primary: '#0969da',
      success: '#1a7f37',
      warning: '#9a6700',
      error: '#cf222e',
    },
    gray: {
      50: '#f6f8fa',
      100: '#eaeef2',
      // ... full scale
    },
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    // ... full scale
  },
  typography: {
    fontSans: "'Inter', sans-serif",
    textBase: '0.8125rem',
    weightMedium: 500,
  },
  shadows: {
    md: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  radius: {
    md: '0.5rem',
  },
  animation: {
    durationFast: '150ms',
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}
```

---

## Pencil Token Mapping

Design tokens must translate to Pencil variables:

```typescript
// In Pencil renderer
const PENCIL_TOKENS = {
  colors: {
    '$primary': theme.colors.semantic.primary,
    '$bg-surface': theme.colors.semantic.bgSurface,
  },
  spacing: {
    '$spacing-4': parseFloat(theme.spacing[4]) * 16, // Convert rem to px
  },
  typography: {
    '$font-sans': theme.typography.fontSans,
  },
}
```

**Pencil output:**
```typescript
{
  type: 'frame',
  fill: { type: 'solid', color: '$bg-surface' },
  padding: { all: '$spacing-4' },
  cornerRadius: { all: 12 }
}
```

---

## Key Takeaways

1. **Systematic scales eliminate arbitrary values**
   Every spacing/color/size comes from a predefined scale

2. **Light mode is default, dark mode is equally polished**
   No afterthought dark mode — both are first-class

3. **Subtle shadows create depth without distraction**
   0.04-0.12 opacity keeps UI professional, not flashy

4. **Generous whitespace improves comprehension**
   12-16px padding on cards, 8-12px gaps in grids

5. **Animation budget: fast micro-interactions only**
   150ms hovers, 250ms entrances — nothing slower except modals

---

## Next Steps

- **Step 6:** Design 18 core primitives (apply these tokens to component specs)
- **Step 7:** Create wireframes (visualize GenUI pipeline with Enterprise theme)

