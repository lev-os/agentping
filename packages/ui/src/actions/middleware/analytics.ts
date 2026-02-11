/**
 * @kingly/ui - Analytics Middleware
 *
 * Tracks action events through configurable adapters
 */

import type {
  ActionDescriptor,
  ActionContext,
  ActionPayload,
  AnalyticsAdapter,
} from "../types";
import { ActionPipeline } from "../pipeline";

/**
 * JSONL Analytics Adapter - writes to API endpoint
 */
export class JsonlAnalyticsAdapter implements AnalyticsAdapter {
  private endpoint: string;
  private buffer: Array<{ event: ActionPayload; context: ActionContext }> = [];
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private batchSize: number;
  private flushInterval: number;

  constructor(options: {
    endpoint?: string;
    batchSize?: number;
    flushInterval?: number;
  } = {}) {
    this.endpoint = options.endpoint ?? "/api/analytics";
    this.batchSize = options.batchSize ?? 10;
    this.flushInterval = options.flushInterval ?? 5000;
  }

  async track(event: ActionPayload, context: ActionContext): Promise<void> {
    this.buffer.push({ event, context });

    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    } else if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  async flush(): Promise<void> {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    if (this.buffer.length === 0) return;

    const events = this.buffer.splice(0, this.buffer.length);

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-ndjson" },
        body: events
          .map(({ event, context }) =>
            JSON.stringify({ ...event, context, timestamp: Date.now() })
          )
          .join("\n"),
      });
    } catch (error) {
      // Re-add events to buffer on failure
      console.error("[Analytics] Failed to flush events:", error);
      this.buffer.unshift(...events);
    }
  }

  /**
   * Force flush on page unload
   */
  setupUnloadHandler(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        // Use sendBeacon for reliable delivery
        if (this.buffer.length > 0 && navigator.sendBeacon) {
          const body = this.buffer
            .map(({ event, context }) =>
              JSON.stringify({ ...event, context, timestamp: Date.now() })
            )
            .join("\n");
          navigator.sendBeacon(this.endpoint, body);
        }
      });
    }
  }
}

/**
 * Console Analytics Adapter - for development
 */
export class ConsoleAnalyticsAdapter implements AnalyticsAdapter {
  private prefix: string;

  constructor(prefix = "[Analytics]") {
    this.prefix = prefix;
  }

  async track(event: ActionPayload, context: ActionContext): Promise<void> {
    console.log(this.prefix, {
      type: event.type,
      label: event.label,
      category: event.metadata.category,
      action: event.metadata.action,
      context,
    });
  }
}

/**
 * Create analytics middleware with the given adapter
 */
export function createAnalyticsMiddleware(
  adapter: AnalyticsAdapter
): (
  action: ActionDescriptor,
  context: ActionContext,
  next: () => Promise<void>
) => Promise<void> {
  return async (action, context, next) => {
    const payload = ActionPipeline.createPayload(action);

    // Track before execution (fire and forget)
    adapter.track(payload, context).catch((err) => {
      console.error("[Analytics] Track failed:", err);
    });

    await next();
  };
}

/**
 * Default analytics adapter (JSONL in production, console in dev)
 */
export function getDefaultAnalyticsAdapter(): AnalyticsAdapter {
  // Check if we're in development mode
  const isDev = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1");

  if (isDev) {
    return new ConsoleAnalyticsAdapter();
  }
  const adapter = new JsonlAnalyticsAdapter();
  adapter.setupUnloadHandler();
  return adapter;
}
