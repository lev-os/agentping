import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  fetchHeartbeat,
  fetchHeartbeatTimeline,
  type HeartbeatGit,
  type HeartbeatSnapshot,
  type HeartbeatTimeline,
  type HeartbeatTimelineTick,
  type HeartbeatWorkItem,
} from "../api/heartbeat";
import {
  BreakthroughCardsGrid,
  DnaThesisSection,
  OpenQuestionsSection,
  PrimitivesSection,
} from "./heartbeat-static";

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function isSnapshotStale(ts: string | null, generatedAt: string): boolean {
  if (!ts) return false;
  const snap = new Date(ts).getTime();
  const gen = new Date(generatedAt).getTime();
  return !Number.isNaN(snap) && !Number.isNaN(gen) && gen - snap > DAY_MS;
}

interface EvolutionEntry {
  change: string;
  type?: unknown;
  timestamp?: unknown;
  validated?: unknown;
}

function isEvolutionEntry(r: unknown): r is EvolutionEntry {
  return typeof r === "object" && r !== null && typeof (r as Record<string, unknown>).change === "string";
}

function priorityColor(priority: string): string {
  const p = priority.trim().toUpperCase();
  if (p === "P0") return "#ef4444";
  if (p === "P1") return "#f59e0b";
  return "#9ca3af";
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priorityColor(priority);
  return (
    <span style={{
      fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
      color, padding: "2px 6px", borderRadius: 4, border: `1px solid ${color}55`,
      background: `${color}18`, flexShrink: 0,
    }}>
      {priority}
    </span>
  );
}

function WorkItemRow({ item }: { item: HeartbeatWorkItem }) {
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "baseline", padding: "6px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)", minWidth: 0,
    }}>
      <PriorityBadge priority={item.priority} />
      <code style={{ fontSize: 11, color: "var(--kingly-text-muted, #9ca3af)", flexShrink: 0 }}>{item.id}</code>
      <span style={{
        fontSize: 13, color: "var(--kingly-text, #e5e7eb)", overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0,
      }} title={item.title}>{item.title}</span>
    </div>
  );
}

function Sparkline({ ticks }: { ticks: HeartbeatTimelineTick[] }) {
  const width = 600;
  const height = 80;
  const pad = 4;
  const points = useMemo(() => {
    const finite = ticks.filter((t) => Number.isFinite(t.beads_ready));
    if (finite.length < 2) return "";
    const values = finite.map((t) => t.beads_ready);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return values.map((value, index) => {
      const x = pad + (index / (values.length - 1)) * (width - pad * 2);
      const y = height - pad - ((value - min) / span) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }, [ticks]);

  if (ticks.length === 0) {
    return <div className="command-center-section__meta">No timeline ticks yet</div>;
  }
  const first = ticks[0]!.tick;
  const last = ticks[ticks.length - 1]!.tick;
  return (
    <div>
      {ticks.length < 2 ? (
        <div className="command-center-section__meta" style={{ marginBottom: 8 }}>
          Need at least 2 ticks for a sparkline
        </div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={80}
          role="img" aria-label="beads_ready sparkline" style={{ display: "block", maxWidth: 600 }}>
          <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />
        </svg>
      )}
      <div className="command-center-section__meta" style={{ marginTop: 6 }}>ticks {first}–{last}</div>
    </div>
  );
}

function ActivityColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="command-center-frame" style={{ padding: 12, minWidth: 0 }}>
      <div style={{
        fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
        color: "var(--kingly-text-muted, #9ca3af)", marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  );
}

function FileList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <div className="command-center-section__meta">{empty}</div>;
  return (
    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.6 }}>
      {items.map((name) => <li key={name} style={{ wordBreak: "break-all" }}>{name}</li>)}
    </ul>
  );
}

