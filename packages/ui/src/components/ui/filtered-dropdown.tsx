'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, X, ArrowRight, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface FilteredDropdownTab {
  id: string
  label: string
  icon?: React.ReactNode
}

export interface FilteredDropdownProps {
  /** Presentation variant: dropdown positions below trigger, overlay centers on screen */
  variant: 'dropdown' | 'overlay'
  /** Tab configuration for switching between content types */
  tabs: FilteredDropdownTab[]
  /** Currently active tab ID */
  activeTab: string
  /** Callback when tab changes */
  onTabChange: (tab: string) => void
  /** Placeholder text for search input */
  searchPlaceholder?: string
  /** Current search value */
  searchValue: string
  /** Callback when search value changes */
  onSearchChange: (value: string) => void
  /** List content to render (items) */
  children: React.ReactNode
  /** Link href for "View All" action */
  viewAllHref?: string
  /** Label for "View All" action */
  viewAllLabel?: string
  /** Callback for "Add" action */
  onAddClick?: () => void
  /** Label for "Add" action */
  addLabel?: string
  /** Trigger button label */
  triggerLabel: string
  /** Trigger button icon */
  triggerIcon?: React.ReactNode
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Additional className for trigger */
  triggerClassName?: string
  /** Additional className for panel */
  panelClassName?: string
  /** Loading state */
  isLoading?: boolean
  /** Header content (right side) */
  headerExtra?: React.ReactNode
  /** Empty state content */
  emptyState?: React.ReactNode
  /** Whether to show search input */
  showSearch?: boolean
}

// ============================================================================
// Sub-components
// ============================================================================

interface PillTabsProps {
  tabs: FilteredDropdownTab[]
  activeTab: string
  onTabChange: (tab: string) => void
}

