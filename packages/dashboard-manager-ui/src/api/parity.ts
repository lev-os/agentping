// Parity Registry — competitive analysis data
// Source: .lev/pm/parity/*.yaml (11 entries)
// Hardcoded for now; will be wired to an API endpoint later.

export interface ParityFeature {
  id: string;
  name: string;
  status: 'implemented' | 'partial' | 'missing' | 'not-applicable';
  lev_equivalent: string;
  action: string;
  notes?: string;
}

export interface ParityMetric {
  name: string;
  value: number;
  unit: string;
  source?: string;
}

export interface ParityEntry {
  target: string;
  repo: string;
  category: string;
  verdict: string;
  measured_at: string;
  priority?: string;
  owner?: string;
  features: ParityFeature[];
  metrics?: ParityMetric[];
  lineage?: string[];
  // Computed
  adoptionHealth: 'green' | 'yellow' | 'red';
  implementedPercent: number;
  classifier: 'adopted' | 'in-progress' | 'referenced-only';
}

// ------------------------------------------------------------------
// Raw parity data extracted from .lev/pm/parity/*.yaml
// ------------------------------------------------------------------

interface RawParityEntry {
  target: string;
  repo: string;
  category: string;
  verdict: string;
  measured_at: string;
  priority?: string;
  owner?: string;
  features: ParityFeature[];
  metrics?: ParityMetric[];
  lineage?: string[];
}

