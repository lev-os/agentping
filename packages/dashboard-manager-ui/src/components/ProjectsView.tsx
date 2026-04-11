import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface ScannedProjectEntry {
  id: string;
  name: string;
  cwd: string;
  metadata?: {
    runtime?: string;
    framework?: string;
    packageManager?: string;
    lifecycle?: "detected" | "ready";
    lane?: string;
  };
}

interface ProjectsRawResponse {
  count: number;
  entries: ScannedProjectEntry[];
}

function lifecycleColor(lifecycle: string | undefined): string {
  switch (lifecycle) {
    case "ready":
      return "#22c55e";
    case "detected":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
}

function runtimeColor(runtime: string | undefined): string {
  switch (runtime) {
    case "node":
      return "#22c55e";
    case "swift":
      return "#f97316";
    case "rust":
      return "#f59e0b";
    case "python":
      return "#3b82f6";
    case "go":
      return "#22d3ee";
    case "ruby":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export function ProjectsView() {
  const [entries, setEntries] = useState<ScannedProjectEntry[]>([]);
  const [search, setSearch] = useState("");
  const [runtimeFilter, setRuntimeFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProjects() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects/raw");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data: ProjectsRawResponse = await res.json();
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  const runtimes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) {
      const rt = e.metadata?.runtime || "unknown";
      counts.set(rt, (counts.get(rt) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const frameworksCount = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      if (e.metadata?.framework) set.add(e.metadata.framework);
    }
    return set.size;
  }, [entries]);

  const detectedCount = useMemo(
    () => entries.filter((e) => e.metadata?.lifecycle === "detected").length,
    [entries],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return entries.filter((e) => {
      if (runtimeFilter) {
        const rt = e.metadata?.runtime || "unknown";
        if (rt !== runtimeFilter) return false;
      }
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        (e.metadata?.framework?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [entries, search, runtimeFilter]);

  return (
    <div className="command-center-page">
      <div className="command-center-shell">
        {/* Header */}
        <section className="command-center-section">
          <div className="command-center-section__header">
            <div>
              <div className="command-center-hero__eyebrow">Workspace Scanner</div>
              <h1
                className="command-center-hero__title"
                style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}
              >
                Projects
              </h1>
              <p className="command-center-section__meta">
                {filtered.length} / {entries.length} project
                {entries.length === 1 ? "" : "s"}
              </p>
            </div>
            <Link to="/" className="command-center-button">
              ← Back to Command Center
            </Link>
          </div>
        </section>

        {/* Stats row */}
        <section className="command-center-stats">
          <div className="command-center-stat">
            <div className="command-center-stat__label">Total Projects</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#3b82f6" }}
            >
              {entries.length}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">Runtimes</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#22c55e" }}
            >
              {runtimes.length}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">Frameworks</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#22d3ee" }}
            >
              {frameworksCount}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">Detected</div>
            <div
              className="command-center-stat__value"
              style={{ color: "#f59e0b" }}
            >
              {detectedCount}
            </div>
          </div>
        </section>

        {/* Search + filters */}
        <section className="command-center-section">
          <div className="projects-toolbar">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, id, or framework…"
              className="projects-search"
              aria-label="Search projects"
            />
          </div>

          <div className="parity-filters">
            <button
              onClick={() => setRuntimeFilter(null)}
              className={`parity-filter${runtimeFilter === null ? " parity-filter--active" : ""}`}
            >
              All ({entries.length})
            </button>
            {runtimes.map(([rt, count]) => {
              const isActive = runtimeFilter === rt;
              return (
                <button
                  key={rt}
                  onClick={() => setRuntimeFilter(isActive ? null : rt)}
                  className={`parity-filter${isActive ? " parity-filter--active" : ""}`}
                >
                  {rt} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Body */}
        <section className="command-center-section">
          {isLoading ? (
            <div className="projects-empty">Loading projects…</div>
          ) : error ? (
            <div className="projects-empty projects-empty--error">
              <div>Failed to load projects: {error}</div>
              <button
                className="command-center-button"
                onClick={() => void loadProjects()}
                style={{ marginTop: 12 }}
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="projects-empty">No projects match your filter</div>
          ) : (
            <div className="parity-grid">
              {filtered.map((entry) => (
                <ProjectCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProjectCard({ entry }: { entry: ScannedProjectEntry }) {
  const meta = entry.metadata || {};
  const rt = meta.runtime || "unknown";
  const rtColor = runtimeColor(meta.runtime);
  const lifecycle = meta.lifecycle || "unknown";
  const lcColor = lifecycleColor(meta.lifecycle);

  return (
    <div className="parity-card" style={{ minWidth: 0 }}>
      {/* Top row: name + lifecycle dot */}
      <div className="parity-card__head">
        <span className="parity-card__title" title={entry.name}>
          {entry.name}
        </span>
        <span
          className="parity-card__health"
          title={`Lifecycle: ${lifecycle}`}
          style={{
            backgroundColor: lcColor,
            boxShadow: `0 0 6px ${lcColor}`,
          }}
        />
      </div>

      {/* Badges row */}
      <div className="parity-card__badges">
        <span
          className="parity-badge parity-badge--verdict"
          style={{
            color: rtColor,
            borderColor: `${rtColor}33`,
            background: `${rtColor}14`,
          }}
        >
          {rt}
        </span>
        {meta.framework ? (
          <span className="parity-badge">{meta.framework}</span>
        ) : null}
        {meta.packageManager ? (
          <span className="parity-badge">{meta.packageManager}</span>
        ) : null}
        <span
          className="parity-badge"
          style={{
            color: lcColor,
            borderColor: `${lcColor}33`,
          }}
        >
          {lifecycle}
        </span>
      </div>

      {/* Bottom row: id + lane */}
      <div className="parity-card__foot">
        <span className="parity-card__count" title={entry.id}>
          {entry.id}
        </span>
        {meta.lane ? (
          <span className="parity-card__date">{meta.lane}</span>
        ) : null}
      </div>
    </div>
  );
}
