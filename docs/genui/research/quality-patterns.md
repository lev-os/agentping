# Polymorph Quality Patterns: Do's and Don'ts

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Based on Thesys C1 Research**
**For: AgentPing Polymorph Implementation**

---

## The Golden Rule

> **Generate data, not code. Constrain choices, don't constrain creativity.**

The LLM should choose WHICH component to render and WHAT data to show. It should NOT generate HOW to render (HTML/JSX/Svelte code).

---

## Pattern 1: Schema-Driven Component Selection

### ✅ DO: Rich, Descriptive Schemas

```typescript
// GOOD: Detailed description guides LLM selection
const AgentStatusSchema = z.object({
  agents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['online', 'busy', 'offline', 'error']),
    metrics: z.object({
      tasksCompleted: z.number(),
      currentLoad: z.number().min(0).max(100),
    }),
  })),
}).describe(
  "Displays a grid of agent status cards with real-time health indicators. " +
  "Use when: user asks about 'agent status', 'which agents are running', " +
  "'show all agents', or 'agent health'. Shows online/busy/offline states " +
  "with visual indicators (green/yellow/gray). Includes task counts and CPU load. " +
  "Best for: overview queries, system health checks, team dashboards."
);
```

**Why:** The LLM uses the description to match user intent → component. More context = better selection.

### ❌ DON'T: Minimal or Missing Descriptions

```typescript
// BAD: No guidance for LLM
const AgentStatusSchema = z.object({
  agents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
  })),
});  // No .describe()!
```

**Problem:** LLM can't distinguish between AgentStatus, AgentList, AgentCard, etc. Selection becomes random.

---

## Pattern 2: Component Granularity

### ✅ DO: Atomic Components with Clear Purpose

```typescript
// GOOD: Single-purpose components
const AgentCardSchema = z.object({...}).describe("Shows ONE agent");
const AgentGridSchema = z.object({
  agents: z.array(AgentCardProps),
}).describe("Shows MULTIPLE agents in a grid");
const AgentTimelineSchema = z.object({...}).describe("Shows agent activity OVER TIME");
```

**Why:** Clear boundaries make selection obvious. "Show agent 001" → AgentCard. "Show all agents" → AgentGrid.

### ❌ DON'T: Kitchen-Sink Components

```typescript
// BAD: One component does everything
const AgentViewSchema = z.object({
  viewType: z.enum(['card', 'grid', 'timeline', 'chart']),
  data: z.any(),  // 😱
}).describe("Shows agents in various formats");
```

**Problem:** Forces LLM to choose viewType AND data shape. Increases error rate. Harder to validate.

---

## Pattern 3: Type Safety and Validation

### ✅ DO: Strict Validation with Fallbacks

```typescript
// GOOD: Validate then render with error boundary
<script lang="ts">
  import { AgentCardSchema } from '$lib/schemas';
  import type { AgentCardProps } from '$lib/types';

  export let rawProps: unknown;

  let validatedProps: AgentCardProps | null = null;
  let validationError: string | null = null;

  $: {
    const result = AgentCardSchema.safeParse(rawProps);
    if (result.success) {
      validatedProps = result.data;
      validationError = null;
    } else {
      validatedProps = null;
      validationError = result.error.message;
    }
  }
</script>

{#if validationError}
  <div class="error-state">
    <p>Invalid component data</p>
    <details>
      <summary>Error details</summary>
      <pre>{validationError}</pre>
    </details>
  </div>
{:else if validatedProps}
  <AgentCard {...validatedProps} />
{/if}
```

**Why:** Graceful degradation. Bad LLM output shows error state instead of crashing.

### ❌ DON'T: Blind Trust

```typescript
// BAD: Assume LLM always outputs valid data
<script>
  export let props;  // any
</script>

<div>
  {props.agent.name}  <!-- Runtime error if props.agent is undefined -->
</div>
```

**Problem:** One malformed LLM response crashes the entire UI.

---

## Pattern 4: Progressive Rendering

### ✅ DO: Incremental Parsing with Skeletons

```typescript
// GOOD: Handle incomplete JSON during streaming
<script>
  export let spec: string = '';
  export let isStreaming: boolean = false;

  let parsed: any = null;

  $: {
    if (!spec) {
      parsed = null;
    } else {
      try {
        parsed = JSON.parse(spec);
      } catch {
        // During streaming, incomplete JSON is expected
        if (!isStreaming) {
          console.error('Invalid JSON after stream completed');
        }
        parsed = null;
      }
    }
  }
</script>

{#if parsed}
  <ComponentRenderer {parsed} />
{:else if isStreaming}
  <SkeletonLoader />
{:else}
  <EmptyState />
{/if}
```

