import type { Meta, StoryObj } from '@storybook/react';
import { ApprovalQueue } from './ApprovalQueue';
import { useState, useEffect } from 'react';
import type { ApprovalRequest } from '../global.d';

const meta = {
  title: 'Components/ApprovalQueue',
  component: ApprovalQueue,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background:
            'radial-gradient(1200px 600px at 70% 10%, rgba(0, 200, 255, 0.08), transparent), var(--bg-primary, #0c0f14)',
          position: 'relative',
          fontFamily: "var(--font-sans, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
        }}
      >
        {/* Mock window.claudeCode for Storybook */}
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApprovalQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock approval requests
const mockWriteApproval: ApprovalRequest = {
  toolCallId: 'write-1',
  name: 'Write',
  input: { file_path: '/src/components/Button.tsx', content: 'export const Button = ...' },
  filePath: '/src/components/Button.tsx',
  proposedContent: 'export const Button = () => {\n  return <button>Click me</button>;\n};',
  timestamp: new Date(),
};

const mockEditApproval: ApprovalRequest = {
  toolCallId: 'edit-1',
  name: 'Edit',
  input: { file_path: '/src/utils/helpers.ts', old_string: 'old code', new_string: 'new code' },
  filePath: '/src/utils/helpers.ts',
  originalContent: 'function helper() {\n  // old code\n  return false;\n}',
  proposedContent: 'function helper() {\n  // new code\n  return true;\n}',
  timestamp: new Date(),
};

const mockBashApproval: ApprovalRequest = {
  toolCallId: 'bash-1',
  name: 'Bash',
  input: { command: 'rm -rf /tmp/cache && mkdir -p /tmp/cache' },
  timestamp: new Date(),
};

const mockNewFileApproval: ApprovalRequest = {
  toolCallId: 'write-2',
  name: 'Write',
  input: { file_path: '/src/config/settings.json', content: '{"theme": "dark"}' },
  filePath: '/src/config/settings.json',
  proposedContent: '{\n  "theme": "dark",\n  "language": "en"\n}',
  timestamp: new Date(),
};

// Empty queue (no approvals)
export const Empty: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    // Mock empty queue
    window.claudeCode = {
      getApprovalQueue: async () => [],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
    } as any;
  },
};

// Single Write approval
export const SingleWrite: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockWriteApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};

// Single Edit approval with diff
export const SingleEdit: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockEditApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};

// Single Bash approval
export const SingleBash: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockBashApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};

// New file creation
export const NewFile: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockNewFileApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};

// Multiple approvals
export const MultipleApprovals: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [
        mockWriteApproval,
        mockEditApproval,
        mockBashApproval,
        mockNewFileApproval,
      ],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};

// Many approvals (scrolling)
export const ManyApprovals: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    const manyApprovals = Array.from({ length: 10 }, (_, i) => ({
      ...mockEditApproval,
      toolCallId: `edit-${i}`,
      filePath: `/src/components/Component${i}.tsx`,
    }));

    window.claudeCode = {
      getApprovalQueue: async () => manyApprovals,
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};

// Interactive example with live updates
export const Interactive: Story = {
  render: (args) => {
    const [queue, setQueue] = useState<ApprovalRequest[]>([mockWriteApproval, mockEditApproval]);

    useEffect(() => {
      window.claudeCode = {
        getApprovalQueue: async () => queue,
        onApprovalQueued: (callback: any) => {
          // Simulate new approval after 3 seconds
          const timer = setTimeout(() => {
            const newApproval = { ...mockBashApproval, toolCallId: `bash-${Date.now()}` };
            callback({ sessionId: args.sessionId, request: newApproval });
            setQueue(prev => [...prev, newApproval]);
          }, 3000);
          return () => clearTimeout(timer);
        },
        onApprovalResolved: () => () => {},
        resolveApproval: async (sessionId: string, toolId: string) => {
          setQueue(prev => prev.filter(r => r.toolCallId !== toolId));
          return { success: true };
        },
        resolveAllApprovals: async () => {
          setQueue([]);
          return { success: true };
        },
      } as any;
    }, [queue, args.sessionId]);

    return <ApprovalQueue {...args} />;
  },
  args: {
    sessionId: 'session-1',
  },
};

// Collapsed state
export const Collapsed: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockWriteApproval, mockEditApproval, mockBashApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};

// Large diff example
export const LargeDiff: Story = {
  args: {
    sessionId: 'session-1',
  },
  beforeEach: () => {
    const largeEdit: ApprovalRequest = {
      ...mockEditApproval,
      toolCallId: 'large-edit',
      originalContent: Array(50).fill('  // Line of old code').join('\n'),
      proposedContent: Array(50).fill('  // Line of new code').join('\n'),
    };

    window.claudeCode = {
      getApprovalQueue: async () => [largeEdit],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({ success: true }),
      resolveAllApprovals: async () => ({ success: true }),
    } as any;
  },
};
