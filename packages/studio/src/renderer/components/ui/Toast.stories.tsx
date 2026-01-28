import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastContainer } from './Toast';
import { useState } from 'react';
import { Zap } from 'lucide-react';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Toast variant style',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in ms (0 = no auto-dismiss)',
    },
    closable: {
      control: 'boolean',
      description: 'Show close button',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    message: 'Your changes have been saved successfully.',
    duration: 0,
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    message: 'Failed to save changes. Please try again.',
    duration: 0,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    message: 'Your session will expire in 5 minutes.',
    duration: 0,
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Info',
    message: 'New updates are available. Refresh to see the latest version.',
    duration: 0,
  },
};

export const NoTitle: Story = {
  args: {
    variant: 'success',
    message: 'Operation completed successfully.',
    duration: 0,
  },
};

export const WithAction: Story = {
  args: {
    variant: 'info',
    title: 'Update Available',
    message: 'A new version is available.',
    action: {
      label: 'Update Now',
      onClick: () => alert('Updating...'),
    },
    duration: 0,
  },
};

export const CustomIcon: Story = {
  args: {
    variant: 'success',
    title: 'Powered Up',
    message: 'Your account has been upgraded.',
    icon: <Zap size={20} />,
    duration: 0,
  },
};

export const NotClosable: Story = {
  args: {
    variant: 'warning',
    title: 'Action Required',
    message: 'You must complete this step to continue.',
    closable: false,
    duration: 0,
  },
};

export const LongMessage: Story = {
  args: {
    variant: 'info',
    title: 'Detailed Information',
    message: 'This is a longer message that provides more detailed information about what happened. It might span multiple lines and should still be readable and well-formatted within the toast component.',
    duration: 0,
  },
};

export const AutoDismiss: Story = {
  render: () => {
    const [show, setShow] = useState(true);

    return (
      <div>
        {show ? (
          <Toast
            variant="success"
            message="This toast will auto-dismiss in 3 seconds"
            duration={3000}
            onClose={() => setShow(false)}
          />
        ) : (
          <button
            onClick={() => setShow(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Show Toast Again
          </button>
        )}
      </div>
    );
  },
};

export const InContainer: Story = {
  render: () => (
    <ToastContainer position="top-right">
      <Toast
        variant="success"
        title="Task Completed"
        message="Your task has been completed successfully."
        duration={0}
      />
      <Toast
        variant="info"
        title="New Message"
        message="You have a new message from Alice."
        duration={0}
      />
      <Toast
        variant="warning"
        message="Low disk space detected."
        duration={0}
      />
    </ToastContainer>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Toast
        variant="success"
        title="Success"
        message="Operation completed successfully."
        duration={0}
      />
      <Toast
        variant="error"
        title="Error"
        message="Something went wrong."
        duration={0}
      />
      <Toast
        variant="warning"
        title="Warning"
        message="Please review your changes."
        duration={0}
      />
      <Toast
        variant="info"
        title="Info"
        message="Here's some helpful information."
        duration={0}
      />
    </div>
  ),
};

export const InteractiveDemo: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: number; variant: any; message: string }>>([]);
    let idCounter = 0;

    const addToast = (variant: any, message: string) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, variant, message }]);
    };

    const removeToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => addToast('success', 'Success toast!')}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #4ade80', background: '#dcfce7', cursor: 'pointer' }}
          >
            Show Success
          </button>
          <button
            onClick={() => addToast('error', 'Error toast!')}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #f87171', background: '#fee2e2', cursor: 'pointer' }}
          >
            Show Error
          </button>
          <button
            onClick={() => addToast('warning', 'Warning toast!')}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #fbbf24', background: '#fef3c7', cursor: 'pointer' }}
          >
            Show Warning
          </button>
          <button
            onClick={() => addToast('info', 'Info toast!')}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #60a5fa', background: '#dbeafe', cursor: 'pointer' }}
          >
            Show Info
          </button>
        </div>
        <ToastContainer position="top-right">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              variant={toast.variant}
              message={toast.message}
              duration={3000}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </ToastContainer>
      </div>
    );
  },
};
