import type { Meta, StoryObj } from '@storybook/react';
import { StatusGrid, StatusCard } from './StatusGrid';
import { Cpu, HardDrive, Zap, Database, Activity, Globe } from 'lucide-react';

const meta = {
  title: 'UI/StatusGrid',
  component: StatusGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Number of columns in grid',
    },
  },
} satisfies Meta<typeof StatusGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample cards
const sampleCards: StatusCard[] = [
  {
    id: '1',
    title: 'CPU Usage',
    status: 'success',
    value: '45%',
    description: 'System CPU utilization is healthy',
    icon: <Cpu size={24} />,
    metadata: {
      cores: 8,
      threads: 16,
    },
  },
  {
    id: '2',
    title: 'Memory',
    status: 'warning',
    value: '78%',
    description: 'Memory usage approaching threshold',
    icon: <HardDrive size={24} />,
    metadata: {
      used: '6.2 GB',
      total: '8 GB',
    },
  },
  {
    id: '3',
    title: 'API Health',
    status: 'error',
    value: '503',
    description: 'Service unavailable - connection timeout',
    icon: <Globe size={24} />,
    metadata: {
      endpoint: '/api/v1',
      uptime: '87.3%',
    },
  },
  {
    id: '4',
    title: 'Database',
    status: 'success',
    value: '12ms',
    description: 'Query response time is optimal',
    icon: <Database size={24} />,
    metadata: {
      connections: 45,
      pool: 100,
    },
  },
  {
    id: '5',
    title: 'Task Queue',
    status: 'pending',
    value: '23',
    description: 'Tasks waiting in queue',
    icon: <Activity size={24} />,
  },
  {
    id: '6',
    title: 'Power',
    status: 'active',
    value: '250W',
    description: 'Current power consumption',
    icon: <Zap size={24} />,
    metadata: {
      voltage: '120V',
      frequency: '60Hz',
    },
  },
];

// Stories
export const Default: Story = {
  args: {
    cards: sampleCards,
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    cards: sampleCards,
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    cards: sampleCards,
    columns: 4,
  },
};

export const Empty: Story = {
  args: {
    cards: [],
    emptyMessage: 'No status cards available',
  },
};

export const Loading: Story = {
  args: {
    cards: [],
    loading: true,
  },
};

export const SuccessOnly: Story = {
  args: {
    cards: [
      {
        id: '1',
        title: 'All Systems Operational',
        status: 'success',
        value: '100%',
        description: 'All services running smoothly',
      },
      {
        id: '2',
        title: 'Backup Status',
        status: 'success',
        value: 'Complete',
        description: 'Latest backup: 2 hours ago',
      },
      {
        id: '3',
        title: 'Security',
        status: 'success',
        value: 'Secure',
        description: 'No threats detected',
      },
    ],
    columns: 3,
  },
};

export const ErrorStates: Story = {
  args: {
    cards: [
      {
        id: '1',
        title: 'Service Down',
        status: 'error',
        value: 'OFFLINE',
        description: 'Service unreachable for 5 minutes',
      },
      {
        id: '2',
        title: 'Failed Requests',
        status: 'error',
        value: '127',
        description: 'High error rate detected',
      },
      {
        id: '3',
        title: 'Connection Lost',
        status: 'error',
        value: 'DISCONNECTED',
        description: 'Unable to reach database',
      },
    ],
    columns: 3,
  },
};

export const Clickable: Story = {
  args: {
    cards: sampleCards,
    columns: 3,
    onCardClick: (card) => {
      console.log('Clicked card:', card);
      alert(`Status: ${card.title} - ${card.status}`);
    },
  },
};

export const WithoutValues: Story = {
  args: {
    cards: [
      {
        id: '1',
        title: 'System Health',
        status: 'success',
        description: 'All systems operational',
      },
      {
        id: '2',
        title: 'Pending Updates',
        status: 'pending',
        description: 'Updates available for installation',
      },
      {
        id: '3',
        title: 'Maintenance Mode',
        status: 'warning',
        description: 'Scheduled maintenance in 2 hours',
      },
    ],
    columns: 3,
  },
};

export const MinimalCards: Story = {
  args: {
    cards: [
      {
        id: '1',
        title: 'Service A',
        status: 'success',
      },
      {
        id: '2',
        title: 'Service B',
        status: 'active',
      },
      {
        id: '3',
        title: 'Service C',
        status: 'pending',
      },
    ],
    columns: 3,
  },
};

export const LargeGrid: Story = {
  args: {
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: String(i),
      title: `Service ${i + 1}`,
      status: (['success', 'error', 'warning', 'pending', 'active'] as const)[i % 5],
      value: `${Math.floor(Math.random() * 100)}%`,
      description: `Status update for service ${i + 1}`,
    })),
    columns: 4,
  },
};

export const AgentMonitoring: Story = {
  args: {
    cards: [
      {
        id: '1',
        title: 'Agent Alpha',
        status: 'active',
        value: '15',
        description: 'Active tasks in progress',
        metadata: {
          uptime: '99.9%',
          lastSeen: '2 min ago',
        },
      },
      {
        id: '2',
        title: 'Agent Beta',
        status: 'pending',
        value: '3',
        description: 'Waiting for resources',
        metadata: {
          uptime: '87.2%',
          lastSeen: '15 min ago',
        },
      },
      {
        id: '3',
        title: 'Agent Gamma',
        status: 'error',
        value: '0',
        description: 'Connection lost',
        metadata: {
          uptime: '45.1%',
          lastSeen: '1 hour ago',
        },
      },
      {
        id: '4',
        title: 'Agent Delta',
        status: 'success',
        value: '8',
        description: 'All tasks completed',
        metadata: {
          uptime: '98.5%',
          lastSeen: '1 min ago',
        },
      },
    ],
    columns: 2,
  },
};
