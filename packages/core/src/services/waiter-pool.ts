/**
 * WaiterPool - Long-Polling Waiter Management
 *
 * Manages response waiters for long-polling. When a consumer calls
 * waitForResponse(), a waiter is registered. When a response arrives,
 * all waiters for that ping are resolved.
 */

import type { HumanResponse } from '../domain/ping.js';

// ============================================================================
// Types
// ============================================================================

interface ResponseWaiter {
    resolve: (response: HumanResponse | null) => void;
    timeout: NodeJS.Timeout;
}

// ============================================================================
// WaiterPool Implementation
// ============================================================================

export class WaiterPool {
    private readonly waiters: Map<string, ResponseWaiter[]> = new Map();

    /**
     * Register a waiter that will be resolved when a response arrives
     * or when the timeout expires (resolves with null).
     */
    wait(pingId: string, timeoutMs: number): Promise<HumanResponse | null> {
        return new Promise((resolve) => {
            const waiter: ResponseWaiter = {
                resolve,
                timeout: setTimeout(() => {
                    this.removeWaiter(pingId, waiter);
                    resolve(null);
                }, timeoutMs),
            };

            if (!this.waiters.has(pingId)) {
                this.waiters.set(pingId, []);
            }
            this.waiters.get(pingId)!.push(waiter);
        });
    }

    /**
     * Resolve all waiters for a ping with the given response.
     * Passing null signals cancellation / dismissal.
     */
    resolveWaiters(pingId: string, response: HumanResponse | null): void {
        const waiters = this.waiters.get(pingId);
        if (waiters) {
            for (const waiter of waiters) {
                clearTimeout(waiter.timeout);
                waiter.resolve(response);
            }
            this.waiters.delete(pingId);
        }
    }

    /**
     * Remove a single waiter (e.g. on timeout).
     */
    private removeWaiter(pingId: string, waiter: ResponseWaiter): void {
        const waiters = this.waiters.get(pingId);
        if (waiters) {
            const index = waiters.indexOf(waiter);
            if (index !== -1) {
                waiters.splice(index, 1);
            }
            if (waiters.length === 0) {
                this.waiters.delete(pingId);
            }
        }
    }
}
