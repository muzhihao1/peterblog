'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Calendar, Reply, Edit2, Trash2, ExternalLink, Bell, BellOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CommentSkeleton } from '@/components/ui/Skeleton'
import dynamic from 'next/dynamic'

// Generate more mock data for testing virtual scroll
const generateMockComments = () => {
  const titles = [
    '使用 Next.js 15 构建现代化博客',
    'React Server Components 深度解析',
    'TypeScript 最佳实践',
    '前端性能优化指南',
    '个人博客系统升级项目',
    '开源组件库开发',
    '深入浅出 TypeScript',
    'JavaScript 设计模式'
  ]
  
  const contents = [
    '这篇文章写得非常详细，特别是关于 ISR 的部分，对我帮助很大！能否分享一下在实际项目中遇到的性能优化问题？',
    '项目架构设计得很合理，想请教一下具体的实现细节。',
    '感谢分享！这个解决方案正是我需要的。',
    '很有启发性的内容，学到了很多新知识。',
    '代码示例很清晰，容易理解和实践。'
  ]

  const comments = []
  for (let i = 0; i < 100; i++) {
    const hasParent = i % 3 === 0
    comments.push({
      id: `comment-${i + 1}`,
      content_id: `post-${(i % 8) + 1}`,
      content_title: titles[i % titles.length],
      content: contents[i % contents.length],
      created_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      updated_at: i % 5 === 0 ? new Date(Date.now() - (i - 1) * 12 * 60 * 60 * 1000).toISOString() : null,
      parent_id: hasParent ? `parent-${i}` : null,
      parent_comment: hasParent ? {
        author: `用户${i}`,
        content: '这是一条父评论的内容...'
      } : undefined,
      has_replies: i % 4 === 0,
      unread_replies: i % 4 === 0 ? Math.floor(Math.random() * 5) : 0
    })
  }
  return comments
}

const mockComments = generateMockComments()

interface Comment {
  id: string
  content_id: string
  content_title: string
  content: string
  created_at: string
  updated_at: string | null
  parent_id: string | null
  parent_comment?: {
    author: string
    content: string
  }
  has_replies: boolean
  unread_replies: number
}

export default function CommentsPage() {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchComments = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        setComments(mockComments)
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [])

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async (id: string) => {
    try {
      // TODO: Call API to update comment
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update local state
      setComments(prev => prev.map(c => 
        c.id === id 
          ? { ...c, content: editContent, updated_at: new Date().toISOString() }
          : c
      ))
      setEditingId(null)
      setEditContent('')
    } catch (error) {
      console.error('Failed to update comment:', error)
      alert('更新失败，请重试')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？删除后无法恢复。')) return

    try {
      // TODO: Call API to delete comment
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from local state
      setComments(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('删除失败，请重试')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} 小时前`
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} 天前`
    } else {
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      })
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

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <CommentSkeleton key={i} />
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
                评论历史
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                共 {comments.length} 条评论
                {comments.some(c => c.unread_replies > 0) && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    · 有新回复
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <VirtualCommentList
            comments={comments}
            editingId={editingId}
            editContent={editContent}
            onEdit={handleEdit}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDelete}
            setEditingId={setEditingId}
            setEditContent={setEditContent}
            formatDate={formatDate}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              暂无评论
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              开始阅读文章并发表您的见解吧
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Lazy load the virtual list component for better code splitting
const VirtualCommentList = dynamic(
  () => import('./VirtualCommentList').then(mod => mod.VirtualCommentList),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    )
  }
)