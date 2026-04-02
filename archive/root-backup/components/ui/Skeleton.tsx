import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-5 w-5" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  )
}

export function CommentSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-64" />
          <div className="flex space-x-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <Skeleton className="h-6 w-16 mb-4" />
        <div className="flex items-center space-x-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      {/* Form Fields Section */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-4">
            {[...Array(2)].map((_, j) => (
              <div key={j}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  )
}