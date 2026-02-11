import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    const isInvalid = error || props["aria-invalid"];
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "resize-y",
          isInvalid && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        aria-invalid={isInvalid}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

