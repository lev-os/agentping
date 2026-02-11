import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  HeaderStatusDropdown,
  type StatusItem,
  type StatusGroup,
  type DropdownPosition,
} from '../../components/recipes/header-status-dropdown'

// ============================================================================
// Mock Data
// ============================================================================

const MODEL_ITEMS: StatusItem[] = [
  { id: 'ground_v1', label: 'Ground V1', description: 'Taxi & Ground Operations', status: 'active' },
  { id: 'takeoff_v2', label: 'Takeoff V2', description: 'Runway Operations', status: 'active' },
  { id: 'cruise_v1', label: 'Cruise V1', description: 'Level Flight', status: 'maintenance' },
  { id: 'landing_v3', label: 'Landing V3', description: 'Approach & Landing', status: 'active' },
  { id: 'emergency_v1', label: 'Emergency V1', description: 'Emergency Procedures', status: 'pending' },
]

const MODEL_GROUPS: StatusGroup[] = [
  {
    id: 'active',
    label: 'Active in Workspace',
    items: [
      { id: 'ground_v1', label: 'Ground V1', description: 'Taxi & Ground Operations', status: 'active' },
      { id: 'takeoff_v2', label: 'Takeoff V2', description: 'Runway Operations', status: 'active' },
    ],
  },
  {
    id: 'other',
    label: 'Other Models',
    items: [
      { id: 'cruise_v1', label: 'Cruise V1', description: 'Level Flight', status: 'maintenance' },
      { id: 'landing_v3', label: 'Landing V3', description: 'Approach & Landing', status: 'inactive' },
      { id: 'emergency_v1', label: 'Emergency V1', description: 'Emergency Procedures', status: 'pending' },
    ],
  },
  {
    id: 'favorites',
    label: 'Favorites',
    items: [
      { id: 'ground_v1_fav', label: 'Ground V1', description: 'Your favorite', status: 'active', isFavorite: true },
    ],
  },
]

const WORKSPACE_ITEMS: StatusItem[] = [
  { id: 'default', label: 'Default Workspace', description: 'Main development', status: 'active' },
  { id: 'cessna172', label: 'Cessna 172 Project', description: 'Single-engine trainer', status: 'active' },
  { id: 'boeing737', label: 'Boeing 737 Project', description: 'Commercial airliner', status: 'maintenance' },
  { id: 'experimental', label: 'Experimental', description: 'R&D workspace', status: 'pending' },
]

// ============================================================================
// Stateful Story Components
// ============================================================================

function ModelDropdownStory() {
  const [selected, setSelected] = React.useState<string | null>('ground_v1')

  return (
    <HeaderStatusDropdown
      variant="model"
      value={selected}
      onValueChange={setSelected}
      items={MODEL_ITEMS}
      placeholder="Select Model"
      viewAllHref="/models"
      viewAllLabel="All Models"
    />
  )
}

function WorkspaceDropdownStory() {
  const [selected, setSelected] = React.useState<string | null>('default')

  return (
    <HeaderStatusDropdown
      variant="workspace"
      value={selected}
      onValueChange={setSelected}
      items={WORKSPACE_ITEMS}
      placeholder="Select Workspace"
      viewAllHref="/workspaces"
      viewAllLabel="All Workspaces"
    />
  )
}

function GroupedModelsStory() {
  const [selected, setSelected] = React.useState<string | null>('ground_v1')

  return (
    <HeaderStatusDropdown
      variant="model"
      value={selected}
      onValueChange={setSelected}
      groups={MODEL_GROUPS}
      placeholder="Select Model"
      viewAllHref="/models"
    />
  )
}

function WithFavoritesStory() {
  const [selected, setSelected] = React.useState<string | null>(null)
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set(['ground_v1']))

  const itemsWithFavorites = MODEL_ITEMS.map((item) => ({
    ...item,
    isFavorite: favorites.has(item.id),
  }))

  const handleToggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  return (
    <HeaderStatusDropdown
      variant="model"
      value={selected}
      onValueChange={setSelected}
      items={itemsWithFavorites}
      placeholder="Select Model"
      showFavorites
      onToggleFavorite={handleToggleFavorite}
    />
  )
}

