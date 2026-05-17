"use client";

/**
 * Navigator — Catalog component from Studio
 *
 * Thin wrapper that delegates to NavigatorWithDashboards.
 *
 * @source packages/studio/src/renderer/components/Navigator.tsx
 * @catalog-status complete
 * @category root
 */

import React from "react";
import { NavigatorWithDashboards, type NavigatorWithDashboardsProps } from "./navigator-with-dashboards";

export function Navigator(props: NavigatorWithDashboardsProps) {
  return <NavigatorWithDashboards {...props} />;
}
