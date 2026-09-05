const API_BASE = "/api";

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
  value: number | string;
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

type RawRecord = Readonly<Record<string, unknown>>;

interface GeneratedTarget extends RawRecord {
  readonly target: string;
}

interface GeneratedScorecard extends RawRecord {
  readonly targets: readonly GeneratedTarget[];
}

let cachedEntries: ParityEntry[] = [];

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item) => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : undefined;
}

function asGeneratedRecords(value: unknown): RawRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function isGeneratedTarget(value: unknown): value is GeneratedTarget {
  return isRecord(value) && typeof value.target === "string" && value.target.trim().length > 0;
}

function isGeneratedScorecard(value: unknown): value is GeneratedScorecard {
  return isRecord(value) && Array.isArray(value.targets) && value.targets.every(isGeneratedTarget);
}

function normalizeStatus(status: unknown): ParityFeature["status"] {
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

function normalizeFeature(feature: RawRecord, index: number): ParityFeature {
  const name = asString(feature.name);
  const id = asString(feature.id);
  return {
    id: id ?? paritySlug(name ?? `feature-${index + 1}`),
    name: name ?? id ?? `Feature ${index + 1}`,
    status: normalizeStatus(feature.status),
    lev_equivalent: asString(feature.lev_equivalent) ?? "N/A",
    action: asString(feature.action) ?? "unclassified",
    notes: asString(feature.notes),
  };
}

function normalizeMetric(metric: RawRecord): ParityMetric | null {
  const name = asString(metric.name);
  const value = metric.value;
  if (!name || (typeof value !== "string" && typeof value !== "number")) return null;

  return {
    name,
    value,
    unit: asString(metric.unit) ?? "count",
    source: asString(metric.source),
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
  const normalized = verdict.toLowerCase();
  if (normalized.includes("reject")) return "red";
  if (implementedPercent >= 80) return "green";
  if (implementedPercent >= 40) return "yellow";
  return "red";
}

function computeClassifier(
  verdict: string,
  features: ParityFeature[],
): "adopted" | "in-progress" | "referenced-only" {
  const normalized = verdict.toLowerCase();
  if (
    normalized.includes("adopt") ||
    normalized.includes("steal") ||
    normalized.includes("integrat") ||
    normalized.includes("absor") ||
    normalized.includes("implement")
  ) {
    return "adopted";
  }

  if (
    (normalized.includes("extract") || normalized.includes("build") || normalized.includes("merge")) &&
    features.some((feature) => feature.status === "partial" || feature.status === "missing")
  ) {
    return "in-progress";
  }

  return "referenced-only";
}

function priorityRank(priority?: string): number {
  switch (priority) {
    case "P0":
      return 0;
    case "P1":
      return 1;
    case "P2":
      return 2;
    case "P3":
      return 3;
    case "P4":
      return 4;
    default:
      return 9;
  }
}

export function paritySlug(target: string): string {
  return target.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function enrichEntry(raw: GeneratedTarget): ParityEntry {
  const features = asGeneratedRecords(raw.features).map(normalizeFeature);
  const implementedPercent = computeImplementedPercent(features);
  const verdict = asString(raw.verdict) ?? "reference";
  const path = asString(raw.path);
  const lineage = asStringArray(raw.lineage) ?? (path ? [path] : undefined);

  return {
    target: raw.target,
    repo: path ?? ".lev/pm/parity",
    category: asString(raw.category) ?? "uncategorized",
    verdict,
    measured_at: asString(raw.updated_at) ?? asString(raw.measured_at) ?? "unmeasured",
    priority: asString(raw.priority),
    owner: asString(raw.owner),
    features,
    metrics: asGeneratedRecords(raw.metrics).map(normalizeMetric).filter((x): x is ParityMetric => x !== null),
    lineage,
    implementedPercent,
    adoptionHealth: computeAdoptionHealth(implementedPercent, verdict),
    classifier: computeClassifier(verdict, features),
  };
}

function sortEntries(entries: ParityEntry[]): ParityEntry[] {
  return entries.sort((a, b) => {
    const dateDelta = (b.measured_at || "").localeCompare(a.measured_at || "");
    if (dateDelta !== 0) return dateDelta;
    const priorityDelta = priorityRank(a.priority) - priorityRank(b.priority);
    if (priorityDelta !== 0) return priorityDelta;
    return a.target.localeCompare(b.target);
  });
}

export function getParityEntries(): ParityEntry[] {
  return cachedEntries;
}

export async function fetchParityEntries(): Promise<ParityEntry[]> {
  const response = await fetch(`${API_BASE}/parity/scorecard`);
  if (!response.ok) {
    throw new Error(`Failed to fetch parity scorecard: ${response.statusText}`);
  }
  const payload: unknown = await response.json();
  if (!isGeneratedScorecard(payload)) {
    throw new Error("Parity scorecard response contract invalid");
  }
  cachedEntries = sortEntries(payload.targets.map(enrichEntry));
  return cachedEntries;
}
