# Step 4: Interaction Model

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Design Challenge:** Premium GenUI Component System for AgentPing
**Date:** 2026-02-10

---

## Interaction Taxonomy

### Level 1: Passive Display
**Definition:** Components that show information, no user input
**Primitives:** Text, Badge, StatusDot, MetricValue, Divider
**Interaction:** Hover states only (no click/change events)

**Example:**
```typescript
MetricValue({
  label: 'Active Users',
  value: 1247,
  trend: 'up',
  // No event handlers - display only
})
```

**States:**
- `default`: Normal display
- `hover`: Subtle brightness increase (optional)

---

### Level 2: Single Action
**Definition:** Components with one primary action (click/toggle)
**Primitives:** Button, CheckItem, NavItem, ListItem
**Interaction:** `onClick` handler

**Example:**
```typescript
Button({
  text: 'Approve',
  variant: 'primary',
  onClick: (data) => {
    // Emit action event to agent
    emitAction('approve', { timestamp: Date.now() })
  }
})
```

**States:**
- `default`: Idle, waiting for interaction
- `hover`: Visual preview (color shift, shadow lift)
- `active`: Pressed (scale down)
- `disabled`: Grayed out, not interactive
- `loading`: Spinner replaces text, disabled

---

### Level 3: Continuous Input
**Definition:** Components that accept ongoing user input
**Primitives:** InputField, Slider, Select
**Interaction:** `onChange` handler (fires on every change)

**Example:**
```typescript
InputField({
  label: 'API Key',
  type: 'password',
  onChange: (value) => {
    // Update state, debounce persistence
    stateStore.set('api-key', value)
  }
})
```

**States:**
- `default`: Empty, showing placeholder
- `focus`: Accent border, shadow ring
- `filled`: Contains value
- `error`: Red border, error message
- `disabled`: Grayed out, not editable

---

### Level 4: Form Submission
**Definition:** Container components that group inputs and submit
**Primitives:** Card (with ActionBar), Stack (with Submit button)
**Interaction:** `onSubmit` handler (fires when form submitted)

**Example:**
```typescript
Card({
  title: 'Configuration',
  children: [
    InputField({ label: 'API Key', id: 'key' }),
    InputField({ label: 'Endpoint', id: 'endpoint' }),
    ActionBar({
      actions: [
        { text: 'Cancel', variant: 'ghost', onClick: () => {...} },
        { text: 'Save', variant: 'primary', onClick: () => {
          // Gather all child input values, submit
          const formData = gatherFormData()
          emitAction('submit', formData)
        }}
      ]
    })
  ]
})
```

**States:**
- `editing`: User actively filling form
- `validating`: Checking input validity
- `submitting`: Disabled, loading spinner
- `success`: Green checkmark, brief toast
- `error`: Red border, error details

---

## Event Handler API

### Primitive Event Props

All primitives support optional event handlers:

```typescript
interface PrimitiveEventHandlers {
  onClick?: (context: ClickContext) => void;
  onChange?: (value: unknown) => void;
  onSubmit?: (data: Record<string, unknown>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onHover?: () => void;
}

interface ClickContext {
  primitiveId: string;
  primitiveKind: PrimitiveKind;
  label?: string;
  variant?: string;
  timestamp: number;
  // Any custom data attached to primitive
  custom?: Record<string, unknown>;
}
```

### HTML Renderer: Event Attributes

For HTML output, events are rendered as `data-action` + inline `onclick`:

```html
<button
  class="ap-btn ap-btn--primary"
  data-id="button-1"
  data-action="click"
  onclick="AP.emit('button-1', 'click', {label: 'Approve', variant: 'primary'})"
>
  Approve
</button>
```

**Client-side JS:**
```javascript
const AP = {
  emit(primitiveId, actionType, data) {
    // Flash visual feedback
    const el = document.querySelector(`[data-id="${primitiveId}"]`)
    el.style.boxShadow = '0 0 0 2px var(--accent)'
    setTimeout(() => el.style.boxShadow = '', 300)

    // Log to event console
    console.log('[AgentPing Action]', actionType, primitiveId, data)

    // If MCP bridge is present, send to agent
    if (window.AgentPingBridge) {
      window.AgentPingBridge.sendAction({
        primitiveId,
        actionType,
        actionData: data,
        timestamp: Date.now()
      })
    }
  }
}
```

