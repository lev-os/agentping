import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getParityEntries, paritySlug, type ParityEntry } from "../api/parity";

type Classifier = ParityEntry["classifier"];

const FILTER_OPTIONS: { label: string; value: Classifier | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Adopted", value: "adopted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Referenced", value: "referenced-only" },
];

// ── Verdict badge colour mapping ──
function verdictColor(verdict: string): string {
  const normalized = verdict.toLowerCase();
  if (
    normalized.includes("adopt") ||
    normalized.includes("steal") ||
    normalized.includes("integrat") ||
    normalized.includes("absor")
  ) {
    return "#22c55e"; // green
  }
  if (normalized.includes("extract") || normalized.includes("build") || normalized.includes("merge")) {
    return "#f59e0b"; // amber
  }
  if (normalized.includes("reference") || normalized.includes("coverage")) {
    return "#3b82f6"; // blue
  }
  if (normalized.includes("reject") || normalized === "pass") {
    return "#ef4444"; // red
  }
  switch (verdict) {
    case "implemented":
      return "#22c55e"; // green
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

      {/* Card grid */}
      <div className="parity-grid">
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

  const verdict = verdictColor(entry.verdict);
  const health = healthDotColor(entry.adoptionHealth);

  return (
    <Link
      to={`/parity/${paritySlug(entry.target)}`}
      className="parity-card parity-card--link"
      style={{ textDecoration: "none", color: "inherit", display: "flex" }}
    >
      {/* Top row: name + health dot */}
      <div className="parity-card__head">
        <span className="parity-card__title" title={entry.target}>
          {entry.target}
        </span>
        <span
          className="parity-card__health"
          title={`Adoption health: ${entry.adoptionHealth}`}
          style={{
            backgroundColor: health,
            boxShadow: `0 0 6px ${health}`,
          }}
        />
      </div>

      {/* Badges row */}
      <div className="parity-card__badges">
        <span className="parity-badge">{entry.category}</span>
        <span
          className="parity-badge parity-badge--verdict"
          style={{
            color: verdict,
            borderColor: `${verdict}33`,
            background: `${verdict}14`,
          }}
        >
          {entry.verdict}
        </span>
      </div>

      {/* Progress bar */}
      <div className="parity-progress">
        <div
          className="parity-progress__bar"
          style={{
            width: `${entry.implementedPercent}%`,
            background: progressBarColor(entry.implementedPercent),
          }}
        />
      </div>

      {/* Bottom row: feature count + date */}
      <div className="parity-card__foot">
        <span className="parity-card__count">
          {implementedCount}/{applicableFeatures.length} implemented
        </span>
        <span className="parity-card__date">{entry.measured_at}</span>
      </div>
    </Link>
  );
}