**Why:** Users see skeleton → component transition. No blank screen flicker.

### ❌ DON'T: Block Until Complete

```typescript
// BAD: Wait for entire response before rendering
<script>
  export let spec: string = '';

  let parsed: any;
  $: parsed = JSON.parse(spec);  // Crashes on incomplete JSON
</script>

{#if parsed}
  <ComponentRenderer {parsed} />
{/if}
```

**Problem:** Users stare at blank screen during LLM inference. No perceived progress.

---

## Pattern 5: Component Composition

### ✅ DO: Nested Specs for Complex UIs

```typescript
// GOOD: Composable component tree
const DashboardSchema = z.object({
  component: z.literal('Dashboard'),
  props: z.object({
    layout: z.enum(['vertical', 'horizontal', 'grid']),
  }),
  children: z.array(z.union([
    AgentGridSchema,
    MetricsChartSchema,
    TaskTimelineSchema,
  ])),
}).describe("A multi-section dashboard with agents, metrics, and tasks");
```

**LLM Output:**
```json
{
  "component": "Dashboard",
  "props": { "layout": "vertical" },
  "children": [
    {
      "component": "AgentGrid",
      "props": { "agents": [...] }
    },
    {
      "component": "MetricsChart",
      "props": { "metrics": [...] }
    }
  ]
}
```

**Why:** Complex UIs built from simple primitives. Renderer recursively renders children.

### ❌ DON'T: Flat, Monolithic Schemas

```typescript
// BAD: Dashboard is one giant schema
const DashboardSchema = z.object({
  agentData: z.array(...),
  metricsData: z.array(...),
  taskData: z.array(...),
  // ... 50 more fields
});
```

**Problem:** Hard for LLM to generate. Hard to validate. Not reusable. Violates single-responsibility.

---

## Pattern 6: System Prompts for Quality

### ✅ DO: Explicit Quality Guidelines

```typescript
const SYSTEM_PROMPT = `You are a UI spec generator for AgentPing.

OUTPUT FORMAT:
Always respond with valid JSON matching the Polymorph schema. No markdown, no code blocks, just JSON.

COMPONENT SELECTION RULES:
1. User asks "show agent X" → Use AgentCard (singular)
2. User asks "show all agents" → Use AgentGrid (plural)
3. User asks "agent performance over time" → Use MetricsChart
4. User asks "what happened" → Use TaskTimeline
5. User asks multiple questions → Use Dashboard with children

DATA QUALITY RULES:
1. Always include required fields (validate against schema)
2. Use ISO 8601 for timestamps (YYYY-MM-DDTHH:mm:ssZ)
3. Metric values are numbers, not strings
4. Status must be: 'online' | 'busy' | 'offline' | 'error'
5. Include optional fields when data is available

VISUAL QUALITY RULES:
1. Prefer richer components (charts) over text when data supports it
2. Use grids for multiple items (not vertical lists of cards)
3. Include metric units (ms, %, MB)
4. Round numbers to 2 decimal places
5. Use descriptive task names, not IDs

ERROR HANDLING:
If data is unavailable or ambiguous:
- Use ErrorState component
- Set props.message to explain what's missing
- Suggest alternative queries

EXAMPLE OUTPUT:
{
  "component": "AgentGrid",
  "props": {
    "agents": [
      {
        "id": "agent-001",
        "name": "Worker 1",
        "status": "online",
        "metrics": {
          "tasksCompleted": 42,
          "currentLoad": 67.5
        },
        "lastSeen": "2026-02-10T15:30:00Z"
      }
    ]
  }
}`;
```

**Why:** Explicit rules reduce LLM variability. Examples show desired format.

### ❌ DON'T: Vague or Missing Prompts

```typescript
// BAD: No guidance
const SYSTEM_PROMPT = `You generate UI for AgentPing. Respond with JSON.`;
```

**Problem:** LLM makes up field names, uses wrong types, omits required fields, generates markdown instead of JSON.

---

## Pattern 7: Error States

### ✅ DO: Dedicated Error Component

```svelte
<!-- components/ErrorState.svelte -->
<script lang="ts">
  export let message: string;
  export let details: string | undefined = undefined;
  export let retryable: boolean = false;
  export let onRetry: (() => void) | undefined = undefined;
</script>

<div class="error-state">
  <div class="error-icon">⚠️</div>
  <h3>Something went wrong</h3>
  <p>{message}</p>

  {#if details}
    <details>
      <summary>Technical details</summary>
      <pre>{details}</pre>
    </details>
  {/if}

  {#if retryable && onRetry}
    <button on:click={onRetry}>Try Again</button>
  {/if}
</div>
```

