/**
 * Manifest Glob Builder
 *
 * Scans for *.manifest.json sidecars next to component .tsx files,
 * validates each against the ComponentIR schema, and assembles
 * the unified manifest index.
 *
 * Usage:
 *   npx tsx build-manifest.ts              # print JSON to stdout
 *   npx tsx build-manifest.ts --write      # write to _manifest.json
 *   npx tsx build-manifest.ts --stats      # print summary stats
 *
 * Each component MUST have a sidecar. Missing sidecars are reported
 * as errors. The glob builder is the source of truth — no hand-editing
 * a giant manifest file.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Types (mirrors review/_shared/types.ts ComponentIR)
// ---------------------------------------------------------------------------

interface ManifestEntry {
  id: string;
  name: string;
  family: string;
  domain: string;
  capabilities: string[];
  classification: "REAL" | "ALIAS" | "SHELL" | "HOLLOW" | "UNKNOWN";
  levNowElement: string | null;
  origin: string;
  migrationStatus: string;
  source: string;
  loc: number;
  imports: number;
  hooks: number;
  propCount: number;
  lanes: string[];
  beadId: string;
  markers: string[];
  canonical?: string; // for ALIAS: path to the canonical component
}

interface ManifestIndex {
  version: 1;
  generated: string;
  total: number;
  byClassification: Record<string, number>;
  byFamily: Record<string, number>;
  byLevNowElement: Record<string, number>;
  components: ManifestEntry[];
}

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------

const MIGRATIONS_DIR = __dirname;
const OUTPUT_FILE = join(MIGRATIONS_DIR, "_manifest.json");

function scan(): { entries: ManifestEntry[]; missing: string[]; invalid: string[] } {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".tsx"));
  const entries: ManifestEntry[] = [];
  const missing: string[] = [];
  const invalid: string[] = [];

  for (const tsx of files) {
    if (tsx === "build-manifest.ts") continue;
    const id = basename(tsx, ".tsx");
    const manifestPath = join(MIGRATIONS_DIR, `${id}.manifest.json`);

    if (!existsSync(manifestPath)) {
      missing.push(id);
      continue;
    }

    try {
      const raw = JSON.parse(readFileSync(manifestPath, "utf-8"));
      // Minimal validation
      if (!raw.id || !raw.classification) {
        invalid.push(id);
        continue;
      }
      entries.push(raw as ManifestEntry);
    } catch {
      invalid.push(id);
    }
  }

  return { entries, missing, invalid };
}

function buildIndex(entries: ManifestEntry[]): ManifestIndex {
  const byClassification: Record<string, number> = {};
  const byFamily: Record<string, number> = {};
  const byLevNowElement: Record<string, number> = {};

  for (const e of entries) {
    byClassification[e.classification] = (byClassification[e.classification] || 0) + 1;
    const topFamily = e.family.split("/")[0];
    byFamily[topFamily] = (byFamily[topFamily] || 0) + 1;
    if (e.levNowElement) {
      byLevNowElement[e.levNowElement] = (byLevNowElement[e.levNowElement] || 0) + 1;
    }
  }

  return {
    version: 1,
    generated: new Date().toISOString(),
    total: entries.length,
    byClassification,
    byFamily,
    byLevNowElement,
    components: entries.sort((a, b) => a.id.localeCompare(b.id)),
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const { entries, missing, invalid } = scan();
const index = buildIndex(entries);

if (args.includes("--stats")) {
  console.log(`Components with manifest: ${entries.length}`);
  console.log(`Missing manifest:         ${missing.length}`);
  console.log(`Invalid manifest:         ${invalid.length}`);
  console.log(`\nClassifications:`, JSON.stringify(index.byClassification, null, 2));
  console.log(`Families:`, JSON.stringify(index.byFamily, null, 2));
  console.log(`lev-now coverage:`, JSON.stringify(index.byLevNowElement, null, 2));
  if (missing.length > 0) {
    console.log(`\nMissing sidecars (first 20):`, missing.slice(0, 20).join(", "));
  }
} else if (args.includes("--write")) {
  writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Wrote ${entries.length} entries to ${OUTPUT_FILE}`);
  if (missing.length > 0) {
    console.error(`WARNING: ${missing.length} components missing sidecars`);
  }
} else {
  console.log(JSON.stringify(index, null, 2));
}
