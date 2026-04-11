// Parity Registry — competitive analysis data
// Source: .lev/pm/parity/*.yaml (11 entries)
// Hardcoded for now; will be wired to an API endpoint later.

export interface ParityFeature {
  id: string;
  name: string;
  status: 'implemented' | 'partial' | 'missing' | 'not-applicable';
  lev_equivalent: string;
  action: string;
}

export interface ParityEntry {
  target: string;
  repo: string;
  category: string;
  verdict: string;
  measured_at: string;
  features: ParityFeature[];
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
  features: ParityFeature[];
}

const RAW_ENTRIES: RawParityEntry[] = [
  // ── axi.yaml ──
  {
    target: 'AXI',
    repo: 'https://github.com/kunchenguid/axi',
    category: 'cli-design',
    verdict: 'reference',
    measured_at: '2026-04-10',
    features: [
      { id: 'axi-01', name: 'Token-efficient output (TOON format)', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate' },
      { id: 'axi-02', name: 'Minimal default schemas', status: 'partial', lev_equivalent: 'core/flowmind/src/contracts/', action: 'adopt' },
      { id: 'axi-03', name: 'Content truncation with size hints', status: 'missing', lev_equivalent: 'N/A', action: 'adopt' },
      { id: 'axi-04', name: 'Pre-computed aggregates', status: 'partial', lev_equivalent: 'plugins/core-reactive/', action: 'adopt' },
      { id: 'axi-05', name: 'Definitive empty states', status: 'missing', lev_equivalent: 'N/A', action: 'adopt' },
      { id: 'axi-06', name: 'Structured errors on stdout', status: 'partial', lev_equivalent: 'core/orchestration/src/events/', action: 'adopt' },
      { id: 'axi-07', name: 'Ambient context via session hooks', status: 'implemented', lev_equivalent: 'plugins/core-reactive/', action: 'implemented' },
      { id: 'axi-08', name: 'Content first (no-args = live data)', status: 'missing', lev_equivalent: 'N/A', action: 'adopt' },
      { id: 'axi-09', name: 'Contextual disclosure (next-step templates)', status: 'partial', lev_equivalent: 'plugins/core-sdlc/', action: 'adopt' },
      { id: 'axi-10', name: 'Consistent --help per subcommand', status: 'implemented', lev_equivalent: 'core/cli/', action: 'implemented' },
    ],
  },

  // ── dev-browser.yaml ──
  {
    target: 'dev-browser',
    repo: 'https://github.com/SawyerHood/dev-browser',
    category: 'browser-automation',
    verdict: 'reference',
    measured_at: '2026-04-10',
    features: [
      { id: 'devb-01', name: 'Self-documenting CLI (--help IS the LLM guide)', status: 'partial', lev_equivalent: 'plugins/core-sdlc/', action: 'adopt' },
      { id: 'devb-02', name: 'Persistent daemon with page state', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented' },
      { id: 'devb-03', name: 'QuickJS WASM sandbox', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate' },
      { id: 'devb-04', name: 'Playwright integration', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented' },
      { id: 'devb-05', name: 'Host filesystem/network isolation', status: 'partial', lev_equivalent: 'crates/lev-agentfs/', action: 'adopt' },
      { id: 'devb-06', name: 'Fractal skill auto-generation from runtime', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate' },
    ],
  },

  // ── agent-browser.yaml ──
  {
    target: 'agent-browser',
    repo: 'https://github.com/vercel-labs/agent-browser',
    category: 'browser-automation',
    verdict: 'reference',
    measured_at: '2026-04-10',
    features: [
      { id: 'ab-01', name: '80+ CLI commands', status: 'partial', lev_equivalent: 'core/cli/', action: 'adopt' },
      { id: 'ab-02', name: 'Rust CLI to Node.js daemon bridge', status: 'partial', lev_equivalent: 'crates/', action: 'adopt' },
      { id: 'ab-03', name: 'Ref-based workflow (snapshot -> refs -> interact)', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate' },
      { id: 'ab-04', name: 'Token-efficient interaction (~200-400 tokens)', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate' },
      { id: 'ab-05', name: 'Playwright backend', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented' },
      { id: 'ab-06', name: 'Persistent page state across commands', status: 'implemented', lev_equivalent: 'community/kingly-assistant/packages/apptestr/', action: 'implemented' },
    ],
  },

  // ── agentfs.yaml ──
  {
    target: 'AgentFS',
    repo: 'https://github.com/tursodatabase/agentfs',
    category: 'agent-filesystem',
    verdict: 'adopt',
    measured_at: '2026-04-10',
    features: [
      { id: 'afs-01', name: 'Virtual Filesystem (POSIX inodes, overlay CoW, whiteouts)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-02', name: 'Key-Value Store (namespaced JSON, auto-timestamped)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-03', name: 'Tool Call Audit Trail (append-only, tamper-resistant)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-04', name: 'FUSE mount (Linux)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-05', name: 'NFS mount (macOS)', status: 'partial', lev_equivalent: 'crates/lev-agentfs/', action: 'adopt' },
      { id: 'afs-06', name: 'WASM mount (browser)', status: 'missing', lev_equivalent: 'N/A', action: 'build' },
      { id: 'afs-07', name: 'Durable Objects mount (edge)', status: 'missing', lev_equivalent: 'N/A', action: 'build' },
      { id: 'afs-08', name: 'lev-reactive sync/async hooks on FUSE writes', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-09', name: 'LevFS Validator plugin (size, frontmatter, schema)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-10', name: 'LevFS Workflow plugin (FlowMind CLI spawn)', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-11', name: 'Dynamic plugin loading via C ABI', status: 'implemented', lev_equivalent: 'crates/lev-agentfs/', action: 'implemented' },
      { id: 'afs-12', name: 'AgentPing filesystem lease executor', status: 'missing', lev_equivalent: 'N/A', action: 'build' },
    ],
  },

  // ── gitagent.yaml ──
  {
    target: 'GitAgent',
    repo: 'https://github.com/jasonkneen/gitagent',
    category: 'functionality-target',
    verdict: 'coverage',
    measured_at: '2026-04-10',
    features: [
      { id: 'ga-01', name: 'agent.yaml manifest', status: 'implemented', lev_equivalent: 'config.yaml', action: 'implemented' },
      { id: 'ga-02', name: 'SOUL.md personality definition', status: 'implemented', lev_equivalent: 'dna/*.yaml', action: 'implemented' },
      { id: 'ga-03', name: 'DUTIES.md SOD compliance', status: 'implemented', lev_equivalent: 'community/agentguard/', action: 'implemented' },
      { id: 'ga-04', name: 'skills/ directory (triggered documents)', status: 'implemented', lev_equivalent: 'core/flowmind/', action: 'implemented' },
      { id: 'ga-05', name: 'tools/ directory (function definitions)', status: 'implemented', lev_equivalent: 'core/flowmind/', action: 'implemented' },
      { id: 'ga-06', name: 'rules/ guardrails', status: 'implemented', lev_equivalent: 'dna/', action: 'implemented' },
      { id: 'ga-07', name: 'memory/ state management', status: 'implemented', lev_equivalent: 'core/memory/', action: 'implemented' },
      { id: 'ga-08', name: 'Git supervision', status: 'implemented', lev_equivalent: 'core/orchestration/src/events/', action: 'implemented' },
      { id: 'ga-09', name: 'Multi-framework export (LangChain, CrewAI, AutoGen, OpenAI, Claude Code)', status: 'missing', lev_equivalent: 'N/A', action: 'build' },
      { id: 'ga-10', name: 'gitagent validate', status: 'implemented', lev_equivalent: 'plugins/validator/', action: 'implemented' },
      { id: 'ga-11', name: 'Agent-as-folder-structure portability', status: 'partial', lev_equivalent: 'dna/entities.yaml', action: 'adopt' },
      { id: 'ga-12', name: 'Framework fragmentation solution', status: 'partial', lev_equivalent: 'core/flowmind/', action: 'adopt' },
    ],
  },

  // ── ouroboros.yaml ──
  {
    target: 'Ouroboros',
    repo: 'https://github.com/Q00/ouroboros',
    category: 'agent-framework',
    verdict: 'reference',
    measured_at: '2026-04-10',
    features: [
      { id: 'ooo-01', name: 'Socratic interview with ambiguity scoring', status: 'partial', lev_equivalent: 'plugins/core-sdlc/ (plan phase)', action: 'adopt' },
      { id: 'ooo-02', name: 'Immutable seed spec (crystallized from interview)', status: 'implemented', lev_equivalent: 'dna/*.yaml + .lev/pm/specs/', action: 'implemented' },
      { id: 'ooo-03', name: 'Double Diamond decomposition (Discover>Define>Design>Deliver)', status: 'partial', lev_equivalent: 'plugins/core-sdlc/flows/', action: 'adopt' },
      { id: 'ooo-04', name: '3-stage eval gate (Mechanical>Semantic>Multi-Model)', status: 'implemented', lev_equivalent: 'core/orchestration/src/eval/types.ts', action: 'implemented' },
      { id: 'ooo-05', name: 'Evolutionary loop with ontology convergence', status: 'partial', lev_equivalent: 'plugins/core-sdlc/flows/eval-harness.flow.yaml', action: 'adopt' },
      { id: 'ooo-06', name: 'Nine agent personas (Socratic, Ontologist, Contrarian, etc.)', status: 'partial', lev_equivalent: 'skills/ (tribunal, cdo, adversarial-review)', action: 'adopt' },
      { id: 'ooo-07', name: 'PAL Router (3-tier cost optimization 1x/10x/30x)', status: 'implemented', lev_equivalent: 'core/harness/src/ (adapter selection)', action: 'implemented' },
      { id: 'ooo-08', name: 'Ralph persistent loop across sessions', status: 'implemented', lev_equivalent: 'plugins/core-sdlc/flows/lev-ralph.flow.yaml', action: 'implemented' },
      { id: 'ooo-09', name: 'Event sourcing with checkpoint recovery', status: 'implemented', lev_equivalent: 'core/event-bus/ + LevEvent JSONL', action: 'implemented' },
      { id: 'ooo-10', name: 'Drift measurement (goal 50% + constraint 30% + ontology 20%)', status: 'partial', lev_equivalent: 'plugins/validator/ + dna/gates.yaml', action: 'adopt' },
      { id: 'ooo-11', name: 'Brownfield auto-detection (scan existing repo patterns)', status: 'partial', lev_equivalent: 'core/config/ (fractal resolver)', action: 'adopt' },
      { id: 'ooo-12', name: 'TUI dashboard', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate' },
    ],
  },

  // ── openclaw.yaml ──
  {
    target: 'OpenClaw',
    repo: 'https://github.com/openclaw/openclaw',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    features: [
      { id: 'oc-01', name: 'Gateway as typed WS control plane + OpenAI-compatible HTTP', status: 'missing', lev_equivalent: 'N/A', action: 'steal' },
      { id: 'oc-02', name: 'Onboarding wizard (openclaw onboard)', status: 'missing', lev_equivalent: 'N/A', action: 'steal' },
      { id: 'oc-03', name: 'Doctor/repair/migration surface (openclaw doctor)', status: 'partial', lev_equivalent: 'plugins/validator/', action: 'steal' },
      { id: 'oc-04', name: 'Remote access (Tailscale, SSH, trusted proxy)', status: 'missing', lev_equivalent: 'N/A', action: 'steal' },
      { id: 'oc-05', name: 'Security model + sandbox + tool policy', status: 'partial', lev_equivalent: 'AgentGuard', action: 'wrap' },
      { id: 'oc-06', name: 'Channel/plugin/app surface (voice, canvas, messaging)', status: 'not-applicable', lev_equivalent: 'N/A', action: 'reject' },
    ],
  },

  // ── hermes.yaml ──
  {
    target: 'Hermes',
    repo: 'https://github.com/NousResearch/hermes-agent',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    features: [
      { id: 'hm-01', name: 'Setup wizard (hermes setup)', status: 'missing', lev_equivalent: 'N/A', action: 'steal' },
      { id: 'hm-02', name: 'Doctor/status (hermes doctor, hermes status)', status: 'partial', lev_equivalent: 'plugins/validator/', action: 'steal' },
      { id: 'hm-03', name: 'ACP editor integration (VS Code, Zed, JetBrains)', status: 'missing', lev_equivalent: 'N/A', action: 'steal' },
      { id: 'hm-04', name: 'Memory-provider composition (built-in + 1 external plugin)', status: 'partial', lev_equivalent: 'core/memory/src/backends/', action: 'steal' },
      { id: 'hm-05', name: 'Delegation semantics (isolated children, budget, tool inheritance)', status: 'partial', lev_equivalent: 'core/orchestration/', action: 'steal' },
      { id: 'hm-06', name: 'Profile-scoped runtime ownership (HERMES_HOME)', status: 'implemented', lev_equivalent: 'core/config/ (XDG paths)', action: 'extract' },
      { id: 'hm-07', name: 'Skills Hub (install/browse/inspect)', status: 'implemented', lev_equivalent: '~/.claude/skills/ + skill-discovery', action: 'reject' },
      { id: 'hm-08', name: 'OpenClaw migration (import skills from upstream)', status: 'missing', lev_equivalent: 'N/A', action: 'extract' },
      { id: 'hm-09', name: 'Autowiki (3-layer: raw/wiki/schema)', status: 'implemented', lev_equivalent: 'plugins/autowiki/', action: 'implemented' },
    ],
  },

  // ── omx.yaml ──
  {
    target: 'OMX',
    repo: 'internal (.worktrees/lev-omx/)',
    category: 'agent-framework',
    verdict: 'integrated',
    measured_at: '2026-04-10',
    features: [
      { id: 'omx-01', name: '4-lane operator model (deep-interview > ralplan > team/ralph > verify)', status: 'partial', lev_equivalent: 'plugins/core-sdlc/flows/', action: 'adopt' },
      { id: 'omx-02', name: 'Deep-interview with mathematical ambiguity scoring', status: 'partial', lev_equivalent: 'N/A (pattern exists in worktree, not in core)', action: 'adopt' },
      { id: 'omx-03', name: 'Tmux team lifecycle (N workers, shared task list, commit ledger)', status: 'partial', lev_equivalent: 'NTM (Named Tmux Manager)', action: 'merge' },
      { id: 'omx-04', name: 'Ralph persistent loop with architect verification', status: 'implemented', lev_equivalent: 'plugins/core-sdlc/flows/lev-ralph.flow.yaml', action: 'implemented' },
      { id: 'omx-05', name: 'RALPLAN consensus planning (structured deliberation)', status: 'partial', lev_equivalent: 'CDO deliberation skills', action: 'merge' },
      { id: 'omx-06', name: 'Machine API (programmatic mode control)', status: 'missing', lev_equivalent: 'N/A', action: 'build' },
      { id: 'omx-07', name: 'HUD status display', status: 'missing', lev_equivalent: 'N/A', action: 'steal' },
      { id: 'omx-08', name: '20 role prompts (analyst, architect, debugger, etc.)', status: 'implemented', lev_equivalent: '~/.claude/skills/ + plugins/', action: 'implemented' },
      { id: 'omx-09', name: 'Auto-nudge / autopilot', status: 'partial', lev_equivalent: 'autodev-loop skill', action: 'merge' },
    ],
  },

  // ── omc.yaml ──
  {
    target: 'OMC',
    repo: 'internal (workshop/analysis/oh-my-claudecode/)',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    features: [
      { id: 'omc-01', name: 'Claude Code team shell (provider-flavor team lifecycle)', status: 'partial', lev_equivalent: 'NTM + Agent tool', action: 'extract' },
      { id: 'omc-02', name: 'Worker health monitoring and HUD', status: 'missing', lev_equivalent: 'N/A', action: 'steal' },
      { id: 'omc-03', name: 'Provider-specific optimizations', status: 'partial', lev_equivalent: 'core/harness/src/ (adapter selection)', action: 'extract' },
    ],
  },

  // ── omo.yaml ──
  {
    target: 'OMO',
    repo: 'internal (workshop/analysis/oh-my-openagent/)',
    category: 'agent-framework',
    verdict: 'extract',
    measured_at: '2026-04-10',
    features: [
      { id: 'omo-01', name: 'Category routing (task classification > mode selection)', status: 'partial', lev_equivalent: 'plugins/core-sdlc/', action: 'extract' },
      { id: 'omo-02', name: 'Planner/executor split', status: 'implemented', lev_equivalent: 'plugins/core-sdlc/flows/ (plan-execute-verify)', action: 'implemented' },
      { id: 'omo-03', name: 'Hash-anchored edits', status: 'missing', lev_equivalent: 'N/A', action: 'evaluate' },
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
