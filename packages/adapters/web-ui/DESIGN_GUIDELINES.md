# Design Guidelines Reference

This project follows the **UI Skills** and **Vercel Web Interface Guidelines**.

## Quick Reference

### Stack (UI Skills)
- Vanilla CSS (no Tailwind required)
- `prefers-reduced-motion` for animation safety
- Accessible primitives (ARIA patterns)

### Interactions (Vercel)
- [ ] Keyboard works everywhere (WAI-ARIA patterns)
- [ ] `:focus-visible` over `:focus` for focus rings
- [ ] Hit targets ≥24px desktop, ≥44px mobile
- [ ] Input font-size ≥16px (prevents iOS zoom)
- [ ] Never disable browser zoom
- [ ] Never block paste
- [ ] `touch-action: manipulation` on buttons
- [ ] Confirm destructive actions

### Animations
- [ ] Honor `prefers-reduced-motion`
- [ ] Only animate `transform` and `opacity`
- [ ] Never `transition: all`
- [ ] Max 200ms for interaction feedback
- [ ] Animations interruptible by user input

### Typography (UI Skills)
- [ ] `text-wrap: balance` for headings
- [ ] `text-wrap: pretty` for body text  
- [ ] `font-variant-numeric: tabular-nums` for data

### Layout
- [ ] Use `100dvh` not `100vh`
- [ ] Fixed z-index scale
- [ ] `safe-area-inset` for fixed elements

### Forms (Vercel)
- [ ] Every control has a `<label>`
- [ ] Enter submits single-input forms
- [ ] Errors appear next to fields
- [ ] Set `autocomplete` attributes
- [ ] Keep submit enabled until submission starts

### Performance
- [ ] Never animate large `blur()` or `backdrop-filter`
- [ ] Only use `will-change` during active animation
- [ ] Avoid `useEffect` for render logic

### Cyber-Premium Aesthetic
- [ ] Use `Monospace` font for numerical data (Finance/Logs)
- [ ] Accent colors: Neon Cyan (`#00f3ff`) for active, Amber (`#ffb800`) for warning
- [ ] Dark backgrounds (`#0a0a0a`) with subtle border glows
- [ ] High-density data layouts (Process Tables, Log Streams)

### Component-Specific Standards

#### Finance & Markets
- [ ] Red (`#ff4d4d`) / Green (`#00cc88`) for price action
- [ ] Align decimals in order books
- [ ] Flash feedback on price updates

#### Logs & Systems
- [ ] Auto-scroll behavior for live streams
- [ ] Collapsible stack traces
- [ ] Monospace font for all raw data

## Applied In This Project

| File | Guidelines Applied |
|------|-------------------|
| `global.css` | focus-visible, dvh, prefers-reduced-motion, tabular-nums, text-wrap, touch-action |
| `rams.css` | Dieter Rams principles, z-index scale, 44px touch targets |
| `components/*.tsx` | aria-labels, keyboard handlers, role attributes |

## Audit Command

To check compliance, run:
```bash
# Search for violations
grep -r "transition: all" packages/adapters/web-ui/src/
grep -r "100vh" packages/adapters/web-ui/src/
grep -r ":focus[^-]" packages/adapters/web-ui/src/
```
