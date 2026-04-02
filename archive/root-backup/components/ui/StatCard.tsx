import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: number
  label: string
  ariaLabel: string
  icon: ReactNode
  className?: string
}

export function StatCard({ value, label, ariaLabel, icon, className }: StatCardProps) {
  return (
    <article 
      className={cn(
        "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p 
            className="text-2xl font-semibold text-gray-900 dark:text-gray-100" 
            aria-label={ariaLabel}
          >
            {value.toLocaleString('zh-CN')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <div aria-hidden="true">
          {icon}
        </div>
      </div>
    </article>
  )
}