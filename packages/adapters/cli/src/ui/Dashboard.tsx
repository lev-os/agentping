import React, { useState, useMemo } from 'react';
import { Box, Text, useInput, Newline } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { usePings, respondToPing } from './hooks.js';
import { PingRenderer } from './renderers/PingRenderer.js';

export function Dashboard() {
    const { pings, loading, error, refresh } = usePings();
    const [activeTab, setActiveTab] = useState<'queue' | 'details'>('queue');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<string>('');

    const selectedPing = pings[selectedIndex] || null;

    // Handle global keys (Tab to switch panes)
    useInput((input, key) => {
        // Only allow tab switching if not submitting
        if (key.tab && !actionLoading) {
            setActiveTab(prev => prev === 'queue' ? 'details' : 'queue');
        }

        // Quick Approve/Deny shortcuts (only if generic approval type)
        if (activeTab === 'details' && selectedPing && !actionLoading) {
            // Only allow shortcuts for simple approval types
            const type = selectedPing.type || (selectedPing.payload as any).type;
            if (type === 'approval' || !['question', 'step_approval'].includes(type)) {
                if (input === 'a' || input === 'y') {
                    handleQuickResponse(selectedPing, true);
                }
                if (input === 'd' || input === 'n') {
                    handleQuickResponse(selectedPing, false);
                }
            }
        }
    });

    const handleQuickResponse = async (ping: any, approved: boolean) => {
        handleResponse(ping.id, {
            action: approved ? 'approved' : 'denied',
            data: {},
        });
    };

    const handleResponse = async (pingId: string, responsePayload: any) => {
        setActionLoading(true);
        setActionMessage('Sending response...');
        try {
            await respondToPing(pingId, {
                ...responsePayload,
                respondedAt: new Date().toISOString(),
                respondedVia: 'cli-tui'
            });
            await refresh();

            // Success feedback
            setActionMessage('Sent!');
            setTimeout(() => {
                setActionLoading(false);
                setActionMessage('');
                setActiveTab('queue'); // Return focus to queue
            }, 800);
        } catch (e) {
            setActionMessage(`Error: ${(e as Error).message}`);
            setTimeout(() => setActionLoading(false), 2000);
        }
    };

    const items = useMemo(() => {
        return pings.map((p, i) => ({
            label: `${p.agentName}: ${(p.payload as any).title || (p.payload as any).question || p.type}`,
            value: i
        }));
    }, [pings]);

    if (loading && pings.length === 0) {
        return <Text><Text color="green"><Spinner type="dots" /></Text> Connecting to AgentPing Daemon...</Text>;
    }

    if (error) {
        return (
            <Box flexDirection="column">
                <Text color="red">Connection Error: {error}</Text>
                <Text color="gray">Is the daemon running? (agentping daemon start)</Text>
            </Box>
        );
    }

    if (pings.length === 0) {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="gray">
                <Text>📭 No pending pings.</Text>
                <Text color="gray">Waiting for agents...</Text>
            </Box>
        );
    }

    // Ensure selection index is valid
    if (selectedIndex >= pings.length && pings.length > 0) {
        setSelectedIndex(0);
    }

    return (
        <Box flexDirection="column" height={20}>
            {/* Header */}
            <Box borderStyle="single" borderBottom={false} paddingX={1} borderColor="cyan">
                <Text bold color="cyan">⚡ AgentPing Console</Text>
                <Box flexGrow={1} />
                <Text color="gray">{pings.length} pending</Text>
            </Box>

            {/* Main Content */}
            <Box flexDirection="row" flexGrow={1}>

                {/* Left Pane: Queue */}
                <Box
                    width="30%"
                    flexDirection="column"
                    borderStyle="single"
                    borderColor={activeTab === 'queue' ? 'green' : 'gray'}
                >
                    <Box paddingX={1} borderStyle="single" borderBottom borderTop={false} borderLeft={false} borderRight={false}>
                        <Text bold>Queue</Text>
                    </Box>
                    <SelectInput
                        items={items}
                        onSelect={(item) => {
                            setSelectedIndex(item.value);
                            setActiveTab('details');
                        }}
                        onHighlight={(item) => setSelectedIndex(item.value)}
                        isFocused={activeTab === 'queue' && !actionLoading}
                    />
                </Box>

                {/* Right Pane: Details */}
                <Box
                    width="70%"
                    flexDirection="column"
                    borderStyle="single"
                    borderLeft={false}
                    borderColor={activeTab === 'details' ? 'green' : 'gray'}
                    padding={1}
                >
                    {selectedPing ? (
                        <Box flexDirection="column" gap={1}>
                            <Box>
                                <Text bold underline>{(selectedPing.payload as any).title || selectedPing.type}</Text>
                                <Text color="gray"> | From: {selectedPing.agentName}</Text>
                            </Box>

                            {/* Rich Interaction Renderer */}
                            <PingRenderer
                                ping={selectedPing}
                                isSubmitting={actionLoading}
                                onResponse={(response) => handleResponse(selectedPing.id, response)}
                            />

                        </Box>
                    ) : (
                        <Text color="gray">Select a ping...</Text>
                    )}
                </Box>
            </Box>

            {/* Footer / Status Bar */}
            <Box borderStyle="single" borderTop={false} paddingX={1} borderColor="gray">
                {actionLoading ? (
                    <Text color="yellow"><Spinner type="dots" /> {actionMessage}</Text>
                ) : (
                    <Text color="gray">
                        {activeTab === 'queue' ? '↑/↓ Navigate • Enter Select' : 'Interactive Mode • Tab to Queue'}
                        {' • Ctrl+C Quit'}
                    </Text>
                )}
            </Box>
        </Box>
    );
}
