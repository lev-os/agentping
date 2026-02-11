# Step 3: User Flows

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Design Challenge:** Premium GenUI Component System for AgentPing
**Date:** 2026-02-10

---

## Flow 1: Streaming Progressive Render (Agent → Human)

### Flow Diagram

```
┌─────────────┐
│   AGENT     │
│  (Claude)   │
└──────┬──────┘
       │
       │ 1. Call generate_playground MCP tool
       │    with streaming: true
       ↓
┌──────────────────────────────────────┐
│  AgentPing Daemon (MCP Server)       │
│  ─────────────────────────────────   │
│  2. Create ping record (PENDING)     │
│  3. Initialize stream accumulator    │
│  4. Emit skeleton chunks to WS       │
└──────┬───────────────────────────────┘
       │
       │ 5. WebSocket: chunk stream
       │    { type: 'skeleton', id: 'card-1', kind: 'card' }
       │    { type: 'partial', id: 'card-1', props: { title: 'Dashboard' } }
       │    { type: 'complete', id: 'card-1', primitive: {...} }
       ↓
┌──────────────────────────────────────┐
│  Studio App (Electron)               │
│  ─────────────────────────────────   │
│  6. StreamRenderer component         │
│  7. Accumulate chunks in state       │
│  8. Render progressive UI            │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  Canvas Workspace                    │
│  ─────────────────────────────────   │
│  9. Show skeletons (pulse animation) │
│  10. Patch in partial data           │
│  11. Entrance animation on complete  │
└──────────────────────────────────────┘
       │
       ↓
     USER
  (sees live UI building progressively)
```

### Detailed Steps

#### Phase 1: Initiation (Agent Side)
**Actor:** Claude Code agent
**Trigger:** Agent needs human approval for dashboard

**Steps:**
1. Agent generates polymorph primitive payload
2. Agent calls `generate_playground` with:
   ```typescript
   {
     primitives: [...],
     theme: 'enterprise',
     streaming: true,  // Enable progressive render
     template: 'data'
   }
   ```
3. MCP call sent to AgentPing daemon

**Duration:** 10-50ms
**State:** Agent waiting for ping ID response

---

#### Phase 2: Stream Setup (Daemon Side)
**Actor:** AgentPing daemon
**Trigger:** MCP tool invocation received

**Steps:**
4. Daemon creates ping record in SQLite (status: PENDING)
5. Daemon initializes StreamAccumulator
6. Daemon emits `ping:created` event to WebSocket
7. Daemon begins chunking primitive payload:
   - For each primitive, emit `skeleton` chunk first
   - Delay 50-150ms (simulate stream latency)
   - Emit `partial` chunks with incremental props
   - Emit `complete` chunk with full primitive

**Duration:** 200-800ms (depends on primitive count)
**State:** Daemon streaming chunks to connected clients

---

#### Phase 3: Progressive Rendering (Studio Side)
**Actor:** Studio app StreamRenderer component
**Trigger:** WebSocket chunk received

**Steps:**
8. StreamRenderer receives `skeleton` chunk
   - Create placeholder component with pulse animation
   - Render gray box with primitive kind label
9. StreamRenderer receives `partial` chunk
   - Patch props into existing placeholder
   - Fade in partial content (title, labels)
10. StreamRenderer receives `complete` chunk
    - Replace placeholder with full primitive
    - Trigger entrance animation (fade-up with stagger delay)
11. StreamRenderer updates accumulator state
    - Store complete primitive for persistence

**Duration:** 50ms per chunk (staggered)
**Visual Effect:** Components materialize one-by-one with smooth animations

---

#### Phase 4: Completion
**Actor:** Studio app
**Trigger:** All chunks received

**Steps:**
12. StreamRenderer marks stream as complete
13. Final entrance animations finish
14. Canvas shows "Respond" action bar
15. User can now interact with generated UI

**Duration:** 350ms (final animation)
**State:** Ping ready for human response