function GitActivity({ git }: { git: HeartbeatGit }) {
  if ("error" in git && git.error) {
    return <div className="command-center-section__meta">git unavailable: {git.error}</div>;
  }
  const commits = git.recentCommits ?? [];
  if (commits.length === 0) {
    return <div className="command-center-section__meta">No recent commits</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {commits.map((c) => (
        <div key={c.hash} style={{ fontSize: 12, minWidth: 0 }}>
          <code style={{ color: "#93c5fd", marginRight: 8 }}>{c.hash}</code>
          <span style={{ color: "var(--kingly-text, #e5e7eb)" }} title={c.message}>{c.message}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="command-center-stat">
      <div className="command-center-stat__label">{label}</div>
      <div className="command-center-stat__value" style={{ color }}>{value}</div>
    </div>
  );
}

function SourceError({ label, error }: { label: string; error: string | null }) {
  return <div className="projects-empty projects-empty--error">{label}{error ? `: ${error}` : ""}</div>;
}

function buildSubtitle(snapshot: HeartbeatSnapshot): string {
  const tickLabel = snapshot.snapshot.tick == null ? "—" : String(snapshot.snapshot.tick);
  const dateLabel = formatDate(snapshot.snapshot.timestamp);
  const stale = isSnapshotStale(snapshot.snapshot.timestamp, snapshot.generatedAt);
  return stale
    ? `snapshot from tick ${tickLabel}, ${dateLabel} — bd live refresh pending`
    : `snapshot from tick ${tickLabel}, ${dateLabel}`;
}

function SectionHeader({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="command-center-section__header">
      <h2 className="command-center-section__title">{title}</h2>
      {meta ? <span className="command-center-section__meta">{meta}</span> : null}
    </div>
  );
}

export function HeartbeatView() {
  const [snapshot, setSnapshot] = useState<HeartbeatSnapshot | null>(null);
  const [timeline, setTimeline] = useState<HeartbeatTimeline | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setSnapshotError(null);
      setTimelineError(null);
      const [snapResult, timelineResult] = await Promise.allSettled([
        fetchHeartbeat(),
        fetchHeartbeatTimeline(),
      ]);
      if (cancelled) return;
      if (snapResult.status === "fulfilled") setSnapshot(snapResult.value);
      else {
        setSnapshot(null);
        setSnapshotError(snapResult.reason instanceof Error ? snapResult.reason.message : "Failed to load heartbeat");
      }
      if (timelineResult.status === "fulfilled") setTimeline(timelineResult.value);
      else {
        setTimeline(null);
        setTimelineError(timelineResult.reason instanceof Error ? timelineResult.reason.message : "Failed to load timeline");
      }
      setIsLoading(false);
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const pulse = snapshot?.pulse;
  const readyItems = snapshot?.workQueue.readyItems.slice(0, 12) ?? [];
  const inProgressItems = snapshot?.workQueue.inProgressItems ?? [];
  const ticks = timeline?.ticks ?? [];
  const recentTicks = ticks.slice(-8).reverse();
  const briefs = snapshot?.briefs ?? [];
  const briefPreview = briefs.slice(0, 12);
  const moreBriefs = Math.max(0, briefs.length - briefPreview.length);
  const subtitle = snapshot
    ? buildSubtitle(snapshot)
    : snapshotError ? `Heartbeat unavailable: ${snapshotError}` : "No snapshot";

  return (
    <div className="command-center-page">
      <div className="command-center-shell">
        <section className="command-center-section">
          <div className="command-center-section__header">
            <div>
              <div className="command-center-hero__eyebrow">System Pulse</div>
              <h1 className="command-center-hero__title" style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}>
                Heartbeat
              </h1>
              <p className="command-center-section__meta">{isLoading ? "Loading heartbeat…" : subtitle}</p>
            </div>
            <Link to="/" className="command-center-button">← Command Center</Link>
          </div>
        </section>

        {isLoading ? (
          <section className="command-center-section">
            <div className="projects-empty">Loading heartbeat…</div>
          </section>
        ) : (
          <>
            <section className="command-center-section">
              <SectionHeader title="System Pulse" meta={snapshotError} />
              {pulse ? (
                <div className="command-center-stats">
                  <StatCard label="Ready" value={pulse.ready} color="#22c55e" />
                  <StatCard label="In Progress" value={pulse.inProgress} color="#3b82f6" />
                  <StatCard label="Closed" value={`${pulse.closed}/${pulse.total}`} color="#a78bfa" />
                  <StatCard label="Blocked" value={pulse.blocked} color="#ef4444" />
                  <StatCard label="Open" value={pulse.open} color="#f59e0b" />
                  <StatCard label="Git Changes" value={pulse.gitChanges} color="#22d3ee" />
                </div>
              ) : <SourceError label="Pulse unavailable" error={snapshotError} />}
            </section>

            <section className="command-center-section">
              <SectionHeader title="Work Queue" />
              {snapshot ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                  <div className="command-center-frame" style={{ padding: 12 }}>
                    <div className="command-center-section__meta" style={{ marginBottom: 8 }}>Ready (top {readyItems.length})</div>
                    {readyItems.length === 0
                      ? <div className="command-center-section__meta">No ready items</div>
                      : readyItems.map((item) => <WorkItemRow key={item.id} item={item} />)}
                  </div>
                  <div className="command-center-frame" style={{ padding: 12 }}>
                    <div className="command-center-section__meta" style={{ marginBottom: 8 }}>In Progress ({inProgressItems.length})</div>
                    {inProgressItems.length === 0
                      ? <div className="command-center-section__meta">No in-progress items</div>
                      : inProgressItems.map((item) => <WorkItemRow key={item.id} item={item} />)}
                  </div>
                </div>
              ) : <SourceError label="Work queue unavailable" error={snapshotError} />}
            </section>

            <section className="command-center-section">
              <SectionHeader title="Timeline" meta={timelineError} />
              {timeline ? (
                <>
                  <Sparkline ticks={ticks} />
                  <div style={{ marginTop: 12 }}>
                    {recentTicks.length === 0
                      ? <div className="command-center-section__meta">No recent ticks</div>
                      : recentTicks.map((tick) => (
                        <div key={`${tick.tick}-${tick.timestamp}`} style={{
                          display: "flex", gap: 10, alignItems: "baseline", padding: "5px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12,
                        }}>
                          <code style={{ color: "#93c5fd", flexShrink: 0 }}>#{tick.tick}</code>
                          <span className="command-center-section__meta" style={{ margin: 0, flexShrink: 0 }}>
                            {formatDate(tick.timestamp)}
                          </span>
                          <span style={{
                            color: "var(--kingly-text, #e5e7eb)", overflow: "hidden",
                            textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0,
                          }} title={tick.summary}>{tick.summary}</span>
                        </div>
                      ))}
                  </div>
                </>
              ) : <SourceError label="Timeline unavailable" error={timelineError} />}
            </section>

            <section className="command-center-section">
              <SectionHeader title="Evolution" meta={timelineError} />
              {timeline ? (() => {
                const entries = timeline.evolution
                  .filter(isEvolutionEntry)
                  .slice(-10)
                  .reverse();
                return entries.length === 0
                  ? <div className="command-center-section__meta">No evolution entries</div>
                  : entries.map((entry) => (
                    <div key={`${typeof entry.timestamp === "string" ? entry.timestamp : ""}|${entry.change}`} style={{
                      display: "flex", gap: 10, alignItems: "baseline", padding: "5px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12,
                    }}>
                      {typeof entry.type === "string" && (
                        <code style={{
                          fontSize: 10, color: "#93c5fd", padding: "1px 5px", borderRadius: 3,
                          background: "rgba(147,197,253,0.10)", border: "1px solid rgba(147,197,253,0.2)",
                          flexShrink: 0,
                        }}>{entry.type}</code>
                      )}
                      <span style={{
                        color: "var(--kingly-text, #e5e7eb)", flexGrow: 1, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0,
                      }} title={entry.change}>{entry.change}</span>
                      {typeof entry.timestamp === "string" && (
                        <span className="command-center-section__meta" style={{ margin: 0, flexShrink: 0 }}>
                          {formatDate(entry.timestamp)}
                        </span>
                      )}
                      {entry.validated === true && (
                        <span style={{ color: "#22c55e", flexShrink: 0 }} title="validated">✓</span>
                      )}
                    </div>
                  ));
              })() : <SourceError label="Evolution unavailable" error={timelineError} />}
            </section>

            <section className="command-center-section">
              <SectionHeader title="Breakthroughs & CDO" />
              <BreakthroughCardsGrid />
              {snapshot ? (
                <>
                  <div className="command-center-section__meta" style={{ marginBottom: 8 }}>CDO rounds</div>
                  {snapshot.cdoRounds.length === 0
                    ? <div className="command-center-section__meta">No CDO rounds recorded</div>
                    : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {snapshot.cdoRounds.map((round) => (
                          <span key={round} style={{
                            fontSize: 12, padding: "4px 10px", borderRadius: 999,
                            border: "1px solid rgba(167,139,250,0.35)", background: "rgba(167,139,250,0.12)",
                            color: "#c4b5fd",
                          }}>{round}</span>
                        ))}
                      </div>
                    )}
                </>
              ) : <SourceError label="CDO data unavailable" error={snapshotError} />}
            </section>

            <section className="command-center-section">
              <SectionHeader title="Activity" />
              {snapshot ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  <ActivityColumn title="Recent Commits"><GitActivity git={snapshot.git} /></ActivityColumn>
                  <ActivityColumn title="Handoffs"><FileList items={snapshot.handoffs} empty="No recent handoffs" /></ActivityColumn>
                  <ActivityColumn title="Journal"><FileList items={snapshot.journal} empty="No journal entries" /></ActivityColumn>
                </div>
              ) : <SourceError label="Activity unavailable" error={snapshotError} />}
            </section>

            <section className="command-center-section">
              <SectionHeader title="Briefs" meta={snapshot ? `${briefs.length} briefs` : undefined} />
              {snapshot ? (
                <>
                  {briefPreview.length === 0
                    ? <div className="command-center-section__meta">No briefs</div>
                    : briefPreview.map((brief) => (
                      <div key={brief.id} style={{
                        display: "flex", gap: 10, alignItems: "baseline", padding: "5px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, minWidth: 0,
                      }}>
                        <code style={{ color: "var(--kingly-text-muted, #9ca3af)", flexShrink: 0 }}>{brief.id}</code>
                        <span style={{
                          color: "var(--kingly-text, #e5e7eb)", overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0,
                        }} title={brief.title}>{brief.title}</span>
                      </div>
                    ))}
                  {moreBriefs > 0
                    ? <div className="command-center-section__meta" style={{ marginTop: 8 }}>+{moreBriefs} more</div>
                    : null}
                </>
              ) : <SourceError label="Briefs unavailable" error={snapshotError} />}
            </section>

            <DnaThesisSection />
            <OpenQuestionsSection />
            <PrimitivesSection />
          </>
        )}
      </div>
    </div>
  );
}
