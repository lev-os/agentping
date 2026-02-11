# Step 7: Wireframes & GenUI Pipeline Visualization

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Design Challenge:** Premium GenUI Component System for AgentPing
**Date:** 2026-02-10

---

## Wireframe 1: Streaming Progressive Render Pipeline

**Flow:** Agent generates dashboard → Chunks stream to Studio → Components materialize progressively

### Timeline View (0-1200ms)

```
AGENT (Claude Code)                     DAEMON                        STUDIO APP
─────────────────────                   ──────                        ──────────

T=0ms
generate_playground({
  primitives: [Card, MetricValue...],
  theme: 'enterprise',
  streaming: true
})
                                        → Receive MCP call
                                          Create ping (PENDING)
                                          Initialize stream

T=50ms
                                        → Emit chunk #1:
                                          {type:'skeleton',
                                           id:'card-1',
                                           kind:'card'}
                                                                      → Canvas receives chunk
                                                                        Render skeleton:
                                                                        ┌─────────────┐
                                                                        │ ▓▓▓▓▓▓▓▓▓▓ │ (pulsing)
                                                                        │ ▓▓▓▓▓▓     │
                                                                        └─────────────┘

T=200ms
                                        → Emit chunk #2:
                                          {type:'partial',
                                           id:'card-1',
                                           props:{title:'Dashboard'}}
                                                                      → Patch title:
                                                                        ┌─────────────┐
                                                                        │ Dashboard   │ ← Fades in
                                                                        │ ▓▓▓▓▓▓     │
                                                                        └─────────────┘

T=400ms
                                        → Emit chunk #3:
                                          {type:'complete',
                                           id:'card-1',
                                           primitive:{...full}}
                                                                      → Entrance animation:
                                                                        ┌─────────────┐
                                                                        │ Dashboard   │
                                                                        │ Live Data   │ ← Fade-up
                                                                        │ [Metrics]   │   250ms
                                                                        └─────────────┘

T=500ms
                                        → Emit chunk #4:
                                          {type:'skeleton',
                                           id:'metric-1',
                                           kind:'metric-value'}
                                                                      → Second skeleton:
                                                                        ┌─────────────┐
                                                                        │ Dashboard   │
                                                                        │ [Metrics]   │
                                                                        └─────────────┘
                                                                        ┌─────────────┐
                                                                        │ ▓▓▓▓▓▓▓▓▓▓ │ ← Stagger 50ms
                                                                        └─────────────┘

T=800ms
                                        → Emit chunk #5:
                                          {type:'complete',
                                           id:'metric-1',
                                           primitive:{...}}
                                                                      → MetricValue complete:
                                                                        ┌─────────────┐
                                                                        │ Dashboard   │
                                                                        │ [Metrics]   │
                                                                        └─────────────┘
                                                                        ┌─────────────┐
                                                                        │ ACTIVE USERS│
                                                                        │ 1,247  ▲+5% │
                                                                        └─────────────┘

T=1200ms
                                        → Stream complete
                                          Update ping (APPROVED)
                                                                      → Show action bar:
                                                                        [Approve] [Reject]
                                                                        User can interact
```

---

## Wireframe 2: Complete Dashboard (Enterprise Light Theme)

**Viewport:** Desktop (1200px wide)
**Theme:** Enterprise Light
**Components:** Card, MetricValue, BarChart, Table, Alert, ActionBar

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  AgentPing Studio                                                  [⚙] [👤] │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ System Health Dashboard              ← Title (20px, semibold)          │ │
│  │ data · enterprise · Updated 2m ago   ← Meta (12px, muted, uppercase)   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ⓘ All systems operational                                        × │    │
│  │   Last health check completed successfully                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│     ↑ Alert (info variant, dismissible)                                     │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ ACTIVE USERS │  │ API CALLS    │  │ RESPONSE TIME│  │ ERROR RATE   │   │
│  │ 1,247  ▲+5% │  │ 45.2K  ▲+12%│  │ 142ms  ▼-8% │  │ 0.02%  —     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│     ↑ MetricValue primitives (28px value, 11px label, trend indicators)     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ API Traffic by Endpoint                                             │    │
│  │                                                                     │    │
│  │ /api/users    ████████████████████████████████  2,450              │    │
│  │ /api/posts    ████████████████████████  1,820                      │    │
│  │ /api/comments ████████████████  1,230                              │    │
│  │ /api/auth     ████████  650                                        │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│     ↑ BarChart (8px bars, 4px gaps, accent fill, value labels)              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Recent Deployments                                                  │    │
│  │ ─────────────────────────────────────────────────────────────────── │    │
│  │ Service         │ Status    │ Deployed       │ Version    │ Action │    │
│  │ ─────────────────────────────────────────────────────────────────── │    │
│  │ API Server      │ Complete  │ 2026-02-10 14:23│ v2.4.1    │ [Logs] │    │
│  │ Database        │ Complete  │ 2026-02-10 13:15│ v1.8.3    │ [Logs] │    │
│  │ Worker Service  │ Pending   │ 2026-02-10 15:00│ v3.1.0    │ [Cancel]│   │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│     ↑ Table (sortable columns, row hover states, inline actions)            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐             │
│  │                                          [Refresh] [Export] │             │
│  └────────────────────────────────────────────────────────────┘             │
│     ↑ ActionBar (right-aligned, secondary + ghost buttons)                  │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────   │
│  [Approve Dashboard] [Reject] [Ask Question]  ← AgentPing response actions  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Color Palette Applied:**
- Background: `#ffffff` (bg-base)
- Card surfaces: `#f6f8fa` (bg-surface)
- Borders: `#d0d7de` (border-subtle)
- Text: `#1f2328` (text-primary)
- Accent: `#0969da` (primary blue)
- Success: `#1a7f37` (green for positive trends)

