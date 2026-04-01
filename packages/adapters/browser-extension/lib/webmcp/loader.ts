/**
 * WebMCP Definition Loader
 *
 * Resolves which WebMCPDefinition applies to a given URL by matching
 * against the `match` glob patterns declared in each definition.
 *
 * For now the ChatGPT definition is hardcoded inline. Future iterations
 * will load definitions from extension storage / fetched YAML files.
 */

import type { WebMCPDefinition } from './types';

// ---------------------------------------------------------------------------
// Hardcoded definitions (will be replaced by storage/registry later)
// ---------------------------------------------------------------------------

const CHATGPT_DEFINITION: WebMCPDefinition = {
  name: 'chatgpt',
  version: '1.0.0',
  description: 'Control ChatGPT conversations — send messages, switch models, manage chats',
  author: 'lev-community',
  verified: true,
  match: [
    'https://chatgpt.com/*',
    'https://chat.openai.com/*',
  ],
  tools: [
    {
      name: 'send_message',
      description: 'Send a message in the active ChatGPT conversation',
      parameters: {
        message: { type: 'string', required: true, description: 'The message text to send' },
      },
      actions: [
        { type: 'focus', selector: '#prompt-textarea' },
        { type: 'type', selector: '#prompt-textarea', value: '{{message}}' },
        { type: 'click', selector: "[data-testid='send-button']" },
      ],
      result: {
        type: 'wait',
        selector: "[data-message-author-role='assistant']",
        extract: 'textContent',
        timeout: 60000,
      },
    },
    {
      name: 'new_chat',
      description: 'Start a new ChatGPT conversation',
      parameters: {},
      actions: [
        { type: 'click', selector: "nav a[href='/']" },
      ],
      result: {
        type: 'wait',
        selector: '#prompt-textarea',
        timeout: 5000,
      },
    },
    {
      name: 'switch_model',
      description: 'Switch the active ChatGPT model',
      parameters: {
        model: {
          type: 'string',
          enum: ['gpt-4o', 'gpt-4o-mini', 'o1', 'o3-mini', 'o4-mini'],
          required: true,
          description: 'The model to switch to',
        },
      },
      actions: [
        { type: 'click', selector: "[data-testid='model-selector']" },
        { type: 'wait', selector: "[data-testid='model-{{model}}']", timeout: 3000 },
        { type: 'click', selector: "[data-testid='model-{{model}}']" },
      ],
      result: {
        type: 'wait',
        timeout: 2000,
      },
    },
    {
      name: 'get_response',
      description: 'Get the most recent assistant response from the conversation',
      parameters: {},
      actions: [
        {
          type: 'evaluate',
          script: `(() => {
            const msgs = document.querySelectorAll('[data-message-author-role="assistant"]');
            if (msgs.length === 0) return null;
            const last = msgs[msgs.length - 1];
            return last.textContent?.trim() || null;
          })()`,
        },
      ],
      result: { type: 'immediate' },
    },
    {
      name: 'stop_generation',
      description: 'Stop the current response generation',
      parameters: {},
      actions: [
        { type: 'click', selector: "[data-testid='stop-button']" },
      ],
      result: { type: 'none' },
    },
    {
      name: 'get_conversation_history',
      description: 'Get all messages in the current conversation',
      parameters: {},
      actions: [
        {
          type: 'evaluate',
          script: `Array.from(document.querySelectorAll('[data-message-author-role]'))
            .map(el => ({
              role: el.dataset.messageAuthorRole,
              content: el.textContent?.trim()
            }))`,
        },
      ],
      result: { type: 'immediate' },
    },
  ],
};

/**
 * All registered WebMCP definitions. Hardcoded for now; will be
 * dynamically loaded from storage in a future iteration.
 */
const DEFINITIONS: WebMCPDefinition[] = [
  CHATGPT_DEFINITION,
];

// ---------------------------------------------------------------------------
// URL matching
// ---------------------------------------------------------------------------

/**
 * Convert a simple glob pattern (with `*` wildcards) to a RegExp.
 * Supports the `*` wildcard only — sufficient for match patterns like
 * `https://chatgpt.com/*`.
 */
function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

/**
 * Returns the first WebMCPDefinition whose `match` patterns include
 * the given URL, or `null` if no definition matches.
 */
export function getToolsForUrl(url: string): WebMCPDefinition | null {
  for (const def of DEFINITIONS) {
    for (const pattern of def.match) {
      if (globToRegex(pattern).test(url)) {
        return def;
      }
    }
  }
  return null;
}

/**
 * Returns all registered definitions. Useful for debugging / popup UI.
 */
export function getAllDefinitions(): WebMCPDefinition[] {
  return [...DEFINITIONS];
}
