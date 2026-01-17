import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

interface SelectionRendererProps {
    ping: any;
    onSubmit: (value: string) => void;
    isSubmitting: boolean;
}

export function SelectionRenderer({ ping, onSubmit, isSubmitting }: SelectionRendererProps) {
    const { question, title, context, options } = ping.payload;

    const items = (options || []).map((opt: string) => ({
        label: opt,
        value: opt
    }));

    return (
        <Box flexDirection="column" gap={1}>
            <Box borderStyle="round" borderColor="magenta" padding={1} flexDirection="column">
                <Text bold color="magenta">🔡 {title || question || 'Select an option'}</Text>
                {context && <Text color="gray">{context}</Text>}
            </Box>

            {isSubmitting ? (
                <Text color="gray">Submitting...</Text>
            ) : (
                <SelectInput
                    items={items}
                    onSelect={(item) => onSubmit(String(item.value))}
                />
            )}
        </Box>
    );
}
