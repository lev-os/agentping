/**
 * History View Component
 * 
 * Shows past pings with filters and search.
 * Follows Vercel accessibility guidelines.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Ping } from '@agentping/core';
import { PingCard } from './PingCard';
import './Layout.css';
import './HistoryView.css';

interface HistoryViewProps {
    onSelectPing?: (ping: Ping) => void;
}

const API_BASE = '/api/v1';

export function HistoryView({ onSelectPing }: HistoryViewProps) {
    const [pings, setPings] = useState<Ping[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'responded' | 'expired' | 'dismissed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const statusParam = filter !== 'all' ? `?status=${filter}` : '';
            const res = await fetch(`${API_BASE}/pings${statusParam}`);
            const data = await res.json() as { pings: Ping[] };
            setPings(data.pings || []);
        } catch (e) {
            console.error('Failed to fetch history:', e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Client-side search filter
    const filteredPings = pings.filter(ping => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const payload = ping.payload as { title?: string; question?: string; message?: string };
        const title = payload.title || payload.question || payload.message || '';
        return (
            ping.agentName.toLowerCase().includes(query) ||
            title.toLowerCase().includes(query) ||
            ping.type.toLowerCase().includes(query)
        );
    });

    return (
        <div className="history-view app-layout">
            {/* Sidebar Filters */}
            <aside className="app-sidebar">
                <div className="app-sidebar-header">
                    <h2>History Filters</h2>
                </div>
                <div className="app-sidebar-nav">
                    {(['all', 'responded', 'expired', 'dismissed'] as const).map(status => (
                        <button
                            key={status}
                            className={`app-nav-item ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'All Activity' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="app-content">
                <header className="app-page-header">
                    <h1 className="app-page-title">History</h1>
                    <div className="history-search-container">
                        <input
                            type="search"
                            className="app-search-input"
                            placeholder="Search pings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search pings by title, agent, or type"
                        />
                    </div>
                </header>

                <div className="app-canvas">
                    <div className="history-list" role="list" aria-label="Ping history">
                        {loading ? (
                            <div className="history-loading" aria-busy="true">Loading...</div>
                        ) : filteredPings.length === 0 ? (
                            <div className="history-empty">
                                <p>No pings found</p>
                            </div>
                        ) : (
                            filteredPings.map(ping => (
                                <div key={ping.id} role="listitem">
                                    <PingCard
                                        ping={ping}
                                        isSelected={false}
                                        onClick={() => onSelectPing?.(ping)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
