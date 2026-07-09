import { useEffect, useState } from "react";

import {
  fetchPluginHealth,
  type PluginHealth,
  type ResearchAdapter,
} from "../api/heartbeat";
import type { Dashboard } from "../types/dashboard";

function adapterDotColor(adapter: ResearchAdapter): string {
  if (!adapter.available) return "#ef4444";
  if (adapter.degradedReason) return "#f59e0b";
  return "#22c55e";
}

function AdapterCard({ adapter }: { adapter: ResearchAdapter }) {
  const caps = adapter.capabilities ?? [];
  return (
    <div
      className="command-center-frame"
      style={{ padding: "10px 12px", minWidth: 140, flex: "1 1 160px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: adapterDotColor(adapter),
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--kingly-text, #e5e7eb)" }}>
          {adapter.name}
        </span>
      </div>
      {caps.length > 0 ? (
        <div className="command-center-section__meta" style={{ margin: 0, fontSize: 11 }}>
          {caps.join(", ")}
        </div>
      ) : null}
      {adapter.degradedReason ? (
        <div style={{ marginTop: 4, fontSize: 11, color: "#f59e0b" }}>
          {adapter.degradedReason}
        </div>
      ) : null}
    </div>
  );
}

function pluginChipLabel(name: string, version: string | null): string {
  return version == null ? name : `${name}@${version}`;
}

export function PluginHealthSection({ dashboards }: { dashboards: Dashboard[] }) {
  const [health, setHealth] = useState<PluginHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const next = await fetchPluginHealth();
        if (cancelled) return;
        setHealth(next);
      } catch (err) {
        if (cancelled) return;
        setHealth(null);
        setError(err instanceof Error ? err.message : "Failed to load plugin health");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onlineSurfaces = dashboards.filter((d) => d.status.status === "online").length;
  const surfaceTotal = dashboards.length;

  let metaLine = `${onlineSurfaces}/${surfaceTotal} surfaces online`;
  if (health) {
    let researchMeta: string;
    if ("error" in health.research) {
      researchMeta = "research unavailable";
    } else {
      researchMeta = `${health.research.counts.available}/${health.research.counts.total} research adapters`;
    }
    metaLine = `${researchMeta} · ${health.plugins.length} plugins · ${onlineSurfaces}/${surfaceTotal} surfaces online`;
  }

  return (
    <section className="command-center-section">
      <div className="command-center-section__header">
        <div>
          <h2 className="command-center-section__title">Plugin Health</h2>
          <p className="command-center-section__meta">{metaLine}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="projects-empty">Checking plugin health…</div>
      ) : error ? (
        <div className="projects-empty projects-empty--error">{error}</div>
      ) : health ? (
        <>
          <div>
            <div
              className="command-center-section__meta"
              style={{ marginBottom: 8, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Research Adapters
            </div>
            {"error" in health.research ? (
              <div className="command-center-section__meta">
                research status unavailable: {health.research.error}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {health.research.adapters.map((adapter) => (
                  <AdapterCard key={adapter.name} adapter={adapter} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div
              className="command-center-section__meta"
              style={{ marginBottom: 8, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Installed Plugins
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {health.plugins.map((plugin) => (
                <code
                  key={`${plugin.dir}-${plugin.name}`}
                  title={plugin.dir}
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "var(--kingly-text-muted, #9ca3af)",
                    fontFamily: "var(--font-mono, ui-monospace, monospace)",
                  }}
                >
                  {pluginChipLabel(plugin.name, plugin.version)}
                </code>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
