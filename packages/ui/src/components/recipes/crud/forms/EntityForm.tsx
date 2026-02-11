"use client"

import * as React from 'react'
import { useCrudContext } from '../context'
import { FieldRenderer } from './FieldRenderer'

interface EntityFormProps {
  initialData?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  onCancel?: () => void
}

export function EntityForm({ initialData, onSubmit, onCancel: _onCancel }: EntityFormProps) {
  const { config } = useCrudContext()
  const [formData, setFormData] = React.useState<Record<string, unknown>>(
    initialData || {}
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [_isSubmitting, setIsSubmitting] = React.useState(false)

  const fields = config.fields || []

  const handleChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      if (field.required && !formData[String(field.key)]) {
        newErrors[String(field.key)] = `${field.label} is required`
      }

      if (field.validation) {
        const error = field.validation(formData[String(field.key)])
        if (error) {
          newErrors[String(field.key)] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (err) {
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form id="entity-form" onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <FieldRenderer
          key={String(field.key)}
          field={field}
          value={formData[String(field.key)]}
          onChange={(value) => handleChange(String(field.key), value)}
          error={errors[String(field.key)]}
        />
      ))}
    </form>
  )
}