---

### Success Criteria

- ✅ User sees components appear progressively (not atomically)
- ✅ Skeleton states show before content arrives
- ✅ Entrance animations feel smooth (no jank)
- ✅ Total render time feels faster than static (perceived performance)
- ✅ Stream can recover from dropped chunks (retry logic)

---

### Error Handling

**Error:** WebSocket connection lost during stream
**Recovery:**
1. StreamRenderer detects connection drop
2. Show "Reconnecting..." toast
3. Daemon retains chunk buffer (30s TTL)
4. Client reconnects, requests missing chunks by ID
5. Daemon resumes stream from last ACK'd chunk

**Error:** Malformed chunk received
**Recovery:**
1. StreamRenderer validates chunk schema
2. Log error to console, skip invalid chunk
3. Continue processing remaining chunks
4. Mark primitive as "render failed" in UI

---

## Flow 2: Interactive Component Event (Human → Agent)

### Flow Diagram

```
     USER
  (clicks button in generated UI)
       │
       ↓
┌──────────────────────────────────────┐
│  Canvas Workspace                    │
│  ─────────────────────────────────   │
│  1. Button onClick handler fires     │
│  2. Flash visual feedback (glow)     │
│  3. Emit action event                │
└──────┬───────────────────────────────┘
       │
       │ 4. Event: { primitiveId, actionType, data }
       ↓
┌──────────────────────────────────────┐
│  Action Service                      │
│  ─────────────────────────────────   │
│  5. Validate event payload           │
│  6. Append to ping response          │
│  7. Create new ping (agent turn)     │
└──────┬───────────────────────────────┘
       │
       │ 8. ping:action event
       ↓
┌──────────────────────────────────────┐
│  AgentPing Daemon                    │
│  ─────────────────────────────────   │
│  9. Store action in enrichment data  │
│  10. Notify agent via MCP callback   │
└──────┬───────────────────────────────┘
       │
       │ 11. Action notification
       ↓
┌─────────────┐
│   AGENT     │
│  (Claude)   │
│  12. Generate follow-up ping         │
│  13. Stream new components           │
└─────────────┘
       │
       ↓
   (Flow 1 repeats for agent response)
```

### Detailed Steps

#### Phase 1: User Interaction
**Actor:** User
**Trigger:** User clicks "Show Details" button in generated dashboard

**Steps:**
1. User hovers over button (hover state: brightness increase)
2. User clicks button
3. Button `onClick` handler fires
4. Visual feedback:
   - Button flash animation (glow ring)
   - Haptic feedback (if on trackpad)
   - Button disabled state (prevents double-click)

**Duration:** 150ms
**Visual:** Button glows with accent color ring

---

#### Phase 2: Event Emission
**Actor:** Canvas Workspace component
**Trigger:** Button onClick callback

**Steps:**
5. Extract event data from button primitive:
   ```typescript
   {
     primitiveId: 'button-3',
     actionType: 'click',
     actionData: {
       label: 'Show Details',
       variant: 'primary',
       context: { dashboardId: 'dash-1' }
     },
     timestamp: Date.now(),
     sessionId: 'session-abc'
   }
   ```
6. Emit event to Action Service
7. Show loading spinner next to button (agent is thinking)

**Duration:** 10ms
**State:** Waiting for agent response

---

#### Phase 3: Action Processing
**Actor:** Action Service
**Trigger:** Event received from Canvas

**Steps:**
8. Validate event schema (primitiveId exists, actionType is valid)
9. Check if primitive has registered callback
10. If callback exists:
    - Execute callback locally (update UI state)
    - Optionally trigger new agent ping
11. If callback absent:
    - Create new ping with action enrichment
    - Mark as "agent continuation needed"

**Duration:** 20ms
**State:** New ping created or callback executed

---

#### Phase 4: Agent Notification
**Actor:** AgentPing daemon
**Trigger:** New ping created with action enrichment

