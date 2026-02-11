# ConfirmationModal

A modal dialog for confirming destructive or critical actions. It demands user attention and halts interaction with the rest of the application until resolved.

## Usage

```tsx
import { ConfirmationModal } from '@agentping/web-ui';

<ConfirmationModal
    isOpen={isOpen}
    title="Delete Database?"
    message="This action cannot be undone."
    confirmLabel="Delete"
    isDanger={true}
    onConfirm={handleDelete}
    onCancel={() => setIsOpen(false)}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the modal is visible. |
| `title` | `string` | The title of the modal. |
| `message` | `string` | The message body content. |
| `confirmLabel` | `string` | Label for the confirm button. |
| `cancelLabel` | `string` | Label for the cancel button. |
| `isDanger` | `boolean` | If true, confirm button is styled red. |
| `onConfirm` | `() => void` | Callback for confirmation. |
| `onCancel` | `() => void` | Callback for cancellation. |
