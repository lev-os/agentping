# Next 10 Moves — AgentPing as Next-Gen Agent Platform

> Strategic analysis after reviewing the Rust runtime crates, TypeScript core, docs, .lev/ artifacts, and handoffs.
> Date: 2026-03-03

---

## Where We Are

AgentPing has two layers coming together:

**TypeScript layer** (mature, production-facing):
- Hexagonal core with 12 ping types, Zod-validated domain models, 15+ packages
- Electron Studio, web UI, MCP adapter, CLI, Slack/webhook channels
- 327-component UI library migration in progress (4-theme system)
- Architectural review scored 5.4/10 — strong vision, significant implementation debt
- 11 of 15 packages have zero tests, no CI/CD, PingService god class

**Rust layer** (new, 9 crates from recent work):
- `lev-kernel` — constraint manifold (C1-C5), ratchet admission, hash-chained tape, NAPI-RS bridge
- `lev-entity-graph` — entity+claim+link with bi-temporal fields, 8 entity types, L0-L3 depth
- `lev-supervisor` — DAG-ordered boot, 10 daemon phases, circuit breaker
- `lev-mcp` — MCP server/client, stdio/channel transports, tool registry
- `lev-memory-engine` — 5-tier memory, exponential decay, RRF fusion, workspace routing
- `lev-flowmind-compiler` — YAML→IR→targets, pure next() executor (WASM-portable)
- `lev-abac` — policy sets with combining algorithms, time-bounded leases
- `lev-logger` — structured tracing
- `forge-core` — stacked PR model, VCS/forge adapter traits

Plus 9 copilot review fixes (Clone derives, error propagation, glob-match, streaming JSONL, frame buffering, cycle detection).

**154 Rust tests passing. 75 files, 7,250 lines.**

---

## The Strategic Gap

The TypeScript layer owns the **interaction surface** (pings, UI, channels). The Rust layer owns the **runtime substrate** (memory, policy, workflow execution, supervision). But they don't yet compose into a single coherent platform. The bridge is a NAPI-RS stub in `lev-kernel`.

An agent platform isn't just an interaction protocol OR a runtime — it's the integration of both. The next 10 moves should close this gap while hardening what exists.

---

## The 10 Moves

### Move 1: NAPI-RS Bridge — Make Rust the Daemon's Engine

**What:** Complete the NAPI-RS bridge from `lev-kernel` so the TypeScript daemon can call into the Rust runtime. The daemon becomes a thin orchestrator; Rust handles memory, policy, supervision, and workflow execution.

**Why first:** Every other move depends on TS↔Rust interop working. The bridge exists as a stub — complete it.

**Concretely:**
- Expose `lev-supervisor` boot phases to the daemon's startup sequence
- Expose `lev-memory-engine` as the backing store for session/agent context
- Expose `lev-abac` policy checks on ping submission and response
- Expose `lev-kernel` constraint checks (C1-C5) as middleware in the HTTP API
- Ship as `@agentping/native` npm package with prebuilt binaries (linux-x64, darwin-arm64, darwin-x64)

**Risk:** NAPI-RS build complexity. Mitigate with `napi-rs/package-template` and CI matrix builds.

---

### Move 2: Workflow Execution Runtime — FlowMind Goes Live

**What:** Wire `lev-flowmind-compiler` into the platform as the agent workflow engine. Agents define workflows in YAML; FlowMind compiles to IR; the runtime executes steps, emitting pings at human-in-the-loop checkpoints.

**Why:** This is the killer feature. Today agents send individual pings — isolated questions. With FlowMind, agents submit entire workflows where pings are just checkpoint nodes. The platform owns execution state, retry, and resumption.

**Concretely:**
- Add a `workflow` ping type alongside the existing 12 types
- FlowMind `next()` iterator drives execution; human checkpoints yield pings
- Workflow state persists in `lev-memory-engine` (tier-3: session memory)
- Studio/web-ui gets a workflow timeline view showing completed/pending/blocked steps
- WASM target enables browser-side workflow preview (dry-run without execution)

**Dependency:** Move 1 (NAPI bridge for runtime access).

---

### Move 3: Entity Graph as the World Model

**What:** Promote `lev-entity-graph` from a standalone crate to the platform's shared world model. Every agent, workspace, session, tool, and artifact becomes an entity with bi-temporal claims and typed links.

**Why:** Agent platforms that don't have a world model force every agent to reconstruct context from scratch. The entity graph gives agents a shared, queryable, temporally-aware knowledge base.

**Concretely:**
- 8 entity types (Agent, Workspace, Session, Tool, Artifact, Human, Policy, Workflow) become first-class
- Claims are bi-temporal (valid_from/valid_to + recorded_at) — agents can reason about "what was true when"
- L0-L3 depth traversal lets agents explore context at different granularities
- Expose via MCP tools: `entity.query`, `entity.claim`, `entity.link`, `entity.history`
- The TypeScript `Ping` entity maps to an Entity Graph node — pings get temporal history for free

**Dependency:** Move 1 (NAPI bridge).

---

