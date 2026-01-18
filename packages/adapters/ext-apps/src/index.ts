/**
 * AgentPing ext-apps Adapter
 *
 * Implements SEP-1865 (MCP Apps Extension) for interactive UI delivery.
 * Allows AgentPing to serve HTML-based UIs to MCP hosts that support
 * the io.modelcontextprotocol/ui extension.
 *
 * Architecture:
 * - Registers ui:// resources for ping UIs
 * - Provides tool-UI linkage via _meta.ui
 * - Supports theming via host context
 * - Bidirectional JSON-RPC communication
 */

import type { Ping, ParsedInteraction } from '@agentping/core';

// ============================================================================
// Types
// ============================================================================

export interface UIResource {
    uri: string;
    name: string;
    description?: string;
    mimeType: 'text/html;profile=mcp-app';
    _meta?: {
        ui?: {
            csp?: CSPConfig;
            prefersBorder?: boolean;
            preferredHeight?: number;
            preferredWidth?: number;
        };
    };
}

export interface CSPConfig {
    connectDomains?: string[];
    resourceDomains?: string[];
    scriptDomains?: string[];
    styleDomains?: string[];
}

export interface ToolUIMetadata {
    resourceUri: string;
    visibility?: ('model' | 'app')[];
}

export interface HostContext {
    theme?: 'light' | 'dark';
    containerDimensions?: { width: number; height: number };
    locale?: string;
    styles?: {
        variables?: Record<string, string>;
        css?: { fonts?: string };
    };
}

export interface ExtAppsConfig {
    /** Base URI prefix for UI resources */
    uriPrefix?: string;
    /** Default CSP configuration */
    defaultCsp?: CSPConfig;
    /** Enable debug logging */
    debug?: boolean;
}

// ============================================================================
// UI Resource Registry
// ============================================================================

export class UIResourceRegistry {
    private resources: Map<string, UIResource> = new Map();
    private htmlGenerators: Map<string, (ping: Ping, context?: HostContext) => string> = new Map();

    constructor(private config: ExtAppsConfig = {}) {
        const prefix = config.uriPrefix || 'ui://agentping';

        // Register default resources
        this.registerResource({
            uri: `${prefix}/dashboard`,
            name: 'AgentPing Dashboard',
            description: 'Main dashboard for viewing and responding to pings',
            mimeType: 'text/html;profile=mcp-app',
            _meta: {
                ui: {
                    csp: config.defaultCsp,
                    prefersBorder: true,
                    preferredHeight: 600,
                },
            },
        });

        this.registerResource({
            uri: `${prefix}/ping-detail`,
            name: 'Ping Detail View',
            description: 'Detailed view for responding to a single ping',
            mimeType: 'text/html;profile=mcp-app',
            _meta: {
                ui: {
                    csp: config.defaultCsp,
                    prefersBorder: true,
                    preferredHeight: 400,
                },
            },
        });

        this.registerResource({
            uri: `${prefix}/step-approval`,
            name: 'Step Approval UI',
            description: 'Interactive step approval checklist',
            mimeType: 'text/html;profile=mcp-app',
            _meta: {
                ui: {
                    csp: config.defaultCsp,
                    prefersBorder: true,
                    preferredHeight: 500,
                },
            },
        });

        this.registerResource({
            uri: `${prefix}/selection`,
            name: 'Selection UI',
            description: 'Multi-option selection interface',
            mimeType: 'text/html;profile=mcp-app',
            _meta: {
                ui: {
                    csp: config.defaultCsp,
                    prefersBorder: false,
                    preferredHeight: 300,
                },
            },
        });

        // Register HTML generators for dynamic content
        this.registerGenerator('step-approval', generateStepApprovalHTML);
        this.registerGenerator('selection', generateSelectionHTML);
        this.registerGenerator('question', generateQuestionHTML);
        this.registerGenerator('approval', generateApprovalHTML);
        this.registerGenerator('notification', generateNotificationHTML);
    }

    registerResource(resource: UIResource): void {
        this.resources.set(resource.uri, resource);
    }

    registerGenerator(type: string, generator: (ping: Ping, context?: HostContext) => string): void {
        this.htmlGenerators.set(type, generator);
    }

    getResource(uri: string): UIResource | undefined {
        return this.resources.get(uri);
    }

    listResources(): UIResource[] {
        return Array.from(this.resources.values());
    }

    generateHTML(ping: Ping, context?: HostContext): string {
        const payloadType = ping.payload?.type;
        const generator = this.htmlGenerators.get(payloadType) || generateGenericHTML;
        return generator(ping, context);
    }

