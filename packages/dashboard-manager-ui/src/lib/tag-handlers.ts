/**
 * Dashboard Tag Handlers
 *
 * Maps [[dashboard:action]] tags to dashboard-manager-ui actions.
 * Consumed by the tag DSL parser when rendering /now pages that
 * contain dashboard commands.
 *
 * Each handler receives an optional params string and performs
 * a side-effect (navigation, fetch, reload). Handlers are
 * intentionally simple — they delegate to the browser or API
 * rather than importing React internals.
 */

export interface DashboardTagHandler {
  description: string;
  handler: (params?: string) => void | Promise<void>;
}

export const DASHBOARD_TAG_HANDLERS = {
  scope: "dashboard" as const,
  actions: {
    refresh: {
      description: "Refresh current dashboard view",
      handler: () => {
        window.location.reload();
      },
    },
    filter: {
      description: "Filter by lane, runtime, status, lifecycle, runnable",
      handler: (params?: string) => {
        if (!params) return;
        const url = new URL(window.location.href);
        const [key, value] = params.split("=");
        if (key && value) {
          url.searchParams.set(key, value);
          window.location.href = url.toString();
        }
      },
    },
    open: {
      description: "Navigate to project or dashboard detail",
      handler: (id?: string) => {
        if (!id) return;
        window.location.href = `/dashboard/${id}`;
      },
    },
    restart: {
      description: "Restart dashboard via API",
      handler: async (id?: string) => {
        if (!id) return;
        await fetch(`/api/dashboards/${id}/restart`, { method: "POST" });
      },
    },
    scan: {
      description: "Trigger workspace rescan",
      handler: async () => {
        // Future: POST /api/projects/scan
        console.log("[[dashboard:scan]] requested — not yet wired");
      },
    },
    setup: {
      description: "Run detected-to-ready setup",
      handler: (id?: string) => {
        if (!id) return;
        window.location.href = `/?setup=${id}`;
      },
    },
    stats: {
      description: "Show project statistics",
      handler: () => {
        window.location.href = "/projects";
      },
    },
  } satisfies Record<string, DashboardTagHandler>,
} as const;

export type DashboardAction = keyof typeof DASHBOARD_TAG_HANDLERS.actions;

/**
 * Dispatch a [[dashboard:action params]] tag.
 * Returns true if the action was handled, false if unknown.
 */
export function dispatchDashboardTag(
  action: string,
  params?: string,
): boolean {
  const entry =
    DASHBOARD_TAG_HANDLERS.actions[
      action as keyof typeof DASHBOARD_TAG_HANDLERS.actions
    ];
  if (!entry) return false;
  entry.handler(params);
  return true;
}
