/**
 * @json-render Renderers for AgentPing
 * 
 * Component registry for @json-render.
 * Follows rams.ai design principles:
 * 1. Useful - Every element serves a purpose
 * 2. Aesthetic - Beautiful, minimal design
 * 3. Understandable - Self-explanatory interfaces
 * 4. Unobtrusive - Quiet until needed
 * 5. Less is more - Essential elements only
 */

import React from 'react';
import {
    PingCard,
    StepChecklist,
    SelectionList,
    ApprovalButtons,
    QuestionInput,
    DirectionPicker,
    NotificationBanner,
    EnrichmentPanel,
    QuickActionBar,
    HistoryView,
    DependencyGraph,
    StatusCard,
    ProgressTimeline,
    InfoSidebar,
    InlineTutorialTooltip,
    CodeDiffViewer,
    FileAssetPicker,
    ConfirmationModal,
    LoadingProgress,
    RichMarkdownRenderer,
    DataTable,
    LogViewer,
    SecretInput,
    JsonEditor,
    ImageDiff,
    TerminalView,
    TreeBrowser,
    TabsContainer,
    MetricChart,
    WizardStep
} from './components';

// ============================================================================
// Component Registry
// ============================================================================

/**
 * Maps component names to actual React components.
 * Used by @json-render to resolve components from JSON definitions.
 */
export const componentRegistry = {
    // Layout Components
    PingCard,
    StepChecklist,
    SelectionList,
    ApprovalButtons,
    QuestionInput,
    DirectionPicker,
    NotificationBanner,
    EnrichmentPanel,
    QuickActionBar,
    HistoryView,

    // New Primitives
    DependencyGraph,
    StatusCard,
    ProgressTimeline,
    InfoSidebar,
    InlineTutorialTooltip,
    CodeDiffViewer,
    FileAssetPicker,
    ConfirmationModal,
    LoadingProgress,
    RichMarkdownRenderer,

    // Batch 2 Primitives
    DataTable,
    LogViewer,
    SecretInput,
    JsonEditor,
    ImageDiff,
    TerminalView,
    TreeBrowser,
    TabsContainer,
    MetricChart,
    WizardStep,

    // Badge Components (minimal design - rams principle 10)
    RiskBadge: ({ risk }: { risk: 'low' | 'medium' | 'high' }) => (
        <span className={`badge badge-${risk}`} aria-label={`${risk} risk`}>
            {risk}
        </span>
    ),

    EffortBadge: ({ effort }: { effort: 'quick' | 'medium' | 'deep' }) => (
        <span className={`badge badge-${effort}`} aria-label={`${effort} effort`}>
            {effort}
        </span>
    ),

    DirectiveChip: ({ type, value, icon }: { type: string; value: string; icon?: string }) => (
        <span className="directive-chip" data-type={type}>
            {icon && <span className="directive-icon">{icon}</span>}
            <span className="directive-value">{value}</span>
        </span>
    ),

    Checkbox: ({ id, checked, label, disabled, onChange }: {
        id: string;
        checked: boolean;
        label: string;
        disabled?: boolean;
        onChange?: (checked: boolean) => void;
    }) => (
        <label className="checkbox-label" htmlFor={id}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.checked)}
                aria-checked={checked}
            />
            <span>{label}</span>
        </label>
    ),
} as const;

export type ComponentRegistry = typeof componentRegistry;

// ============================================================================
// Action Handlers
// ============================================================================

export interface ActionHandlers {
    onApprove: (pingId: string, stepIds?: string[]) => void;
    onDeny: (pingId: string, reason?: string) => void;
    onSelect: (pingId: string, selectedIds: string[], customValue?: string) => void;
    onAnswer: (pingId: string, value: string) => void;
    onDismiss: (pingId: string) => void;
    onAddDirective: (pingId: string, directive: unknown) => void;
    onRemoveDirective: (pingId: string, directiveIndex: number) => void;
    onToggleStep: (pingId: string, stepId: string) => void;
    onSelectDirection: (pingId: string, directionId: string) => void;
}

/**
 * Create action handlers connected to API
 */
export function createActionHandlers(api: {
    respond: (id: string, response: unknown) => Promise<void>;
    dismiss: (id: string) => Promise<void>;
}): ActionHandlers {
    return {
        onApprove: async (pingId, stepIds) => {
            await api.respond(pingId, { action: 'approved', data: { stepIds } });
        },
        onDeny: async (pingId, reason) => {
            await api.respond(pingId, { action: 'denied', data: { reason } });
        },
        onSelect: async (pingId, selectedIds, customValue) => {
            await api.respond(pingId, { action: 'selected', data: { selectedIds, customValue } });
        },
        onAnswer: async (pingId, value) => {
            await api.respond(pingId, { action: 'answered', data: { value } });
        },
        onDismiss: async (pingId) => {
            await api.dismiss(pingId);
        },
        onAddDirective: (pingId, directive) => {
            console.log('Add directive:', pingId, directive);
        },
        onRemoveDirective: (pingId, directiveIndex) => {
            console.log('Remove directive:', pingId, directiveIndex);
        },
        onToggleStep: (pingId, stepId) => {
            console.log('Toggle step:', pingId, stepId);
        },
        onSelectDirection: (pingId, directionId) => {
            console.log('Select direction:', pingId, directionId);
        },
    };
}
