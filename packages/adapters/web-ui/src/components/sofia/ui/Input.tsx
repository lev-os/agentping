import * as React from "react";
import { cn } from "../../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Indicates if the input has an error state.
   * Automatically sets aria-invalid to true.
   */
  error?: boolean;
  /**
   * Indicates whether the input value is invalid.
   * Can be set explicitly or automatically via the error prop.
   */
  "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
  /**
   * ID of element(s) that describe the input (e.g., error message).
   * Use this to link error messages for screen readers.
   */
  "aria-describedby"?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const isInvalid = error || props["aria-invalid"];

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
          isInvalid && "border-2 border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        aria-invalid={isInvalid}
        aria-describedby={props["aria-describedby"]}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