**Usage:**
```typescript
// LLM can choose to show error
{
  "component": "ErrorState",
  "props": {
    "message": "No agents found matching 'foobar'",
    "retryable": false
  }
}
```

**Why:** Errors are first-class UI. User gets helpful feedback, not a crash.

### ❌ DON'T: Silent Failures

```typescript
// BAD: Fail silently or show generic error
try {
  const component = renderSpec(spec);
} catch {
  // Do nothing, or show bland "Error" message
}
```

**Problem:** User has no idea what went wrong or how to fix it.

---

## Pattern 8: Loading States

### ✅ DO: Skeleton Screens Matching Component Shape

```svelte
<!-- components/SkeletonLoader.svelte -->
<script>
  export let variant: 'card' | 'grid' | 'chart' | 'timeline' = 'card';
</script>

{#if variant === 'card'}
  <div class="skeleton-card">
    <div class="skeleton-circle"></div>
    <div class="skeleton-line short"></div>
    <div class="skeleton-line medium"></div>
    <div class="skeleton-line long"></div>
  </div>
{:else if variant === 'grid'}
  <div class="skeleton-grid">
    {#each Array(6) as _}
      <svelte:self variant="card" />
    {/each}
  </div>
{:else if variant === 'chart'}
  <div class="skeleton-chart">
    <!-- SVG skeleton bars -->
  </div>
{/if}

<style>
  .skeleton-circle,
  .skeleton-line {
    background: linear-gradient(
      90deg,
      var(--color-bg-muted) 25%,
      var(--color-border) 50%,
      var(--color-bg-muted) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
```

**Why:** User sees content-shaped placeholder → smooth transition to real content. Perceived performance boost.

### ❌ DON'T: Generic Spinners

```svelte
<!-- BAD: Boring spinner -->
{#if loading}
  <div class="spinner"></div>
{/if}
```

**Problem:** User can't anticipate what's loading. Feels slower than skeleton.

---

## Pattern 9: Component Reusability

### ✅ DO: Shared Primitives, Composed Behavior

```svelte
<!-- primitives/Card.svelte -->
<script>
  export let variant: 'default' | 'highlighted' | 'muted' = 'default';
</script>

<div class="card" data-variant={variant}>
  <slot />
</div>

<!-- components/AgentCard.svelte -->
<script>
  import Card from '$lib/primitives/Card.svelte';
  import StatusBadge from '$lib/primitives/StatusBadge.svelte';

  export let agent: Agent;
</script>

<Card variant={agent.status === 'error' ? 'highlighted' : 'default'}>
  <StatusBadge status={agent.status} />
  <h3>{agent.name}</h3>
  <!-- ... -->
</Card>
```

**Why:** DRY. Consistent styling. Easy to theme. Primitives are unit-testable.

### ❌ DON'T: Duplicate Styles

```svelte
<!-- BAD: Each component reimplements card styles -->
<div class="custom-card-style-1">...</div>
<div class="custom-card-style-2">...</div>  <!-- Slightly different -->
<div class="custom-card-style-3">...</div>  <!-- Also slightly different -->
```

**Problem:** Inconsistent look. Hard to maintain. Breaks design system.

---

## Pattern 10: Responsive Design

### ✅ DO: Mobile-First with Breakpoints

```svelte
<div class="agent-grid">
  {#each agents as agent}
    <AgentCard {agent} />
  {/each}
</div>

<style>
  .agent-grid {
    display: grid;
    gap: var(--space-md);
    grid-template-columns: 1fr;  /* Mobile: 1 column */
  }

  @media (min-width: 640px) {
    .agent-grid {
      grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 columns */
    }
  }

  @media (min-width: 1024px) {
    .agent-grid {
      grid-template-columns: repeat(3, 1fr);  /* Desktop: 3 columns */
    }
  }

  @media (min-width: 1536px) {
    .agent-grid {
      grid-template-columns: repeat(4, 1fr);  /* Wide: 4 columns */
    }
  }
</style>
```

**Why:** Works on all devices. LLM doesn't need to know viewport size.

### ❌ DON'T: Desktop-Only Layouts

```svelte
<!-- BAD: Fixed widths, no media queries -->
<div style="width: 1200px; display: flex;">
  <!-- Breaks on mobile -->
</div>
```

**Problem:** Unusable on phones. Horizontal scrolling. User frustration.

---

## Pattern 11: Accessibility

### ✅ DO: Semantic HTML + ARIA