function PillTabs({ tabs, activeTab, onTabChange }: PillTabsProps) {
  return (
    <div className='flex items-center gap-0.5 p-0.5 bg-muted/30 rounded border border-border/30' role='tablist'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role='tab'
          aria-selected={activeTab === tab.id}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-sm',
            'font-mono text-[10px] font-medium uppercase tracking-wider',
            'transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50',
            activeTab === tab.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

/** Vertical stacked tabs for dropdown variant (sidebar context) */
interface StackedTabsProps {
  tabs: FilteredDropdownTab[]
  activeTab: string
  onTabChange: (tab: string) => void
}

function StackedTabs({ tabs, activeTab, onTabChange }: StackedTabsProps) {
  return (
    <div className='flex flex-col w-full' role='tablist'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role='tab'
          aria-selected={activeTab === tab.id}
          className={cn(
            'flex items-center gap-2 px-3 py-2.5 w-full text-left',
            'font-mono text-[11px] font-medium tracking-wide',
            'transition-all duration-150 border-l-2',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-inset',
            activeTab === tab.id
              ? 'bg-primary/10 border-l-primary text-foreground'
              : 'border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
          )}
        >
          <span className={cn('shrink-0', activeTab === tab.id ? 'text-primary' : 'text-muted-foreground')}>{tab.icon}</span>
          <span className='uppercase'>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

interface FilterInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}

function FilterInput({ value, onChange, placeholder, inputRef }: FilterInputProps) {
  return (
    <div className='relative'>
      <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50' aria-hidden='true' />
      <input
        ref={inputRef}
        type='text'
        placeholder={placeholder || 'Filter...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder || 'Filter items'}
        className={cn(
          'w-full h-7 pl-7 pr-7 rounded',
          'bg-background/50 border border-border/40',
          'font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40',
          'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50',
          'transition-all duration-150'
        )}
      />
      {value && (
        <button
          type='button'
          onClick={() => onChange('')}
          className='absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded transition-colors'
          title='Clear filter'
          aria-label='Clear filter'
        >
          <X className='w-3 h-3 text-muted-foreground/50 hover:text-foreground' />
        </button>
      )}
    </div>
  )
}

interface ActionFooterProps {
  viewAllHref?: string
  viewAllLabel?: string
  onAddClick?: () => void
  addLabel?: string
  onClose?: () => void
  /** When true, shows more prominent styling for empty state */
  isEmpty?: boolean
}

function ActionFooter({ viewAllHref, viewAllLabel, onAddClick, addLabel, onClose, isEmpty }: ActionFooterProps) {
  if (!viewAllHref && !onAddClick) return null

  return (
    <div
      className={cn('flex items-center justify-between border-t border-border/50 px-3', isEmpty ? 'py-3 bg-muted/10' : 'py-2')}
    >
      {viewAllHref ? (
        <a
          href={viewAllHref}
          onClick={onClose}
          className={cn(
            'flex items-center gap-1.5 transition-colors',
            isEmpty ? 'text-sm font-medium text-primary hover:text-primary/80' : 'text-xs text-primary hover:text-primary/80'
          )}
        >
          <span>{viewAllLabel || 'View All'}</span>
          <ArrowRight className={cn(isEmpty ? 'w-3.5 h-3.5' : 'w-3 h-3')} />
        </a>
      ) : (
        <div />
      )}
      {onAddClick && (
        <button
          onClick={() => {
            onAddClick()
            onClose?.()
          }}
          className={cn(
            'flex items-center gap-1 rounded transition-colors',
            isEmpty
              ? 'px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20'
              : 'px-2 py-1 text-xs text-primary hover:bg-primary/10'
          )}
        >
          <Plus className={cn(isEmpty ? 'w-3.5 h-3.5' : 'w-3 h-3')} />
          <span>{addLabel || 'Add'}</span>
        </button>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export const FilteredDropdown = React.forwardRef<HTMLDivElement, FilteredDropdownProps>(
  (
    {
      variant,
      tabs,
      activeTab,
      onTabChange,
      searchPlaceholder,
      searchValue,
      onSearchChange,
      children,
      viewAllHref,
      viewAllLabel,
      onAddClick,
      addLabel,
      triggerLabel,
      triggerIcon,
      open,
      onOpenChange,
      triggerClassName,
      panelClassName,
      isLoading,
      headerExtra,
      emptyState,
      showSearch = true,
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    // Use controlled or uncontrolled state
    const isOpen = open !== undefined ? open : internalOpen
    const setIsOpen = React.useCallback(
      (value: boolean) => {
        if (open === undefined) {
          setInternalOpen(value)
        }
        onOpenChange?.(value)
      },
      [open, onOpenChange]
    )

    // Close on outside click
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, setIsOpen])

    // Close on escape key
    React.useEffect(() => {
      function handleEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen, setIsOpen])

    // Focus search input when opening
    React.useEffect(() => {
      if (isOpen && showSearch && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
    }, [isOpen, showSearch])

    // Clear search when closing
    React.useEffect(() => {
      if (!isOpen && searchValue) {
        onSearchChange?.('')
      }
    }, [isOpen, onSearchChange, searchValue])

    const handleClose = () => {
      setIsOpen(false)
    }

    // Variant-specific styles
    const isOverlay = variant === 'overlay'
    const isDropdown = variant === 'dropdown'

    // Overlay panel: QuickSearch-style centered modal (like CommandPalette)
    const overlayPanelStyles = cn(
      'flex flex-col overflow-hidden z-[9999]',
      // Solid dark background with subtle border
      'bg-card border border-border/50 rounded-xl shadow-2xl',
      // Centered modal positioning (consistent across all breakpoints)
      'fixed top-[15vh] left-1/2 -translate-x-1/2',
      'w-full max-w-[560px]',
      'max-h-[70vh] min-h-[300px]',
      // Animation
      'animate-in fade-in-0 zoom-in-95',
      panelClassName
    )

    // Dropdown panel: side nav layout positioned next to trigger
    const dropdownPanelStyles = cn(
      'flex bg-card border border-border rounded-lg shadow-xl overflow-hidden',
      'absolute top-full left-0 mt-1 z-50',
      'min-w-[340px] max-h-[420px]',
      'animate-in fade-in-0 slide-in-from-top-2',
      panelClassName
    )

    // Render overlay layout (centered modal, pill tabs at top)
    const renderOverlayPanel = () => (
      <div className={overlayPanelStyles} role='dialog' aria-modal='true' aria-label={triggerLabel}>
        {/* Header with Pill Tabs */}
        <div className='flex items-center justify-between px-3 py-2.5 border-b border-border/50 bg-muted/20'>
          <PillTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          {headerExtra}
        </div>

        {/* Search Input */}
        {showSearch && (
          <div className='px-3 py-2 border-b border-border/30'>
            <FilterInput
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              inputRef={searchInputRef}
            />
          </div>
        )}

        {/* List Content */}
        <div className='flex-1 overflow-y-auto' role='listbox'>
          {React.Children.count(children) > 0 ? children : emptyState}
        </div>

        {/* Action Footer */}
        <ActionFooter
          viewAllHref={viewAllHref}
          viewAllLabel={viewAllLabel}
          onAddClick={onAddClick}
          addLabel={addLabel}
          onClose={handleClose}
          isEmpty={React.Children.count(children) === 0}
        />
      </div>
    )

    // Render dropdown layout (side nav + content)
    const renderDropdownPanel = () => (
      <div className={dropdownPanelStyles}>
        {/* Left: Stacked Tab Navigation */}
        <div className='w-[110px] shrink-0 border-r border-border/50 bg-muted/10 flex flex-col'>
          <StackedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          {/* Spacer */}
          <div className='flex-1' />
          {/* Footer action in nav area */}
          {headerExtra && <div className='p-2 border-t border-border/30'>{headerExtra}</div>}
        </div>

        {/* Right: Search + Content Area */}
        <div className='flex-1 flex flex-col min-w-0'>
          {/* Search Input */}
          {showSearch && (
            <div className='px-3 py-2 border-b border-border/30'>
              <FilterInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                inputRef={searchInputRef}
              />
            </div>
          )}

          {/* List Content */}
          <div className='flex-1 overflow-y-auto' role='listbox'>
            {React.Children.count(children) > 0 ? children : emptyState}
          </div>

          {/* Action Footer */}
          <ActionFooter
            viewAllHref={viewAllHref}
            viewAllLabel={viewAllLabel}
            onAddClick={onAddClick}
            addLabel={addLabel}
            onClose={handleClose}
            isEmpty={React.Children.count(children) === 0}
          />
        </div>
      </div>
    )

    // For overlay variant, use portal to escape parent stacking context
    const overlayContent =
      isOpen && isOverlay && typeof document !== 'undefined'
        ? createPortal(
            <>
              {/* Backdrop */}
              <div className='fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-in fade-in-0' onClick={handleClose} />
              {/* Panel */}
              {renderOverlayPanel()}
            </>,
            document.body
          )
        : null

    return (
      <div ref={containerRef} className='relative'>
        {/* Trigger Button */}
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded',
            'border border-border/50 bg-muted/20 hover:bg-muted/40',
            'font-mono text-[11px] font-medium tracking-tight transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isOpen && 'ring-1 ring-primary/50 bg-muted/40',
            triggerClassName
          )}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
        >
          {triggerIcon}
          <span className='text-foreground max-w-[100px] truncate'>{isLoading ? '...' : triggerLabel}</span>
          <ChevronDown
            className={cn('w-3 h-3 text-muted-foreground transition-transform duration-150', isOpen && 'rotate-180')}
            aria-hidden='true'
          />
        </button>

        {/* Overlay variant - rendered via portal */}
        {overlayContent}

        {/* Dropdown variant - rendered inline */}
        {isOpen && isDropdown && renderDropdownPanel()}
      </div>
    )
  }
)

FilteredDropdown.displayName = 'FilteredDropdown'

// ============================================================================
// List Item Component (Convenience Export)
// ============================================================================

export interface FilteredDropdownItemProps {
  /** Icon to display */
  icon?: React.ReactNode
  /** Primary label */
  label: string
  /** Secondary description */
  description?: string
  /** Whether this item is selected */
  selected?: boolean
  /** Click handler */
  onClick?: () => void
  /** Badge content (e.g., "ACTIVE") */
  badge?: React.ReactNode
  /** Right-side action (e.g., favorite button) */
  action?: React.ReactNode
  /** Additional className */
  className?: string
}

export function FilteredDropdownItem({
  icon,
  label,
  description,
  selected,
  onClick,
  badge,
  action,
  className,
}: FilteredDropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2.5',
        'transition-colors duration-150 text-left',
        selected ? 'bg-primary/10' : 'hover:bg-muted/30',
        className
      )}
    >
      {icon && <span className='shrink-0'>{icon}</span>}
      <div className='flex-1 min-w-0'>
        <div className={cn('text-sm truncate', selected ? 'font-semibold text-primary' : 'font-normal text-muted-foreground')}>
          {label}
        </div>
        {description && <div className='text-[10px] text-muted-foreground/70 truncate'>{description}</div>}
      </div>
      {badge && <span className='shrink-0'>{badge}</span>}
      {action && <span className='shrink-0'>{action}</span>}
      {selected && !action && <ArrowRight className='w-3.5 h-3.5 text-primary shrink-0' />}
    </button>
  )
}

FilteredDropdownItem.displayName = 'FilteredDropdownItem'

export default FilteredDropdown
