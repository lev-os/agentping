import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DmAnalyticsPanel,
  DmDashboardList,
  type DmDashboardSummary,
} from "@kingly/ui/components";

import { dashboardAPI } from "../api/client";
import type { Dashboard } from "../types/dashboard";

function toDashboardSummary(dashboard: Dashboard): DmDashboardSummary {
  return {
    id: dashboard.id,
    config: {
      name: dashboard.config.name,
      port_range: dashboard.config.port_range,
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

  return (
    <div className="space-y-6">
      <DmAnalyticsPanel dashboards={dashboards} />
      <DmDashboardList
        dashboards={dashboards.map(toDashboardSummary)}
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
  );
}
