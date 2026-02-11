# ProgressTimeline

A vertical timeline component for tracking sequential steps, such as a multi-step approval workflow.

## Usage

```tsx
import { ProgressTimeline } from '@agentping/web-ui';

<ProgressTimeline
    steps={[
        { id: '1', label: 'Draft', timestamp: '10:00 AM', status: 'complete' },
        { id: '2', label: 'Review', status: 'current' },
        { id: '3', label: 'Publish', status: 'pending' },
    ]}
    currentIndex={1}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `steps` | `TimelineStep[]` | Array of step objects. |
| `currentIndex` | `number` | Index of the currently active step. |
