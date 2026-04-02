'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// User type matching Supabase auth user structure
interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    username?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (provider: 'github' | 'google') => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock authentication for development
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  user_metadata: {
    full_name: '测试用户',
    avatar_url: null,
    username: 'testuser'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      // TODO: Replace with actual Supabase auth check
      // const { data: { user } } = await supabase.auth.getUser()
      
      // For now, check localStorage for mock auth
      const mockAuth = localStorage.getItem('mock-auth')
      if (mockAuth === 'true') {
        setUser(MOCK_USER)
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true)
      
      // TODO: Replace with actual Supabase OAuth
      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider,
      //   options: {
      //     redirectTo: `${window.location.origin}/auth/callback`
      //   }
      // })
      
      // Mock sign in
      localStorage.setItem('mock-auth', 'true')
      setUser(MOCK_USER)
      
      // Redirect to profile after sign in
      router.push('/profile')
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      // TODO: Replace with actual Supabase sign out
      // const { error } = await supabase.auth.signOut()
      
      // Mock sign out
      localStorage.removeItem('mock-auth')
      setUser(null)
      
      // Redirect to home after sign out
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to require authentication
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?auth=required')
    }
  }, [user, loading, router])

  return { user, loading }
}