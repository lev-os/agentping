/**
 * INotificationChannel - Output Port
 * 
 * How humans get notified about pings. Implemented by output adapters
 * (Web UI, Slack, Discord, Webhooks, etc.)
 */

import type { Ping, ParsedInteraction } from '../domain/ping.js';

export interface INotificationChannel {
    /**
     * Unique name of this channel
     */
    readonly name: string;

    /**
     * Whether the channel supports responding inline (without leaving the channel)
     * e.g., Slack can respond inline, but email cannot
     */
    readonly supportsInlineResponse: boolean;

    /**
     * What UI patterns this channel can render
     * e.g., ['step-checklist', 'direction-picker', 'simple-buttons']
     */
    readonly supportedInteractionTypes: string[];

    /**
     * Notify the channel about a new ping
     */
    notify(ping: Ping, parsedInteraction: ParsedInteraction | null): Promise<void>;

    /**
     * Optional: Update an existing notification (e.g., mark as responded)
     */
    update?(pingId: string, update: ChannelUpdate): Promise<void>;
}

export type ChannelUpdate =
    | { type: 'responded'; response: string }
    | { type: 'expired' }
    | { type: 'dismissed' };
