/**
 * React Hooks for AgentPing
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Ping, Directive } from '@agentping/core';
import { fetchPings, respondToPing, dismissPing } from './api';

// ============================================================================
// usePings - Fetch and manage pings
// ============================================================================

export function usePings() {
    const [pings, setPings] = useState<Ping[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            const data = await fetchPings();
            setPings(data);
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 5000);
        return () => clearInterval(interval);
    }, [refresh]);

    return { pings, loading, error, refresh };
}

// ============================================================================
// useWebSocket - Real-time updates
// ============================================================================

export function useWebSocket(onMessage: (data: any) => void) {
    const wsRef = useRef<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/api/v1/ws`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[WS] Connected');
            setConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (e) {
                console.error('[WS] Parse error:', e);
            }
        };

        ws.onclose = () => {
            console.log('[WS] Disconnected');
            setConnected(false);
        };

        ws.onerror = (error) => {
            console.error('[WS] Error:', error);
        };

        return () => {
            ws.close();
        };
    }, [onMessage]);

    return { connected };
}

// ============================================================================
// useKeyboard - Keyboard navigation
// ============================================================================

interface KeyboardHandlers {
    onPrevious?: () => void;
    onNext?: () => void;
    onSelect?: () => void;
    onApproveAll?: () => void;
    onDenyAll?: () => void;
    onDismiss?: () => void;
    onExpandToggle?: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case '.':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        handlers.onExpandToggle?.();
                    }
                    break;
                case 'j':
                case 'ArrowDown':
                    e.preventDefault();
                    handlers.onNext?.();
                    break;
                case 'k':
                case 'ArrowUp':
                    e.preventDefault();
                    handlers.onPrevious?.();
                    break;
                case 'Enter':
                    e.preventDefault();
                    handlers.onSelect?.();
                    break;
                case 'a':
                    if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        handlers.onApproveAll?.();
                    }
                    break;
                case 'd':
                    if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        handlers.onDenyAll?.();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    handlers.onDismiss?.();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
}

// ============================================================================
// usePingResponse - Manage response state for a ping
// ============================================================================

interface FileAttachment {
    id: string;
    file: File;
    previewUrl?: string;
}

interface PingResponseState {
    selectedSteps: Set<string>;
    selectedOptions: Set<string>;
    answerValue: string;
    directives: Directive[];
    notes: string;
    attachments: FileAttachment[];
}

export function usePingResponse(ping: Ping | null) {
    // Helper to get storage key
    const getStorageKey = (pingId: string) => `agentping_draft_${pingId}`;

    const [state, setState] = useState<PingResponseState>({
        selectedSteps: new Set(),
        selectedOptions: new Set(),
        answerValue: '',
        directives: [],
        notes: '',
        attachments: [],
    });

    // Load from storage or init default when ping changes
    useEffect(() => {
        if (!ping) return;

        const saved = localStorage.getItem(getStorageKey(ping.id));
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setState({
                    selectedSteps: new Set(parsed.selectedSteps),
                    selectedOptions: new Set(parsed.selectedOptions),
                    answerValue: parsed.answerValue || '',
                    directives: parsed.directives || [],
                    notes: parsed.notes || '',
                    attachments: [], // Cannot persist File objects easily in localStorage
                });
                return;
            } catch (e) {
                console.error('Failed to load draft:', e);
            }
        }

        // Default initialization if no draft
        if (ping.payload.type === 'step_approval') {
            const payload = ping.payload as any;
            setState({
                selectedSteps: new Set(payload.defaultApproved || []),
                selectedOptions: new Set(),
                answerValue: '',
                directives: [],
                notes: '',
                attachments: [],
            });
        } else {
            setState({
                selectedSteps: new Set(),
                selectedOptions: new Set(),
                answerValue: '',
                directives: [],
                notes: '',
                attachments: [],
            });
        }
    }, [ping?.id]);

    // Save to storage on change
    useEffect(() => {
        if (!ping) return;

        const toSave = {
            selectedSteps: Array.from(state.selectedSteps),
            selectedOptions: Array.from(state.selectedOptions),
            answerValue: state.answerValue,
            directives: state.directives,
            notes: state.notes,
        };
        localStorage.setItem(getStorageKey(ping.id), JSON.stringify(toSave));
    }, [state, ping?.id]);

    const toggleStep = useCallback((stepId: string) => {
        setState(prev => {
            const next = new Set(prev.selectedSteps);
            if (next.has(stepId)) {
                next.delete(stepId);
            } else {
                next.add(stepId);
            }
            return { ...prev, selectedSteps: next };
        });
    }, []);

    const toggleOption = useCallback((optionId: string) => {
        setState(prev => {
            const next = new Set(prev.selectedOptions);
            if (next.has(optionId)) {
                next.delete(optionId);
            } else {
                next.add(optionId);
            }
            return { ...prev, selectedOptions: next };
        });
    }, []);

    const setAnswer = useCallback((value: string) => {
        setState(prev => ({ ...prev, answerValue: value }));
    }, []);

    const addDirective = useCallback((directive: Directive) => {
        setState(prev => ({
            ...prev,
            directives: [...prev.directives, directive],
        }));
    }, []);

    const removeDirective = useCallback((index: number) => {
        setState(prev => ({
            ...prev,
            directives: prev.directives.filter((_, i) => i !== index),
        }));
    }, []);

    const setNotes = useCallback((notes: string) => {
        setState(prev => ({ ...prev, notes }));
    }, []);

    const addAttachment = useCallback((file: File) => {
        const attachment: FileAttachment = {
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        };
        setState(prev => ({
            ...prev,
            attachments: [...prev.attachments, attachment]
        }));
    }, []);

    const removeAttachment = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            attachments: prev.attachments.filter(a => a.id !== id)
        }));
    }, []);

    const selectAll = useCallback((ids: string[], type: 'steps' | 'options') => {
        setState(prev => ({
            ...prev,
            [type === 'steps' ? 'selectedSteps' : 'selectedOptions']: new Set(ids),
        }));
    }, []);

    const deselectAll = useCallback((type: 'steps' | 'options') => {
        setState(prev => ({
            ...prev,
            [type === 'steps' ? 'selectedSteps' : 'selectedOptions']: new Set(),
        }));
    }, []);

    return {
        ...state,
        toggleStep,
        toggleOption,
        setAnswer,
        addDirective,
        removeDirective,
        setNotes,
        addAttachment,
        removeAttachment,
        selectAll,
        deselectAll,
    };
}