```svelte
<!-- GOOD: Accessible by default -->
<button
  type="button"
  aria-label="Refresh agent status"
  on:click={handleRefresh}
>
  <RefreshIcon aria-hidden="true" />
  Refresh
</button>

<div role="status" aria-live="polite">
  {#if loading}
    Loading agents...
  {:else}
    Showing {agents.length} agents
  {/if}
</div>

<nav aria-label="Agent pagination">
  <button aria-label="Previous page" disabled={page === 1}>
    Previous
  </button>
  <button aria-label="Next page" disabled={page === maxPage}>
    Next
  </button>
</nav>
```

**Why:** Screen readers work. Keyboard navigation works. WCAG compliant.

### ❌ DON'T: Div Soup

```svelte
<!-- BAD: No semantic meaning, no ARIA -->
<div onclick={handleClick}>Click me</div>  <!-- Not a button -->
<div>Loading...</div>  <!-- No live region -->
<div>
  <div>Prev</div>
  <div>Next</div>
</div>  <!-- Not a nav -->
```

**Problem:** Broken for assistive tech. Bad SEO. Fails accessibility audits.

---

## Pattern 12: Performance

### ✅ DO: Lazy Load Heavy Components

```typescript
// registry/components.ts
export const POLYMORPH_COMPONENTS: Record<string, () => Promise<any>> = {
  // Lightweight, always loaded
  AgentCard: () => import('./components/AgentCard.svelte'),
  StatusBadge: () => import('./components/StatusBadge.svelte'),

  // Heavy, lazy loaded
  MetricsChart: () => import('./components/MetricsChart.svelte'),  // includes chart.js
  TaskTimeline: () => import('./components/TaskTimeline.svelte'),  // large component
};
```

**Renderer:**
```svelte
<script>
  import { POLYMORPH_COMPONENTS } from '$lib/registry';

  export let componentName: string;
  export let props: any;

  let Component: any = null;

  $: loadComponent(componentName);

  async function loadComponent(name: string) {
    const loader = POLYMORPH_COMPONENTS[name];
    if (loader) {
      const module = await loader();
      Component = module.default;
    }
  }
</script>

{#if Component}
  <svelte:component this={Component} {...props} />
{:else}
  <SkeletonLoader />
{/if}
```

**Why:** Faster initial page load. Heavy components load on-demand.

### ❌ DON'T: Import Everything Eagerly

```typescript
// BAD: Bundles all components into main bundle
import AgentCard from './AgentCard.svelte';
import MetricsChart from './MetricsChart.svelte';  // 200kb chart library
import TaskTimeline from './TaskTimeline.svelte';
// ... 50 more
```

**Problem:** Initial bundle bloat. Slow page load. Users pay for code they don't use.

---

## Anti-Patterns Summary

| ❌ Anti-Pattern | ✅ Better Approach |
|---|---|
| LLM generates HTML/JSX/Svelte code | LLM generates JSON spec |
| Vague schema descriptions | Rich, intent-matching descriptions |
| Kitchen-sink components | Atomic, single-purpose components |
| Blind trust in LLM output | Zod validation + error boundaries |
| Wait for complete response | Progressive rendering with skeletons |
| Flat, monolithic schemas | Nested, composable specs |
| Generic error messages | Dedicated ErrorState component |
| Spinner for all loading states | Component-shaped skeletons |
| Duplicate styles across components | Shared primitive components |
| Desktop-only layouts | Mobile-first responsive design |
| Div soup, no ARIA | Semantic HTML + accessibility |
| Eager load all components | Lazy load heavy components |

---

## Checklist: Before Shipping a Component

- [ ] Zod schema defined with rich `.describe()` text
- [ ] Schema validates all props (no `z.any()` or `z.unknown()` at leaves)
- [ ] Component handles missing optional props gracefully
- [ ] Error boundary catches validation failures
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard nav
- [ ] Loading state: skeleton screen or spinner
- [ ] Animation: fade-in on mount (optional but nice)
- [ ] Uses design tokens (no hardcoded colors/spacing)
- [ ] Unit tests: renders correctly, handles edge cases
- [ ] Integration test: works in polymorph renderer
- [ ] Performance: lazy load if component is heavy (>50kb)

---

## Final Wisdom

**The Best Component is the One the User Doesn't Notice**

If the UI "just works," feels fast, and looks good — you succeeded. Quality comes from:

1. **Constraints** — Limited, well-designed components beat infinite mediocre options
2. **Validation** — Trust but verify LLM output
3. **Feedback** — Show progress (skeletons), show errors (helpful messages)
4. **Polish** — Design tokens, animations, accessibility
5. **Testing** — Unit, integration, and visual regression tests

Ship components that make users say "wow, this AI gets it" — not "wow, this AI made a mess."

