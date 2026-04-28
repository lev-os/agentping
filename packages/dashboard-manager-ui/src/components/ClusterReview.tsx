import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
  canonical?: boolean | string;
}

interface ClusterDetailResponse {
  cluster: Cluster;
  members: Array<ManifestComponent | { id: string; _missing: true }>;
}

// ── Helpers ────────────────────────────────────────────────

const STORYBOOK_BASE = "http://localhost:6007";

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

// Reuse the multi-needle lookup pattern from ComponentDetail
async function loadStorybookIndex(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch("/storybook-api/index.json");
    if (!res.ok) return null;
    const data = await res.json();
    return (data.entries ?? data.stories ?? null) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

function findStoryIdFromIndex(
  entries: Record<string, unknown>,
  componentName: string,
  manifestId: string,
): string | null {
  const defaultStories = Object.keys(entries).filter((k) =>
    k.endsWith("--default"),
  );
  const needles = [
    manifestId.toLowerCase().replace(/[-_\s]/g, ""),
    componentName.toLowerCase().replace(/[-_\s]/g, ""),
    componentName
      .replace(/(Canonical|Conflict|Migrated)$/i, "")
      .toLowerCase()
      .replace(/[-_\s]/g, ""),
  ];
  const uniqueNeedles = [...new Set(needles)].filter((n) => n.length > 0);
  for (const needle of uniqueNeedles) {
    const candidates = defaultStories.filter((k) =>
      k.replace(/[-_]/g, "").toLowerCase().includes(needle),
    );
    if (candidates.length > 0) {
      candidates.sort((a, b) => a.length - b.length);
      return candidates[0].replace("--default", "");
    }
  }
  return null;
}

function buildStorybookUrl(storyId: string): string {
  return `${STORYBOOK_BASE}/iframe.html?id=${storyId}--default&viewMode=story`;
}

// ── Component ──────────────────────────────────────────────

export function ClusterReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ClusterDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyMap, setStoryMap] = useState<Record<string, string | null>>({});
  const [canonicalId, setCanonicalId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Load cluster + members
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/components/clusters/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload: ClusterDetailResponse = await res.json();
        if (cancelled) return;
        setData(payload);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load cluster");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Resolve storybook story ids once we have members
  useEffect(() => {
    let cancelled = false;
    if (!data) return;
    (async () => {
      const entries = await loadStorybookIndex();
      if (cancelled) return;
      const map: Record<string, string | null> = {};
      for (const m of data.members) {
        if ("_missing" in m) {
          map[m.id] = null;
          continue;
        }
        if (!entries) {
          map[m.id] = null;
          continue;
        }
        map[m.id] = findStoryIdFromIndex(entries, m.name, m.id);
      }
      if (!cancelled) setStoryMap(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [data]);

  const cluster = data?.cluster ?? null;
  const members = useMemo(() => data?.members ?? [], [data]);

  // Keyboard shortcuts (1-9 select, Enter submit, Esc cancel)
  const handleSubmit = useCallback(async () => {
    if (!canonicalId || !cluster || submitting) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const rejected = cluster.members.filter((mid) => mid !== canonicalId);
      const res = await fetch(`/api/components/clusters/${cluster.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canonical_id: canonicalId,
          rejected_ids: rejected,
          merge_into: {},
          reason: `Batch review via ClusterReview UI`,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }
      setSubmitResult(`Decision recorded. Canonical: ${canonicalId}`);
      // Re-fetch so sidecar state is reflected
      const refreshed = await fetch(`/api/components/clusters/${cluster.id}`);
      if (refreshed.ok) setData(await refreshed.json());
    } catch (e) {
      setSubmitResult(
        e instanceof Error ? `Error: ${e.message}` : "Submit failed",
      );
    } finally {
      setSubmitting(false);
    }
  }, [canonicalId, cluster, submitting]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if (e.key === "Escape") {
        navigate("/registry/clusters");
        return;
      }
      if (e.key === "Enter" && canonicalId) {
        e.preventDefault();
        void handleSubmit();
        return;
      }
      // Digit 1-9 selects that variant as canonical
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (members[idx] && !("_missing" in members[idx])) {
          setCanonicalId((members[idx] as ManifestComponent).id);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canonicalId, members, navigate, handleSubmit]);

  if (isLoading) {
    return (
      <div className="command-center-page">
        <div className="command-center-detail">
          <div className="projects-empty">Loading cluster...</div>
        </div>
      </div>
    );
  }

  if (error || !cluster) {
    return (
      <div className="command-center-page">
        <div className="command-center-detail">
          <Link to="/registry/clusters" className="command-center-button">
            ← Back to Clusters
          </Link>
          <div className="projects-empty projects-empty--error">
            {error ?? `Cluster ${id} not found`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="command-center-page">
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "24px 20px 160px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Link
            to="/registry/clusters"
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
            }}
          >
            ← Back to Clusters
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {cluster.key}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--kingly-text-muted)",
              margin: 0,
            }}
          >
            Pick canonical for {cluster.count} {cluster.count === 1 ? "variant" : "variants"}{" "}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                padding: "2px 8px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4,
                marginLeft: 8,
              }}
            >
              keys: 1-9 select · Enter submit · Esc cancel
            </span>
          </p>
        </div>

        {/* Grid of mini-cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
          className="cluster-review-grid"
        >
          {members.map((m, idx) => {
            if ("_missing" in m) {
              return (
                <div
                  key={m.id}
                  style={{
                    border: "1px dashed rgba(239, 68, 68, 0.35)",
                    borderRadius: 10,
                    padding: 16,
                    background: "rgba(239, 68, 68, 0.04)",
                    color: "var(--kingly-text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  <div>missing manifest: {m.id}</div>
                </div>
              );
            }
            const selected = canonicalId === m.id;
            const storyId = storyMap[m.id];
            return (
              <MemberCard
                key={m.id}
                index={idx}
                member={m}
                storyId={storyId}
                selected={selected}
                onSelect={() => setCanonicalId(m.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "14px 20px",
          borderTop: "1px solid var(--kingly-border-default)",
          background:
            "linear-gradient(180deg, rgba(12,16,20,0.97), rgba(8,11,14,0.97))",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--kingly-text-secondary)",
          }}
        >
          {canonicalId ? (
            <>
              <span style={{ color: "#22c55e" }}>✓</span> Canonical:{" "}
              <code>{canonicalId}</code>{" "}
              <span style={{ color: "var(--kingly-text-muted)" }}>
                ({cluster.members.length - 1} others will be deprecated)
              </span>
            </>
          ) : (
            <span style={{ color: "var(--kingly-text-muted)" }}>
              Pick a canonical variant (click card or press 1-9)
            </span>
          )}
          {submitResult && (
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: submitResult.startsWith("Error")
                  ? "#ef4444"
                  : "#22c55e",
              }}
            >
              {submitResult}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate("/registry/clusters")}
            className="command-center-button"
          >
            Cancel (Esc)
          </button>
          <button
            ref={submitRef}
            onClick={() => void handleSubmit()}
            disabled={!canonicalId || submitting}
            className="command-center-button"
            style={{
              background: canonicalId
                ? "rgba(34, 197, 94, 0.16)"
                : "rgba(255,255,255,0.03)",
              borderColor: canonicalId
                ? "rgba(34, 197, 94, 0.4)"
                : "var(--kingly-border-default)",
              color: canonicalId ? "#22c55e" : "var(--kingly-text-muted)",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Submit decision (Enter)"}
          </button>
        </div>
      </div>

      {/* Mobile stacking */}
      <style>{`
        @media (max-width: 600px) {
          .cluster-review-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Member mini-card ───────────────────────────────────────

function MemberCard({
  index,
  member,
  storyId,
  selected,
  onSelect,
}: {
  index: number;
  member: ManifestComponent;
  storyId: string | null | undefined;
  selected: boolean;
  onSelect: () => void;
}) {
  const oc = originColor(member.origin);
  const cc = classificationColor(member.classification);
  const shortcut = index < 9 ? `${index + 1}` : null;

  const storyUrl = storyId ? buildStorybookUrl(storyId) : null;
  const alreadyReviewed =
    member.reviewStatus === "reviewed" ||
    member.reviewStatus === "absorbed" ||
    member.reviewStatus === "deprecated";

  return (
    <div
      onClick={onSelect}
      style={{
        border: `1px solid ${selected ? "rgba(34, 197, 94, 0.6)" : "var(--kingly-border-default)"}`,
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        background: selected
          ? "rgba(34, 197, 94, 0.04)"
          : "rgba(12,16,20,0.6)",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 160ms ease, background 160ms ease",
      }}
    >
      {/* Head */}
      <div
        style={{
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
          }}
        >
          {shortcut && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "2px 6px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 4,
                color: "var(--kingly-text-muted)",
                flexShrink: 0,
              }}
              title={`Press ${shortcut} to select`}
            >
              {shortcut}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={member.name}
          >
            {member.name}
          </span>
        </div>
        <label
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: selected ? "#22c55e" : "var(--kingly-text-muted)",
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="canonical-pick"
            checked={selected}
            onChange={onSelect}
            style={{ accentColor: "#22c55e" }}
          />
          canonical
        </label>
      </div>

      {/* Chips */}
      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: oc,
            padding: "2px 6px",
            border: `1px solid ${oc}33`,
            borderRadius: 4,
            background: `${oc}14`,
          }}
        >
          {member.origin}
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: cc,
            padding: "2px 6px",
            border: `1px solid ${cc}33`,
            borderRadius: 4,
            background: `${cc}14`,
          }}
        >
          {member.classification}
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            color: "var(--kingly-text-muted)",
            padding: "2px 6px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
          }}
        >
          {member.loc} LOC
        </span>
        {alreadyReviewed && (
          <span
            style={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#22d3ee",
              padding: "2px 6px",
              border: "1px solid rgba(34, 211, 238, 0.25)",
              borderRadius: 4,
              background: "rgba(34, 211, 238, 0.08)",
            }}
            title={`reviewStatus=${member.reviewStatus}, decision=${member.humanDecision}`}
          >
            {member.reviewStatus}
          </span>
        )}
      </div>

      {/* Storybook iframe */}
      <div
        style={{
          height: 240,
          background: "var(--color-background, hsl(220 20% 4%))",
          position: "relative",
        }}
      >
        {storyId === undefined ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--kingly-text-muted)",
            }}
          >
            Resolving story...
          </div>
        ) : storyUrl ? (
          <iframe
            src={storyUrl}
            title={`${member.name} — Storybook`}
            style={{ width: "100%", height: "100%", border: "none" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--kingly-text-muted)",
              padding: 12,
              textAlign: "center",
            }}
          >
            <span>no story</span>
            <Link
              to={`/registry/${member.id}`}
              style={{
                fontSize: 11,
                color: "#3b82f6",
                textDecoration: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              open detail →
            </Link>
          </div>
        )}
      </div>

      {/* Source path footer */}
      <div
        style={{
          padding: "6px 12px",
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: "var(--kingly-text-muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={member.source}
      >
        {member.source}
      </div>
    </div>
  );
}
