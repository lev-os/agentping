# Step 6: Component Specifications

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Design Challenge:** Premium GenUI Component System for AgentPing
**Date:** 2026-02-10

---

## Component Priority Matrix

### Tier 1: Foundation (Must Have — 6 primitives)
Core building blocks used in 80%+ of dashboards
- **Button** — Primary actions
- **Text** — Content display
- **Card** — Content grouping
- **InputField** — Data entry
- **Badge** — Status indicators
- **Stack** — Layout container

### Tier 2: Interactive (High Value — 6 primitives)
User input and selection
- **CheckItem** — Toggles
- **Select** — Dropdowns
- **ProgressBar** — Loading/completion
- **NavItem** — Navigation
- **ListItem** — Selectable lists
- **Alert** — Notifications

### Tier 3: Data Display (Data-Heavy UIs — 6 primitives)
Charts and structured data
- **Table** — Tabular data
- **MetricValue** — KPIs
- **LineChart** — Time series
- **BarChart** — Comparisons
- **StatusDot** — Connection state
- **Divider** — Visual separators

**Total: 18 primitives** (12 existing + 6 new)

---

## 1. Button

**Purpose:** Trigger actions (agent responses, form submissions, navigation)

### Variants

#### Primary
**Use:** Main call-to-action
**Visual:** Filled with accent color, high contrast text

```typescript
Button({
  text: 'Approve Request',
  variant: 'primary',
  onClick: (ctx) => emitAction('approve', ctx)
})
```

**Anatomy:**
```
┌─────────────────────────┐
│    Approve Request      │  ← Text (medium weight, 13px)
└─────────────────────────┘
  ↑                     ↑
  8px padding         8px padding
  12px radius         Blue #0969da fill
  Medium shadow       White text
```

**States:**
- **Default:** Blue fill, white text, subtle shadow
- **Hover:** Brightness +10%, shadow lift, 1px up
- **Active:** Scale 0.98, shadow reduce
- **Disabled:** Opacity 0.4, not clickable
- **Loading:** Spinner replaces text, disabled

---

#### Secondary
**Use:** Alternative actions (Cancel, Go Back)
**Visual:** Outlined, transparent fill

```typescript
Button({
  text: 'Cancel',
  variant: 'secondary',
  onClick: (ctx) => emitAction('cancel', ctx)
})
```

**Anatomy:**
```
┌─────────────────────────┐
│        Cancel           │  ← Text color (primary text)
└─────────────────────────┘
  1px border (gray-300)
  Transparent background
  Hover: gray-50 background
```

---

#### Ghost
**Use:** Low-priority actions (More Options, Learn More)
**Visual:** No border, no fill, text only

```typescript
Button({
  text: 'Show Details',
  variant: 'ghost',
  onClick: (ctx) => emitAction('details', ctx)
})
```

**Anatomy:**
```
  Show Details  ← Muted text color
  No border, no background
  Hover: slight gray background
```

---

#### Danger
**Use:** Destructive actions (Delete, Reject, Remove)
**Visual:** Red fill, white text

```typescript
Button({
  text: 'Reject',
  variant: 'danger',
  onClick: (ctx) => emitAction('reject', ctx)
})
```

**Anatomy:**
```
┌─────────────────────────┐
│        Reject           │  ← White text
└─────────────────────────┘
  Red #cf222e fill
  Medium shadow
  Hover: brightness +10%
```

---

### Size Variants

**Small:** 6px vertical, 12px horizontal padding, 12px text
**Medium (default):** 8px vertical, 16px horizontal padding, 13px text
**Large:** 10px vertical, 20px horizontal padding, 14px text

---

### Props API

```typescript
interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;  // Icon before text (optional)
  iconPosition?: 'left' | 'right';
  onClick?: (ctx: ClickContext) => void;
}
```

---

### Accessibility

```html
<button
  class="ap-btn ap-btn--primary"
  role="button"
  aria-label="Approve request"
  aria-disabled="false"
  aria-busy="false"
>
  Approve Request
</button>
```

---

## 2. Card

**Purpose:** Group related content, create visual hierarchy

### Variants

#### Default
**Use:** Standard content container
**Visual:** White background (light), dark background (dark), subtle border