---

### React Renderer: Hook Integration

For React output, events use standard React handlers:

```typescript
function ButtonComponent({ primitive, onClick }: Props) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await onClick?.({
        primitiveId: primitive.id,
        primitiveKind: 'button',
        label: primitive.props.text,
        timestamp: Date.now()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="ap-btn ap-btn--primary"
      onClick={handleClick}
      disabled={loading || primitive.props.disabled}
    >
      {loading ? <Spinner /> : primitive.props.text}
    </button>
  )
}
```

---

### Pencil Renderer: Event Metadata

For Pencil output, events are stored as metadata (no runtime execution):

```typescript
// Pencil frame with event metadata
{
  type: 'frame',
  name: 'Button',
  metadata: {
    agentping: {
      primitiveId: 'button-1',
      eventHandlers: {
        onClick: {
          actionType: 'click',
          actionData: { label: 'Approve' }
        }
      }
    }
  }
}
```

**Use case:** Design tool can annotate interactive hotspots for prototyping

---

## State Management API

### useAgentPingState Hook (React)

```typescript
function useAgentPingState<T>(
  key: string,
  defaultValue: T,
  scope: 'ping' | 'session' | 'global' = 'ping'
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const stateStore = useContext(StateStoreContext)

  // Load initial value on mount
  useEffect(() => {
    const loaded = stateStore.get(key, scope)
    if (loaded !== undefined) {
      setValue(loaded)
    }
  }, [key, scope])

  // Persist on change (debounced)
  const setPersistentValue = useMemo(
    () => debounce((newValue: T) => {
      stateStore.set(key, newValue, scope)
    }, 500),
    [key, scope]
  )

  const handleChange = (newValue: T) => {
    setValue(newValue)  // Immediate UI update
    setPersistentValue(newValue)  // Debounced persistence
  }

  return [value, handleChange]
}
```

**Usage:**
```typescript
function InputFieldComponent({ primitive }: Props) {
  const [value, setValue] = useAgentPingState(
    `input-${primitive.id}`,
    primitive.props.value ?? '',
    'ping'
  )

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

---

### State Store Implementation

```typescript
interface StateStore {
  get(key: string, scope: StateScope): unknown | undefined;
  set(key: string, value: unknown, scope: StateScope): void;
  delete(key: string, scope: StateScope): void;
  clear(scope: StateScope): void;
  loadForPing(pingId: string): Promise<Record<string, unknown>>;
}

type StateScope = 'ping' | 'session' | 'global'

class SQLiteStateStore implements StateStore {
  private inMemory: Map<string, unknown> = new Map()
  private pendingWrites: Set<string> = new Set()

  get(key: string, scope: StateScope): unknown | undefined {
    return this.inMemory.get(this.scopedKey(key, scope))
  }

  set(key: string, value: unknown, scope: StateScope): void {
    const scopedKey = this.scopedKey(key, scope)
    this.inMemory.set(scopedKey, value)
    this.schedulePersist(scopedKey, value, scope)
  }

  private schedulePersist(key: string, value: unknown, scope: StateScope) {
    this.pendingWrites.add(key)
    // Batch writes every 500ms
    debounce(() => this.flushPendingWrites(), 500)()
  }

