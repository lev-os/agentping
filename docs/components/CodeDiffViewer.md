# CodeDiffViewer

A syntax-highlighted diff viewer for comparing two blocks of code. Useful for reviewing code changes directly in the UI.

## Usage

```tsx
import { CodeDiffViewer } from '@agentping/web-ui';

<CodeDiffViewer
    oldCode="const x = 1;"
    newCode="const x = 2;"
    language="javascript"
    filePath="src/constants.js"
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `oldCode` | `string` | The original code. |
| `newCode` | `string` | The new code. |
| `language` | `string` | Language for syntax highlighting (e.g., 'typescript', 'python'). |
| `filePath` | `string` | Optional file path label. |