    /**
     * Get tool metadata with UI linkage
     */
    getToolUIMetadata(toolName: string): ToolUIMetadata | undefined {
        const prefix = this.config.uriPrefix || 'ui://agentping';
        const mapping: Record<string, ToolUIMetadata> = {
            request_step_approval: {
                resourceUri: `${prefix}/step-approval`,
                visibility: ['model', 'app'],
            },
            request_selection: {
                resourceUri: `${prefix}/selection`,
                visibility: ['model', 'app'],
            },
            ask_human: {
                resourceUri: `${prefix}/ping-detail`,
                visibility: ['model', 'app'],
            },
            request_approval: {
                resourceUri: `${prefix}/ping-detail`,
                visibility: ['model', 'app'],
            },
            notify_human: {
                resourceUri: `${prefix}/ping-detail`,
                visibility: ['model'],
            },
        };
        return mapping[toolName];
    }
}

// ============================================================================
// HTML Generators
// ============================================================================

function generateStepApprovalHTML(ping: Ping, context?: HostContext): string {
    const payload = ping.payload as any;
    const theme = context?.theme || 'dark';
    const steps = payload.steps || [];

    return `<!DOCTYPE html>
<html data-theme="${theme}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Step Approval - ${payload.title || 'Approval Required'}</title>
    <style>
        ${getBaseStyles(context)}
        .step-list { display: flex; flex-direction: column; gap: 12px; }
        .step-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border-default); }
        .step-checkbox { width: 20px; height: 20px; accent-color: var(--primary); }
        .step-content { flex: 1; }
        .step-title { font-weight: 500; margin-bottom: 4px; }
        .step-description { font-size: 14px; color: var(--text-muted); }
        .risk-badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .risk-low { background: var(--success-muted); color: var(--success); }
        .risk-medium { background: var(--warning-muted); color: var(--warning); }
        .risk-high { background: var(--danger-muted); color: var(--danger); }
        .actions { display: flex; gap: 12px; margin-top: 16px; }
        .btn { padding: 10px 20px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; }
        .btn-primary { background: var(--primary); color: var(--primary-foreground); }
        .btn-danger { background: var(--danger); color: var(--danger-foreground); }
        .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-default); }
    </style>
</head>
<body>
    <div class="container">
        <h1>${escapeHtml(payload.title || 'Step Approval')}</h1>
        ${payload.context ? `<p class="context">${escapeHtml(payload.context)}</p>` : ''}
        <div class="step-list">
            ${steps.map((step: any) => `
                <div class="step-item">
                    <input type="checkbox" class="step-checkbox" data-id="${escapeHtml(step.id)}" ${(payload.defaultApproved || []).includes(step.id) ? 'checked' : ''}>
                    <div class="step-content">
                        <div class="step-title">${escapeHtml(step.title)}</div>
                        ${step.description ? `<div class="step-description">${escapeHtml(step.description)}</div>` : ''}
                    </div>
                    <span class="risk-badge risk-${step.risk || 'medium'}">${step.risk || 'medium'}</span>
                </div>
            `).join('')}
        </div>
        <div class="actions">
            <button class="btn btn-primary" onclick="approveSelected()">Approve Selected</button>
            <button class="btn btn-secondary" onclick="approveAll()">Approve All</button>
            <button class="btn btn-danger" onclick="denyAll()">Deny All</button>
        </div>
    </div>
    <script>
        function getSelectedIds() {
            return Array.from(document.querySelectorAll('.step-checkbox:checked')).map(cb => cb.dataset.id);
        }
        function sendResponse(action, payload) {
            window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action, payload } }, '*');
        }
        function approveSelected() { sendResponse('approve_selected', { ids: getSelectedIds() }); }
        function approveAll() { sendResponse('approve_all', {}); }
        function denyAll() { sendResponse('deny_all', {}); }
    </script>
</body>
</html>`;
}

