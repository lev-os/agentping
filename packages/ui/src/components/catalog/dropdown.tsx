"use client";

/**
 * Dropdown — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/ui/Dropdown.tsx
 * @catalog-status complete
 * @category ui-primitive
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  /** Currently selected value */
  value?: string;
  /** Available options */
  options: DropdownOption[];
  /** Selection change handler */
  onChange: (value: string) => void;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function Dropdown({
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const opt = options[highlightedIndex];
            if (!opt.disabled) {
              onChange(opt.value);
              setIsOpen(false);
            }
          } else {
            setIsOpen(true);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1,
            );
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, onChange],
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block w-full", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center justify-between w-full",
          "px-3 py-2 rounded-lg",
          "bg-zinc-800/50 border border-zinc-700/50",
          "text-sm text-zinc-200",
          "transition-colors duration-150",
          "hover:border-zinc-600/50",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-cyan-500/30",
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={cn(!selectedOption && "text-zinc-500")}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-zinc-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className={cn(
            "absolute z-50 w-full mt-1",
            "bg-zinc-900 border border-zinc-700/50 rounded-lg",
            "shadow-xl shadow-black/30",
            "max-h-60 overflow-y-auto",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer",
                "transition-colors duration-100",
                option.value === value
                  ? "text-cyan-400"
                  : "text-zinc-300",
                index === highlightedIndex && "bg-white/5",
                !option.disabled && "hover:bg-white/5",
                option.disabled && "opacity-40 cursor-not-allowed",
              )}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.icon && (
                <span className="flex-shrink-0">{option.icon}</span>
              )}
              <span className="flex-1">{option.label}</span>
              {option.value === value && (
                <Check size={14} className="text-cyan-400 flex-shrink-0" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
