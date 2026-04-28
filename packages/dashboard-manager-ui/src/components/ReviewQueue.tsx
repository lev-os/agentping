import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { LevNowElement } from "@kingly/ui/components";
import { LEV_NOW_SAMPLES } from "./lev-now-samples";

// ── Types ──────────────────────────────────────────────────

interface ManifestComponent {
  id: string;
  name: string;
  family: string;
  domain: string;
  capabilities: string[];
  classification: "REAL" | "ALIAS" | "SHELL" | "HOLLOW";
  levNowElement: string | null;
  origin: string;
  source: string;
  loc: number;
  reviewStatus?: string;
  humanDecision?: string;
}

interface QueueResponse {
  total_pending: number;
  total_components: number;
  components: ManifestComponent[];
}

type Decision = "keep" | "merge" | "deprecate";

// ── Helpers ────────────────────────────────────────────────

function originColor(origin: string): string {
  switch (origin) {
    case "webui":             return "#3b82f6"; // blue
    case "studio":            return "#a855f7"; // purple
    case "dashboard-manager": return "#22d3ee"; // cyan
    case "canvas":            return "#22c55e"; // green
    case "sofia":             return "#fbbf24"; // amber
    case "external":          return "#f97316"; // orange
    default:                  return "#6b7280"; // grey
  }
}

function classificationColor(cls: string): string {
  switch (cls) {
    case "REAL":   return "#22c55e";
    case "ALIAS":  return "#3b82f6";
    case "SHELL":  return "#fbbf24";
    case "HOLLOW": return "#ef4444";
    default:       return "#6b7280";
  }
}

// ── Component ──────────────────────────────────────────────

