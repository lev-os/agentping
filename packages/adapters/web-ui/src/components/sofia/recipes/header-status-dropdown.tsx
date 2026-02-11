'use client'

import * as React from 'react'
import { Combobox } from '@base-ui/react/combobox'
import { ChevronDown, Search, X, Check, Star, Package, FolderOpen } from 'lucide-react'
import { cn } from '../../lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface StatusItem {
  id: string
  label: string
  description?: string
  status?: 'active' | 'inactive' | 'maintenance' | 'pending'
  isFavorite?: boolean
}

export interface StatusGroup {
  id: string
  label: string
  items: StatusItem[]
}

/**
 * Position presets for the dropdown popup.
 * Maps to Floating UI's side + align combinations.
 */
export type DropdownPosition =
  | 'auto'           // Default: bottom-center with collision avoidance
  | 'bottom'         // Below trigger, centered
  | 'bottom-start'   // Below trigger, aligned to start (left in LTR)
  | 'bottom-end'     // Below trigger, aligned to end (right in LTR)
  | 'top'            // Above trigger, centered
  | 'top-start'      // Above trigger, aligned to start
  | 'top-end'        // Above trigger, aligned to end
  | 'left'           // Left of trigger, centered vertically
  | 'left-start'     // Left of trigger, aligned to top
  | 'left-end'       // Left of trigger, aligned to bottom
  | 'right'          // Right of trigger, centered vertically
  | 'right-start'    // Right of trigger, aligned to top
  | 'right-end'      // Right of trigger, aligned to bottom

/** Collision avoidance strategy */
export type CollisionStrategy = 'flip' | 'shift' | 'none'

export interface HeaderStatusDropdownProps {
  /** Variant determines the icon and styling */
  variant?: 'model' | 'workspace'
  /** Label shown on trigger when nothing selected */
  placeholder?: string
  /** Currently selected item ID */
  value?: string | null
  /** Callback when selection changes */
  onValueChange?: (value: string | null) => void
  /** Flat list of items (use this OR groups, not both) */
  items?: StatusItem[]
  /** Grouped items for categorized display */
  groups?: StatusGroup[]
  /** Loading state */
  isLoading?: boolean
  /** Disable the dropdown */
  disabled?: boolean
  /** Show favorite toggle on items */
  showFavorites?: boolean
  /** Callback when favorite is toggled */
  onToggleFavorite?: (itemId: string) => void
  /** Additional className for trigger */
  className?: string
  /** Link to view all (footer) */
  viewAllHref?: string
  viewAllLabel?: string
  
  // ========== Positioning Options ==========
  /** Position of the dropdown relative to trigger. @default 'auto' */
  position?: DropdownPosition
  /** Distance from trigger in pixels. @default 4 */
  offset?: number
  /** How to handle collisions with viewport edges. @default 'flip' */
  collision?: CollisionStrategy
  /** Keep popup in viewport when trigger scrolls out. @default false */
  sticky?: boolean
  /** Additional className for popup panel */
  popupClassName?: string
}

// ============================================================================
// Position Utilities
// ============================================================================

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

function parsePosition(position: DropdownPosition): { side: Side; align: Align } {
  switch (position) {
    case 'auto':
    case 'bottom':
      return { side: 'bottom', align: 'center' }
    case 'bottom-start':
      return { side: 'bottom', align: 'start' }
    case 'bottom-end':
      return { side: 'bottom', align: 'end' }
    case 'top':
      return { side: 'top', align: 'center' }
    case 'top-start':
      return { side: 'top', align: 'start' }
    case 'top-end':
      return { side: 'top', align: 'end' }
    case 'left':
      return { side: 'left', align: 'center' }
    case 'left-start':
      return { side: 'left', align: 'start' }
    case 'left-end':
      return { side: 'left', align: 'end' }
    case 'right':
      return { side: 'right', align: 'center' }
    case 'right-start':
      return { side: 'right', align: 'start' }
    case 'right-end':
      return { side: 'right', align: 'end' }
    default:
      return { side: 'bottom', align: 'center' }
  }
}