```typescript
Card({
  title: 'System Status',
  subtitle: 'Last updated 2 minutes ago',
  children: [
    StatusDot({ status: 'online', label: 'Database' }),
    StatusDot({ status: 'online', label: 'API Server' })
  ]
})
```

**Anatomy:**
```
┌──────────────────────────────────────┐
│ System Status                        │  ← Title (14px, semibold)
│ Last updated 2 minutes ago           │  ← Subtitle (12px, muted)
│ ──────────────────────────────────── │  ← Divider (optional)
│                                      │
│  ● Database      [online]            │  ← Children
│  ● API Server    [online]            │
│                                      │
└──────────────────────────────────────┘
  ↑                                  ↑
  16px padding                       12px radius
  bg-surface fill                    subtle border
```

**States:**
- **Default:** Subtle border, small shadow
- **Hover:** Border accent tint, shadow lift
- **Interactive:** If has onClick, cursor pointer

---

#### Elevated
**Use:** Prominent cards (featured content, CTAs)
**Visual:** Larger shadow, more spacing

```typescript
Card({
  title: 'Upgrade to Pro',
  variant: 'elevated',
  children: [...]
})
```

**Anatomy:**
```
┌──────────────────────────────────────┐
│                                      │
│  Upgrade to Pro                      │
│  Get advanced features now           │
│                                      │
│  [Upgrade Now →]                     │
│                                      │
└──────────────────────────────────────┘
  20px padding (more spacious)
  Large shadow
  Optional gradient background
```

---

### Props API

```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  children?: PolymorphPrimitive[];
  onClick?: (ctx: ClickContext) => void;
}
```

---

## 3. InputField

**Purpose:** Text input from user

### Types

**Text (default):**
```typescript
InputField({
  label: 'API Key',
  placeholder: 'Enter your API key',
  type: 'text',
  onChange: (value) => stateStore.set('api-key', value)
})
```

**Password:**
```typescript
InputField({
  label: 'Secret Token',
  type: 'password',
  onChange: (value) => stateStore.set('token', value)
})
```

**Email:**
```typescript
InputField({
  label: 'Email Address',
  type: 'email',
  placeholder: 'you@example.com',
  onChange: (value) => stateStore.set('email', value)
})
```

**Number:**
```typescript
InputField({
  label: 'Timeout (seconds)',
  type: 'number',
  value: 30,
  onChange: (value) => stateStore.set('timeout', value)
})
```

---

### Anatomy

```
Label Text                ← 12px, medium weight, muted
┌──────────────────────────────────────┐
│ Placeholder text or value            │  ← 13px, base color
└──────────────────────────────────────┘
  ↑                                  ↑
  8px vertical padding               8px radius
  10px horizontal padding            border-subtle
  bg-base background
```

**States:**
- **Empty:** Show placeholder (muted, opacity 0.6)
- **Focus:** Accent border, ring shadow
- **Filled:** Value displayed, normal text color
- **Error:** Red border, error message below
- **Disabled:** Gray background, not editable

---

### Error State

```typescript
InputField({
  label: 'Email',
  type: 'email',
  value: 'invalid',
  error: 'Invalid email format',
  onChange: (value) => validateEmail(value)
})
```

**Anatomy:**
```
Email
┌──────────────────────────────────────┐
│ invalid                              │  ← Red border
└──────────────────────────────────────┘
  ⚠ Invalid email format  ← Error text (12px, red)
```

---

### Props API

```typescript
interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  value?: string | number;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string | number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

---

## 4. Badge

**Purpose:** Status indicators, tags, labels

### Variants

**Default (neutral):**
```typescript
Badge({ text: 'Draft', variant: 'default' })
```
Gray background, muted text

**Success (green):**
```typescript
Badge({ text: 'Approved', variant: 'success' })
```
Green tint background, green text

**Warning (amber):**
```typescript
Badge({ text: 'Pending', variant: 'warning' })
```
Amber tint background, amber text

**Error (red):**
```typescript
Badge({ text: 'Rejected', variant: 'error' })
```
Red tint background, red text

**Info (blue):**
```typescript
Badge({ text: 'New', variant: 'info' })
```
Blue tint background, blue text

---

### Anatomy

```
┌─────────────┐
│  Approved   │  ← 11px text, medium weight
└─────────────┘
  ↑         ↑
  2px vert  4px radius
  8px horiz 15% opacity color tint background
