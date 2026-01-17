import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface Step {
    id: string;
    instruction: string;
    details?: string;
    estimatedMinutes?: number;
}

interface TaskWorkflowRendererProps {
    ping: any;
    onSubmit: (completedSteps: string[], notes: Record<string, string>) => void;
    isSubmitting: boolean;
}

export function TaskWorkflowRenderer({ ping, onSubmit, isSubmitting }: TaskWorkflowRendererProps) {
    const { title, description, steps } = ping.payload;
    const [cursor, setCursor] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    const currentSteps: Step[] = steps || [];

    useInput((input, key) => {
        if (isSubmitting) return;

        if (key.upArrow) {
            setCursor(prev => Math.max(0, prev - 1));
        }
        if (key.downArrow) {
            setCursor(prev => Math.min(currentSteps.length, prev + 1));
        }

        const currentStep = currentSteps[cursor];

        // Toggle Completion
        if (currentStep) {
            if (input === ' ' || key.return || key.rightArrow) {
                setCompletedSteps(prev => {
                    const next = new Set(prev);
                    if (next.has(currentStep.id)) {
                        next.delete(currentStep.id);
                    } else {
                        next.add(currentStep.id);
                    }
                    return next;
                });
            }
        }

        // Submit
        if (cursor === currentSteps.length && (key.return || input === ' ')) {
            onSubmit(Array.from(completedSteps), {});
        }
    });

    return (
        <Box flexDirection="column" gap={1}>
            <Box borderStyle="round" borderColor="blue" padding={1} flexDirection="column">
                <Text bold color="blue">🛠️ {title}</Text>
                {description && <Text color="gray">{description}</Text>}
                <Text color="gray">Press Space/Enter to mark steps as Done.</Text>
            </Box>

            <Box flexDirection="column" gap={0}>
                {currentSteps.map((step, idx) => {
                    const isFocused = cursor === idx;
                    const isDone = completedSteps.has(step.id);

                    return (
                        <Box key={step.id}>
                            <Text color={isFocused ? 'blue' : 'gray'}>{isFocused ? '>' : ' '} </Text>
                            <Text color={isDone ? 'green' : 'gray'}>{isDone ? '[x]' : '[ ]'} </Text>
                            <Text bold={isFocused} strikethrough={isDone}>{step.instruction} </Text>
                            {step.estimatedMinutes && <Text color="dim">({step.estimatedMinutes}m)</Text>}
                        </Box>
                    );
                })}

                <Box marginTop={1}>
                    <Text color={cursor === currentSteps.length ? 'blue' : 'gray'}>
                        {cursor === currentSteps.length ? '> [ Complete Task ]' : '  [ Complete Task ]'}
                    </Text>
                </Box>
            </Box>

            {isSubmitting && <Text color="green">Submitting...</Text>}
        </Box>
    );
}
