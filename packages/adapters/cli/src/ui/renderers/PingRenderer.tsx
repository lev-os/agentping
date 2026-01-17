import React from 'react';
import { Box, Text } from 'ink';
import { QuestionRenderer } from './QuestionRenderer.js';
import { SelectionRenderer } from './SelectionRenderer.js';
import { StepApprovalRenderer } from './StepApprovalRenderer.js';

import { TaskWorkflowRenderer } from './TaskWorkflowRenderer.js';

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
