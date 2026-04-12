import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ── Types ───────────────────────────────────────────────────

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

// ── Filter types ────────────────────────────────────────────

type FilterKey =
  | "all"
  | "REAL"
  | "ALIAS"
  | "SHELL"
  | "HOLLOW"
  | "conflicts"
  | "lev-now";

const FILTER_OPTIONS: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "REAL", value: "REAL" },
  { label: "ALIAS", value: "ALIAS" },
  { label: "SHELL", value: "SHELL" },
  { label: "HOLLOW", value: "HOLLOW" },
  { label: "Conflicts", value: "conflicts" },
  { label: "Has lev-now mapping", value: "lev-now" },
];

// ── Colour helpers ──────────────────────────────────────────

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

// ── Component ───────────────────────────────────────────────

export function ComponentRegistry() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  async function loadManifest() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/components");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data: Manifest = await res.json();
      setManifest(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load manifest");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadManifest();
  }, []);

  const components = manifest?.components ?? [];

  // Derived counts
  const counts = useMemo(() => {
    const cls: Record<string, number> = {};
    let conflictsUnresolved = 0;
    for (const c of components) {
      cls[c.classification] = (cls[c.classification] || 0) + 1;
      if (c.id.includes("conflict") && !c.reviewStatus) {
        conflictsUnresolved++;
      }
    }
    return { cls, conflictsUnresolved };
  }, [components]);

  // Unresolved conflicts
  const unresolvedConflicts = useMemo(
    () =>
      components.filter(
        (c) => c.id.includes("conflict") && !c.reviewStatus,
      ),
    [components],
  );

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return components.filter((c) => {
      // Filter by active chip
      switch (activeFilter) {
        case "REAL":
        case "ALIAS":
        case "SHELL":
        case "HOLLOW":
          if (c.classification !== activeFilter) return false;
          break;
        case "conflicts":
          if (!c.id.includes("conflict")) return false;
          break;
        case "lev-now":
          if (!c.levNowElement) return false;
          break;
      }
      // Search
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.family.toLowerCase().includes(q) ||
        (c.levNowElement?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [components, activeFilter, search]);

  return (
    <div className="command-center-page">
      <div className="command-center-shell">
        {/* Header */}
        <section className="command-center-section">
          <div className="command-center-section__header">
            <div>
              <div className="command-center-hero__eyebrow">
                UI Component Inventory
              </div>
              <h1
                className="command-center-hero__title"
                style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}
              >
                Component Registry
              </h1>
              <p className="command-center-section__meta">
                {manifest
                  ? `${manifest.total} components classified`
                  : "Loading..."}
              </p>
            </div>
            <Link to="/" className="command-center-button">
              ← Back to Command Center
            </Link>
          </div>
        </section>

        {/* KPI row */}
        <section
          className="command-center-stats"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          <div className="command-center-stat">
            <div className="command-center-stat__label">REAL</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#22c55e" }}
            >
              {counts.cls["REAL"] ?? 0}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">ALIAS</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#3b82f6" }}
            >
              {counts.cls["ALIAS"] ?? 0}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">SHELL</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#fbbf24" }}
            >
              {counts.cls["SHELL"] ?? 0}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">HOLLOW</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#ef4444" }}
            >
              {counts.cls["HOLLOW"] ?? 0}
            </div>
          </div>
          <div
            className="command-center-stat"
            style={{
              borderColor: counts.conflictsUnresolved > 0
                ? "rgba(251, 191, 36, 0.4)"
                : undefined,
            }}
          >
            <div className="command-center-stat__label">Conflicts</div>
            <div
              className="command-center-stat__value"
              style={{
                color: counts.conflictsUnresolved > 0 ? "#fbbf24" : "#22c55e",
              }}
            >
              {counts.conflictsUnresolved}
            </div>
          </div>
        </section>

        {/* Unresolved conflicts callout */}
        {unresolvedConflicts.length > 0 && (
          <section
            className="command-center-section"
            style={{
              border: "1px solid rgba(251, 191, 36, 0.35)",
              borderRadius: 12,
              padding: 18,
              background:
                "linear-gradient(180deg, rgba(251, 191, 36, 0.06), rgba(251, 191, 36, 0.02))",
            }}
          >
            <div className="command-center-section__header">
              <div>
                <h2
                  className="command-center-section__title"
                  style={{ color: "#fbbf24" }}
                >
                  Unresolved Conflicts
                </h2>
                <p className="command-center-section__meta">
                  {unresolvedConflicts.length} conflict
                  {unresolvedConflicts.length === 1 ? "" : "s"} need
                  {unresolvedConflicts.length === 1 ? "s" : ""} a human
                  decision
                </p>
              </div>
            </div>
            <div className="parity-grid">
              {unresolvedConflicts.map((comp) => (
                <ConflictCard key={comp.id} component={comp} />
              ))}
            </div>
          </section>
        )}

        {/* Search + filters */}
        <section className="command-center-section">
          <div className="projects-toolbar">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, id, family, or lev-now element..."
              className="projects-search"
              aria-label="Search components"
            />
          </div>

          <div className="parity-filters">
            {FILTER_OPTIONS.map((opt) => {
              const isActive = activeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  className={`parity-filter${isActive ? " parity-filter--active" : ""}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Body */}
        <section className="command-center-section">
          {isLoading ? (
            <div className="projects-empty">Loading component manifest...</div>
          ) : error ? (
            <div className="projects-empty projects-empty--error">
              <div>Failed to load manifest: {error}</div>
              <button
                className="command-center-button"
                onClick={() => void loadManifest()}
                style={{ marginTop: 12 }}
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="projects-empty">
              No components match your filter
            </div>
          ) : (
            <>
              <p className="command-center-section__meta">
                Showing {filtered.length} of {components.length}
              </p>
              <div className="parity-grid">
                {filtered.map((comp) => (
                  <ComponentCard key={comp.id} component={comp} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Conflict card (amber styled) ───────────────────────────

function ConflictCard({ component }: { component: ManifestComponent }) {
  return (
    <div
      className="parity-card"
      style={{
        borderColor: "rgba(251, 191, 36, 0.35)",
        background:
          "linear-gradient(180deg, rgba(251, 191, 36, 0.08), rgba(251, 191, 36, 0.03))",
      }}
    >
      <div className="parity-card__head">
        <span className="parity-card__title" title={component.name}>
          {component.name}
        </span>
        <span
          style={{
            fontSize: 16,
            lineHeight: 1,
            filter: "grayscale(0)",
          }}
          title="Unresolved conflict"
        >
          &#9888;
        </span>
      </div>

      <div className="parity-card__badges">
        <span
          className="parity-badge parity-badge--verdict"
          style={{
            color: "#fbbf24",
            borderColor: "rgba(251, 191, 36, 0.3)",
            background: "rgba(251, 191, 36, 0.1)",
          }}
        >
          conflict
        </span>
        <span className="parity-badge">{component.family}</span>
      </div>

      {component.capabilities.length > 0 && (
        <div className="parity-card__badges">
          {component.capabilities.map((cap) => (
            <span key={cap} className="parity-badge">
              {cap}
            </span>
          ))}
        </div>
      )}

      <div className="parity-card__foot">
        <span className="parity-card__count">{component.id}</span>
        <span className="parity-card__date">{component.domain}</span>
      </div>
    </div>
  );
}

// ── Standard component card ─────────────────────────────────

function ComponentCard({ component }: { component: ManifestComponent }) {
  const clsColor = classificationColor(component.classification);

  return (
    <div className="parity-card" style={{ minWidth: 0 }}>
      {/* Top row: name + review status */}
      <div className="parity-card__head">
        <span className="parity-card__title" title={component.name}>
          {component.name}
        </span>
        {component.reviewStatus === "canonical" && (
          <span
            title="Canonical"
            style={{ fontSize: 14, lineHeight: 1, color: "#fbbf24" }}
          >
            &#9733;
          </span>
        )}
        {component.reviewStatus === "reviewed" && (
          <span
            title="Reviewed"
            style={{ fontSize: 14, lineHeight: 1, color: "#22c55e" }}
          >
            &#10003;
          </span>
        )}
      </div>

      {/* Classification badge + family */}
      <div className="parity-card__badges">
        <span
          className="parity-badge parity-badge--verdict"
          style={{
            color: clsColor,
            borderColor: `${clsColor}33`,
            background: `${clsColor}14`,
          }}
        >
          {component.classification}
        </span>
        <span className="parity-badge">{component.family}</span>
      </div>

      {/* Capabilities as small tags */}
      {component.capabilities.length > 0 && (
        <div className="parity-card__badges">
          {component.capabilities.map((cap) => (
            <span key={cap} className="parity-badge">
              {cap}
            </span>
          ))}
        </div>
      )}

      {/* lev-now element mapping */}
      {component.levNowElement && (
        <div className="parity-card__badges">
          <span
            className="parity-badge parity-badge--verdict"
            style={{
              color: "#22d3ee",
              borderColor: "rgba(34, 211, 238, 0.2)",
              background: "rgba(34, 211, 238, 0.08)",
            }}
          >
            lev-now: {component.levNowElement}
          </span>
        </div>
      )}

      {/* Bottom row: id + domain */}
      <div className="parity-card__foot">
        <span className="parity-card__count" title={component.id}>
          {component.id}
        </span>
        <span className="parity-card__date">{component.domain}</span>
      </div>
    </div>
  );
}
