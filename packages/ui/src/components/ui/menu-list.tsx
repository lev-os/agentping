"use client";

/**
 * @kingly/ui - MenuList Component
 *
 * Accessible list of menu items with keyboard navigation.
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  destructive?: boolean;
}

export interface MenuListProps {
  /** Menu items to display */
  items: MenuItem[];
  /** Currently selected item ID */
  selectedId?: string;
  /** Callback when item is selected */
  onSelect: (itemId: string) => void;
  /** Custom class for container */
  className?: string;
  /** Accessible label for the menu */
  "aria-label"?: string;
}

const MenuList = React.forwardRef<HTMLUListElement, MenuListProps>(
  ({ items, selectedId, onSelect, className, ...props }, ref) => {
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const enabledItems = items.filter((item) => !item.disabled);
      if (enabledItems.length === 0) return;

      const currentEnabledIndex = enabledItems.findIndex(
        (_, i) => items.indexOf(enabledItems[i]) === focusedIndex
      );

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = (currentEnabledIndex + 1) % enabledItems.length;
          const nextItemIndex = items.indexOf(enabledItems[nextIndex]);
          setFocusedIndex(nextItemIndex);
          itemRefs.current[nextItemIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            currentEnabledIndex <= 0
              ? enabledItems.length - 1
              : currentEnabledIndex - 1;
          const prevItemIndex = items.indexOf(enabledItems[prevIndex]);
          setFocusedIndex(prevItemIndex);
          itemRefs.current[prevItemIndex]?.focus();
          break;
        }
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && !items[focusedIndex].disabled) {
            onSelect(items[focusedIndex].id);
          }
          break;
      }
    };

    return (
      <ul
        ref={ref}
        role="menu"
        className={cn("flex flex-col py-1", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {items.map((item, index) => {
          const isSelected = item.id === selectedId;
          return (
            <li
              key={item.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
              aria-disabled={item.disabled}
              aria-current={isSelected ? "true" : undefined}
              onClick={() => !item.disabled && onSelect(item.id)}
              onFocus={() => setFocusedIndex(index)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors",
                "focus:outline-none focus:bg-muted/50",
                isSelected && "bg-primary/10 text-primary",
                !isSelected && "hover:bg-muted/50",
                item.disabled && "opacity-50 cursor-not-allowed",
                item.destructive && "text-destructive hover:bg-destructive/10"
              )}
            >
              {item.icon && (
                <span className="flex-shrink-0 w-4 h-4">{item.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
);
MenuList.displayName = "MenuList";

export { MenuList };
