import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getParityEntries,
  type ParityEntry,
  type ParityFeature,
} from "../api/parity";

// ── Color helpers ──

function verdictColor(verdict: string): string {
  switch (verdict) {
    case "adopt":
    case "steal":
    case "integrated":
      return "#22c55e";
    case "extract":
    case "build":
      return "#f59e0b";
    case "reference":
    case "coverage":
      return "#3b82f6";
    case "reject":
      return "#ef4444";
    default:
      return "#6b7280";
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

function statusColor(status: ParityFeature["status"]): string {
  switch (status) {
    case "implemented":
      return "#22c55e";
    case "partial":
      return "#f59e0b";
    case "missing":
      return "#ef4444";
    case "not-applicable":
      return "#6b7280";
  }
}

// ── Component ──

export function ParityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const entries = useMemo(() => getParityEntries(), []);
  const entry = useMemo(
    () =>
      entries.find(
        (e) => e.target.toLowerCase() === (id ?? "").toLowerCase(),
      ),
    [entries, id],
  );

  if (!entry) {
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
            Parity entry not found
          </h1>
          <p
            style={{
              color: "var(--kingly-text-muted)",
              marginBottom: 24,
            }}
          >
            No parity registry entry matches <code>{id}</code>.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: 6,
              background: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              cursor: "pointer",
            }}
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const applicableFeatures = entry.features.filter(
    (f) => f.status !== "not-applicable",
  );
  const implementedCount = applicableFeatures.filter(
    (f) => f.status === "implemented",
  ).length;

  const health = healthDotColor(entry.adoptionHealth);
  const vColor = verdictColor(entry.verdict);

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
        <button
          onClick={() => navigate("/")}
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
            cursor: "pointer",
            transition: "all 160ms ease",
          }}
        >
          ← Back
        </button>

        {/* Hero */}
        <section
          style={{
            padding: "28px 32px",
            border: "1px solid var(--kingly-border-default)",
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {entry.target}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
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
                    color: vColor,
                    padding: "3px 8px",
                    border: `1px solid ${vColor}33`,
                    borderRadius: 4,
                    background: `${vColor}14`,
                  }}
                >
                  {entry.verdict}
                </span>
                {/* Classifier */}
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
                  {entry.classifier}
                </span>
                {entry.priority && (
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
                    {entry.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Health indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              title={`Adoption health: ${entry.adoptionHealth}`}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: health,
                  boxShadow: `0 0 8px ${health}`,
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
                {entry.adoptionHealth}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "var(--kingly-text-secondary)",
              }}
            >
              <span>
                {implementedCount} / {applicableFeatures.length} features
                implemented
              </span>
              <span>{entry.implementedPercent}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${entry.implementedPercent}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: progressBarColor(entry.implementedPercent),
                  transition: "width 400ms ease",
                }}
              />
            </div>
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
              <span style={{ opacity: 0.6 }}>measured: </span>
              <span>{entry.measured_at}</span>
            </div>
            {entry.owner && (
              <div>
                <span style={{ opacity: 0.6 }}>owner: </span>
                <span>{entry.owner}</span>
              </div>
            )}
            <div>
              <span style={{ opacity: 0.6 }}>repo: </span>
              {entry.repo.startsWith("http") ? (
                <a
                  href={entry.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3b82f6",
                    textDecoration: "none",
                  }}
                >
                  {entry.repo}
                </a>
              ) : (
                <span>{entry.repo}</span>
              )}
            </div>
          </div>
        </section>

        {/* Metrics */}
        {entry.metrics && entry.metrics.length > 0 && (
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
              Metrics
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {entry.metrics.map((metric) => (
                <div
                  key={metric.name}
                  style={{
                    padding: "14px 16px",
                    border: "1px solid var(--kingly-border-default)",
                    background:
                      "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
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
                    {metric.name.replace(/_/g, " ")}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#22c55e",
                      }}
                    >
                      {metric.value}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        color: "var(--kingly-text-muted)",
                      }}
                    >
                      {metric.unit}
                    </span>
                  </div>
                  {metric.source && (
                    <a
                      href={metric.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 10,
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontFamily: "var(--font-mono)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={metric.source}
                    >
                      source
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features table */}
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
            Features ({entry.features.length})
          </h2>
          <div
            style={{
              border: "1px solid var(--kingly-border-default)",
              borderRadius: 10,
              background:
                "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
              overflow: "hidden",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "rgba(8,11,14,0.98)",
                  zIndex: 1,
                }}
              >
                <tr>
                  {["ID", "Name", "Status", "Lev Equivalent", "Action", "Notes"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 14px",
                          textAlign: "left",
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontFamily: "var(--font-mono)",
                          color: "var(--kingly-text-muted)",
                          fontWeight: 600,
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {entry.features.map((f, i) => {
                  const sColor = statusColor(f.status);
                  return (
                    <tr
                      key={f.id}
                      style={{
                        borderBottom:
                          i < entry.features.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "none",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 14px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--kingly-text-muted)",
                          whiteSpace: "nowrap",
                          verticalAlign: "top",
                        }}
                      >
                        {f.id}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: "var(--kingly-text-primary)",
                          minWidth: 180,
                          verticalAlign: "top",
                        }}
                      >
                        {f.name}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 10,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: sColor,
                            padding: "2px 7px",
                            border: `1px solid ${sColor}44`,
                            borderRadius: 3,
                            background: `${sColor}14`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--kingly-text-secondary)",
                          verticalAlign: "top",
                        }}
                      >
                        {f.lev_equivalent}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--kingly-text-secondary)",
                          verticalAlign: "top",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.action}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: "var(--kingly-text-muted)",
                          fontSize: 11,
                          lineHeight: 1.5,
                          minWidth: 240,
                          verticalAlign: "top",
                        }}
                      >
                        {f.notes ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lineage */}
        {entry.lineage && entry.lineage.length > 0 && (
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
              Lineage / Prior Art
            </h2>
            <div
              style={{
                padding: "16px 20px",
                border: "1px solid var(--kingly-border-default)",
                background:
                  "linear-gradient(180deg, rgba(12,16,20,0.95), rgba(8,11,14,0.92))",
                borderRadius: 10,
              }}
            >
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {entry.lineage.map((l) => (
                  <li
                    key={l}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--kingly-text-secondary)",
                    }}
                  >
                    <span style={{ color: "var(--kingly-text-muted)" }}>→ </span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