### Move 4: ABAC Policy Layer — Authorization That Agents Understand

**What:** Wire `lev-abac` into every interaction boundary. Policy sets with combining algorithms (deny-overrides, permit-overrides, first-applicable) gate what agents can do, what humans can approve, and what workflows can execute.

**Why:** The current system has no authorization model. CORS defaults to `['*']`. Any agent can submit any ping. Any human can respond to any ping. This is the #1 blocker to multi-tenant or enterprise deployment.

**Concretely:**
- Every ping submission runs through ABAC: `can(agent, submit, ping_type, context)`
- Every response runs through ABAC: `can(human, respond, ping_id, context)`
- Time-bounded leases (already in `lev-abac`) replace the current `lease_request` ping type's ad-hoc grant mechanism
- Policy sets are workspace-scoped and hot-reloadable
- Default policy: deny-all with explicit grants — safe by default
- Studio gets a policy editor (YAML with syntax highlighting)

**Dependency:** Move 1 (NAPI bridge), partially Move 3 (entities as policy subjects/resources).

---

### Move 5: CI/CD + Cross-Language Test Harness

**What:** Build the CI pipeline that validates both TypeScript and Rust in a single workflow. This is the existing Top 10 improvement #2, extended to cover the Rust crates.

**Why:** 154 Rust tests + ~220 TS tests are useless if they don't run on every PR. The two-language nature of the platform means CI must build Rust, produce NAPI binaries, then run TS tests against them.

