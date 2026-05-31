/**
 * PreviewGallery — end-to-end visual verification of all 12 LevNowElement adapters.
 *
 * Renders one realistic sample RenderSpec per element type so a human can sanity-check
 * the GenUI absorption layer.
 *
 * Sample data is sourced from `./lev-now-samples` so that ComponentDetail can render
 * a single scoped sample driven by a component's `levNowElement` field while the
 * gallery here renders the full set.
 */

import * as React from "react";
import { LevNowElement } from "@kingly/ui/renderers/lev-now";
import { LEV_NOW_SAMPLES } from "./lev-now-samples";

const SAMPLES = Object.values(LEV_NOW_SAMPLES);

export function PreviewGallery(): React.ReactElement {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          margin: 0,
          color: "#22d3ee",
        }}
      >
        Live Preview — LevNowElement Gallery
      </h2>

      <p
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          color: "var(--kingly-text-muted)",
          margin: 0,
        }}
      >
        {SAMPLES.length} samples — one per lev-now element type. Each is rendered by the real
        <code style={{ color: "#22d3ee", padding: "0 4px" }}>LevNowElement</code> adapter from
        <code style={{ color: "var(--kingly-text-secondary)", padding: "0 4px" }}>@kingly/ui/components</code>.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: 14,
        }}
      >
        {SAMPLES.map((sample) => (
          <div
            key={sample.label}
            style={{
              border: "1px solid rgba(34, 211, 238, 0.2)",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              background:
                "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
            }}
          >
            <div
              style={{
                padding: "8px 14px",
                background: "rgba(34, 211, 238, 0.06)",
                borderBottom: "1px solid rgba(34, 211, 238, 0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#22d3ee",
                  fontWeight: 600,
                }}
              >
                {sample.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "var(--kingly-text-muted)",
                }}
              >
                type="{sample.type}"
                {sample.variant ? ` variant="${sample.variant}"` : ""}
              </span>
            </div>
            <div
              style={{
                padding: 16,
                minHeight: 80,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <LevNowElement
                type={sample.type}
                variant={sample.variant}
                props={sample.props}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
