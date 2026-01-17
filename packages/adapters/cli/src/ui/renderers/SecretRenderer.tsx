import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface SecretRendererProps {
    ping: any;
    onSubmit: (value: string) => void;
    isSubmitting: boolean;
}

export function SecretRenderer({ ping, onSubmit, isSubmitting }: SecretRendererProps) {
    const { title, question } = ping.payload;
    const [value, setValue] = useState('');

    return (
        <Box flexDirection="column" gap={1}>
            <Box borderStyle="round" borderColor="red" padding={1} flexDirection="column">
                <Text bold color="red">🔒 {title || 'Authentication Required'}</Text>
                <Text color="gray">{question}</Text>
            </Box>

            <Box>
                <Text color="green">❯ </Text>
                {isSubmitting ? (
                    <Text color="gray">********</Text>
                ) : (
                    <TextInput
                        value={value}
                        onChange={setValue}
                        onSubmit={onSubmit}
                        mask="*"
                        placeholder="Enter secret value..."
                    />
                )}
            </Box>

            <Box marginTop={1}>
                <Text dimColor>Input is masked. Press Enter to submit.</Text>
            </Box>
        </Box>
    );
}
