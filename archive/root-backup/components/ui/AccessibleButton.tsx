'use client'

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaPressed?: boolean | 'mixed'
  ariaExpanded?: boolean
  ariaControls?: string
  ariaHaspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 shadow-sm',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  link: 'text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 focus:ring-blue-500'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText = '加载中...',
    disabled,
    children,
    ariaLabel,
    ariaDescribedBy,
    ariaPressed,
    ariaExpanded,
    ariaControls,
    ariaHaspopup,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    type = 'button',
    ...props
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-describedby={ariaDescribedBy}
        aria-pressed={ariaPressed}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={ariaHaspopup}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <span className="sr-only">{loadingText}</span>
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span aria-hidden="true">{loadingText}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="mr-2 flex-shrink-0" aria-hidden="true">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="ml-2 flex-shrink-0" aria-hidden="true">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

// Icon Button variant
export const IconButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, size = 'md', children, ariaLabel, ...props }, ref) => {
    const iconSizeStyles = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3'
    }

    if (!ariaLabel && !props['aria-label']) {
      console.warn('IconButton should have an aria-label for accessibility')
    }

    return (
      <AccessibleButton
        ref={ref}
        className={cn(
          'rounded-full',
          iconSizeStyles[size],
          className
        )}
        size={size}
        ariaLabel={ariaLabel}
        {...props}
      >
        {children}
      </AccessibleButton>
    )
  }
)

IconButton.displayName = 'IconButton'

// Button Group component for grouping related actions
interface ButtonGroupProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function ButtonGroup({ children, orientation = 'horizontal', className }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2',
        className
      )}
    >
      {children}
    </div>
  )
}