function getCollisionAvoidance(strategy: CollisionStrategy) {
  switch (strategy) {
    case 'flip':
      return { side: 'flip' as const, align: 'flip' as const }
    case 'shift':
      return { side: 'shift' as const, align: 'shift' as const }
    case 'none':
      return { side: 'none' as const, align: 'none' as const }
    default:
      return { side: 'flip' as const, align: 'flip' as const }
  }
}

// ============================================================================
// Status Badge Component
// ============================================================================

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/50',
  inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  pending: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
} as const

function StatusBadge({ status }: { status: StatusItem['status'] }) {
  if (!status) return null
  return (
    <span
      className={cn(
        'px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded border',
        statusColors[status]
      )}
    >
      {status === 'active' ? 'ACTIVE' : status.toUpperCase()}
    </span>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export const HeaderStatusDropdown = React.forwardRef<HTMLDivElement, HeaderStatusDropdownProps>(
  (
    {
      variant = 'model',
      placeholder,
      value,
      onValueChange,
      items = [],
      groups = [],
      isLoading = false,
      disabled = false,
      showFavorites = false,
      onToggleFavorite,
      className,
      viewAllHref,
      viewAllLabel = 'View All',
      // Positioning props
      position = 'auto',
      offset = 4,
      collision = 'flip',
      sticky = false,
      popupClassName,
    },
    ref
  ) => {
    // Parse position into side + align
    const { side, align } = parsePosition(position)
    const collisionAvoidance = getCollisionAvoidance(collision)
    // Flatten groups into items for the combobox
    const allItems = React.useMemo(() => {
      if (groups.length > 0) {
        const flattened: StatusItem[] = []
        for (const g of groups) {
          flattened.push(...g.items)
        }
        return flattened
      }
      return items
    }, [groups, items])

    // Find selected item
    const selectedItem = React.useMemo(() => {
      return allItems.find((item) => item.id === value)
    }, [allItems, value])

    // Icon based on variant
    const TriggerIcon = variant === 'workspace' ? FolderOpen : Package
    const iconColor = variant === 'workspace' ? 'text-emerald-400' : 'text-cyan-400'

    // Default placeholder
    const displayPlaceholder = placeholder || (variant === 'workspace' ? 'Select Workspace' : 'Select Model')

    return (
      <div ref={ref} className="relative">
        <Combobox.Root
          value={value}
          onValueChange={(newValue: unknown) => onValueChange?.(newValue as string | null)}
          disabled={disabled || isLoading}
        >
          {/* Trigger Button */}
          <Combobox.Trigger
            className={cn(
              'group flex items-center gap-1.5 px-2.5 py-1 rounded-md',
              'border border-border/50 bg-muted/30 hover:bg-muted/50',
              'text-xs font-mono transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'data-[popup-open]:ring-1 data-[popup-open]:ring-primary/50',
              className
            )}
          >
            <TriggerIcon className={cn('w-3.5 h-3.5', iconColor)} />
            <span className="text-foreground max-w-[100px] truncate">
              {isLoading ? '...' : (selectedItem?.label || displayPlaceholder)}
            </span>
            <Combobox.Icon>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180" />
            </Combobox.Icon>
          </Combobox.Trigger>

          {/* Popup Portal */}
          <Combobox.Portal>
            <Combobox.Positioner
              side={side}
              align={align}
              sideOffset={offset}
              sticky={sticky}
              collisionAvoidance={collisionAvoidance}
            >
              <Combobox.Popup
                className={cn(
                  'z-50 min-w-[260px] max-h-[400px] overflow-hidden',
                  'border border-border bg-card rounded-lg shadow-lg',
                  'animate-in fade-in-0 zoom-in-95',
                  'flex flex-col',
                  popupClassName
                )}
              >
                {/* Search Input */}
                <div className="sticky top-0 px-2 py-2 border-b border-border/30 bg-muted/20">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground/60" />
                    <Combobox.Input
                      className={cn(
                        'w-full h-8 pl-8 pr-7 rounded',
                        'bg-background border border-border/50',
                        'text-xs text-foreground placeholder:text-muted-foreground/50',
                        'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50',
                        'transition-colors'
                      )}
                      placeholder="Search..."
                    />
                    <Combobox.Clear className="absolute right-2 p-0.5 hover:bg-muted rounded transition-colors opacity-0 data-[dirty]:opacity-100">
                      <X className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-foreground" />
                    </Combobox.Clear>
                  </div>
                </div>

                {/* List Content */}
                <Combobox.List className="flex-1 overflow-y-auto py-1">
                  {/* Grouped Items */}
                  {groups.length > 0 ? (
                    groups.map((group) => (
                      <Combobox.Group key={group.id}>
                        <Combobox.GroupLabel
                          className={cn(
                            'px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider',
                            'text-muted-foreground bg-muted/30'
                          )}
                        >
                          {group.label} ({group.items.length})
                        </Combobox.GroupLabel>
                        {group.items.map((item) => (
                          <ItemRow
                            key={item.id}
                            item={item}
                            variant={variant}
                            showFavorites={showFavorites}
                            onToggleFavorite={onToggleFavorite}
                          />
                        ))}
                      </Combobox.Group>
                    ))
                  ) : (
                    // Flat Items
                    allItems.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        variant={variant}
                        showFavorites={showFavorites}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ))
                  )}

                  {/* Empty State */}
                  <Combobox.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No results found
                  </Combobox.Empty>
                </Combobox.List>

                {/* Footer Link */}
                {viewAllHref && (
                  <div className="border-t border-border/50 px-3 py-2">
                    <a
                      href={viewAllHref}
                      className="flex items-center justify-between text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>{viewAllLabel}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                  </div>
                )}
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    )
  }
)

