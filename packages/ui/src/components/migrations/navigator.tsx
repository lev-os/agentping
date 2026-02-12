"use client";

/**
 * Navigator — Migration candidate from Studio
 *
 * Thin wrapper that delegates to NavigatorWithDashboards.
 *
 * @source packages/studio/src/renderer/components/Navigator.tsx
 * @migration-status complete
 * @category root
 */

import React from "react";
import { NavigatorWithDashboards, type NavigatorWithDashboardsProps } from "./navigator-with-dashboards";

export function Navigator(props: NavigatorWithDashboardsProps) {
  return <NavigatorWithDashboards {...props} />;
}