---

## Wireframe 3: Mobile Responsive Layout (Enterprise Light)

**Viewport:** Mobile (375px wide)
**Adaptations:** Single column, stacked metrics, scrollable table

```
┌─────────────────────────────────┐
│ ☰  AgentPing        [⚙] [👤]  │
├─────────────────────────────────┤
│                                 │
│ System Health Dashboard         │
│ data · Updated 2m ago           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ⓘ All systems operational × │ │
│ │   Last check OK             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ACTIVE USERS                │ │
│ │ 1,247  ▲ +5%               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ API CALLS                   │ │
│ │ 45.2K  ▲ +12%              │ │
│ └─────────────────────────────┘ │
│    ↑ Metrics stacked vertically │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ API Traffic                 │ │
│ │ /api/users  ████████  2450  │ │
│ │ /api/posts  ██████    1820  │ │
│ │ /api/auth   ██        650   │ │
│ └─────────────────────────────┘ │
│    ↑ BarChart compressed        │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Recent Deployments          │ │
│ │ ── Scroll horizontally ──► │ │
│ │ Service│Status │Deployed│   │ │
│ │ API Sv │Complete│Feb 10│   │ │
│ └─────────────────────────────┘ │
│    ↑ Horizontal scroll for table│
│                                 │
│ [Approve Dashboard]  [Reject]   │
│    ↑ Buttons full-width         │
│                                 │
└─────────────────────────────────┘
```

**Mobile-Specific Changes:**
- Single column grid
- Metrics: 22px values (reduced from 28px)
- Card padding: 12px (reduced from 16px)
- Buttons: Full width, stacked vertically
- Table: Horizontal scroll, sticky first column

---

## Wireframe 4: Dark Mode Variant (Enterprise Dark)

