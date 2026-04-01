/**
 * WebMCP Bridge
 *
 * Provides a postMessage-based communication channel between the MAIN
 * world content script (which owns navigator.modelContext) and the
 * ISOLATED world content script (which has chrome.runtime access).
 *
 * Flow:
 *   MAIN world  --postMessage-->  ISOLATED world  --chrome.runtime-->  background
 *   MAIN world  <--postMessage--  ISOLATED world  <--sendResponse---  background
 */

import {
  WEBMCP_MSG_PREFIX,
  type WebMCPBridgeRequest,
  type WebMCPBridgeResponse,
} from './types';

// ---------------------------------------------------------------------------
// MAIN world side — sends requests, waits for responses
// ---------------------------------------------------------------------------

let msgCounter = 0;

/**
 * Send a bridge request from MAIN world and wait for the response.
 * Returns a promise that resolves with the response payload.
 */
export function sendBridgeRequest(
  request: Omit<WebMCPBridgeRequest, 'channel' | 'id'>,
  timeoutMs = 30000,
): Promise<WebMCPBridgeResponse> {
  const id = `webmcp_${Date.now()}_${++msgCounter}`;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error(`WebMCP bridge timeout after ${timeoutMs}ms (id: ${id})`));
    }, timeoutMs);

    function handler(event: MessageEvent) {
      if (event.source !== window) return;
      const data = event.data as WebMCPBridgeResponse | undefined;
      if (!data || data.channel !== WEBMCP_MSG_PREFIX || data.id !== id) return;

      clearTimeout(timer);
      window.removeEventListener('message', handler);
      resolve(data);
    }

    window.addEventListener('message', handler);

    const msg: WebMCPBridgeRequest = {
      ...request,
      channel: WEBMCP_MSG_PREFIX,
      id,
    } as WebMCPBridgeRequest;

    window.postMessage(msg, '*');
  });
}

// ---------------------------------------------------------------------------
// ISOLATED world side — listens for requests, routes via chrome.runtime
// ---------------------------------------------------------------------------

/**
 * Install the bridge relay in the ISOLATED world content script.
 * Listens for postMessage requests from MAIN world, forwards them
 * to the background service worker, and relays responses back.
 */
export function installBridgeRelay(): void {
  window.addEventListener('message', async (event: MessageEvent) => {
    if (event.source !== window) return;

    const data = event.data as WebMCPBridgeRequest | undefined;
    if (!data || data.channel !== WEBMCP_MSG_PREFIX) return;

    // Only handle request types
    if (data.type !== 'cdp:execute') return;

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'webmcp:execute-cdp',
        method: data.cdpMethod,
        params: data.cdpParams,
      });

      const reply: WebMCPBridgeResponse = {
        channel: WEBMCP_MSG_PREFIX,
        id: data.id,
        type: 'cdp:result',
        result: response?.result,
        error: response?.error,
      };
      window.postMessage(reply, '*');
    } catch (err) {
      const reply: WebMCPBridgeResponse = {
        channel: WEBMCP_MSG_PREFIX,
        id: data.id,
        type: 'cdp:result',
        error: err instanceof Error ? err.message : String(err),
      };
      window.postMessage(reply, '*');
    }
  });
}
