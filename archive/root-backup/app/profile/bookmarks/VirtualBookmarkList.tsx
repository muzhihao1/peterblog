'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Calendar, CheckSquare, Square, Bookmark } from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface Bookmark {
  id: string
  content_id: string
  content_type: 'post' | 'project' | 'book' | 'tool'
  title: string
  excerpt: string
  created_at: string
  content_created_at: string
}

export function VirtualBookmarkList({
  bookmarks,
  selectedIds,
  onSelect,
  contentTypeConfig,
  formatDate
}: {
  bookmarks: Bookmark[]
  selectedIds: Set<string>
  onSelect: (id: string) => void
  contentTypeConfig: any
  formatDate: (date: string) => string
}) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: bookmarks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height of each bookmark item
    overscan: 5
  })

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto space-y-4 pr-2"
      style={{
        contain: 'strict'
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const bookmark = bookmarks[virtualItem.index]
          const config = contentTypeConfig[bookmark.content_type]
          const Icon = config.icon
          const isSelected = selectedIds.has(bookmark.id)

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <div
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-all mb-4 ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => onSelect(bookmark.id)}
                    className="mt-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {config.label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {formatDate(bookmark.created_at)}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      <Link
                        href={config.href(bookmark.content_id)}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {bookmark.title}
                      </Link>
                    </h3>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {bookmark.excerpt}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <Bookmark className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}