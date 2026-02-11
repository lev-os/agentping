/**
 * @kingly/ui - Action Model
 *
 * Universal interaction primitives for UI, analytics, and agent access
 */

// Types
export type {
  ActionDescriptor,
  ActionMetadata,
  ActionContext,
  ActionPayload,
  ActionConfirmation,
  ConfirmationConfig,
  ActionMiddleware,
  AnalyticsAdapter,
  A11yMetadata,
  WidgetActionType,
  CrudActionType,
} from "./types";

export {
  isActionConfirmation,
  entityA11y,
  createAction,
  withConfirmation,
} from "./types";

// Pipeline
export {
  ActionPipeline,
  getDefaultPipeline,
  setDefaultPipeline,
  resetDefaultPipeline,
} from "./pipeline";

// Middleware
export {
  JsonlAnalyticsAdapter,
  ConsoleAnalyticsAdapter,
  createAnalyticsMiddleware,
  getDefaultAnalyticsAdapter,
} from "./middleware/analytics";

export {
  createConfirmationMiddleware,
  setConfirmationHandler,
  clearConfirmationHandler,
  requestConfirmation,
} from "./middleware/confirmation";
