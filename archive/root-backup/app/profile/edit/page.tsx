'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, Save, X } from 'lucide-react'
import { FormSkeleton } from '@/components/ui/Skeleton'
import { Avatar } from '@/components/ui/OptimizedImage'

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
  email_notifications: true
}

interface ProfileFormData {
  full_name: string
  bio: string
  website: string
  github_username: string
  twitter_username: string
  email_notifications: boolean
}

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    bio: '',
    website: '',
    github_username: '',
    twitter_username: '',
    email_notifications: false
  })

  useEffect(() => {
    // TODO: Replace with actual API call once Terminal A provides authentication
    const fetchProfile = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        setFormData({
          full_name: mockUser.full_name || '',
          bio: mockUser.bio || '',
          website: mockUser.website || '',
          github_username: mockUser.github_username || '',
          twitter_username: mockUser.twitter_username || '',
          email_notifications: mockUser.email_notifications
        })
        if (mockUser.avatar_url) {
          setAvatarPreview(mockUser.avatar_url)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        router.push('/profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // If avatar was changed, upload it
      if (avatarFile) {
        // TODO: Upload avatar to Supabase Storage
        console.log('Avatar upload:', avatarFile)
      }

      // Update profile data
      console.log('Profile update:', formData)

      // Show success message or redirect
      router.push('/profile')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('更新失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <FormSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回个人主页
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
            编辑个人资料
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              头像
            </h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar
                  src={avatarPreview || mockUser.avatar_url}
                  alt="Avatar preview"
                  size={96}
                  priority={true}
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Camera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <input
                    id="avatar-upload"
                    name="avatar"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>点击相机图标上传新头像</p>
                <p>支持 JPG, PNG 格式，最大 5MB</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              基本信息
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  姓名
                </label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="您的真实姓名或昵称"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  个人简介
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="简单介绍一下自己..."
                  maxLength={200}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formData.bio.length}/200
                </p>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  个人网站
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Social Accounts */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              社交账号
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="github_username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub 用户名
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                    github.com/
                  </span>
                  <input
                    type="text"
                    name="github_username"
                    id="github_username"
                    value={formData.github_username}
                    onChange={handleInputChange}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="twitter_username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Twitter 用户名
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                    twitter.com/
                  </span>
                  <input
                    type="text"
                    name="twitter_username"
                    id="twitter_username"
                    value={formData.twitter_username}
                    onChange={handleInputChange}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              通知设置
            </h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={formData.email_notifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  接收邮件通知（评论回复、新关注者等）
                </span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2" />
              取消
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存更改
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}