HeaderStatusDropdown.displayName = 'HeaderStatusDropdown'

// ============================================================================
// Item Row Sub-component
// ============================================================================

interface ItemRowProps {
  item: StatusItem
  variant: 'model' | 'workspace'
  showFavorites?: boolean
  onToggleFavorite?: (itemId: string) => void
}

function ItemRow({ item, variant, showFavorites, onToggleFavorite }: ItemRowProps) {
  const Icon = variant === 'workspace' ? FolderOpen : Package
  const iconColor = variant === 'workspace' ? 'text-emerald-400' : 'text-cyan-400'

  return (
    <Combobox.Item
      value={item.id}
      className={cn(
        'group flex items-center gap-2.5 px-3 py-2.5',
        'transition-colors duration-150 text-left cursor-pointer',
        'hover:bg-muted/30 data-[highlighted]:bg-muted/30',
        'data-[selected]:bg-primary/10'
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 shrink-0',
          'text-muted-foreground/50',
          'group-data-[selected]:' + iconColor
        )}
      />
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'text-sm truncate block',
            'font-normal text-muted-foreground',
            'group-data-[selected]:font-semibold group-data-[selected]:text-primary'
          )}
        >
          {item.label}
        </span>
        {item.description && (
          <span className="text-[10px] text-muted-foreground/70 truncate block">
            {item.description}
          </span>
        )}
      </div>

      {/* Status Badge */}
      {item.status && <StatusBadge status={item.status} />}

      {/* Favorite Button */}
      {showFavorites && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.(item.id)
          }}
          className={cn(
            'p-0.5 rounded hover:bg-muted transition-colors shrink-0',
            item.isFavorite ? 'text-yellow-400' : 'text-muted-foreground/50 hover:text-yellow-400'
          )}
          title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={cn('w-3.5 h-3.5', item.isFavorite && 'fill-yellow-400')} />
        </button>
      )}

      {/* Selected Indicator */}
      <Combobox.ItemIndicator className="shrink-0">
        <Check className="w-3.5 h-3.5 text-primary" />
      </Combobox.ItemIndicator>
    </Combobox.Item>
  )
}

export default HeaderStatusDropdown
