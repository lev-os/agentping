/**
 * Event Bus
 * 
 * Simple pub/sub for internal events.
 */

import EventEmitter from 'eventemitter3';
import type { Ping, HumanResponse } from '../domain/ping.js';

// ============================================================================
// Event Types
// ============================================================================

export interface PingEvents {
    'ping:created': (ping: Ping) => void;
    'ping:responded': (ping: Ping, response: HumanResponse) => void;
    'ping:expired': (ping: Ping) => void;
    'ping:dismissed': (ping: Ping) => void;
    'ping:cancelled': (ping: Ping) => void;
}

export interface SessionEvents {
    'session:started': (sessionId: string, agentId: string) => void;
    'session:ended': (sessionId: string) => void;
}

export type AgentPingEvents = PingEvents & SessionEvents;

// ============================================================================
// Event Bus Interface
// ============================================================================

export interface IEventBus {
    emit<K extends keyof AgentPingEvents>(
        event: K,
        ...args: Parameters<AgentPingEvents[K]>
    ): void;

    on<K extends keyof AgentPingEvents>(
        event: K,
        listener: AgentPingEvents[K]
    ): void;

    off<K extends keyof AgentPingEvents>(
        event: K,
        listener: AgentPingEvents[K]
    ): void;

    once<K extends keyof AgentPingEvents>(
        event: K,
        listener: AgentPingEvents[K]
    ): void;
}

// ============================================================================
// Event Bus Implementation
// ============================================================================

export class EventBus implements IEventBus {
    private emitter = new EventEmitter();

    emit<K extends keyof AgentPingEvents>(
        event: K,
        ...args: Parameters<AgentPingEvents[K]>
    ): void {
        this.emitter.emit(event as string, ...args);
    }

    on<K extends keyof AgentPingEvents>(
        event: K,
        listener: AgentPingEvents[K]
    ): void {
        this.emitter.on(event as string, listener as (...args: unknown[]) => void);
    }

    off<K extends keyof AgentPingEvents>(
        event: K,
        listener: AgentPingEvents[K]
    ): void {
        this.emitter.off(event as string, listener as (...args: unknown[]) => void);
    }

    once<K extends keyof AgentPingEvents>(
        event: K,
        listener: AgentPingEvents[K]
    ): void {
        this.emitter.once(event as string, listener as (...args: unknown[]) => void);
    }
}

/**
 * Create a new event bus instance
 */
export function createEventBus(): IEventBus {
    return new EventBus();
}
