/**
 * @kingly/ui - Class Name Utility
 *
 * cn() combines clsx and tailwind-merge for clean className composition.
 * This is the core utility used by all SKYNET design system components.
 *
 * @example
 * ```tsx
 * import { cn } from "@kingly/ui/lib";
 *
 * // Merge and dedupe Tailwind classes
 * cn("px-4 py-2", "px-6") // => "py-2 px-6"
 *
 * // Conditional classes
 * cn("base", isActive && "active", variant === "primary" && "text-primary")
 * ```
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
