/**
 * Dashboard Registry
 *
 * Factory registry for dashboard configuration management.
 * Inspired by ~/lev/core/agent-adapter/src/brain/registry.ts
 */

import type { DashboardConfig } from './types.js';

export class DashboardRegistry {
  private dashboards = new Map<string, DashboardConfig>();

  /**
   * Register a dashboard configuration
   */
  register(id: string, config: DashboardConfig): void {
    this.dashboards.set(id, config);
  }

  /**
   * Get a dashboard configuration by ID
   */
  get(id: string): DashboardConfig | undefined {
    return this.dashboards.get(id);
  }

  /**
   * Get all registered dashboards
   */
  list(): DashboardConfig[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Check if a dashboard is registered
   */
  has(id: string): boolean {
    return this.dashboards.has(id);
  }

  /**
   * Unregister a dashboard
   */
  unregister(id: string): boolean {
    return this.dashboards.delete(id);
  }

  /**
   * Clear all dashboards
   */
  clear(): void {
    this.dashboards.clear();
  }

  /**
   * Get dashboard count
   */
  size(): number {
    return this.dashboards.size;
  }
}

export const registry = new DashboardRegistry();
