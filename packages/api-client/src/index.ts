/**
 * @agentping/api-client
 *
 * Typed HTTP client for the AgentPing daemon API.
 * Implements IPingSubmitter from @agentping/core and provides additional
 * convenience methods for common agent-human interaction patterns.
 */

import type {
    Ping,
    CreatePingRequest,
    HumanResponse,
    IPingSubmitter,
} from '@agentping/core';

// ============================================================================
// Configuration
// ============================================================================

export interface AgentPingClientConfig {
    /** Base URL of the AgentPing daemon. Defaults to AGENTPING_URL env or http://localhost:7890 */
    baseUrl?: string;
    /** Agent identifier. Defaults to AGENTPING_AGENT_ID env or 'unknown' */
    agentId?: string;
    /** Human-readable agent name. Defaults to AGENTPING_AGENT_NAME env or agentId */
    agentName?: string;
    /** Session identifier. Defaults to AGENTPING_SESSION_ID env or auto-generated */
    sessionId?: string;
    /** Default timeout in milliseconds for waitForResponse. Defaults to 300_000 (5 minutes) */
    defaultTimeoutMs?: number;
}

// ============================================================================
// Error Class
// ============================================================================

export class AgentPingApiError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly details: unknown;

    constructor(
        message: string,
        statusCode: number,
        errorCode: string,
        details?: unknown,
    ) {
        super(message);
        this.name = 'AgentPingApiError';
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
    }
}

// ============================================================================
// Filter Types
// ============================================================================

export interface PingFilters {
    status?: string;
    agentId?: string;
    sessionId?: string;
}

// ============================================================================
// Client Implementation
// ============================================================================

export class AgentPingClient implements IPingSubmitter {
    private readonly baseUrl: string;
    private readonly agentId: string;
    private readonly agentName: string;
    private readonly sessionId: string;
    private readonly defaultTimeoutMs: number;

    constructor(config?: AgentPingClientConfig) {
        this.baseUrl = (
            config?.baseUrl ??
            process.env.AGENTPING_URL ??
            'http://localhost:7890'
        ).replace(/\/+$/, ''); // strip trailing slashes

        this.agentId =
            config?.agentId ??
            process.env.AGENTPING_AGENT_ID ??
            'unknown';

        this.agentName =
            config?.agentName ??
            process.env.AGENTPING_AGENT_NAME ??
            this.agentId;

        this.sessionId =
            config?.sessionId ??
            process.env.AGENTPING_SESSION_ID ??
            AgentPingClient._generateSessionId();

        this.defaultTimeoutMs = config?.defaultTimeoutMs ?? 300_000;
    }

    // ========================================================================
    // IPingSubmitter Implementation
    // ========================================================================

    /**
     * Submit a new ping to the daemon.
     * POST /api/v1/pings
     */
    async submit(request: CreatePingRequest): Promise<Ping> {
        const body = await this._fetch('/api/v1/pings', {
            method: 'POST',
            body: JSON.stringify(request),
        });
        return (body as { ping: Ping }).ping;
    }

    /**
     * Get the current status of a ping by ID.
     * GET /api/v1/pings/:id
     * Returns null if the ping is not found (404).
     */
    async getStatus(pingId: string): Promise<Ping | null> {
        try {
            const body = await this._fetch(`/api/v1/pings/${encodeURIComponent(pingId)}`);
            return (body as { ping: Ping }).ping;
        } catch (err) {
            if (err instanceof AgentPingApiError && err.statusCode === 404) {
                return null;
            }
            throw err;
        }
    }

    /**
     * Long-poll for a human response to a ping.
     * GET /api/v1/pings/:id/wait?timeout=<seconds>
     * Returns null if the request times out (408).
     */
    async waitForResponse(
        pingId: string,
        timeoutMs?: number,
    ): Promise<HumanResponse | null> {
        const timeout = timeoutMs ?? this.defaultTimeoutMs;
        const timeoutSeconds = Math.ceil(timeout / 1000);

        try {
            const body = await this._fetch(
                `/api/v1/pings/${encodeURIComponent(pingId)}/wait?timeout=${timeoutSeconds}`,
            );
            return (body as { response: HumanResponse }).response;
        } catch (err) {
            if (err instanceof AgentPingApiError && err.statusCode === 408) {
                return null;
            }
            throw err;
        }
    }

    /**
     * Cancel a pending ping.
     * DELETE /api/v1/pings/:id
     */
    async cancel(pingId: string): Promise<void> {
        await this._fetch(`/api/v1/pings/${encodeURIComponent(pingId)}`, {
            method: 'DELETE',
        });
    }

    // ========================================================================
    // Extended Convenience Methods
    // ========================================================================

    /**
     * Get pending pings, optionally filtered.
     * GET /api/v1/pings?status=pending
     */
    async getPending(filters?: PingFilters): Promise<Ping[]> {
        const params = new URLSearchParams();
        params.set('status', filters?.status ?? 'pending');
        if (filters?.agentId) params.set('agentId', filters.agentId);
        if (filters?.sessionId) params.set('sessionId', filters.sessionId);

        const body = await this._fetch(`/api/v1/pings?${params.toString()}`);
        return (body as { pings: Ping[] }).pings;
    }

    /**
     * Submit a human response to a ping.
     * POST /api/v1/pings/:id/respond
     */
    async respond(pingId: string, response: HumanResponse): Promise<Ping> {
        const body = await this._fetch(
            `/api/v1/pings/${encodeURIComponent(pingId)}/respond`,
            {
                method: 'POST',
                body: JSON.stringify(response),
            },
        );
        return (body as { ping: Ping }).ping;
    }