  private async flushPendingWrites() {
    const writes = Array.from(this.pendingWrites)
    this.pendingWrites.clear()

    await this.db.run(`
      INSERT OR REPLACE INTO component_state
      (key, value, scope, ping_id, updated_at)
      VALUES ${writes.map(() => '(?, ?, ?, ?, ?)').join(', ')}
    `, writes.flatMap(key => [
      key,
      JSON.stringify(this.inMemory.get(key)),
      this.extractScope(key),
      this.currentPingId,
      Date.now()
    ]))
  }
}
```

---

## Streaming Interaction States

### Skeleton State
**Visual:** Gray pulsing box, no interaction
**Duration:** 0-500ms (until partial arrives)
**Cursor:** `default` (not clickable)

```css
.ap-skeleton {
  background: linear-gradient(
    90deg,
    var(--border) 0%,
    color-mix(in srgb, var(--border) 50%, var(--surface)) 50%,
    var(--border) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 2s ease-in-out infinite;
  border-radius: var(--radius-lg);
  cursor: default;
  pointer-events: none;
}

@keyframes skeleton-pulse {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
}
```

---

### Partial State
**Visual:** Some content visible, rest still loading
**Duration:** 0-300ms (until complete arrives)
**Cursor:** `default` (not yet clickable)

```css
.ap-partial {
  opacity: 0.7;
  pointer-events: none;
}

.ap-partial__loaded {
  /* Parts that have arrived */
  opacity: 1;
}

.ap-partial__skeleton {
  /* Parts still loading */
  animation: skeleton-pulse 2s ease-in-out infinite;
}
```

---

### Complete State
**Visual:** Full content, entrance animation, interactive
**Duration:** 250ms (entrance animation)
**Cursor:** `pointer` for interactive primitives

```css
.ap-complete {
  animation: entrance 250ms ease-out;
  cursor: pointer;
}

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
```

---

### Loading State (After Interaction)
**Visual:** Spinner replaces content, disabled
**Duration:** Variable (until agent responds)
**Cursor:** `wait`

```css
.ap-loading {
  position: relative;
  pointer-events: none;
  cursor: wait;
}

.ap-loading::before {
  content: '';
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  border-radius: inherit;
}

.ap-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--accent);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}
```

---

## Micro-Interactions

### Button Press
**Trigger:** `mousedown` on button
**Effect:** Scale down slightly, increase shadow

```css
.ap-btn:active {
  transform: scale(0.97);
  box-shadow: var(--shadow-sm);
}
```

**Duration:** 150ms
**Easing:** `ease-out`

---

### Focus Ring
**Trigger:** Keyboard focus (tab navigation)
**Effect:** Accent ring around element

```css
.ap-btn:focus-visible,
.ap-input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent);
}
```

**Accessibility:** Must be visible for keyboard users

---

### Hover Glow
**Trigger:** Mouse hover over interactive element
**Effect:** Subtle brightness increase, shadow lift

```css
.ap-btn:hover {
  filter: brightness(1.1);
  box-shadow: var(--shadow-md);
}

.ap-card:hover {
  border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent);
}
```

**Duration:** 150ms transition
**Easing:** `ease-out`

---

### Checkbox Toggle
**Trigger:** Click on CheckItem
**Effect:** Checkmark fade in, label strikethrough

```css
.ap-check__input:checked + .ap-check__box::after {
  content: '';
  display: block;
  width: 4px;
  height: 8px;
  border: solid var(--bg);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-1px);
  animation: checkmark 200ms ease-out;
}

@keyframes checkmark {
  from {
    opacity: 0;
    transform: rotate(45deg) translateY(-1px) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(45deg) translateY(-1px) scale(1);
  }
}

