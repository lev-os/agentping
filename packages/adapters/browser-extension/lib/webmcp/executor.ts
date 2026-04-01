/**
 * WebMCP Action Executor
 *
 * Runs a sequence of WebMCP actions directly in the page DOM context.
 * This module is designed to run in the MAIN world content script where
 * it has full access to the page's `document` and JS environment.
 *
 * Actions that cannot be performed via DOM APIs (e.g. CDP-only operations)
 * are delegated to the background via the postMessage bridge.
 */

import type { WebMCPAction, WebMCPTool, WebMCPResult } from './types';

// ---------------------------------------------------------------------------
// Parameter interpolation
// ---------------------------------------------------------------------------

/**
 * Replace `{{paramName}}` placeholders in a string with values from `params`.
 */
function interpolate(template: string, params: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const val = params[key];
    return val != null ? String(val) : '';
  });
}

/**
 * Interpolate all string fields in an action that may contain `{{param}}`.
 */
function interpolateAction(
  action: WebMCPAction,
  params: Record<string, unknown>,
): WebMCPAction {
  const out = { ...action };
  if (out.selector) out.selector = interpolate(out.selector, params);
  if (out.value) out.value = interpolate(out.value, params);
  if (out.script) out.script = interpolate(out.script, params);
  if (out.url) out.url = interpolate(out.url, params);
  return out;
}

// ---------------------------------------------------------------------------
// Selector helpers
// ---------------------------------------------------------------------------

function queryRequired(selector: string): Element {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`WebMCP: selector not found: ${selector}`);
  return el;
}

// ---------------------------------------------------------------------------
// Individual action executors
// ---------------------------------------------------------------------------

function execFocus(action: WebMCPAction): unknown {
  const el = queryRequired(action.selector!);
  if (el instanceof HTMLElement) el.focus();
  return null;
}

function execType(action: WebMCPAction): unknown {
  const el = queryRequired(action.selector!) as HTMLElement;
  el.focus();

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    // Standard input/textarea
    el.value = action.value ?? '';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (el.isContentEditable || el.getAttribute('contenteditable') !== null) {
    // ContentEditable element (e.g. ChatGPT's prompt div)
    el.textContent = action.value ?? '';
    el.dispatchEvent(new InputEvent('input', { bubbles: true, data: action.value ?? '' }));
  } else {
    // Fallback: try setting textContent and dispatching input
    el.textContent = action.value ?? '';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  return null;
}

function execClick(action: WebMCPAction): unknown {
  const el = queryRequired(action.selector!) as HTMLElement;
  el.click();
  return null;
}

function execEvaluate(action: WebMCPAction): unknown {
  // Runs the script string in the page context. We use indirect eval so
  // that it executes in global scope, matching browser-native behavior.
  const indirectEval = eval; // eslint-disable-line no-eval
  return indirectEval(action.script!);
}

function execNavigate(action: WebMCPAction): unknown {
  window.location.href = action.url!;
  return null;
}

function execScroll(action: WebMCPAction): unknown {
  if (action.selector) {
    const el = queryRequired(action.selector);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    window.scrollBy({ top: 300, behavior: 'smooth' });
  }
  return null;
}

async function execWait(action: WebMCPAction): Promise<unknown> {
  const timeout = action.timeout ?? 5000;
  const selector = action.selector;

  if (!selector) {
    // No selector — pure delay
    await new Promise<void>((resolve) => setTimeout(resolve, timeout));
    return null;
  }

  const deadline = Date.now() + timeout;
  const POLL_MS = 100;

  while (Date.now() < deadline) {
    const el = document.querySelector(selector);
    if (el) return el;
    await new Promise<void>((resolve) => setTimeout(resolve, POLL_MS));
  }

  throw new Error(`WebMCP: wait timeout — selector not found within ${timeout}ms: ${selector}`);
}

// ---------------------------------------------------------------------------
// Action router
// ---------------------------------------------------------------------------

async function executeAction(action: WebMCPAction): Promise<unknown> {
  switch (action.type) {
    case 'focus':    return execFocus(action);
    case 'type':     return execType(action);
    case 'click':    return execClick(action);
    case 'evaluate': return execEvaluate(action);
    case 'navigate': return execNavigate(action);
    case 'scroll':   return execScroll(action);
    case 'wait':     return execWait(action);
    default:
      throw new Error(`WebMCP: unknown action type: ${(action as WebMCPAction).type}`);
  }
}

// ---------------------------------------------------------------------------
// Result extraction
// ---------------------------------------------------------------------------

async function extractResult(result: WebMCPResult, lastActionValue: unknown): Promise<unknown> {
  switch (result.type) {
    case 'none':
      return undefined;

    case 'immediate':
      return lastActionValue;

    case 'wait': {
      const timeout = result.timeout ?? 5000;
      const selector = result.selector;

      if (!selector) {
        // Wait with no selector — pure delay, return last action value
        await new Promise<void>((resolve) => setTimeout(resolve, timeout));
        return lastActionValue;
      }

      const deadline = Date.now() + timeout;
      const POLL_MS = 200;
      let el: Element | null = null;

      while (Date.now() < deadline) {
        // For result extraction we want the LAST matching element
        const all = document.querySelectorAll(selector);
        if (all.length > 0) {
          el = all[all.length - 1];
          break;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, POLL_MS));
      }

      if (!el) {
        throw new Error(`WebMCP: result wait timeout — selector not found: ${selector}`);
      }

      // Extract the requested property
      const extract = result.extract ?? 'textContent';
      return (el as unknown as Record<string, unknown>)[extract] ?? null;
    }

    default:
      return lastActionValue;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Execute a WebMCP tool's full action sequence with the given parameters.
 *
 * Returns the extracted result according to the tool's `result` spec.
 */
export async function executeTool(
  tool: WebMCPTool,
  params: Record<string, unknown> = {},
): Promise<unknown> {
  let lastValue: unknown = null;

  for (const rawAction of tool.actions) {
    const action = interpolateAction(rawAction, params);
    lastValue = await executeAction(action);
  }

  return extractResult(tool.result, lastValue);
}
