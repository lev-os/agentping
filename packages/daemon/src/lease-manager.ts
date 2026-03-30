/**
 * Lease Manager
 *
 * JWT-based lease generation, validation, and scope enforcement
 * for browser CDP access control.
 */

import { randomUUID, createHmac } from 'crypto';
import type { IEventBus } from '@agentping/core';

// ============================================================================
// Types
// ============================================================================

export interface Lease {
  token: string;
  scopes: string[];
  tabId?: number;
  expiresAt: number;
  createdAt: number;
}

interface PendingRequest {
  requestId: string;
  agentName: string;
  scopes: string[];
  tabId?: number;
  createdAt: number;
}

/** Result of waiting for a lease decision */
export interface LeaseWaitResult {
  approved: boolean;
  lease?: Lease;
  reason?: string;
}

interface LeaseWaiter {
  resolve: (result: LeaseWaitResult) => void;
  timeout: ReturnType<typeof setTimeout>;
}

export interface LeaseManagerConfig {
  /** Lease duration in ms (default: 5 minutes) */
  leaseDurationMs?: number;
  /** Secret for signing tokens */
  secret?: string;
  /** Event bus for emitting lease events */
  eventBus?: IEventBus;
}

// ============================================================================
// Lease Manager
// ============================================================================

export class LeaseManager {
  private activeLease: Lease | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private waiters = new Map<string, LeaseWaiter[]>();
  private leaseDurationMs: number;
  private secret: string;
  private eventBus?: IEventBus;

  constructor(config: LeaseManagerConfig = {}) {
    this.leaseDurationMs = config.leaseDurationMs ?? 5 * 60 * 1000;
    this.secret = config.secret ?? randomUUID();
    this.eventBus = config.eventBus;
  }

  /**
   * Create a pending lease request. Returns requestId.
   */
  createPendingRequest(scopes: string[], tabId?: number, agentName = 'unknown'): string {
    const requestId = randomUUID();
    this.pendingRequests.set(requestId, {
      requestId,
      agentName,
      scopes,
      tabId,
      createdAt: Date.now(),
    });

    this.eventBus?.emit('lease:requested', requestId, agentName, scopes, tabId);

    return requestId;
  }

  /**
   * Approve a pending request, creating an active lease.
   */
  approvePending(requestId: string): Lease | null {
    const pending = this.pendingRequests.get(requestId);
    if (!pending) return null;

    this.pendingRequests.delete(requestId);

    // Revoke any existing lease
    if (this.activeLease) {
      this.eventBus?.emit('lease:revoked', this.activeLease.token);
    }
    this.activeLease = null;

    const now = Date.now();
    const payload = {
      jti: randomUUID(),
      scopes: pending.scopes,
      tabId: pending.tabId,
      iat: now,
      exp: now + this.leaseDurationMs,
    };

    const token = this.signToken(payload);

    this.activeLease = {
      token,
      scopes: pending.scopes,
      tabId: pending.tabId,
      expiresAt: payload.exp,
      createdAt: now,
    };

    this.eventBus?.emit('lease:approved', requestId, {
      token: this.activeLease.token,
      scopes: this.activeLease.scopes,
      expiresAt: this.activeLease.expiresAt,
    });

    // Resolve waiters
    this.resolveWaiters(requestId, { approved: true, lease: this.activeLease });

    return this.activeLease;
  }

  /**
   * Deny a pending request.
   */
  denyPending(requestId: string, reason?: string): void {
    this.pendingRequests.delete(requestId);

    this.eventBus?.emit('lease:denied', requestId, reason);

    // Resolve waiters
    this.resolveWaiters(requestId, { approved: false, reason });
  }

  /**
   * Wait for a lease decision (approval or denial).
   * Returns the result or null on timeout.
   */
  waitForDecision(requestId: string, timeoutMs = 30000): Promise<LeaseWaitResult> {
    // Check if request still exists
    if (!this.pendingRequests.has(requestId)) {
      // Already resolved - check if there's an active lease
      const lease = this.getActiveLease();
      if (lease) {
        return Promise.resolve({ approved: true, lease });
      }
      return Promise.resolve({ approved: false, reason: 'Request not found or already resolved' });
    }

    return new Promise((resolve) => {
      const waiter: LeaseWaiter = {
        resolve,
        timeout: setTimeout(() => {
          this.removeWaiter(requestId, waiter);
          resolve({ approved: false, reason: 'Timed out waiting for lease decision' });
        }, timeoutMs),
      };

      if (!this.waiters.has(requestId)) {
        this.waiters.set(requestId, []);
      }
      this.waiters.get(requestId)!.push(waiter);
    });
  }

  /**
   * Get the active lease if valid (not expired).
   */
  getActiveLease(): Lease | null {
    if (!this.activeLease) return null;
    if (this.activeLease.expiresAt < Date.now()) {
      const expiredToken = this.activeLease.token;
      this.activeLease = null;
      this.eventBus?.emit('lease:expired', expiredToken);
      return null;
    }
    return this.activeLease;
  }

  /**
   * Get a pending request by ID.
   */
  getPendingRequest(requestId: string): PendingRequest | undefined {
    return this.pendingRequests.get(requestId);
  }

