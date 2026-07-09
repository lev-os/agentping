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
