'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bookmark, FileText, Package, Book, Wrench, Calendar, CheckSquare, Square, Search, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { SkeletonCard } from '@/components/ui/Skeleton'

// Generate more mock data for testing virtual scroll
const generateMockBookmarks = () => {
  const types = ['post', 'project', 'book', 'tool'] as const
  const titles = {
    post: ['使用 Next.js 15 构建现代化博客', 'React Server Components 深度解析', 'TypeScript 最佳实践', '前端性能优化指南'],
    project: ['个人博客系统升级项目', '开源组件库开发', '全栈应用架构设计', '微服务实践案例'],
    book: ['深入浅出 TypeScript', 'JavaScript 设计模式', '代码整洁之道', '重构：改善既有代码的设计'],
    tool: ['Tailwind CSS', 'VS Code', 'Git 工具集', 'Chrome DevTools']
  }
  
  const excerpts = {
    post: '探索最新技术和最佳实践，提升开发效率和代码质量...',
    project: '实战项目经验分享，从架构设计到部署上线的完整流程...',
    book: '深入学习编程知识，掌握核心概念和高级技巧...',
    tool: '高效的开发工具，让编程工作事半功倍...'
  }

  const bookmarks = []
  for (let i = 0; i < 100; i++) {
    const type = types[i % types.length]
    const titleIndex = Math.floor(i / types.length) % titles[type].length
    bookmarks.push({
      id: `bookmark-${i + 1}`,
      content_id: `${type}-${i + 1}`,
      content_type: type,
      title: `${titles[type][titleIndex]} (${Math.floor(i / (types.length * 4)) + 1})`,
      excerpt: excerpts[type],
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      content_created_at: new Date(Date.now() - (i + 7) * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  return bookmarks
}

const mockBookmarks = generateMockBookmarks()

interface Bookmark {
  id: string
  content_id: string
  content_type: 'post' | 'project' | 'book' | 'tool'
  title: string
  excerpt: string
  created_at: string
  content_created_at: string
}

const contentTypeConfig = {
  post: {
    icon: FileText,
    label: '文章',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    href: (id: string) => `/posts/${id}`
  },
  project: {
    icon: Package,
    label: '项目',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    href: (id: string) => `/projects/${id}`
  },
  book: {
    icon: Book,
    label: '书籍',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900',
    href: (id: string) => `/books/${id}`
  },
  tool: {
    icon: Wrench,
    label: '工具',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    href: (id: string) => `/tools/${id}`
  }
}

export default function BookmarksPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchBookmarks = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        setBookmarks(mockBookmarks)
        setFilteredBookmarks(mockBookmarks)
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = bookmarks

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(b => b.content_type === filterType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredBookmarks(filtered)
  }, [bookmarks, filterType, searchQuery])

  const handleSelectAll = () => {
    if (selectedIds.size === filteredBookmarks.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredBookmarks.map(b => b.id)))
    }
  }

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return

    if (!confirm(`确定要取消收藏这 ${selectedIds.size} 项内容吗？`)) return

    try {
      // TODO: Call API to delete bookmarks
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from local state
      setBookmarks(prev => prev.filter(b => !selectedIds.has(b.id)))
      setSelectedIds(new Set())
    } catch (error) {
      console.error('Failed to delete bookmarks:', error)
      alert('操作失败，请重试')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} 小时前`
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} 天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          
          <div className="mb-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回个人主页
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                我的收藏
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                共 {bookmarks.length} 项收藏，显示 {filteredBookmarks.length} 项
              </p>
            </div>

            {selectedIds.size > 0 && (
              <button
                onClick={handleBatchDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                取消收藏 ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索收藏..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                showFilters
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </button>
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">内容类型</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === 'all'
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  全部
                </button>
                {Object.entries(contentTypeConfig).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterType === type
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bookmarks List */}
        {filteredBookmarks.length > 0 ? (
          <div className="space-y-4">
            {/* Select All */}
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm">
              <label className="flex items-center cursor-pointer">
                <button
                  onClick={handleSelectAll}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {selectedIds.size === filteredBookmarks.length ? (
                    <CheckSquare className="h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  全选 ({filteredBookmarks.length} 项)
                </span>
              </label>
            </div>

            {/* Virtual Bookmark Items */}
            <VirtualBookmarkList
              bookmarks={filteredBookmarks}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              contentTypeConfig={contentTypeConfig}
              formatDate={formatDate}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              暂无收藏
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || filterType !== 'all'
                ? '没有找到符合条件的收藏'
                : '开始探索并收藏您喜欢的内容吧'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Lazy load the virtual list component for better code splitting
const VirtualBookmarkList = dynamic(
  () => import('./VirtualBookmarkList').then(mod => mod.VirtualBookmarkList),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }
)

// [VirtualBookmarkList component has been moved to a separate file]