/**
 * Accessible Form Example
 * 
 * This file demonstrates how to use the new form components
 * with proper WCAG 2.1 AA compliance.
 * 
 * @see /docs/testing/ada-audit-report.md for full accessibility guidelines
 */

import * as React from "react";
import {
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
  Input,
  Textarea,
  Checkbox,
  Button,
} from "@kingly/ui/components";

interface FormData {
  modelName: string;
  description: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  modelName?: string;
  description?: string;
  agreeToTerms?: string;
}

export function AccessibleFormExample() {
  const [formData, setFormData] = React.useState<FormData>({
    modelName: "",
    description: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = React.useState<string | null>(null);

  // Generate unique IDs for proper ARIA associations
  const modelNameId = React.useId();
  const descriptionId = React.useId();
  const agreeToTermsId = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: FormErrors = {};
    
    if (!formData.modelName.trim()) {
      newErrors.modelName = "Model name is required";
    } else if (formData.modelName.length < 3) {
      newErrors.modelName = "Model name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Success
      setSubmitStatus("Model created successfully!");
      console.log("Form submitted:", formData);

      // Clear form after 2 seconds
      setTimeout(() => {
        setFormData({
          modelName: "",
          description: "",
          agreeToTerms: false,
        });
        setSubmitStatus(null);
      }, 2000);
    } else {
      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(
        firstErrorField === "modelName"
          ? modelNameId
          : firstErrorField === "description"
            ? descriptionId
            : agreeToTermsId
      );
      errorElement?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {/* Model Name Field */}
      <FormField>
        <FormLabel htmlFor={modelNameId} required>
          Model Name
        </FormLabel>
        <FormDescription id={`${modelNameId}-description`}>
          Choose a unique name for your AI model (3-50 characters)
        </FormDescription>
        <Input
          id={modelNameId}
          type="text"
          value={formData.modelName}
          onChange={(e) =>
            setFormData({ ...formData, modelName: e.target.value })
          }
          aria-describedby={
            errors.modelName
              ? `${modelNameId}-error`
              : `${modelNameId}-description`
          }
          aria-invalid={!!errors.modelName}
          aria-required="true"
          error={!!errors.modelName}
          placeholder="e.g., ground_v1"
          maxLength={50}
        />
        <FormMessage id={`${modelNameId}-error`} error>
          {errors.modelName}
        </FormMessage>
      </FormField>

      {/* Description Field */}
      <FormField>
        <FormLabel htmlFor={descriptionId} required>
          Description
        </FormLabel>
        <FormDescription id={`${descriptionId}-description`}>
          Describe the purpose and capabilities of this model
        </FormDescription>
        <Textarea
          id={descriptionId}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          aria-describedby={
            errors.description
              ? `${descriptionId}-error`
              : `${descriptionId}-description`
          }
          aria-invalid={!!errors.description}
          aria-required="true"
          error={!!errors.description}
          placeholder="This model handles taxi operations including engine start, pre-takeoff checks..."
          rows={4}
          maxLength={500}
        />
        <FormMessage id={`${descriptionId}-error`} error>
          {errors.description}
        </FormMessage>
        <FormDescription className="text-right">
          {formData.description.length}/500
        </FormDescription>
      </FormField>

      {/* Checkbox Field */}
      <FormField className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox
          id={agreeToTermsId}
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, agreeToTerms: checked === true })
          }
          aria-describedby={`${agreeToTermsId}-label ${agreeToTermsId}-error`}
          aria-invalid={!!errors.agreeToTerms}
          aria-required="true"
        />
        <div className="grid gap-1.5 leading-none">
          <FormLabel
            htmlFor={agreeToTermsId}
            id={`${agreeToTermsId}-label`}
            className="text-sm font-normal cursor-pointer"
            required
          >
            I agree to the training parameters and understand model behavior may
            vary
          </FormLabel>
          <FormMessage id={`${agreeToTermsId}-error`} error>
            {errors.agreeToTerms}
          </FormMessage>
        </div>
      </FormField>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <Button type="submit">Create Model</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              modelName: "",
              description: "",
              agreeToTerms: false,
            });
            setErrors({});
            setSubmitStatus(null);
          }}
        >
          Reset
        </Button>
      </div>

      {/* Success Message - Live Region */}
      {submitStatus && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-green-400 p-3 border border-green-500/50 bg-green-500/10 rounded"
        >
          {submitStatus}
        </div>
      )}
    </form>
  );
}

/**
 * ACCESSIBILITY FEATURES DEMONSTRATED:
 * 
 * ✅ Proper label associations (htmlFor + id)
 * ✅ Required field indicators (visual * and aria-required)
 * ✅ Error messages with aria-describedby and role="alert"
 * ✅ Help text with aria-describedby
 * ✅ aria-invalid for error states
 * ✅ Focus management (first error field focused)
 * ✅ Live region for success messages (aria-live="polite")
 * ✅ Character count for textarea
 * ✅ Proper checkbox + label association
 * ✅ Form validation with clear error messages
 * ✅ Keyboard accessible (all inputs/buttons reachable via Tab)
 * 
 * WCAG 2.1 COMPLIANCE:
 * - 1.3.1 Info and Relationships (Level A) ✅
 * - 3.3.1 Error Identification (Level A) ✅
 * - 3.3.2 Labels or Instructions (Level A) ✅
 * - 3.3.3 Error Suggestion (Level AA) ✅
 * - 4.1.2 Name, Role, Value (Level A) ✅
 * - 4.1.3 Status Messages (Level AA) ✅
 */

