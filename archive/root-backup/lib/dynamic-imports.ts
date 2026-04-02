import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Loading component for dynamic imports
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
)

// Helper function to create dynamic imports with consistent loading behavior
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | T>,
  options?: {
    loading?: ComponentType
    ssr?: boolean
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || LoadingSpinner,
    ssr: options?.ssr ?? true,
  })
}

// Pre-configured dynamic imports for heavy components
export const DynamicVirtualList = createDynamicComponent(
  () => import('@tanstack/react-virtual').then(mod => mod.useVirtualizer as any),
  { ssr: false }
)

// Dynamic import for non-critical UI components
export const DynamicLoginModal = createDynamicComponent(
  () => import('@/components/auth/LoginModal'),
  { ssr: false }
)

// Bundle optimization: Import heavy libraries only when needed
export const importChartLibrary = () => import('recharts')
export const importDateLibrary = () => import('date-fns')
export const importMarkdownLibrary = () => import('react-markdown')