import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface QuestionRendererProps {
    ping: any;
    onSubmit: (value: string) => void;
    isSubmitting: boolean;
}

export function QuestionRenderer({ ping, onSubmit, isSubmitting }: QuestionRendererProps) {
    const [value, setValue] = useState('');
    const { question, context } = ping.payload;

    return (
        <Box flexDirection="column" gap={1}>
            <Box borderStyle="round" borderColor="cyan" padding={1} flexDirection="column">
                <Text bold color="cyan">❓ {question}</Text>
                {context && <Text color="gray">{context}</Text>}
            </Box>

            <Box>
                <Text>Answer: </Text>
                {isSubmitting ? (
                    <Text color="gray">{value} (Sending...)</Text>
                ) : (
                    <TextInput
                        value={value}
                        onChange={setValue}
                        onSubmit={onSubmit}
                        placeholder="Type your answer and hit Enter..."
                    />
                )}
            </Box>
        </Box>
    );
}
