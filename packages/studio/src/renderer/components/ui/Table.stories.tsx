import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableColumn } from './Table';
import { Badge } from './Badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    selectable: {
      control: 'boolean',
      description: 'Enable row selection',
    },
    pageSize: {
      control: 'number',
      description: 'Number of rows per page',
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleData = [
  { id: 1, name: 'Agent Alpha', status: 'active', tasks: 12, uptime: '99.9%', lastSeen: '2 min ago' },
  { id: 2, name: 'Agent Beta', status: 'idle', tasks: 3, uptime: '87.2%', lastSeen: '15 min ago' },
  { id: 3, name: 'Agent Gamma', status: 'error', tasks: 0, uptime: '45.1%', lastSeen: '1 hour ago' },
  { id: 4, name: 'Agent Delta', status: 'active', tasks: 8, uptime: '98.5%', lastSeen: '1 min ago' },
  { id: 5, name: 'Agent Epsilon', status: 'pending', tasks: 5, uptime: '92.3%', lastSeen: '30 min ago' },
  { id: 6, name: 'Agent Zeta', status: 'active', tasks: 15, uptime: '99.1%', lastSeen: '5 min ago' },
  { id: 7, name: 'Agent Eta', status: 'idle', tasks: 1, uptime: '76.8%', lastSeen: '2 hours ago' },
  { id: 8, name: 'Agent Theta', status: 'active', tasks: 10, uptime: '97.4%', lastSeen: '3 min ago' },
];

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Agent Name', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => {
      const statusMap: Record<string, { icon: React.ReactNode; variant: 'success' | 'warning' | 'error' | 'default' }> = {
        active: { icon: <CheckCircle size={12} />, variant: 'success' },
        idle: { icon: <Clock size={12} />, variant: 'warning' },
        error: { icon: <XCircle size={12} />, variant: 'error' },
        pending: { icon: <Clock size={12} />, variant: 'default' },
      };

      const status = statusMap[value] || statusMap.pending;
      return <Badge variant={status.variant}>{value}</Badge>;
    },
  },
  { key: 'tasks', label: 'Active Tasks', sortable: true },
  { key: 'uptime', label: 'Uptime', sortable: true },
  { key: 'lastSeen', label: 'Last Seen', sortable: false },
];

// Stories
export const Default: Story = {
  args: {
    columns,
    data: sampleData,
    pageSize: 5,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyMessage: 'No agents found',
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
  },
};

export const Selectable: Story = {
  args: {
    columns,
    data: sampleData,
    selectable: true,
    pageSize: 5,
    onSelectionChange: (selected) => {
      console.log('Selected rows:', selected);
    },
  },
};

export const Clickable: Story = {
  args: {
    columns,
    data: sampleData,
    pageSize: 5,
    onRowClick: (row) => {
      console.log('Clicked row:', row);
      alert(`Clicked: ${row.name}`);
    },
  },
};

export const LargeDataset: Story = {
  args: {
    columns,
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Agent ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      status: ['active', 'idle', 'error', 'pending'][i % 4],
      tasks: Math.floor(Math.random() * 20),
      uptime: `${(Math.random() * 100).toFixed(1)}%`,
      lastSeen: `${Math.floor(Math.random() * 60)} min ago`,
    })),
    pageSize: 10,
    selectable: true,
  },
};

// Simple columns for minimal table
const simpleColumns: TableColumn[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'value', label: 'Value', sortable: true },
];

const simpleData = [
  { id: 1, name: 'Item A', value: 100 },
  { id: 2, name: 'Item B', value: 250 },
  { id: 3, name: 'Item C', value: 180 },
];

export const SimpleTable: Story = {
  args: {
    columns: simpleColumns,
    data: simpleData,
    pageSize: 10,
  },
};

export const NoPagination: Story = {
  args: {
    columns: simpleColumns,
    data: simpleData,
    pageSize: 100, // Large page size to avoid pagination
  },
};
