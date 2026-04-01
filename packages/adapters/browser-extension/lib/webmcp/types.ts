/**
 * WebMCP Type Definitions
 *
 * Shared types for WebMCP tool definitions, actions, and the
 * navigator.modelContext polyfill surface.
 */

// ---------------------------------------------------------------------------
// Tool definition schema (mirrors .webmcp.yaml structure)
// ---------------------------------------------------------------------------

export interface WebMCPDefinition {
  name: string;
  version: string;
  match: string[];
  description?: string;
  author?: string;
  verified?: boolean;
  tools: WebMCPTool[];
}

export interface WebMCPToolParameter {
  type: string;
  required?: boolean;
  description?: string;
  enum?: string[];
}

export interface WebMCPTool {
  name: string;
  description?: string;
  parameters: Record<string, WebMCPToolParameter>;
  actions: WebMCPAction[];
  result: WebMCPResult;
}

export interface WebMCPAction {
  type: 'focus' | 'type' | 'click' | 'evaluate' | 'wait' | 'navigate' | 'scroll';
  selector?: string;
  value?: string;
  script?: string;
  url?: string;
  timeout?: number;
}

export interface WebMCPResult {
  type: 'immediate' | 'wait' | 'none';
  selector?: string;
  extract?: string;
  timeout?: number;
}

// ---------------------------------------------------------------------------
// Bridge messages (MAIN world <-> ISOLATED world <-> background)
// ---------------------------------------------------------------------------

export const WEBMCP_MSG_PREFIX = '__agentping_webmcp__';

export interface WebMCPBridgeRequest {
  channel: typeof WEBMCP_MSG_PREFIX;
  id: string;
  type: 'tool:call' | 'cdp:execute';
  toolName?: string;
  params?: Record<string, unknown>;
  cdpMethod?: string;
  cdpParams?: Record<string, unknown>;
}

export interface WebMCPBridgeResponse {
  channel: typeof WEBMCP_MSG_PREFIX;
  id: string;
  type: 'tool:result' | 'cdp:result';
  result?: unknown;
  error?: string;
}

// ---------------------------------------------------------------------------
// navigator.modelContext surface types (Chrome 146+ WebMCP spec shape)
// ---------------------------------------------------------------------------

export interface ModelContextToolDescriptor {
  name: string;
  description: string;
  parameters: Record<string, WebMCPToolParameter>;
}

export interface ModelContext {
  tools: ModelContextToolDescriptor[];
  callTool(name: string, params?: Record<string, unknown>): Promise<unknown>;
}
