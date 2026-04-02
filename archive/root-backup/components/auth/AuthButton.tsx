'use client'

import { useState, Fragment } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { User, LogOut, Settings, Bookmark, MessageCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import LoginModal from './LoginModal'

export default function AuthButton() {
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          登录
        </button>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    )
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        {avatarUrl ? (
          <img
            className="h-8 w-8 rounded-full"
            src={avatarUrl}
            alt={displayName}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>

          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                <User className="h-4 w-4 mr-2" />
                个人主页
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile/bookmarks"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                我的收藏
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile/comments"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                评论历史
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile/edit"
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                <Settings className="h-4 w-4 mr-2" />
                账号设置
              </Link>
            )}
          </Menu.Item>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={signOut}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}