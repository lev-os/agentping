import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  DmDashboardList,
  SafeDispatchCockpit,
  type DmDashboardSummary,
  type SafeDispatchAction,
  type SafeDispatchCockpitProps,
  type SafeDispatchState,
} from "@kingly/ui/components";

import { dashboardAPI } from "../api/client";
import type { Dashboard } from "../types/dashboard";
import {
  getDashboardUrl,
  getPrimaryDashboard,
  groupDashboardsByLane,
} from "../lib/command-center";
import { ParitySection } from "./ParitySection";
import { SetupPanel } from "./SetupPanel";
import { WorkflowSection } from "./WorkflowSection";

function toDashboardSummary(dashboard: Dashboard): DmDashboardSummary {
  return {
    id: dashboard.id,
    config: {
      name: dashboard.config.name,
      port_range: dashboard.config.port_range,
      metadata: dashboard.config.metadata ? {
        lifecycle: dashboard.config.metadata.lifecycle,
        runtime: dashboard.config.metadata.runtime,
        framework: dashboard.config.metadata.framework,
      } : undefined,
    },
    status: {
      status: dashboard.status.status,
      healthy: dashboard.status.healthy,
      port: dashboard.status.port,
      pid: dashboard.status.pid,
      restartAttempts: dashboard.status.restartAttempts,
      startedAt: dashboard.status.startedAt,
    },
  };
}

function toDispatchState(dashboard?: Dashboard): SafeDispatchState {
  if (!dashboard) return "offline";
  if (dashboard.status.status === "starting") return "running";
  if (dashboard.status.status === "online") {
    return dashboard.status.healthy === false ? "blocked" : "ready";
  }
  if (dashboard.status.status === "failed") return "blocked";
  return "offline";
}

function buildSafeDispatchCockpitModel(
  dashboards: Dashboard[],
  primary: Dashboard | undefined,
  primaryUrl: string | null,
): Pick<SafeDispatchCockpitProps, "workstreams" | "providers" | "sessions" | "actions"> {
  const onlineCount = dashboards.filter((dashboard) => dashboard.status.status === "online").length;
  const failedDashboards = dashboards.filter((dashboard) => dashboard.status.status === "failed");
  const failedCount = failedDashboards.length;
  const interactionSurface = dashboards.find((dashboard) => dashboard.config.metadata?.lane === "interaction");
  const managerSurface = dashboards.find((dashboard) => dashboard.id === "dashboard-manager-ui");
  const interactionUrl = getDashboardUrl(interactionSurface);
  const managerUrl = getDashboardUrl(managerSurface);

  return {
    workstreams: [
      {
        id: "primary-surface-health",
        title: "Primary surface health",
        state: primary ? toDispatchState(primary) : "preview",
        activeRuns: primary?.status.status === "online" ? 1 : 0,
        nextAction: primaryUrl
          ? `${primary?.config.name} is reachable at ${primaryUrl}.`
          : "No online primary surface is available.",
        gate: primary?.id ?? "primary-surface",
      },
      {
        id: "dashboard-fleet",
        title: "Dashboard fleet",
        state: onlineCount > 0 ? "running" : "offline",
        activeRuns: onlineCount,
        nextAction: `${onlineCount} of ${dashboards.length} registered surfaces are online.`,
        gate: "dashboard-runner",
      },
      {
        id: "failed-surfaces",
        title: "Failed surfaces",
        state: failedCount > 0 ? "blocked" : "ready",
        activeRuns: failedCount,
        nextAction: failedCount > 0
          ? failedDashboards.map((dashboard) => dashboard.config.name).join(", ")
          : "No registered surfaces are failed.",
        gate: "health-checks",
      },
    ],
    providers: [
      {
        id: "dashboard-runner",
        label: "Dashboard runner",
        kind: "runner",
        state: dashboards.length > 0 ? "ready" : "preview",
        detail: `${dashboards.length} hosted surfaces reported`,
        lease: "none",
      },
      {
        id: "dashboard-manager-ui",
        label: "Dashboard Manager UI",
        kind: "daemon",
        state: toDispatchState(managerSurface),
        detail: managerUrl ? `Running at ${managerUrl}` : "Manager surface is not online",
        lease: "none",
      },
      {
        id: "interaction-surface",
        label: "AgentPing Web UI",
        kind: "daemon",
        state: toDispatchState(interactionSurface),
        detail: interactionUrl ? `Running at ${interactionUrl}` : "Interaction shell is not online",
        lease: "none",
      },
      {
        id: "acp-mcp",
        label: "ACP/MCP readiness",
        kind: "acp",
        state: "preview",
        detail: "Provider sync is not wired yet; this is still a planned lane",
        lease: "required",
      },
    ],
    sessions: [
      {
        id: primary?.id ?? "primary-surface",
        label: primary?.config.name ?? "Primary ops surface",
        substrate: "dashboard",
        state: toDispatchState(primary),
        detail: primaryUrl ? primaryUrl : "No live primary surface selected",
      },
      {
        id: "hosted-surfaces",
        label: "Hosted dashboard surfaces",
        substrate: "dashboard",
        state: onlineCount > 0 ? "running" : "offline",
        detail: `${onlineCount} online / ${dashboards.length} total`,
      },
      {
        id: interactionSurface?.id ?? "interaction-surface",
        label: interactionSurface?.config.name ?? "Interaction surface",
        substrate: "dashboard",
        state: toDispatchState(interactionSurface),
        detail: interactionUrl ?? "No online interaction surface selected",
      },
    ],
    actions: [
      {
        id: "refresh-runtime",
        label: "Refresh runtime",
        description: "Reload dashboard runner API state.",
        state: "ready",
      },
      {
        id: "open-primary",
        label: "Open primary surface",
        description: primaryUrl
          ? "Open the selected primary dashboard surface."
          : "Requires an online primary dashboard.",
        state: primaryUrl ? "ready" : "blocked",
      },
      {
        id: "open-interaction",
        label: "Open interaction surface",
        description: interactionUrl
          ? "Open the AgentPing Web UI surface."
          : "Requires an online interaction dashboard.",
        state: interactionUrl ? "ready" : "blocked",
      },
      {
        id: "dispatch-proof",
        label: "Preview dispatch",
        description: "No-op dispatch preview; Poly/ACP execution is not wired yet.",
        state: "preview",
        leaseRequired: true,
      },
    ],
  };
}

