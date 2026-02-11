"use client";

import * as React from "react";
import { Label } from "./label";
import { cn } from "../../lib/utils";

/**
 * Accessible form field wrapper component
 * Handles label, input, error, and help text associations
 */

interface FormFieldContextValue {
  inputId: string;
  messageId: string;
  descriptionId: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

const useFormFieldContext = () => {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error("Form components must be used within FormField");
  }
  return context;
};

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, className }, ref) => {
    const inputId = React.useId();
    const messageId = React.useId();
    const descriptionId = React.useId();

    return (
      <FormFieldContext.Provider value={{ inputId, messageId, descriptionId }}>
        <div ref={ref} className={cn("space-y-2", className)}>
          {children}
        </div>
      </FormFieldContext.Provider>
    );
  }
);
FormField.displayName = "FormField";

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  required?: boolean;
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FormLabelProps
>(({ className, required, children, ...props }, ref) => {
  const { inputId } = useFormFieldContext();

  return (
    <Label ref={ref} htmlFor={inputId} className={cn(className)} {...props}>
      {children}
      {required && (
        <span className="text-red-400 ml-1" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  );
});
FormLabel.displayName = "FormLabel";

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, error, children, ...props }, ref) => {
    const { messageId } = useFormFieldContext();

    if (!children) return null;

    return (
      <p
        ref={ref}
        id={messageId}
        className={cn(
          "text-xs",
          error ? "text-red-400" : "text-muted-foreground",
          className
        )}
        role={error ? "alert" : undefined}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  const { descriptionId } = useFormFieldContext();

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

/**
 * Hook to access form field IDs for proper ARIA associations
 * Use this in custom form inputs to connect them to labels and error messages
 *
 * @example
 * const { inputId, messageId, descriptionId } = useFormField();
 * return (
 *   <input
 *     id={inputId}
 *     aria-describedby={`${descriptionId} ${messageId}`}
 *     aria-invalid={hasError}
 *     aria-required={isRequired}
 *   />
 * );
 */
const useFormField = () => {
  return useFormFieldContext();
};

export {
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
  useFormField,
  type FormFieldContextValue,
  type FormFieldProps
};