**Steps:**
12. Daemon looks up original agent session (from ping metadata)
13. If agent is still active (MCP connection open):
    - Send notification via MCP protocol
    - Include action data in notification payload
14. If agent is inactive:
    - Queue action for next agent check-in
    - Show toast to user: "Agent will respond when available"

**Duration:** 50ms (if agent active)
**State:** Agent notified, preparing response

---

#### Phase 5: Agent Response
**Actor:** Claude agent
**Trigger:** Action notification received

**Steps:**
15. Agent parses action data (button label, context)
16. Agent generates follow-up response:
    - Could be a new dashboard (replace existing)
    - Could be a modal overlay (add to existing)
    - Could be an inline expansion (patch existing primitive)
17. Agent calls `generate_playground` with:
    ```typescript
    {
      parent_ping_id: 'ping-original',
      action_response: true,
      primitives: [...],  // New UI to show
      streaming: true
    }
    ```
18. Flow 1 repeats (streaming render of new components)

**Duration:** 500-2000ms (agent thinking + generation)
**Visual:** User sees new components stream in

---

### Success Criteria

- ✅ Button click feels instant (< 100ms feedback)
- ✅ Visual feedback confirms action received
- ✅ Agent response arrives within 3 seconds
- ✅ New UI streams in smoothly (no jarring replacement)
- ✅ User can cancel action before agent responds

---

### Error Handling

**Error:** Agent offline, can't respond to action
**Recovery:**
1. Show toast: "Agent unavailable, action queued"
2. Store action in pending queue
3. When agent reconnects, process queued actions
4. User can manually retry or cancel

**Error:** Action callback throws exception
**Recovery:**
1. Catch exception, log to console
2. Show error toast: "Action failed, try again"
3. Reset button to enabled state
4. Optionally report error to agent for debugging

---

## Flow 3: Theme Switching

### Flow Diagram

```
     USER
  (opens theme picker)
       │
       ↓
┌──────────────────────────────────────┐
│  Settings Panel                      │
│  ─────────────────────────────────   │
│  1. Show 9 theme previews            │
│  2. User selects "Enterprise Light"  │
└──────┬───────────────────────────────┘
       │
       │ 3. Theme change event
       ↓
┌──────────────────────────────────────┐
│  Theme Provider                      │
│  ─────────────────────────────────   │
│  4. Load new theme tokens            │
│  5. Update CSS custom properties     │
│  6. Trigger re-render                │
└──────┬───────────────────────────────┘
       │
       │ 7. Context update propagates
       ↓
┌──────────────────────────────────────┐
│  Canvas Workspace                    │
│  ─────────────────────────────────   │
│  8. Fade out current UI (200ms)      │
│  9. Swap theme tokens                │
│  10. Fade in new UI (200ms)          │
└──────────────────────────────────────┘
       │
       ↓
     USER
  (sees UI in new theme, smooth transition)
```

### Detailed Steps

#### Phase 1: Theme Selection
**Actor:** User
**Trigger:** User wants to switch from dark to light mode

**Steps:**
1. User clicks Settings icon in Studio sidebar
2. Settings panel slides in from right
3. Theme section shows:
   - Current theme: "Terminal Swiss Dark"
   - Theme picker with 9 previews (3x3 grid)
   - Each preview shows mini Card component in that theme
4. User clicks "Enterprise Light" preview

**Duration:** 50ms
**Visual:** Preview highlights with accent ring

---

#### Phase 2: Theme Loading
**Actor:** Theme Provider (React Context)
**Trigger:** Theme selection changed

**Steps:**
5. Theme Provider receives new theme ID: `enterprise-light`
6. Load theme tokens from `themes/enterprise.ts`:
   ```typescript
   {
     colors: { accent: '#0969da', bg: '#ffffff', ... },
     spacing: { ... },
     typography: { ... },
     shadows: { ... },
     radius: { ... },
     animation: { ... }
   }
   ```
