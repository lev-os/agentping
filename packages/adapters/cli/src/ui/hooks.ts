import { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.AGENTPING_URL || 'http://localhost:7890';

export interface Ping {
    id: string;
    agentId: string;
    agentName: string;
    type: string;
    payload: any;
    createdAt: string;
    status: 'pending' | 'responded' | 'expired' | 'dismissed';
}

export function usePings() {
    const [pings, setPings] = useState<Ping[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPings = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/v1/pings?status=pending`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json() as { pings: Ping[] };
            setPings(data.pings);
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchPings();
    }, [fetchPings]);

    // Poll every 2s
    useEffect(() => {
        const timer = setInterval(fetchPings, 2000);
        return () => clearInterval(timer);
    }, [fetchPings]);

    return { pings, loading, error, refresh: fetchPings };
}

export async function respondToPing(pingId: string, response: any) {
    const body = {
        action: response.action,
        data: response.data || {},
        selectedSteps: response.data?.approvedSteps, // Map specific UI fields to protocol
        selectedOptions: response.selectedOptions,
        answerValue: response.answerValue,
        // Pass through any other enrichment
        respondedAt: new Date().toISOString(),
        respondedVia: 'cli-tui',
        ...response
    };

    const res = await fetch(`${API_BASE}/api/v1/pings/${pingId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error || 'Failed to respond');
    }
    return res.json();
}
