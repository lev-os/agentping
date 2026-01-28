import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Code, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const basicOptions = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
];

const iconOptions = [
  { id: 'code', label: 'Code Files', icon: <Code size={14} /> },
  { id: 'text', label: 'Text Documents', icon: <FileText size={14} /> },
  { id: 'image', label: 'Images', icon: <Image size={14} /> },
  { id: 'video', label: 'Videos', icon: <Video size={14} /> },
  { id: 'audio', label: 'Audio', icon: <Music size={14} /> },
  { id: 'archive', label: 'Archives', icon: <Archive size={14} /> },
];

const mixedOptions = [
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'disabled', label: 'Disabled (unavailable)', disabled: true },
  { id: 'completed', label: 'Completed' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <Dropdown
        value={value}
        options={basicOptions}
        onChange={setValue}
        placeholder="Select an option"
      />
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('code');
    return (
      <Dropdown
        value={value}
        options={iconOptions}
        onChange={setValue}
        placeholder="Select file type"
      />
    );
  },
};

export const WithPreselectedValue: Story = {
  render: () => {
    const [value, setValue] = useState<string>('2');
    return (
      <Dropdown
        value={value}
        options={basicOptions}
        onChange={setValue}
        placeholder="Select an option"
      />
    );
  },
};

export const NoSelection: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <Dropdown
        value={value}
        options={basicOptions}
        onChange={setValue}
        placeholder="Nothing selected"
      />
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string>('active');
    return (
      <Dropdown
        value={value}
        options={mixedOptions}
        onChange={setValue}
        placeholder="Select status"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Dropdown
      value="2"
      options={basicOptions}
      onChange={() => {}}
      placeholder="Select an option"
      disabled
    />
  ),
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <Dropdown
        value={value}
        options={basicOptions}
        onChange={setValue}
        placeholder="🎯 Choose your destiny..."
      />
    );
  },
};

export const LongList: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    const longOptions = Array.from({ length: 20 }, (_, i) => ({
      id: `option-${i}`,
      label: `Option ${i + 1}`,
    }));

    return (
      <Dropdown
        value={value}
        options={longOptions}
        onChange={setValue}
        placeholder="Select from many options"
      />
    );
  },
};

export const PriorityLevels: Story = {
  render: () => {
    const [value, setValue] = useState<string>('p2');
    const priorities = [
      { id: 'p0', label: 'P0 - Critical' },
      { id: 'p1', label: 'P1 - High' },
      { id: 'p2', label: 'P2 - Medium' },
      { id: 'p3', label: 'P3 - Low' },
    ];

    return (
      <Dropdown
        value={value}
        options={priorities}
        onChange={setValue}
        placeholder="Select priority"
      />
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ marginBottom: '12px', fontSize: '14px' }}>
          Keyboard shortcuts: Arrow keys to navigate, Enter/Space to select, Escape to close
        </p>
        <Dropdown
          value={value}
          options={iconOptions}
          onChange={setValue}
          placeholder="Try keyboard navigation"
        />
      </div>
    );
  },
};
