# StatusCard

A compact card component for displaying the status, progress, and key metrics of an active process.

## Usage

```tsx
import { StatusCard } from '@agentping/web-ui';

<StatusCard
    title="Training Model v3"
    status="running"
    progress={45}
    eta="12m 30s"
    metrics={[
        { label: 'Loss', value: '0.023' },
        { label: 'Epoch', value: '12/50' }
    ]}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | The title of the card. |
| `status` | `'pending' \| 'running' \| 'success' \| 'error' \| 'warning' \| 'idle'` | Current status state. |
| `progress` | `number` | Progress percentage (0-100). |
| `eta` | `string` | Estimated time remaining string. |
| `metrics` | `{ label: string; value: string }[]` | Array of key-value metrics to display. |
