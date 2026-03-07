/**
 * AgentPing json-render catalog and primitive projection helpers.
 *
 * This keeps the GenUI experiment bounded to a known set of AgentPing
 * primitives while making it easy to compare against the hand-written
 * polymorph renderer.
 */

import { defineCatalog, type ActionBinding, type Spec, type UIElement } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

import type { PolymorphPrimitive } from "./polymorph/types.js";

const ACTION_NAME = "emitPrimitiveEvent";
const GAP_MAP = {
  sm: "8px",
  md: "12px",
  lg: "16px",
} as const;

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function actionBinding(
  primitive: PolymorphPrimitive,
  action: string,
): Record<string, ActionBinding> {
  return {
    [action]: {
      action: ACTION_NAME,
      params: {
        id: primitive.id,
        kind: primitive.kind,
        action,
        label: primitive.label ?? null,
      },
    },
  };
}

export const agentpingCatalog = defineCatalog(schema, {
  components: {
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      slots: ["default"],
      description: "Layout container for arranging child primitives.",
    },
    Card: {
      props: z.object({
        title: z.string().nullable(),
        subtitle: z.string().nullable(),
      }),
      slots: ["default"],
      description: "Surface card for grouped content.",
    },
    TextBlock: {
      props: z.object({
        content: z.string(),
        variant: z.enum(["heading", "body", "caption", "code"]).nullable(),
      }),
      description: "Formatted text block.",
    },
    Button: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary", "ghost", "danger"]).nullable(),
        disabled: z.boolean().nullable(),
      }),
      description: "Clickable action button.",
    },
    StatusDot: {
      props: z.object({
        label: z.string().nullable(),
        status: z.enum(["online", "offline", "busy", "away"]).nullable(),
      }),
      description: "Status badge with colored dot.",
    },
    Badge: {
      props: z.object({
        text: z.string(),
        variant: z.enum(["default", "success", "warning", "error", "info"]).nullable(),
      }),
      description: "Compact badge label.",
    },
    InputField: {
      props: z.object({
        label: z.string().nullable(),
        value: z.string().nullable(),
        placeholder: z.string().nullable(),
        type: z.enum(["text", "email", "password", "number"]).nullable(),
      }),
      description: "Read-write input field.",
    },
    ProgressBar: {
      props: z.object({
        label: z.string().nullable(),
        value: z.number(),
        max: z.number().nullable(),
        variant: z.enum(["default", "success", "warning", "error"]).nullable(),
      }),
      description: "Progress indicator.",
    },
    CheckItem: {
      props: z.object({
        label: z.string(),
        checked: z.boolean().nullable(),
        disabled: z.boolean().nullable(),
      }),
      description: "Checklist row.",
    },
    Metric: {
      props: z.object({
        label: z.string().nullable(),
        value: z.union([z.string(), z.number()]),
        unit: z.string().nullable(),
        trend: z.enum(["up", "down", "flat"]).nullable(),
      }),
      description: "Metric value with trend indicator.",
    },
    ListItem: {
      props: z.object({
        label: z.string(),
        secondary: z.string().nullable(),
        icon: z.string().nullable(),
        active: z.boolean().nullable(),
      }),
      description: "Selectable list row.",
    },
    NavItem: {
      props: z.object({
        label: z.string(),
        icon: z.string().nullable(),
        badge: z.string().nullable(),
        active: z.boolean().nullable(),
      }),
      description: "Navigation row with optional badge.",
    },
    ActionBar: {
      props: z.object({
        align: z.enum(["left", "center", "right"]).nullable(),
      }),
      slots: ["default"],
      description: "Horizontal action row.",
    },
  },
  actions: {
    emitPrimitiveEvent: {
      description: "Record a bounded interaction from the rendered AgentPing primitive.",
      params: z.object({
        id: z.string(),
        kind: z.string(),
        action: z.string(),
        label: z.string().nullable(),
      }),
    },
  },
});

