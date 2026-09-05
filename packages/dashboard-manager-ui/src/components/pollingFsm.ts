import type { AgentPingExecDebugPayload } from "../api/exec-traces";

export const MAX_CONSECUTIVE_FAILURES = 3;

export interface PollingFsmState {
  notFound: boolean;
  error: string | null;
  payload: AgentPingExecDebugPayload | null;
  autoRefresh: boolean;
  refreshPaused: boolean;
  consecutiveFailures: number;
}

export const INITIAL_POLLING_STATE: PollingFsmState = {
  notFound: false,
  error: null,
  payload: null,
  autoRefresh: true,
  refreshPaused: false,
  consecutiveFailures: 0,
};

export type PollingFsmAction =
  | { type: "fetched_ok"; data: AgentPingExecDebugPayload }
  | { type: "fetched_404" }
  | { type: "fetched_error"; error: string }
  | { type: "resume" }
  | { type: "toggle_refresh" }
  | { type: "execid_changed" };

export function pollingFsmReducer(
  state: PollingFsmState,
  action: PollingFsmAction,
): PollingFsmState {
  switch (action.type) {
    case "fetched_ok":
      return {
        ...state,
        payload: action.data,
        error: null,
        notFound: false,
        consecutiveFailures: 0,
      };
    case "fetched_404":
      return {
        ...state,
        notFound: true,
        payload: null,
        error: null,
        autoRefresh: false,
        refreshPaused: false,
        consecutiveFailures: 0,
      };
    case "fetched_error": {
      const next = state.consecutiveFailures + 1;
      return {
        ...state,
        error: action.error,
        consecutiveFailures: next,
        ...(next >= MAX_CONSECUTIVE_FAILURES
          ? { refreshPaused: true, autoRefresh: false }
          : {}),
      };
    }
    case "resume":
      return {
        ...state,
        refreshPaused: false,
        autoRefresh: true,
        consecutiveFailures: 0,
        error: null,
      };
    case "toggle_refresh":
      return { ...state, autoRefresh: !state.autoRefresh };
    case "execid_changed":
      return { ...INITIAL_POLLING_STATE };
  }
}
