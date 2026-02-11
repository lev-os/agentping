/**
 * @kingly/ui - Action Pipeline
 *
 * Middleware-based action execution pipeline
 */

import type {
  ActionDescriptor,
  ActionContext,
  ActionMiddleware,
  ActionPayload,
} from "./types";

/**
 * Action Pipeline - processes actions through middleware chain
 */
export class ActionPipeline {
  private middlewares: ActionMiddleware[] = [];

  /**
   * Add middleware to the pipeline
   */
  use(middleware: ActionMiddleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Execute an action through the pipeline
   */
  async execute(
    action: ActionDescriptor,
    context: ActionContext = {},
    payload?: unknown
  ): Promise<void> {
    let index = 0;

    const executeNext = async (): Promise<void> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++]!;
        await middleware(action, context, executeNext);
      } else {
        // End of chain - execute the action callback
        await action.callback(payload);
      }
    };

    await executeNext();
  }

  /**
   * Create an ActionPayload for analytics
   */
  static createPayload(action: ActionDescriptor): ActionPayload {
    return {
      type: action.type,
      label: action.label,
      metadata: action.analytics,
      timestamp: Date.now(),
    };
  }
}

/**
 * Default pipeline instance
 */
let defaultPipeline: ActionPipeline | null = null;

/**
 * Get or create the default pipeline
 */
export function getDefaultPipeline(): ActionPipeline {
  if (!defaultPipeline) {
    defaultPipeline = new ActionPipeline();
  }
  return defaultPipeline;
}

/**
 * Set the default pipeline (for testing or custom setup)
 */
export function setDefaultPipeline(pipeline: ActionPipeline): void {
  defaultPipeline = pipeline;
}

/**
 * Reset the default pipeline
 */
export function resetDefaultPipeline(): void {
  defaultPipeline = null;
}
