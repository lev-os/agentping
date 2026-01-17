/**
 * Slack Notification Adapter
 * 
 * Sends ping notifications to Slack channels with interactive buttons.
 */

import type { INotificationChannel, Ping, ParsedInteraction } from '@agentping/core';
import { WebClient, type ChatPostMessageResponse, type KnownBlock, type MrkdwnElement } from '@slack/web-api';

// ============================================================================
// Types
// ============================================================================

export interface SlackConfig {
    botToken: string;
    defaultChannel?: string;
    channelMap?: Record<string, string>; // agentId -> channelId
}

// ============================================================================
// Slack Channel Implementation
// ============================================================================

export class SlackChannel implements INotificationChannel {
    readonly name = 'slack';
    readonly supportsInlineResponse = true;
    readonly supportedInteractionTypes = ['*'];

    private client: WebClient;
    private config: SlackConfig;

    constructor(config: SlackConfig) {
        this.config = config;
        this.client = new WebClient(config.botToken);
    }

    async notify(ping: Ping): Promise<void> {
        const channel = this.getChannel(ping);
        if (!channel) {
            console.warn(`[Slack] No channel configured for agent: ${ping.agentId}`);
            return;
        }

        const blocks = this.buildBlocks(ping);

        await this.client.chat.postMessage({
            channel,
            text: this.getFallbackText(ping),
            blocks,
            metadata: {
                event_type: 'agentping',
                event_payload: {
                    ping_id: ping.id,
                    agent_id: ping.agentId,
                    type: ping.type,
                },
            },
        });
    }

    private getChannel(ping: Ping): string | undefined {
        return this.config.channelMap?.[ping.agentId] ?? this.config.defaultChannel;
    }

    private getFallbackText(ping: Ping): string {
        const parsed = ping.parsedInteraction;
        return parsed?.fallbackText ?? `Ping from ${ping.agentName}`;
    }

    private buildBlocks(ping: Ping): KnownBlock[] {
        const parsed = ping.parsedInteraction;
        const blocks: KnownBlock[] = [];

        // Header
        blocks.push({
            type: 'header',
            text: {
                type: 'plain_text',
                text: `🔔 ${ping.agentName}`,
                emoji: true,
            },
        });

        // Title/Message
        const payload = ping.payload as Record<string, unknown>;
        const title = payload.title || payload.question || payload.message || ping.type;
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*${title}*`,
            },
        });

        // Context (details, risk level, etc.)
        const contextElements: MrkdwnElement[] = [];
        if (payload.risk) {
            const riskEmoji = payload.risk === 'high' ? '🔴' : payload.risk === 'medium' ? '🟡' : '🟢';
            contextElements.push({
                type: 'mrkdwn',
                text: `${riskEmoji} *Risk:* ${payload.risk}`,
            });
        }
        if (payload.context) {
            contextElements.push({
                type: 'mrkdwn',
                text: String(payload.context),
            });
        }
        if (contextElements.length > 0) {
            blocks.push({
                type: 'context',
                elements: contextElements,
            } as KnownBlock);
        }

        // Quick actions as buttons
        if (parsed?.quickActions && parsed.quickActions.length > 0) {
            const buttons = parsed.quickActions
                .filter(a => a.style !== 'ghost')
                .slice(0, 5) // Slack limit
                .map(action => ({
                    type: 'button' as const,
                    text: {
                        type: 'plain_text' as const,
                        text: action.label,
                        emoji: true,
                    },
                    action_id: `agentping_${action.id}`,
                    value: JSON.stringify({ pingId: ping.id, actionId: action.id }),
                    ...(action.style === 'primary' ? { style: 'primary' as const } :
                        action.style === 'danger' ? { style: 'danger' as const } : {}),
                }));

            blocks.push({
                type: 'actions',
                block_id: `agentping_actions_${ping.id}`,
                elements: buttons,
            } as KnownBlock);
        }

        // Divider
        blocks.push({ type: 'divider' });

        // Footer with link to UI
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `<http://localhost:7891/ping/${ping.id}|Open in AgentPing UI> • ID: \`${ping.id.slice(0, 8)}...\``,
                },
            ],
        });

        return blocks;
    }
}

// ============================================================================
// Factory
// ============================================================================

export function createSlackChannel(config: SlackConfig): SlackChannel {
    return new SlackChannel(config);
}
