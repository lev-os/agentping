import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Template for interactive modals
function ModalTemplate(args: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export const Default: Story = {
  render: () => (
    <ModalTemplate>
      <p>This is a basic modal with default settings.</p>
    </ModalTemplate>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <ModalTemplate title="Modal Title">
      <p>This modal has a title and a close button in the header.</p>
    </ModalTemplate>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <ModalTemplate title="Small Modal" size="sm">
      <p>A compact modal for simple dialogs.</p>
    </ModalTemplate>
  ),
};

export const MediumSize: Story = {
  render: () => (
    <ModalTemplate title="Medium Modal" size="md">
      <p>The default medium-sized modal.</p>
      <p>Suitable for most use cases.</p>
    </ModalTemplate>
  ),
};

export const LargeSize: Story = {
  render: () => (
    <ModalTemplate title="Large Modal" size="lg">
      <p>A larger modal for content-heavy dialogs.</p>
      <p>Great for forms, settings, or detailed information.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </ModalTemplate>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <ModalTemplate
      title="Modal with Footer"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>
      }
    >
      <p>This modal has footer actions.</p>
    </ModalTemplate>
  ),
};

export const ConfirmDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)} variant="danger">Delete Item</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirm Deletion"
          size="sm"
          footer={
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>Delete</Button>
            </div>
          }
        >
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        </Modal>
      </>
    );
  },
};

export const ScrollableContent: Story = {
  render: () => (
    <ModalTemplate title="Scrollable Modal" size="md">
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i}>Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        ))}
      </div>
    </ModalTemplate>
  ),
};

export const FormModal: Story = {
  render: () => (
    <ModalTemplate
      title="User Settings"
      size="md"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      }
    >
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="John Doe" style={{ width: '100%' }} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="john@example.com" style={{ width: '100%' }} />
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" rows={4} placeholder="Tell us about yourself..." style={{ width: '100%' }} />
        </div>
      </form>
    </ModalTemplate>
  ),
};

export const NoTitle: Story = {
  render: () => (
    <ModalTemplate size="sm">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h3>Custom Content</h3>
        <p>A modal without a standard header.</p>
      </div>
    </ModalTemplate>
  ),
};
