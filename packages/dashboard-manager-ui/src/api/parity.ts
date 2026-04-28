// Parity Registry projection.
// Generated source: ../generated/parity-scorecard.json
// Canonical source of truth: ../../../../../../.lev/pm/parity/*.yaml

import scorecard from "../generated/parity-scorecard.json";

export interface ParityFeature {
  id: string;
  name: string;
  status: "implemented" | "partial" | "missing" | "not-applicable";
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
  adoptionHealth: "green" | "yellow" | "red";
  implementedPercent: number;
  classifier: "adopted" | "in-progress" | "referenced-only";
}

interface GeneratedFeature {
  id?: string;
  name?: string;
  status?: string;
  lev_equivalent?: string;
  action?: string;
  notes?: string;
}

interface GeneratedMetric {
  name?: string;
  value?: string | number;
  unit?: string;
  source?: string;
}

interface GeneratedTarget {
  target: string;
  label?: string;
  category?: string | null;
  verdict?: string | null;
  measured_at?: string | null;
  updated_at?: string | null;
  priority?: string | null;
  owner?: string | null;
  path?: string;
  features?: GeneratedFeature[];
  metrics?: GeneratedMetric[];
}

interface GeneratedScorecard {
  targets: GeneratedTarget[];
}

const GENERATED = scorecard as GeneratedScorecard;

function normalizeStatus(status?: string): ParityFeature["status"] {
  switch (status) {
    case "implemented":
    case "partial":
    case "missing":
    case "not-applicable":
      return status;
    case "NEEDS":
      return "missing";
    case "PARTIAL":
      return "partial";
    case "EQUIVALENT":
    case "HAS":
      return "implemented";
    case "AVOID":
      return "not-applicable";
    default:
      return "partial";
  }
}

function normalizeFeature(feature: GeneratedFeature, index: number): ParityFeature {
  return {
    id: feature.id || `feature-${index + 1}`,
    name: feature.name || feature.id || `Feature ${index + 1}`,
    status: normalizeStatus(feature.status),
    lev_equivalent: feature.lev_equivalent || "N/A",
    action: feature.action || "unclassified",
    notes: feature.notes || undefined,
  };
}

function normalizeMetric(metric: GeneratedMetric): ParityMetric | null {
  if (!metric.name || metric.value === undefined || metric.value === null) return null;
  const numericValue =
    typeof metric.value === "number" ? metric.value : Number.parseFloat(metric.value);
  if (Number.isNaN(numericValue)) return null;
  return {
    name: metric.name,
    value: numericValue,
    unit: metric.unit || "count",
    source: metric.source,
  };
}

function computeImplementedPercent(features: ParityFeature[]): number {
  const applicable = features.filter((feature) => feature.status !== "not-applicable");
  if (applicable.length === 0) return 0;
  const implemented = applicable.filter((feature) => feature.status === "implemented").length;
  return Math.round((implemented / applicable.length) * 100);
}

function computeAdoptionHealth(
  implementedPercent: number,
  verdict: string,
): "green" | "yellow" | "red" {
  if (verdict === "reject") return "red";
  if (implementedPercent >= 80) return "green";
  if (implementedPercent >= 40) return "yellow";
  return "red";
}

function computeClassifier(
  verdict: string,
  features: ParityFeature[],
): "adopted" | "in-progress" | "referenced-only" {
  if (["adopt", "steal", "integrated"].includes(verdict)) return "adopted";
  if (
    ["extract", "extract-heavy", "extract-and-merge", "build", "recreate"].includes(verdict) &&
    features.some((feature) => feature.status === "partial" || feature.status === "missing")
  ) {
    return "in-progress";
  }
  return "referenced-only";
}

function enrichEntry(raw: GeneratedTarget): ParityEntry {
  const features = (raw.features || []).map(normalizeFeature);
  const implementedPercent = computeImplementedPercent(features);
  const verdict = raw.verdict || "reference";
  return {
    target: raw.target,
    repo: raw.path || ".lev/pm/parity",
    category: raw.category || "uncategorized",
    verdict,
    measured_at: raw.updated_at || raw.measured_at || "unmeasured",
    priority: raw.priority || undefined,
    owner: raw.owner || undefined,
    features,
    metrics: (raw.metrics || []).map(normalizeMetric).filter((x): x is ParityMetric => x !== null),
    lineage: raw.path ? [raw.path] : undefined,
    implementedPercent,
    adoptionHealth: computeAdoptionHealth(implementedPercent, verdict),
    classifier: computeClassifier(verdict, features),
  };
}

export function getParityEntries(): ParityEntry[] {
  return GENERATED.targets.map(enrichEntry);
}
