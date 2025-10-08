import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'datetime-local' | 'time' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
}

interface FormProps<T = Record<string, any>> {
  title: string
  description: string
  fields: FormField[]
  formData: T
  errors: Record<string, string>
  onSubmit: (e: React.FormEvent) => void
  onFieldChange: (field: keyof T, value: any) => void
  onCancel: () => void
  submitText: string
  isLoading?: boolean
  disabled?: boolean
}

export function Form<T = Record<string, any>>({
  title,
  description,
  fields,
  formData,
  errors,
  onSubmit,
  onFieldChange,
  onCancel,
  submitText,
  isLoading = false,
  disabled = false
}: FormProps<T>) {
  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      value: (formData as any)[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        onFieldChange(field.name as keyof T, e.target.value),
      placeholder: field.placeholder,
      disabled: disabled || isLoading
    }

    switch (field.type) {
      case 'select':
        return (
          <Select 
            value={(formData as any)[field.name] || ''} 
            onValueChange={(value) => onFieldChange(field.name as keyof T, value)}
            disabled={disabled || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={field.rows || 3}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
              onFieldChange(field.name as keyof T, e.target.value)}
          />
        )
      
      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onFieldChange(field.name as keyof T, e.target.value)}
          />
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div 
              key={field.name} 
              className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
            >
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-sm text-destructive">{errors[field.name]}</p>
              )}
            </div>
          ))}
          
          <div className="md:col-span-2 flex gap-2">
            <Button
              type="submit"
              disabled={disabled || isLoading}
            >
              {isLoading ? 'Saving...' : submitText}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
