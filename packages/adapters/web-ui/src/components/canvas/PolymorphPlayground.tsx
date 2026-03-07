/**
 * Polymorph Playground — React + json-render compare view
 *
 * Shows the current hand-written polymorph renderer beside a catalog-driven
 * json-render projection built from the same primitive tree.
 */

import {
  ActionProvider,
  Renderer as JSONRenderer,
  StateProvider,
  VisibilityProvider,
} from "@json-render/react";
import { useCallback, useState, type CSSProperties } from "react";

import {
  agentpingJsonRenderRegistry,
  buildJsonRenderSpec,
} from "../../catalog";
import {
  templates,
  THEMES,
  resetIds,
  type PolymorphPrimitive,
  type ThemeName,
  type ThemeTokens,
} from "../../polymorph/index.js";

type ActionEvent = { id: string; action: string; data: unknown; ts: number };

function useEventLog() {
  const [events, setEvents] = useState<ActionEvent[]>([]);

  const emit = useCallback((id: string, action: string, data: unknown) => {
    const entry = { id, action, data, ts: Date.now() };
    setEvents((prev) => [entry, ...prev].slice(0, 50));
    console.log("[AgentPing]", action, id, data);
  }, []);

  return { events, emit };
}

type PrimProps = {
  p: PolymorphPrimitive;
  t: ThemeTokens;
  emit: (id: string, action: string, data: unknown) => void;
};

function StatusDotView({ p, t }: PrimProps) {
  const status = (p.props.status as string) ?? "offline";
  const colors: Record<string, string> = {
    online: t.success,
    offline: t.muted,
    busy: t.error,
    away: t.warning,
  };

  return (
    <div
      className="ap-status"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors[status] ?? t.muted,
          boxShadow: status === "online" ? `0 0 6px ${t.success}` : undefined,
          animation:
            status === "online" ? "pulse 2s ease-in-out infinite" : undefined,
        }}
      />
      {p.label ? <span style={{ color: t.text }}>{p.label}</span> : null}
    </div>
  );
}

function BadgeView({ p, t }: PrimProps) {
  const variant = (p.props.variant as string) ?? "default";
  const colors: Record<string, string> = {
    default: t.muted,
    success: t.success,
    warning: t.warning,
    error: t.error,
    info: t.info,
  };
  const color = colors[variant] ?? t.muted;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 4,
        background: `${color}22`,
        color,
      }}
    >
      {p.label}
    </span>
  );
}

function ButtonView({ p, t, emit }: PrimProps) {
  const variant = (p.props.variant as string) ?? "primary";
  const base: CSSProperties = {
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 8,
    border: "1px solid transparent",
    cursor: p.props.disabled ? "not-allowed" : "pointer",
    opacity: p.props.disabled ? 0.4 : 1,
    transition: "all 150ms",
    outline: "none",
    fontFamily: "inherit",
  };
  const variants: Record<string, CSSProperties> = {
    primary: { background: t.accent, color: t.bg },
    secondary: {
      background: "transparent",
      color: t.text,
      borderColor: t.border,
    },
    ghost: { background: "transparent", color: t.muted },
    danger: { background: t.error, color: "#fff" },
  };

  return (
    <button
      type="button"
      style={{ ...base, ...variants[variant] }}
      disabled={!!p.props.disabled}
      onClick={() =>
        emit(p.id, "primitive:press", {
          kind: p.kind,
          label: p.label,
          variant,
        })
      }
      onMouseEnter={(event) => {
        event.currentTarget.style.filter = "brightness(1.15)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.filter = "";
      }}
    >
      {p.label}
    </button>
  );
}

function TextBlockView({ p, t }: PrimProps) {
  const variant = (p.props.variant as string) ?? "body";
  const styles: Record<string, CSSProperties> = {
    heading: {
      fontSize: 18,
      fontWeight: 600,
      color: t.text,
      letterSpacing: "-0.01em",
    },
    body: { fontSize: 13, color: t.text, lineHeight: 1.5 },
    caption: { fontSize: 12, color: t.muted },
    code: {
      fontSize: 12,
      color: t.accent,
      fontFamily: '"SF Mono", "Fira Code", monospace',
      background: `${t.accent}14`,
      padding: "3px 6px",
      borderRadius: 4,
      border: `1px solid ${t.accent}26`,
    },
  };

  return (
    <div style={styles[variant] ?? styles.body}>
      {(p.props.content as string) ?? ""}
    </div>
  );
}

