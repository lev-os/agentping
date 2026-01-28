import type { Meta, StoryObj } from '@storybook/react';
import { Timeline, TimelineEvent } from './Timeline';
import { Zap, Database, Upload, Download, RefreshCw } from 'lucide-react';

const meta = {
  title: 'UI/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    showTime: {
      control: 'boolean',
      description: 'Show time in timestamps',
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample events
const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Agent deployment successful',
    description: 'AgentPing v2.1.0 deployed to production',
    timestamp: new Date(Date.now() - 5 * 60000),
    type: 'success',
    metadata: {
      version: '2.1.0',
      environment: 'production',
    },
  },
  {
    id: '2',
    title: 'Database migration completed',
    description: 'Applied 12 migrations to update schema',
    timestamp: new Date(Date.now() - 15 * 60000),
    type: 'info',
    icon: <Database size={16} />,
  },
  {
    id: '3',
    title: 'High memory usage detected',
    description: 'Agent Beta exceeded 85% memory threshold',
    timestamp: new Date(Date.now() - 30 * 60000),
    type: 'warning',
    metadata: {
      agent: 'Beta',
      memory: '85.3%',
    },
  },
  {
    id: '4',
    title: 'Connection timeout',
    description: 'Failed to connect to upstream service after 3 retries',
    timestamp: new Date(Date.now() - 45 * 60000),
    type: 'error',
    metadata: {
      service: 'auth-service',
      retries: 3,
    },
  },
  {
    id: '5',
    title: 'System startup initiated',
    description: 'AgentPing system starting up',
    timestamp: new Date(Date.now() - 60 * 60000),
    type: 'info',
    icon: <Zap size={16} />,
  },
];

// Stories
export const Default: Story = {
  args: {
    events: sampleEvents,
    showTime: true,
  },
};

export const Empty: Story = {
  args: {
    events: [],
    emptyMessage: 'No events to display',
  },
};

export const Loading: Story = {
  args: {
    events: [],
    loading: true,
  },
};

export const SuccessOnly: Story = {
  args: {
    events: [
      {
        id: '1',
        title: 'Task completed successfully',
        description: 'All 15 subtasks finished without errors',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'success',
      },
      {
        id: '2',
        title: 'Deployment verified',
        description: 'All health checks passed',
        timestamp: new Date(Date.now() - 10 * 60000),
        type: 'success',
      },
      {
        id: '3',
        title: 'Backup completed',
        description: 'Database backup saved to S3',
        timestamp: new Date(Date.now() - 20 * 60000),
        type: 'success',
      },
    ],
    showTime: true,
  },
};

export const ErrorsOnly: Story = {
  args: {
    events: [
      {
        id: '1',
        title: 'API request failed',
        description: '500 Internal Server Error from upstream',
        timestamp: new Date(Date.now() - 2 * 60000),
        type: 'error',
      },
      {
        id: '2',
        title: 'Authentication failed',
        description: 'Invalid credentials provided',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'error',
      },
      {
        id: '3',
        title: 'Database connection lost',
        description: 'Connection pool exhausted',
        timestamp: new Date(Date.now() - 10 * 60000),
        type: 'error',
      },
    ],
    showTime: true,
  },
};

export const CustomIcons: Story = {
  args: {
    events: [
      {
        id: '1',
        title: 'File uploaded',
        description: 'config.yaml uploaded successfully',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'success',
        icon: <Upload size={16} />,
      },
      {
        id: '2',
        title: 'Backup downloaded',
        description: 'Retrieved backup from remote storage',
        timestamp: new Date(Date.now() - 10 * 60000),
        type: 'info',
        icon: <Download size={16} />,
      },
      {
        id: '3',
        title: 'Cache refreshed',
        description: 'Application cache cleared and rebuilt',
        timestamp: new Date(Date.now() - 15 * 60000),
        type: 'info',
        icon: <RefreshCw size={16} />,
      },
    ],
    showTime: true,
  },
};

export const Clickable: Story = {
  args: {
    events: sampleEvents,
    showTime: true,
    onEventClick: (event) => {
      console.log('Clicked event:', event);
      alert(`Event: ${event.title}`);
    },
  },
};

export const WithoutTime: Story = {
  args: {
    events: sampleEvents,
    showTime: false,
  },
};

export const LongTimeline: Story = {
  args: {
    events: Array.from({ length: 20 }, (_, i) => ({
      id: String(i),
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      timestamp: new Date(Date.now() - i * 5 * 60000),
      type: (['success', 'error', 'warning', 'info', 'default'] as const)[i % 5],
    })),
    showTime: true,
  },
};

export const MinimalEvents: Story = {
  args: {
    events: [
      {
        id: '1',
        title: 'Simple event without description',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'info',
      },
      {
        id: '2',
        title: 'Another minimal event',
        timestamp: new Date(Date.now() - 10 * 60000),
        type: 'success',
      },
    ],
    showTime: true,
  },
};
