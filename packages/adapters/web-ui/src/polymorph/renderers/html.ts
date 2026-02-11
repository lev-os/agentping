/**
 * HTML Renderer — v2
 *
 * Renders polymorph primitives to standalone HTML with:
 * - CSS classes (not inline styles)
 * - Hover states, focus rings, transitions
 * - Interactive JS (buttons emit events, checkboxes toggle, inputs capture)
 * - Responsive grid layout
 * - CSS custom properties for theming
 */

import type { PolymorphPrimitive, RenderOptions, ThemeTokens } from '../types.js';
import { THEMES } from '../types.js';
import { SIZES, type Size } from '../sizes.js';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sizeOf(p: PolymorphPrimitive): Size {
  return (p.props.size as Size) ?? 'md';
}

function cls(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function renderPrimitive(p: PolymorphPrimitive, t: ThemeTokens): string {
  const sz = SIZES[sizeOf(p)];
  const id = p.id;

  switch (p.kind) {
    case 'status-dot': {
      const status = (p.props.status as string) ?? 'offline';
      return `<div class="ap-status" data-id="${id}">
        <span class="ap-status__dot ap-status__dot--${status}"></span>
        ${p.label ? `<span class="ap-status__label">${esc(p.label)}</span>` : ''}
      </div>`;
    }

    case 'badge': {
      const variant = (p.props.variant as string) ?? 'default';
      return `<span class="ap-badge ap-badge--${variant}" data-id="${id}">${esc(p.label ?? '')}</span>`;
    }

    case 'button': {
      const variant = (p.props.variant as string) ?? 'primary';
      const disabled = p.props.disabled ? 'disabled' : '';
      return `<button class="${cls('ap-btn', `ap-btn--${variant}`)}" data-id="${id}" data-action="click" ${disabled} onclick="AP.emit('${id}','click',{label:'${esc(p.label ?? '')}',variant:'${variant}'})">${esc(p.label ?? '')}</button>`;
    }

    case 'text-block': {
      const variant = (p.props.variant as string) ?? 'body';
      return `<div class="ap-text ap-text--${variant}" data-id="${id}">${esc((p.props.content as string) ?? '')}</div>`;
    }

    case 'input-field': {
      const label = p.props.label ? `<label class="ap-input__label">${esc(p.props.label as string)}</label>` : '';
      return `<div class="ap-input" data-id="${id}">
        ${label}
        <input class="ap-input__field" type="${p.props.type ?? 'text'}" placeholder="${esc((p.props.placeholder as string) ?? '')}" value="${esc((p.props.value as string) ?? '')}" data-action="change" oninput="AP.emit('${id}','change',{value:this.value})" />
      </div>`;
    }

    case 'progress-bar': {
      const val = Math.min(100, Math.max(0, (p.props.value as number) ?? 0));
      const max = (p.props.max as number) ?? 100;
      const pct = (val / max) * 100;
      const variant = (p.props.variant as string) ?? 'default';
      return `<div class="ap-progress" data-id="${id}">
        ${p.label ? `<div class="ap-progress__header"><span class="ap-progress__label">${esc(p.label)}</span><span class="ap-progress__value">${Math.round(pct)}%</span></div>` : ''}
        <div class="ap-progress__track"><div class="ap-progress__bar ap-progress__bar--${variant}" style="width:${pct}%"></div></div>
      </div>`;
    }

    case 'check-item': {
      const isChecked = Boolean(p.props.checked);
      const isDisabled = Boolean(p.props.disabled);
      const checked = isChecked ? 'checked' : '';
      const disabled = isDisabled ? 'disabled' : '';
      const checkedClass = isChecked ? 'ap-check--checked' : '';
      return `<label class="${cls('ap-check', checkedClass, isDisabled && 'ap-check--disabled')}" data-id="${id}">
        <input type="checkbox" class="ap-check__input" ${checked} ${disabled} data-action="change" onchange="AP.emit('${id}','toggle',{checked:this.checked});this.closest('.ap-check').classList.toggle('ap-check--checked',this.checked)" />
        <span class="ap-check__box"></span>
        <span class="ap-check__label">${esc(p.label ?? '')}</span>
      </label>`;
    }

    case 'metric-value': {
      const trend = (p.props.trend as string) ?? 'flat';
      return `<div class="ap-metric" data-id="${id}">
        <div class="ap-metric__label">${esc(p.label ?? '')}</div>
        <div class="ap-metric__row">
          <span class="ap-metric__value">${esc(String(p.props.value ?? ''))}</span>
          ${(p.props.unit as string) ? `<span class="ap-metric__unit">${esc((p.props.unit as string))}</span>` : ''}
          <span class="ap-metric__trend ap-metric__trend--${trend}"></span>
        </div>
      </div>`;
    }

    case 'list-item': {
      const active = p.props.active ? 'ap-list-item--active' : '';
      return `<div class="${cls('ap-list-item', active)}" data-id="${id}" data-action="click" onclick="AP.emit('${id}','select',{label:'${esc(p.label ?? '')}'})" role="button" tabindex="0">
        ${p.props.icon ? `<span class="ap-list-item__icon">${esc(p.props.icon as string)}</span>` : ''}
        <div class="ap-list-item__content">
          <div class="ap-list-item__text">${esc(p.label ?? '')}</div>
          ${p.props.secondary ? `<div class="ap-list-item__secondary">${esc(p.props.secondary as string)}</div>` : ''}
        </div>
      </div>`;
    }

    case 'card': {
      const childrenHtml = (p.children ?? []).map((c) => renderPrimitive(c, t)).join('\n');
      return `<div class="ap-card" data-id="${id}">
        ${p.props.title ? `<div class="ap-card__title">${esc(p.props.title as string)}</div>` : ''}
        ${p.props.subtitle ? `<div class="ap-card__subtitle">${esc(p.props.subtitle as string)}</div>` : ''}
        <div class="ap-card__body">${childrenHtml}</div>
      </div>`;
    }

    case 'nav-item': {
      const active = p.props.active ? 'ap-nav--active' : '';
      return `<div class="${cls('ap-nav', active)}" data-id="${id}" data-action="click" onclick="AP.emit('${id}','navigate',{label:'${esc(p.label ?? '')}'})" role="button" tabindex="0">
        ${p.props.icon ? `<span class="ap-nav__icon">${esc(p.props.icon as string)}</span>` : ''}
        <span class="ap-nav__label">${esc(p.label ?? '')}</span>
        ${p.props.badge ? `<span class="ap-nav__badge">${esc(p.props.badge as string)}</span>` : ''}
      </div>`;
    }

    case 'action-bar': {
      const childrenHtml = (p.children ?? []).map((c) => renderPrimitive(c, t)).join('\n');
      const align = (p.props.align as string) ?? 'right';
      return `<div class="ap-action-bar ap-action-bar--${align}" data-id="${id}">${childrenHtml}</div>`;
    }

    default:
      return `<div class="ap-unknown" data-id="${id}">Unknown: ${p.kind}</div>`;
  }
}

export function renderToHTML(
  primitives: PolymorphPrimitive[],
  options: RenderOptions,
): string {
  const theme = THEMES[options.theme] ?? THEMES['terminal-swiss'];
  const body = primitives.map((p) => renderPrimitive(p, theme)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(options.topic)} — AgentPing</title>
  <style>
    :root {
      --bg: ${theme.bg}; --surface: ${theme.surface}; --border: ${theme.border};
      --text: ${theme.text}; --muted: ${theme.muted}; --accent: ${theme.accent};
      --warning: ${theme.warning}; --error: ${theme.error}; --success: ${theme.success};
      --info: ${theme.info}; --font: ${theme.fontFamily};
      --radius: 8px; --radius-sm: 4px; --radius-lg: 12px;
      --transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; }

    /* ── Layout ── */
    .ap-shell { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .ap-header { padding: 20px 0; margin-bottom: 20px; border-bottom: 1px solid var(--border); display: flex; align-items: baseline; gap: 12px; }
    .ap-header__title { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
    .ap-header__meta { font-size: 12px; color: var(--muted); letter-spacing: 0.04em; text-transform: uppercase; }
    .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }

    /* ── Card ── */
    .ap-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; transition: border-color var(--transition), box-shadow var(--transition); }
    .ap-card:hover { border-color: color-mix(in srgb, var(--accent) 30%, var(--border)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent); }
    .ap-card__title { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
    .ap-card__subtitle { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
    .ap-card__body { display: flex; flex-direction: column; gap: 8px; }

    /* ── Status Dot ── */
    .ap-status { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
    .ap-status__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .ap-status__dot--online { background: var(--success); box-shadow: 0 0 6px var(--success); animation: pulse 2s ease-in-out infinite; }
    .ap-status__dot--busy { background: var(--error); box-shadow: 0 0 6px var(--error); }
    .ap-status__dot--away { background: var(--warning); }
    .ap-status__dot--offline { background: var(--muted); opacity: 0.5; }
    .ap-status__label { color: var(--text); }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    /* ── Badge ── */
    .ap-badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 500; border-radius: var(--radius-sm); letter-spacing: 0.02em; }
    .ap-badge--default { background: color-mix(in srgb, var(--muted) 15%, transparent); color: var(--muted); }
    .ap-badge--success { background: color-mix(in srgb, var(--success) 15%, transparent); color: var(--success); }
    .ap-badge--warning { background: color-mix(in srgb, var(--warning) 15%, transparent); color: var(--warning); }
    .ap-badge--error { background: color-mix(in srgb, var(--error) 15%, transparent); color: var(--error); }
    .ap-badge--info { background: color-mix(in srgb, var(--info) 15%, transparent); color: var(--info); }

    /* ── Button ── */
    .ap-btn { display: inline-flex; align-items: center; justify-content: center; padding: 6px 14px; font-size: 13px; font-family: var(--font); font-weight: 500; border-radius: var(--radius); border: 1px solid transparent; cursor: pointer; transition: all var(--transition); outline: none; white-space: nowrap; }
    .ap-btn:focus-visible { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
    .ap-btn:active { transform: scale(0.97); }
    .ap-btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
    .ap-btn--primary { background: var(--accent); color: var(--bg); }
    .ap-btn--primary:hover { filter: brightness(1.15); }
    .ap-btn--secondary { background: transparent; color: var(--text); border-color: var(--border); }
    .ap-btn--secondary:hover { background: color-mix(in srgb, var(--text) 8%, transparent); border-color: var(--text); }
    .ap-btn--ghost { background: transparent; color: var(--muted); }
    .ap-btn--ghost:hover { color: var(--text); background: color-mix(in srgb, var(--text) 6%, transparent); }
    .ap-btn--danger { background: var(--error); color: #fff; }
    .ap-btn--danger:hover { filter: brightness(1.15); }

    /* ── Text Block ── */
    .ap-text { line-height: 1.5; }
    .ap-text--heading { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
    .ap-text--body { font-size: 13px; color: var(--text); }
    .ap-text--caption { font-size: 12px; color: var(--muted); }
    .ap-text--code { font-size: 12px; color: var(--accent); font-family: "SF Mono", "Fira Code", "JetBrains Mono", monospace; background: color-mix(in srgb, var(--accent) 8%, var(--bg)); padding: 3px 6px; border-radius: var(--radius-sm); border: 1px solid color-mix(in srgb, var(--accent) 15%, transparent); }

    /* ── Input Field ── */
    .ap-input { display: flex; flex-direction: column; gap: 4px; }
    .ap-input__label { font-size: 12px; color: var(--muted); font-weight: 500; letter-spacing: 0.02em; }
    .ap-input__field { width: 100%; padding: 7px 10px; font-size: 13px; font-family: var(--font); border-radius: var(--radius); background: var(--bg); color: var(--text); border: 1px solid var(--border); outline: none; transition: border-color var(--transition), box-shadow var(--transition); }
    .ap-input__field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
    .ap-input__field::placeholder { color: var(--muted); opacity: 0.6; }

    /* ── Progress Bar ── */
    .ap-progress { display: flex; flex-direction: column; gap: 4px; }
    .ap-progress__header { display: flex; justify-content: space-between; align-items: center; }
    .ap-progress__label { font-size: 12px; color: var(--muted); }
    .ap-progress__value { font-size: 11px; color: var(--text); font-weight: 600; font-variant-numeric: tabular-nums; }
    .ap-progress__track { width: 100%; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
    .ap-progress__bar { height: 100%; border-radius: 3px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    .ap-progress__bar--default { background: var(--accent); }
    .ap-progress__bar--success { background: var(--success); }
    .ap-progress__bar--warning { background: var(--warning); }
    .ap-progress__bar--error { background: var(--error); }

    /* ── CheckItem ── */
    .ap-check { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; padding: 2px 0; transition: opacity var(--transition); }
    .ap-check:hover { opacity: 0.85; }
    .ap-check--disabled { opacity: 0.4; cursor: not-allowed; }
    .ap-check__input { position: absolute; opacity: 0; width: 0; height: 0; }
    .ap-check__box { width: 16px; height: 16px; border-radius: 3px; border: 1.5px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all var(--transition); }
    .ap-check__input:checked + .ap-check__box { background: var(--accent); border-color: var(--accent); }
    .ap-check__input:checked + .ap-check__box::after { content: ''; display: block; width: 4px; height: 8px; border: solid var(--bg); border-width: 0 2px 2px 0; transform: rotate(45deg) translateY(-1px); }
    .ap-check__input:focus-visible + .ap-check__box { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
    .ap-check__label { color: var(--text); transition: all var(--transition); }
    .ap-check--checked .ap-check__label { color: var(--muted); text-decoration: line-through; }

    /* ── Metric Value ── */
    .ap-metric { min-width: 0; }
    .ap-metric__label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
    .ap-metric__row { display: flex; align-items: baseline; gap: 4px; margin-top: 2px; }
    .ap-metric__value { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1; }
    .ap-metric__unit { font-size: 13px; color: var(--muted); }
    .ap-metric__trend { font-size: 10px; margin-left: 2px; }
    .ap-metric__trend--up::after { content: '\\25B2'; color: var(--success); }
    .ap-metric__trend--down::after { content: '\\25BC'; color: var(--error); }
    .ap-metric__trend--flat::after { content: '\\2014'; color: var(--muted); }

    /* ── ListItem ── */
    .ap-list-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: var(--radius); cursor: pointer; transition: all var(--transition); border-left: 2px solid transparent; }
    .ap-list-item:hover { background: color-mix(in srgb, var(--text) 5%, transparent); }
    .ap-list-item--active { border-left-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent); }
    .ap-list-item__icon { color: var(--muted); font-size: 14px; flex-shrink: 0; }
    .ap-list-item__content { min-width: 0; }
    .ap-list-item__text { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ap-list-item--active .ap-list-item__text { color: var(--accent); }
    .ap-list-item__secondary { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ── NavItem ── */
    .ap-nav { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: var(--radius); cursor: pointer; font-size: 13px; color: var(--muted); transition: all var(--transition); }
    .ap-nav:hover { background: color-mix(in srgb, var(--text) 6%, transparent); color: var(--text); }
    .ap-nav--active { color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); }
    .ap-nav__icon { font-size: 14px; }
    .ap-nav__label { flex: 1; }
    .ap-nav__badge { font-size: 10px; padding: 1px 6px; border-radius: 10px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); font-weight: 500; }

    /* ── ActionBar ── */
    .ap-action-bar { display: flex; gap: 8px; padding: 4px 0; flex-wrap: wrap; }
    .ap-action-bar--left { justify-content: flex-start; }
    .ap-action-bar--center { justify-content: center; }
    .ap-action-bar--right { justify-content: flex-end; }

    /* ── Event Log ── */
    .ap-log { position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg); border-top: 1px solid var(--border); max-height: 160px; overflow-y: auto; font-family: "SF Mono", "Fira Code", monospace; font-size: 11px; z-index: 100; transition: transform var(--transition); }
    .ap-log.ap-log--collapsed { transform: translateY(calc(100% - 28px)); }
    .ap-log__header { display: flex; align-items: center; justify-content: space-between; padding: 4px 12px; background: var(--surface); border-bottom: 1px solid var(--border); cursor: pointer; position: sticky; top: 0; }
    .ap-log__header span { font-weight: 600; color: var(--accent); }
    .ap-log__entries { padding: 4px 0; }
    .ap-log__entry { padding: 2px 12px; color: var(--muted); display: flex; gap: 8px; }
    .ap-log__entry:hover { background: color-mix(in srgb, var(--text) 3%, transparent); }
    .ap-log__time { color: var(--muted); opacity: 0.6; }
    .ap-log__id { color: var(--accent); }
    .ap-log__action { color: var(--success); }
    .ap-log__data { color: var(--text); }

    /* ── Responsive ── */
    @media (max-width: 680px) {
      .ap-grid { grid-template-columns: 1fr; }
      .ap-shell { padding: 12px; }
      .ap-metric__value { font-size: 22px; }
    }

    /* ── Entrance animation ── */
    .ap-card { animation: fadeUp 0.3s ease-out both; }
    .ap-card:nth-child(1) { animation-delay: 0ms; }
    .ap-card:nth-child(2) { animation-delay: 50ms; }
    .ap-card:nth-child(3) { animation-delay: 100ms; }
    .ap-card:nth-child(4) { animation-delay: 150ms; }
    .ap-card:nth-child(5) { animation-delay: 200ms; }
    .ap-card:nth-child(6) { animation-delay: 250ms; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <div class="ap-shell">
    <div class="ap-header">
      <div class="ap-header__title">${esc(options.topic)}</div>
      <div class="ap-header__meta">${esc(options.template)} &middot; ${esc(options.theme)}</div>
    </div>
    <div class="ap-grid">
      ${body}
    </div>
  </div>

  <div class="ap-log" id="eventLog">
    <div class="ap-log__header" onclick="document.getElementById('eventLog').classList.toggle('ap-log--collapsed')">
      <span>Events</span><span id="eventCount">0</span>
    </div>
    <div class="ap-log__entries" id="eventEntries"></div>
  </div>

  <script>
    const AP = {
      _log: [],
      emit(id, action, data) {
        const entry = { id, action, data, ts: Date.now() };
        this._log.push(entry);
        this._render(entry);
        // Flash the source element
        const el = document.querySelector('[data-id="' + id + '"]');
        if (el) { el.style.boxShadow = '0 0 0 2px var(--accent)'; setTimeout(() => el.style.boxShadow = '', 300); }
        console.log('[AgentPing]', action, id, data);
      },
      _render(entry) {
        const el = document.getElementById('eventEntries');
        const count = document.getElementById('eventCount');
        const time = new Date(entry.ts).toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        el.insertAdjacentHTML('afterbegin',
          '<div class="ap-log__entry"><span class="ap-log__time">' + time + '</span><span class="ap-log__id">' + entry.id + '</span><span class="ap-log__action">' + entry.action + '</span><span class="ap-log__data">' + JSON.stringify(entry.data) + '</span></div>'
        );
        count.textContent = this._log.length;
      }
    };
  </script>
</body>
</html>`;
}