export function DashboardList() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRestartingPrimary, setIsRestartingPrimary] = useState(false);
  const [setupTarget, setSetupTarget] = useState<string | null>(null);
  const [lastDispatchEvent, setLastDispatchEvent] = useState<string | null>(null);

  async function loadDashboards() {
    setIsLoading(true);
    setError(null);

    try {
      const nextDashboards = await dashboardAPI.listDashboards();
      setDashboards(Array.isArray(nextDashboards) ? nextDashboards : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboards");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboards();
  }, []);

  const grouped = groupDashboardsByLane(dashboards);
  const primary = getPrimaryDashboard(dashboards);
  const primaryUrl = getDashboardUrl(primary);
  const dispatchCockpit = buildSafeDispatchCockpitModel(dashboards, primary, primaryUrl);

  async function restartPrimaryDashboard() {
    if (!primary) return;
    setIsRestartingPrimary(true);
    try {
      await dashboardAPI.restartDashboard(primary.id);
      await loadDashboards();
    } finally {
      setIsRestartingPrimary(false);
    }
  }

  function handleDispatchAction(action: SafeDispatchAction) {
    if (action.id === "refresh-runtime") {
      setLastDispatchEvent("Runtime refresh requested from safe dispatch cockpit.");
      void loadDashboards();
      return;
    }

    if (action.id === "open-primary" && primaryUrl) {
      setLastDispatchEvent("Primary surface opened from guarded action lane.");
      window.open(primaryUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.id === "open-interaction") {
      const interactionSurface = dashboards.find((dashboard) => dashboard.config.metadata?.lane === "interaction");
      const interactionUrl = getDashboardUrl(interactionSurface);
      if (interactionUrl) {
        setLastDispatchEvent("Interaction surface opened from guarded action lane.");
        window.open(interactionUrl, "_blank", "noopener,noreferrer");
        return;
      }
    }

    setLastDispatchEvent(`${action.label} captured in preview mode; no dispatch was executed.`);
  }

  return (
    <div className="command-center-page">
      <div className="command-center-shell">
        <section
          className="command-center-section"
          style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}
        >
          <Link to="/registry" className="command-center-button">
            Registry →
          </Link>
          <Link to="/projects" className="command-center-button">
            Projects →
          </Link>
        </section>

        <section className="command-center-stats">
          <div className="command-center-stat">
            <div className="command-center-stat__label">Total Dashboards</div>
            <div className="command-center-stat__value" style={{ color: "#3b82f6" }}>
              {dashboards.length}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">Online</div>
            <div className="command-center-stat__value" style={{ color: "#22c55e" }}>
              {dashboards.filter((dashboard) => dashboard.status.status === "online").length}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">Total Restarts</div>
            <div className="command-center-stat__value" style={{ color: "#f59e0b" }}>
              {dashboards.reduce((sum, dashboard) => sum + dashboard.status.restartAttempts, 0)}
            </div>
          </div>
          <div className="command-center-stat">
            <div className="command-center-stat__label">Failed</div>
            <div className="command-center-stat__value" style={{ color: "#ef4444" }}>
              {dashboards.filter((dashboard) => dashboard.status.status === "failed").length}
            </div>
          </div>
        </section>

        {primary ? (
          <section className="command-center-hero">
            <div>
              <div className="command-center-hero__eyebrow">
                Primary Ops Surface
              </div>
              <h1 className="command-center-hero__title">
                {primary.config.name}
              </h1>
              <p className="command-center-hero__description">
                {primary.config.metadata?.description ??
                  "Live ops dashboard surfaced through AgentPing host runtime."}
              </p>
            </div>

            <div className="command-center-hero__actions">
              <button
                className="command-center-button"
                onClick={() => navigate(`/dashboard/${primary.id}`)}
              >
                View details
              </button>
              <button
                className="command-center-button"
                disabled={isRestartingPrimary}
                onClick={() => {
                  void restartPrimaryDashboard();
                }}
              >
                {isRestartingPrimary ? "Restarting..." : "Restart"}
              </button>
              {primaryUrl ? (
                <button
                  className="command-center-button command-center-button--primary"
                  onClick={() => {
                    window.open(primaryUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  Open live surface
                </button>
              ) : null}
            </div>

            <div className="command-center-hero__status-grid">
              <div className="command-center-status-card">
                <div className="command-center-status-card__label">Status</div>
                <div className="command-center-status-card__value">
                  {primary.status.status}
                </div>
              </div>
              <div className="command-center-status-card">
                <div className="command-center-status-card__label">Healthy</div>
                <div className="command-center-status-card__value">
                  {primary.status.healthy === undefined
                    ? "Unknown"
                    : primary.status.healthy
                      ? "Yes"
                      : "No"}
                </div>
              </div>
              <div className="command-center-status-card">
                <div className="command-center-status-card__label">Port</div>
                <div className="command-center-status-card__value">
                  {primary.status.port ?? "—"}
                </div>
              </div>
              <div className="command-center-status-card">
                <div className="command-center-status-card__label">Restarts</div>
                <div className="command-center-status-card__value">
                  {primary.status.restartAttempts}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <SafeDispatchCockpit
          {...dispatchCockpit}
          lastEvent={lastDispatchEvent ?? undefined}
          onAction={handleDispatchAction}
        />

        {grouped.apps.length > 0 ? (
          <section className="command-center-section">
            <div className="command-center-section__header">
              <div>
                <h2 className="command-center-section__title">Apps</h2>
                <p className="command-center-section__meta">
                  {grouped.apps.length} app{grouped.apps.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="command-center-frame">
              <DmDashboardList
                dashboards={grouped.apps.map(toDashboardSummary)}
                isLoading={isLoading}
                error={error}
                onRetry={() => {
                  void loadDashboards();
                }}
                onRowClick={(dashboard) => {
                  navigate(`/dashboard/${dashboard.id}`);
                }}
                onViewDetails={(dashboardId) => {
                  navigate(`/dashboard/${dashboardId}`);
                }}
                onSetup={setSetupTarget}
                setupRunningId={setupTarget}
              />
            </div>
          </section>
        ) : null}

        <WorkflowSection />

        {/* Parity Registry */}
        <ParitySection />

        <section className="command-center-section">
          <div className="command-center-section__header">
            <div>
              <h2 className="command-center-section__title">Interaction Surfaces</h2>
              <p className="command-center-section__meta">
                {grouped.interaction.length} surface{grouped.interaction.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="command-center-frame">
            <DmDashboardList
              dashboards={grouped.interaction.map(toDashboardSummary)}
              isLoading={isLoading}
              error={error}
              onRetry={() => {
                void loadDashboards();
              }}
              onRowClick={(dashboard) => {
                navigate(`/dashboard/${dashboard.id}`);
              }}
              onViewDetails={(dashboardId) => {
                navigate(`/dashboard/${dashboardId}`);
              }}
            />
          </div>
        </section>

        <section className="command-center-section">
          <div className="command-center-section__header">
            <div>
              <h2 className="command-center-section__title">Development Surfaces</h2>
              <p className="command-center-section__meta">
                {grouped.development.length} surface{grouped.development.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="command-center-frame">
            <DmDashboardList
              dashboards={grouped.development.map(toDashboardSummary)}
              isLoading={isLoading}
              error={error}
              onRetry={() => {
                void loadDashboards();
              }}
              onRowClick={(dashboard) => {
                navigate(`/dashboard/${dashboard.id}`);
              }}
              onViewDetails={(dashboardId) => {
                navigate(`/dashboard/${dashboardId}`);
              }}
            />
          </div>
        </section>

        {grouped.ops.filter((dashboard) => dashboard.id !== primary?.id).length > 0 ? (
          <section className="command-center-section">
            <div className="command-center-section__header">
              <div>
                <h2 className="command-center-section__title">Ops Surfaces</h2>
                <p className="command-center-section__meta">
                  {grouped.ops.filter((dashboard) => dashboard.id !== primary?.id).length} surface{grouped.ops.filter((dashboard) => dashboard.id !== primary?.id).length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="command-center-frame">
              <DmDashboardList
                dashboards={grouped.ops.filter((dashboard) => dashboard.id !== primary?.id).map(toDashboardSummary)}
                isLoading={isLoading}
                error={error}
                onRetry={() => {
                  void loadDashboards();
                }}
                onRowClick={(dashboard) => {
                  navigate(`/dashboard/${dashboard.id}`);
                }}
                onViewDetails={(dashboardId) => {
                  navigate(`/dashboard/${dashboardId}`);
                }}
              />
            </div>
          </section>
        ) : null}
      </div>

      <SetupPanel
        dashboardId={setupTarget}
        onClose={() => {
          setSetupTarget(null);
          void loadDashboards();
        }}
      />
    </div>
  );
}
