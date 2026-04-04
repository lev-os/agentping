import type { Dashboard } from "../types/dashboard";

export type DashboardLane = "ops" | "interaction" | "development";

export interface GroupedDashboards {
  ops: Dashboard[];
  interaction: Dashboard[];
  development: Dashboard[];
}

export function groupDashboardsByLane(dashboards: Dashboard[]): GroupedDashboards {
  const grouped: GroupedDashboards = {
    ops: [],
    interaction: [],
    development: [],
  };

  for (const dashboard of dashboards) {
    const lane = dashboard.config.metadata?.lane ?? "development";
    grouped[lane].push(dashboard);
  }

  return grouped;
}

export function getPrimaryDashboard(dashboards: Dashboard[]): Dashboard | undefined {
  return (
    dashboards.find((dashboard) => dashboard.config.metadata?.primary) ??
    dashboards.find((dashboard) => dashboard.config.metadata?.lane === "ops") ??
    dashboards[0]
  );
}

export function shouldEmbedDashboard(dashboard?: Dashboard): boolean {
  return Boolean(
    dashboard &&
      dashboard.config.metadata?.openMode === "embed" &&
      dashboard.status.status === "online" &&
      dashboard.status.port,
  );
}

export function getDashboardUrl(dashboard?: Dashboard): string | null {
  if (!dashboard?.status.port) return null;
  return `http://localhost:${dashboard.status.port}`;
}
