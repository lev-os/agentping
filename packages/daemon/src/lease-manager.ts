/**
 * Lease Manager
 *
 * JWT-based lease generation, validation, and scope enforcement
 * for browser CDP access control.
 */

import { randomUUID, createHmac } from 'crypto';

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
  scopes: string[];
  tabId?: number;
  createdAt: number;
}

export interface LeaseManagerConfig {
  /** Lease duration in ms (default: 5 minutes) */
  leaseDurationMs?: number;
  /** Secret for signing tokens */
  secret?: string;
}

// ============================================================================
// Lease Manager
// ============================================================================

export class LeaseManager {
  private activeLease: Lease | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private leaseDurationMs: number;
  private secret: string;

  constructor(config: LeaseManagerConfig = {}) {
    this.leaseDurationMs = config.leaseDurationMs ?? 5 * 60 * 1000;
    this.secret = config.secret ?? randomUUID();
  }

  /**
   * Create a pending lease request. Returns requestId.
   */
  createPendingRequest(scopes: string[], tabId?: number): string {
    const requestId = randomUUID();
    this.pendingRequests.set(requestId, {
      requestId,
      scopes,
      tabId,
      createdAt: Date.now(),
    });
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

    return this.activeLease;
  }

  /**
   * Deny a pending request.
   */
  denyPending(requestId: string): void {
    this.pendingRequests.delete(requestId);
  }

  /**
   * Get the active lease if valid (not expired).
   */
  getActiveLease(): Lease | null {
    if (!this.activeLease) return null;
    if (this.activeLease.expiresAt < Date.now()) {
      this.activeLease = null;
      return null;
    }
    return this.activeLease;
  }

  /**
   * Check if a method is allowed under the current lease scopes.
   */
  isAllowed(method: string): boolean {
    const lease = this.getActiveLease();
    if (!lease) return false;

    // Wildcard scope
    if (lease.scopes.includes('*')) return true;

    // Domain-level scope matching: "Page" allows "Page.navigate", "Page.reload", etc.
    const domain = method.split('.')[0];
    return lease.scopes.includes(method) || lease.scopes.includes(domain);
  }

  /**
   * Revoke the active lease.
   */
  revokeActive(): void {
    this.activeLease = null;
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
