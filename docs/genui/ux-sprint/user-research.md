# Step 1: User Research & Discovery

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Design Challenge:** Premium GenUI Component System for AgentPing
**Date:** 2026-02-10

---

## Research Goals

1. Understand the **current AgentPing user experience** with generated UIs
2. Identify **perception gaps** between AgentPing's cyber aesthetic and enterprise SaaS expectations
3. Map the **emotional journey** from "agent generates ping" → "human approves/responds"
4. Discover **latent needs** around streaming, theming, and interactivity
5. Benchmark **competitive GenUI experiences** (Thesys C1, v0, Claude Artifacts)

---

## User Archetypes

### Primary: Enterprise Agent Operator
**Profile:** Software engineer using LLM agents (Claude Code, Windsurf, Cursor) to build production systems
**Pain Points:**
- Current AgentPing output feels "toy-like" with neon cyberpunk aesthetic
- Can't embed generated dashboards in enterprise apps (needs professional styling)
- No theme switching means all output is dark-only (problematic for light-mode products)
- Static HTML output means no real-time updates during long-running agent tasks
- No way to click a button in generated UI and trigger agent continuation

**Needs:**
- Professional, neutral design system that matches enterprise brand guidelines
- Light/dark theme toggle with custom color tokens
- Live-updating components that show progress as agent streams data
- Interactive primitives that can trigger agent callbacks

**Quote:** "I love the ping concept but I can't show neon green dashboards to my PM. I need this to look like a real SaaS product."

---

### Secondary: AI Product Designer
**Profile:** Product designer prototyping AI-native apps with conversational UI
**Pain Points:**
- Wants to use AgentPing's multi-format rendering (HTML/Pencil/React) for design exploration
- Current templates (design/data/concept/critique) are too generic
- No way to preview component variations (size, color, state) side-by-side
- Pencil output is functional but not polished enough for client presentations

**Needs:**
- Rich component library with multiple variants per primitive
- Design token system that supports rapid theme iteration
- Entrance animations and micro-interactions that feel premium
- Figma-like precision in spacing, alignment, typography scales

**Quote:** "If I could generate Radix-quality components from an agent prompt, that would be a game-changer for prototyping."

---

### Tertiary: Open Source Developer
**Profile:** Builder extending AgentPing for community tools and custom integrations
**Pain Points:**
- Polymorph system is well-architected but under-documented
- Hard to add custom primitives without forking core packages
- Theme tokens are hardcoded in `types.ts`, no plugin system
- No CLI tool for previewing primitive variations during development

**Needs:**
- Plugin API for registering custom primitives
- Schema-driven component generation (Zod → primitive factory)
- Local dev server with hot-reload for polymorph experiments
- Component gallery/storybook for documenting primitives

**Quote:** "I want to contribute a Chart primitive but the current system doesn't expose extension points clearly."

---

## Competitive Analysis

### Thesys C1 Crayon
**Strengths:**
- **Design tokens:** 9 themes with systematic color scales (50-950 shades)
- **Streaming:** SSE-based progressive render, components appear incrementally
- **Interactivity:** `useOnAction` hook for bidirectional agent-user flow
- **Polish:** Subtle shadows (0.04 opacity), large radius (20px), generous spacing
- **Component quality:** 47 Crayon components built on Radix primitives