export function ReviewQueue() {
  const [queue, setQueue] = useState<ManifestComponent[]>([]);
  const [totalPending, setTotalPending] = useState<number>(0);
  const [totalComponents, setTotalComponents] = useState<number>(0);
  const [reviewedThisSession, setReviewedThisSession] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const current = queue[0] ?? null;
  const sample = current?.levNowElement ? LEV_NOW_SAMPLES[current.levNowElement] : null;

  // Load queue
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/components/queue");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as QueueResponse;
        if (!cancelled) {
          setQueue(data.components);
          setTotalPending(data.total_pending);
          setTotalComponents(data.total_components);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  // Submit decision
  const submitDecision = useCallback(async (decision: Decision) => {
    if (!current || submitting) return;
    setSubmitting(true);
    const previousQueue = queue;
    // Optimistic: remove current
    setQueue((q) => q.slice(1));
    try {
      const res = await fetch(`/api/components/${current.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReviewedThisSession((n) => n + 1);
      setTotalPending((n) => Math.max(0, n - 1));
    } catch (e) {
      console.error("[review-queue] decision failed", e);
      setQueue(previousQueue); // rollback
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }, [current, submitting, queue]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === "k") { e.preventDefault(); void submitDecision("keep"); }
      else if (key === "m") { e.preventDefault(); void submitDecision("merge"); }
      else if (key === "d") { e.preventDefault(); void submitDecision("deprecate"); }
      else if (key === "?") { e.preventDefault(); setShowHelp((v) => !v); }
      else if (key === "escape") { setShowHelp(false); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submitDecision]);

  // ── Loading / empty / error ──

  if (isLoading) {
    return (
      <div className="command-center-page">
        <div style={{ maxWidth: 900, margin: "120px auto", padding: 32, textAlign: "center", color: "var(--kingly-text-muted)", fontFamily: "var(--font-mono)" }}>
          Loading review queue…
        </div>
      </div>
    );
  }

  if (error && queue.length === 0) {
    return (
      <div className="command-center-page">
        <div style={{ maxWidth: 900, margin: "120px auto", padding: 32, textAlign: "center" }}>
          <h1 style={{ color: "#ef4444", fontFamily: "var(--font-display)" }}>Queue load failed</h1>
          <p style={{ color: "var(--kingly-text-muted)", fontFamily: "var(--font-mono)" }}>{error}</p>
          <Link to="/registry" style={{ color: "#22d3ee" }}>← Back to Registry</Link>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="command-center-page">
        <div style={{ maxWidth: 900, margin: "120px auto", padding: 32, textAlign: "center" }}>
          <h1 style={{ color: "#22c55e", fontFamily: "var(--font-display)", fontSize: 32 }}>QUEUE CLEAR</h1>
          <p style={{ color: "var(--kingly-text-secondary)", fontFamily: "var(--font-mono)", marginTop: 16 }}>
            Reviewed {reviewedThisSession} component{reviewedThisSession !== 1 ? "s" : ""} this session.
          </p>
          <p style={{ color: "var(--kingly-text-muted)", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 8 }}>
            All {totalComponents} components have been classified and reviewed.
          </p>
          <Link to="/registry" style={{ display: "inline-block", marginTop: 24, padding: "8px 16px", border: "1px solid rgba(34, 211, 238, 0.3)", borderRadius: 6, color: "#22d3ee", textDecoration: "none", fontFamily: "var(--font-mono)" }}>
            ← Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  // ── Main ──

  return (
    <div className="command-center-page">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <Link to="/registry" style={{ padding: "6px 14px", fontSize: 12, fontFamily: "var(--font-mono)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, background: "rgba(255,255,255,0.04)", color: "var(--kingly-text-secondary)", textDecoration: "none" }}>
            ← Back to Registry
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setShowHelp((v) => !v)}
              style={{ padding: "4px 10px", fontSize: 11, fontFamily: "var(--font-mono)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, background: "rgba(255,255,255,0.04)", color: "var(--kingly-text-muted)", cursor: "pointer" }}
            >
              ? help
            </button>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
              <span style={{ color: "#22c55e" }}>{reviewedThisSession}</span>
              <span style={{ color: "var(--kingly-text-muted)" }}> reviewed · </span>
              <span style={{ color: "#22d3ee" }}>{totalPending}</span>
              <span style={{ color: "var(--kingly-text-muted)" }}> remaining</span>
            </div>
          </div>
        </div>

        {/* Help overlay */}
        {showHelp && (
          <div style={{ padding: "16px 20px", border: "1px solid rgba(34, 211, 238, 0.3)", borderRadius: 8, background: "rgba(34, 211, 238, 0.05)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--kingly-text-secondary)" }}>
            <strong style={{ color: "#22d3ee" }}>Keyboard:</strong>{" "}
            <kbd style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", borderRadius: 3, margin: "0 4px" }}>K</kbd> keep ·{" "}
            <kbd style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", borderRadius: 3, margin: "0 4px" }}>M</kbd> merge ·{" "}
            <kbd style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", borderRadius: 3, margin: "0 4px" }}>D</kbd> deprecate ·{" "}
            <kbd style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", borderRadius: 3, margin: "0 4px" }}>?</kbd> toggle help ·{" "}
            <kbd style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", borderRadius: 3, margin: "0 4px" }}>Esc</kbd> close help
          </div>
        )}

        {/* Hero card — component identity */}
        <section style={{ padding: "24px 28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: 0, color: "var(--kingly-text-primary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {current.name}
          </h1>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ padding: "3px 10px", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", background: classificationColor(current.classification) + "22", color: classificationColor(current.classification), border: `1px solid ${classificationColor(current.classification)}55`, borderRadius: 999 }}>
              {current.classification}
            </span>
            <span style={{ padding: "3px 10px", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", background: originColor(current.origin) + "22", color: originColor(current.origin), border: `1px solid ${originColor(current.origin)}55`, borderRadius: 999 }}>
              {current.origin || "unknown"}
            </span>
            <span style={{ padding: "3px 10px", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(255,255,255,0.04)", color: "var(--kingly-text-muted)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999 }}>
              {current.family}
            </span>
            {current.levNowElement && (
              <span style={{ padding: "3px 10px", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(34, 211, 238, 0.1)", color: "#22d3ee", border: "1px solid rgba(34, 211, 238, 0.3)", borderRadius: 999 }}>
                lev-now: {current.levNowElement}
              </span>
            )}
          </div>
          <p style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--kingly-text-muted)" }}>
            id: <span style={{ color: "var(--kingly-text-secondary)" }}>{current.id}</span> ·{" "}
            loc: <span style={{ color: "#22c55e" }}>{current.loc}</span> ·{" "}
            source: <span style={{ color: "var(--kingly-text-secondary)" }}>{current.source}</span>
          </p>
          <Link to={`/registry/${current.id}`} style={{ display: "inline-block", marginTop: 12, fontSize: 11, fontFamily: "var(--font-mono)", color: "#22d3ee", textDecoration: "none" }}>
            Open full detail →
          </Link>
        </section>

        {/* GenUI preview if mapped */}
        {sample && (
          <section style={{ padding: "24px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, color: "#22d3ee" }}>
              GenUI Adapter Preview — {sample.type}
            </h2>
            <div className="text-foreground" style={{ padding: 16, background: "var(--color-background, hsl(220 20% 4%))", borderRadius: 8, fontSize: 14, lineHeight: 1.6 }}>
              <LevNowElement type={sample.type} variant={sample.variant} props={sample.props} />
            </div>
          </section>
        )}

        {/* Decision buttons */}
        <section style={{ display: "flex", gap: 12, justifyContent: "center", padding: "16px 0", flexWrap: "wrap" }}>
          <DecisionButton
            label="Keep"
            shortcut="K"
            color="#22c55e"
            description="this is the canonical version"
            onClick={() => submitDecision("keep")}
            disabled={submitting}
          />
          <DecisionButton
            label="Merge"
            shortcut="M"
            color="#fbbf24"
            description="combine with another"
            onClick={() => submitDecision("merge")}
            disabled={submitting}
          />
          <DecisionButton
            label="Deprecate"
            shortcut="D"
            color="#ef4444"
            description="archive — not canonical"
            onClick={() => submitDecision("deprecate")}
            disabled={submitting}
          />
        </section>

        {/* Status hint */}
        {submitting && (
          <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--kingly-text-muted)" }}>
            saving decision…
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "#ef4444" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Subcomponents ──────────────────────────────────────────

interface DecisionButtonProps {
  label: string;
  shortcut: string;
  color: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}

function DecisionButton({ label, shortcut, color, description, onClick, disabled }: DecisionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: "1 1 180px",
        minWidth: 140,
        maxWidth: 220,
        padding: "16px 20px",
        background: `${color}15`,
        border: `1px solid ${color}55`,
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
        transition: "all 160ms ease",
        fontFamily: "var(--font-display)",
      }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget.style.background = `${color}25`); }}
      onMouseLeave={(e) => { if (!disabled) (e.currentTarget.style.background = `${color}15`); }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
        <kbd style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", borderRadius: 3, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--kingly-text-secondary)" }}>{shortcut}</kbd>
      </div>
      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--kingly-text-muted)", letterSpacing: "0.04em" }}>{description}</span>
    </button>
  );
}
