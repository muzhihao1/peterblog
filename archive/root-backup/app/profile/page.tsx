'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Calendar, MessageCircle, Heart, Bookmark, Edit, Github, Twitter, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProfileSkeleton, Skeleton } from '@/components/ui/Skeleton'
import { Avatar } from '@/components/ui/OptimizedImage'
import { SEO } from '@/components/SEO'
import { MainContent } from '@/components/ui/SkipToContent'
import { AccessibleButton } from '@/components/ui/AccessibleButton'

// Mock user data until Terminal A provides authentication
const mockUser = {
  id: '1',
  email: 'user@example.com',
  username: 'testuser',
  avatar_url: null,
  full_name: '测试用户',
  bio: '这是一段个人简介，介绍我自己的兴趣爱好和专业领域。',
  website: 'https://example.com',
  github_username: 'testuser',
  twitter_username: 'testuser',
  created_at: '2024-01-01T00:00:00Z',
  stats: {
    total_comments: 42,
    total_likes: 156,
    total_bookmarks: 23,
    total_posts_read: 89
  }
}

interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url: string | null
  full_name: string | null
  bio: string | null
  website: string | null
  github_username: string | null
  twitter_username: string | null
  created_at: string
  stats: {
    total_comments: number
    total_likes: number
    total_bookmarks: number
    total_posts_read: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call once Terminal A provides authentication
    const fetchProfile = async () => {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500))
        setProfile(mockUser)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        router.push('/') // Redirect if not authenticated
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Profile Header Skeleton */}
          <ProfileSkeleton />
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Links Skeleton */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
  }

  // Structured data for profile
  const profileStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name || profile.username,
    alternateName: profile.username,
    description: profile.bio,
    url: profile.website,
    sameAs: [
      profile.github_username ? `https://github.com/${profile.github_username}` : null,
      profile.twitter_username ? `https://twitter.com/${profile.twitter_username}` : null
    ].filter(Boolean),
    image: profile.avatar_url
  }

  return (
    <>
      <SEO
        title="个人主页"
        description={profile.bio || `${profile.full_name || profile.username}的个人主页`}
        type="profile"
        author={profile.full_name || profile.username}
        image={profile.avatar_url}
        structuredData={profileStructuredData}
      />
      <MainContent className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <section
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6"
            aria-labelledby="profile-heading"
          >
            <h1 id="profile-heading" className="sr-only">个人资料</h1>
            <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0" role="img" aria-label="用户头像">
                  <Avatar
                    src={profile.avatar_url}
                    alt={`${profile.full_name || profile.username}的头像`}
                    size={80}
                    priority={true}
                  />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {profile.full_name || profile.username}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400" aria-label="用户名">@{profile.username}</p>
                
                {profile.bio && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{profile.bio}</p>
                )}

                  {/* Social Links */}
                  <nav className="mt-3 flex items-center space-x-4" aria-label="社交媒体链接">
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="个人网站"
                    >
                      <Globe className="h-5 w-5" aria-hidden="true" />
                    </a>
                  )}
                  {profile.github_username && (
                    <a
                      href={`https://github.com/${profile.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="GitHub主页"
                    >
                      <Github className="h-5 w-5" aria-hidden="true" />
                    </a>
                  )}
                  {profile.twitter_username && (
                    <a
                      href={`https://twitter.com/${profile.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="Twitter主页"
                    >
                      <Twitter className="h-5 w-5" aria-hidden="true" />
                    </a>
                  )}
                </div>

                {/* Member Since */}
                <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  加入于 {formatDate(profile.created_at)}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Link
              href="/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              编辑资料
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {profile.stats.total_comments}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">评论</p>
              </div>
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {profile.stats.total_likes}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">获得点赞</p>
              </div>
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {profile.stats.total_bookmarks}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">收藏</p>
              </div>
              <Bookmark className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {profile.stats.total_posts_read}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">文章阅读</p>
              </div>
              <User className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            快速链接
          </h2>
          <div className="space-y-3">
            <Link
              href="/profile/bookmarks"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <Bookmark className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-200">我的收藏</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {profile.stats.total_bookmarks} 项
              </span>
            </Link>

            <Link
              href="/profile/comments"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-200">评论历史</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {profile.stats.total_comments} 条
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}