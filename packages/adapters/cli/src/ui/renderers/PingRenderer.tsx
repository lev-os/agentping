import React from 'react';
import { Box, Text } from 'ink';
import { QuestionRenderer } from './QuestionRenderer.js';
import { SelectionRenderer } from './SelectionRenderer.js';
import { StepApprovalRenderer } from './StepApprovalRenderer.js';

import { TaskWorkflowRenderer } from './TaskWorkflowRenderer.js';
import { SecretRenderer } from './SecretRenderer.js';

interface PingRendererProps {
    ping: any;
    onResponse: (response: any) => void;
    isSubmitting: boolean;
}

export function PingRenderer({ ping, onResponse, isSubmitting }: PingRendererProps) {
    const type = ping.payload?.type;

    if (type === 'question') {
        if (ping.payload.options && ping.payload.options.length > 0) {
            return (
                <SelectionRenderer
                    ping={ping}
                    isSubmitting={isSubmitting}
                    onSubmit={(value) => onResponse({
                        data: { value },
                        selectedOptions: [value]
                    })}
                />
            );
        }
        return (
            <QuestionRenderer
                ping={ping}
                isSubmitting={isSubmitting}
                onSubmit={(value) => onResponse({
                    data: { value },
                    answerValue: value
                })}
            />
        );
    }

    if (type === 'step_approval') {
        return (
            <StepApprovalRenderer
                ping={ping}
                isSubmitting={isSubmitting}
                onSubmit={(approved, denied) => onResponse({
                    data: { approvedSteps: approved, deniedSteps: denied },
                    action: 'step_decision'
                })}
            />
        );
    }

    if (type === 'task_workflow') {
        return (
            <TaskWorkflowRenderer
                ping={ping}
                isSubmitting={isSubmitting}
                onSubmit={(completed, notes) => onResponse({
                    data: { completedSteps: completed, notes },
                    action: 'workflow_complete'
                })}
            />
        );
    }

    if (type === 'selection') {
        return (
            <SelectionRenderer
                ping={ping}
                isSubmitting={isSubmitting}
                onSubmit={(value) => onResponse({
                    data: { value },
                    selectedOptions: [value]
                })}
            />
        );
    }

    if (type === 'approval') {
        return (
            <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
                <Text bold>{ping.payload.title || 'Approval Needed'}</Text>
                {ping.payload.details && <Text>{ping.payload.details}</Text>}
                {ping.payload.risk && <Text color={ping.payload.risk === 'high' ? 'red' : 'yellow'}>Risk: {ping.payload.risk}</Text>}
                <Box marginTop={1}>
                    <Text>Press <Text bold color="green">[A]pprove</Text> or <Text bold color="red">[D]eny</Text></Text>
                </Box>
                {isSubmitting && <Text color="blue">Submitting...</Text>}
            </Box>
        );
    }

    if (type === 'notification') {
        return (
            <Box flexDirection="column" borderStyle="single" borderColor="blue" padding={1}>
                <Text bold>ℹ️ Notification</Text>
                <Text>{ping.payload.message}</Text>
                <Box marginTop={1}>
                    <Text color="gray">Press Enter to dismiss</Text>
                </Box>
            </Box>
        );
    }

    if (type === 'research_request') {
        return (
            <SelectionRenderer
                ping={ping}
                isSubmitting={isSubmitting}
                onSubmit={(value) => onResponse({
                    data: { value },
                    selectedOptions: [value]
                })}
            />
        );
    }

    if (type === 'secret') {
        return (
            <SecretRenderer
                ping={ping}
                isSubmitting={isSubmitting}
                onSubmit={(value) => onResponse({
                    data: { value },
                    answerValue: value // Standardize on answerValue for consistency
                })}
            />
        );
    }

    // Default / Fallback for Approval or Unknown
    return (
        <Box flexDirection="column" borderStyle="round" borderColor="gray" padding={1}>
            <Text bold>Unknown Ping Type: {type}</Text>
            <Text>{JSON.stringify(ping.payload, null, 2)}</Text>
            <Box marginTop={1}>
                <Text color="gray">Use Global [A]pprove / [D]eny keys.</Text>
            </Box>
        </Box>
    );
}