export const { registry: agentpingJsonRenderRegistry } = defineRegistry(
  agentpingCatalog,
  {
    components: {
      Stack: ({ props, children }) => (
        <div
          style={{
            display: "flex",
            flexDirection: props.direction === "horizontal" ? "row" : "column",
            gap: GAP_MAP[props.gap ?? "md"],
          }}
        >
          {children}
        </div>
      ),
      Card: ({ props, children }) => (
        <section
          style={{
            background: "var(--ap-surface)",
            border: "1px solid var(--ap-border)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          {props.title ? (
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
              {props.title}
            </div>
          ) : null}
          {props.subtitle ? (
            <div
              style={{
                fontSize: 12,
                color: "var(--ap-muted)",
                marginBottom: children ? 12 : 0,
              }}
            >
              {props.subtitle}
            </div>
          ) : null}
          {children ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {children}
            </div>
          ) : null}
        </section>
      ),
      TextBlock: ({ props }) => {
        const styles = {
          heading: {
            fontSize: 18,
            fontWeight: 600,
            color: "var(--ap-text)",
            letterSpacing: "-0.01em",
          },
          body: {
            fontSize: 13,
            color: "var(--ap-text)",
            lineHeight: 1.5,
          },
          caption: {
            fontSize: 12,
            color: "var(--ap-muted)",
          },
          code: {
            fontSize: 12,
            color: "var(--ap-accent)",
            fontFamily: '"SF Mono", "Fira Code", monospace',
            background: "var(--ap-accent-soft)",
            padding: "3px 6px",
            borderRadius: 4,
            border: "1px solid var(--ap-accent-border)",
          },
        } as const;

        return (
          <div style={styles[props.variant ?? "body"]}>
            {props.content}
          </div>
        );
      },
      Button: ({ props, emit }) => {
        const variants = {
          primary: {
            background: "var(--ap-accent)",
            color: "var(--ap-bg)",
            borderColor: "transparent",
          },
          secondary: {
            background: "transparent",
            color: "var(--ap-text)",
            borderColor: "var(--ap-border)",
          },
          ghost: {
            background: "transparent",
            color: "var(--ap-muted)",
            borderColor: "transparent",
          },
          danger: {
            background: "var(--ap-error)",
            color: "#fff",
            borderColor: "transparent",
          },
        } as const;

        return (
          <button
            type="button"
            disabled={props.disabled ?? false}
            onClick={() => emit("press")}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 8,
              border: "1px solid",
              cursor: props.disabled ? "not-allowed" : "pointer",
              opacity: props.disabled ? 0.4 : 1,
              transition: "all 150ms",
              fontFamily: "inherit",
              ...variants[props.variant ?? "primary"],
            }}
          >
            {props.label}
          </button>
        );
      },
      StatusDot: ({ props }) => {
        const colors = {
          online: "var(--ap-success)",
          offline: "var(--ap-muted)",
          busy: "var(--ap-error)",
          away: "var(--ap-warning)",
        } as const;

        return (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors[props.status ?? "offline"],
                boxShadow:
                  props.status === "online"
                    ? "0 0 6px var(--ap-success)"
                    : undefined,
              }}
            />
            {props.label ? <span>{props.label}</span> : null}
          </div>
        );
      },
      Badge: ({ props }) => {
        const colors = {
          default: "var(--ap-muted)",
          success: "var(--ap-success)",
          warning: "var(--ap-warning)",
          error: "var(--ap-error)",
          info: "var(--ap-info)",
        } as const;
        const color = colors[props.variant ?? "default"];

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
            {props.text}
          </span>
        );
      },
      InputField: ({ props }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {props.label ? (
            <label
              style={{
                fontSize: 12,
                color: "var(--ap-muted)",
                fontWeight: 500,
              }}
            >
              {props.label}
            </label>
          ) : null}
          <input
            type={props.type ?? "text"}
            defaultValue={props.value ?? ""}
            placeholder={props.placeholder ?? ""}
            style={{
              width: "100%",
              padding: "7px 10px",
              fontSize: 13,
              borderRadius: 8,
              background: "var(--ap-bg)",
              color: "var(--ap-text)",
              border: "1px solid var(--ap-border)",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
      ),
      ProgressBar: ({ props }) => {
        const max = props.max ?? 100;
        const safeValue = Math.min(max, Math.max(0, props.value));
        const pct = max > 0 ? (safeValue / max) * 100 : 0;
        const colors = {
          default: "var(--ap-accent)",
          success: "var(--ap-success)",
          warning: "var(--ap-warning)",
          error: "var(--ap-error)",
        } as const;

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {props.label ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "var(--ap-muted)" }}>{props.label}</span>
                <span
                  style={{
                    color: "var(--ap-text)",
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
                background: "var(--ap-border)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: colors[props.variant ?? "default"],
                  transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          </div>
        );
      },
      CheckItem: ({ props, emit }) => (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            cursor: props.disabled ? "not-allowed" : "pointer",
            opacity: props.disabled ? 0.4 : 1,
          }}
        >
          <input
            type="checkbox"
            defaultChecked={props.checked ?? false}
            disabled={props.disabled ?? false}
            onChange={() => emit("toggle")}
            style={{ accentColor: "var(--ap-accent)" }}
          />
          <span>{props.label}</span>
        </label>
      ),
      Metric: ({ props }) => {
        const icons = {
          up: "▲",
          down: "▼",
          flat: "—",
        } as const;
        const colors = {
          up: "var(--ap-success)",
          down: "var(--ap-error)",
          flat: "var(--ap-muted)",
        } as const;
        const trend = props.trend ?? "flat";

        return (
          <div>
            {props.label ? (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ap-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
              >
                {props.label}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginTop: 2,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {String(props.value)}
              </span>
              {props.unit ? (
                <span style={{ fontSize: 13, color: "var(--ap-muted)" }}>
                  {props.unit}
                </span>
              ) : null}
              <span
                style={{
                  fontSize: 10,
                  color: colors[trend],
                  marginLeft: 2,
                }}
              >
                {icons[trend]}
              </span>
            </div>
          </div>
        );
      },
      ListItem: ({ props, emit }) => (
        <div
          onClick={() => emit("select")}
          role="button"
          tabIndex={0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
            borderLeft: props.active
              ? "2px solid var(--ap-accent)"
              : "2px solid transparent",
            background: props.active ? "var(--ap-accent-soft)" : "transparent",
            transition: "all 150ms",
          }}
        >
          {props.icon ? (
            <span
              style={{
                color: "var(--ap-muted)",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {props.icon}
            </span>
          ) : null}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                color: props.active ? "var(--ap-accent)" : "var(--ap-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {props.label}
            </div>
            {props.secondary ? (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ap-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {props.secondary}
              </div>
            ) : null}
          </div>
        </div>
      ),
      NavItem: ({ props, emit }) => (
        <div
          onClick={() => emit("navigate")}
          role="button"
          tabIndex={0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            color: props.active ? "var(--ap-accent)" : "var(--ap-muted)",
            background: props.active ? "var(--ap-accent-soft)" : "transparent",
            transition: "all 150ms",
          }}
        >
          {props.icon ? <span style={{ fontSize: 14 }}>{props.icon}</span> : null}
          <span style={{ flex: 1 }}>{props.label}</span>
          {props.badge ? (
            <span
              style={{
                fontSize: 10,
                padding: "1px 6px",
                borderRadius: 10,
                background: "var(--ap-accent-border)",
                color: "var(--ap-accent)",
                fontWeight: 500,
              }}
            >
              {props.badge}
            </span>
          ) : null}
        </div>
      ),
      ActionBar: ({ props, children }) => {
        const justify = {
          left: "flex-start",
          center: "center",
          right: "flex-end",
        } as const;

        return (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "4px 0",
              flexWrap: "wrap",
              justifyContent: justify[props.align ?? "right"],
            }}
          >
            {children}
          </div>
        );
      },
    },
    actions: {
      emitPrimitiveEvent: async () => undefined,
    },
  },
);

