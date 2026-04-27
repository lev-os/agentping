// Parity Registry — competitive analysis data
// Source of truth: .lev/pm/parity/*.yaml
// Keep this module hot so new parity rows surface in the live dashboard.

import { parse } from "yaml";

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

interface RawParityEntry {
  target?: unknown;
  repo?: unknown;
  category?: unknown;
  verdict?: unknown;
  measured_at?: unknown;
  updated_at?: unknown;
  priority?: unknown;
  owner?: unknown;
  features?: unknown;
  metrics?: unknown;
  lineage?: unknown;
}

const RAW_PARITY_MODULES = import.meta.glob(
  "../../../../../../.lev/pm/parity/*.yaml",
  {
    eager: true,
    query: "?raw",
    import: "default",
  },
) as Record<string, string>;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeFeature(raw: unknown): ParityFeature | null {
  if (!isObject(raw) || typeof raw.name !== "string" || typeof raw.status !== "string") {
    return null;
  }

  const validStatus = new Set(["implemented", "partial", "missing", "not-applicable"]);
  if (!validStatus.has(raw.status)) return null;

  return {
    id:
      typeof raw.id === "string"
        ? raw.id
        : raw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: raw.name,
    status: raw.status as ParityFeature["status"],
    lev_equivalent:
      typeof raw.lev_equivalent === "string" ? raw.lev_equivalent : "—",
    action: typeof raw.action === "string" ? raw.action : "—",
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
  };
}

function normalizeMetric(raw: unknown): ParityMetric | null {
  if (!isObject(raw) || typeof raw.name !== "string") return null;
  const value = raw.value;
  if (typeof value !== "number" && typeof value !== "string") return null;

  return {
    name: raw.name,
    value,
    unit: typeof raw.unit === "string" ? raw.unit : "",
    source: typeof raw.source === "string" ? raw.source : undefined,
  };
}

function normalizeEntry(raw: RawParityEntry): Omit<ParityEntry, "adoptionHealth" | "implementedPercent" | "classifier"> | null {
  if (typeof raw.target !== "string" || typeof raw.category !== "string" || typeof raw.verdict !== "string") {
    return null;
  }

  return {
    target: raw.target,
    repo: typeof raw.repo === "string" ? raw.repo : "",
    category: raw.category,
    verdict: raw.verdict,
    measured_at:
      typeof raw.measured_at === "string"
        ? raw.measured_at
        : typeof raw.updated_at === "string"
          ? raw.updated_at
          : "",
    priority: typeof raw.priority === "string" ? raw.priority : undefined,
    owner: typeof raw.owner === "string" ? raw.owner : undefined,
    features: Array.isArray(raw.features)
      ? raw.features.map(normalizeFeature).filter((value): value is ParityFeature => value !== null)
      : [],
    metrics: Array.isArray(raw.metrics)
      ? raw.metrics.map(normalizeMetric).filter((value): value is ParityMetric => value !== null)
      : [],
    lineage: Array.isArray(raw.lineage)
      ? raw.lineage.filter((value): value is string => typeof value === "string")
      : [],
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
  if (normalized.includes("reject") || normalized === "pass") return "red";
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

function parseRawEntries(): RawParityEntry[] {
  return Object.values(RAW_PARITY_MODULES)
    .map((raw) => {
      try {
        return parse(raw) as RawParityEntry;
      } catch {
        return null;
      }
    })
    .filter((value): value is RawParityEntry => Boolean(value));
}

function enrichEntry(raw: RawParityEntry): ParityEntry | null {
  const normalized = normalizeEntry(raw);
  if (!normalized) return null;

  const implementedPercent = computeImplementedPercent(normalized.features);
  return {
    ...normalized,
    implementedPercent,
    adoptionHealth: computeAdoptionHealth(implementedPercent, normalized.verdict),
    classifier: computeClassifier(normalized.verdict, normalized.features),
  };
}

export function getParityEntries(): ParityEntry[] {
  return parseRawEntries()
    .map(enrichEntry)
    .filter((value): value is ParityEntry => value !== null)
    .sort((a, b) => {
      const dateDelta = (b.measured_at || "").localeCompare(a.measured_at || "");
      if (dateDelta !== 0) return dateDelta;
      const priorityDelta = priorityRank(a.priority) - priorityRank(b.priority);
      if (priorityDelta !== 0) return priorityDelta;
      return a.target.localeCompare(b.target);
    });
}
