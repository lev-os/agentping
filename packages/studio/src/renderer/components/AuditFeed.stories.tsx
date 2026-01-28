import type { Meta, StoryObj } from '@storybook/react';
import { AuditFeed, type AuditEvent } from './AuditFeed';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Components/AuditFeed',
  component: AuditFeed,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuditFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample events
const sampleEvents: AuditEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    type: 'task',
    message: 'Agent Alpha started task: Refactor authentication module',
    metadata: { agent: 'alpha', taskId: 'task-123' },
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 240000), // 4 min ago
    type: 'success',
    message: 'File locked successfully: src/auth/login.ts',
    metadata: { file: 'login.ts', agent: 'alpha' },
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 180000), // 3 min ago
    type: 'message',
    message: 'Agent Alpha: Found 3 security vulnerabilities in auth flow',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 120000), // 2 min ago
    type: 'warning',
    message: 'Merge conflict detected in src/auth/middleware.ts',
    metadata: { severity: 'medium' },
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 60000), // 1 min ago
    type: 'error',
    message: 'Failed to acquire lock on src/auth/session.ts - locked by Agent Beta',
    metadata: { agent: 'beta', file: 'session.ts' },
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 30000), // 30 sec ago
    type: 'success',
    message: 'Task completed: Authentication refactor ready for review',
    metadata: { agent: 'alpha', duration: '4m 30s' },
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 5000), // 5 sec ago
    type: 'task',
    message: 'Agent Beta started task: Update session management',
    metadata: { agent: 'beta', taskId: 'task-124' },
  },
];

// Empty state
export const Empty: Story = {
  args: {
    events: [],
    showFilter: true,
  },
};

// With events
export const WithEvents: Story = {
  args: {
    events: sampleEvents,
    showFilter: true,
    autoScroll: true,
  },
};

// Only errors and warnings
export const ErrorsOnly: Story = {
  args: {
    events: [
      {
        id: '1',
        timestamp: new Date(Date.now() - 120000),
        type: 'error',
        message: 'Network request failed: Connection timeout',
        metadata: { endpoint: '/api/tasks' },
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 90000),
        type: 'warning',
        message: 'High memory usage detected: 85% of available RAM',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 60000),
        type: 'error',
        message: 'File system error: Permission denied on /tmp/workspace',
        metadata: { code: 'EACCES' },
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 30000),
        type: 'warning',
        message: 'API rate limit approaching: 95/100 requests used',
      },
    ],
    showFilter: true,
  },
};

// Many events (scrolling)
export const ManyEvents: Story = {
  args: {
    events: Array.from({ length: 50 }, (_, i) => ({
      id: `event-${i}`,
      timestamp: new Date(Date.now() - (50 - i) * 10000),
      type: ['success', 'error', 'warning', 'message', 'task'][i % 5] as AuditEvent['type'],
      message: `Event ${i + 1}: ${['Task completed', 'Error occurred', 'Warning detected', 'Message received', 'Task started'][i % 5]}`,
      metadata: { index: i + 1 },
    })),
    showFilter: true,
    maxEvents: 50,
  },
};

// No filter controls
export const NoFilter: Story = {
  args: {
    events: sampleEvents,
    showFilter: false,
  },
};

// Live updates simulation
export const LiveUpdates: Story = {
  render: (args) => {
    const [events, setEvents] = useState<AuditEvent[]>(sampleEvents);

    useEffect(() => {
      const interval = setInterval(() => {
        const newEvent: AuditEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          type: ['success', 'error', 'warning', 'message', 'task'][Math.floor(Math.random() * 5)] as AuditEvent['type'],
          message: [
            'New task assigned to Agent Gamma',
            'File modification detected',
            'Memory checkpoint created',
            'Network connection restored',
            'Cache invalidated',
          ][Math.floor(Math.random() * 5)],
          metadata: { agent: ['alpha', 'beta', 'gamma'][Math.floor(Math.random() * 3)] },
        };
        setEvents(prev => [...prev, newEvent]);
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return <AuditFeed {...args} events={events} />;
  },
  args: {
    showFilter: true,
    autoScroll: true,
  },
};

// Loading state
export const Loading: Story = {
  render: (args) => {
    const [events, setEvents] = useState<AuditEvent[]>([]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setEvents(sampleEvents);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);

    return <AuditFeed {...args} events={events} />;
  },
  args: {
    showFilter: true,
  },
};