```

**Sizes:**
- **sm:** 1px vertical, 6px horizontal, 10px text
- **md (default):** 2px vertical, 8px horizontal, 11px text
- **lg:** 3px vertical, 10px horizontal, 12px text

---

### Props API

```typescript
interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}
```

---

## 5. CheckItem

**Purpose:** Boolean toggles, task lists, multi-select

### Anatomy

```
┌───┐
│ ✓ │  Task completed  ← 13px text
└───┘
  ↑
  16x16px checkbox
  Accent fill when checked
  Checkmark appears on check
```

**States:**
- **Unchecked:** Empty box, gray border
- **Checked:** Accent fill, white checkmark, label strikethrough (optional)
- **Hover:** Border darkens slightly
- **Disabled:** Grayed out, not clickable

---

### Usage

```typescript
CheckItem({
  text: 'Enable notifications',
  checked: true,
  onChange: (checked) => stateStore.set('notifications', checked)
})
```

**Task list variant:**
```typescript
CheckItem({
  text: 'Deploy to production',
  checked: false,
  onChange: (checked) => {
    // Strike through label when checked
  }
})
```

**Anatomy (checked):**
```
┌───┐
│ ✓ │  Deploy to production  ← Strikethrough, muted
└───┘
  Accent #0969da fill
  White checkmark icon
```

---

### Props API

```typescript
interface CheckItemProps {
  text: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}
```

---

## 6. ProgressBar

**Purpose:** Show completion percentage, loading states

### Determinate (with known percentage)

```typescript
ProgressBar({
  label: 'Upload Progress',
  value: 67,
  max: 100,
  variant: 'default'
})
```

**Anatomy:**
```
Upload Progress                    67%  ← Label + percentage
┌──────────────────────────────────────┐
│████████████████████                  │  ← Filled portion
└──────────────────────────────────────┘
  ↑                                  ↑
  6px height                         3px radius
  bg-border track                    accent fill
  Smooth 600ms transition on value change
```

---

### Variants

**Default (blue):**
```typescript
ProgressBar({ value: 50, variant: 'default' })
```
Accent color fill

**Success (green):**
```typescript
ProgressBar({ value: 100, variant: 'success' })
```
Green fill (for completed states)

**Warning (amber):**
```typescript
ProgressBar({ value: 80, variant: 'warning' })
```
Amber fill (for approaching limits)

**Error (red):**
```typescript
ProgressBar({ value: 95, variant: 'error' })
```
Red fill (for over-limit states)

---

### Indeterminate (unknown duration)

```typescript
ProgressBar({
  label: 'Processing...',
  indeterminate: true
})
```

**Anatomy:**
```
Processing...
┌──────────────────────────────────────┐
│  ████                                │  ← Animated shimmer
└──────────────────────────────────────┘
  Shimmer moves left → right (2s loop)
  Gradient fill with animation
