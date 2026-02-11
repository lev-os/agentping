/**
 * HTML Renderer
 *
 * Renders polymorph primitives to standalone HTML strings.
 */
import { getThemeTokens } from '../types.js';
import { SIZES } from '../sizes.js';
function escape(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function sizeOf(p) {
    return p.props.size ?? 'md';
}
function renderPrimitive(p, t) {
    const sz = SIZES[sizeOf(p)];
    switch (p.kind) {
        case 'status-dot': {
            const colors = {
                online: t.success, offline: t.muted, busy: t.error, away: t.warning,
            };
            const color = colors[p.props.status ?? 'offline'] ?? t.muted;
            return `<span style="display:inline-flex;align-items:center;gap:6px;font-size:${sz.fontSize}px;color:${t.text};font-family:${t.fontFamily}">
        <span style="width:${sz.height / 3}px;height:${sz.height / 3}px;border-radius:50%;background:${color};display:inline-block"></span>
        ${p.label ? escape(p.label) : ''}
      </span>`;
        }
        case 'badge': {
            const variantColors = {
                default: t.muted, success: t.success, warning: t.warning, error: t.error, info: t.info,
            };
            const bg = variantColors[p.props.variant ?? 'default'] ?? t.muted;
            return `<span style="display:inline-block;padding:${sz.padding / 2}px ${sz.padding}px;font-size:${sz.fontSize - 2}px;border-radius:${sz.radius}px;background:${bg}22;color:${bg};font-family:${t.fontFamily};font-weight:500">${escape(p.label ?? '')}</span>`;
        }
        case 'button': {
            const variants = {
                primary: { bg: t.accent, color: t.bg, border: 'transparent' },
                secondary: { bg: 'transparent', color: t.text, border: t.border },
                ghost: { bg: 'transparent', color: t.muted, border: 'transparent' },
                danger: { bg: t.error, color: '#fff', border: 'transparent' },
            };
            const v = variants[p.props.variant ?? 'primary'] ?? variants.primary;
            const opacity = p.props.disabled ? '0.5' : '1';
            return `<button style="padding:${sz.padding}px ${sz.padding * 2}px;font-size:${sz.fontSize}px;border-radius:${sz.radius}px;background:${v.bg};color:${v.color};border:1px solid ${v.border};cursor:pointer;font-family:${t.fontFamily};opacity:${opacity};height:${sz.height}px">${escape(p.label ?? '')}</button>`;
        }
        case 'text-block': {
            const variants = {
                heading: `font-size:${sz.fontSize + 8}px;font-weight:700;color:${t.text}`,
                body: `font-size:${sz.fontSize}px;color:${t.text}`,
                caption: `font-size:${sz.fontSize - 2}px;color:${t.muted}`,
                code: `font-size:${sz.fontSize - 1}px;color:${t.accent};font-family:"SF Mono","Fira Code",monospace;background:${t.surface};padding:${sz.padding / 2}px ${sz.padding}px;border-radius:${sz.radius}px`,
            };
            const style = variants[p.props.variant ?? 'body'] ?? variants.body;
            return `<div style="${style};font-family:${t.fontFamily}">${escape(p.props.content ?? '')}</div>`;
        }
        case 'input-field': {
            const label = p.props.label ? `<label style="display:block;font-size:${sz.fontSize - 2}px;color:${t.muted};margin-bottom:4px;font-family:${t.fontFamily}">${escape(p.props.label)}</label>` : '';
            return `<div>${label}<input type="${p.props.type ?? 'text'}" placeholder="${escape(p.props.placeholder ?? '')}" value="${escape(p.props.value ?? '')}" style="width:100%;padding:${sz.padding}px;font-size:${sz.fontSize}px;border-radius:${sz.radius}px;background:${t.surface};color:${t.text};border:1px solid ${t.border};font-family:${t.fontFamily};height:${sz.height}px;box-sizing:border-box" /></div>`;
        }
        case 'progress-bar': {
            const val = Math.min(100, Math.max(0, p.props.value ?? 0));
            const max = p.props.max ?? 100;
            const pct = (val / max) * 100;
            const barColors = {
                default: t.accent, success: t.success, warning: t.warning, error: t.error,
            };
            const barColor = barColors[p.props.variant ?? 'default'] ?? t.accent;
            const label = p.label ? `<div style="font-size:${sz.fontSize - 2}px;color:${t.muted};margin-bottom:4px;font-family:${t.fontFamily}">${escape(p.label)} (${Math.round(pct)}%)</div>` : '';
            return `<div>${label}<div style="width:100%;height:${sz.height / 4}px;background:${t.border};border-radius:${sz.radius}px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${barColor};border-radius:${sz.radius}px;transition:width 0.3s"></div></div></div>`;
        }
        case 'check-item': {
            const checked = p.props.checked ? 'checked' : '';
            const disabled = p.props.disabled ? 'disabled' : '';
            return `<label style="display:flex;align-items:center;gap:8px;font-size:${sz.fontSize}px;color:${p.props.disabled ? t.muted : t.text};cursor:${p.props.disabled ? 'not-allowed' : 'pointer'};font-family:${t.fontFamily}">
        <input type="checkbox" ${checked} ${disabled} style="accent-color:${t.accent}" />
        <span${p.props.checked ? ` style="text-decoration:line-through;opacity:0.6"` : ''}>${escape(p.label ?? '')}</span>
      </label>`;
        }
        case 'metric-value': {
            const trendIcon = { up: '&#9650;', down: '&#9660;', flat: '&#9644;' };
            const trendColor = { up: t.success, down: t.error, flat: t.muted };
            const trend = p.props.trend ?? 'flat';
            return `<div style="font-family:${t.fontFamily}">
        <div style="font-size:${sz.fontSize - 2}px;color:${t.muted};text-transform:uppercase;letter-spacing:0.05em">${escape(p.label ?? '')}</div>
        <div style="font-size:${sz.fontSize + 12}px;font-weight:700;color:${t.text};margin:4px 0">${escape(String(p.props.value ?? ''))}<span style="font-size:${sz.fontSize}px;color:${t.muted};margin-left:4px">${escape(p.props.unit ?? '')}</span></div>
        <span style="color:${trendColor[trend]};font-size:${sz.fontSize - 2}px">${trendIcon[trend] ?? ''}</span>
      </div>`;
        }
        case 'list-item': {
            const active = p.props.active ? `background:${t.accent}11;border-left:2px solid ${t.accent}` : `border-left:2px solid transparent`;
            return `<div style="display:flex;align-items:center;gap:8px;padding:${sz.padding}px ${sz.padding * 2}px;${active};font-family:${t.fontFamily}">
        ${p.props.icon ? `<span style="color:${t.muted}">${escape(p.props.icon)}</span>` : ''}
        <div>
          <div style="font-size:${sz.fontSize}px;color:${p.props.active ? t.accent : t.text}">${escape(p.label ?? '')}</div>
          ${p.props.secondary ? `<div style="font-size:${sz.fontSize - 2}px;color:${t.muted}">${escape(p.props.secondary)}</div>` : ''}
        </div>
      </div>`;
        }
        case 'card': {
            const childrenHtml = (p.children ?? []).map((c) => renderPrimitive(c, t)).join('\n');
            return `<div style="background:${t.surface};border:1px solid ${t.border};border-radius:${sz.radius * 2}px;padding:${sz.padding * 2}px;font-family:${t.fontFamily}">
        ${p.props.title ? `<div style="font-size:${sz.fontSize + 2}px;font-weight:600;color:${t.text};margin-bottom:4px">${escape(p.props.title)}</div>` : ''}
        ${p.props.subtitle ? `<div style="font-size:${sz.fontSize - 1}px;color:${t.muted};margin-bottom:${sz.gap}px">${escape(p.props.subtitle)}</div>` : ''}
        <div style="display:flex;flex-direction:column;gap:${sz.gap}px">${childrenHtml}</div>
      </div>`;
        }
        case 'nav-item': {
            const active = p.props.active ? `color:${t.accent};background:${t.accent}11` : `color:${t.muted}`;
            return `<div style="display:flex;align-items:center;gap:8px;padding:${sz.padding}px ${sz.padding * 2}px;border-radius:${sz.radius}px;${active};cursor:pointer;font-family:${t.fontFamily};font-size:${sz.fontSize}px">
        ${p.props.icon ? `<span>${escape(p.props.icon)}</span>` : ''}
        <span>${escape(p.label ?? '')}</span>
        ${p.props.badge ? `<span style="margin-left:auto;font-size:${sz.fontSize - 3}px;background:${t.accent}22;color:${t.accent};padding:2px 6px;border-radius:${sz.radius}px">${escape(p.props.badge)}</span>` : ''}
      </div>`;
        }
        case 'action-bar': {
            const childrenHtml = (p.children ?? []).map((c) => renderPrimitive(c, t)).join('\n');
            const align = p.props.align ?? 'right';
            const justify = { left: 'flex-start', center: 'center', right: 'flex-end' };
            return `<div style="display:flex;gap:${sz.gap}px;justify-content:${justify[align] ?? 'flex-end'};padding:${sz.padding}px 0">${childrenHtml}</div>`;
        }
        default:
            return `<div style="color:${t.error};font-family:${t.fontFamily}">Unknown: ${p.kind}</div>`;
    }
}
export function renderToHTML(primitives, options) {
    const theme = getThemeTokens(options.theme, options.themeMode);
    const body = primitives.map((p) => renderPrimitive(p, theme)).join('\n');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escape(options.topic)} — AgentPing Playground</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: ${theme.bg};
      color: ${theme.text};
      font-family: ${theme.fontFamily};
      padding: 32px;
      min-height: 100vh;
    }
    .playground-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid ${theme.border};
    }
    .playground-header h1 { font-size: 24px; font-weight: 700; }
    .playground-header p { font-size: 14px; color: ${theme.muted}; margin-top: 4px; }
    .playground-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }
  </style>
</head>
<body>
  <div class="playground-header">
    <h1>${escape(options.topic)}</h1>
    <p>Template: ${escape(options.template)} &middot; Theme: ${escape(options.theme)} &middot; Mode: ${escape(options.themeMode)}</p>
  </div>
  <div class="playground-grid">
    ${body}
  </div>
</body>
</html>`;
}
