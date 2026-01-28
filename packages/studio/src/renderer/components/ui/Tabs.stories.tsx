import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { Settings, User, Bell, Code } from 'lucide-react';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultTab: {
      control: 'text',
      description: 'Initial active tab ID',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tabs defaultTab="tab1">
      <TabList aria-label="Basic tabs example">
        <Tab id="tab1">First Tab</Tab>
        <Tab id="tab2">Second Tab</Tab>
        <Tab id="tab3">Third Tab</Tab>
      </TabList>
      <TabPanel id="tab1">
        <p>Content for the first tab</p>
      </TabPanel>
      <TabPanel id="tab2">
        <p>Content for the second tab</p>
      </TabPanel>
      <TabPanel id="tab3">
        <p>Content for the third tab</p>
      </TabPanel>
    </Tabs>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultTab="notifications">
      <TabList aria-label="Tabs with badges">
        <Tab id="notifications" badge={5}>Notifications</Tab>
        <Tab id="messages" badge={12}>Messages</Tab>
        <Tab id="settings" badge={0}>Settings</Tab>
      </TabList>
      <TabPanel id="notifications">
        <p>You have 5 notifications</p>
      </TabPanel>
      <TabPanel id="messages">
        <p>You have 12 unread messages</p>
      </TabPanel>
      <TabPanel id="settings">
        <p>No pending settings</p>
      </TabPanel>
    </Tabs>
  ),
};

export const WithWarningBadge: Story = {
  render: () => (
    <Tabs defaultTab="errors">
      <TabList aria-label="Tabs with warning badges">
        <Tab id="info" badge={3}>Info</Tab>
        <Tab id="warnings" badge={7} badgeVariant="warning">Warnings</Tab>
        <Tab id="errors" badge={2} badgeVariant="warning">Errors</Tab>
      </TabList>
      <TabPanel id="info">
        <p>3 informational messages</p>
      </TabPanel>
      <TabPanel id="warnings">
        <p>7 warnings detected</p>
      </TabPanel>
      <TabPanel id="errors">
        <p>2 errors need attention</p>
      </TabPanel>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultTab="active">
      <TabList aria-label="Tabs with disabled state">
        <Tab id="active">Active</Tab>
        <Tab id="disabled" disabled>Disabled</Tab>
        <Tab id="available">Available</Tab>
      </TabList>
      <TabPanel id="active">
        <p>This tab is active</p>
      </TabPanel>
      <TabPanel id="disabled">
        <p>This content cannot be accessed</p>
      </TabPanel>
      <TabPanel id="available">
        <p>This tab is available</p>
      </TabPanel>
    </Tabs>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Tabs defaultTab="profile">
      <TabList aria-label="Profile tabs">
        <Tab id="profile">
          Profile
        </Tab>
        <Tab id="settings">
          Settings
        </Tab>
        <Tab id="notifications" badge={3}>
          Notifications
        </Tab>
        <Tab id="code">
          Code
        </Tab>
      </TabList>
      <TabPanel id="profile">
        <div style={{ padding: '16px', minWidth: '400px' }}>
          <h3>User Profile</h3>
          <p>Name: John Doe</p>
          <p>Email: john@example.com</p>
        </div>
      </TabPanel>
      <TabPanel id="settings">
        <div style={{ padding: '16px', minWidth: '400px' }}>
          <h3>Settings</h3>
          <label>
            <input type="checkbox" /> Enable notifications
          </label>
          <br />
          <label>
            <input type="checkbox" /> Dark mode
          </label>
        </div>
      </TabPanel>
      <TabPanel id="notifications">
        <div style={{ padding: '16px', minWidth: '400px' }}>
          <h3>Notifications (3)</h3>
          <ul>
            <li>New message from Alice</li>
            <li>System update available</li>
            <li>Task completed successfully</li>
          </ul>
        </div>
      </TabPanel>
      <TabPanel id="code">
        <div style={{ padding: '16px', minWidth: '400px' }}>
          <h3>Code Snippet</h3>
          <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
            <code>{`function hello() {\n  console.log("Hello, World!");\n}`}</code>
          </pre>
        </div>
      </TabPanel>
    </Tabs>
  ),
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Use Arrow Left/Right, Home, and End keys to navigate tabs
      </p>
      <Tabs defaultTab="tab1">
        <TabList aria-label="Keyboard navigation example">
          <Tab id="tab1">Tab 1</Tab>
          <Tab id="tab2">Tab 2</Tab>
          <Tab id="tab3">Tab 3</Tab>
          <Tab id="tab4">Tab 4</Tab>
          <Tab id="tab5">Tab 5</Tab>
        </TabList>
        <TabPanel id="tab1">Content 1</TabPanel>
        <TabPanel id="tab2">Content 2</TabPanel>
        <TabPanel id="tab3">Content 3</TabPanel>
        <TabPanel id="tab4">Content 4</TabPanel>
        <TabPanel id="tab5">Content 5</TabPanel>
      </Tabs>
    </div>
  ),
};