**Same dashboard, Enterprise Dark theme applied**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  AgentPing Studio                                  [bg: #0d1117]   [⚙] [👤] │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                     [text: #e6edf3]          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ System Health Dashboard              [bg: #161b22]                     │ │
│  │ data · enterprise · Updated 2m ago   [text-muted: #8b949e]            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ⓘ All systems operational                                        × │    │
│  │   [bg: rgba(88,166,255,0.15), border-left: 3px #58a6ff]            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│     ↑ Blue tint background, brighter blue accent                            │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ ACTIVE USERS │  │ API CALLS    │  │ RESPONSE TIME│  │ ERROR RATE   │   │
│  │ 1,247  ▲+5% │  │ 45.2K  ▲+12%│  │ 142ms  ▼-8% │  │ 0.02%  —     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│     [bg: #161b22, border: #30363d, shadow: rgba(0,0,0,0.20)]               │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ API Traffic by Endpoint                                             │    │
│  │ /api/users    ████████████████████████████████  2,450              │    │
│  │   [bars: #58a6ff (brighter blue for dark mode)]                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Recent Deployments        [table border: #30363d]                   │    │
│  │ Service         │ Status    │ Deployed       │ Version    │ Action │    │
│  │ API Server      │ Complete  │ 2026-02-10 14:23│ v2.4.1    │ [Logs] │    │
│  │   [hover bg: #21262d]                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  [Approve Dashboard] [Reject] [Ask Question]                                │
│     [primary btn bg: #58a6ff, text: #0d1117 (inverted)]                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Dark Mode Token Swaps:**
- bg-base: `#ffffff` → `#0d1117`
- bg-surface: `#f6f8fa` → `#161b22`
- border-subtle: `#d0d7de` → `#30363d`
- text-primary: `#1f2328` → `#e6edf3`
- primary: `#0969da` → `#58a6ff`
- shadow-md: `rgba(0,0,0,0.06)` → `rgba(0,0,0,0.20)`

---

## Wireframe 5: Interactive Component Event Flow

**Scenario:** User clicks "Show Details" button in dashboard

### Before Click

```
┌─────────────────────────────────────────────┐
│ API Status                                  │
│ All endpoints responding normally           │
│                                             │
│ [Show Details]  ← Button (idle state)      │
│   [cursor: pointer, bg: #0969da]           │
└─────────────────────────────────────────────┘
```

---

### During Click (T=0ms)

```
┌─────────────────────────────────────────────┐
│ API Status                                  │
│                                             │
│ [Show Details]  ← Button press animation   │
│   [transform: scale(0.98)]                 │
│   [box-shadow glow: 0 0 0 2px #0969da]    │
└─────────────────────────────────────────────┘
     ↓
  onClick handler fires
  emitAction('show-details', {context: 'api-status'})
```

---

### Loading State (T=100ms)

```
┌─────────────────────────────────────────────┐
│ API Status                                  │
│                                             │
│ [◌ Loading...]  ← Spinner replaces text   │
│   [disabled: true, cursor: wait]           │
└─────────────────────────────────────────────┘
     ↓
  Action sent to agent
  Waiting for response
```

---

### Response Streaming (T=500ms)

```
┌─────────────────────────────────────────────┐
│ API Status                                  │
│                                             │
│ [Show Details]  ← Button re-enabled        │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ▓▓▓▓▓▓▓▓▓▓  ← Skeleton for new content ││
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
     ↓
  Agent response chunk received
  New Table component streaming in
```

---

### Complete (T=1000ms)

```
┌─────────────────────────────────────────────┐
│ API Status                                  │
│                                             │
│ [Show Details]                              │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ Endpoint Details                        ││
│ │ /api/users     200  ✓  142ms           ││
│ │ /api/posts     200  ✓  156ms           ││
│ │ /api/auth      200  ✓  98ms            ││
│ └─────────────────────────────────────────┘│
│   ↑ Table entered with fade-up animation   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Wireframe 6: Theme Switching UI

**Settings Panel (Slide-in from right)**

```
                                    ┌────────────────────────────────┐
                                    │ Settings                    × │
                                    ├────────────────────────────────┤
                                    │                                │
                                    │ Theme                          │
                                    │                                │
                                    │ ┌────┐ ┌────┐ ┌────┐          │
                                    │ │▓▓▓▓│ │    │ │████│          │
                                    │ │▓▓▓▓│ │    │ │████│          │
                                    │ └────┘ └────┘ └────┘          │
                                    │ Dark   Light  System           │
                                    │   ↑                            │
                                    │ Selected (blue ring)           │
                                    │                                │
                                    │ Theme Presets                  │
                                    │                                │
                                    │ ┌──────┐ ┌──────┐ ┌──────┐   │
                                    │ │Enter-│ │Skynet│ │Cyber │   │
                                    │ │prise │ │      │ │      │   │
                                    │ └──────┘ └──────┘ └──────┘   │
                                    │                                │
                                    │ ┌──────┐ ┌──────┐ ┌──────┐   │
                                    │ │Violet│ │Rose  │ │Amber │   │
                                    │ │      │ │      │ │      │   │
                                    │ └──────┘ └──────┘ └──────┘   │
                                    │   ↑                            │
                                    │ 3x3 grid of theme previews     │
                                    │                                │
                                    │ [Apply Theme]                  │
                                    │                                │
                                    └────────────────────────────────┘
                                      ↑
                                    Panel slides in (350ms ease-out)
                                    Theme swaps with 400ms cross-fade
```

**Theme Preview (Mini Card):**
```
┌──────────┐
│ Title    │  ← Theme colors applied
│ ▓▓▓▓▓▓▓▓ │  ← Skeleton
│ [Button] │  ← Accent color
└──────────┘
  64x80px card
  Shows bg, surface, accent
```

---

## Wireframe 7: Skeleton → Complete Transition (Detailed)

**Frame-by-frame breakdown of a Card component streaming in**

### Frame 1: T=0ms (Empty)

```
┌───────────────────────────┐
│                           │
│      (no content yet)     │
│                           │
└───────────────────────────┘
```

---

### Frame 2: T=50ms (Skeleton)

```
┌───────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Title skeleton (pulsing)
│                           │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │  ← Subtitle skeleton
│                           │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Content skeleton
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                           │
└───────────────────────────┘
  opacity: pulse 1.0 → 0.5
  background: linear-gradient (animated)
```

---

### Frame 3: T=200ms (Partial - Title)

```
┌───────────────────────────┐
│ Dashboard Status          │  ← Title (fade in 100ms)
│                           │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │  ← Subtitle still loading
│                           │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Content still loading
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                           │
└───────────────────────────┘
  Title: opacity 0 → 1 (100ms)
  Rest: still pulsing
```

---

### Frame 4: T=350ms (Partial - Subtitle)

```
┌───────────────────────────┐
│ Dashboard Status          │
│ Updated 2 minutes ago     │  ← Subtitle (fade in 100ms)
│                           │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Content still loading
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                           │
└───────────────────────────┘
  Subtitle: opacity 0 → 1 (100ms)
  Content: still pulsing
```

---

### Frame 5: T=500ms (Complete)

```
┌───────────────────────────┐
│ Dashboard Status          │
│ Updated 2 minutes ago     │
│ ───────────────────────── │  ← Divider
│ ● Database      [online] │  ← Full content
│ ● API Server    [online] │     (entrance animation)
│ ● Worker        [online] │
└───────────────────────────┘
  Entrance: translateY(8px) → 0
           opacity 0 → 1
           duration: 250ms ease-out
```

---

## Wireframe 8: Error State Handling

**Scenario:** Agent action fails, show error feedback

### Error Toast (Top-right corner)

```
                          ┌────────────────────────────┐
                          │ ⚠ Action failed         × │
                          │ Could not connect to agent │
                          │ [Retry]                    │
                          └────────────────────────────┘
                            ↑
                          Slide down from top (250ms)
                          Auto-dismiss after 5s
                          Red accent border-left
```

---

### Inline Error (Input validation)

```
┌─────────────────────────────────────────────┐
│ Email Address                               │
│ ┌─────────────────────────────────────────┐│
│ │ invalid@                                ││  ← Red border
│ └─────────────────────────────────────────┘│
│ ⚠ Invalid email format                     │  ← Error message (red)
└─────────────────────────────────────────────┘
```

---

## Wireframe 9: Loading States Comparison

**Three loading patterns:**

### 1. Skeleton (Preferred for streaming)

```
┌─────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  ← Pulsing gradient
│ ▓▓▓▓▓▓▓▓                │
└─────────────────────────┘
  Pros: Shows layout, no jank
  Use: When streaming components
```

---

### 2. Spinner (For unknown duration)

```
┌─────────────────────────┐
│                         │
│         ◌               │  ← Rotating spinner
│     Loading...          │
│                         │
└─────────────────────────┘
  Pros: Clear "working" state
  Use: When waiting for agent
```

---

### 3. Progress Bar (For known duration)

```
┌─────────────────────────┐
│ Uploading file...       │
│ ████████████            │  ← 67% complete
│ 2.4MB / 3.6MB           │
└─────────────────────────┘
  Pros: Shows progress
  Use: File uploads, batch tasks
```

---

## Wireframe 10: Accessibility Features

**Keyboard Navigation Example**

```
┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐  │
│ │ [Show Details]  ← Tab focus (1)    │  │
│ │   [box-shadow: 0 0 0 3px #0969da]  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ [✓] Enable notifications ← Tab (2) │  │
│ │   [Focus ring on checkbox]         │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ API Key                            │  │
│ │ ┌────────────────────────────────┐ │  │
│ │ │ sk-abc123... ← Tab focus (3)   │ │  │
│ │ │ [Accent border + ring shadow]  │ │  │
│ │ └────────────────────────────────┘ │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [Approve] ← Tab (4)  [Reject] ← Tab (5) │
└──────────────────────────────────────────┘
  Tab order: Sequential, logical
  Focus rings: 3px, accent color, 25% opacity
  Enter/Space: Activate focused element
```

---

## Wireframe 11: Component Catalog (Studio Gallery View)

**New Studio sidebar section for browsing primitives**

```
┌────────────┬─────────────────────────────────────────────────────────────┐
│ Pings      │ Component Gallery                                [Search...] │
│ Gallery ✓  ├─────────────────────────────────────────────────────────────┤
│ Themes     │                                                              │
│ Settings   │ Foundation                                                   │
│            │ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│            │ │ Button     │ │ Text       │ │ Card       │                │
│            │ │ [Primary]  │ │ Heading    │ │ ┌────────┐ │                │
│            │ │ [Secondary]│ │ Body       │ │ │Title   │ │                │
│            │ └────────────┘ └────────────┘ │ │Content │ │                │
│            │                                │ └────────┘ │                │
│            │ ┌────────────┐ ┌────────────┐ └────────────┘                │
│            │ │ InputField │ │ Badge      │                                │
│            │ │ ┌────────┐ │ │ Approved   │                                │
│            │ │ │ value  │ │ │ Pending    │                                │
│            │ │ └────────┘ │ │ Rejected   │                                │
│            │ └────────────┘ └────────────┘                                │
│            │                                                              │
│            │ Interactive                                                  │
│            │ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│            │ │ CheckItem  │ │ Select     │ │ ProgressBar│                │
│            │ │ ☐ Option 1│ │ Choose...  │ │ ████       │                │
│            │ │ ☑ Option 2│ │ ▼          │ │ 45%        │                │
│            │ └────────────┘ └────────────┘ └────────────┘                │
│            │                                                              │
│            │ Data Display                                                 │
│            │ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│            │ │ Table      │ │ LineChart  │ │ BarChart   │                │
│            │ │ ┌──┬──┬──┐│ │    ╱╲      │ │ ████       │                │
│            │ │ │  │  │  ││ │   ╱  ╲     │ │ ██         │                │
│            │ │ └──┴──┴──┘│ │  ╱    ╲    │ │ ████       │                │
│            │ └────────────┘ └────────────┘ └────────────┘                │
│            │                                                              │
│            │ Click any primitive to insert into canvas                   │
└────────────┴─────────────────────────────────────────────────────────────┘
```

---

## Key Wireframe Insights

1. **Progressive Reveal Creates Engagement**
   Skeleton → Partial → Complete flow keeps user watching instead of staring at blank screen

2. **Consistent Layout Prevents Jank**
   Skeleton matches final component dimensions, no layout shift during load

3. **Dark Mode is Equally Polished**
   Not an afterthought - same attention to detail, just inverted colors

4. **Mobile Adapts Gracefully**
   Single column, full-width buttons, horizontal scroll for tables

5. **Interactivity Has Clear Feedback**
   Every click gets instant visual response (glow, spinner, new content)

6. **Accessibility is Built-In**
   Focus rings, keyboard nav, ARIA labels visible in wireframes

7. **Error States Are Helpful**
   Toast notifications, inline validation, retry options

8. **Theme Switching is Seamless**
   Preview before applying, smooth 400ms cross-fade transition

---

## Implementation Checklist

Based on these wireframes, implement:

### Phase 1: Foundation (Week 1-2)
- [ ] Design token system (CSS custom properties)
- [ ] Enterprise Light theme
- [ ] Enterprise Dark theme
- [ ] 6 Tier 1 primitives (Button, Text, Card, InputField, Badge, Stack)
- [ ] HTML renderer with token support
- [ ] Basic entrance animations

### Phase 2: Streaming (Week 3-4)
- [ ] Chunk protocol (skeleton/partial/complete)
- [ ] StreamRenderer component (React)
- [ ] WebSocket chunk emitter (daemon)
- [ ] Accumulator state machine
- [ ] Progressive render pipeline

### Phase 3: Interactivity (Week 5-6)
- [ ] Event handler props on all primitives
- [ ] Action service (emit ping:action events)
- [ ] State store (SQLite persistence)
- [ ] useAgentPingState hook
- [ ] Loading states (spinner, disabled)

### Phase 4: Polish (Week 7-8)
- [ ] 12 Tier 2+3 primitives (CheckItem, Select, ProgressBar, Table, Charts, etc.)
- [ ] Theme provider with 9 presets
- [ ] Mobile responsive layouts
- [ ] Accessibility audit (WCAG AA)
- [ ] Error handling (toasts, inline validation)
- [ ] Component gallery (Studio sidebar)

---

## Success Metrics (Post-Implementation)

- **Perceived performance:** Streaming feels 30% faster than static (via user testing)
- **Theme adoption:** 60% of pings use Enterprise theme within 1 month
- **Interactivity:** 40% of pings include at least one onClick handler
- **Polish rating:** User rating of "professional appearance" increases from 6/10 → 9/10
- **Accessibility:** 100% keyboard navigable, WCAG AA compliant
- **Multi-format parity:** Pencil output quality within 1 point of HTML/React

---

## Conclusion

These wireframes demonstrate a **premium GenUI system** that:
1. Streams progressively (skeletons → complete)
2. Feels professional (Enterprise theme, systematic tokens)
3. Works everywhere (HTML/React/Pencil, light/dark, mobile/desktop)
4. Enables interaction (onClick handlers, state persistence)
5. Matches Thesys C1 quality (while preserving AgentPing's MCP-native advantages)

**Next:** Implement Phase 1 (Foundation) in `community/agentping/packages/canvas/`

