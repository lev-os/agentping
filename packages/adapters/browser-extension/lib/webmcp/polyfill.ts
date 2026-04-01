/**
 * WebMCP Polyfill — navigator.modelContext
 *
 * Defines `navigator.modelContext` on pages where a matching WebMCP
 * tool definition exists. Designed to match the shape of the native
 * Chrome 146+ WebMCP API so that consumers written for the native
 * surface work transparently with this polyfill.
 *
 * Must run in the MAIN world to be visible to page JavaScript.
 */

import type {
  WebMCPDefinition,
  ModelContext,
  ModelContextToolDescriptor,
} from './types';
import { executeTool } from './executor';

/**
 * Inject `navigator.modelContext` for the given definition.
 *
 * If the native API already exists on the navigator object, this
 * function is a no-op — the native implementation takes precedence.
 */
export function injectModelContext(definition: WebMCPDefinition): void {
  // Respect native implementation
  if ('modelContext' in navigator) return;

  const toolDescriptors: ModelContextToolDescriptor[] = definition.tools.map((t) => ({
    name: t.name,
    description: t.description ?? '',
    parameters: { ...t.parameters },
  }));

  // Build a lookup for fast tool resolution
  const toolMap = new Map(definition.tools.map((t) => [t.name, t]));

  const modelContext: ModelContext = {
    tools: Object.freeze(toolDescriptors) as ModelContextToolDescriptor[],

    async callTool(name: string, params?: Record<string, unknown>): Promise<unknown> {
      const tool = toolMap.get(name);
      if (!tool) {
        throw new Error(
          `WebMCP: unknown tool "${name}". Available: ${[...toolMap.keys()].join(', ')}`,
        );
      }

      // Validate required parameters
      for (const [key, schema] of Object.entries(tool.parameters)) {
        if (schema.required && (params == null || !(key in params))) {
          throw new Error(`WebMCP: missing required parameter "${key}" for tool "${name}"`);
        }
        if (schema.enum && params?.[key] != null) {
          const val = String(params[key]);
          if (!schema.enum.includes(val)) {
            throw new Error(
              `WebMCP: invalid value "${val}" for parameter "${key}" — ` +
              `expected one of: ${schema.enum.join(', ')}`,
            );
          }
        }
      }

      return executeTool(tool, params ?? {});
    },
  };

  // Define as non-configurable, non-writable to match native API contract
  Object.defineProperty(navigator, 'modelContext', {
    value: modelContext,
    writable: false,
    enumerable: true,
    configurable: false,
  });

  console.log(
    `[AgentPing WebMCP] Polyfill active — ${definition.tools.length} tools for ${definition.name}`,
  );
}
