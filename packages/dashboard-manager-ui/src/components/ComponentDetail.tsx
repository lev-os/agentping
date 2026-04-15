import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PreviewGallery } from "./PreviewGallery";

// ── Types (shared with ComponentRegistry) ──────────────────

interface ManifestComponent {
  id: string;
  name: string;
  family: string;
  domain: string;
  capabilities: string[];
  classification: "REAL" | "ALIAS" | "SHELL" | "HOLLOW";
  levNowElement: string | null;
  origin: string;
  migrationStatus: string;
  source: string;
  loc: number;
  imports: number;
  hooks: number;
  propCount: number;
  lanes: string[];
  beadId: string;
  markers: string[];
  reviewStatus?: string;
  humanDecision?: string;
  canonical?: string;
}

interface Manifest {
  version: number;
  generated: string;
  total: number;
  byClassification: Record<string, number>;
  byFamily: Record<string, number>;
  byLevNowElement: Record<string, number>;
  components: ManifestComponent[];
}

// ── Sample props for LevNowElement demo ────────────────────

const SAMPLE_LEV_NOW_PROPS: Record<
  string,
  { type: string; variant?: string; props: Record<string, unknown> }
> = {
  hero: {
    type: "hero",
    props: {
      title: "Sample Hero",
      subtitle: "GenUI bridge rendering",
      category: "demo",
      meta: "Rendered via LevNowElement adapter",
    },
  },
  card: {
    type: "card",
    props: {
      title: "Sample Card",
      label: "GenUI Demo",
      content: "This card is rendered through the lev-now absorption layer.",
    },
  },
  "card-kpi": {
    type: "card",
    variant: "kpi",
    props: {
      value: "42",
      label: "Components Absorbed",
      trend: { direction: "up", value: "+7" },
    },
  },
  "data-table": {
    type: "data-table",
    props: {
      columns: [
        { key: "name", label: "Name" },
        { key: "status", label: "Status" },
        { key: "type", label: "Type" },
      ],
      rows: [
        { name: "Badge", status: "migrated", type: "REAL" },
        { name: "StatusCard", status: "migrated", type: "REAL" },
        { name: "Terminal", status: "migrated", type: "ALIAS" },
      ],
    },
  },
  "code-block": {
    type: "code-block",
    props: {
      content: 'import { LevNowElement } from "@kingly/ui/genui";\n\n<LevNowElement type="card" props={{ title: "Hello" }} />',
      filename: "example.tsx",
      language: "tsx",
    },
  },
  timeline: {
    type: "timeline",
    props: {
      items: [
        { date: "2026-01-15", title: "Migration started", status: "completed" },
        { date: "2026-02-10", title: "GenUI bridge built", status: "completed" },
        { date: "2026-03-01", title: "QA review", status: "in-progress" },
      ],
    },
  },
  text: {
    type: "text",
    props: {
      content:
        "**GenUI absorption** renders lev-now specs as _real React components_ instead of static HTML.",
    },
  },
  feedback: {
    type: "feedback",
    props: {
      title: "Pending Reviews",
      items: [
        {
          id: "r1",
          title: "Badge conflict resolution",
          insight: "WebUI and Studio variants differ in padding",
        },
      ],
    },
  },
  inline: {
    type: "inline",
    variant: "status-badge",
    props: { label: "ACTIVE", variant: "match" },
  },
  section: {
    type: "section",
    props: {
      title: "Sample Section",
      subtitle: "Rendered via GenUI bridge",
    },
  },
  chart: {
    type: "chart",
    props: { title: "Chart placeholder" },
  },
  diagram: {
    type: "diagram",
    props: { title: "Diagram placeholder" },
  },
};

// ── Colour helpers ─────────────────────────────────────────

