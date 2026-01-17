# InfoSidebar

A collapsible sidebar for displaying contextual information, documentation, or help content without leaving the main view.

## Usage

```tsx
import { InfoSidebar } from '@agentping/web-ui';

<InfoSidebar
    title="Documentation"
    content="Refer to the API docs for more info."
    isOpen={isOpen}
    onToggle={() => setIsOpen(!isOpen)}
    links={[
        { label: 'API Reference', url: '/docs/api' }
    ]}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Header title of the sidebar. |
| `content` | `string` | Main body text content. |
| `isOpen` | `boolean` | Whether the sidebar is currently visible. |
| `onToggle` | `() => void` | Callback to toggle visibility. |
| `links` | `{ label: string; url: string }[]` | Optional list of external links. |
| `position` | `'left' \| 'right'` | Side of the screen to appear (default: 'right'). |
