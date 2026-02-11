/**
 * @kingly/ui - Loading State Provider
 *
 * Global loading state management with localStorage persistence
 * Enables simulated loading states for development and testing
 */

"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { LoadingStateContextValue, PersistedLoadingState, WidgetLoadingState } from "./types";

const STORAGE_KEY = "sofia-dashboard-loading-state";

const defaultState: PersistedLoadingState = {
  simulatedLoading: false,
  lastToggled: new Date().toISOString(),
  widgetStates: {},
};

const LoadingStateContext = createContext<LoadingStateContextValue | null>(null);

// Default simulation duration (ms)
const DEFAULT_SIMULATION_DURATION = 2500;

/**
 * Load state from localStorage
 */
function loadStateFromStorage(): PersistedLoadingState {
  if (typeof window === "undefined") return defaultState;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    
    const parsed = JSON.parse(stored) as PersistedLoadingState;
    return {
      ...defaultState,
      ...parsed,
    };
  } catch (error) {
    console.error("[LoadingStateProvider] Failed to load state from localStorage:", error);
    return defaultState;
  }
}

/**
 * Save state to localStorage
 */
function saveStateToStorage(state: PersistedLoadingState): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("[LoadingStateProvider] Failed to save state to localStorage:", error);
  }
}

interface LoadingStateProviderProps {
  children: ReactNode;
}

/**
 * Provider component for loading state management
 */
export function LoadingStateProvider({ children }: LoadingStateProviderProps) {
  // Initialize from localStorage
  const [state, setState] = useState<PersistedLoadingState>(() => loadStateFromStorage());

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Auto-disable simulated loading after duration
  useEffect(() => {
    if (!state.simulatedLoading) return;

    const timer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        simulatedLoading: false,
      }));
    }, DEFAULT_SIMULATION_DURATION);

    return () => clearTimeout(timer);
  }, [state.simulatedLoading]);

  /**
   * Toggle global simulated loading
   */
  const toggleSimulatedLoading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      simulatedLoading: !prev.simulatedLoading,
      lastToggled: new Date().toISOString(),
    }));
  }, []);

  /**
   * Get loading state for specific widget
   */
  const getWidgetLoadingState = useCallback((widgetId: string): WidgetLoadingState => {
    return state.widgetStates[widgetId] || "idle";
  }, [state.widgetStates]);

  /**
   * Set loading state for specific widget
   */
  const setWidgetLoadingState = useCallback((widgetId: string, loadingState: WidgetLoadingState) => {
    setState((prev) => ({
      ...prev,
      widgetStates: {
        ...prev.widgetStates,
        [widgetId]: loadingState,
      },
    }));
  }, []);

  /**
   * Manually persist state to localStorage
   */
  const persistState = useCallback(() => {
    saveStateToStorage(state);
  }, [state]);

  /**
   * Clear all state from localStorage
   */
  const clearState = useCallback(() => {
    setState(defaultState);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value: LoadingStateContextValue = {
    isSimulatedLoading: state.simulatedLoading,
    toggleSimulatedLoading,
    getWidgetLoadingState,
    setWidgetLoadingState,
    persistState,
    clearState,
  };

  return (
    <LoadingStateContext.Provider value={value}>
      {children}
    </LoadingStateContext.Provider>
  );
}

/**
 * Hook to access loading state context
 */
export function useLoadingState(): LoadingStateContextValue {
  const context = useContext(LoadingStateContext);
  
  if (!context) {
    throw new Error("useLoadingState must be used within LoadingStateProvider");
  }
  
  return context;
}
