'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

// Live region for announcing dynamic content changes
interface LiveRegionProps {
  children: React.ReactNode
  mode?: 'polite' | 'assertive'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all' | string
  className?: string
}

export function LiveRegion({
  children,
  mode = 'polite',
  atomic = true,
  relevant = 'additions text',
  className
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={mode}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  )
}

// Alert component for important messages
interface AlertProps {
  children: React.ReactNode
  type?: 'info' | 'success' | 'warning' | 'error'
  live?: boolean
  className?: string
}

export function Alert({
  children,
  type = 'info',
  live = true,
  className
}: AlertProps) {
  const typeStyles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  }

  return (
    <div
      role="alert"
      aria-live={live ? 'assertive' : undefined}
      className={cn(
        'p-4 rounded-md border',
        typeStyles[type],
        className
      )}
    >
      {children}
    </div>
  )
}

// Form field wrapper with proper labeling
interface FormFieldProps {
  label: string
  children: React.ReactElement
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

export function FormField({
  label,
  children,
  error,
  hint,
  required,
  className
}: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="必填">*</span>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
      
      {React.cloneElement(children, {
        id,
        'aria-describedby': [
          hint && hintId,
          error && errorId
        ].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? 'true' : undefined,
        'aria-required': required || undefined
      })}
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

// Progress indicator
interface ProgressProps {
  value: number
  max?: number
  label?: string
  className?: string
}

export function Progress({
  value,
  max = 100,
  label,
  className
}: ProgressProps) {
  const percentage = Math.round((value / max) * 100)
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700"
      >
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Tooltip with proper ARIA attributes
interface TooltipProps {
  content: string
  children: React.ReactElement
  className?: string
}

export function Tooltip({
  content,
  children,
  className
}: TooltipProps) {
  const id = useId()
  
  return (
    <>
      {React.cloneElement(children, {
        'aria-describedby': id
      })}
      <span
        id={id}
        role="tooltip"
        className={cn('sr-only', className)}
      >
        {content}
      </span>
    </>
  )
}

// Expandable/Collapsible section
interface ExpandableProps {
  trigger: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

export function Expandable({
  trigger,
  children,
  defaultExpanded = false,
  className
}: ExpandableProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const id = useId()
  
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        {trigger}
      </button>
      <div
        id={id}
        hidden={!expanded}
        className="mt-2"
      >
        {children}
      </div>
    </div>
  )
}