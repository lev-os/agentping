import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface Step {
    id: string;
    description: string;
    risk: 'low' | 'medium' | 'high';
}

interface StepApprovalRendererProps {
    ping: any;
    onSubmit: (approvedSteps: string[], deniedSteps: string[]) => void;
    isSubmitting: boolean;
}

export function StepApprovalRenderer({ ping, onSubmit, isSubmitting }: StepApprovalRendererProps) {
    const { title, steps } = ping.payload;
    const [cursor, setCursor] = useState(0);
    // Track status of each step: 'pending' (default), 'approved', 'denied'
    const [stepStates, setStepStates] = useState<Record<string, 'approved' | 'denied' | 'pending'>>({});

    const currentSteps: Step[] = steps || [];

    useInput((input, key) => {
        if (isSubmitting) return;

        if (key.upArrow) {
            setCursor(prev => Math.max(0, prev - 1));
        }
        if (key.downArrow) {
            setCursor(prev => Math.min(currentSteps.length, prev + 1)); // +1 for Submit button
        }

        const currentStep = currentSteps[cursor];

        // Toggle Approve/Deny for steps
        if (currentStep) {
            if (input === 'a' || key.rightArrow) {
                setStepStates(prev => ({ ...prev, [currentStep.id]: 'approved' }));
            }
            if (input === 'd' || key.leftArrow) {
                setStepStates(prev => ({ ...prev, [currentStep.id]: 'denied' }));
            }
            if (input === ' ') {
                // Cycle pending -> approved -> denied -> pending
                setStepStates(prev => {
                    const current = prev[currentStep.id] || 'pending';
                    const next = current === 'pending' ? 'approved' : current === 'approved' ? 'denied' : 'pending';
                    return { ...prev, [currentStep.id]: next };
                });
            }
        }

        // Submit button interaction
        if (cursor === currentSteps.length && (key.return || input === ' ')) {
            const approved = currentSteps.filter(s => stepStates[s.id] === 'approved').map(s => s.id);
            const denied = currentSteps.filter(s => stepStates[s.id] === 'denied').map(s => s.id);
            onSubmit(approved, denied);
        }
    });

    return (
        <Box flexDirection="column" gap={1}>
            <Box borderStyle="round" borderColor="yellow" padding={1} flexDirection="column">
                <Text bold color="yellow">🛡️ {title}</Text>
                <Text color="gray">Review steps below. Use [A]pprove, [D]eny, or Space to cycle.</Text>
            </Box>

            <Box flexDirection="column" gap={0}>
                {currentSteps.map((step, idx) => {
                    const isFocused = cursor === idx;
                    const status = stepStates[step.id] || 'pending';

                    let statusIcon = '○';
                    let statusColor = 'gray';
                    if (status === 'approved') { statusIcon = '✓'; statusColor = 'green'; }
                    if (status === 'denied') { statusIcon = '✗'; statusColor = 'red'; }

                    return (
                        <Box key={step.id}>
                            <Text color={isFocused ? 'blue' : 'gray'}>{isFocused ? '>' : ' '} </Text>
                            <Text color={statusColor}>{statusIcon} </Text>
                            <Text bold={isFocused}>{step.description} </Text>
                            <Text color="dim">[{step.risk}]</Text>
                        </Box>
                    );
                })}

                <Box marginTop={1}>
                    <Text color={cursor === currentSteps.length ? 'blue' : 'gray'}>
                        {cursor === currentSteps.length ? '> [ Submit Decision ]' : '  [ Submit Decision ]'}
                    </Text>
                </Box>
            </Box>

            {isSubmitting && <Text color="green">Submitting...</Text>}
        </Box>
    );
}
