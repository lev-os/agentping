/**
 * ChannelManager - Notification Channel Management
 *
 * Manages notification channels and dispatches notifications / updates
 * to all registered channels with error isolation.
 */

import type { Ping, ParsedInteraction } from '../domain/ping.js';
import type { INotificationChannel, ChannelUpdate } from '../ports/channel.js';

// ============================================================================
// ChannelManager Implementation
// ============================================================================

export class ChannelManager {
    private readonly channels: INotificationChannel[];

    constructor(channels: INotificationChannel[] = []) {
        this.channels = [...channels];
    }

    /**
     * Register a new notification channel.
     */
    registerChannel(channel: INotificationChannel): void {
        this.channels.push(channel);
    }

    /**
     * Get all registered channels (returns a copy).
     */
    getChannels(): INotificationChannel[] {
        return [...this.channels];
    }

    /**
     * Notify all channels about a new ping.
     * Errors from individual channels are caught and logged so one
     * failing channel does not block the others.
     */
    async notifyChannels(ping: Ping, parsedInteraction: ParsedInteraction | null): Promise<void> {
        const notifications = this.channels.map(async (channel) => {
            try {
                await channel.notify(ping, parsedInteraction);
            } catch (error) {
                console.error(`Failed to notify channel ${channel.name}:`, error);
            }
        });

        await Promise.all(notifications);
    }

    /**
     * Update all channels about a ping status change.
     * Errors from individual channels are caught and logged.
     */
    async updateChannels(pingId: string, update: ChannelUpdate): Promise<void> {
        const updates = this.channels.map(async (channel) => {
            if (channel.update) {
                try {
                    await channel.update(pingId, update);
                } catch (error) {
                    console.error(`Failed to update channel ${channel.name}:`, error);
                }
            }
        });

        await Promise.all(updates);
    }
}