function generateSelectionHTML(ping: Ping, context?: HostContext): string {
    const payload = ping.payload as any;
    const theme = context?.theme || 'dark';
    const options = payload.options || [];

    return `<!DOCTYPE html>
<html data-theme="${theme}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Selection - ${payload.title || 'Select Option'}</title>
    <style>
        ${getBaseStyles(context)}
        .option-list { display: flex; flex-direction: column; gap: 8px; }
        .option-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border-default); cursor: pointer; transition: border-color 0.15s; }
        .option-item:hover { border-color: var(--primary); }
        .option-item.selected { border-color: var(--primary); background: var(--primary-muted); }
        .option-label { font-weight: 500; }
        .option-description { font-size: 14px; color: var(--text-muted); }
        .actions { margin-top: 16px; }
        .btn { padding: 10px 20px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; width: 100%; }
        .btn-primary { background: var(--primary); color: var(--primary-foreground); }
    </style>
</head>
<body>
    <div class="container">
        <h1>${escapeHtml(payload.title || 'Select Option')}</h1>
        <div class="option-list">
            ${options.map((opt: any) => `
                <div class="option-item" data-id="${escapeHtml(opt.id)}" onclick="toggleOption(this, ${payload.allowMultiple})">
                    <div>
                        <div class="option-label">${escapeHtml(opt.label)}</div>
                        ${opt.description ? `<div class="option-description">${escapeHtml(opt.description)}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="actions">
            <button class="btn btn-primary" onclick="confirmSelection()">Confirm Selection</button>
        </div>
    </div>
    <script>
        const allowMultiple = ${payload.allowMultiple || false};
        function toggleOption(el, multi) {
            if (multi) {
                el.classList.toggle('selected');
            } else {
                document.querySelectorAll('.option-item').forEach(item => item.classList.remove('selected'));
                el.classList.add('selected');
            }
        }
        function confirmSelection() {
            const ids = Array.from(document.querySelectorAll('.option-item.selected')).map(el => el.dataset.id);
            window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action: 'select', payload: { ids } } }, '*');
        }
    </script>
</body>
</html>`;
}

function generateQuestionHTML(ping: Ping, context?: HostContext): string {
    const payload = ping.payload as any;
    const theme = context?.theme || 'dark';

    return `<!DOCTYPE html>
<html data-theme="${theme}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Question</title>
    <style>
        ${getBaseStyles(context)}
        .question { font-size: 18px; font-weight: 500; margin-bottom: 16px; }
        .context { color: var(--text-muted); margin-bottom: 16px; }
        .options { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .option-btn { padding: 8px 16px; border-radius: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-default); cursor: pointer; }
        .option-btn:hover { border-color: var(--primary); }
        textarea { width: 100%; min-height: 100px; padding: 12px; border-radius: 8px; background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-input); font-family: inherit; font-size: 16px; resize: vertical; }
        .btn { margin-top: 12px; padding: 10px 20px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; width: 100%; }
        .btn-primary { background: var(--primary); color: var(--primary-foreground); }
    </style>
</head>
<body>
    <div class="container">
        <div class="question">${escapeHtml(payload.question)}</div>
        ${payload.context ? `<p class="context">${escapeHtml(payload.context)}</p>` : ''}
        ${payload.options ? `
            <div class="options">
                ${payload.options.map((opt: string) => `<button class="option-btn" onclick="selectOption('${escapeHtml(opt)}')">${escapeHtml(opt)}</button>`).join('')}
            </div>
        ` : ''}
        ${payload.allowFreeform !== false ? `
            <textarea id="answer" placeholder="Type your answer..."></textarea>
            <button class="btn btn-primary" onclick="submitAnswer()">Submit Answer</button>
        ` : ''}
    </div>
    <script>
        function selectOption(value) {
            window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action: 'answer', payload: { value } } }, '*');
        }
        function submitAnswer() {
            const value = document.getElementById('answer').value;
            window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action: 'answer', payload: { value } } }, '*');
        }
    </script>
</body>
</html>`;
}

function generateApprovalHTML(ping: Ping, context?: HostContext): string {
    const payload = ping.payload as any;
    const theme = context?.theme || 'dark';

    return `<!DOCTYPE html>
<html data-theme="${theme}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Approval Required</title>
    <style>
        ${getBaseStyles(context)}
        .title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .description { color: var(--text-muted); margin-bottom: 16px; }
        .action-box { padding: 16px; background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 8px; margin-bottom: 16px; }
        .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; }
        .risk-low { background: var(--success-muted); color: var(--success); }
        .risk-medium { background: var(--warning-muted); color: var(--warning); }
        .risk-high { background: var(--danger-muted); color: var(--danger); }
        .actions { display: flex; gap: 12px; }
        .btn { flex: 1; padding: 12px 20px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; font-size: 16px; }
        .btn-primary { background: var(--primary); color: var(--primary-foreground); }
        .btn-danger { background: var(--danger); color: var(--danger-foreground); }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">${escapeHtml(payload.title)}</h1>
        ${payload.description ? `<p class="description">${escapeHtml(payload.description)}</p>` : ''}
        <div class="action-box">
            <span class="risk-badge risk-${payload.risk || 'medium'}">${payload.risk || 'medium'} risk</span>
            <p>${escapeHtml(payload.action)}</p>
        </div>
        <div class="actions">
            <button class="btn btn-primary" onclick="approve()">Approve</button>
            <button class="btn btn-danger" onclick="deny()">Deny</button>
        </div>
    </div>
    <script>
        function approve() { window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action: 'approve_all' } }, '*'); }
        function deny() { window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action: 'deny_all' } }, '*'); }
    </script>
</body>
</html>`;
}

function generateNotificationHTML(ping: Ping, context?: HostContext): string {
    const payload = ping.payload as any;
    const theme = context?.theme || 'dark';
    const level = payload.level || 'info';

    const levelColors: Record<string, string> = {
        info: 'var(--info)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--danger)',
    };

    return `<!DOCTYPE html>
<html data-theme="${theme}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Notification</title>
    <style>
        ${getBaseStyles(context)}
        .notification { padding: 16px; border-radius: 8px; background: var(--bg-card); border-left: 4px solid ${levelColors[level]}; }
        .title { font-weight: 600; margin-bottom: 4px; }
        .message { color: var(--text-secondary); }
        .btn { margin-top: 12px; padding: 8px 16px; border-radius: 6px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-default); cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="notification">
            ${payload.title ? `<div class="title">${escapeHtml(payload.title)}</div>` : ''}
            <div class="message">${escapeHtml(payload.message)}</div>
        </div>
        <button class="btn" onclick="dismiss()">Dismiss</button>
    </div>
    <script>
        function dismiss() { window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action: 'dismiss' } }, '*'); }
    </script>
</body>
</html>`;
}

function generateGenericHTML(ping: Ping, context?: HostContext): string {
    const theme = context?.theme || 'dark';

    return `<!DOCTYPE html>
<html data-theme="${theme}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AgentPing</title>
    <style>${getBaseStyles(context)}</style>
</head>
<body>
    <div class="container">
        <h1>Ping from ${escapeHtml(ping.agentName)}</h1>
        <pre style="background: var(--bg-card); padding: 12px; border-radius: 8px; overflow: auto;">${escapeHtml(JSON.stringify(ping.payload, null, 2))}</pre>
        <button style="margin-top: 12px; padding: 10px 20px; border-radius: 6px; background: var(--primary); color: var(--primary-foreground); border: none; cursor: pointer;" onclick="dismiss()">Dismiss</button>
    </div>
    <script>
        function dismiss() { window.parent.postMessage({ jsonrpc: '2.0', method: 'ui/response', params: { action: 'dismiss' } }, '*'); }
    </script>
</body>
</html>`;
}

// ============================================================================
// Helpers
// ============================================================================

function getBaseStyles(context?: HostContext): string {
    const customVars = context?.styles?.variables
        ? Object.entries(context.styles.variables).map(([k, v]) => `${k}: ${v};`).join('\n')
        : '';

    return `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        ${context?.styles?.css?.fonts || ''}

        :root, [data-theme="dark"] {
            --bg-primary: #050505; --bg-secondary: #0a0a0a; --bg-tertiary: #121212;
            --bg-card: #0a0a0a; --bg-input: #0a0a0a;
            --text-primary: #fafafa; --text-secondary: #a1a1aa; --text-muted: #71717a;
            --border-default: rgba(255,255,255,0.08); --border-input: rgba(255,255,255,0.12);
            --primary: #00e5ff; --primary-foreground: #000; --primary-muted: rgba(0,229,255,0.15);
            --success: #00ff9d; --success-muted: rgba(0,255,157,0.15);
            --warning: #ffb800; --warning-muted: rgba(255,184,0,0.15);
            --danger: #ff2a6d; --danger-foreground: #fff; --danger-muted: rgba(255,42,109,0.15);
            --info: #3b82f6;
            ${customVars}
        }
        [data-theme="light"] {
            --bg-primary: #fff; --bg-secondary: #fafafa; --bg-tertiary: #f5f5f5;
            --bg-card: #fff; --bg-input: #fff;
            --text-primary: #09090b; --text-secondary: #52525b; --text-muted: #71717a;
            --border-default: #e4e4e7; --border-input: #e4e4e7;
            --primary: #2563eb; --primary-foreground: #fff; --primary-muted: rgba(37,99,235,0.1);
            --success: #16a34a; --success-muted: rgba(22,163,74,0.1);
            --warning: #d97706; --warning-muted: rgba(217,119,6,0.1);
            --danger: #dc2626; --danger-foreground: #fff; --danger-muted: rgba(220,38,38,0.1);
            --info: #2563eb;
            ${customVars}
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; line-height: 1.5; background: var(--bg-primary); color: var(--text-primary); -webkit-font-smoothing: antialiased; }
        .container { padding: 20px; max-width: 600px; margin: 0 auto; }
        h1 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    `;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================================================
// Exports
// ============================================================================

export { UIResourceRegistry as default };
// Types already exported inline above (lines 21, 36, 43, 48, 58)