function toElement(
  primitive: PolymorphPrimitive,
  elements: Record<string, UIElement>,
): string {
  const childKeys = (primitive.children ?? []).map((child) =>
    toElement(child, elements),
  );

  switch (primitive.kind) {
    case "card": {
      elements[primitive.id] = {
        type: "Card",
        props: {
          title: asString(primitive.props.title) ?? primitive.label ?? null,
          subtitle: asString(primitive.props.subtitle),
        },
        children: childKeys,
      };
      return primitive.id;
    }
    case "text-block": {
      elements[primitive.id] = {
        type: "TextBlock",
        props: {
          content:
            asString(primitive.props.content) ??
            primitive.label ??
            `Unsupported text payload for ${primitive.id}`,
          variant: asString(primitive.props.variant) ?? "body",
        },
      };
      return primitive.id;
    }
    case "button": {
      elements[primitive.id] = {
        type: "Button",
        props: {
          label:
            asString(primitive.label) ??
            asString(primitive.props.label) ??
            primitive.id,
          variant: asString(primitive.props.variant) ?? "primary",
          disabled: asBoolean(primitive.props.disabled),
        },
        on: actionBinding(primitive, "press"),
      };
      return primitive.id;
    }
    case "status-dot": {
      elements[primitive.id] = {
        type: "StatusDot",
        props: {
          label: primitive.label ?? null,
          status: asString(primitive.props.status) ?? "offline",
        },
      };
      return primitive.id;
    }
    case "badge": {
      elements[primitive.id] = {
        type: "Badge",
        props: {
          text:
            primitive.label ??
            asString(primitive.props.text) ??
            asString(primitive.props.variant) ??
            "badge",
          variant: asString(primitive.props.variant) ?? "default",
        },
      };
      return primitive.id;
    }
    case "input-field": {
      elements[primitive.id] = {
        type: "InputField",
        props: {
          label: primitive.label ?? asString(primitive.props.label),
          value: asString(primitive.props.value),
          placeholder: asString(primitive.props.placeholder),
          type: asString(primitive.props.type) ?? "text",
        },
      };
      return primitive.id;
    }
    case "progress-bar": {
      elements[primitive.id] = {
        type: "ProgressBar",
        props: {
          label: primitive.label ?? null,
          value: asNumber(primitive.props.value),
          max: asNumber(primitive.props.max, 100),
          variant: asString(primitive.props.variant) ?? "default",
        },
      };
      return primitive.id;
    }
    case "check-item": {
      elements[primitive.id] = {
        type: "CheckItem",
        props: {
          label: primitive.label ?? primitive.id,
          checked: asBoolean(primitive.props.checked),
          disabled: asBoolean(primitive.props.disabled),
        },
        on: actionBinding(primitive, "toggle"),
      };
      return primitive.id;
    }
    case "metric-value": {
      elements[primitive.id] = {
        type: "Metric",
        props: {
          label: primitive.label ?? null,
          value:
            asString(primitive.props.value) ??
            asNumber(primitive.props.value),
          unit: asString(primitive.props.unit),
          trend: asString(primitive.props.trend) ?? "flat",
        },
      };
      return primitive.id;
    }
    case "list-item": {
      elements[primitive.id] = {
        type: "ListItem",
        props: {
          label: primitive.label ?? primitive.id,
          secondary: asString(primitive.props.secondary),
          icon: asString(primitive.props.icon),
          active: asBoolean(primitive.props.active),
        },
        on: actionBinding(primitive, "select"),
      };
      return primitive.id;
    }
    case "nav-item": {
      elements[primitive.id] = {
        type: "NavItem",
        props: {
          label: primitive.label ?? primitive.id,
          icon: asString(primitive.props.icon),
          badge: asString(primitive.props.badge),
          active: asBoolean(primitive.props.active),
        },
        on: actionBinding(primitive, "navigate"),
      };
      return primitive.id;
    }
    case "action-bar": {
      elements[primitive.id] = {
        type: "ActionBar",
        props: {
          align: asString(primitive.props.align) ?? "right",
        },
        children: childKeys,
      };
      return primitive.id;
    }
    default: {
      elements[primitive.id] = {
        type: "TextBlock",
        props: {
          content: `Unsupported primitive kind: ${primitive.kind}`,
          variant: "caption",
        },
      };
      return primitive.id;
    }
  }
}

export function buildJsonRenderSpec(primitives: PolymorphPrimitive[]): Spec {
  const elements: Record<string, UIElement> = {};
  const rootChildren = primitives.map((primitive) => toElement(primitive, elements));

  elements["root-stack"] = {
    type: "Stack",
    props: {
      direction: "vertical",
      gap: "md",
    },
    children: rootChildren,
  };

  return {
    root: "root-stack",
    elements,
  };
}