function LoadingStory() {
  return (
    <HeaderStatusDropdown
      variant="model"
      value={null}
      items={[]}
      isLoading
      placeholder="Loading..."
    />
  )
}

function DisabledStory() {
  return (
    <HeaderStatusDropdown
      variant="model"
      value="ground_v1"
      items={MODEL_ITEMS}
      disabled
      placeholder="Select Model"
    />
  )
}

function HeaderBarStory() {
  const [model, setModel] = React.useState<string | null>('ground_v1')
  const [workspace, setWorkspace] = React.useState<string | null>('default')

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-background border border-border rounded-lg">
      <HeaderStatusDropdown
        variant="workspace"
        value={workspace}
        onValueChange={setWorkspace}
        items={WORKSPACE_ITEMS}
        placeholder="Workspace"
      />
      <div className="w-px h-4 bg-border" />
      <HeaderStatusDropdown
        variant="model"
        value={model}
        onValueChange={setModel}
        items={MODEL_ITEMS}
        placeholder="Model"
      />
    </div>
  )
}

function LargeDatasetStory() {
  const [selected, setSelected] = React.useState<string | null>(null)

  // Generate 50 models
  const manyModels: StatusItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: `model_${i + 1}`,
    label: `Model ${i + 1}`,
    description: `Description for model ${i + 1}`,
    status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'inactive' : i % 4 === 2 ? 'maintenance' : 'pending',
  }))

  return (
    <HeaderStatusDropdown
      variant="model"
      value={selected}
      onValueChange={setSelected}
      items={manyModels}
      placeholder="Search 50 Models..."
      viewAllHref="/models"
      viewAllLabel="Full Model Library"
    />
  )
}

// ============================================================================
// Positioning Stories
// ============================================================================

const POSITIONS: DropdownPosition[] = [
  'auto',
  'bottom', 'bottom-start', 'bottom-end',
  'top', 'top-start', 'top-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
]

function PositioningGridStory() {
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <div className="grid grid-cols-3 gap-8 p-8 min-h-[600px] place-items-center">
      {/* Top row */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">top-start</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="top-start"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">top</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="top"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">top-end</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="top-end"
        />
      </div>

      {/* Middle row */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">left</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="left"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">auto (default)</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="auto"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">right</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="right"
        />
      </div>

      {/* Bottom row */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">bottom-start</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="bottom-start"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">bottom</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="bottom"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">bottom-end</span>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS.slice(0, 3)}
          placeholder="Model"
          position="bottom-end"
        />
      </div>
    </div>
  )
}

function PositionPlaygroundStory() {
  const [selected, setSelected] = React.useState<string | null>('ground_v1')
  const [position, setPosition] = React.useState<DropdownPosition>('bottom')
  const [offset, setOffset] = React.useState(4)
  const [collision, setCollision] = React.useState<'flip' | 'shift' | 'none'>('flip')

  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-[500px]">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as DropdownPosition)}
            className="px-2 py-1 text-xs bg-background border border-border rounded"
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Offset ({offset}px)</label>
          <input
            type="range"
            min={0}
            max={24}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Collision</label>
          <select
            value={collision}
            onChange={(e) => setCollision(e.target.value as 'flip' | 'shift' | 'none')}
            className="px-2 py-1 text-xs bg-background border border-border rounded"
          >
            <option value="flip">flip</option>
            <option value="shift">shift</option>
            <option value="none">none</option>
          </select>
        </div>
      </div>

      {/* Dropdown */}
      <div className="flex-1 flex items-center justify-center">
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS}
          placeholder="Select Model"
          position={position}
          offset={offset}
          collision={collision}
        />
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-md">
        Try different positions. The <code className="px-1 py-0.5 bg-muted rounded">collision</code> setting 
        determines behavior when the popup would overflow the viewport.
      </p>
    </div>
  )
}

