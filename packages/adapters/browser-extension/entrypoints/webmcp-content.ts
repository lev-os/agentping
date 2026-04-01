/**
 * AgentPing Browser Extension - WebMCP Content Script (MAIN world)
 *
 * Runs in the page's MAIN world so that `navigator.modelContext` is
 * visible to all page JavaScript. URL matching determines which tool
 * definition (if any) to inject.
 *
 * Communication with the extension (ISOLATED world / background) uses
 * the postMessage bridge defined in lib/webmcp/bridge.ts.
 */

import { getToolsForUrl } from '../lib/webmcp/loader';
import { injectModelContext } from '../lib/webmcp/polyfill';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  world: 'MAIN',

  async main() {
    // 1. Respect native WebMCP — do not polyfill if the browser has it
    if ('modelContext' in navigator) {
      console.log('[AgentPing WebMCP] Native navigator.modelContext detected — skipping polyfill');
      return;
    }

    // 2. Resolve tool definition for the current page URL
    const definition = getToolsForUrl(window.location.href);
    if (!definition) return;

    // 3. Inject the polyfill
    injectModelContext(definition);
  },
});
