/**
 * Webhook Notification Adapter
 * 
 * Sends ping events to configured webhook endpoints.
 */

import type { INotificationChannel, Ping, ParsedInteraction } from '@agentping/core';
import { createHmac } from 'crypto';

// ============================================================================
// Types
// ============================================================================

export interface WebhookConfig {
    url: string;
    secret?: string;
    events?: string[];
    filters?: {
        types?: string[];
        agents?: string[];
    };
    headers?: Record<string, string>;
    retryCount?: number;
    retryDelayMs?: number;
}

export interface WebhookPayload {
    event: string;
    timestamp: string;
    ping: Ping;
    parsedInteraction?: ParsedInteraction | null;
}

// ============================================================================
// Webhook Channel Implementation
// ============================================================================

export class WebhookChannel implements INotificationChannel {
    readonly name = 'webhook';
    readonly supportsInlineResponse = false;
    readonly supportedInteractionTypes = ['*'];

    private config: WebhookConfig;

    constructor(config: WebhookConfig) {
        this.config = config;
    }

    async notify(ping: Ping): Promise<void> {
        // Check event filter
        if (this.config.events && !this.config.events.includes('ping:created')) {
            return;
        }

        // Check type filter
        if (this.config.filters?.types && !this.config.filters.types.includes(ping.type)) {
            return;
        }

        // Check agent filter
        if (this.config.filters?.agents && !this.config.filters.agents.includes(ping.agentId)) {
            return;
        }

        const payload: WebhookPayload = {
            event: 'ping:created',
            timestamp: new Date().toISOString(),
            ping,
            parsedInteraction: ping.parsedInteraction,
        };

        await this.sendWithRetry(payload);
    }

    private async sendWithRetry(payload: WebhookPayload): Promise<void> {
        const maxRetries = this.config.retryCount ?? 3;
        const retryDelay = this.config.retryDelayMs ?? 1000;

        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                await this.send(payload);
                return;
            } catch (error) {
                lastError = error as Error;
                if (attempt < maxRetries) {
                    await this.delay(retryDelay * (attempt + 1));
                }
            }
        }

        throw new Error(`Webhook failed after ${maxRetries + 1} attempts: ${lastError?.message}`);
    }

    private async send(payload: WebhookPayload): Promise<void> {
        const body = JSON.stringify(payload);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'User-Agent': 'AgentPing-Webhook/0.1.0',
            ...this.config.headers,
        };

        // Add HMAC signature if secret is configured
        if (this.config.secret) {
            const signature = createHmac('sha256', this.config.secret)
                .update(body)
                .digest('hex');
            headers['X-AgentPing-Signature'] = `sha256=${signature}`;
        }

        const response = await fetch(this.config.url, {
            method: 'POST',
            headers,
            body,
        });

        if (!response.ok) {
            throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================================================
// Webhook Manager (Multiple Webhooks)
// ============================================================================

export class WebhookManager implements INotificationChannel {
    readonly name = 'webhook-manager';
    readonly supportsInlineResponse = false;
    readonly supportedInteractionTypes = ['*'];

    private channels: WebhookChannel[] = [];

    constructor(configs: WebhookConfig[]) {
        this.channels = configs.map(config => new WebhookChannel(config));
    }

    async notify(ping: Ping): Promise<void> {
        await Promise.allSettled(
            this.channels.map(channel => channel.notify(ping))
        );
    }

    addWebhook(config: WebhookConfig): void {
        this.channels.push(new WebhookChannel(config));
    }

    removeWebhook(url: string): void {
        this.channels = this.channels.filter(channel => {
            // Access private config for filtering - cast to any to access private field
            const channelConfig = (channel as unknown as { config: WebhookConfig }).config;
            return channelConfig.url !== url;
        });
    }

    getWebhookCount(): number {
        return this.channels.length;
    }
}

// ============================================================================
// Factory
// ============================================================================

export function createWebhookChannel(config: WebhookConfig): WebhookChannel {
    return new WebhookChannel(config);
}

export function createWebhookManager(configs: WebhookConfig[]): WebhookManager {
    return new WebhookManager(configs);
}
