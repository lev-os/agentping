import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ── Types ───────────────────────────────────────────────────

interface Cluster {
  id: string;
  key: string;
  reason: string;
  levNowElement: string | null;
  family: string | null;
  classification: string | null;
  members: string[];
  count: number;
  origins: Record<string, number>;
}

interface ClustersResponse {
  generated: string;
  total_components: number;
  total_clusters: number;
  multi_member_clusters: number;
  singleton_clusters: number;
  clusters: Cluster[];
}

interface ManifestComponent {
  id: string;
  humanDecision?: string;
  reviewStatus?: string;
}

interface Manifest {
  components: ManifestComponent[];
}

// ── Origin colour map (shared with ClusterReview) ───────────

function originColor(origin: string): string {
  switch (origin) {
    case "webui":
      return "#3b82f6";
    case "studio":
      return "#a855f7";
    case "dashboard-manager":
      return "#22d3ee";
    case "canvas":
      return "#22c55e";
    case "kingly":
      return "#fbbf24";
    case "sofia":
      return "#f97316";
    case "external":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

// ── Component ───────────────────────────────────────────────

export function ClusterList() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showSingletons, setShowSingletons] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [clusterRes, manifestRes] = await Promise.all([
          fetch("/api/components/clusters"),
          fetch("/api/components"),
        ]);
        if (!clusterRes.ok)
          throw new Error(`clusters HTTP ${clusterRes.status}`);
        if (!manifestRes.ok)
          throw new Error(`manifest HTTP ${manifestRes.status}`);
        const cData: ClustersResponse = await clusterRes.json();
        const mData: Manifest = await manifestRes.json();
        if (cancelled) return;
        setClusters(cData.clusters);
        setManifest(mData);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load clusters");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Map of component id -> review status for "needs review" badge
  const reviewById = useMemo(() => {
    const map = new Map<string, ManifestComponent>();
    if (!manifest) return map;
    for (const c of manifest.components) map.set(c.id, c);
    return map;
  }, [manifest]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return clusters
      .filter((cl) => (showSingletons ? true : cl.count > 1))
      .filter((cl) => {
        if (!q) return true;
        return (
          cl.key.toLowerCase().includes(q) ||
          cl.id.toLowerCase().includes(q) ||
          cl.reason.toLowerCase().includes(q) ||
          cl.members.some((m) => m.toLowerCase().includes(q))
        );
      })
      // Largest first — most impactful review targets
      .sort((a, b) => b.count - a.count);
  }, [clusters, search, showSingletons]);

  const totalNeedsReview = useMemo(() => {
    let n = 0;
    for (const cl of clusters) {
      if (clusterNeedsReview(cl, reviewById)) n++;
    }
    return n;
  }, [clusters, reviewById]);

  return (
    <div className="command-center-page">
      <div className="command-center-shell">
        {/* Header */}
        <section className="command-center-section">
          <div className="command-center-section__header">
            <div>
              <div className="command-center-hero__eyebrow">
                Batch Review — Theme Ratification Pipeline
              </div>
              <h1
                className="command-center-hero__title"
                style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}
              >
                Component Clusters
              </h1>
              <p className="command-center-section__meta">
                {isLoading
                  ? "Loading..."
                  : `${clusters.length} clusters (${totalNeedsReview} need review)`}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/registry" className="command-center-button">
                ← Back to Registry
              </Link>
            </div>
          </div>
        </section>

        {/* Search + toggle */}
        <section className="command-center-section">
          <div className="projects-toolbar">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clusters by key, id, or member name..."
              className="projects-search"
              aria-label="Search clusters"
            />
          </div>

          <div className="parity-filters">
            <button
              onClick={() => setShowSingletons(false)}
              className={`parity-filter${!showSingletons ? " parity-filter--active" : ""}`}
            >
              Multi-member
            </button>
            <button
              onClick={() => setShowSingletons(true)}
              className={`parity-filter${showSingletons ? " parity-filter--active" : ""}`}
            >
              All (incl. singletons)
            </button>
          </div>
        </section>

        {/* Body */}
        <section className="command-center-section">
          {isLoading ? (
            <div className="projects-empty">Loading clusters...</div>
          ) : error ? (
            <div className="projects-empty projects-empty--error">
              Failed to load clusters: {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="projects-empty">No clusters match your filter</div>
          ) : (
            <div className="parity-grid">
              {filtered.map((cl) => (
                <ClusterCard
                  key={cl.id}
                  cluster={cl}
                  needsReview={clusterNeedsReview(cl, reviewById)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── "Needs review" logic ───────────────────────────────────

function clusterNeedsReview(
  cluster: Cluster,
  reviewById: Map<string, ManifestComponent>,
): boolean {
  if (cluster.count <= 1) return false;
  for (const memberId of cluster.members) {
    const m = reviewById.get(memberId);
    if (!m || !m.humanDecision) return true;
  }
  return false;
}

// ── Cluster card ────────────────────────────────────────────

function ClusterCard({
  cluster,
  needsReview,
}: {
  cluster: Cluster;
  needsReview: boolean;
}) {
  // Compute origin bar widths
  const totalOrigin = Object.values(cluster.origins).reduce((a, b) => a + b, 0);
  const originEntries = Object.entries(cluster.origins).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <Link
      to={`/registry/cluster/${cluster.id}`}
      className="parity-card"
      style={{
        minWidth: 0,
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        borderColor: needsReview
          ? "rgba(251, 191, 36, 0.35)"
          : "var(--kingly-border-default)",
      }}
    >
      <div className="parity-card__head">
        <span className="parity-card__title" title={cluster.key}>
          {cluster.key}
        </span>
        {needsReview && (
          <span
            style={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fbbf24",
              padding: "2px 6px",
              border: "1px solid rgba(251, 191, 36, 0.35)",
              borderRadius: 4,
              background: "rgba(251, 191, 36, 0.08)",
              whiteSpace: "nowrap",
            }}
          >
            needs review
          </span>
        )}
      </div>

      <div className="parity-card__badges">
        <span
          className="parity-badge parity-badge--verdict"
          style={{
            color: "#22d3ee",
            borderColor: "rgba(34, 211, 238, 0.25)",
            background: "rgba(34, 211, 238, 0.08)",
          }}
        >
          {cluster.count} {cluster.count === 1 ? "variant" : "variants"}
        </span>
        <span className="parity-badge">{cluster.reason}</span>
      </div>

      {/* Origin bar */}
      {totalOrigin > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              display: "flex",
              height: 8,
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {originEntries.map(([origin, count]) => (
              <div
                key={origin}
                title={`${origin}: ${count}`}
                style={{
                  width: `${(count / totalOrigin) * 100}%`,
                  background: originColor(origin),
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: "var(--kingly-text-muted)",
            }}
          >
            {originEntries.map(([origin, count]) => (
              <span key={origin} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: originColor(origin),
                    display: "inline-block",
                  }}
                />
                {origin}:{count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="parity-card__foot">
        <span className="parity-card__count" title={cluster.id}>
          {cluster.id}
        </span>
        <span className="parity-card__date">
          {cluster.levNowElement ? `lev-now:${cluster.levNowElement}` : cluster.family ?? ""}
        </span>
      </div>
    </Link>
  );
}
