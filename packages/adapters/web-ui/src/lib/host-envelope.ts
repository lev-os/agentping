export interface HostEnvelopeMeta {
  source: "legacy-sofia-widget" | "local-host-envelope";
  widgetId?: string;
  variant?: string;
  componentName?: string;
  provider?: string;
  channel?: string;
}

export interface HostSelectionEnvelope {
  kind: "selection";
  instruction: string;
  selectionType: string;
  meta?: HostEnvelopeMeta;
}

export interface HostSurfaceEnvelope<TSurface extends string = string> {
  kind: "surface";
  surface: TSurface;
  title?: string;
  meta: HostEnvelopeMeta;
  data: Record<string, unknown>;
}

export interface HostErrorEnvelope {
  kind: "error";
  message: string;
  details: unknown;
  meta?: HostEnvelopeMeta;
}

export type HostEnvelope<TSurface extends string = string> =
  | HostSelectionEnvelope
  | HostSurfaceEnvelope<TSurface>
  | HostErrorEnvelope;

export type HostEnvelopePayload<TSurface extends string = string> =
  | {
      type: "canvas_interaction";
      action: "selection";
      componentType: "host-envelope";
      envelope: HostSelectionEnvelope;
    }
  | {
      type: "canvas_interaction";
      action: "render";
      componentType: "host-envelope";
      envelope: HostSurfaceEnvelope<TSurface>;
    };

export function isHostEnvelopePayload<TSurface extends string = string>(
  value: unknown,
): value is HostEnvelopePayload<TSurface> {
  if (!value || typeof value !== "object") return false;
  const payload = value as {
    type?: unknown;
    componentType?: unknown;
    envelope?: unknown;
  };

  if (
    payload.type !== "canvas_interaction" ||
    payload.componentType !== "host-envelope" ||
    !payload.envelope ||
    typeof payload.envelope !== "object"
  ) {
    return false;
  }

  const envelope = payload.envelope as { kind?: unknown };
  return (
    envelope.kind === "selection" ||
    envelope.kind === "surface" ||
    envelope.kind === "error"
  );
}
