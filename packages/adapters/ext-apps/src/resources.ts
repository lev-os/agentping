/**
 * AgentPing ext-apps Resource Definitions
 * SEP-1865 MCP UI Extensions - Resource exports
 */

import type { UIResource } from './index.js';

// ============================================================================
// Default Resource Definitions
// ============================================================================

export const AGENTPING_RESOURCES: UIResource[] = [
    {
        uri: 'agentping://ui/dashboard',
        name: 'AgentPing Dashboard',
        description: 'Main dashboard showing pending pings and interaction history',
        mimeType: 'text/html;profile=mcp-app',
        _meta: {
            ui: {
                preferredWidth: 800,
                preferredHeight: 600,
                prefersBorder: true,
                csp: {
                    scriptDomains: [],
                    styleDomains: [],
                },
            },
        },
    },
    {
        uri: 'agentping://ui/ping-detail',
        name: 'Ping Detail View',
        description: 'Detailed view for responding to a specific ping',
        mimeType: 'text/html;profile=mcp-app',
        _meta: {
            ui: {
                preferredWidth: 600,
                preferredHeight: 500,
                prefersBorder: true,
            },
        },
    },
    {
        uri: 'agentping://ui/step-approval',
        name: 'Step Approval',
        description: 'Multi-step approval workflow UI',
        mimeType: 'text/html;profile=mcp-app',
        _meta: {
            ui: {
                preferredWidth: 700,
                preferredHeight: 550,
                prefersBorder: true,
            },
        },
    },
    {
        uri: 'agentping://ui/selection',
        name: 'Selection UI',
        description: 'Selection interface for choosing from options',
        mimeType: 'text/html;profile=mcp-app',
        _meta: {
            ui: {
                preferredWidth: 500,
                preferredHeight: 400,
                prefersBorder: true,
            },
        },
    },
];

// ============================================================================
// Resource Helpers
// ============================================================================

export function getResourceByUri(uri: string): UIResource | undefined {
    return AGENTPING_RESOURCES.find(r => r.uri === uri);
}

export function getResourcesByType(type: string): UIResource[] {
    return AGENTPING_RESOURCES.filter(r => r.uri.includes(type));
}