7. Convert tokens to CSS custom properties:
   ```css
   :root {
     --accent: #0969da;
     --bg: #ffffff;
     --surface: #f6f8fa;
     --text: #1f2328;
     ...
   }
   ```
8. Update `<style>` tag in document head

**Duration:** 20ms
**State:** New theme tokens loaded, ready to apply

---

#### Phase 3: UI Transition
**Actor:** Canvas Workspace
**Trigger:** Theme context updated

**Steps:**
9. Canvas detects theme change via `useTheme()` hook
10. Trigger fade-out animation:
    - All primitives: `opacity: 1 → 0` over 200ms
    - Use `ease-out` easing
11. When fade-out completes:
    - Swap primitive styles to new theme
    - Components read new CSS custom properties
12. Trigger fade-in animation:
    - All primitives: `opacity: 0 → 1` over 200ms
    - Stagger delays (50ms per primitive)

**Duration:** 400ms total (200ms out + 200ms in)
**Visual:** Smooth cross-fade, no jarring color swap

---

#### Phase 4: Persistence
**Actor:** Settings Service
**Trigger:** Theme change completed

**Steps:**
13. Save theme preference to local storage:
    ```json
    {
      "user_preferences": {
        "theme": "enterprise-light",
        "theme_mode": "light",
        "last_updated": 1738675200000
      }
    }
    ```
14. If user has cloud sync enabled:
    - Upload preference to AgentPing cloud account
    - Sync to other devices
15. Settings panel shows success checkmark

**Duration:** 50ms (local), 200ms (cloud sync)
**State:** Theme persisted, will restore on next launch

---

### Success Criteria

- ✅ Theme switch feels smooth (no flash of unstyled content)
- ✅ All primitives update consistently (no orphaned old-theme components)
- ✅ Transition animation is subtle (not distracting)
- ✅ Theme preference persists across sessions
- ✅ Theme sync works across Studio instances

---

### Edge Cases

**Edge Case:** User rapidly switches between themes
**Handling:**
1. Cancel in-progress transition animation
2. Queue new theme change
3. Debounce theme changes (max 1 per 500ms)
4. Apply final theme in queue

**Edge Case:** Custom theme has invalid token values
**Handling:**
1. Validate token schema on load
2. Fall back to default "Enterprise" theme
3. Show error toast: "Invalid theme, using default"
4. Log validation errors for debugging

---

## Flow 4: Component State Persistence

### Flow Diagram

```
     USER
  (types in InputField)
       │
       ↓
┌──────────────────────────────────────┐
│  InputField Component                │
│  ─────────────────────────────────   │
│  1. onChange handler fires           │
│  2. Update local state               │
│  3. Emit state change event          │
└──────┬───────────────────────────────┘
       │
       │ 4. { primitiveId, key, value }
       ↓
┌──────────────────────────────────────┐
│  State Store                         │
│  ─────────────────────────────────   │
│  5. Save to in-memory map            │
│  6. Debounce write to SQLite (500ms) │
│  7. Emit state:updated event         │
└──────┬───────────────────────────────┘
       │
       │ (user closes Studio app)
       ↓
┌──────────────────────────────────────┐
│  Studio App Shutdown                 │
│  ─────────────────────────────────   │
│  8. Flush pending state writes       │
│  9. Close SQLite connection          │
└──────────────────────────────────────┘
       │
       │ (user reopens Studio app)
       ↓
┌──────────────────────────────────────┐
│  Studio App Startup                  │
│  ─────────────────────────────────   │
│  10. Load state from SQLite          │
│  11. Restore InputField value        │
└──────────────────────────────────────┘
       │
       ↓
     USER
  (sees previous input value restored)
```

### Detailed Steps

#### Phase 1: State Mutation
**Actor:** User
**Trigger:** User types in InputField "Enter API key"

