/**
 * AgentPing UI Catalog for @json-render
 * 
 * Defines the guardrails for what components can be rendered.
 */

import { createCatalog } from '@json-render/core';
import { z } from 'zod';

// ============================================================================
// Component Catalog
// ============================================================================

const catalogActions = {
    approve: {
        params: z.object({
            pingId: z.string(),
            stepIds: z.array(z.string()).optional(),
        }),
    },
    deny: {
        params: z.object({
            pingId: z.string(),
            reason: z.string().optional(),
        }),
    },
    select: {
        params: z.object({
            pingId: z.string(),
            selectedIds: z.array(z.string()),
            customValue: z.string().optional(),
        }),
    },
    answer: {
        params: z.object({
            pingId: z.string(),
            value: z.string(),
        }),
    },
    dismiss: {
        params: z.object({
            pingId: z.string(),
        }),
    },
    addDirective: {
        params: z.object({
            pingId: z.string(),
            directive: z.any(),
        }),
    },
    removeDirective: {
        params: z.object({
            pingId: z.string(),
            directiveIndex: z.number(),
        }),
    },
    toggleStep: {
        params: z.object({
            pingId: z.string(),
            stepId: z.string(),
        }),
    },
    selectDirection: {
        params: z.object({
            pingId: z.string(),
            directionId: z.string(),
        }),
    },
};

