# DependencyGraph

A visual representation of dependencies between tasks or items. It renders a directed graph where nodes represent items and lines represent dependencies.

## Usage

```tsx
import { DependencyGraph } from '@agentping/web-ui';

<DependencyGraph
    nodes={[
        { id: '1', label: 'Database', status: 'complete', dependencies: [] },
        { id: '2', label: 'API', status: 'in_progress', dependencies: ['1'] },
        { id: '3', label: 'Frontend', status: 'blocked', dependencies: ['2'] },
    ]}
    onNodeClick={(id) => console.log('Clicked', id)}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `nodes` | `GraphNode[]` | Array of nodes with id, label, status, and dependency IDs. |
| `onNodeClick` | `(id: string) => void` | Callback when a node is clicked. |
