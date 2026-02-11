"use client"

import * as React from 'react'
import { Input } from '../../../ui/input'
import { Textarea } from '../../../ui/textarea'
import { Label } from '../../../ui/label'
import type { FieldDef } from '../types'

interface FieldRendererProps<T> {
  field: FieldDef<T>
  value: unknown
  onChange: (value: unknown) => void
  error?: string | null
}

export function FieldRenderer<T extends Record<string, unknown>>({
  field,
  value,
  onChange,
  error,
}: FieldRendererProps<T>) {
  const fieldId = `field-${String(field.key)}`

  // Custom renderer takes precedence
  if (field.render) {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} className="text-xs font-display uppercase tracking-wider">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.render(value, onChange)}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  // Default renderers by type
  switch (field.type) {
    case 'textarea':
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId} className="text-xs font-display uppercase tracking-wider">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            id={fieldId}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            error={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
          />
          {error && (
            <p id={`${fieldId}-error`} className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      )

    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId} className="text-xs font-display uppercase tracking-wider">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={fieldId}
            type="number"
            value={(value as number) || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
            error={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
          />
          {error && (
            <p id={`${fieldId}-error`} className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      )

    case 'select':
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId} className="text-xs font-display uppercase tracking-wider">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <select
            id={fieldId}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {field.placeholder && (
              <option value="" disabled>
                {field.placeholder}
              </option>
            )}
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && (
            <p id={`${fieldId}-error`} className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      )

    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <input
            id={fieldId}
            type="checkbox"
            checked={(value as boolean) || false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <Label htmlFor={fieldId} className="text-xs font-display uppercase tracking-wider">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )

    case 'text':
    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId} className="text-xs font-display uppercase tracking-wider">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={fieldId}
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            error={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
          />
          {error && (
            <p id={`${fieldId}-error`} className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      )
  }
}