export const agentpingCatalog = createCatalog({
    components: {
        // =========================================================================
        // Layout Components
        // =========================================================================

        PingCard: {
            props: z.object({
                pingId: z.string(),
                agentName: z.string(),
                title: z.string(),
                status: z.enum(['pending', 'responded', 'expired', 'dismissed']),
                type: z.string(),
                createdAt: z.string(),
                isSelected: z.boolean().optional(),
            }),
            hasChildren: true,
        },

        QuickActionBar: {
            props: z.object({
                actions: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    style: z.enum(['primary', 'secondary', 'danger', 'ghost']),
                    shortcut: z.string().optional(),
                    icon: z.string().optional(),
                })),
            }),
        },

        EnrichmentPanel: {
            props: z.object({
                suggestedDirectives: z.array(z.string()).optional(),
                showNotes: z.boolean().optional(),
            }),
            hasChildren: true,
        },

        // =========================================================================
        // New Primitives
        // =========================================================================

        DependencyGraph: {
            props: z.object({
                nodes: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    status: z.enum(['pending', 'ready', 'in_progress', 'complete', 'blocked']),
                    dependencies: z.array(z.string()),
                })),
                onNodeClick: z.any().optional(), // Event handler
            }),
        },

        StatusCard: {
            props: z.object({
                title: z.string(),
                status: z.enum(['idle', 'running', 'success', 'error', 'warning']),
                progress: z.number().optional(),
                eta: z.string().optional(),
                metrics: z.array(z.object({
                    label: z.string(),
                    value: z.union([z.string(), z.number()]),
                    icon: z.string().optional(),
                })).optional(),
            }),
        },

        ProgressTimeline: {
            props: z.object({
                steps: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    description: z.string().optional(),
                    timestamp: z.string().optional(),
                    status: z.enum(['complete', 'current', 'pending', 'error']).optional(),
                })),
                currentIndex: z.number().optional(),
            }),
        },

        InfoSidebar: {
            props: z.object({
                title: z.string(),
                content: z.string(),
                links: z.array(z.object({
                    label: z.string(),
                    url: z.string(),
                    icon: z.string().optional(),
                })).optional(),
                isOpen: z.boolean(),
                onToggle: z.any().optional(), // Event handler
                position: z.enum(['left', 'right']).optional(),
            }),
        },

        InlineTutorialTooltip: {
            props: z.object({
                targetSelector: z.string(),
                content: z.string(),
                position: z.enum(['top', 'bottom', 'left', 'right']).optional(),
                onDismiss: z.any().optional(), // Event handler
            }),
            hasChildren: true,
        },

        CodeDiffViewer: {
            props: z.object({
                oldCode: z.string(),
                newCode: z.string(),
                language: z.string().optional(),
                filePath: z.string().optional(),
                mode: z.enum(['unified', 'split']).optional(),
            }),
        },

        FileAssetPicker: {
            props: z.object({
                files: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    type: z.enum(['file', 'folder', 'image', 'document', 'code']),
                    size: z.string().optional(),
                    preview: z.string().optional(),
                    path: z.string().optional(),
                })),
                selectedIds: z.array(z.string()),
                allowMultiple: z.boolean().optional(),
                viewMode: z.enum(['grid', 'list']).optional(),
                onSelect: z.any().optional(), // Event handler
            }),
        },

        PdfPreview: {
            props: z.object({
                file: z.string(),
                url: z.string().optional(),
                pages: z.number().optional(),
                className: z.string().optional(),
            }),
        },

        ConfirmationModal: {
            props: z.object({
                isOpen: z.boolean(),
                title: z.string(),
                message: z.string(),
                confirmLabel: z.string().optional(),
                cancelLabel: z.string().optional(),
                variant: z.enum(['danger', 'warning', 'info']).optional(),
                onConfirm: z.any().optional(), // Event handler
                onCancel: z.any().optional(), // Event handler
            }),
        },

        LoadingProgress: {
            props: z.object({
                stages: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    status: z.enum(['pending', 'active', 'complete', 'error']),
                })).optional(),
                currentStage: z.string().optional(),
                progress: z.number().optional(),
                message: z.string().optional(),
                delayMs: z.number().optional(),
            }),
        },

        RichMarkdownRenderer: {
            props: z.object({
                content: z.string(),
            }),
        },

        MarkdownEditor: {
            props: z.object({
                initialValue: z.string().optional(),
                readOnly: z.boolean().optional(),
                onChange: z.function().optional(),
            }),
        },

        ImageCompare: {
            props: z.object({
                before: z.string(),
                after: z.string(),
                beforeLabel: z.string().optional(),
                afterLabel: z.string().optional(),
            }),
        },

        JsonDiff: {
            props: z.object({
                oldJson: z.any(),
                newJson: z.any(),
            }),
        },

        HexInspector: {
            props: z.object({
                data: z.any(), // Uint8Array or similar
            }),
        },

        CsvViewer: {
            props: z.object({
                data: z.string(),
                delimiter: z.string().optional(),
            }),
        },

        ConflictResolver: {
            props: z.object({
                filename: z.string(),
                base: z.string(),
                current: z.string(),
                incoming: z.string(),
            }),
        },

        DiffStatSummary: {
            props: z.object({
                added: z.number(),
                modified: z.number(),
                removed: z.number(),
                files: z.number(),
            }),
        },

        FileMetadataCard: {
            props: z.object({
                file: z.object({
                    name: z.string(),
                    path: z.string(),
                    size: z.string(),
                    created: z.string(),
                    modified: z.string(),
                    type: z.string(),
                    permissions: z.string().optional(),
                    mime: z.string().optional(),
                }),
            }),
        },

        RegexTester: {
            props: z.object({
                initialPattern: z.string().optional(),
                initialText: z.string().optional(),
            }),
        },

        // =========================================================================
        // Interaction Components
        // =========================================================================

        StepChecklist: {
            props: z.object({
                steps: z.array(z.object({
                    id: z.string(),
                    description: z.string(),
                    risk: z.enum(['low', 'medium', 'high']),
                    reversible: z.boolean(),
                    checked: z.boolean(),
                    details: z.string().optional(),
                })),
                groupByRisk: z.boolean().optional(),
                showReversibleBadge: z.boolean().optional(),
            }),
        },

        DirectionPicker: {
            props: z.object({
                directions: z.array(z.object({
                    id: z.string(),
                    direction: z.string(),
                    rationale: z.string(),
                    effort: z.enum(['quick', 'medium', 'deep']),
                    selected: z.boolean(),
                })),
                showEffortBadges: z.boolean().optional(),
                showRationale: z.boolean().optional(),
                allowCustom: z.boolean().optional(),
            }),
        },

        SelectionList: {
            props: z.object({
                options: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    description: z.string().optional(),
                    preview: z.string().optional(),
                    selected: z.boolean(),
                })),
                allowMultiple: z.boolean().optional(),
                allowCustom: z.boolean().optional(),
                showPreview: z.boolean().optional(),
            }),
        },

        ApprovalButtons: {
            props: z.object({
                title: z.string(),
                details: z.string().optional(),
                risk: z.enum(['low', 'medium', 'high']).optional(),
            }),
        },

        QuestionInput: {
            props: z.object({
                question: z.string(),
                context: z.string().optional(),
                options: z.array(z.string()).optional(),
                allowFreeform: z.boolean().optional(),
                value: z.string().optional(),
            }),
        },

        NotificationBanner: {
            props: z.object({
                message: z.string(),
                level: z.enum(['info', 'success', 'warning', 'error']),
            }),
        },

        // =========================================================================
        // Directive Components
        // =========================================================================

        DirectiveChip: {
            props: z.object({
                type: z.string(),
                value: z.string(),
                icon: z.string().optional(),
                onRemove: z.boolean().optional(),
            }),
        },

        DirectiveInput: {
            props: z.object({
                type: z.string(),
                placeholder: z.string().optional(),
                label: z.string().optional(),
            }),
        },

        // =========================================================================
        // Common Components
        // =========================================================================

        RiskBadge: {
            props: z.object({
                risk: z.enum(['low', 'medium', 'high']),
            }),
        },

        EffortBadge: {
            props: z.object({
                effort: z.enum(['quick', 'medium', 'deep']),
            }),
        },

        Checkbox: {
            props: z.object({
                id: z.string(),
                checked: z.boolean(),
                label: z.string(),
                disabled: z.boolean().optional(),
            }),
        },

        // =========================================================================
        // Batch 7: Feedback & Status
        // =========================================================================

        ToastManager: {
            props: z.object({
                toasts: z.array(z.object({
                    id: z.string(),
                    title: z.string().optional(),
                    message: z.string(),
                    type: z.enum(['success', 'warning', 'error', 'info']),
                    duration: z.number().optional(),
                })),
                onDismiss: z.any().optional(),
            }),
        },

        Badge: {
            props: z.object({
                label: z.union([z.string(), z.number()]),
                type: z.enum(['success', 'warning', 'error', 'info', 'default', 'outline']).optional(),
                icon: z.any().optional(), // ReactNode not strictly validating here
            }),
        },

        AlertBanner: {
            props: z.object({
                title: z.string().optional(),
                message: z.string(),
                type: z.enum(['success', 'warning', 'error', 'info']).optional(),
                onDismiss: z.any().optional(),
            }),
        },

        Skeleton: {
            props: z.object({
                variant: z.enum(['text', 'rect', 'circle']).optional(),
                width: z.union([z.string(), z.number()]).optional(),
                height: z.union([z.string(), z.number()]).optional(),
            }),
        },

        CircularProgress: {
            props: z.object({
                value: z.number(),
                size: z.number().optional(),
                label: z.string().optional(),
                showLabel: z.boolean().optional(),
                color: z.string().optional(),
            }),
        },

        // =========================================================================
        // Batch B: Navigation & Charts
        // =========================================================================

        Stepper: {
            props: z.object({
                steps: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    status: z.enum(['pending', 'current', 'completed', 'error']),
                    description: z.string().optional(),
                })),
                currentStepId: z.string(),
            }),
        },

        RadarChart: {
            props: z.object({
                data: z.array(z.object({
                    label: z.string(),
                    value: z.number(),
                })),
            }),
        },

        SankeyDiagram: {
            props: z.object({
                nodes: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                })),
                links: z.array(z.object({
                    source: z.string(),
                    target: z.string(),
                    value: z.number(),
                })),
            }),
        },

        NetworkGraph: {
            props: z.object({
                nodes: z.array(z.any()),
                links: z.array(z.any()),
            }),
        },

        Timeline: {
            props: z.object({
                events: z.array(z.object({
                    id: z.string(),
                    date: z.string(),
                    title: z.string(),
                    description: z.string().optional(),
                    type: z.enum(['milestone', 'marker', 'default']).optional(),
                })),
            }),
        },

        OrgChart: {
            props: z.object({
                data: z.any(), // Tree structure
            }),
        },

        MindMap: {
            props: z.object({
                data: z.any(), // Tree structure
            }),
        },

        RadialNav: {
            props: z.object({
                items: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    icon: z.string().optional(),
                })),
            }),
        },

        DockMenu: {
            props: z.object({
                items: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    icon: z.string().optional(),
                })),
            }),
        },

        SidePanel: {
            props: z.object({
                isOpen: z.boolean(),
                title: z.string(),
                onClose: z.function().optional(),
            }),
            hasChildren: true,
        },

        // =========================================================================
        // Batch C: System & Ops
        // =========================================================================

        EncryptionStatus: {
            props: z.object({
                status: z.enum(['secure', 'vulnerable', 'breached']).optional(),
                algorithm: z.string().optional(),
            }),
        },

        SignalMonitor: {
            props: z.object({
                frequency: z.number().optional(),
                strength: z.number().optional(),
            }),
        },

        SystemHealthGauge: {
            props: z.object({
                cpu: z.number().optional(),
                memory: z.number().optional(),
                temp: z.number().optional(),
            }),
        },

        ProcessTable: {
            props: z.object({
                processes: z.array(z.object({
                    pid: z.number(),
                    name: z.string(),
                    cpu: z.number(),
                    mem: z.number(),
                    status: z.enum(['running', 'sleeping', 'zombie']),
                })).optional(),
            }),
        },

        TerminalConsole: {
            props: z.object({
                lines: z.array(z.string()).optional(),
                prompt: z.string().optional(),
            }),
        },

        PacketInspector: {
            props: z.object({
                packets: z.array(z.object({
                    id: z.string(),
                    source: z.string(),
                    dest: z.string(),
                    protocol: z.string(),
                    size: z.number(),
                    payload: z.string().optional(),
                })).optional(),
            }),
        },

        ServerRackStatus: {
            props: z.object({
                racks: z.array(z.object({
                    id: z.string(),
                    units: z.number(),
                    status: z.enum(['ok', 'warning', 'error']),
                })).optional(),
            }),
        },

        AccessPad: {
            props: z.object({
                method: z.enum(['pin', 'biometric', 'card']).optional(),
                status: z.enum(['locked', 'unlocked']).optional(),
            }),
        },

        FirewallRules: {
            props: z.object({
                rules: z.array(z.object({
                    id: z.string(),
                    type: z.enum(['allow', 'deny']),
                    source: z.string(),
                    port: z.number(),
                })).optional(),
            }),
        },
        // =========================================================================
        // Batch D: Logs & Debug
        // =========================================================================

        LiveLogStream: {
            props: z.object({
                title: z.string().optional(),
                lines: z.array(z.string()).optional(),
                autoScroll: z.boolean().optional(),
            }),
        },

        StackTraceProfiler: {
            props: z.object({
                exception: z.string(),
                message: z.string().optional(),
                frames: z.array(z.object({
                    method: z.string(),
                    file: z.string(),
                    line: z.number(),
                    column: z.number().optional(),
                    isInternal: z.boolean().optional(),
                })),
            }),
        },

        HttpInspector: {
            props: z.object({
                request: z.object({
                    method: z.string(),
                    url: z.string(),
                    headers: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
                    body: z.string().optional(),
                }),
                response: z.object({
                    status: z.number(),
                    statusText: z.string().optional(),
                    timing: z.number().optional(),
                    headers: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
                    body: z.string().optional(),
                }).optional(),
            }),
        },

        EventTimeline: {
            props: z.object({
                title: z.string().optional(),
                totalDurationMs: z.number().optional(),
                events: z.array(z.object({
                    id: z.string(),
                    label: z.string(),
                    start: z.number(),
                    width: z.number(),
                    color: z.string().optional(),
                    metadata: z.string().optional(),
                })),
            }),
        },

        AuditLogTable: {
            props: z.object({
                logs: z.array(z.object({
                    id: z.string(),
                    timestamp: z.string(),
                    actor: z.string(),
                    action: z.string(),
                    resource: z.string(),
                    result: z.string(),
                    ip: z.string().optional(),
                })),
            }),
        },

        BuildStatusLogs: {
            props: z.object({
                buildId: z.string(),
                steps: z.array(z.object({
                    name: z.string(),
                    status: z.enum(['success', 'failed', 'pending', 'running']),
                    duration: z.string().optional(),
                    logs: z.array(z.string()).optional(),
                })),
            }),
        },

        DockerStats: {
            props: z.object({
                containers: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    image: z.string(),
                    status: z.string(),
                    cpu: z.number(),
                    memory: z.number(),
                    netIo: z.string().optional(),
                })),
            }),
        },

        DistributedTrace: {
            props: z.object({
                traceId: z.string(),
                totalDuration: z.number(),
                spans: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    service: z.string(),
                    startTime: z.number(),
                    duration: z.number(),
                    status: z.enum(['ok', 'error']),
                })),
            }),
        },

        LogSearchQuery: {
            props: z.object({
                query: z.string().optional(),
                results: z.array(z.object({
                    line: z.number(),
                    content: z.string(),
                    matches: z.array(z.string()).optional(),
                })).optional(),
            }),
        },

        AlertFeed: {
            props: z.object({
                alerts: z.array(z.object({
                    id: z.string(),
                    severity: z.enum(['critical', 'high', 'medium', 'low']),
                    title: z.string(),
                    message: z.string(),
                    timestamp: z.string(),
                    source: z.string(),
                })),
            }),
        },

        // =========================================================================
        // Batch E: Finance & Markets
        // =========================================================================

        OrderBook: {
            props: z.object({
                asks: z.array(z.object({
                    price: z.number(),
                    size: z.number(),
                    total: z.number(),
                    depth: z.number(),
                })).optional(),
                bids: z.array(z.object({
                    price: z.number(),
                    size: z.number(),
                    total: z.number(),
                    depth: z.number(),
                })).optional(),
            }),
        },

        CandleStickChart: {
            props: z.object({
                symbol: z.string().optional(),
                interval: z.string().optional(),
                data: z.array(z.object({
                    time: z.string(),
                    open: z.number(),
                    high: z.number(),
                    low: z.number(),
                    close: z.number(),
                    volume: z.number(),
                })).optional(),
            }),
        },

        TradeHistory: {
            props: z.object({
                trades: z.array(z.object({
                    id: z.string(),
                    price: z.number(),
                    size: z.number(),
                    side: z.enum(['buy', 'sell']),
                    time: z.string(),
                })).optional(),
            }),
        },

        DepthChart: {
            props: z.object({
                bids: z.array(z.array(z.number())).optional(), // [price, volume]
                asks: z.array(z.array(z.number())).optional(),
            }),
        },

        TickerTape: {
            props: z.object({
                items: z.array(z.object({
                    symbol: z.string(),
                    price: z.number(),
                    change: z.number(),
                })).optional(),
                speed: z.number().optional(),
            }),
        },

        AssetCard: {
            props: z.object({
                asset: z.string().optional(),
                balance: z.number().optional(),
                value: z.number().optional(),
                pnl: z.number().optional(),
                chartData: z.array(z.number()).optional(),
            }),
        },

        PortfolioPie: {
            props: z.object({
                assets: z.array(z.object({
                    label: z.string(),
                    value: z.number(),
                    color: z.string().optional(),
                })).optional(),
            }),
        },

        MarketHeatmap: {
            props: z.object({
                sectors: z.array(z.object({
                    name: z.string(),
                    performance: z.number(),
                    marketCap: z.number().optional(),
                })).optional(),
            }),
        },

        ForecastingLine: {
            props: z.object({
                historical: z.array(z.object({
                    time: z.string(),
                    value: z.number(),
                })).optional(),
                forecast: z.array(z.object({
                    time: z.string(),
                    value: z.number(),
                    confidenceLow: z.number(),
                    confidenceHigh: z.number(),
                })).optional(),
            }),
        },

        ExchangeStatus: {
            props: z.object({
                status: z.enum(['operational', 'maintenance', 'degraded']).optional(),
                latency: z.number().optional(),
                services: z.array(z.object({
                    name: z.string(),
                    status: z.string(),
                })).optional(),
            }),
        },
    },

    actions: catalogActions,
});

export type AgentpingCatalog = typeof agentpingCatalog;
