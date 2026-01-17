/**
 * API Client for AgentPing
 */

import type { Ping, HumanResponse } from '@agentping/core';

const API_BASE = '/api/v1';

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

// ============================================================================
// Ping API
// ============================================================================

export async function fetchPings(): Promise<Ping[]> {
    const res = await fetch(`${API_BASE}/pings`);
    const data = await res.json();
    return data.pings || [];
}

export async function fetchPing(id: string): Promise<Ping | null> {
    const res = await fetch(`${API_BASE}/pings/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.ping;
}

export async function respondToPing(
    id: string,
    response: Omit<HumanResponse, 'respondedAt'>
): Promise<Ping> {
    const res = await fetch(`${API_BASE}/pings/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...response,
            respondedVia: 'web-ui',
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to respond');
    }

    const data = await res.json();
    return data.ping;
}

export async function dismissPing(
    id: string,
    enrichment?: HumanResponse['enrichment']
): Promise<void> {
    const res = await fetch(`${API_BASE}/pings/${id}/dismiss`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            enrichment,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to dismiss');
    }
}

// ============================================================================
// Response Builders
// ============================================================================

export function buildApprovalResponse(approved: boolean): Omit<HumanResponse, 'respondedAt'> {
    return {
        action: approved ? 'approved' : 'denied',
        data: { type: 'approval', approved },
        respondedVia: 'web-ui',
    };
}

export function buildStepApprovalResponse(
    approvedSteps: string[],
    deniedSteps: string[],
    enrichment?: HumanResponse['enrichment']
): Omit<HumanResponse, 'respondedAt'> {
    return {
        action: approvedSteps.length > 0 ? 'approved' : 'denied',
        data: { type: 'step_approval', approvedSteps, deniedSteps },
        enrichment,
        respondedVia: 'web-ui',
    };
}

export function buildSelectionResponse(
    selectedIds: string[],
    customValue?: string,
    enrichment?: HumanResponse['enrichment']
): Omit<HumanResponse, 'respondedAt'> {
    return {
        action: 'selected',
        data: { type: 'selection', selectedIds, customValue },
        enrichment,
        respondedVia: 'web-ui',
    };
}

export function buildAnswerResponse(
    value: string,
    enrichment?: HumanResponse['enrichment']
): Omit<HumanResponse, 'respondedAt'> {
    return {
        action: 'answered',
        data: { type: 'answer', value },
        enrichment,
        respondedVia: 'web-ui',
    };
}

export function buildTaskWorkflowResponse(
    completedSteps: string[],
    notes: Record<string, string>,
    enrichment?: HumanResponse['enrichment']
): Omit<HumanResponse, 'respondedAt'> {
    return {
        action: 'approved',
        data: { type: 'task_workflow', completedSteps, notes },
        enrichment,
        respondedVia: 'web-ui',
    };
}