function classificationColor(cls: string): string {
  switch (cls) {
    case "REAL":
      return "#22c55e";
    case "ALIAS":
      return "#3b82f6";
    case "SHELL":
      return "#fbbf24";
    case "HOLLOW":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

// ── Storybook URL builder ──────────────────────────────────

function buildStorybookUrl(component: ManifestComponent): string {
  // Convert family path to storybook ID:
  // e.g. "Migrations/WebUI/Badge" -> "migrations-webui-badge--default"
  const storyPath = component.family
    .split("/")
    .map((s) => s.toLowerCase().replace(/\s+/g, "-"))
    .join("-");
  return `http://localhost:6007/iframe.html?id=${storyPath}--default&viewMode=story`;
}

function buildStorybookUrlForVariant(
  component: ManifestComponent,
  variantSuffix: string,
): string {
  const storyPath = component.family
    .split("/")
    .map((s) => s.toLowerCase().replace(/\s+/g, "-"))
    .join("-");
  return `http://localhost:6007/iframe.html?id=${storyPath}--${variantSuffix}&viewMode=story`;
}

// ── Component ──────────────────────────────────────────────

export function ComponentDetail() {
  const { id } = useParams<{ id: string }>();
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manifestExpanded, setManifestExpanded] = useState(false);
  const [storybookError, setStorybookError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/components");
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data: Manifest = await res.json();
        setManifest(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load manifest");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  const component = useMemo(
    () => manifest?.components.find((c) => c.id === id) ?? null,
    [manifest, id],
  );

  const isConflict = !!(id && id.includes("conflict"));

  // ── Loading / error / not-found states ──

  if (isLoading) {
    return (
      <div className="command-center-page">
        <div className="command-center-detail">
          <div className="projects-empty">Loading component data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="command-center-page">
        <div className="command-center-detail">
          <Link to="/registry" className="command-center-button">
            ← Back to Registry
          </Link>
          <div className="projects-empty projects-empty--error">
            Failed to load manifest: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="command-center-page">
        <div
          style={{
            maxWidth: 720,
            margin: "80px auto",
            padding: 32,
            border: "1px solid var(--kingly-border-default)",
            borderRadius: 12,
            background:
              "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              marginBottom: 8,
            }}
          >
            Component not found
          </h1>
          <p
            style={{
              color: "var(--kingly-text-muted)",
              marginBottom: 24,
            }}
          >
            No component matches <code>{id}</code>.
          </p>
          <Link
            to="/registry"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: 6,
              background: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              textDecoration: "none",
            }}
          >
            ← Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  // ── Computed values ──

  const clsColor = classificationColor(component.classification);
  const storybookUrl = buildStorybookUrl(component);
  const sampleLevNow = component.levNowElement
    ? SAMPLE_LEV_NOW_PROPS[component.levNowElement] ??
      SAMPLE_LEV_NOW_PROPS["card"]
    : null;

  return (
    <div className="command-center-page">
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 20px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Back button */}
        <Link
          to="/registry"
          style={{
            alignSelf: "flex-start",
            padding: "6px 14px",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.04em",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            color: "var(--kingly-text-secondary)",
            textDecoration: "none",
            transition: "all 160ms ease",
          }}
        >
          ← Back to Registry
        </Link>

        {/* ── A. Hero section ── */}
        <section
          style={{
            padding: "28px 32px",
            border: `1px solid ${clsColor}33`,
            background:
              "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
            borderRadius: 14,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Title row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {component.name}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* Classification badge */}
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: clsColor,
                    padding: "3px 8px",
                    border: `1px solid ${clsColor}33`,
                    borderRadius: 4,
                    background: `${clsColor}14`,
                  }}
                >
                  {component.classification}
                </span>
                {/* Family path */}
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--kingly-text-muted)",
                    padding: "3px 8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  {component.family}
                </span>
                {/* Origin */}
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--kingly-text-muted)",
                    padding: "3px 8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  {component.origin}
                </span>
                {/* Lev-now element type */}
                {component.levNowElement && (
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: "#22d3ee",
                      padding: "3px 8px",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      borderRadius: 4,
                      background: "rgba(34, 211, 238, 0.08)",
                    }}
                  >
                    lev-now: {component.levNowElement}
                  </span>
                )}
              </div>
            </div>

            {/* Review status indicator */}
            {component.reviewStatus && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor:
                      component.reviewStatus === "canonical"
                        ? "#fbbf24"
                        : component.reviewStatus === "reviewed"
                          ? "#22c55e"
                          : "#6b7280",
                    boxShadow: `0 0 8px ${
                      component.reviewStatus === "canonical"
                        ? "#fbbf24"
                        : component.reviewStatus === "reviewed"
                          ? "#22c55e"
                          : "#6b7280"
                    }`,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--kingly-text-secondary)",
                  }}
                >
                  {component.reviewStatus}
                </span>
              </div>
            )}
          </div>

          {/* Capabilities */}
          {component.capabilities.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {component.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="parity-badge"
                >
                  {cap}
                </span>
              ))}
            </div>
          )}

          {/* Metrics row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            <MetricCard label="LOC" value={component.loc} />
            <MetricCard label="Props" value={component.propCount} />
            <MetricCard label="Hooks" value={component.hooks} />
            <MetricCard label="Imports" value={component.imports} />
          </div>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              fontSize: 12,
              color: "var(--kingly-text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div>
              <span style={{ opacity: 0.6 }}>id: </span>
              <span>{component.id}</span>
            </div>
            <div>
              <span style={{ opacity: 0.6 }}>domain: </span>
              <span>{component.domain}</span>
            </div>
            <div>
              <span style={{ opacity: 0.6 }}>source: </span>
              <span>{component.source}</span>
            </div>
            {component.beadId && (
              <div>
                <span style={{ opacity: 0.6 }}>bead: </span>
                <span>{component.beadId}</span>
              </div>
            )}
            {component.canonical && (
              <div>
                <span style={{ opacity: 0.6 }}>canonical: </span>
                <span>{component.canonical}</span>
              </div>
            )}
          </div>
        </section>

        {/* ── D. Conflict split view ── */}
        {isConflict && (
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
                color: "#fbbf24",
              }}
            >
              Conflict Comparison
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {/* WebUiRaw variant */}
              <div
                style={{
                  border: "1px solid var(--kingly-border-default)",
                  borderRadius: 12,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    background: "rgba(59, 130, 246, 0.08)",
                    borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3b82f6",
                    fontWeight: 600,
                  }}
                >
                  WebUI Variant
                </div>
                <iframe
                  src={buildStorybookUrlForVariant(component, "web-ui-raw")}
                  title={`${component.name} - WebUI variant`}
                  style={{
                    width: "100%",
                    height: 400,
                    border: "none",
                    background: "transparent",
                  }}
                />
              </div>

              {/* StudioRaw variant */}
              <div
                style={{
                  border: "1px solid var(--kingly-border-default)",
                  borderRadius: 12,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    background: "rgba(168, 85, 247, 0.08)",
                    borderBottom: "1px solid rgba(168, 85, 247, 0.2)",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#a855f7",
                    fontWeight: 600,
                  }}
                >
                  Studio Variant
                </div>
                <iframe
                  src={buildStorybookUrlForVariant(component, "studio-raw")}
                  title={`${component.name} - Studio variant`}
                  style={{
                    width: "100%",
                    height: 400,
                    border: "none",
                    background: "transparent",
                  }}
                />
              </div>
            </div>

            {/* Decision summary */}
            {(component.humanDecision || component.markers.length > 0) && (
              <div
                style={{
                  padding: "16px 20px",
                  border: "1px solid rgba(251, 191, 36, 0.25)",
                  borderRadius: 10,
                  background:
                    "linear-gradient(180deg, rgba(251, 191, 36, 0.06), rgba(251, 191, 36, 0.02))",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#fbbf24",
                    fontWeight: 600,
                  }}
                >
                  Resolution Decision
                </span>
                {component.humanDecision && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--kingly-text-secondary)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {component.humanDecision}
                  </p>
                )}
                {component.markers.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {component.markers.map((marker) => (
                      <span
                        key={marker}
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#fbbf24",
                          padding: "3px 8px",
                          border: "1px solid rgba(251, 191, 36, 0.3)",
                          borderRadius: 4,
                          background: "rgba(251, 191, 36, 0.1)",
                        }}
                      >
                        {marker}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── B. Live render panel (GenUI dogfood) ── */}
        {sampleLevNow && (
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
              GenUI Live Render
            </h2>

            <div
              style={{
                border: "1px solid rgba(34, 211, 238, 0.2)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Header bar */}
              <div
                style={{
                  padding: "10px 16px",
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
                  LevNowElement type="{sampleLevNow.type}"
                  {sampleLevNow.variant
                    ? ` variant="${sampleLevNow.variant}"`
                    : ""}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    color: "var(--kingly-text-muted)",
                  }}
                >
                  @kingly/ui/genui
                </span>
              </div>

              {/* Render area */}
              <div
                style={{
                  padding: 20,
                  background:
                    "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
                  minHeight: 120,
                }}
              >
                {/*
                  NOTE: We render a static preview of what LevNowElement would produce.
                  In a full integration, this would be:
                    <LevNowElement type={sampleLevNow.type} variant={sampleLevNow.variant} props={sampleLevNow.props} />
                  For now, we show the element spec as a formatted preview to avoid
                  cross-package import issues in the dashboard-manager-ui build.
                */}
                <div
                  style={{
                    padding: 16,
                    border: "1px solid var(--kingly-border-default)",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--kingly-text-muted)",
                      marginBottom: 8,
                    }}
                  >
                    Element Spec
                  </div>
                  <pre
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "#22d3ee",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {JSON.stringify(
                      {
                        type: sampleLevNow.type,
                        ...(sampleLevNow.variant
                          ? { variant: sampleLevNow.variant }
                          : {}),
                        props: sampleLevNow.props,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>

              {/* Props summary */}
              <div
                style={{
                  padding: "10px 16px",
                  background: "rgba(34, 211, 238, 0.03)",
                  borderTop: "1px solid rgba(34, 211, 238, 0.1)",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--kingly-text-muted)",
                }}
              >
                Props passed: {Object.keys(sampleLevNow.props).join(", ")}
              </div>
            </div>
          </section>
        )}

        {/* ── B2. Full LevNowElement gallery (all 12 adapters) ── */}
        <PreviewGallery />

        {/* ── C. Storybook embed ── */}
        {!isConflict && (
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
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
                  color: "var(--kingly-text-secondary)",
                }}
              >
                Storybook Preview
              </h2>
              <a
                href={storybookUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "#3b82f6",
                  textDecoration: "none",
                }}
              >
                Open in Storybook →
              </a>
            </div>

            <div
              style={{
                border: "1px solid var(--kingly-border-default)",
                borderRadius: 8,
                overflow: "hidden",
                background: "transparent",
              }}
            >
              {storybookError ? (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "var(--kingly-text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                  }}
                >
                  <p style={{ marginBottom: 8 }}>
                    Storybook not available at{" "}
                    <code style={{ color: "var(--kingly-text-secondary)" }}>
                      localhost:6007
                    </code>
                  </p>
                  <p style={{ fontSize: 11 }}>
                    Run{" "}
                    <code style={{ color: "#22c55e" }}>pnpm storybook</code> to
                    start it
                  </p>
                </div>
              ) : (
                <iframe
                  src={storybookUrl}
                  title={`${component.name} - Storybook`}
                  onError={() => setStorybookError(true)}
                  style={{
                    width: "100%",
                    height: 400,
                    border: "none",
                    background: "transparent",
                  }}
                />
              )}
            </div>

            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "var(--kingly-text-muted)",
              }}
            >
              iframe: {storybookUrl}
            </div>
          </section>
        )}

        {/* ── Lanes & Markers ── */}
        {(component.lanes.length > 0 || component.markers.length > 0) &&
          !isConflict && (
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
                  color: "var(--kingly-text-secondary)",
                }}
              >
                Lanes & Markers
              </h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {component.lanes.length > 0 && (
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--kingly-text-muted)",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Lanes
                    </span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {component.lanes.map((lane) => (
                        <span key={lane} className="parity-badge">
                          {lane}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {component.markers.length > 0 && (
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--kingly-text-muted)",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Markers
                    </span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {component.markers.map((marker) => (
                        <span key={marker} className="parity-badge">
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* ── E. Manifest data (collapsible) ── */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <button
            onClick={() => setManifestExpanded(!manifestExpanded)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              border: "1px solid var(--kingly-border-default)",
              borderRadius: 10,
              background:
                "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
              color: "var(--kingly-text-secondary)",
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "border-color 160ms ease",
            }}
          >
            <span>Manifest Data</span>
            <span
              style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "var(--kingly-text-muted)",
                transform: manifestExpanded
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 200ms ease",
              }}
            >
              ▼
            </span>
          </button>

          {manifestExpanded && (
            <div
              style={{
                padding: "16px 20px",
                border: "1px solid var(--kingly-border-default)",
                borderRadius: 10,
                background:
                  "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--kingly-text-secondary)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {JSON.stringify(component, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Metric card sub-component ──────────────────────────────

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        border: "1px solid var(--kingly-border-default)",
        background: "rgba(3, 8, 12, 0.72)",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--kingly-text-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 700,
          color: "#22c55e",
        }}
      >
        {value}
      </span>
    </div>
  );
}