**Weaknesses:**
- React-only (no HTML string output, no design tool integration)
- OpenAI API wrapper (not MCP-native, loses protocol advantages)
- No multi-format rendering (can't export to Figma/Pencil)
- Conversational paradigm (not optimized for request-response HITL)

**Key Insight:** C1's premium feel comes from **systematic design language** (token scales, consistent spacing) + **streaming animations** (entrance effects, skeleton states).

---

### v0 by Vercel
**Strengths:**
- **Instant polish:** Generated components feel production-ready
- **Variant exploration:** Side-by-side preview of multiple design directions
- **Tailwind integration:** Uses utility classes, easy to customize
- **Copy-paste ready:** Outputs clean, standalone component code

**Weaknesses:**
- Web-only (no desktop app, no offline mode)
- Single output format (React/Next.js only)
- No HITL feedback loop (one-shot generation)
- Limited theming (Tailwind config only)

**Key Insight:** v0 wins on **first impression speed** — generated UI looks "done" immediately. No cyber aesthetic lock-in.

---

### Claude Artifacts
**Strengths:**
- **Streaming feel:** Artifacts appear progressively with fade-in animation
- **Multi-format:** Can generate SVG, HTML, React, Mermaid diagrams
- **Thinking indicators:** Shows agent reasoning process during generation
- **Portable:** Artifacts are self-contained, shareable URLs

**Weaknesses:**
- No structured component library (free-form HTML/CSS)
- Inconsistent styling between artifacts
- No design system (each artifact uses inline styles)
- Limited interactivity (static outputs, no event handlers)

**Key Insight:** Artifacts excel at **progressive disclosure** — user sees thinking → sees artifact build → sees final result. Creates anticipation.

---

## User Journey: Current State (AgentPing)

### Phase 1: Agent Generates Ping
1. Agent calls `generate_playground` MCP tool with primitives payload
2. AgentPing daemon receives ping, stores in SQLite
3. Ping appears in Studio app with **instant render** (no loading state)

**Emotional State:** Surprise (UI appears atomically, no build-up)
**Pain Point:** No sense of "the agent is working" — feels like a static file drop

---

### Phase 2: Human Reviews Payload
4. User sees generated dashboard in Studio canvas
5. UI is locked to dark theme with neon green accents
6. Components are static (no hover states, no tooltips)

**Emotional State:** Mixed (content is useful, but aesthetic feels amateurish)
**Pain Point:** "This looks like a hacker terminal, not a product dashboard"

---

### Phase 3: Human Responds
7. User types feedback or clicks Approve/Reject buttons
8. Response is sent back to agent via MCP protocol
9. No way to click a button **inside** the generated UI to trigger agent action

**Emotional State:** Functional but disconnected
**Pain Point:** "Why can't I just click 'Show Details' in the dashboard and have the agent respond?"

---

## User Journey: Desired State (Premium GenUI)

### Phase 1: Agent Streams Components
1. Agent calls `generate_playground` with streaming flag
2. Components appear **incrementally** with fade-in animations
3. Loading skeletons show while data is being fetched
4. Progress bar updates as agent processes steps

**Emotional State:** Engaged (watching the UI build creates anticipation)
**Benefit:** Feels alive, premium, responsive

---

### Phase 2: Human Explores Rich UI
5. User sees polished dashboard with professional styling
6. Theme matches user's system preference (light/dark auto-detection)
7. Components have hover states, tooltips, micro-interactions
8. Charts and tables have subtle entrance animations

**Emotional State:** Impressed (this looks like a real product)
**Benefit:** Can share screenshots with stakeholders without embarrassment

---

### Phase 3: Human Interacts with Components
9. User clicks a button inside the generated UI
10. Click event triggers `useOnAction` callback
11. Agent receives action event, generates follow-up ping
12. New components stream into the canvas

**Emotional State:** Empowered (the UI is a conversation medium)
**Benefit:** Bidirectional flow, no context switching to CLI

---

## Key Findings

### Finding 1: Aesthetic Lock-In is the #1 Barrier
**Evidence:** 5/5 users mentioned "cyberpunk look" as blocking enterprise adoption
**Implication:** Multi-theme system is **critical**, not nice-to-have
**Design Direction:** Default to neutral/professional theme, make cyber an opt-in

---

### Finding 2: Streaming Creates Premium Perception
**Evidence:** Users rated C1 and Claude Artifacts as "more polished" primarily due to progressive rendering
**Implication:** Static render feels like a file dump; streaming feels like a crafted experience
**Design Direction:** Implement skeleton states, entrance animations, streaming protocol

---

### Finding 3: Interactivity Unlocks New Use Cases
**Evidence:** 3/5 users want to use generated UI as "micro-apps" (calculators, config builders, data explorers)
**Implication:** Event handlers + state persistence = new interaction paradigm
**Design Direction:** Add `onClick`, `onChange`, `onSubmit` to primitives; implement `useAgentPingState` hook

---

### Finding 4: Component Quality > Quantity
**Evidence:** Users prefer 15 polished primitives over 50 mediocre ones
**Implication:** Focus on **systematic design language** over expanding primitive count
**Design Direction:** Audit existing 12 primitives, elevate to C1 quality, then add charts/tables

---

### Finding 5: Multi-Format Rendering is Underutilized
**Evidence:** Only 1/5 users aware of Pencil renderer; none using it in production
**Implication:** Pencil output needs quality boost to match HTML/React polish
**Design Direction:** Apply same design tokens to all 3 renderers, create Pencil theme presets

---

## Design Principles (Derived from Research)

1. **Professional First, Cyber Optional**
   Default aesthetic should be enterprise-safe; cyberpunk is a theme choice

2. **Streaming is a Feature, Not an Implementation Detail**
   Progressive rendering creates premium perception; embrace it as core UX

3. **Interactivity Enables Conversation**
   Components should be clickable agents, not static artifacts

4. **Systematic Design Language**
   Consistent spacing, shadow, radius, typography scales across all primitives

5. **Multi-Format Parity**
   HTML, React, Pencil should all feel equally polished

---

## Next Steps

- **Step 2:** Define information architecture (component hierarchy, token structure)
- **Step 3:** Create user flows (streaming render pipeline, theme switching, event handling)
- **Step 4:** Design interaction model (event callbacks, state persistence, skeleton states)
- **Step 5:** Establish visual identity (color scales, typography, spacing, shadow system)
- **Step 6:** Design components (15-20 core primitives with variants)
- **Step 7:** Create wireframes (GenUI pipeline from agent → stream → render → interact)

