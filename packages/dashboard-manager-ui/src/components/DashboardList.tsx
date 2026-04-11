import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { DmDashboardList, type DmDashboardSummary } from "@kingly/ui/components";

import { dashboardAPI } from "../api/client";
import type { Dashboard } from "../types/dashboard";
import {
  getDashboardUrl,
  getPrimaryDashboard,
  groupDashboardsByLane,
} from "../lib/command-center";
import { ParitySection } from "./ParitySection";
import { SetupPanel } from "./SetupPanel";

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

export function DashboardList() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRestartingPrimary, setIsRestartingPrimary] = useState(false);
  const [setupTarget, setSetupTarget] = useState<string | null>(null);

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

  return (
    <div className="command-center-page">
      <div className="command-center-shell">
        <section
          className="command-center-section"
          style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}
        >
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