.ap-check--checked .ap-check__label {
  color: var(--muted);
  text-decoration: line-through;
  transition: all 200ms ease-out;
}
```

---

### Progress Bar Fill
**Trigger:** Value prop changes
**Effect:** Smooth width transition

```css
.ap-progress__bar {
  width: var(--progress-value, 0%);
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Animation:** Eased acceleration (feels organic)

---

## Gesture Support (Touch Devices)

### Tap Target Sizes
**Minimum:** 44x44px (iOS guideline)
**Implementation:** Expand clickable area with padding

```css
@media (pointer: coarse) {
  .ap-btn {
    min-height: 44px;
    min-width: 44px;
    padding: 10px 16px;
  }
}
```

---

### Touch Feedback
**Trigger:** `touchstart` on interactive element
**Effect:** Brief highlight, haptic feedback (iOS)

```typescript
function handleTouchStart(e: TouchEvent) {
  const el = e.currentTarget as HTMLElement
  el.classList.add('ap-touch-active')

  // Trigger haptic on iOS
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }

  setTimeout(() => {
    el.classList.remove('ap-touch-active')
  }, 150)
}
```

```css
.ap-touch-active {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
}
```

---

### Swipe Gestures (Future Enhancement)
**Use Case:** Swipe card to dismiss, swipe list to reveal actions
**Implementation:** React swipe library or custom gesture detector

**Not in MVP**, but architecture supports it:
```typescript
Card({
  onSwipeLeft: () => { /* dismiss card */ },
  onSwipeRight: () => { /* show actions */ }
})
```

---

## Keyboard Navigation

### Tab Order
All interactive primitives are keyboard-accessible:
1. Buttons
2. Input fields
3. Checkboxes
4. Nav items
5. List items

**Implementation:** Ensure `tabindex="0"` on interactive elements

---

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Move focus to next interactive element |
| `Shift+Tab` | Move focus to previous element |
| `Enter` | Activate focused button/link |
| `Space` | Toggle focused checkbox |
| `Escape` | Cancel/close modal or popover |
| `Arrow Up/Down` | Navigate list items |

**Implementation:**
```typescript
function handleKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
    case ' ':
      if (e.target.matches('.ap-btn, .ap-check')) {
        e.preventDefault()
        e.target.click()
      }
      break
    case 'Escape':
      closeModal()
      break
  }
}
```

---

## Accessibility (ARIA)

### Button States
```html
<button
  class="ap-btn"
  aria-label="Approve request"
  aria-disabled="false"
  aria-busy="false"
>
  Approve
</button>
```

---

### Input Labels
```html
<div class="ap-input">
  <label for="input-1" class="ap-input__label">
    API Key
  </label>
  <input
    id="input-1"
    type="password"
    aria-required="true"
    aria-invalid="false"
    aria-describedby="input-1-error"
  />
  <span id="input-1-error" class="ap-input__error" role="alert">
    Invalid format
  </span>
</div>
```

---

### Loading States
```html
<button
  class="ap-btn ap-loading"
  aria-busy="true"
  aria-label="Loading..."
  disabled
>
  <span aria-hidden="true">Approve</span>
  <span class="sr-only">Loading, please wait</span>
</button>
```

---

## Error Handling

### Invalid Input
**Trigger:** Form validation fails
**Effect:** Red border, error message, focus input

```typescript
function validateInput(value: string): string | null {
  if (!value) return 'This field is required'
  if (value.length < 3) return 'Minimum 3 characters'
  return null
}

function InputField({ primitive, onChange }: Props) {
  const [error, setError] = useState<string | null>(null)

  const handleChange = (value: string) => {
    const validationError = validateInput(value)
    setError(validationError)
    onChange(value, { valid: !validationError })
  }

  return (
    <div className="ap-input">
      <input
        className={error ? 'ap-input--error' : ''}
        aria-invalid={!!error}
        onChange={(e) => handleChange(e.target.value)}
      />
      {error && (
        <span className="ap-input__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
```

---

### Action Failure
**Trigger:** Agent action callback throws error
**Effect:** Toast notification, reset button state

```typescript
async function handleAction(actionData: unknown) {
  try {
    await emitActionToAgent(actionData)
    showToast('Action sent', 'success')
  } catch (err) {
    showToast('Action failed, try again', 'error')
    console.error('[AgentPing]', err)
  }
}
```

---

## Interaction Principles

1. **Immediate Feedback**
   Every interaction must have instant visual feedback (< 100ms)

2. **Progressive Enhancement**
   Basic functionality works without JS; interactions enhance experience

3. **Forgiving Interfaces**
   Allow undo, confirm destructive actions, auto-save state

4. **Consistent Patterns**
   Same gestures/shortcuts work across all primitives

5. **Accessible by Default**
   Keyboard nav, screen reader support, ARIA attributes required

---

## Next Steps

- **Step 5:** Establish visual identity (finalize design token values)
- **Step 6:** Design 18 core primitives (detailed component specs)
- **Step 7:** Create wireframes (end-to-end GenUI pipeline visualization)

