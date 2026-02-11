# Superdesign GenUI Prompts - Usage Examples

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

This guide shows how to apply the extracted Superdesign prompts to build a generative UI component system.

---

## Quick Start: Building an AgentPing Dashboard Theme

### Step 1: Choose Your Theme Combination

Based on the recommended combination for AgentPing:

```javascript
const theme = {
  style: "linear-inspired-developer-tool-dashboard",
  layout: "modular-card-dashboard",
  components: "glassmorphism-hr-dashboard",
  special: "mosaic-grid-architecture-style"
};
```

### Step 2: Extract Style Variables

From the **Mosaic Grid Architecture Style** prompt:

```css
/* Color Palette */
:root {
  --color-bg: #F7F7F5;           /* Paper cream */
  --color-primary: #1A3C2B;       /* Forest green */
  --color-accent-coral: #FF8C69;  /* Coral */
  --color-accent-mint: #9EFFBF;   /* Mint */
  --color-accent-gold: #F4D35E;   /* Gold */
  --color-border: rgba(58, 58, 56, 0.2);

  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'General Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --border-radius: 2px;
  --border-width: 1px;
}
```

### Step 3: Build Core Components

#### Card Component (from Glassmorphism prompt)

```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'minimal';
}

const Card = ({ children, variant = 'glass' }: CardProps) => {
  const baseStyles = {
    borderRadius: 'var(--border-radius)',
    border: 'var(--border-width) solid var(--color-border)',
    padding: '24px',
  };

  const variants = {
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    solid: {
      background: '#FFFFFF',
    },
    minimal: {
      background: 'transparent',
      border: 'var(--border-width) solid var(--color-border)',
    }
  };

  return (
    <div style={{ ...baseStyles, ...variants[variant] }}>
      {children}
    </div>
  );
};
```

#### Mosaic Grid Layout (from Mosaic Grid prompt)

```tsx
const MosaicGrid = ({ items }: { items: GridItem[] }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '16px',
      padding: '24px',
    }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            gridColumn: `span ${item.span || 4}`,
            gridRow: `span ${item.rowSpan || 1}`,
          }}
        >
          <Card variant="glass">
            {item.content}
          </Card>
        </div>
      ))}
    </div>
  );
};
```

### Step 4: Typography System

```tsx
const Typography = {
  H1: ({ children }) => (
    <h1 style={{
      fontFamily: 'var(--font-heading)',
      fontSize: '96px',
      lineHeight: '0.9',
      letterSpacing: '-0.02em',
      fontWeight: 700,
    }}>
      {children}
    </h1>
  ),

  Body: ({ children }) => (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      lineHeight: '1.6',
      color: 'var(--color-primary)',
    }}>
      {children}
    </p>
  ),

  Label: ({ children }) => (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'var(--color-primary)',
      opacity: 0.7,
    }}>
      {children}
    </span>
  ),
};
```

---

## Example: Analytics Dashboard (from Analytics Dashboard prompt)

### Theme Configuration

```javascript
const analyticsTheme = {
  colors: {
    primary: '#3B82F6',
    background: '#FAFAFA',
    cardBg: '#FFFFFF',
    border: '#E5E7EB',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    }
  },
  fonts: {
    ui: 'Inter',
    mono: 'JetBrains Mono',
  },
  spacing: {
    card: '20px',
    gap: '16px',
  }
};
```

### Metric Card Component

```tsx
const MetricCard = ({ label, value, trend, unit }) => (
  <Card variant="solid">
    <Typography.Label>{label}</Typography.Label>
    <div style={{
      fontSize: '32px',
      fontFamily: analyticsTheme.fonts.ui,
      fontWeight: 600,
      marginTop: '8px',
      color: analyticsTheme.colors.text.primary,
    }}>
      {value}
      <span style={{
        fontSize: '16px',
        fontFamily: analyticsTheme.fonts.mono,
        marginLeft: '4px',
        opacity: 0.6,
      }}>
        {unit}
      </span>
    </div>
    <div style={{
      marginTop: '8px',
      fontSize: '14px',
      color: trend > 0 ? '#10B981' : '#EF4444',
    }}>
      {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
    </div>
  </Card>
);
```

---

## Example: Bento Grid Layout (from Bento Configuration prompt)

```tsx
const BentoLayout = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gridTemplateRows: 'repeat(4, 200px)',
      gap: '16px',
      padding: '24px',
    }}>
      {/* Large feature card */}
      <Card style={{ gridColumn: 'span 4', gridRow: 'span 2' }}>
        <h2>Main Feature</h2>
      </Card>

      {/* Sidebar metric cards */}
      <Card style={{ gridColumn: 'span 2', gridRow: 'span 1' }}>
        <MetricCard label="Active Users" value="1,234" trend={12} />
      </Card>
      <Card style={{ gridColumn: 'span 2', gridRow: 'span 1' }}>
        <MetricCard label="Revenue" value="$5.6K" trend={-3} />
      </Card>

      {/* Chart area */}
      <Card style={{ gridColumn: 'span 4', gridRow: 'span 2' }}>
        <ChartComponent />
      </Card>

      {/* Activity feed */}
      <Card style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
        <ActivityFeed />
      </Card>
    </div>
  );
};
```

---

## GenUI Prompt Templates

### Template: Dynamic Theme Generation

When using a GenUI system, you can pass these as system prompts:

```
STYLE_CONTEXT: ${mosaic_grid_style_prompt}

USER: Generate a dashboard card showing agent status with the following data:
- Agent name: "AgentPing Worker #1"
- Status: "Active"
- Uptime: "24h 15m"
- Tasks completed: 142

Apply the Mosaic Grid Architecture Style with glassmorphic card treatment.
```

### Template: Component Variant Generation

```
LAYOUT_CONTEXT: ${modular_card_layout_prompt}
COMPONENT_CONTEXT: ${glassmorphism_component_prompt}

USER: Create a metric card component with:
- Label on top (small, mono font)
- Large metric value (primary font)
- Trend indicator (colored, with arrow)
- Glassmorphic background

Use the established color palette and typography system.
```

---

## Integration with GenUI Runtime

### Example: Thesys GenUI Integration

```typescript
// thesys-genui.config.ts
import { ThesysConfig } from '@thesys/genui';

export const config: ThesysConfig = {
  themes: {
    agentping: {
      stylePrompt: MOSAIC_GRID_STYLE_PROMPT,
      layoutPrompts: {
        dashboard: MODULAR_CARD_LAYOUT_PROMPT,
        detail: SUMMARY_TO_DETAIL_LAYOUT_PROMPT,
      },
      componentPrompts: {
        card: GLASSMORPHISM_CARD_PROMPT,
        metric: ANALYTICS_METRIC_PROMPT,
        nav: LINEAR_NAV_PROMPT,
      },
    },
  },

  variants: {
    light: {
      background: '#F7F7F5',
      primary: '#1A3C2B',
    },
    dark: {
      background: '#1A1A1A',
      primary: '#9EFFBF',
    },
  },
};
```

### Runtime Generation

```typescript
import { generateComponent } from '@thesys/genui';

const MetricCard = await generateComponent({
  theme: 'agentping',
  type: 'card',
  variant: 'metric',
  data: {
    label: 'Active Agents',
    value: 42,
    trend: 12,
  },
});

// Returns React component with:
// - Correct typography (JetBrains Mono label)
// - Correct colors (forest green primary)
// - Glassmorphic treatment
// - Proper spacing and borders
```

---

## Color Palette Quick Reference

### Mosaic Grid Palette
```css
--forest:  #1A3C2B
--cream:   #F7F7F5
--coral:   #FF8C69
--mint:    #9EFFBF
--gold:    #F4D35E
--border:  rgba(58, 58, 56, 0.2)
```

### Analytics Palette
```css
--blue:    #3B82F6
--bg:      #FAFAFA
--card:    #FFFFFF
--border:  #E5E7EB
--text:    #111827
--text-2:  #6B7280
```

### Glassmorphism Effects
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(10px);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
border: 1px solid rgba(255, 255, 255, 0.18);
```

---

## Typography Quick Reference

### Mosaic Grid Typography
```
Headings:  Space Grotesk (64-96px, line-height 0.9, tight tracking)
Body:      General Sans (16px, line-height 1.6)
Labels:    JetBrains Mono (10-12px, uppercase, 0.1em tracking)
```

### Analytics Typography
```
UI:        Inter (all weights)
Data/Logs: JetBrains Mono (for technical content)
```

---

## Responsive Breakpoints

Based on layout prompts, use these breakpoints:

```css
/* Mobile first */
@media (min-width: 640px) {  /* sm */
  --grid-columns: 4;
}

@media (min-width: 768px) {  /* md */
  --grid-columns: 8;
}

@media (min-width: 1024px) { /* lg */
  --grid-columns: 12;
}

@media (min-width: 1280px) { /* xl */
  --grid-columns: 16;
}
```

---

## Animation & Interaction Patterns

### From Glassmorphism Prompt

```css
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}
```

### From Mosaic Grid Prompt

```css
.image {
  filter: grayscale(1);
  opacity: 0.9;
  transition: all 0.4s ease;
}

.image:hover {
  filter: grayscale(0);
  opacity: 1;
}
```

---

## Best Practices

1. **Start with Style Prompt**: Define your color palette and typography first
2. **Layer Layout Patterns**: Apply layout prompts to create composition templates
3. **Build Component Library**: Use component prompts to generate primitives
4. **Mix and Match**: Combine elements from different prompts
5. **Customize Colors**: Swap in brand colors while maintaining design language
6. **Test Responsively**: Most prompts include mobile considerations
7. **Add Micro-interactions**: Use animation patterns from prompts
8. **Document Variants**: Create a variant system for different use cases

---

## Troubleshooting

**Q: Colors look washed out**
A: Check opacity values on glassmorphic components, reduce backdrop blur

**Q: Typography too large on mobile**
A: Use fluid typography with clamp() or responsive font sizes

**Q: Grid layout breaks on mobile**
A: Switch to single-column layout below 768px breakpoint

**Q: Components feel too heavy**
A: Reduce border-radius, remove shadows, use minimal variant

---

## Next Steps

1. Choose your theme combination
2. Extract color and typography variables
3. Build base component library
4. Create layout templates
5. Test with real data
6. Document your design system
7. Integrate with GenUI runtime

---

**Files to Reference**:
- `superdesign-genui-prompts.md` - Full prompt text
- `superdesign-genui-index.json` - Quick lookup
- `EXTRACTION-SUMMARY.md` - Overview and recommendations