**Steps:**
1. User focuses InputField (focus ring appears)
2. User types: "sk-abc123"
3. InputField `onChange` handler fires on every keystroke
4. Component updates local React state (immediate UI feedback)
5. After 300ms of no typing (debounce):
   - Emit state change to State Store

**Duration:** 300ms debounce
**State:** InputField shows "sk-abc123", not yet persisted

---

#### Phase 2: State Persistence
**Actor:** State Store
**Trigger:** State change event received

**Steps:**
6. State Store receives:
   ```typescript
   {
     primitiveId: 'input-field-2',
     stateKey: 'value',
     stateValue: 'sk-abc123',
     scope: 'ping',  // Persist for this ping only
     timestamp: Date.now()
   }
   ```
7. Store in in-memory map (instant lookup)
8. After 500ms of no new changes (write debounce):
   - Batch write to SQLite `component_state` table
   ```sql
   INSERT OR REPLACE INTO component_state
   (primitive_id, state_key, state_value, scope, ping_id, updated_at)
   VALUES ('input-field-2', 'value', 'sk-abc123', 'ping', 'ping-123', 1738675200)
   ```
9. Emit `state:persisted` event (for observability)

**Duration:** 500ms write debounce
**State:** Value persisted to SQLite

---

#### Phase 3: State Recovery (After App Restart)
**Actor:** Studio app
**Trigger:** User reopens Studio, navigates to ping

**Steps:**
10. Canvas Workspace loads ping with ID `ping-123`
11. Canvas queries State Store for component state:
    ```typescript
    const states = await stateStore.loadForPing('ping-123')
    // Returns: { 'input-field-2': { value: 'sk-abc123' } }
    ```
12. Canvas passes state to InputField via props:
    ```typescript
    <InputField
      id="input-field-2"
      initialValue={states['input-field-2']?.value ?? ''}
    />
    ```
13. InputField renders with restored value

**Duration:** 50ms (SQLite query)
**Visual:** User sees previous input value, no data loss

---

### Success Criteria

- ✅ Input values persist across app restarts
- ✅ State updates feel instant (no lag from persistence)
- ✅ State scopes work correctly (ping vs session vs global)
- ✅ Debouncing prevents excessive writes
- ✅ State cleanup happens on ping deletion

---

### State Scopes

**Ping Scope:**
- State tied to specific ping ID
- Deleted when ping is deleted
- Use case: Form inputs, selections for this approval

**Session Scope:**
- State tied to current Studio session
- Cleared on app quit
- Use case: Temporary UI preferences (sidebar collapsed)

**Global Scope:**
- State persists indefinitely
- Use case: User preferences (theme, font size)

---

## Flow 5: Skeleton → Partial → Complete Render

### Flow Diagram

```
┌───────────────────────────────────────────────────────────┐
│  Timeline (0ms → 800ms)                                   │
│  ───────────────────────────────────────────────────────  │
│                                                           │
│  0ms:    [skeleton] Card-1                               │
│          ┌─────────────────┐                             │
│          │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Pulsing gray box         │
│          │ ▓▓▓▓▓▓▓▓        │                             │
│          └─────────────────┘                             │
│                                                           │
│  150ms:  [partial] Card-1 {title: "Dashboard"}           │
│          ┌─────────────────┐                             │
│          │ Dashboard       │ ← Title appears             │
│          │ ▓▓▓▓▓▓▓▓        │ ← Body still loading        │
│          └─────────────────┘                             │
│                                                           │
│  300ms:  [partial] Card-1 {subtitle: "Live Data"}        │
│          ┌─────────────────┐                             │
│          │ Dashboard       │                             │
│          │ Live Data       │ ← Subtitle appears          │
│          │ ▓▓▓▓▓▓▓▓        │                             │
│          └─────────────────┘                             │
│                                                           │
│  450ms:  [complete] Card-1 {full primitive}              │
│          ┌─────────────────┐                             │
│          │ Dashboard       │ ← Full content, entrance    │
│          │ Live Data       │    animation (fade-up)      │
│          │ [Metrics: 42]   │                             │
│          └─────────────────┘                             │
│                                                           │
│  500ms:  [skeleton] Card-2                               │
│          ┌─────────────────┐                             │
│          │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Second card starts        │
│          └─────────────────┘                             │
│                                                           │
│  800ms:  [complete] Card-2                               │
│          ┌─────────────────┐                             │
│          │ Tasks           │ ← Second card complete      │
│          │ 5 pending       │    (50ms stagger delay)     │
│          └─────────────────┘                             │
└───────────────────────────────────────────────────────────┘
```

