'use client'

import { cn } from '@/lib/utils'

interface SkipToContentProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

export function SkipToContent({ 
  href = '#main-content', 
  children = '跳转到主要内容',
  className 
}: SkipToContentProps) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'bg-blue-600 text-white px-4 py-2 rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </a>
  )
}

// Skip links component for multiple targets
interface SkipLinksProps {
  links?: Array<{
    href: string
    label: string
  }>
  className?: string
}

export function SkipLinks({ 
  links = [
    { href: '#main-content', label: '跳转到主要内容' },
    { href: '#navigation', label: '跳转到导航' },
    { href: '#footer', label: '跳转到页脚' }
  ],
  className 
}: SkipLinksProps) {
  return (
    <nav
      aria-label="跳转链接"
      className={cn(
        'sr-only focus-within:not-sr-only',
        'focus-within:absolute focus-within:top-0 focus-within:left-0 focus-within:z-50',
        'focus-within:bg-white focus-within:shadow-lg focus-within:p-4',
        'dark:focus-within:bg-gray-800',
        className
      )}
    >
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={cn(
                'block px-4 py-2 rounded-md',
                'text-blue-600 hover:bg-blue-50',
                'dark:text-blue-400 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Main content wrapper with proper landmark and focus management
interface MainContentProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function MainContent({ 
  children, 
  className,
  id = 'main-content' 
}: MainContentProps) {
  return (
    <main
      id={id}
      className={className}
      role="main"
      aria-label="主要内容"
      tabIndex={-1}
    >
      {children}
    </main>
  )
}

// Navigation wrapper with proper landmark
interface NavigationProps {
  children: React.ReactNode
  className?: string
  id?: string
  ariaLabel?: string
}

export function Navigation({ 
  children, 
  className,
  id = 'navigation',
  ariaLabel = '主导航'
}: NavigationProps) {
  return (
    <nav
      id={id}
      className={className}
      role="navigation"
      aria-label={ariaLabel}
    >
      {children}
    </nav>
  )
}

// Footer wrapper with proper landmark
interface FooterProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function Footer({ 
  children, 
  className,
  id = 'footer'
}: FooterProps) {
  return (
    <footer
      id={id}
      className={className}
      role="contentinfo"
      aria-label="页脚"
    >
      {children}
    </footer>
  )
}