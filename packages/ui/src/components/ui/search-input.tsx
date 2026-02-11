"use client";

/**
 * @kingly/ui - SearchInput Component
 *
 * Input field with search icon, clear button, and loading state.
 */

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Current search value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Custom class for container */
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      isLoading = false,
      placeholder = "Search...",
      containerClassName,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      onChange("");
    };

    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        {isLoading ? (
          <Loader2 className="absolute left-3 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        )}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            "h-9 w-full rounded-md border border-border bg-background pl-9 pr-9",
            "text-sm placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors",
            className
          )}
          aria-label={props["aria-label"] || placeholder}
          {...props}
        />
        {value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 p-1 hover:bg-muted rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