**Concretely:**
- GitHub Actions workflow: `cargo test --workspace` → `napi build` → `pnpm -r build` → `pnpm test` → `playwright e2e`
- Cargo workspace coverage with `cargo-llvm-cov`, TS coverage with Vitest
- Combined coverage gate: 70% Rust, 60% TS (raises over time)
- Integration test suite: submit workflow via MCP → Rust runtime executes → ping emitted → TS API delivers → response returns → workflow resumes
- Turbo caching for TS packages (existing Top 10 #5)

**Dependency:** Move 1 (NAPI bridge must build in CI).

---

### Move 6: Memory-Aware Agent Context

**What:** Wire `lev-memory-engine` as the agent context provider. The 5-tier memory system (sensory → working → session → semantic → episodic) gives agents persistent, decaying, fusable memory across sessions.

**Why:** The current system is stateless per-ping. An agent asking a question has no memory of previous interactions. Memory-aware context transforms AgentPing from a "question answering terminal" into a "relationship with an agent."

**Concretely:**
- Tier 1 (sensory): current ping + immediate context, auto-expires
- Tier 2 (working): active session state, workflow progress
- Tier 3 (session): conversation history for this session
- Tier 4 (semantic): learned facts about this workspace/project (extracted from responses)
- Tier 5 (episodic): cross-session patterns ("user always approves low-risk file changes")
- Exponential decay prevents unbounded growth — old memories fade unless reinforced
- RRF fusion combines memory tiers when building agent context
- MCP tools: `memory.recall`, `memory.store`, `memory.forget`

**Dependency:** Move 1 (NAPI bridge), Move 3 (entities store memory anchors).

---

### Move 7: Supervisor-Managed Multi-Agent Orchestration

**What:** Use `lev-supervisor` to manage multiple concurrent agent sessions with DAG-ordered dependencies, circuit breakers, and graceful degradation.

**Why:** Today's daemon manages a flat pool of sessions. Real agent workflows involve multiple agents collaborating — a research agent feeding a coding agent feeding a review agent. The supervisor provides the orchestration backbone.

**Concretely:**
- 10 daemon phases (init → config → storage → policy → memory → entities → workflows → agents → api → ready) become the real boot sequence
- Circuit breaker patterns prevent cascading failures when one agent's tool calls fail
- DAG-ordered boot ensures storage is ready before agents start, policy is loaded before workflows execute
- Agent-to-agent communication via the entity graph (Move 3) rather than direct coupling
- Health check API exposes supervisor state for Studio's system health view
- Graceful shutdown drains in-flight workflows before terminating

**Dependency:** Move 1 (NAPI bridge), Move 3 (entity graph for agent registry).

---

### Move 8: Stacked PR Forge Integration

**What:** Wire `forge-core` into the platform so agent coding workflows can manage stacked PRs natively. The VCS/forge adapter traits allow plugging in GitHub, GitLab, or local git.

**Why:** The most common agent workflow today is: code something → create PR → get review → iterate. Stacked PRs let agents break large changes into reviewable chunks with dependency tracking. This is the "developer agent" killer feature.

**Concretely:**
- `forge-core` stacked PR model becomes a workflow template in FlowMind
- Each stack level is a human-in-the-loop checkpoint (review_request ping)
- Studio gets a PR stack visualization (vertical timeline with diff stats per level)
- GitHub adapter: `gh` CLI or API for PR creation, status checks, merge
- Entity graph tracks PR→commit→file→review relationships
- Agent can submit a 5-PR stack as a single workflow; humans review level by level

**Dependency:** Move 2 (FlowMind for workflow execution), Move 3 (entity graph for PR tracking).

---

### Move 9: WASM Runtime for Edge & Browser Execution

**What:** Compile the Rust crates to WASM targets for browser-side and edge execution. `lev-flowmind-compiler` is already designed as WASM-portable with its pure `next()` iterator.

**Why:** The platform currently requires a running daemon. WASM unlocks: (a) browser-only mode for demos and development, (b) Cloudflare Workers / Deno Deploy for serverless, (c) mobile via embedded WASM runtime.

**Concretely:**
- `lev-flowmind-compiler` → `wasm32-unknown-unknown` for browser workflow preview
- `lev-abac` → WASM for client-side policy pre-validation (fail fast before network round-trip)
- `lev-entity-graph` → WASM for offline entity browsing
- `lev-kernel` constraint checks → WASM for client-side validation
- Published as `@agentping/wasm` npm package with tree-shakeable exports
- Studio embeds WASM for offline workflow editing and policy simulation

**Dependency:** Moves 2, 4 (FlowMind and ABAC must be stable before porting to WASM).

---

### Move 10: Open Protocol Specification + Adapter SDK

**What:** Publish the AgentPing protocol as a formal specification with an adapter SDK that lets any surface (iOS, Android, VS Code, Telegram, Discord) render pings and collect responses.

**Why:** This is the north-star from the architecture doc: "Any app should be able to install AgentPing and quickly ship an adapter that renders AgentPing primitives in its native UI framework." The Rust crates provide the runtime; the protocol spec provides the contract; the adapter SDK provides the on-ramp.

**Concretely:**
- Protocol spec: JSON Schema for all 13 ping types (12 existing + workflow), response types, enrichment types
- Adapter SDK: TypeScript package `@agentping/adapter-sdk` with base classes and type guards
- Adapter contract: implement `render(ping) → UI`, `collect() → HumanResponse`, `notify(event) → void`
- Reference adapters: web (existing), CLI (existing), Slack (existing), plus new iOS/SwiftUI starter
- WASM adapter helper (Move 9) for platforms that can embed a runtime
- Protocol versioning: semver with breaking change policy

**Dependency:** All prior moves stabilize the protocol surface.

---

## Sequencing

```
Phase A — Foundation (Moves 1, 5)
├── Move 1: NAPI-RS bridge          ← unlocks everything
└── Move 5: CI/CD pipeline          ← validates everything

Phase B — Runtime Core (Moves 2, 3, 4, 6)
├── Move 2: FlowMind workflows      ← execution engine
├── Move 3: Entity graph             ← world model
├── Move 4: ABAC policy              ← authorization
└── Move 6: Memory engine            ← context

Phase C — Orchestration (Moves 7, 8)
├── Move 7: Supervisor               ← multi-agent
└── Move 8: Forge integration        ← developer workflows

Phase D — Distribution (Moves 9, 10)
├── Move 9: WASM runtime             ← edge/browser
└── Move 10: Open protocol + SDK     ← ecosystem
```

Phase A is ~2 weeks. Phase B is ~4 weeks (parallel tracks). Phase C is ~2 weeks. Phase D is ~3 weeks. Total: ~11 weeks to a fundamentally different platform.

---

## What This Gets You

After these 10 moves, AgentPing is no longer a "ping-and-respond" tool. It's:

1. **A workflow execution platform** — agents submit multi-step workflows, not just questions
2. **Memory-aware** — agents have persistent, temporally-aware context that spans sessions
3. **Policy-governed** — ABAC controls who can do what, with time-bounded leases
4. **Multi-agent native** — supervisor manages agent collaboration with circuit breakers
5. **Developer-workflow optimized** — stacked PRs as first-class workflow primitives
6. **Edge-capable** — WASM runtime enables browser-only, serverless, and mobile deployment
7. **Open protocol** — any surface can implement the adapter contract
8. **Rust-fast, TypeScript-friendly** — performance-critical paths in Rust, developer experience in TypeScript
9. **Tested and CI-gated** — cross-language test harness validates every PR
10. **World-model-backed** — entity graph gives agents shared, queryable knowledge

The Rust crates aren't just infrastructure — they're the missing runtime layer that turns an interaction protocol into a platform.

---

## Existing Debt to Retire Along the Way

These items from the Top 10 Improvements list get solved as side effects:

| Top 10 Item | Solved By |
|---|---|
| #1 Consolidate MCP packages | Move 1 (lev-mcp replaces both) |
| #2 CI/CD pipeline | Move 5 (explicit) |
| #3 Ping expiration | Move 6 (memory engine tier-1 auto-expires) |
| #4 Structured error types | Move 1 (Rust error types propagate via NAPI) |
| #5 Turbo build caching | Move 5 (bundled with CI) |
| #6 Rate limiting + CORS | Move 4 (ABAC subsumes rate limiting) |
| #8 Unit tests | Move 5 (cross-language test harness) |
| #10 Zombie process cleanup | Move 7 (supervisor owns process lifecycle) |

Items #7 (Studio error boundary) and #9 (web-ui component cleanup) are UI-layer concerns that continue on their own track via the existing component migration.
