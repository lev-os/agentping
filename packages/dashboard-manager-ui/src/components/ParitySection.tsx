import { useMemo, useState } from "react";

import { getParityEntries, type ParityEntry } from "../api/parity";

type Classifier = ParityEntry["classifier"];

const FILTER_OPTIONS: { label: string; value: Classifier | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Adopted", value: "adopted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Referenced", value: "referenced-only" },
];

// ── Verdict badge colour mapping ──
function verdictColor(verdict: string): string {
  switch (verdict) {
    case "adopt":
    case "steal":
    case "integrated":
      return "#22c55e"; // green
    case "extract":
    case "build":
      return "#f59e0b"; // amber
    case "reference":
    case "coverage":
      return "#3b82f6"; // blue
    case "reject":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray
  }
}

function healthDotColor(health: ParityEntry["adoptionHealth"]): string {
  switch (health) {
    case "green":
      return "#22c55e";
    case "yellow":
      return "#fbbf24";
    case "red":
      return "#ef4444";
  }
}

function progressBarColor(percent: number): string {
  if (percent >= 80) return "#22c55e";
  if (percent >= 40) return "#f59e0b";
  return "#ef4444";
}

export function ParitySection() {
  const entries = useMemo(() => getParityEntries(), []);
  const [activeFilter, setActiveFilter] = useState<Classifier | "all">("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? entries
        : entries.filter((e) => e.classifier === activeFilter),
    [entries, activeFilter],
  );

  return (
    <section className="command-center-section">
      {/* Header */}
      <div className="command-center-section__header">
        <div>
          <h2 className="command-center-section__title">Parity Registry</h2>
          <p className="command-center-section__meta">
            {entries.length} framework{entries.length === 1 ? "" : "s"} tracked
          </p>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                border: `1px solid ${isActive ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.15)"}`,
                borderRadius: 6,
                background: isActive
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(255,255,255,0.03)",
                color: isActive ? "#22c55e" : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                transition: "all 160ms ease",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 14,
        }}
      >
        {filtered.map((entry) => (
          <ParityCard key={entry.target} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// ── Individual card ──

function ParityCard({ entry }: { entry: ParityEntry }) {
  const applicableFeatures = entry.features.filter(
    (f) => f.status !== "not-applicable",
  );
  const implementedCount = applicableFeatures.filter(
    (f) => f.status === "implemented",
  ).length;

  return (
    <div
      style={{
        padding: "18px 20px",
        border: "1px solid var(--kingly-border-default)",
        background:
          "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Top row: name + health dot */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {entry.target}
        </span>
        <span
          title={`Adoption health: ${entry.adoptionHealth}`}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: healthDotColor(entry.adoptionHealth),
            flexShrink: 0,
            boxShadow: `0 0 6px ${healthDotColor(entry.adoptionHealth)}`,
          }}
        />
      </div>

      {/* Badges row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {/* Category badge */}
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
          {entry.category}
        </span>

        {/* Verdict badge */}
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: verdictColor(entry.verdict),
            padding: "3px 8px",
            border: `1px solid ${verdictColor(entry.verdict)}33`,
            borderRadius: 4,
            background: `${verdictColor(entry.verdict)}14`,
          }}
        >
          {entry.verdict}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            width: "100%",
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${entry.implementedPercent}%`,
              height: "100%",
              borderRadius: 2,
              background: progressBarColor(entry.implementedPercent),
              transition: "width 400ms ease",
            }}
          />
        </div>
      </div>

      {/* Bottom row: feature count + date */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            color: "var(--kingly-text-secondary)",
          }}
        >
          {implementedCount}/{applicableFeatures.length} implemented
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--kingly-text-muted)",
          }}
        >
          {entry.measured_at}
        </span>
      </div>
    </div>
  );
}