### Detailed Steps

#### T=0ms: Skeleton Emitted
**Actor:** Daemon stream emitter
**Event:**
```typescript
{
  type: 'skeleton',
  id: 'card-1',
  kind: 'card'
}
```

**Rendering:**
1. StreamRenderer creates SkeletonCard component
2. Renders gray pulsing box (same dimensions as final card)
3. Applies `pulse` animation (opacity 1 → 0.5 → 1, 2s loop)

**Visual:** User sees loading placeholder immediately

---

#### T=150ms: First Partial
**Event:**
```typescript
{
  type: 'partial',
  id: 'card-1',
  props: { title: 'Dashboard' }
}
```

**Rendering:**
1. StreamRenderer patches `title` into skeleton
2. Fade in title text (100ms transition)
3. Body remains skeleton (pulsing)

**Visual:** Title appears while waiting for rest of content

---

#### T=300ms: Second Partial
**Event:**
```typescript
{
  type: 'partial',
  id: 'card-1',
  props: { subtitle: 'Live Data' }
}
```

**Rendering:**
1. Patch `subtitle` into card
2. Fade in subtitle (100ms)
3. Body still skeleton

**Visual:** More details incrementally revealed

---

#### T=450ms: Complete
**Event:**
```typescript
{
  type: 'complete',
  id: 'card-1',
  primitive: {
    kind: 'card',
    id: 'card-1',
    props: { title: 'Dashboard', subtitle: 'Live Data' },
    children: [
      { kind: 'metric-value', ... }
    ]
  }
}
```

**Rendering:**
1. Replace skeleton with full Card component
2. Trigger entrance animation:
   - Fade in: `opacity: 0 → 1` (250ms)
   - Slide up: `transform: translateY(8px) → 0` (250ms)
   - Easing: `ease-out`
3. Render children (MetricValue)

**Visual:** Card fully materializes with smooth animation

---

#### T=500ms: Next Skeleton
**Event:**
```typescript
{
  type: 'skeleton',
  id: 'card-2',
  kind: 'card'
}
```

**Rendering:**
1. Second skeleton appears below first card
2. Stagger delay (50ms after Card-1 complete)

**Visual:** User sees next component beginning to load

---

### Success Criteria

- ✅ Skeleton dimensions match final component (no layout shift)
- ✅ Partial updates feel smooth (no flicker)
- ✅ Entrance animations don't overlap (stagger prevents chaos)
- ✅ User perceives progress (loading → partial → complete)
- ✅ Total time feels faster than atomic render (even if same duration)

---

## Key Takeaways

1. **Streaming creates engagement:** Progressive render keeps user watching instead of waiting
2. **Visual feedback is critical:** Every action needs instant visual confirmation
3. **Smooth transitions matter:** Fade/slide animations prevent jarring UI changes
4. **State persistence enables continuity:** Users can pause and resume without data loss
5. **Theme switching should be seamless:** No flash of wrong colors during transition

---

## Next Steps

- **Step 4:** Design interaction model (component event taxonomy, callback API)
- **Step 5:** Establish visual identity (finalize token values for Enterprise theme)
- **Step 6:** Design 18 core primitives (detailed specs with variants)
- **Step 7:** Create wireframes (GenUI pipeline from agent to canvas)