const RAW_ENTRIES: RawParityEntry[] = [
  // ── axi.yaml ──
  {
    target: 'AXI',
    repo: 'https://github.com/kunchenguid/axi',
    category: 'cli-design',
    verdict: 'reference',
    measured_at: '2026-04-10',
    priority: 'P1',
    owner: 'core/cli',
    metrics: [
      { name: 'success_rate', value: 100, unit: 'percent', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'cost_per_task', value: 0.074, unit: 'usd', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'avg_turns', value: 4.5, unit: 'count', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'avg_duration', value: 21.5, unit: 'seconds', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
    ],
    features: [
      { id: 'axi-01', name: 'Token-efficient output (TOON format)', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate', notes: 'TOON yields ~40% token savings over JSON. Evaluate for /now skill output. Spec: toonformat.dev' },
      { id: 'axi-02', name: 'Minimal default schemas', status: 'partial', lev_equivalent: 'core/flowmind/src/contracts/', action: 'adopt', notes: '3-4 fields per list item with --fields expansion. Lev handler output not yet schema-trimmed.' },
      { id: 'axi-03', name: 'Content truncation with size hints', status: 'missing', lev_equivalent: 'N/A', action: 'adopt', notes: 'Size hints + --full escape hatch. Not implemented in Lev CLI surfaces.' },
      { id: 'axi-04', name: 'Pre-computed aggregates', status: 'partial', lev_equivalent: 'plugins/reactive/', action: 'adopt', notes: 'Combined operations to reduce round trips. Lev has reactive composition but not at CLI output level.' },
      { id: 'axi-05', name: 'Definitive empty states', status: 'missing', lev_equivalent: 'N/A', action: 'adopt', notes: "Explicit '0 results' instead of silence. Not enforced in Lev CLI." },
      { id: 'axi-06', name: 'Structured errors on stdout', status: 'partial', lev_equivalent: 'core/orchestration/src/events/', action: 'adopt', notes: 'LevEvent-only semantics aligns philosophically. Idempotent mutations not yet enforced.' },
      { id: 'axi-07', name: 'Ambient context via session hooks', status: 'implemented', lev_equivalent: 'plugins/reactive/', action: 'implemented', notes: 'Reactive hooks system provides session lifecycle hooks. Direct parallel to AXI principle.' },
      { id: 'axi-08', name: 'Content first (no-args = live data)', status: 'missing', lev_equivalent: 'N/A', action: 'adopt', notes: 'Lev CLI currently shows help on no-args. AXI pattern: no-args shows live data.' },
      { id: 'axi-09', name: 'Contextual disclosure (next-step templates)', status: 'partial', lev_equivalent: 'plugins/sdlc/', action: 'adopt', notes: 'Validation gates provide next-step guidance. Not yet as CLI command templates after every response.' },
      { id: 'axi-10', name: 'Consistent --help per subcommand', status: 'implemented', lev_equivalent: 'core/cli/', action: 'implemented', notes: 'Standard CLI help infrastructure exists via poly.' },
    ],
  },

  // ── dev-browser.yaml ──
  {
    target: 'dev-browser',
    repo: 'https://github.com/SawyerHood/dev-browser',
    category: 'browser-automation',
    verdict: 'reference',
    measured_at: '2026-04-10',
    priority: 'P1',
    owner: 'core/cli + plugins/browser',
    metrics: [
      { name: 'success_rate', value: 99, unit: 'percent', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'cost_per_task', value: 0.078, unit: 'usd', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'avg_turns', value: 4.9, unit: 'count', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'avg_duration', value: 28.6, unit: 'seconds', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
    ],
    features: [
      { id: 'devb-01', name: 'Self-documenting CLI (--help IS the LLM guide)', status: 'partial', lev_equivalent: 'plugins/sdlc/', action: 'adopt', notes: 'dev-browser needs no separate SKILL.md. Lev has flowmind -> skill compiler but not yet self-documenting runtime.' },
      { id: 'devb-02', name: 'Persistent daemon with page state', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented', notes: 'AppTestr daemon pattern matches. Unix socket, JSON-RPC, socket-locked singleton.' },
      { id: 'devb-03', name: 'QuickJS WASM sandbox', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate', notes: 'Sandboxed script execution via QuickJS WASM. Lev uses AgentFS overlay CoW but no WASM script sandbox.' },
      { id: 'devb-04', name: 'Playwright integration', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented', notes: 'AppTestr uses Playwright. Browser automation surface exists.' },
      { id: 'devb-05', name: 'Host filesystem/network isolation', status: 'partial', lev_equivalent: 'crates/lev-agentfs/', action: 'adopt', notes: 'AgentFS provides overlay CoW sandbox. Network isolation not yet enforced at browser automation layer.' },
      { id: 'devb-06', name: 'Fractal skill auto-generation from runtime', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate', notes: 'The pattern: modules declare flowmind -> compiler builds skills -> prose shows API. Target for constraint engineering plugin.' },
    ],
  },

  // ── agent-browser.yaml ──
  {
    target: 'agent-browser',
    repo: 'https://github.com/vercel-labs/agent-browser',
    category: 'browser-automation',
    verdict: 'reference',
    measured_at: '2026-04-10',
    priority: 'P2',
    owner: 'plugins/browser',
    metrics: [
      { name: 'success_rate', value: 99, unit: 'percent', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'cost_per_task', value: 0.088, unit: 'usd', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'avg_turns', value: 4.8, unit: 'count', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
      { name: 'avg_duration', value: 24.6, unit: 'seconds', source: 'https://github.com/kunchenguid/chrome-devtools-axi' },
    ],
    features: [
      { id: 'ab-01', name: '80+ CLI commands', status: 'partial', lev_equivalent: 'core/cli/', action: 'adopt', notes: 'API completeness benchmark for browser automation surface. Lev poly surfaces exist but not at 80-command depth for browser.' },
      { id: 'ab-02', name: 'Rust CLI to Node.js daemon bridge', status: 'partial', lev_equivalent: 'crates/', action: 'adopt', notes: 'Lev has Rust crates and Node.js runtime but no dedicated Rust->Node daemon bridge for browser.' },
      { id: 'ab-03', name: 'Ref-based workflow (snapshot -> refs -> interact)', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate', notes: 'Snapshot-based interaction model. Token-efficient: ~200-400 tokens per interaction. Not yet in Lev.' },
      { id: 'ab-04', name: 'Token-efficient interaction (~200-400 tokens)', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate', notes: 'Ref-based model achieves extreme token efficiency. Lev browser automation not yet optimized for token budget.' },
      { id: 'ab-05', name: 'Playwright backend', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented', notes: 'Shared Playwright dependency. AppTestr provides equivalent backend.' },
      { id: 'ab-06', name: 'Persistent page state across commands', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented', notes: 'AppTestr daemon maintains persistent page state via socket-locked singleton.' },
    ],
  },

  // ── agentfs.yaml ──
  {
    target: 'AgentFS',
    repo: 'https://github.com/tursodatabase/agentfs',
    category: 'agent-filesystem',
    verdict: 'adopt',
    measured_at: '2026-04-10',
    priority: 'P0',
    owner: 'crates/lev-agentfs',
    metrics: [
      { name: 'feature_parity', value: 85, unit: 'percent', source: 'https://github.com/tursodatabase/agentfs' },
      { name: 'features_implemented', value: 69, unit: 'count', source: 'https://github.com/tursodatabase/agentfs' },
      { name: 'features_total', value: 81, unit: 'count', source: 'https://github.com/tursodatabase/agentfs' },
    ],
    features: [
      { id: 'afs-01', name: 'Virtual Filesystem (POSIX inodes, overlay CoW, whiteouts)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Core VFS with overlay copy-on-write and whiteout support.' },
      { id: 'afs-02', name: 'Key-Value Store (namespaced JSON, auto-timestamped)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Namespaced KV with automatic timestamps.' },
      { id: 'afs-03', name: 'Tool Call Audit Trail (append-only, tamper-resistant)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Append-only execution history for eval harness traceability.' },
      { id: 'afs-04', name: 'FUSE mount (Linux)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Linux FUSE mount operational.' },
      { id: 'afs-05', name: 'NFS mount (macOS)', status: 'partial', lev_equivalent: 'crates/lev-agentfs/', action: 'adopt', notes: 'NFS mount works but has zero hooks. macOS gets no validation on writes.' },
      { id: 'afs-06', name: 'WASM mount (browser)', status: 'missing', lev_equivalent: 'N/A', action: 'build', notes: 'Linux-only cfg gate blocks WASM compilation. Required for browser substrate convergence.' },
      { id: 'afs-07', name: 'Durable Objects mount (edge)', status: 'missing', lev_equivalent: 'N/A', action: 'build', notes: 'Edge deployment via Cloudflare Durable Objects not yet implemented.' },
      { id: 'afs-08', name: 'lev-reactive sync/async hooks on FUSE writes', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Extension beyond upstream. Reactive hooks fire on FUSE write operations.' },
      { id: 'afs-09', name: 'LevFS Validator plugin (size, frontmatter, schema)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Extension beyond upstream. Schema validation on filesystem writes.' },
      { id: 'afs-10', name: 'LevFS Workflow plugin (FlowMind CLI spawn)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Extension beyond upstream. FlowMind integration via CLI spawn.' },
      { id: 'afs-11', name: 'Dynamic plugin loading via C ABI', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented', notes: 'Extension beyond upstream. C ABI plugin interface.' },
      { id: 'afs-12', name: 'AgentPing filesystem lease executor', status: 'missing', lev_equivalent: 'N/A', action: 'build', notes: "AgentPing scope: 'filesystem' lease has no executor. Gap in agent-to-filesystem integration." },
    ],
  },

  // ── gitagent.yaml ──
  {
    target: 'GitAgent',
    repo: 'https://github.com/jasonkneen/gitagent',
    category: 'functionality-target',
    verdict: 'coverage',
    measured_at: '2026-04-10',
    priority: 'P3',
    owner: 'plugins/sdlc',
    metrics: [],
    features: [
      { id: 'ga-01', name: 'agent.yaml manifest', status: 'implemented', lev_equivalent: 'config.yaml', action: 'implemented', notes: 'Lev uses config.yaml FlowMind. Functionally equivalent, richer schema.' },
      { id: 'ga-02', name: 'SOUL.md personality definition', status: 'implemented', lev_equivalent: 'dna/*.yaml', action: 'implemented', notes: 'DNA constraints + behaviors compile to executable gates. SOUL.md is prose-only.' },
      { id: 'ga-03', name: 'DUTIES.md SOD compliance', status: 'implemented', lev_equivalent: 'community/agentguard/', action: 'implemented', notes: 'AgentGuard + DNA constraints provide equivalent SOD compliance.' },
      { id: 'ga-04', name: 'skills/ directory (triggered documents)', status: 'implemented', lev_equivalent: 'core/flowmind/', action: 'implemented', notes: 'FlowMind triggered documents. Richer than flat skill files.' },
      { id: 'ga-05', name: 'tools/ directory (function definitions)', status: 'implemented', lev_equivalent: 'core/flowmind/', action: 'implemented', notes: 'Function nodes in FlowMind graph. Type-safe, composable.' },
      { id: 'ga-06', name: 'rules/ guardrails', status: 'implemented', lev_equivalent: 'dna/', action: 'implemented', notes: 'DNA constraints provide guardrails that compile to executable validation gates.' },
      { id: 'ga-07', name: 'memory/ state management', status: 'implemented', lev_equivalent: 'core/memory/', action: 'implemented', notes: 'Memory compiler with exponential decay. GitAgent uses flat markdown files.' },
      { id: 'ga-08', name: 'Git supervision', status: 'implemented', lev_equivalent: 'core/orchestration/src/events/', action: 'implemented', notes: 'Event bus + provenance chain. Richer than Git-only supervision.' },
      { id: 'ga-09', name: 'Multi-framework export (LangChain, CrewAI, AutoGen, OpenAI, Claude Code)', status: 'missing', lev_equivalent: 'N/A', action: 'build', notes: 'Key gap. Target compilers planned for core/flowmind/src/targets/ but not yet built.' },
      { id: 'ga-10', name: 'gitagent validate', status: 'implemented', lev_equivalent: 'plugins/validator/', action: 'implemented', notes: 'ValidatorChain with 8 built-in adapters. More comprehensive than gitagent validate.' },
      { id: 'ga-11', name: 'Agent-as-folder-structure portability', status: 'partial', lev_equivalent: 'dna/entities.yaml', action: 'adopt', notes: 'Lev uses structured YAML entities, not plain folder conventions. More powerful but less portable without export adapters.' },
      { id: 'ga-12', name: 'Framework fragmentation solution', status: 'partial', lev_equivalent: 'core/flowmind/', action: 'adopt', notes: 'FlowMind subsumes frameworks at the graph level. Missing the export adapters that prove it (see ga-09).' },
    ],
  },

  // ── ouroboros.yaml ──
  {
    target: 'Ouroboros',
    repo: 'https://github.com/Q00/ouroboros',
    category: 'agent-framework',
    verdict: 'reference',
    measured_at: '2026-04-10',
    priority: 'P0',
    owner: 'plugins/sdlc + core/orchestration',
    metrics: [
      { name: 'ambiguity_gate_threshold', value: 0.2, unit: 'score', source: 'https://github.com/Q00/ouroboros' },
      { name: 'convergence_threshold', value: 0.95, unit: 'score', source: 'https://github.com/Q00/ouroboros' },
      { name: 'max_generations', value: 30, unit: 'count', source: 'https://github.com/Q00/ouroboros' },
      { name: 'cost_tiers', value: 3, unit: 'count', source: 'https://github.com/Q00/ouroboros' },
    ],
    features: [
      { id: 'ooo-01', name: 'Socratic interview with ambiguity scoring', status: 'partial', lev_equivalent: 'plugins/sdlc/ (plan phase)', action: 'adopt', notes: 'Lev has planning flows but no Socratic interview with mathematical ambiguity gate. DNA constraints are the equivalent but applied to code, not requirements.' },
      { id: 'ooo-02', name: 'Immutable seed spec (crystallized from interview)', status: 'implemented', lev_equivalent: 'dna/*.yaml + .lev/pm/specs/', action: 'implemented', notes: 'DNA contracts ARE immutable specs. The pattern is identical — define constraints before implementation.' },
      { id: 'ooo-03', name: 'Double Diamond decomposition (Discover>Define>Design>Deliver)', status: 'partial', lev_equivalent: 'plugins/sdlc/flows/', action: 'adopt', notes: 'FlowMind flows implement this pattern. stabilization-loop.flow.yaml, plan-execute-verify. Not branded as Double Diamond.' },
      { id: 'ooo-04', name: '3-stage eval gate (Mechanical>Semantic>Multi-Model)', status: 'implemented', lev_equivalent: 'core/orchestration/src/eval/types.ts', action: 'implemented', notes: 'EvalStrategy has 4 kinds: gate-based (mechanical), metric-based (semantic), llm-as-judge, adversarial. Eval harness flow implements the gating.' },
      { id: 'ooo-05', name: 'Evolutionary loop with ontology convergence', status: 'partial', lev_equivalent: 'plugins/sdlc/flows/eval-harness.flow.yaml', action: 'adopt', notes: 'eval-harness produce->judge->compare->keep_or_discard is the same pattern. HOLD state = collect more samples. But no ontology similarity metric.' },
      { id: 'ooo-06', name: 'Nine agent personas (Socratic, Ontologist, Contrarian, etc.)', status: 'partial', lev_equivalent: 'skills/ (tribunal, cdo, adversarial-review)', action: 'adopt', notes: 'Lev has tribunal (multi-model), cdo (deliberation), adversarial review. Not branded as named personas. The adversarial flowmind IS the Contrarian.' },
      { id: 'ooo-07', name: 'PAL Router (3-tier cost optimization 1x/10x/30x)', status: 'implemented', lev_equivalent: 'core/harness/src/ (adapter selection)', action: 'implemented', notes: 'Lev has adapter + model selection per node. lev-ralph uses haiku for triage, sonnet for work, opus for review. Same pattern.' },
      { id: 'ooo-08', name: 'Ralph persistent loop across sessions', status: 'implemented', lev_equivalent: 'plugins/sdlc/flows/lev-ralph.flow.yaml', action: 'implemented', notes: 'lev-ralph IS this. Same name even. Work->gate->review->done. Fresh context per iteration.' },
      { id: 'ooo-09', name: 'Event sourcing with checkpoint recovery', status: 'implemented', lev_equivalent: 'core/event-bus/ + LevEvent JSONL', action: 'implemented', notes: 'LevEvent bus with append-only JSONL. AgentFS tool call audit trail. C2 Non-Commutation.' },
      { id: 'ooo-10', name: 'Drift measurement (goal 50% + constraint 30% + ontology 20%)', status: 'partial', lev_equivalent: 'plugins/validator/ + dna/gates.yaml', action: 'adopt', notes: 'ValidatorChain detects constraint drift. No composite drift score with weighted dimensions yet.' },
      { id: 'ooo-11', name: 'Brownfield auto-detection (scan existing repo patterns)', status: 'partial', lev_equivalent: 'core/config/ (fractal resolver)', action: 'adopt', notes: 'Fractal config resolver discovers project structure. No explicit brownfield scanner.' },
      { id: 'ooo-12', name: 'TUI dashboard', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate', notes: 'Lev has no TUI. CLI + MCP surfaces only.' },
    ],
  },

  // ── openclaw.yaml ──
  {
    target: 'OpenClaw',
    repo: 'https://github.com/openclaw/openclaw',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    priority: 'P1',
    owner: 'plugins/platforms',
    lineage: [
      'workshop/analysis/openclaw/analysis.md',
      '.lev/pm/reports/20260405-openclaw-deep-dive.md',
      'community/kingly-assistant/openclaw-upstream/',
    ],
    metrics: [],
    features: [
      { id: 'oc-01', name: 'Gateway as typed WS control plane + OpenAI-compatible HTTP', status: 'missing', lev_equivalent: 'N/A', action: 'steal', notes: 'STEAL — polished single control-plane shell. Lev has no comparable gateway product.' },
      { id: 'oc-02', name: 'Onboarding wizard (openclaw onboard)', status: 'missing', lev_equivalent: 'N/A', action: 'steal', notes: 'STEAL ceremony + sequencing. Consumer-grade setup flow. Lev has fragmented setup.' },
      { id: 'oc-03', name: 'Doctor/repair/migration surface (openclaw doctor)', status: 'partial', lev_equivalent: 'plugins/validator/', action: 'steal', notes: 'STEAL — Lev has validation gates but no consumer health shell. lev doctor exists but not polished.' },
      { id: 'oc-04', name: 'Remote access (Tailscale, SSH, trusted proxy)', status: 'missing', lev_equivalent: 'N/A', action: 'steal', notes: 'STEAL — plans exist, no operator polish. Docker setup at ~/claws/.' },
      { id: 'oc-05', name: 'Security model + sandbox + tool policy', status: 'partial', lev_equivalent: 'AgentGuard', action: 'wrap', notes: 'WRAP concepts — Lev has better core governance, less productized UX.' },
      { id: 'oc-06', name: 'Channel/plugin/app surface (voice, canvas, messaging)', status: 'not-applicable', lev_equivalent: 'N/A', action: 'reject', notes: "REJECT — not Lev's scope. Product sprawl." },
    ],
  },

  // ── hermes.yaml ──
  {
    target: 'Hermes',
    repo: 'https://github.com/NousResearch/hermes-agent',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    priority: 'P1',
    owner: 'plugins/platforms + core/memory',
    lineage: [
      'workshop/analysis/hermes-agent/analysis.md',
      '.lev/pm/reports/20260405-hermes-agent-deep-dive.md',
      'workshop/analysis/hermes-agent-autowiki/analysis.md',
      'workshop/analysis/hermes-agent-self-evolution/analysis.md',
    ],
    metrics: [],
    features: [
      { id: 'hm-01', name: 'Setup wizard (hermes setup)', status: 'missing', lev_equivalent: 'N/A', action: 'steal', notes: 'STEAL product flow — real wizard with provider, terminal, tools, messaging sections.' },
      { id: 'hm-02', name: 'Doctor/status (hermes doctor, hermes status)', status: 'partial', lev_equivalent: 'plugins/validator/', action: 'steal', notes: 'STEAL — profile-aware runtime health. Lev has gates but no consumer health shell.' },
      { id: 'hm-03', name: 'ACP editor integration (VS Code, Zed, JetBrains)', status: 'missing', lev_equivalent: 'N/A', action: 'steal', notes: 'STEAL/WRAP — first-class editor integration via registry JSON.' },
      { id: 'hm-04', name: 'Memory-provider composition (built-in + 1 external plugin)', status: 'partial', lev_equivalent: 'core/memory/src/backends/', action: 'steal', notes: 'STEAL plugin-manager shape — Lev has richer backend registry but less operator UX.' },
      { id: 'hm-05', name: 'Delegation semantics (isolated children, budget, tool inheritance)', status: 'partial', lev_equivalent: 'core/orchestration/', action: 'steal', notes: 'STEAL — isolated child contexts, per-child iteration budgets, skip_memory.' },
      { id: 'hm-06', name: 'Profile-scoped runtime ownership (HERMES_HOME)', status: 'implemented', lev_equivalent: 'core/config/ (XDG paths)', action: 'extract', notes: 'EXTRACT pattern, REJECT ~/.hermes — Lev already has XDG-disciplined state.' },
      { id: 'hm-07', name: 'Skills Hub (install/browse/inspect)', status: 'implemented', lev_equivalent: '~/.claude/skills/ + skill-discovery', action: 'reject', notes: 'DO NOT REPLACE — Lev has more skills + stronger meta-workflows.' },
      { id: 'hm-08', name: 'OpenClaw migration (import skills from upstream)', status: 'missing', lev_equivalent: 'N/A', action: 'extract', notes: 'EXTRACT as rollout craft pattern — migration-as-feature is good product thinking.' },
      { id: 'hm-09', name: 'Autowiki (3-layer: raw/wiki/schema)', status: 'implemented', lev_equivalent: 'plugins/autowiki/', action: 'implemented', notes: 'IMPLEMENTED — Lev adopted the Karpathy/Hermes 3-layer pattern. Plugin exists, never run live.' },
    ],
  },

  // ── omx.yaml ──
  {
    target: 'OMX',
    repo: 'internal (.worktrees/lev-omx/)',
    category: 'agent-framework',
    verdict: 'integrated',
    measured_at: '2026-04-10',
    priority: 'P0',
    owner: '.worktrees/lev-omx + plugins/sdlc',
    lineage: [
      '.lev/pm/reports/20260405-omx-hermes-grab-bag.md',
      '.lev/pm/reports/20260405-provider-runtime-adoption-matrix.md',
      'workshop/analysis/oh-my-codex/',
    ],
    metrics: [
      { name: 'skills_count', value: 27, unit: 'count', source: '.worktrees/lev-omx/.codex/skills/' },
      { name: 'role_prompts', value: 20, unit: 'count', source: '.worktrees/lev-omx/.codex/prompts/' },
    ],
    features: [
      { id: 'omx-01', name: '4-lane operator model (deep-interview > ralplan > team/ralph > verify)', status: 'partial', lev_equivalent: 'plugins/sdlc/flows/', action: 'adopt', notes: 'The 4-lane model IS the day-to-day UX. Lev has the flows but not the unified surface.' },
      { id: 'omx-02', name: 'Deep-interview with mathematical ambiguity scoring', status: 'partial', lev_equivalent: 'N/A (pattern exists in worktree, not in core)', action: 'adopt', notes: 'Weighted dimensions: intent 30%, outcome 25%, scope 20%, constraints 15%, success 10%. Depth profiles: quick <=0.30, standard <=0.20, deep <=0.15.' },
      { id: 'omx-03', name: 'Tmux team lifecycle (N workers, shared task list, commit ledger)', status: 'partial', lev_equivalent: 'NTM (Named Tmux Manager)', action: 'merge', notes: 'NTM exists. OMX adds team state management, worker health, auto-nudge.' },
      { id: 'omx-04', name: 'Ralph persistent loop with architect verification', status: 'implemented', lev_equivalent: 'plugins/sdlc/flows/lev-ralph.flow.yaml', action: 'implemented', notes: 'Same pattern, same name. lev-ralph is the canonical implementation.' },
      { id: 'omx-05', name: 'RALPLAN consensus planning (structured deliberation)', status: 'partial', lev_equivalent: 'CDO deliberation skills', action: 'merge', notes: 'CDO is more powerful. RALPLAN has cleaner operator UX.' },
      { id: 'omx-06', name: 'Machine API (programmatic mode control)', status: 'missing', lev_equivalent: 'N/A', action: 'build', notes: 'OMX exposes mode switching via machine-readable API. Lev uses CLI only.' },
      { id: 'omx-07', name: 'HUD status display', status: 'missing', lev_equivalent: 'N/A', action: 'steal', notes: 'Real-time execution status overlay. Lev has no comparable surface.' },
      { id: 'omx-08', name: '20 role prompts (analyst, architect, debugger, etc.)', status: 'implemented', lev_equivalent: '~/.claude/skills/ + plugins/', action: 'implemented', notes: 'Lev has equivalent or better coverage via skills. Different packaging.' },
      { id: 'omx-09', name: 'Auto-nudge / autopilot', status: 'partial', lev_equivalent: 'autodev-loop skill', action: 'merge', notes: 'Similar concept. OMX has tighter tmux integration.' },
    ],
  },

  // ── omc.yaml ──
  {
    target: 'OMC',
    repo: 'internal (workshop/analysis/oh-my-claudecode/)',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    priority: 'P2',
    owner: 'plugins/platforms',
    lineage: [
      'workshop/analysis/oh-my-claudecode/',
      '.lev/pm/reports/20260405-provider-runtime-final-comparison.md',
    ],
    metrics: [],
    features: [
      { id: 'omc-01', name: 'Claude Code team shell (provider-flavor team lifecycle)', status: 'partial', lev_equivalent: 'NTM + Agent tool', action: 'extract', notes: 'Claude Code native team patterns. Lev uses Claude Code as an adapter, not the team surface.' },
      { id: 'omc-02', name: 'Worker health monitoring and HUD', status: 'missing', lev_equivalent: 'N/A', action: 'steal', notes: 'Real-time worker health in team execution. Missing in Lev.' },
      { id: 'omc-03', name: 'Provider-specific optimizations', status: 'partial', lev_equivalent: 'core/harness/src/ (adapter selection)', action: 'extract', notes: 'OMC optimizes specifically for Claude Code. Lev is adapter-agnostic.' },
    ],
  },

  // ── omo.yaml ──
  {
    target: 'OMO',
    repo: 'internal (workshop/analysis/oh-my-openagent/)',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    priority: 'P2',
    owner: 'plugins/platforms',
    lineage: [
      'workshop/analysis/oh-my-openagent/',
      '.lev/pm/handoffs/20260324-skill-intake-ohmyopenagent-site-session-1.md',
    ],
    metrics: [],
    features: [
      { id: 'omo-01', name: 'Category routing (task classification > mode selection)', status: 'partial', lev_equivalent: 'plugins/sdlc/', action: 'extract', notes: 'OMO routes tasks to categories before execution. Lev has flow selection but not auto-classification.' },
      { id: 'omo-02', name: 'Planner/executor split', status: 'implemented', lev_equivalent: 'plugins/sdlc/flows/ (plan-execute-verify)', action: 'implemented', notes: 'Lev already has this pattern in multiple flows.' },
      { id: 'omo-03', name: 'Hash-anchored edits', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate', notes: 'Content-addressed edit references. Interesting for deterministic replay.' },
    ],
  },
];

// ------------------------------------------------------------------
// Computed field logic
// ------------------------------------------------------------------

function computeImplementedPercent(features: ParityFeature[]): number {
  const applicable = features.filter((f) => f.status !== 'not-applicable');
  if (applicable.length === 0) return 0;
  const implemented = applicable.filter((f) => f.status === 'implemented').length;
  return Math.round((implemented / applicable.length) * 100);
}

function computeAdoptionHealth(
  implementedPercent: number,
  verdict: string,
): 'green' | 'yellow' | 'red' {
  if (verdict === 'reject') return 'red';
  if (implementedPercent >= 80) return 'green';
  if (implementedPercent >= 40) return 'yellow';
  return 'red';
}

function computeClassifier(
  verdict: string,
  features: ParityFeature[],
): 'adopted' | 'in-progress' | 'referenced-only' {
  if (['adopt', 'steal', 'integrated'].includes(verdict)) return 'adopted';
  if (
    ['extract', 'build'].includes(verdict) &&
    features.some((f) => f.status === 'partial')
  ) {
    return 'in-progress';
  }
  // reference, reject, coverage, or extract/build with no partial features
  return 'referenced-only';
}

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

function enrichEntry(raw: RawParityEntry): ParityEntry {
  const implementedPercent = computeImplementedPercent(raw.features);
  return {
    ...raw,
    implementedPercent,
    adoptionHealth: computeAdoptionHealth(implementedPercent, raw.verdict),
    classifier: computeClassifier(raw.verdict, raw.features),
  };
}

export function getParityEntries(): ParityEntry[] {
  return RAW_ENTRIES.map(enrichEntry);
}
