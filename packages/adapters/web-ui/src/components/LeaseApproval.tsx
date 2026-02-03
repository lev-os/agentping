/**
 * LeaseApproval - Component for lease_request pings
 *
 * Shows agent ID, scope, TTL, reason with Approve/Deny actions
 * and a countdown timer for active leases.
 */

import React, { useEffect, useState, useMemo } from 'react';
import './LeaseApproval.css';

export type LeaseStatus = 'pending' | 'active' | 'expired' | 'denied';

interface LeaseApprovalProps {
    agentId: string;
    agentName: string;
    scope: string;
    ttl: string; // e.g. "15m", "1h", "30s"
    reason: string;
    constraints?: Record<string, unknown>;
    status?: LeaseStatus;
    grantedAt?: Date;
    expiresAt?: Date;
    onApprove: () => void;
    onDeny: () => void;
}

function parseTTL(ttl: string): number {
    const match = ttl.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 0;
    const [, value, unit] = match;
    const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return parseInt(value, 10) * (multipliers[unit] || 0);
}

function formatTimeRemaining(ms: number): string {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getScopeIcon(scope: string): string {
    const icons: Record<string, string> = {
        browser: '🌐',
        filesystem: '📁',
        network: '🔌',
        shell: '💻',
        custom: '⚙️',
    };
    return icons[scope] || '🔒';
}

export function LeaseApproval({
    agentId,
    agentName,
    scope,
    ttl,
    reason,
    constraints,
    status = 'pending',
    grantedAt,
    expiresAt,
    onApprove,
    onDeny,
}: LeaseApprovalProps) {
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    const ttlMs = useMemo(() => parseTTL(ttl), [ttl]);

    // Countdown timer for active leases
    useEffect(() => {
        if (status !== 'active' || !expiresAt) {
            setTimeRemaining(null);
            return;
        }

        const updateRemaining = () => {
            const remaining = expiresAt.getTime() - Date.now();
            setTimeRemaining(remaining > 0 ? remaining : 0);
        };

        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);
        return () => clearInterval(interval);
    }, [status, expiresAt]);

    const isExpired = status === 'active' && timeRemaining !== null && timeRemaining <= 0;
    const displayStatus = isExpired ? 'expired' : status;

    return (
        <div className={`lease-approval lease-approval--${displayStatus}`}>
            {/* Header */}
            <div className="lease-approval__header">
                <div className="lease-approval__scope-icon">{getScopeIcon(scope)}</div>
                <div className="lease-approval__title">
                    <span className="lease-approval__scope-label">{scope.toUpperCase()}</span>
                    <span className="lease-approval__label">Lease Request</span>
                </div>
                <div className={`lease-approval__status lease-approval__status--${displayStatus}`}>
                    {displayStatus}
                </div>
            </div>

            {/* Agent Info */}
            <div className="lease-approval__agent">
                <span className="lease-approval__agent-label">Agent:</span>
                <span className="lease-approval__agent-name">{agentName}</span>
                <span className="lease-approval__agent-id">({agentId})</span>
            </div>

            {/* Details Grid */}
            <div className="lease-approval__details">
                <div className="lease-approval__detail">
                    <span className="lease-approval__detail-label">Scope</span>
                    <span className="lease-approval__detail-value">{scope}</span>
                </div>
                <div className="lease-approval__detail">
                    <span className="lease-approval__detail-label">Duration</span>
                    <span className="lease-approval__detail-value">{ttl}</span>
                </div>
                {status === 'active' && timeRemaining !== null && (
                    <div className="lease-approval__detail lease-approval__detail--countdown">
                        <span className="lease-approval__detail-label">Remaining</span>
                        <span className={`lease-approval__countdown ${timeRemaining < 60000 ? 'lease-approval__countdown--warning' : ''}`}>
                            {formatTimeRemaining(timeRemaining)}
                        </span>
                    </div>
                )}
            </div>

            {/* Reason */}
            <div className="lease-approval__reason">
                <span className="lease-approval__reason-label">Reason:</span>
                <p className="lease-approval__reason-text">{reason}</p>
            </div>

            {/* Constraints */}
            {constraints && Object.keys(constraints).length > 0 && (
                <div className="lease-approval__constraints">
                    <span className="lease-approval__constraints-label">Constraints:</span>
                    <pre className="lease-approval__constraints-json">
                        {JSON.stringify(constraints, null, 2)}
                    </pre>
                </div>
            )}

            {/* Actions */}
            {status === 'pending' && (
                <div className="lease-approval__actions">
                    <button className="lease-approval__btn lease-approval__btn--approve" onClick={onApprove}>
                        <span className="lease-approval__btn-icon">✓</span>
                        Grant Lease
                        <span className="lease-approval__kbd">Y</span>
                    </button>
                    <button className="lease-approval__btn lease-approval__btn--deny" onClick={onDeny}>
                        <span className="lease-approval__btn-icon">✗</span>
                        Deny
                        <span className="lease-approval__kbd">N</span>
                    </button>
                </div>
            )}

            {/* Active lease progress bar */}
            {status === 'active' && timeRemaining !== null && ttlMs > 0 && (
                <div className="lease-approval__progress-container">
                    <div
                        className="lease-approval__progress-bar"
                        style={{ width: `${Math.max(0, (timeRemaining / ttlMs) * 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
}
