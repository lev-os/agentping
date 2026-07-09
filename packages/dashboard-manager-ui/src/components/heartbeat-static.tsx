const TONE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  teal:  { color: "#2dd4bf", bg: "rgba(45,212,191,0.12)", border: "rgba(45,212,191,0.35)" },
  amber: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)" },
  rose:  { color: "#fb7185", bg: "rgba(251,113,133,0.12)", border: "rgba(251,113,133,0.35)" },
};

const PRIMITIVES_DATA = [
  { name: "Node",    icon: "◉", status: "fragmented",     tone: "amber", note: "4 competing interfaces. GraphNode (FlowMind) is richest." },
  { name: "Edge",    icon: "⟶", status: "under-specified", tone: "rose",  note: "Carries 5 conflated concerns. B4 breakthrough flagged this." },
  { name: "Loop",    icon: "↻", status: "most mature",     tone: "teal",  note: "heartbeat.ts + until.ts in core/orchestration. 3 topologies." },
  { name: "Eval",    icon: "⊘", status: "converging",      tone: "amber", note: "6 systems → converging on autoresearch as THE engine." },
  { name: "Session", icon: "◧", status: "3 types",         tone: "amber", note: "process-harness, flowmind, session-writer. Need merge." },
  { name: "Effect",  icon: "⚡", status: "missing",         tone: "rose",  note: "No first-class type. Implicit in adapters. Needs extraction." },
];

export function PrimitivesSection() {
  return (
    <section className="command-center-section">
      <div className="command-center-section__header">
        <div>
          <div className="command-center-hero__eyebrow">Graph Algebra</div>
          <h2 className="command-center-section__title">Primitives</h2>
        </div>
        <span className="command-center-section__meta">The graph algebra — 6 primitives</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {PRIMITIVES_DATA.map((p) => {
          const tc = TONE_COLORS[p.tone] ?? TONE_COLORS.amber!;
          return (
            <div key={p.name} className="command-center-frame" style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{p.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--kingly-text, #e5e7eb)" }}>{p.name}</span>
                <span style={{
                  marginLeft: "auto", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
                  fontWeight: 600, color: tc.color, padding: "2px 7px", borderRadius: 4,
                  border: `1px solid ${tc.border}`, background: tc.bg, flexShrink: 0,
                }}>{p.status}</span>
              </div>
              <div className="command-center-section__meta" style={{ margin: 0, lineHeight: 1.45, fontSize: 12 }}>
                {p.note}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const BREAKTHROUGHS = [
  { id: "B1", score: 9, title: "Gates = Loss Function",    body: "Gate design IS reward signal design. Whoever controls gates controls what the graph learns." },
  { id: "B2", score: 8, title: "Graph = Policy",           body: "Every accepted patch is a policy gradient step. The policy IS the environment." },
  { id: "B3", score: 8, title: "Bounded Speculation = GPI",body: "All three codebases implement Generalized Policy Iteration without naming it." },
  { id: "B4", score: 8, title: "Edge Under-Specified",     body: "Carries 5 conflated concerns. Will fracture the shared algebra if not resolved." },
  { id: "B5", score: 8, title: "Three Clocks Drift",       body: "Tick/wall/graph time that drift in production. Graph-time is a DAG, not a line." },
  { id: "B6", score: 8, title: "Intent Validated",         body: "Validated by every formalism's governance gap. May conflate governance + constraint + scope." },
];

export function BreakthroughCardsGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, marginBottom: 16 }}>
      {BREAKTHROUGHS.map((b) => (
        <div key={b.id} className="command-center-frame" style={{ padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 7px",
              borderRadius: 4, background: "rgba(167,139,250,0.14)", color: "#c4b5fd",
              border: "1px solid rgba(167,139,250,0.35)", flexShrink: 0,
            }}>{b.id} · {b.score}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--kingly-text, #e5e7eb)", minWidth: 0 }}>{b.title}</span>
          </div>
          <div className="command-center-section__meta" style={{ margin: 0, lineHeight: 1.45, fontSize: 12 }}>{b.body}</div>
        </div>
      ))}
    </div>
  );
}

export function DnaThesisSection() {
  return (
    <section className="command-center-section">
      <div className="command-center-section__header">
        <div>
          <div className="command-center-hero__eyebrow">System DNA</div>
          <h2 className="command-center-section__title">The Thesis</h2>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: 16,
        }}
      >
        <div
          className="command-center-frame"
          style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          <blockquote
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.45,
              color: "var(--kingly-text, #e5e7eb)",
            }}
          >
            &ldquo;Agents are dead. Sessions are dead. Swarms are meaningless.&rdquo;
          </blockquote>
          <div
            className="command-center-section__meta"
            style={{ marginTop: 12 }}
          >
            — JP, 2026-03-25
          </div>
        </div>
        <div className="command-center-frame" style={{ padding: 16 }}>
          {[
            "Update a graph node",
            "Make a proposal",
            "System accepts the proposal",
            "Graph patches itself",
            "Ralph loop manifests the update",
            "Connected nodes trickle-update",
            "Loop continues until change is real",
          ].map((step, index) => (
            <div
              key={step}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: index === 6 ? 0 : 8,
                fontSize: 13,
                color: "var(--kingly-text, #e5e7eb)",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "rgba(59,130,246,0.16)",
                  color: "#93c5fd",
                  border: "1px solid rgba(59,130,246,0.35)",
                }}
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="command-center-section__meta" style={{ marginTop: 14 }}>
        The reactive graph IS the AI. FlowMinds listen. Loops manifest. Evals
        validate.
      </p>
    </section>
  );
}