function InputFieldView({ p, t, emit }: PrimProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Boolean(p.props.label) ? (
        <label style={{ fontSize: 12, color: t.muted, fontWeight: 500 }}>
          {p.props.label as string}
        </label>
      ) : null}
      <input
        type={(p.props.type as string) ?? "text"}
        placeholder={(p.props.placeholder as string) ?? ""}
        defaultValue={(p.props.value as string) ?? ""}
        onBlur={(event) =>
          emit(p.id, "primitive:change", {
            kind: p.kind,
            value: event.currentTarget.value,
          })
        }
        style={{
          width: "100%",
          padding: "7px 10px",
          fontSize: 13,
          borderRadius: 8,
          background: t.bg,
          color: t.text,
          border: `1px solid ${t.border}`,
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color 150ms, box-shadow 150ms",
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = t.accent;
          event.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}33`;
        }}
        onBlurCapture={(event) => {
          event.currentTarget.style.borderColor = t.border;
          event.currentTarget.style.boxShadow = "";
        }}
      />
    </div>
  );
}

function ProgressBarView({ p, t }: PrimProps) {
  const value = Math.min(100, Math.max(0, (p.props.value as number) ?? 0));
  const max = (p.props.max as number) ?? 100;
  const pct = (value / max) * 100;
  const variant = (p.props.variant as string) ?? "default";
  const colors: Record<string, string> = {
    default: t.accent,
    success: t.success,
    warning: t.warning,
    error: t.error,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {p.label ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: t.muted }}>{p.label}</span>
          <span
            style={{
              color: t.text,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {Math.round(pct)}%
          </span>
        </div>
      ) : null}
      <div
        style={{
          width: "100%",
          height: 6,
          background: t.border,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 3,
            background: colors[variant] ?? t.accent,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function CheckItemView({ p, t, emit }: PrimProps) {
  const [checked, setChecked] = useState(!!p.props.checked);

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        cursor: p.props.disabled ? "not-allowed" : "pointer",
        opacity: p.props.disabled ? 0.4 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={!!p.props.disabled}
        onChange={(event) => {
          setChecked(event.target.checked);
          emit(p.id, "primitive:toggle", {
            kind: p.kind,
            checked: event.target.checked,
          });
        }}
        style={{ accentColor: t.accent }}
      />
      <span
        style={{
          color: checked ? t.muted : t.text,
          textDecoration: checked ? "line-through" : "none",
          transition: "all 150ms",
        }}
      >
        {p.label}
      </span>
    </label>
  );
}

function MetricValueView({ p, t }: PrimProps) {
  const trend = (p.props.trend as string) ?? "flat";
  const icons: Record<string, string> = { up: "▲", down: "▼", flat: "—" };
  const trendColors: Record<string, string> = {
    up: t.success,
    down: t.error,
    flat: t.muted,
  };

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: t.muted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 500,
        }}
      >
        {p.label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {String(p.props.value ?? "")}
        </span>
        {p.props.unit ? (
          <span style={{ fontSize: 13, color: t.muted }}>{p.props.unit as string}</span>
        ) : null}
        <span style={{ fontSize: 10, color: trendColors[trend], marginLeft: 2 }}>
          {icons[trend]}
        </span>
      </div>
    </div>
  );
}

function ListItemView({ p, t, emit }: PrimProps) {
  const active = !!p.props.active;

  return (
    <div
      onClick={() =>
        emit(p.id, "primitive:select", {
          kind: p.kind,
          label: p.label,
        })
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 8,
        cursor: "pointer",
        borderLeft: `2px solid ${active ? t.accent : "transparent"}`,
        background: active ? `${t.accent}14` : "transparent",
        transition: "all 150ms",
      }}
      role="button"
      tabIndex={0}
    >
      {Boolean(p.props.icon) ? (
        <span style={{ color: t.muted, fontSize: 14, flexShrink: 0 }}>
          {p.props.icon as string}
        </span>
      ) : null}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: active ? t.accent : t.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {p.label}
        </div>
        {Boolean(p.props.secondary) ? (
          <div
            style={{
              fontSize: 11,
              color: t.muted,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {p.props.secondary as string}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NavItemView({ p, t, emit }: PrimProps) {
  const active = !!p.props.active;

  return (
    <div
      onClick={() =>
        emit(p.id, "primitive:navigate", {
          kind: p.kind,
          label: p.label,
        })
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        color: active ? t.accent : t.muted,
        background: active ? `${t.accent}1a` : "transparent",
        transition: "all 150ms",
      }}
      role="button"
      tabIndex={0}
    >
      {Boolean(p.props.icon) ? <span style={{ fontSize: 14 }}>{p.props.icon as string}</span> : null}
      <span style={{ flex: 1 }}>{p.label}</span>
      {Boolean(p.props.badge) ? (
        <span
          style={{
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 10,
            background: `${t.accent}26`,
            color: t.accent,
            fontWeight: 500,
          }}
        >
          {p.props.badge as string}
        </span>
      ) : null}
    </div>
  );
}

function CardView({ p, t, emit }: PrimProps) {
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: 16,
        transition: "border-color 150ms, box-shadow 150ms",
      }}
    >
      {Boolean(p.props.title) ? (
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
          {p.props.title as string}
        </div>
      ) : null}
      {Boolean(p.props.subtitle) ? (
        <div style={{ fontSize: 12, color: t.muted, marginBottom: 12 }}>
          {p.props.subtitle as string}
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(p.children ?? []).map((child) => (
          <PrimitiveView key={child.id} p={child} t={t} emit={emit} />
        ))}
      </div>
    </div>
  );
}

function ActionBarView({ p, emit, t }: PrimProps) {
  const align = (p.props.align as string) ?? "right";
  const justify: Record<string, string> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "4px 0",
        flexWrap: "wrap",
        justifyContent: justify[align] ?? "flex-end",
      }}
    >
      {(p.children ?? []).map((child) => (
        <PrimitiveView key={child.id} p={child} t={t} emit={emit} />
      ))}
    </div>
  );
}

const RENDERERS: Record<string, React.FC<PrimProps>> = {
  "status-dot": StatusDotView,
  badge: BadgeView,
  button: ButtonView,
  "text-block": TextBlockView,
  "input-field": InputFieldView,
  "progress-bar": ProgressBarView,
  "check-item": CheckItemView,
  "metric-value": MetricValueView,
  "list-item": ListItemView,
  card: CardView,
  "nav-item": NavItemView,
  "action-bar": ActionBarView,
};

function PrimitiveView({ p, t, emit }: PrimProps) {
  const Renderer = RENDERERS[p.kind];
  if (!Renderer) {
    return <div style={{ color: t.error }}>Unknown: {p.kind}</div>;
  }
  return <Renderer p={p} t={t} emit={emit} />;
}

function panelStyle(theme: ThemeTokens): CSSProperties {
  return {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    overflow: "hidden",
  };
}

interface PolymorphPlaygroundProps {
  embedded?: boolean;
}

export function PolymorphPlayground({
  embedded = false,
}: PolymorphPlaygroundProps) {
  const [activeTemplate, setActiveTemplate] =
    useState<keyof typeof templates>("design");
  const [activeTheme, setActiveTheme] = useState<ThemeName>("skynet");
  const { events, emit } = useEventLog();
  const theme = THEMES[activeTheme];

  resetIds();
  const template = templates[activeTemplate];
  const primitives: PolymorphPrimitive[] =
    template?.previewRenderer({ topic: `${activeTemplate} Explorer` }) ?? [];
  const jsonRenderSpec = buildJsonRenderSpec(primitives);
  const cssVars = {
    "--ap-bg": theme.bg,
    "--ap-surface": theme.surface,
    "--ap-border": theme.border,
    "--ap-text": theme.text,
    "--ap-muted": theme.muted,
    "--ap-accent": theme.accent,
    "--ap-warning": theme.warning,
    "--ap-error": theme.error,
    "--ap-success": theme.success,
    "--ap-info": theme.info,
    "--ap-accent-soft": `${theme.accent}14`,
    "--ap-accent-border": `${theme.accent}26`,
  } as CSSProperties;

  return (
    <div
      style={{
        minHeight: embedded ? "auto" : "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          position: embedded ? "static" : "sticky",
          top: 0,
          zIndex: 50,
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          padding: "8px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.accent }}>
            GenUI Compare POC
          </span>
          <span style={{ fontSize: 11, color: theme.muted }}>
            Current polymorph primitives vs Vercel-style guarded catalog render
          </span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {(Object.keys(templates) as Array<keyof typeof templates>).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveTemplate(name)}
              style={{
                padding: "4px 10px",
                fontSize: 12,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                background:
                  activeTemplate === name ? `${theme.accent}1a` : "transparent",
                color: activeTemplate === name ? theme.accent : theme.muted,
                transition: "all 150ms",
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {(Object.keys(THEMES) as ThemeName[]).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveTheme(name)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                borderRadius: 6,
                border: `1px solid ${
                  activeTheme === name ? theme.accent : theme.border
                }`,
                cursor: "pointer",
                fontFamily: "inherit",
                background:
                  activeTheme === name ? `${theme.accent}1a` : "transparent",
                color: activeTheme === name ? theme.accent : theme.muted,
                transition: "all 150ms",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: 24 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: 16,
          }}
        >
          <section style={panelStyle(theme)}>
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Current Polymorph</div>
                <div style={{ fontSize: 11, color: theme.muted }}>
                  Hand-authored primitive renderer
                </div>
              </div>
              <span style={{ fontSize: 11, color: theme.muted }}>
                {primitives.length} root primitives
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
                padding: 16,
              }}
            >
              {primitives.map((primitive) => (
                <PrimitiveView
                  key={primitive.id}
                  p={primitive}
                  t={theme}
                  emit={emit}
                />
              ))}
            </div>
          </section>

          <section style={panelStyle(theme)}>
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  json-render Projection
                </div>
                <div style={{ fontSize: 11, color: theme.muted }}>
                  Guarded catalog, flat spec, action-bound render tree
                </div>
              </div>
              <span style={{ fontSize: 11, color: theme.muted }}>
                {Object.keys(jsonRenderSpec.elements).length} catalog elements
              </span>
            </div>
            <div style={{ padding: 16, ...cssVars }}>
              <StateProvider initialState={{}}>
                <VisibilityProvider>
                  <ActionProvider
                    handlers={{
                      emitPrimitiveEvent: (params) => {
                        const data =
                          params && typeof params === "object"
                            ? (params as Record<string, unknown>)
                            : {};
                        const id =
                          typeof data.id === "string" ? data.id : "json-render";
                        const action =
                          typeof data.action === "string"
                            ? `json-render:${data.action}`
                            : "json-render:event";
                        emit(id, action, data);
                      },
                    }}
                  >
                    <JSONRenderer
                      spec={jsonRenderSpec}
                      registry={agentpingJsonRenderRegistry}
                    />
                  </ActionProvider>
                </VisibilityProvider>
              </StateProvider>
            </div>
          </section>
        </div>

        {events.length > 0 ? (
          <div
            style={{
              ...panelStyle(theme),
              marginTop: 16,
              position: embedded ? "static" : "sticky",
              bottom: 0,
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                background: theme.surface,
                borderBottom: `1px solid ${theme.border}`,
                fontFamily: '"SF Mono", "Fira Code", monospace',
                fontSize: 11,
                fontWeight: 600,
                color: theme.accent,
              }}
            >
              Events ({events.length})
            </div>
            <div
              style={{
                maxHeight: embedded ? 220 : 180,
                overflowY: "auto",
                fontFamily: '"SF Mono", "Fira Code", monospace',
                fontSize: 11,
              }}
            >
              {events.map((event, index) => (
                <div
                  key={`${event.id}-${event.ts}-${index}`}
                  style={{
                    padding: "4px 12px",
                    color: theme.muted,
                    display: "flex",
                    gap: 8,
                    borderBottom:
                      index === events.length - 1
                        ? "none"
                        : `1px solid ${theme.border}`,
                  }}
                >
                  <span style={{ opacity: 0.6 }}>
                    {new Date(event.ts).toLocaleTimeString("en", {
                      hour12: false,
                    })}
                  </span>
                  <span style={{ color: theme.accent }}>{event.id}</span>
                  <span style={{ color: theme.success }}>{event.action}</span>
                  <span style={{ color: theme.text }}>
                    {JSON.stringify(event.data)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
