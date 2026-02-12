# AgentPing GenUI Design System Research

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

## Executive Summary

AgentPing needs to move from a single cyber-locked aesthetic to a multi-theme design token system that matches Thesys C1 Crayon's quality (9 themes). We've extracted 4 premium Pencil style guides as the foundation.

## Theme Map: Pencil Style Guides → AgentPing Themes

### Theme 1: "Terminal" (Dark Cyber)
**Pencil Guide**: Terminal × Minimal Mobile Dashboard
**Vibe**: Developer tools, CLI-native, hacker aesthetic
**DNA**: JetBrains Mono + Inter, cyan accent (#22D3EE), deep slate (#0A0F1C), no shadows, terminal characters (✓ ◐ ○)
**AgentPing equivalent**: Current Kingly/Sofia themes — ALREADY EXISTS, needs token extraction
**Best for**: Developer-facing tools, code output, system monitoring

**Key Tokens**:
- bg-primary: #0A0F1C
- bg-surface: #1E293B
- accent: #22D3EE
- text-primary: #FFFFFF
- text-secondary: #94A3B8
- radius-lg: 12px
- font-display: JetBrains Mono
- font-body: Inter
- shadow: NONE (flat depth via layered fills)

### Theme 2: "Zen" (Light Minimal)
**Pencil Guide**: Japanese Swiss Mobile Dashboard
**Vibe**: Wellness, productivity, lifestyle — serene precision
**DNA**: Outfit semibold, coral accent (#E85A4F), warm ivory (#FCFBF9), whisper-thin 1px borders, generous whitespace
**AgentPing equivalent**: MISSING — no light theme exists
**Best for**: Consumer-facing apps, dashboards for non-technical users, reports

**Key Tokens**:
- bg-primary: #FCFBF9
- bg-surface: #FFFFFF
- accent: #E85A4F
- text-primary: #1E2432
- text-secondary: #8A8A8A
- border: 1px solid #EFEFEF
- radius-lg: 16px
- font-display: Outfit
- shadow: NONE (border-defined depth)

### Theme 3: "Executive" (Monochrome Editorial)
**Pencil Guide**: Monochrome Expressive Web Dashboard
**Vibe**: Financial reports, executive dashboards, editorial platforms
**DNA**: DM Serif Display + Inter, pure monochrome (zero accent colors), sharp corners (0px radius), black/white banding
**AgentPing equivalent**: MISSING — no serif/editorial theme
**Best for**: Financial data, executive reports, premium SaaS

**Key Tokens**:
- bg-primary: #FFFFFF
- bg-header: #0A0A0A
- accent: NONE (pure monochrome)
- text-primary: #0A0A0A
- text-secondary: #999999
- border: 1px solid #E0E0E0
- radius: 0px (ALL elements)
- font-display: DM Serif Display
- font-body: Inter
- shadow: NONE

### Theme 4: "Neon" (Bold Dark)
**Pencil Guide**: NYC Rebel Mobile Dashboard
**Vibe**: High-energy, urban, rebellious sophistication
**DNA**: Space Grotesk extra-bold + Manrope + Space Mono, electric lime (#C4F82A), zinc surfaces (#18181B), glow effects
**AgentPing equivalent**: PARTIAL — similar energy to Sofia but more refined token system
**Best for**: Fitness, gaming, lifestyle apps, bold data presentations

**Key Tokens**:
- bg-primary: #0A0A0A
- bg-surface: #18181B
- accent: #C4F82A
- text-primary: #FFFFFF
- text-secondary: #A1A1AA
- border: 1px solid #27272A
- radius-xl: 20px
- font-display: Space Grotesk
- font-body: Manrope
- font-mono: Space Mono
- shadow-accent: 0 4px 24px #C4F82A25 (glow)

## Unified Token Architecture

All themes share the same token STRUCTURE — only VALUES change.
Current foundation set is 4 themes; target registration set is 9:

```yaml
tokens:
  # Backgrounds
  bg-primary: <theme-specific>
  bg-surface: <theme-specific>
  bg-elevated: <theme-specific>
  bg-accent: <theme-specific>

  # Text
  text-primary: <theme-specific>
  text-secondary: <theme-specific>
  text-tertiary: <theme-specific>
  text-muted: <theme-specific>
  text-inverted: <theme-specific>

  # Borders
  border-subtle: <theme-specific>
  border-divider: <theme-specific>

  # Accent
  accent-primary: <theme-specific>
  accent-on-dark: <theme-specific>
  accent-on-light: <theme-specific>

  # Typography
  font-display: <theme-specific>
  font-body: <theme-specific>
  font-mono: <theme-specific>

  # Spacing (SHARED across all themes)
  spacing-xs: 4px
  spacing-sm: 8px
  spacing-md: 12px
  spacing-lg: 16px
  spacing-xl: 24px
  spacing-2xl: 32px
  spacing-section: 40px

  # Radius
  radius-sm: <theme-specific>
  radius-md: <theme-specific>
  radius-lg: <theme-specific>
  radius-xl: <theme-specific>
  radius-full: 100px  # SHARED

  # Shadows
  shadow-card: <theme-specific>
  shadow-elevated: <theme-specific>
  shadow-accent: <theme-specific>
```

## Component Token Matrix

Shows how the same component looks across themes:

| Component | Terminal | Zen | Executive | Neon |
|-----------|----------|-----|-----------|------|
| Card bg | #1E293B | #FFFFFF | transparent | #18181B |
| Card border | none | 1px #EFEFEF | 1px #E0E0E0 | 1px #27272A |
| Card radius | 12px | 16px | 0px | 20px |
| Card shadow | none | none | none | none (or glow) |
| Button active | #22D3EE bg | #E85A4F bg | #0A0A0A bg | #C4F82A bg |
| Button text | #0A0F1C | #FFFFFF | #FFFFFF | #0A0A0A |
| Section header | 11px uppercase +2px tracking | 12px uppercase +3px tracking, line-prefix | 28px DM Serif | 20px Space Grotesk 700 |
| Status complete | ✓ cyan | checkbox dark fill | black badge | lime checkbox |
| Status progress | ◐ cyan | coral stroke dot | -- | orange stroke dot |
| Progress viz | horizontal bars | circular day indicators | gray bar chart | circular day indicators with glow |

## Key Insights: Why Thesys Looks Better

1. **Systematic tokens, not arbitrary values** — Every spacing/color/radius derived from a scale

2. **Constraints = quality** — LLM picks from token palette, can't make ugly output

3. **Subtle borders > shadows** — 1px at low opacity, not heavy box-shadows

4. **Generous whitespace** — 40-56px section gaps, 20-28px content padding

5. **Single accent discipline** — ONE vibrant color per theme, everything else neutral

6. **Typography contrast** — Display font (dramatic) vs body font (neutral) creates visual rhythm

7. **Theme-aware rendering** — Same component structure, different token values

8. **No arbitrary colors** — Everything maps to a semantic token

## What AgentPing's Polymorph Renderer Needs

1. **Token resolver layer** — Primitives reference tokens, not hardcoded values

2. **Theme provider** — Inject token set based on active theme

3. **9 registered runtime themes (phased)** — start with the 4 foundation themes (Terminal, Zen, Executive, Neon), then expand to 9 without changing token structure

4. **Component entrance animations** — Not just static render, progressive reveal

5. **Responsive token variants** — Token values can change at breakpoints

6. **Pencil renderer theme support** — .pen files generated with correct theme tokens

## Pencil Integration

AgentPing's Pencil renderer can use Pencil's built-in variable/theme system:

- Define tokens as Pencil variables
- Theme axis phase-1: "Terminal" | "Zen" | "Executive" | "Neon"
- Theme axis target: 9 registered families using the same token schema
- Components reference variables, not hardcoded values
- Same .pen file renders correctly in any theme

## Implementation Roadmap

### Phase 1: Token Extraction (Week 1)
- Extract Terminal theme tokens from existing CSS/design files
- Document Zen, Executive, Neon token values
- Create unified `tokens.yaml` with theme axis

### Phase 2: Component Retrofit (Week 2)
- Audit AgentPing's ComponentCatalog for hardcoded colors/radius/spacing
- Replace with token references
- Add theme-aware CSS variable layer

### Phase 3: Pencil Integration (Week 3)
- Define tokens as Pencil variables
- Create 4 foundation theme variants in Pencil, then expand to 9 registered runtime families
- Test renderer output in each theme

### Phase 4: GenUI Rendering (Week 4)
- Wire theme selector to GenUI renderer
- Add theme parameter to component generation
- Test cross-theme component output

## Validation Checklist

- [ ] All Terminal theme tokens extracted and verified
- [ ] Zen theme CSS tokens documented
- [ ] Executive theme with monochrome palette working
- [ ] Neon theme with glow effects rendering correctly
- [ ] Shared spacing scale applied consistently
- [ ] Component matrix validates across 4 foundation themes, then across 9 registered runtime themes
- [ ] Pencil variables system correctly themed
- [ ] GenUI renderer respects active theme
- [ ] Responsive token variants working at breakpoints

## Sources
- Pencil style guides: Terminal×Minimal, Japanese Swiss, Monochrome Expressive, NYC Rebel
- Superdesign prompt library (355 entries, pending extraction)
- Thesys Crayon design system research
- AgentPing `docs/component-catalog.md` + theme CSS files
