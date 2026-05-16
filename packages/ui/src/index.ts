/**
 * @kingly/ui
 *
 * SKYNET Design System - Main Entry Point
 *
 * A dark-mode-first, aerospace-inspired design system
 * featuring cyan accents and futuristic aesthetics.
 *
 * @example
 * ```tsx
 * // Import components
 * import { Button, Card } from "@kingly/ui/components";
 *
 * // Import theme tokens
 * import { colors, spacing } from "@kingly/ui/theme";
 *
 * // Import utilities
 * import { cn } from "@kingly/ui/lib";
 * ```
 */

// Re-export everything from submodules
export * from "./components";
export {
  LevNowElement,
  LevNowPacketRenderer,
  LEV_NOW_ELEMENT_MAP,
  getLevNowRuntimeIntentMetadata,
} from "./renderers/lev-now";
export type {
  LevNowElementProps,
  LevNowPacketRendererProps,
  LevNowRenderPacket,
  LevNowRenderPacketElement,
  LevNowRuntimeIntentMetadata,
} from "./renderers/lev-now";
export * from "./theme";
export * from "./lib";

// Actions (Action Model)
export * from "./actions";

// Hooks
export { useAction, useActionContext, ActionReactContext, ActionContext } from "./hooks/useAction";
export type { ActionContextValue } from "./hooks/useAction";
export { useConfirm } from "./hooks/useConfirm";

// Providers
export { ActionProvider } from "./providers/ActionProvider";
export type { ActionProviderProps } from "./providers/ActionProvider";
