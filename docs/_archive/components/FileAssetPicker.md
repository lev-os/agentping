# FileAssetPicker

A component for selecting files or assets from a list or grid view. Supports multiple selection and different file types.

## Usage

```tsx
import { FileAssetPicker } from '@agentping/web-ui';

<FileAssetPicker
    files={[
        { id: '1', name: 'image.png', type: 'image' },
        { id: '2', name: 'styles.css', type: 'code' }
    ]}
    selectedIds={selectedIds}
    onSelect={(ids) => setSelectedIds(ids)}
    allowMultiple={true}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `files` | `FileAsset[]` | Array of file objects to display. |
| `selectedIds` | `string[]` | Array of currently selected file IDs. |
| `onSelect` | `(ids: string[]) => void` | Callback when selection changes. |
| `allowMultiple` | `boolean` | Whether multiple selection is allowed. |
| `viewMode` | `'grid' \| 'list'` | Initial view mode (default: 'grid'). |
