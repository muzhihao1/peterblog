'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Github, Mail, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  title = '登录以继续',
  message = '登录后即可使用完整功能'
}: LoginModalProps) {
  const { signIn, loading } = useAuth()

  const handleSignIn = async (provider: 'github' | 'google') => {
    try {
      await signIn(provider)
      onClose()
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center items-center rounded-lg bg-gray-900 dark:bg-gray-700 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handleSignIn('github')}
                    disabled={loading}
                  >
                    <Github className="h-5 w-5 mr-2" />
                    使用 GitHub 登录
                  </button>

                  <button
                    type="button"
                    className="inline-flex w-full justify-center items-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handleSignIn('google')}
                    disabled={loading}
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    使用 Google 登录
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        或
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex w-full justify-center items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    稍后登录
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    登录即表示您同意我们的服务条款和隐私政策
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}