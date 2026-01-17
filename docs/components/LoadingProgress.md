# LoadingProgress

A multi-stage loading indicator designed to provide feedback during long running operations. It supports linear stages and simple progress bars.

## Usage

```tsx
import { LoadingProgress } from '@agentping/web-ui';

// Multi-stage
<LoadingProgress
    stages={[
        { id: '1', label: 'Initializing', status: 'complete' },
        { id: '2', label: 'Building', status: 'active' },
        { id: '3', label: 'Deploying', status: 'pending' },
    ]}
    currentStage="2"
/>

// Simple
<LoadingProgress
    message="Loading data..."
    progress={60}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `stages` | `LoadingStage[]` | Array of stages for the process. |
| `currentStage` | `string` | ID of the currently active stage. |
| `progress` | `number` | Simple progress percentage (0-100). |
| `message` | `string` | Message to display for simple loading. |
