import type { Meta, StoryObj } from '@storybook/react';
import { VoiceConsole } from './VoiceConsole';
import { useState } from 'react';

const meta = {
  title: 'Components/VoiceConsole',
  component: VoiceConsole,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VoiceConsole>;

export default meta;
type Story = StoryObj<typeof meta>;

// Closed (trigger button only)
export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

// Open (console panel visible)
export const Open: Story = {
  args: {
    isOpen: true,
    presetCommands: [
      'Show agent status',
      'List active tasks',
      'Clear file locks',
      'Sync workspace',
      'Open diagnostics',
      'Show recent logs',
    ],
  },
};

// Listening state
export const Listening: Story = {
  args: {
    isOpen: true,
    isListening: true,
  },
};

// With transcript
export const WithTranscript: Story = {
  args: {
    isOpen: true,
    transcript: 'Show me the status of all active agents',
  },
};

// With response
export const WithResponse: Story = {
  args: {
    isOpen: true,
    transcript: 'Show me the status of all active agents',
    response: 'Found 3 active agents: Alpha (working), Beta (idle), Gamma (error state)',
  },
};

// Listening with live transcript
export const LiveListening: Story = {
  args: {
    isOpen: true,
    isListening: true,
    transcript: 'Show me the',
  },
};

// Custom preset commands
export const CustomPresets: Story = {
  args: {
    isOpen: true,
    presetCommands: [
      'Deploy to production',
      'Run all tests',
      'Generate report',
      'Backup database',
      'Scale to 10 instances',
    ],
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');

    const handleCommand = (command: string) => {
      setTranscript(command);
      setIsListening(false);

      // Simulate processing
      setTimeout(() => {
        setResponse(`Processing command: "${command}"`);

        // Clear after 5 seconds
        setTimeout(() => {
          setTranscript('');
          setResponse('');
        }, 5000);
      }, 500);
    };

    return (
      <VoiceConsole
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onCommand={handleCommand}
        isListening={isListening}
        transcript={transcript}
        response={response}
      />
    );
  },
};

// With keyboard controls hint
export const WithKeyboardHint: Story = {
  args: {
    isOpen: true,
    presetCommands: ['Show help', 'List commands'],
  },
};

// Error state simulation
export const ErrorState: Story = {
  args: {
    isOpen: true,
    transcript: 'Invalid command xyz',
    response: 'Error: Command not recognized. Type "help" for available commands.',
  },
};

// Success state simulation
export const SuccessState: Story = {
  args: {
    isOpen: true,
    transcript: 'Clear all file locks',
    response: 'Success: Cleared 5 file locks across 3 agents.',
  },
};

// Empty presets
export const NoPresets: Story = {
  args: {
    isOpen: true,
    presetCommands: [],
  },
};
