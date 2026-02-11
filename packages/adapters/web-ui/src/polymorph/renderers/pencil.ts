/**
 * Pencil (.pen) Renderer
 *
 * Renders polymorph primitives to batch_design operation strings.
 */

import type { PolymorphPrimitive, ThemeName } from '../types.js';
import { THEMES } from '../types.js';
import { SIZES, type Size } from '../sizes.js';

function sizeOf(p: PolymorphPrimitive): Size {
  return (p.props.size as Size) ?? 'md';
}

function variantColor(p: PolymorphPrimitive, theme: ThemeName): string {
  const t = THEMES[theme];
  const v = (p.props.variant as string) ?? 'default';
  const map: Record<string, string> = {
    default: t.muted, success: t.success, warning: t.warning,
    error: t.error, info: t.info, primary: t.accent,
    secondary: t.border, ghost: 'transparent', danger: t.error,
  };
  return map[v] ?? t.muted;
}

/**
 * Render a tree of polymorph primitives into .pen batch_design operations.
 *
 * @returns Array of operation strings ready for batch_design.
 */
export function renderToPencil(
  primitives: PolymorphPrimitive[],
  parentBinding: string,
  options: { theme: ThemeName },
): string[] {
  const ops: string[] = [];
  const t = THEMES[options.theme];

  for (const p of primitives) {
    const sz = SIZES[sizeOf(p)];
    const binding = p.id.replace(/-/g, '_');

    switch (p.kind) {
      case 'status-dot': {
        const statusColors: Record<string, string> = {
          online: t.success, offline: t.muted, busy: t.error, away: t.warning,
        };
        const color = statusColors[(p.props.status as string) ?? 'offline'] ?? t.muted;
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "${p.label ?? 'Status'}", "layout": "horizontal", "gap": 6, "height": ${sz.height}})`);
        ops.push(`${binding}_dot=I(${binding}, {"type": "ellipse", "width": ${sz.height / 3}, "height": ${sz.height / 3}, "fill": "${color}"})`);
        if (p.label) {
          ops.push(`${binding}_label=I(${binding}, {"type": "text", "content": "${p.label}", "fontSize": ${sz.fontSize}, "textColor": "${t.text}"})`);
        }
        break;
      }

      case 'badge': {
        const bg = variantColor(p, options.theme);
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Badge: ${p.label ?? ''}", "layout": "horizontal", "padding": [${sz.padding / 2}, ${sz.padding}], "cornerRadius": [${sz.radius}], "fill": "${bg}22"})`);
        ops.push(`${binding}_text=I(${binding}, {"type": "text", "content": "${p.label ?? ''}", "fontSize": ${sz.fontSize - 2}, "textColor": "${bg}", "fontWeight": "500"})`);
        break;
      }

      case 'button': {
        const bg = (p.props.variant === 'primary' || p.props.variant === 'danger') ? variantColor(p, options.theme) : 'transparent';
        const textColor = (p.props.variant === 'primary') ? t.bg : (p.props.variant === 'danger') ? '#ffffff' : t.text;
        const stroke = p.props.variant === 'secondary' ? `"strokeColor": "${t.border}", "strokeThickness": 1,` : '';
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Button: ${p.label ?? ''}", "layout": "horizontal", "padding": [${sz.padding}, ${sz.padding * 2}], "cornerRadius": [${sz.radius}], "fill": "${bg}", ${stroke} "height": ${sz.height}})`);
        ops.push(`${binding}_label=I(${binding}, {"type": "text", "content": "${p.label ?? ''}", "fontSize": ${sz.fontSize}, "textColor": "${textColor}"})`);
        break;
      }

      case 'text-block': {
        const isHeading = p.props.variant === 'heading';
        const fontSize = isHeading ? sz.fontSize + 8 : sz.fontSize;
        const weight = isHeading ? '"fontWeight": "700",' : '';
        const color = p.props.variant === 'caption' ? t.muted : p.props.variant === 'code' ? t.accent : t.text;
        ops.push(`${binding}=I(${parentBinding}, {"type": "text", "name": "Text", "content": "${(p.props.content as string ?? '').replace(/"/g, '\\"')}", "fontSize": ${fontSize}, ${weight} "textColor": "${color}"})`);
        break;
      }

      case 'input-field': {
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Input: ${p.props.label ?? ''}", "layout": "vertical", "gap": 4})`);
        if (p.props.label) {
          ops.push(`${binding}_label=I(${binding}, {"type": "text", "content": "${p.props.label}", "fontSize": ${sz.fontSize - 2}, "textColor": "${t.muted}"})`);
        }
        ops.push(`${binding}_input=I(${binding}, {"type": "frame", "layout": "horizontal", "padding": [${sz.padding}], "cornerRadius": [${sz.radius}], "fill": "${t.surface}", "strokeColor": "${t.border}", "strokeThickness": 1, "height": ${sz.height}, "width": "fill_container"})`);
        ops.push(`${binding}_placeholder=I(${binding}_input, {"type": "text", "content": "${(p.props.placeholder as string) ?? ''}", "fontSize": ${sz.fontSize}, "textColor": "${t.muted}"})`);
        break;
      }

      case 'progress-bar': {
        const pct = Math.min(100, Math.max(0, ((p.props.value as number) ?? 0) / ((p.props.max as number) ?? 100) * 100));
        const barColor = variantColor(p, options.theme) === t.muted ? t.accent : variantColor(p, options.theme);
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Progress: ${p.label ?? ''}", "layout": "vertical", "gap": 4})`);
        if (p.label) {
          ops.push(`${binding}_label=I(${binding}, {"type": "text", "content": "${p.label} (${Math.round(pct)}%)", "fontSize": ${sz.fontSize - 2}, "textColor": "${t.muted}"})`);
        }
        ops.push(`${binding}_track=I(${binding}, {"type": "frame", "layout": "horizontal", "width": "fill_container", "height": ${sz.height / 4}, "cornerRadius": [${sz.radius}], "fill": "${t.border}"})`);
        ops.push(`${binding}_bar=I(${binding}_track, {"type": "rectangle", "width": "${pct}%", "height": "fill_container", "cornerRadius": [${sz.radius}], "fill": "${barColor}"})`);
        break;
      }

      case 'check-item': {
        const checked = p.props.checked ? '[x]' : '[ ]';
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Check: ${p.label ?? ''}", "layout": "horizontal", "gap": 8, "height": ${sz.height}})`);
        ops.push(`${binding}_check=I(${binding}, {"type": "text", "content": "${checked}", "fontSize": ${sz.fontSize}, "textColor": "${t.accent}"})`);
        ops.push(`${binding}_text=I(${binding}, {"type": "text", "content": "${p.label ?? ''}", "fontSize": ${sz.fontSize}, "textColor": "${p.props.disabled ? t.muted : t.text}"})`);
        break;
      }

      case 'metric-value': {
        const trendIcon: Record<string, string> = { up: '▲', down: '▼', flat: '—' };
        const trendColor: Record<string, string> = { up: t.success, down: t.error, flat: t.muted };
        const trend = (p.props.trend as string) ?? 'flat';
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Metric: ${p.label ?? ''}", "layout": "vertical", "gap": 4})`);
        ops.push(`${binding}_label=I(${binding}, {"type": "text", "content": "${p.label ?? ''}", "fontSize": ${sz.fontSize - 2}, "textColor": "${t.muted}"})`);
        ops.push(`${binding}_value=I(${binding}, {"type": "text", "content": "${String(p.props.value ?? '')}${(p.props.unit as string) ?? ''}", "fontSize": ${sz.fontSize + 12}, "fontWeight": "700", "textColor": "${t.text}"})`);
        ops.push(`${binding}_trend=I(${binding}, {"type": "text", "content": "${trendIcon[trend] ?? ''}", "fontSize": ${sz.fontSize - 2}, "textColor": "${trendColor[trend] ?? t.muted}"})`);
        break;
      }

      case 'list-item': {
        const activeBg = p.props.active ? t.accent + '11' : 'transparent';
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "ListItem: ${p.label ?? ''}", "layout": "horizontal", "gap": 8, "padding": [${sz.padding}, ${sz.padding * 2}], "fill": "${activeBg}"})`);
        if (p.props.icon) {
          ops.push(`${binding}_icon=I(${binding}, {"type": "text", "content": "${p.props.icon}", "fontSize": ${sz.fontSize}, "textColor": "${t.muted}"})`);
        }
        ops.push(`${binding}_text=I(${binding}, {"type": "text", "content": "${p.label ?? ''}", "fontSize": ${sz.fontSize}, "textColor": "${p.props.active ? t.accent : t.text}"})`);
        break;
      }

      case 'card': {
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Card: ${p.props.title ?? ''}", "layout": "vertical", "gap": ${sz.gap}, "padding": [${sz.padding * 2}], "cornerRadius": [${sz.radius * 2}], "fill": "${t.surface}", "strokeColor": "${t.border}", "strokeThickness": 1})`);
        if (p.props.title) {
          ops.push(`${binding}_title=I(${binding}, {"type": "text", "content": "${p.props.title}", "fontSize": ${sz.fontSize + 2}, "fontWeight": "600", "textColor": "${t.text}"})`);
        }
        if (p.props.subtitle) {
          ops.push(`${binding}_subtitle=I(${binding}, {"type": "text", "content": "${p.props.subtitle}", "fontSize": ${sz.fontSize - 1}, "textColor": "${t.muted}"})`);
        }
        if (p.children?.length) {
          ops.push(...renderToPencil(p.children, binding, options));
        }
        break;
      }

      case 'nav-item': {
        const activeBg = p.props.active ? t.accent + '11' : 'transparent';
        const textColor = p.props.active ? t.accent : t.muted;
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "Nav: ${p.label ?? ''}", "layout": "horizontal", "gap": 8, "padding": [${sz.padding}, ${sz.padding * 2}], "cornerRadius": [${sz.radius}], "fill": "${activeBg}"})`);
        ops.push(`${binding}_text=I(${binding}, {"type": "text", "content": "${p.label ?? ''}", "fontSize": ${sz.fontSize}, "textColor": "${textColor}"})`);
        break;
      }

      case 'action-bar': {
        ops.push(`${binding}=I(${parentBinding}, {"type": "frame", "name": "ActionBar", "layout": "horizontal", "gap": ${sz.gap}, "padding": [${sz.padding}, 0]})`);
        if (p.children?.length) {
          ops.push(...renderToPencil(p.children, binding, options));
        }
        break;
      }
    }
  }

  return ops;
}
