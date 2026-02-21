---
title: "spec-component-migration-phase-1-fails"
type: spec
entity: "ui-fails"
stage: crystallized
created: "2026-02-19"
author: "Antigravity"
status: draft
---

# Phase 1: Fixing Failing Components — Behavioral Specification

## Executive Summary
Phase 1 triages and repairs the 69 components with actionable FAILs and 54 structural debt items (38 SHELL + 16 HOLLOW). During repair, we apply the Theme Coherence Effort: identify origin theme, choose best functional variant, polish, and ensure all **4 themes** + Light/Dark modes are supported. ADA compliance is mandatory.

## Context

### Existing State
From `ap-4rs` PASS5 results:
- **69 actionable FAILs**: Components that crash (`js-crash`), have console errors, or produce incorrect output.
  - Examples: `ErrorCluster` (js-crash), `EnrichmentPanel` (HOLLOW), `FieldRenderer` (js-crash + 3 console errors)
- **54 structural debt**: 38 SHELL + 16 HOLLOW
- Components were validated for basic rendering but NOT for Light/Dark mode, theme coherence, CSS best practices, or ARIA/ADA compliance.

### Target State
All 69+54=123 components fully implemented, selecting best functional variant where duplicates exist. All components:
- Render without exceptions or console errors
- Use semantic theme tokens from Phase 0
- Support Light + Dark for all 4 themes (agentping, canvas, sofia, lcars)
- Have structural theme-awareness where warranted (clip-path for sofia, elbow radii for lcars, etc.)
- Have ARIA roles, labels, keyboard navigation, WCAG AA contrast

### Functional Best-of-Breed Selection Examples
| Component | Variant A | Variant B | Decision |
|-----------|----------|----------|----------|
| Loading Indicator | Static (no animation) — broken | 3-dots pulse animation — working | **Pick 3-dots** as primary. Fix/polish static. Both support 4 themes. |
| Voice Orb | CSSOrb (lightweight) | AuroraOrb (WebGL) | **Both coexist**. WebGL primary, CSS fallback. Port from `~/clawd/jarvis/`. |
| Entity Card | Studio raw | Jarvis EntityCard | **Pick Jarvis** (richer, mobile-ready, voice-integrated). |

## User Scenarios (BDD)

### Scenario 1: Repairing crashes with theme coherence
```gherkin
Feature: Component Functional Stability + Theme Coherence
  As a developer
  I want all shared components to render without crashes and be correctly themed
  So that application views reliably mount across all 4 visual themes

  Scenario: Repairing a HOLLOW component
    Given `EnrichmentPanel` was previously an empty typed stub
    When the agent implements its full markup
    Then it identifies the component's origin theme
    And ensures the component uses unified semantic tokens
    And renders correctly in agentping, canvas, sofia, AND lcars themes (both Light and Dark)
    And has proper ARIA labels for interactive elements
```

## Behavioral Specification

### Inputs
- Phase 0 global theme tokens (unified contract)
- 69 FAIL + 54 structural debt component files from `packages/ui/src/components/migrations/`
- Beads database for tracking

### Processing (Per Component)
1. **Theme Coherence Check**: Identify origin → ensure global CSS has tokens for it → assess structural variation
2. **Best-of-Breed Merge**: If multiple variants exist, select best functional pattern. Fix/polish alternatives.
3. **Implement**: Repair js-crashes, fill HOLLOW/SHELL stubs with real markup
4. **ADA Compliance**: ARIA roles, labels, keyboard focus, WCAG AA contrast (4.5:1 normal, 3:1 large text), 44px touch targets for LCARS mobile
5. **Strip hardcoded styles**: Replace `bg-zinc-900` → `bg-background`, `text-slate-400` → `text-muted-foreground`, remove inline styles
6. **Beads Tracking**: Update `bd` bead with evidence. NO CSV/TXT sidecars.
7. **Human Review**: Present batches for user sign-off

### Outputs
- 123 repaired, themed, accessible components in `@kingly/ui`
- 123 beads updated with evidence
- Storybook stories updated across 4 themes × 2 modes

## Contract

### Dependencies
- Phase 0 completed and approved

### Integration Points
- `packages/ui`

### Breaking Changes
- HOLLOW/SHELL stubs will now carry full functional implementations

## BD Task Decomposition

### Epic Mapping
| Epic ID | Title | Scope | Success Signal |
|---------|-------|-------|----------------|
| `epic-mig-phase-1` | Fixing Fails | 69 FAIL + 54 structural debt | All render clean in 4 themes × 2 modes |

### Task Breakdown
Tasks mapped 1:1 from the 123 beads.

### Dependency Ordering
Phase 0 must be 100% complete and user-approved.

## Success Criteria
- Zero js-crashes, zero HOLLOW/SHELL renders
- Best functional variant selected and polished
- All components QA'd across 4 themes × 2 modes
- ARIA compliance verified

## Rollback Plan
### Rollback Trigger
Component repair breaks existing app logic.
### Rollback Steps
1. `git restore` affected files.
2. Re-open corresponding bead.