  /**
   * Check if a method is allowed under the current lease scopes.
   *
   * Scope types:
   * - "*"                         — wildcard, allows everything
   * - "Network"                   — CDP domain scope, allows "Network.*"
   * - "Network.getCookies"        — exact CDP method match
   * - "cookies:read"              — read cookies for any domain
   * - "cookies:read:*.example.com"— read cookies only for matching domains
   * - "browser:navigate"          — allow Page.navigate
   * - "browser:interact"          — allow Input.* and Runtime.evaluate
   * - "storage:read"              — allow DOMStorage.* reads
   */
  isAllowed(method: string, params?: Record<string, unknown>): boolean {
    const lease = this.getActiveLease();
    if (!lease) return false;

    // Wildcard scope
    if (lease.scopes.includes('*')) return true;

    // CDP domain-level scope matching: "Page" allows "Page.navigate", "Page.reload", etc.
    const domain = method.split('.')[0];
    if (lease.scopes.includes(method) || lease.scopes.includes(domain)) {
      return true;
    }

    // Granular scope matching
    for (const scope of lease.scopes) {
      if (this.matchesGranularScope(scope, method, params)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Match a granular scope against a CDP method and optional params.
   */
  private matchesGranularScope(
    scope: string,
    method: string,
    params?: Record<string, unknown>,
  ): boolean {
    // cookies:read — allows Network.getCookies, Network.getAllCookies
    // cookies:read:*.example.com — same but only for matching URL domains
    if (scope === 'cookies:read') {
      return method === 'Network.getCookies' || method === 'Network.getAllCookies';
    }

    if (scope.startsWith('cookies:read:')) {
      if (method !== 'Network.getCookies' && method !== 'Network.getAllCookies') {
        return false;
      }
      const domainPattern = scope.slice('cookies:read:'.length);
      return this.matchesDomainFilter(domainPattern, params);
    }

    // browser:navigate — allows Page.navigate
    if (scope === 'browser:navigate') {
      return method === 'Page.navigate';
    }

    // browser:interact — allows Input.dispatchMouseEvent, Input.dispatchKeyEvent,
    //   Input.insertText, Input.dispatchTouchEvent, Runtime.evaluate (for click/type/fill)
    if (scope === 'browser:interact') {
      if (domain(method) === 'Input') return true;
      if (method === 'Runtime.evaluate') return true;
      return false;
    }

    // storage:read — allows DOMStorage.getDOMStorageItems, DOMStorage.enable
    if (scope === 'storage:read') {
      return domain(method) === 'DOMStorage';
    }

    return false;
  }

  /**
   * Check if a domain pattern (e.g., "*.chatgpt.com") matches the URLs
   * in a CDP command's params. Patterns support leading wildcard "*."
   * to match any subdomain.
   */
  private matchesDomainFilter(
    pattern: string,
    params?: Record<string, unknown>,
  ): boolean {
    if (!params) return false;

    // Extract URLs from params (Network.getCookies uses "urls" array)
    const urls: string[] = [];
    if (Array.isArray(params.urls)) {
      urls.push(...(params.urls as string[]));
    }
    if (typeof params.url === 'string') {
      urls.push(params.url);
    }

    // If no URLs specified, the command reads all cookies — deny scoped access
    if (urls.length === 0) return false;

    return urls.every((urlStr) => {
      try {
        const hostname = new URL(urlStr).hostname;
        return matchHostname(pattern, hostname);
      } catch {
        return false;
      }
    });
  }

  /**
   * Revoke the active lease.
   */
  revokeActive(): void {
    if (this.activeLease) {
      this.eventBus?.emit('lease:revoked', this.activeLease.token);
    }
    this.activeLease = null;
  }

  /**
   * Resolve all waiters for a request ID.
   */
  private resolveWaiters(requestId: string, result: LeaseWaitResult): void {
    const waiters = this.waiters.get(requestId);
    if (waiters) {
      for (const waiter of waiters) {
        clearTimeout(waiter.timeout);
        waiter.resolve(result);
      }
      this.waiters.delete(requestId);
    }
  }

  /**
   * Remove a specific waiter.
   */
  private removeWaiter(requestId: string, waiter: LeaseWaiter): void {
    const waiters = this.waiters.get(requestId);
    if (waiters) {
      const index = waiters.indexOf(waiter);
      if (index !== -1) {
        waiters.splice(index, 1);
      }
      if (waiters.length === 0) {
        this.waiters.delete(requestId);
      }
    }
  }

  /**
   * Simple HMAC-based token signing (not full JWT for minimal deps).
   */
  private signToken(payload: Record<string, unknown>): string {
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = createHmac('sha256', this.secret).update(data).digest('base64url');
    return `${data}.${sig}`;
  }

  /**
   * Validate a token signature and expiry.
   */
  validateToken(token: string): boolean {
    const [data, sig] = token.split('.');
    if (!data || !sig) return false;

    const expectedSig = createHmac('sha256', this.secret).update(data).digest('base64url');
    if (sig !== expectedSig) return false;

    try {
      const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
}

// ============================================================================
// Helpers
// ============================================================================

/** Extract CDP domain from a dotted method string (e.g., "Network" from "Network.getCookies"). */
function domain(method: string): string {
  return method.split('.')[0];
}

/**
 * Match a hostname against a pattern. Supports:
 * - Exact match: "chatgpt.com" matches "chatgpt.com"
 * - Wildcard subdomain: "*.chatgpt.com" matches "auth.chatgpt.com", "www.chatgpt.com"
 */
function matchHostname(pattern: string, hostname: string): boolean {
  if (pattern === hostname) return true;

  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1); // ".chatgpt.com"
    return hostname.endsWith(suffix) && hostname.length > suffix.length;
  }

  return false;
}
