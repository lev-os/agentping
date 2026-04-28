/**
 * build-clusters.ts — Group @kingly/ui migration components into similarity clusters.
 *
 * Clustering key (priority):
 *   1. levNowElement         — "all card-like things", "all hero-like things"
 *   2. family + classification — "foundations/forms REAL", "domain/chat REAL"
 *   3. fallback               — singleton (own cluster)
 *
 * Emits clusters.json: { clusters: [{ id, key, levNowElement?, family?, members: [ids], count, origins: {...} }] }
 *
 * Usage:  npx tsx tools/build-clusters.ts [--write]
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = resolve(
  __dirname,
  "..",
  "src",
  "components",
  "migrations",
  "_manifest.json",
);
const OUT_PATH = resolve(
  __dirname,
  "..",
  "src",
  "components",
  "migrations",
  "clusters.json",
);

interface Component {
  id: string;
  name: string;
  family: string;
  classification: string;
  levNowElement: string | null;
  origin: string;
  capabilities?: string[];
}

interface Cluster {
  id: string;
  key: string;
  reason: "levNowElement" | "family+classification" | "singleton";
  levNowElement: string | null;
  family: string | null;
  classification: string | null;
  members: string[];
  count: number;
  origins: Record<string, number>;
}

async function main() {
  const raw = await readFile(MANIFEST_PATH, "utf-8");
  const manifest = JSON.parse(raw) as { components: Component[] };
  const comps = manifest.components;

  const byKey = new Map<string, Component[]>();
  const reasonByKey = new Map<string, Cluster["reason"]>();

  for (const c of comps) {
    let key: string;
    let reason: Cluster["reason"];

    if (c.levNowElement) {
      key = `lev-now:${c.levNowElement}`;
      reason = "levNowElement";
    } else {
      key = `family:${c.family}:${c.classification}`;
      reason = "family+classification";
    }

    if (!byKey.has(key)) {
      byKey.set(key, []);
      reasonByKey.set(key, reason);
    }
    byKey.get(key)!.push(c);
  }

  // Convert to clusters. If a cluster has only 1 member, mark as singleton.
  const clusters: Cluster[] = [];
  let idx = 0;
  for (const [key, members] of byKey.entries()) {
    const origins: Record<string, number> = {};
    for (const m of members) {
      origins[m.origin] = (origins[m.origin] ?? 0) + 1;
    }
    const reason = members.length === 1 ? "singleton" : reasonByKey.get(key)!;
    const first = members[0];
    clusters.push({
      id: `c${String(idx++).padStart(3, "0")}`,
      key,
      reason,
      levNowElement: first.levNowElement,
      family: reason.startsWith("family") ? first.family : null,
      classification: reason.startsWith("family") ? first.classification : null,
      members: members.map((m) => m.id),
      count: members.length,
      origins,
    });
  }

  // Sort: largest multi-member clusters first; singletons last.
  clusters.sort((a, b) => {
    if (a.reason === "singleton" && b.reason !== "singleton") return 1;
    if (b.reason === "singleton" && a.reason !== "singleton") return -1;
    return b.count - a.count;
  });

  const multi = clusters.filter((c) => c.reason !== "singleton");
  const single = clusters.filter((c) => c.reason === "singleton");

  const out = {
    generated: new Date().toISOString(),
    total_components: comps.length,
    total_clusters: clusters.length,
    multi_member_clusters: multi.length,
    singleton_clusters: single.length,
    clusters,
  };

  const write = process.argv.includes("--write");
  if (write) {
    await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf-8");
    console.log(`Wrote ${OUT_PATH}`);
  }

  console.log(
    `total=${comps.length} clusters=${clusters.length} multi=${multi.length} single=${single.length}`,
  );
  console.log("top 15 multi-member clusters:");
  for (const c of multi.slice(0, 15)) {
    console.log(
      `  ${c.id} [${c.key}] count=${c.count} origins=${JSON.stringify(c.origins)}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
