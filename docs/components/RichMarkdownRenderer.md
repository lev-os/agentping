# RichMarkdownRenderer

A secure and styled markdown renderer. It supports standard markdown features including code blocks, blockquotes, and lists, styled to match the AgentPing design system.

## Usage

```tsx
import { RichMarkdownRenderer } from '@agentping/web-ui';

<RichMarkdownRenderer
    content={`
# Hello World

This is **markdown** content.
    `}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `content` | `string` | The markdown string to render. |
| `className` | `string` | Optional additional CSS classes. |
