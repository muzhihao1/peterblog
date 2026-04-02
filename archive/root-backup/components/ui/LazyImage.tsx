'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
}

export function LazyImage({
  src,
  alt,
  className,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}: LazyImageProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  // Default fallback
  const defaultFallback = (
    <div className={cn(
      "bg-gray-100 dark:bg-gray-800 flex items-center justify-center",
      className
    )}>
      <ImageIcon className="h-8 w-8 text-gray-400" />
    </div>
  )

  if (hasError) {
    return fallback || defaultFallback
  }

  return (
    <div ref={imgRef} className={cn("relative", className)}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      
      {/* Actual image */}
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  )
}