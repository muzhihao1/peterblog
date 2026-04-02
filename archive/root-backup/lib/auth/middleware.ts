import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

/**
 * 认证中间件框架
 * 用于保护需要登录的API路由
 */

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface AuthContext {
  user: AuthUser | null
  isAuthenticated: boolean
}

/**
 * 创建Supabase服务器客户端
 */
export function createSupabaseServerClient(request: NextRequest) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    }
  )

  return supabase
}

/**
 * 认证中间件
 * 验证用户是否已登录
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const supabase = createSupabaseServerClient(request)
    
    // 获取当前用户
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: '请先登录'
          }
        },
        { status: 401 }
      )
    }

    // 构建认证上下文
    const authContext: AuthContext = {
      user: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at
      },
      isAuthenticated: true
    }

    // 调用实际的处理函数
    return await handler(request, authContext)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '认证过程出错'
        }
      },
      { status: 500 }
    )
  }
}

/**
 * 可选认证中间件
 * 允许未登录用户访问，但提供用户信息（如果已登录）
 */
export async function withOptionalAuth(
  request: NextRequest,
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const supabase = createSupabaseServerClient(request)
    
    // 尝试获取当前用户
    const { data: { user } } = await supabase.auth.getUser()

    // 构建认证上下文
    const authContext: AuthContext = {
      user: user ? {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at
      } : null,
      isAuthenticated: !!user
    }

    // 调用实际的处理函数
    return await handler(request, authContext)
  } catch (error) {
    console.error('Optional auth middleware error:', error)
    
    // 即使认证失败，也允许继续执行
    const authContext: AuthContext = {
      user: null,
      isAuthenticated: false
    }
    
    return await handler(request, authContext)
  }
}

/**
 * 统一的错误响应
 */
export function errorResponse(code: string, message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message
      }
    },
    { status }
  )
}

/**
 * 统一的成功响应
 */
export function successResponse<T>(data: T, message: string = '操作成功') {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

/**
 * 验证请求方法
 */
export function validateMethod(request: NextRequest, allowedMethods: string[]) {
  if (!allowedMethods.includes(request.method)) {
    return errorResponse(
      'METHOD_NOT_ALLOWED',
      `只允许 ${allowedMethods.join(', ')} 方法`,
      405
    )
  }
  return null
}