const OPEN_QUESTIONS: Array<{ num: string; title: string; description: string }> = [
  {
    num: "1",
    title: "Effect primitive",
    description:
      "What does the type look like? (git commit, file write, API call, model update, graph mutation)",
  },
  {
    num: "2",
    title: "Session merging",
    description: "Which of the 3 Session types wins? Or do they compose?",
  },
  {
    num: "3",
    title: "Node unification",
    description:
      "GraphNode is richest, but is it the right abstraction for os/ Go code?",
  },
  {
    num: "4",
    title: "Cross-language",
    description:
      "os/ is Go, Sofia is Python, Lev is TypeScript. Schema codegen? Proto?",
  },
  {
    num: "5",
    title: "Workstream vs Session",
    description: "Vernacular decision. Same thing at different timescales?",
  },
  {
    num: "6",
    title: "Graph-native editing",
    description:
      'How does "update button.yaml → auto-manifest" work at protocol level?',
  },
  {
    num: "7",
    title: "The blog node",
    description:
      'How does a FlowMind "listen" for updates and auto-research/publish?',
  },
  {
    num: "8",
    title: "CDO as cognition",
    description:
      "If CDO IS thinking, what's the training signal? How does it improve?",
  },
  {
    num: "9",
    title: "The Substack",
    description: "Constraint engineering? Autoresearch timeline? Graph-native AI?",
  },
  {
    num: "?",
    title: "What are we missing?",
    description: "What primitive is #7?",
  },
];

export function OpenQuestionsSection() {
  return (
    <section className="command-center-section">
      <div className="command-center-section__header">
        <div>
          <div className="command-center-hero__eyebrow">Unresolved</div>
          <h2 className="command-center-section__title">Open Questions</h2>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 10,
        }}
      >
        {OPEN_QUESTIONS.map((q) => (
          <div key={q.title} className="command-center-frame" style={{ padding: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  background:
                    q.num === "?"
                      ? "rgba(245,158,11,0.16)"
                      : "rgba(255,255,255,0.06)",
                  color: q.num === "?" ? "#fbbf24" : "var(--kingly-text-muted, #9ca3af)",
                  border:
                    q.num === "?"
                      ? "1px solid rgba(245,158,11,0.35)"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {q.num}
              </span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--kingly-text, #e5e7eb)",
                    marginBottom: 4,
                  }}
                >
                  {q.title}
                </div>
                <div
                  className="command-center-section__meta"
                  style={{ margin: 0, lineHeight: 1.4 }}
                >
                  {q.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
