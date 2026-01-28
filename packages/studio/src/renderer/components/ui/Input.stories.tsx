import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, Mail, Lock } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    mono: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: 'Search...',
    icon: <Search size={16} />,
  },
};

export const WithEmailIcon: Story = {
  args: {
    type: 'email',
    placeholder: 'Email address',
    icon: <Mail size={16} />,
  },
};

export const WithPassword: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
    icon: <Lock size={16} />,
  },
};

export const WithValue: Story = {
  args: {
    value: 'Hello World',
    placeholder: 'Enter text...',
  },
};

export const WithClearButton: Story = {
  args: {
    value: 'Clearable text',
    placeholder: 'Enter text...',
    onClear: () => console.log('Clear clicked'),
  },
};

export const MonoFont: Story = {
  args: {
    value: 'const x = 42;',
    placeholder: 'Code input',
    mono: true,
  },
};

export const Error: Story = {
  args: {
    value: 'invalid@',
    placeholder: 'Email',
    error: true,
    icon: <Mail size={16} />,
  },
};

export const Disabled: Story = {
  args: {
    value: 'Cannot edit',
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    icon: <Search size={16} />,
  },
};

export const FullWidthWithAll: Story = {
  args: {
    label: 'Full Featured Input',
    value: 'All features enabled',
    placeholder: 'Type here...',
    icon: <Search size={16} />,
    onClear: () => console.log('Clear'),
    style: { width: '100%' },
  },
};
