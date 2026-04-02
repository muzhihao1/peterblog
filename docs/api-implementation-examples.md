# API实现示例代码

## 使用认证中间件的示例

### 1. 需要登录的API（点赞）

```typescript
// app/api/likes/route.ts
import { NextRequest } from 'next/server'
import { withAuth, successResponse, errorResponse } from '@/lib/auth/middleware'
import { createSupabaseServerClient } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, { user }) => {
    try {
      const { content_id, content_type } = await req.json()
      
      if (!content_id || !content_type) {
        return errorResponse('VALIDATION_ERROR', '缺少必要参数')
      }

      const supabase = createSupabaseServerClient(req)
      
      // 检查是否已点赞
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', content_id)
        .eq('content_type', content_type)
        .single()

      if (existingLike) {
        // 取消点赞
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)
        
        // 获取最新点赞数
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('content_id', content_id)
          .eq('content_type', content_type)

        return successResponse({
          liked: false,
          like_count: count || 0
        })
      } else {
        // 添加点赞
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            content_id,
            content_type
          })
        
        // 获取最新点赞数
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('content_id', content_id)
          .eq('content_type', content_type)

        return successResponse({
          liked: true,
          like_count: count || 0
        })
      }
    } catch (error) {
      console.error('Like error:', error)
      return errorResponse('SERVER_ERROR', '操作失败')
    }
  })
}
```

### 2. 可选登录的API（获取点赞状态）

```typescript
// app/api/likes/status/route.ts
import { NextRequest } from 'next/server'
import { withOptionalAuth, successResponse } from '@/lib/auth/middleware'
import { createSupabaseServerClient } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async (req, { user }) => {
    const { searchParams } = new URL(req.url)
    const content_id = searchParams.get('content_id')
    const content_type = searchParams.get('content_type')

    if (!content_id || !content_type) {
      return errorResponse('VALIDATION_ERROR', '缺少必要参数')
    }

    const supabase = createSupabaseServerClient(req)
    
    // 获取点赞总数
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', content_id)
      .eq('content_type', content_type)

    // 检查当前用户是否点赞（如果已登录）
    let liked = false
    if (user) {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', content_id)
        .eq('content_type', content_type)
        .single()
      
      liked = !!data
    }

    return successResponse({
      liked,
      like_count: count || 0
    })
  })
}
```

### 3. 评论API示例

```typescript
// app/api/comments/route.ts
import { NextRequest } from 'next/server'
import { withAuth, successResponse, errorResponse } from '@/lib/auth/middleware'
import { createSupabaseServerClient } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, { user }) => {
    try {
      const { content_id, content, parent_id } = await req.json()
      
      if (!content_id || !content) {
        return errorResponse('VALIDATION_ERROR', '缺少必要参数')
      }

      if (content.length > 500) {
        return errorResponse('VALIDATION_ERROR', '评论内容不能超过500字')
      }

      const supabase = createSupabaseServerClient(req)
      
      // 创建评论
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          content_id,
          content,
          parent_id: parent_id || null
        })
        .select(`
          *,
          user:user_profiles(
            id,
            name,
            avatar_url
          )
        `)
        .single()

      if (error) {
        throw error
      }

      return successResponse(comment, '评论发布成功')
    } catch (error) {
      console.error('Comment error:', error)
      return errorResponse('SERVER_ERROR', '评论发布失败')
    }
  })
}
```

### 4. 获取评论列表（支持嵌套）

```typescript
// app/api/comments/[contentId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  return withOptionalAuth(request, async (req, { user }) => {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const supabase = createSupabaseServerClient(req)
    
    // 获取顶级评论
    const { data: comments, error, count } = await supabase
      .from('comments')
      .select(`
        *,
        user:user_profiles(
          id,
          name,
          avatar_url
        ),
        replies:comments(
          *,
          user:user_profiles(
            id,
            name,
            avatar_url
          )
        )
      `, { count: 'exact' })
      .eq('content_id', params.contentId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      return errorResponse('SERVER_ERROR', '获取评论失败')
    }

    return successResponse({
      items: comments,
      total: count || 0,
      page,
      limit
    })
  })
}
```

### 5. GitHub OAuth登录

```typescript
// app/api/auth/github/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient(request)
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?redirectTo=${redirectTo}`,
    }
  })

  if (error || !data.url) {
    return NextResponse.redirect(new URL('/error', request.url))
  }

  return NextResponse.redirect(data.url)
}
```

### 6. OAuth回调处理

```typescript
// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/'

  if (code) {
    const supabase = createSupabaseServerClient(request)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  return NextResponse.redirect(new URL('/error', request.url))
}
```

## 客户端使用示例

### 1. 在React组件中使用

```typescript
// 点赞按钮组件
const LikeButton = ({ contentId, contentType }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId, content_type: contentType })
      })

      if (!res.ok) {
        const error = await res.json()
        if (error.error?.code === 'AUTH_REQUIRED') {
          // 显示登录提示
          showLoginModal()
          return
        }
        throw new Error(error.error?.message)
      }

      const { data } = await res.json()
      setLiked(data.liked)
      setLikeCount(data.like_count)
    } catch (error) {
      console.error('Like error:', error)
      toast.error('操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleLike} disabled={loading}>
      {liked ? '❤️' : '🤍'} {likeCount}
    </button>
  )
}
```

## 错误处理最佳实践

1. **统一错误格式**：使用 `errorResponse` 辅助函数
2. **详细错误日志**：在服务端记录详细错误
3. **友好错误提示**：给用户显示可理解的错误信息
4. **错误恢复**：提供重试或其他恢复选项