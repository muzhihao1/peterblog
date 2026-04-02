'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { User, ImageIcon } from 'lucide-react'

interface OptimizedImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  onLoad?: () => void
  fallback?: React.ReactNode
  isAvatar?: boolean
}

// Base64 blur placeholder for better loading experience
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  onLoad,
  fallback,
  isAvatar = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  // Generate blur placeholder
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`

  // Default fallback for avatars
  const defaultAvatarFallback = (
    <div className={cn(
      "flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600",
      isAvatar && "rounded-full",
      className
    )}>
      <User className={cn(
        "text-white",
        isAvatar ? "h-1/2 w-1/2" : "h-8 w-8"
      )} />
    </div>
  )

  // Default fallback for regular images
  const defaultImageFallback = (
    <div className={cn(
      "bg-gray-100 dark:bg-gray-800 flex items-center justify-center",
      className
    )}>
      <ImageIcon className="h-8 w-8 text-gray-400" />
    </div>
  )

  // If no src provided or error occurred, show fallback
  if (!src || error) {
    return fallback || (isAvatar ? defaultAvatarFallback : defaultImageFallback)
  }

  return (
    <div className={cn(
      "relative overflow-hidden",
      fill && "w-full h-full",
      isAvatar && "rounded-full",
      className
    )}>
      {/* Loading shimmer */}
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse",
          isAvatar && "rounded-full"
        )} />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes || (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined)}
        priority={priority}
        quality={quality}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill && "object-cover",
          isAvatar && "rounded-full"
        )}
        onLoad={handleLoad}
        onError={handleError}
        placeholder="blur"
        blurDataURL={blurDataURL}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  )
}

// Avatar-specific component for convenience
export function Avatar({
  src,
  alt,
  size = 80,
  className,
  priority = false,
  fallbackIcon
}: {
  src: string | null | undefined
  alt: string
  size?: number
  className?: string
  priority?: boolean
  fallbackIcon?: React.ReactNode
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      priority={priority}
      isAvatar={true}
      fallback={
        fallbackIcon || (
          <div className={cn(
            "flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full",
            className
          )}
            style={{ width: size, height: size }}
          >
            <User className="text-white" style={{ width: size/2, height: size/2 }} />
          </div>
        )
      }
    />
  )
}