    /**
     * Dismiss a pending ping.
     * POST /api/v1/pings/:id/dismiss
     */
    async dismiss(pingId: string): Promise<void> {
        await this._fetch(
            `/api/v1/pings/${encodeURIComponent(pingId)}/dismiss`,
            { method: 'POST' },
        );
    }

    // ========================================================================
    // High-Level Convenience Methods
    // ========================================================================

    /**
     * Ask the human a free-form question and wait for an answer.
     * Returns the answer string, or null if it times out.
     */
    async askHuman(
        question: string,
        options?: { context?: string; timeoutMs?: number },
    ): Promise<string | null> {
        const ping = await this.submit({
            agentId: this.agentId,
            agentName: this.agentName,
            sessionId: this.sessionId,
            payload: {
                type: 'question',
                question,
                context: options?.context,
                allowFreeform: true,
            },
        });

        const response = await this.waitForResponse(
            ping.id,
            options?.timeoutMs ?? this.defaultTimeoutMs,
        );

        if (!response) return null;

        if (response.data.type === 'answer') {
            return response.data.value;
        }

        return null;
    }

    /**
     * Request approval for an action. Returns an object with `approved` and
     * optional `notes`, or null on timeout.
     */
    async requestApproval(
        message: string,
        options?: { riskLevel?: string; context?: string; timeoutMs?: number },
    ): Promise<{ approved: boolean; notes?: string } | null> {
        const ping = await this.submit({
            agentId: this.agentId,
            agentName: this.agentName,
            sessionId: this.sessionId,
            payload: {
                type: 'approval',
                title: message,
                action: message,
                details: options?.context,
                risk: (options?.riskLevel as 'low' | 'medium' | 'high') ?? undefined,
            },
        });

        const response = await this.waitForResponse(
            ping.id,
            options?.timeoutMs ?? this.defaultTimeoutMs,
        );

        if (!response) return null;

        if (response.data.type === 'approval') {
            return {
                approved: response.data.approved,
                notes: response.enrichment?.notes,
            };
        }

        return {
            approved: response.action === 'approved',
            notes: response.enrichment?.notes,
        };
    }

    /**
     * Request approval for a set of steps. Returns which steps were approved,
     * or null on timeout.
     */
    async requestStepApproval(
        steps: Array<{ title: string; description?: string; risk?: string }>,
        options?: { timeoutMs?: number },
    ): Promise<{ approved: boolean; approvedSteps?: string[] } | null> {
        const stepsPayload = steps.map((step, idx) => ({
            id: `step-${idx}`,
            description: step.title + (step.description ? `: ${step.description}` : ''),
            risk: (step.risk as 'low' | 'medium' | 'high') ?? 'low',
            reversible: false,
        }));

        const ping = await this.submit({
            agentId: this.agentId,
            agentName: this.agentName,
            sessionId: this.sessionId,
            payload: {
                type: 'step_approval',
                title: 'Step Approval Request',
                context: `Approve ${steps.length} step(s)`,
                steps: stepsPayload,
                allowPartial: true,
                defaultApproved: [],
            },
        });

        const response = await this.waitForResponse(
            ping.id,
            options?.timeoutMs ?? this.defaultTimeoutMs,
        );

        if (!response) return null;

        if (response.data.type === 'step_approval') {
            return {
                approved: response.data.approvedSteps.length > 0,
                approvedSteps: response.data.approvedSteps,
            };
        }

        return {
            approved: response.action === 'approved',
        };
    }

    /**
     * Fire-and-forget notification to the human. Does not wait for a response.
     */
    async notify(
        message: string,
        options?: { level?: string },
    ): Promise<void> {
        await this.submit({
            agentId: this.agentId,
            agentName: this.agentName,
            sessionId: this.sessionId,
            payload: {
                type: 'notification',
                message,
                level: (options?.level as 'info' | 'success' | 'warning' | 'error') ?? 'info',
            },
        });
    }

    // ========================================================================
    // Private Helpers
    // ========================================================================

    /**
     * Internal fetch wrapper that handles base URL construction, common
     * headers, and error parsing.
     */
    private async _fetch(
        path: string,
        options?: RequestInit,
    ): Promise<unknown> {
        const url = `${this.baseUrl}${path}`;

        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!res.ok) {
            let errorBody: { error?: string; code?: string; details?: unknown } = {};
            try {
                errorBody = (await res.json()) as typeof errorBody;
            } catch {
                // Response body is not JSON; use status text
            }

            throw new AgentPingApiError(
                errorBody.error || res.statusText || `HTTP ${res.status}`,
                res.status,
                errorBody.code || `HTTP_${res.status}`,
                errorBody.details,
            );
        }

        // 204 No Content
        if (res.status === 204) {
            return undefined;
        }

        return res.json();
    }

    /**
     * Generate a short random session ID.
     */
    private static _generateSessionId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `session-${timestamp}-${random}`;
    }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a configured AgentPingClient instance.
 *
 * @example
 * ```ts
 * import { createClient } from '@agentping/api-client';
 *
 * const client = createClient({ agentId: 'my-agent' });
 * const answer = await client.askHuman('What color should the button be?');
 * ```
 */
export function createClient(config?: AgentPingClientConfig): AgentPingClient {
    return new AgentPingClient(config);
}

// Re-export core types for convenience
export type { Ping, CreatePingRequest, HumanResponse, IPingSubmitter };
