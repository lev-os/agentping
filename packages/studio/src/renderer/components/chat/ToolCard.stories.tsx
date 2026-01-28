import type { Meta, StoryObj } from '@storybook/react';
import { ToolCard, ToolInfo } from './ToolCard';
import { useState } from 'react';

const meta = {
  title: 'Chat/ToolCard',
  component: ToolCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Read Tool - Standard risk
export const ReadFile: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Read',
      input: {
        path: '/src/components/Button.tsx',
      },
    } as ToolInfo,
  },
};

// Write Tool - High risk
export const WriteFile: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Write',
      input: {
        file_path: '/src/components/NewComponent.tsx',
        content: 'export function NewComponent() { return <div>Hello</div>; }',
      },
    } as ToolInfo,
  },
};

// Edit Tool - High risk
export const EditFile: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Edit',
      input: {
        file_path: '/src/App.tsx',
      },
    } as ToolInfo,
  },
};

// Bash Command - High risk
export const BashCommand: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Bash',
      input: {
        command: 'npm install react-query',
      },
    } as ToolInfo,
  },
};

// Glob Search
export const GlobSearch: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Glob',
      input: {
        pattern: '**/*.test.ts',
      },
    } as ToolInfo,
  },
};

// Grep Search
export const GrepSearch: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Grep',
      input: {
        pattern: 'useState',
        path: '/src',
      },
    } as ToolInfo,
  },
};

// Pending Approval
export const PendingApproval: Story = {
  render: () => {
    const [tool, setTool] = useState<ToolInfo>({
      type: 'tool_use',
      name: 'Bash',
      id: 'tool-123',
      status: 'pending_approval',
      input: {
        command: 'rm -rf dist && npm run build',
      },
    });

    const handleResolve = (toolId: string, approved: boolean) => {
      setTool({
        ...tool,
        status: approved ? 'approved' : 'denied',
      });
    };

    return <ToolCard tool={tool} onResolve={handleResolve} />;
  },
};

// Pending with Diff Preview
export const PendingWithDiff: Story = {
  render: () => {
    const [tool, setTool] = useState<ToolInfo>({
      type: 'tool_use',
      name: 'Edit',
      id: 'tool-456',
      status: 'pending_approval',
      input: {
        file_path: '/src/config.ts',
      },
      filePath: '/src/config.ts',
      originalContent: `export const config = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
  retries: 3
};`,
      proposedContent: `export const config = {
  apiUrl: 'https://api.production.com',
  timeout: 10000,
  retries: 5,
  debug: true
};`,
    });

    const handleResolve = (toolId: string, approved: boolean) => {
      setTool({
        ...tool,
        status: approved ? 'approved' : 'denied',
      });
    };

    return <ToolCard tool={tool} onResolve={handleResolve} />;
  },
};

// Success Result
export const SuccessResult: Story = {
  args: {
    tool: {
      type: 'tool_result',
      name: 'Read',
      status: 'success',
      content: 'export function Button() { return <button>Click me</button>; }',
    } as ToolInfo,
  },
};

// Error Result
export const ErrorResult: Story = {
  args: {
    tool: {
      type: 'tool_result',
      name: 'Bash',
      status: 'error',
      content: 'Error: Command failed with exit code 1\nsh: invalid-command: command not found',
    } as ToolInfo,
  },
};

// Approved Status
export const Approved: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Write',
      id: 'tool-789',
      status: 'approved',
      input: {
        file_path: '/src/components/NewFeature.tsx',
      },
    } as ToolInfo,
  },
};

// Denied Status
export const Denied: Story = {
  args: {
    tool: {
      type: 'tool_use',
      name: 'Bash',
      id: 'tool-101',
      status: 'denied',
      input: {
        command: 'rm -rf /',
      },
    } as ToolInfo,
  },
};

// Long Content Result
export const LongContentResult: Story = {
  args: {
    tool: {
      type: 'tool_result',
      name: 'Grep',
      status: 'success',
      content: `Found 45 matches:
src/components/App.tsx:12: import { useState } from 'react';
src/components/Form.tsx:8: const [name, setName] = useState('');
src/components/Counter.tsx:5: const [count, setCount] = useState(0);
src/hooks/useAuth.tsx:15: const [user, setUser] = useState(null);
src/hooks/useData.tsx:20: const [loading, setLoading] = useState(false);
... and 40 more matches`,
    } as ToolInfo,
  },
};
