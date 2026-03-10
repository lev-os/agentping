import { describe, expect, it } from "vitest";

import { toCanvasEnvelope } from "./envelope";

describe("toCanvasEnvelope", () => {
  it("translates legacy kanban payloads into the local surface envelope", () => {
    const envelope = toCanvasEnvelope({
      type: "canvas_interaction",
      action: "render",
      componentType: "sofia-widget",
      props: {
        provider: "sofia",
        widgetId: "bd-dashboard",
        data: {
          title: "BD State",
          columns: ["open"],
          cards: [{ id: "1", title: "Fix truth gap", column: "open" }],
        },
      },
    });

    expect(envelope.kind).toBe("surface");
    if (envelope.kind !== "surface") return;

    expect(envelope.surface).toBe("kanban");
    expect(envelope.meta.source).toBe("legacy-sofia-widget");
    expect(envelope.meta.widgetId).toBe("bd-dashboard");
    expect(envelope.data.columns).toEqual(["open"]);
  });

  it("passes through local host envelopes unchanged", () => {
    const envelope = toCanvasEnvelope({
      type: "canvas_interaction",
      action: "render",
      componentType: "host-envelope",
      envelope: {
        kind: "surface",
        surface: "markdown",
        title: "Hello",
        data: { content: "world" },
        meta: { source: "local-host-envelope" },
      },
    });

    expect(envelope).toEqual({
      kind: "surface",
      surface: "markdown",
      title: "Hello",
      data: { content: "world" },
      meta: { source: "local-host-envelope" },
    });
  });

  it("returns an explicit error envelope for invalid legacy contracts", () => {
    const envelope = toCanvasEnvelope({
      type: "canvas_interaction",
      action: "render",
      componentType: "sofia-widget",
      props: {
        provider: "sofia",
        widgetId: "custom",
      },
    });

    expect(envelope.kind).toBe("surface");
    if (envelope.kind !== "surface") return;
    expect(envelope.surface).toBe("unknown");
  });
});