function StickyPositionStory() {
  const [selected, setSelected] = React.useState<string | null>('ground_v1')

  return (
    <div className="h-[400px] overflow-auto border border-border rounded-lg">
      <div className="h-[800px] p-8 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Scroll down and open the dropdown. With <code className="px-1 py-0.5 bg-muted rounded">sticky=true</code>,
          the popup stays visible even when the trigger scrolls out of view.
        </p>
        <HeaderStatusDropdown
          variant="model"
          value={selected}
          onValueChange={setSelected}
          items={MODEL_ITEMS}
          placeholder="Sticky Dropdown"
          sticky
        />
        <div className="h-[600px] flex items-center justify-center text-muted-foreground/50">
          ↓ Scroll down to test sticky behavior ↓
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Meta Configuration
// ============================================================================

/**
 * HeaderStatusDropdown - A recipe component for header status selection.
 *
 * Built on Base UI's Combobox, this provides:
 * - Searchable dropdown with keyboard navigation
 * - Model or Workspace variants with appropriate icons
 * - Support for grouped items
 * - Status badges (active, inactive, maintenance, pending)
 * - Optional favorites toggle
 * - Loading and disabled states
 *
 * This is a "recipe" - a pre-composed pattern using Base UI primitives
 * with SKYNET styling applied.
 */
const meta: Meta<typeof HeaderStatusDropdown> = {
  title: 'Recipes/HeaderStatusDropdown',
  component: HeaderStatusDropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A searchable dropdown recipe built on Base UI Combobox. Use for selecting models, workspaces, or other status-based items in the header. Includes search filtering, grouping, status badges, favorites, and flexible positioning.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['model', 'workspace'],
      description: 'Visual variant - changes icon and accent color',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when nothing is selected',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading state on trigger',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dropdown',
    },
    showFavorites: {
      control: 'boolean',
      description: 'Shows favorite toggle on each item',
    },
    viewAllLabel: {
      control: 'text',
      description: 'Label for the footer link',
    },
    // Positioning
    position: {
      control: 'select',
      options: [
        'auto', 'bottom', 'bottom-start', 'bottom-end',
        'top', 'top-start', 'top-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end',
      ],
      description: 'Position of popup relative to trigger',
    },
    offset: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Distance from trigger in pixels',
    },
    collision: {
      control: 'select',
      options: ['flip', 'shift', 'none'],
      description: 'How to handle viewport collisions',
    },
    sticky: {
      control: 'boolean',
      description: 'Keep popup visible when trigger scrolls out of view',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Stories
// ============================================================================

/**
 * Model variant with flat list of items.
 */
export const ModelDropdown: Story = {
  render: () => <ModelDropdownStory />,
}

/**
 * Workspace variant with emerald accent.
 */
export const WorkspaceDropdown: Story = {
  render: () => <WorkspaceDropdownStory />,
}

/**
 * Grouped items with section headers.
 */
export const GroupedModels: Story = {
  render: () => <GroupedModelsStory />,
}

/**
 * With favorite toggle on each item.
 */
export const WithFavorites: Story = {
  render: () => <WithFavoritesStory />,
}

/**
 * Loading state.
 */
export const Loading: Story = {
  render: () => <LoadingStory />,
}

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => <DisabledStory />,
}

/**
 * Both dropdowns side-by-side as they would appear in a header.
 */
export const HeaderBar: Story = {
  render: () => <HeaderBarStory />,
  parameters: {
    layout: 'padded',
  },
}

/**
 * Performance test with 50 items - search to filter.
 */
export const LargeDataset: Story = {
  render: () => <LargeDatasetStory />,
}

/**
 * Grid showing all position options.
 */
export const PositioningGrid: Story = {
  render: () => <PositioningGridStory />,
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Interactive playground for testing position, offset, and collision settings.
 */
export const PositionPlayground: Story = {
  render: () => <PositionPlaygroundStory />,
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Demonstrates sticky positioning behavior.
 */
export const StickyPosition: Story = {
  render: () => <StickyPositionStory />,
  parameters: {
    layout: 'padded',
  },
}

