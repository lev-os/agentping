---
name: agentping-playground
description: Generate interactive playgrounds for AgentPing components
version: 0.1.0
---

# AgentPing Playground

Interactive component playgrounds for agent-human interaction surfaces.

## Quick Start

### CLI
```bash
agentping playground create --template design --topic "My Components"
agentping playground create --template data --mode react --theme skynet
agentping playground list
```

### MCP Tool
Use the `generate_playground` tool with:
- `template`: design | data | concept | critique
- `topic`: Subject of the playground
- `mode`: html | pencil | react
- `theme`: terminal-swiss | skynet | system

## Templates

| Template | Description |
|----------|-------------|
| **design** | Visual style explorer -- showcases all 12 polymorph primitives |
| **data** | Query builder -- data exploration with metrics, filters, and results |
| **concept** | Relationship mapper -- explore concepts, dependencies, and connections |
| **critique** | Document reviewer -- annotate, critique, and provide structured feedback |

## Primitives

12 universal polymorph components that render to HTML, Pencil (.pen), or React:

- **StatusDot** -- Online/offline/busy/away indicator
- **Badge** -- Labeled status tag with variants
- **Button** -- Action trigger with primary/secondary/ghost/danger variants
- **TextBlock** -- Heading, body, caption, or code text
- **InputField** -- Text input with label and placeholder
- **ProgressBar** -- Value bar with variant colors
- **CheckItem** -- Checkbox with label
- **MetricValue** -- Numeric display with label, unit, and trend
- **ListItem** -- Row with text, secondary info, and optional icon
- **Card** -- Container with title, subtitle, and children
- **NavItem** -- Navigation link with icon and badge
- **ActionBar** -- Row of action buttons

## Themes

- **terminal-swiss** -- Dark monospace terminal aesthetic
- **skynet** -- GitHub-dark inspired with blue accents
- **system** -- Light system-native theme

## Render Modes

- **html** -- Standalone HTML file with inline styles
- **pencil** -- .pen batch_design operations for Pencil editor
- **react** -- React catalog entries for CanvasRenderer
