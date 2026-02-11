# InlineTutorialTooltip

A contextual tooltip designed for onboarding and tutorials. It anchors to a specific DOM element and includes "Got it" actions.

## Usage

```tsx
import { InlineTutorialTooltip } from '@agentping/web-ui';

<InlineTutorialTooltip
    targetSelector="#my-button"
    content="Click here to save your changes."
    title="Save Button"
    onDismiss={() => setShowTooltip(false)}
    position="bottom"
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `targetSelector` | `string` | CSS selector for the anchor element. |
| `targetRef` | `RefObject` | React ref for the anchor element (alternative to selector). |
| `content` | `string` | Main text content. |
| `title` | `string` | Optional title. |
| `onDismiss` | `() => void` | Callback when "Got it" is clicked. |
| `onNeverShow` | `() => void` | Callback for "Don't show again". |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | Preferred positioning relative to target. |