```

---

### Props API

```typescript
interface ProgressBarProps {
  label?: string;
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

---

## 7. MetricValue

**Purpose:** Display KPIs, statistics, numerical data

### Basic Usage

```typescript
MetricValue({
  label: 'Active Users',
  value: 1247,
  unit: 'users'
})
```

**Anatomy:**
```
ACTIVE USERS          ← 11px, uppercase, wide spacing, muted
1,247 users           ← 28px, bold, tabular nums
  ↑
  Large number (primary text)
  Optional unit (13px, muted)
```

---

### With Trend

```typescript
MetricValue({
  label: 'Revenue',
  value: '$42,350',
  trend: 'up',
  trendValue: '+12%'
})
```

**Anatomy:**
```
REVENUE
$42,350  ▲ +12%
         ↑
         Green up arrow + percentage
         (success color)
```

**Trend Variants:**
- **up:** Green ▲ (positive)
- **down:** Red ▼ (negative)
- **flat:** Gray — (neutral)

---

### Sizes

**Small:** 18px value, 10px label
**Medium (default):** 28px value, 11px label
**Large:** 36px value, 12px label

---

### Props API

```typescript
interface MetricValueProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

---

## 8. Alert

**Purpose:** Persistent notifications, status messages

### Variants

**Info (blue):**
```typescript
Alert({
  title: 'New feature available',
  message: 'Try the new dashboard builder',
  variant: 'info'
})
```

**Success (green):**
```typescript
Alert({
  title: 'Request approved',
  message: 'The deployment has been scheduled',
  variant: 'success'
})
```

**Warning (amber):**
```typescript
Alert({
  title: 'Action required',
  message: 'API key expires in 7 days',
  variant: 'warning'
})
```

**Error (red):**
```typescript
Alert({
  title: 'Operation failed',
  message: 'Could not connect to database',
  variant: 'error'
})
```

---

### Anatomy

```
┌──────────────────────────────────────┐
│ ⓘ New feature available              │  ← Icon + title (14px, semibold)
│   Try the new dashboard builder      │  ← Message (13px)
│                                   ×  │  ← Close button (optional)
└──────────────────────────────────────┘
  ↑                                  ↑
  12px padding                       8px radius
  Tinted background (15% opacity)    Colored left border (3px)
```

**States:**
- **Default:** Visible with icon and message
- **Dismissible:** Close button appears on right
- **Dismissed:** Fade out (250ms), remove from DOM

---

### Props API

```typescript
interface AlertProps {
  title?: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

---

## 9. Table

**Purpose:** Display structured tabular data

### Basic Usage

```typescript
Table({
  columns: [
    { key: 'name', label: 'Name', width: '40%' },
    { key: 'status', label: 'Status', width: '20%' },
    { key: 'date', label: 'Date', width: '40%' }
  ],
  rows: [
    { name: 'Deploy API', status: 'Complete', date: '2026-02-10' },
    { name: 'Update Docs', status: 'Pending', date: '2026-02-11' }
  ]
})
```

**Anatomy:**
```
┌────────────────┬──────────┬────────────┐
│ Name           │ Status   │ Date       │  ← Header (12px, medium, muted)
├────────────────┼──────────┼────────────┤
│ Deploy API     │ Complete │ 2026-02-10 │  ← Row (13px, base)
│ Update Docs    │ Pending  │ 2026-02-11 │
└────────────────┴──────────┴────────────┘
  ↑                                     ↑
  12px cell padding                     border-subtle
```

**States:**
- **Default:** Rows with subtle borders
- **Hover:** Row background tint (subtle gray)
- **Striped:** Alternating row backgrounds (optional)
- **Sortable:** Column headers clickable, show sort icon

---

### With Sortable Columns

```typescript
Table({
  columns: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ],
  rows: [...],
  onSort: (columnKey, direction) => {
    // Sort data by column
  }
})
```

**Header with sort:**
```
┌────────────────┬────────────┐
│ Name ▲         │ Date       │  ← Active sort indicator
├────────────────┼────────────┤
```

---

### Props API

```typescript
interface TableProps {
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
  }>;
  rows: Array<Record<string, unknown>>;
  striped?: boolean;
  onRowClick?: (row: Record<string, unknown>) => void;
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
}
```

---

## 10. LineChart

**Purpose:** Time series data visualization

### Usage

```typescript
LineChart({
  title: 'Daily Active Users',
  data: [
    { x: '2026-02-01', y: 120 },
    { x: '2026-02-02', y: 145 },
    { x: '2026-02-03', y: 132 },
    { x: '2026-02-04', y: 158 },
    { x: '2026-02-05', y: 171 }
  ],
  xLabel: 'Date',
  yLabel: 'Users'
})
```

**Anatomy:**
```
Daily Active Users                    ← Title (14px, semibold)

200 ┤                          ●       ← Y-axis labels
150 ┤             ●──●────●              Grid lines (subtle)
100 ┤    ●──●                           Line stroke (accent color)
 50 ┤                                   Data points (dots)
  0 └───┴───┴───┴───┴──→
    Feb1 Feb2 Feb3 Feb4 Feb5           ← X-axis labels (rotated if needed)
```

**Visual Properties:**
- Line stroke: 2px, accent color
- Data points: 4px circles, accent fill, white stroke
- Grid lines: 1px, border-subtle, dashed
- Axis labels: 11px, muted
- Chart padding: 16px all sides

---

### Props API

```typescript
interface LineChartProps {
  title?: string;
  data: Array<{ x: string | number; y: number }>;
  xLabel?: string;
  yLabel?: string;
  color?: string;  // Defaults to accent
  showGrid?: boolean;
  showPoints?: boolean;
}
```

---

## 11. BarChart

**Purpose:** Compare values across categories

### Usage

```typescript
BarChart({
  title: 'Tasks by Status',
  data: [
    { label: 'Completed', value: 45 },
    { label: 'In Progress', value: 23 },
    { label: 'Blocked', value: 8 }
  ]
})
```

**Anatomy:**
```
Tasks by Status

Completed    ████████████████████  45  ← Bar + value label
In Progress  ██████████            23
Blocked      ███                    8

  ↑
  Bars (8px height, 4px gap)
  Accent fill (or custom colors)
```

**Visual Properties:**
- Bar height: 8px
- Bar gap: 4px
- Bar radius: 2px (right side)
- Value labels: 12px, tabular nums
- Category labels: 13px, left-aligned

---

### Props API

```typescript
interface BarChartProps {
  title?: string;
  data: Array<{ label: string; value: number; color?: string }>;
  showValues?: boolean;
  maxValue?: number;  // Auto-calculate if omitted
}
```

---

## 12. Stack (Layout Primitive)

**Purpose:** Vertical or horizontal layout container

### Vertical Stack

```typescript
Stack({
  direction: 'vertical',
  gap: 4,
  children: [
    Text({ content: 'Section 1' }),
    Text({ content: 'Section 2' }),
    Text({ content: 'Section 3' })
  ]
})
```

**Anatomy:**
```
┌────────────────┐
│ Section 1      │
│                │  ← 16px gap (gap: 4)
│ Section 2      │
│                │
│ Section 3      │
└────────────────┘
  Flex column
  Align: stretch (default)
```

---

### Horizontal Stack

```typescript
Stack({
  direction: 'horizontal',
  gap: 3,
  align: 'center',
  children: [
    Button({ text: 'Cancel', variant: 'secondary' }),
    Button({ text: 'Save', variant: 'primary' })
  ]
})
```

**Anatomy:**
```
┌──────────┐       ┌──────────┐
│  Cancel  │  ←12px gap→  │   Save   │
└──────────┘       └──────────┘
  Flex row
  Align: center (vertical centering)
```

---

### Props API

```typescript
interface StackProps {
  direction: 'vertical' | 'horizontal';
  gap?: number;  // Spacing scale (1-16)
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  children: PolymorphPrimitive[];
}
```

---

## Component State Machine

All interactive primitives follow this state lifecycle:

```
SKELETON
  ↓ (stream chunk arrives)
PARTIAL (some props loaded)
  ↓ (complete chunk arrives)
IDLE (fully rendered, awaiting interaction)
  ↓ (user interacts)
INTERACTING (hover, focus, or click)
  ↓ (action emitted)
LOADING (waiting for agent response)
  ↓ (response arrives or timeout)
IDLE (ready for next interaction)
```

---

## Responsive Behavior

All primitives support responsive sizing:

**Mobile (< 640px):**
- Button: Full width by default
- Card: Single column, 12px padding
- Table: Horizontal scroll, sticky first column
- Charts: Reduce height, stack legends

**Tablet (640-1024px):**
- Grid: 2 columns
- Card: 16px padding
- Charts: Standard height

**Desktop (> 1024px):**
- Grid: 3-4 columns
- Card: 20px padding
- Charts: Full height with legends

---

## Dark Mode Parity

Every primitive must look equally polished in dark mode:
- Swap background colors (light ↔ dark)
- Increase shadow opacity (0.06 → 0.20)
- Adjust accent colors for contrast (blue-500 → blue-300)
- Maintain WCAG AA contrast ratios

---

## Key Takeaways

1. **Consistent anatomy across primitives**
   All use same spacing scale, radius, typography

2. **States are first-class**
   Every primitive has hover, focus, disabled, loading states

3. **Variants solve 80% of use cases**
   Primary/secondary/ghost buttons, success/warning/error alerts

4. **Accessibility is non-negotiable**
   ARIA labels, keyboard nav, focus rings on all interactive elements

5. **Streaming-aware from day one**
   Skeleton → partial → complete lifecycle built into components

---

## Next Steps

- **Step 7:** Create wireframes showing GenUI pipeline end-to-end with these components

