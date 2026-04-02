# Claude Code 开发任务：现代化个人博客系统升级

## 任务概述

您需要基于现有的Next.js博客系统进行全面升级，解决静态导出导致的内容同步问题，并添加现代化博客的高级功能。这是一个**渐进式升级项目**，需要在保持现有功能和代码结构的基础上，实现以下核心目标：

**主要目标**：
1. 解决Notion内容无法自动同步的问题
2. 添加用户交互功能（评论、点赞、用户认证）
3. 实现实时功能和高级搜索
4. 保持现有的优秀用户体验和代码质量

**技术约束**：
- 必须保持Notion作为主要内容管理系统
- 必须保持现有的组件结构和设计风格
- 必须保持TypeScript和Tailwind CSS技术栈
- 必须确保向后兼容性

## 项目背景分析

### 现有系统优势

当前博客系统已经具备了优秀的基础架构。系统使用Next.js 15的App Router架构，完整实现了博客、项目展示、书架系统、工具分享等核心功能。代码质量很高，采用了TypeScript进行类型安全，使用Tailwind CSS实现了响应式设计和深色模式支持。Notion API集成完善，能够很好地管理和展示内容。

用户体验方面，系统实现了全站搜索功能，支持快捷键操作，具备良好的SEO优化和性能优化。组件化设计合理，代码结构清晰，维护性良好。这些优势都需要在升级过程中完全保留。

### 核心问题识别

主要问题在于使用了`output: 'export'`的静态导出配置。这种配置虽然能够提供优秀的性能和简单的部署方式，但也带来了严重的限制。所有内容在构建时被固化为静态文件，Notion API只在构建时调用一次，导致新内容无法自动同步到网站。

此外，静态导出模式无法支持服务器端功能，限制了用户交互功能的实现。无法实现评论系统、用户认证、实时搜索等现代化博客的标准功能。每次内容更新都需要完整重建和重新部署，增加了维护复杂度。

### 升级策略

采用三阶段渐进式升级策略，确保每个阶段都能独立交付价值，同时降低风险。第一阶段专注于解决内容同步问题，第二阶段添加用户交互功能，第三阶段实现高级功能和优化。

## 第一阶段：ISR架构升级

### 阶段目标

第一阶段的核心目标是解决内容同步问题，同时保持现有的所有功能和用户体验。通过将静态导出模式升级为增量静态再生（ISR）模式，实现内容的自动同步更新，同时保持静态页面的性能优势。

这个阶段不会添加新功能，专注于架构升级和问题修复。升级完成后，用户在Notion中更新内容后，网站将在指定时间内自动更新，无需手动重建。

### 技术实现方案

**配置文件修改**

首先需要修改Next.js配置文件，移除静态导出限制，启用ISR功能。这是整个升级的基础，需要谨慎处理以确保不破坏现有功能。

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除静态导出配置
  // output: 'export', // 删除这一行
  
  // 启用图片优化
  images: {
    unoptimized: false, // 改为false以启用Next.js图片优化
    domains: ['images.unsplash.com', 'notion.so'], // 添加图片域名
  },
  
  // 环境变量配置保持不变
  env: {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    NOTION_PROJECTS_DB: process.env.NOTION_PROJECTS_DB,
    NOTION_BOOKS_DB: process.env.NOTION_BOOKS_DB,
    NOTION_TOOLS_DB: process.env.NOTION_TOOLS_DB,
    CACHE_TTL: process.env.CACHE_TTL,
  },
  
  // 启用trailing slash以保持URL兼容性
  trailingSlash: true,
  
  // 实验性功能配置
  experimental: {
    isrMemoryCacheSize: 0, // 禁用内存缓存以确保数据一致性
  }
}

module.exports = nextConfig
```

**页面级ISR配置**

每个页面都需要添加适当的revalidate配置，根据内容更新频率设置不同的重新验证时间。这样可以平衡性能和内容新鲜度。

```typescript
// app/page.tsx - 首页
export const revalidate = 1800; // 30分钟重新验证

export default async function HomePage() {
  // 现有代码保持不变
  const posts = await getRecentPosts();
  const projects = await getFeaturedProjects();
  const books = await getRecentBooks();
  
  return (
    // 现有JSX保持不变
  );
}
```

```typescript
// app/blog/page.tsx - 博客列表页
export const revalidate = 3600; // 1小时重新验证

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    // 现有JSX保持不变
  );
}
```

```typescript
// app/posts/[slug]/page.tsx - 文章详情页
export const revalidate = 7200; // 2小时重新验证

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    // 现有JSX保持不变
  );
}
```

**数据获取优化**

需要优化Notion API调用，添加错误处理和缓存机制，确保ISR模式下的稳定性。

```typescript
// lib/notion/client.ts - 优化Notion客户端
import { Client } from '@notionhq/client';
import { cache } from 'react';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 使用React cache包装API调用
export const getPostsFromNotion = cache(async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published'
        }
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending'
        }
      ]
    });
    
    return response.results.map(transformNotionPage);
  } catch (error) {
    console.error('Error fetching posts from Notion:', error);
    // 返回后备数据或空数组
    return [];
  }
});

// 添加重试机制
export const getPostBySlug = cache(async (slug: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
          and: [
            {
              property: 'Slug',
              rich_text: {
                equals: slug
              }
            },
            {
              property: 'Status',
              select: {
                equals: 'Published'
              }
            }
          ]
        }
      });
      
      if (response.results.length > 0) {
        return transformNotionPage(response.results[0]);
      }
      
      return null;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
});
```

**部署配置调整**

需要调整Vercel部署配置，确保ISR功能正常工作。

```json
// vercel.json
{
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/revalidate",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**API路由添加**

添加手动重新验证的API路由，用于紧急内容更新。

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  // 验证密钥
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }
  
  try {
    // 重新验证所有主要页面
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/projects');
    revalidatePath('/bookshelf');
    revalidatePath('/tools');
    
    // 重新验证所有文章页面
    revalidateTag('posts');
    
    return NextResponse.json({ 
      message: 'Revalidation successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' }, 
      { status: 500 }
    );
  }
}
```

### 测试和验证

**功能测试清单**

升级完成后需要进行全面测试，确保所有现有功能正常工作，同时验证新的ISR功能。

1. **页面加载测试**：验证所有页面能够正常加载，包括首页、博客列表、文章详情、项目展示、书架、工具页面等。

2. **内容同步测试**：在Notion中更新内容，验证网站能够在指定时间内自动更新。测试不同类型的内容更新，包括新文章发布、现有文章修改、项目信息更新等。

3. **搜索功能测试**：验证全站搜索功能正常工作，能够搜索到最新的内容。

4. **响应式设计测试**：在不同设备和屏幕尺寸下测试，确保响应式设计正常工作。

5. **深色模式测试**：验证深色模式切换功能正常，所有页面在深色模式下显示正确。

6. **性能测试**：使用Lighthouse等工具测试页面性能，确保ISR升级后性能没有显著下降。

**部署验证**

在Vercel上部署升级后的版本，验证生产环境下的功能。特别注意ISR功能在生产环境下的表现，确保内容能够正确更新。

## 第二阶段：用户交互系统

### 阶段目标

第二阶段的目标是在保持Notion作为主要CMS的基础上，添加用户交互功能。这包括用户认证、评论系统、点赞收藏等功能。通过集成Supabase作为用户数据库，实现现代化博客的标准交互功能。

这个阶段将显著提升用户体验，让博客从静态展示平台升级为互动社区平台。同时保持现有的内容管理流程不变，用户仍然可以在Notion中管理所有内容。

### 数据库设计

**Supabase集成**

选择Supabase作为用户数据库，因为它提供了完整的认证系统、实时数据库功能，同时与Next.js集成良好。

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar_url VARCHAR,
  bio TEXT,
  website VARCHAR,
  github_username VARCHAR,
  twitter_username VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id VARCHAR NOT NULL, -- 对应Notion页面ID
  content_type VARCHAR NOT NULL, -- 'article', 'project', 'book', 'tool'
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 支持回复
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 点赞表
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id VARCHAR NOT NULL,
  content_type VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type)
);

-- 收藏表
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id VARCHAR NOT NULL,
  content_type VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type)
);

-- 用户行为表
CREATE TABLE user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR NOT NULL, -- 'view', 'like', 'comment', 'share', 'bookmark'
  content_id VARCHAR NOT NULL,
  content_type VARCHAR NOT NULL,
  metadata JSONB, -- 存储额外信息
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_comments_content ON comments(content_id, content_type);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_likes_content ON likes(content_id, content_type);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_bookmarks_content ON bookmarks(content_id, content_type);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_user_actions_user ON user_actions(user_id);
CREATE INDEX idx_user_actions_content ON user_actions(content_id, content_type);
```

**RLS (Row Level Security) 配置**

```sql
-- 启用RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 评论表策略
CREATE POLICY "Anyone can view approved comments" ON comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- 点赞表策略
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- 收藏表策略
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- 用户行为表策略
CREATE POLICY "Users can view own actions" ON user_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own actions" ON user_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 认证系统实现

**Supabase客户端配置**

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createClient = () => createClientComponentClient();

export const createServerClient = () => createServerComponentClient({ cookies });

// 类型定义
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          github_username: string | null;
          twitter_username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          github_username?: string | null;
          twitter_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // 其他表的类型定义...
    };
  };
};
```

**认证组件**

```typescript
// components/auth/AuthButton.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export function AuthButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  const handleSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <img 
            src={user.user_metadata.avatar_url} 
            alt={user.user_metadata.name}
            className="w-8 h-8 rounded-full"
          />
          <Button variant="ghost" onClick={handleSignOut}>
            退出
          </Button>
        </div>
      ) : (
        <Button onClick={() => setIsOpen(true)}>
          登录
        </Button>
      )}
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">登录到数字花园</h2>
          <div className="space-y-3">
            <Button 
              onClick={() => handleSignIn('github')}
              disabled={isLoading}
              className="w-full"
            >
              使用 GitHub 登录
            </Button>
            <Button 
              onClick={() => handleSignIn('google')}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              使用 Google 登录
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
```

**认证回调处理**

```typescript
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
```

### 评论系统实现

**评论组件**

```typescript
// components/features/CommentSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  contentId: string;
  contentType: string;
}

export function CommentSection({ contentId, contentType }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
    checkUser();
  }, [contentId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    // 组织评论树结构
    const commentTree = organizeComments(data);
    setComments(commentTree);
  };

  const organizeComments = (comments: any[]): Comment[] => {
    const commentMap = new Map();
    const rootComments: Comment[] = [];

    // 创建评论映射
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 组织树结构
    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
  };

  const handleSubmitComment = async (parentId?: string) => {
    if (!user || !newComment.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content_id: contentId,
          content_type: contentType,
          user_id: user.id,
          content: newComment.trim(),
          parent_id: parentId || null
        });

      if (error) throw error;

      setNewComment('');
      fetchComments(); // 重新获取评论
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'} border-l-2 border-gray-100 pl-4`}>
      <div className="flex items-start gap-3">
        <img 
          src={comment.user.avatar_url} 
          alt={comment.user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.user.name}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { 
                addSuffix: true, 
                locale: zhCN 
              })}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
          {user && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {/* 实现回复功能 */}}
            >
              回复
            </Button>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.map(reply => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-bold mb-6">评论 ({comments.length})</h3>
      
      {user ? (
        <div className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的想法..."
            className="mb-3"
            rows={3}
          />
          <Button 
            onClick={() => handleSubmitComment()}
            disabled={isLoading || !newComment.trim()}
          >
            {isLoading ? '发布中...' : '发布评论'}
          </Button>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-center text-gray-600 dark:text-gray-400">
            请登录后参与讨论
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
```

### 点赞和收藏功能

**交互按钮组件**

```typescript
// components/features/InteractionButtons.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

interface InteractionButtonsProps {
  contentId: string;
  contentType: string;
}

export function InteractionButtons({ contentId, contentType }: InteractionButtonsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    checkUser();
    fetchInteractionData();
  }, [contentId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchInteractionData = async () => {
    // 获取点赞数
    const { count: likes } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    setLikeCount(likes || 0);

    // 如果用户已登录，检查用户的交互状态
    if (user) {
      const { data: userLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      const { data: userBookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      setIsLiked(!!userLike);
      setIsBookmarked(!!userBookmark);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        // 取消点赞
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId)
          .eq('content_type', contentType);
        
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        // 添加点赞
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            content_id: contentId,
            content_type: contentType
          });
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }

      // 记录用户行为
      await supabase
        .from('user_actions')
        .insert({
          user_id: user.id,
          action_type: isLiked ? 'unlike' : 'like',
          content_id: contentId,
          content_type: contentType
        });
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;

    try {
      if (isBookmarked) {
        // 取消收藏
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId)
          .eq('content_type', contentType);
        
        setIsBookmarked(false);
      } else {
        // 添加收藏
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            content_id: contentId,
            content_type: contentType
          });
        
        setIsBookmarked(true);
      }

      // 记录用户行为
      await supabase
        .from('user_actions')
        .insert({
          user_id: user.id,
          action_type: isBookmarked ? 'unbookmark' : 'bookmark',
          content_id: contentId,
          content_type: contentType
        });
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
      <Button
        variant="ghost"
        onClick={handleLike}
        disabled={!user}
        className="flex items-center gap-2"
      >
        {isLiked ? (
          <HeartSolidIcon className="w-5 h-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5 h-5" />
        )}
        <span>{likeCount}</span>
      </Button>

      <Button
        variant="ghost"
        onClick={handleBookmark}
        disabled={!user}
        className="flex items-center gap-2"
      >
        {isBookmarked ? (
          <BookmarkSolidIcon className="w-5 h-5 text-blue-500" />
        ) : (
          <BookmarkIcon className="w-5 h-5" />
        )}
        <span>收藏</span>
      </Button>
    </div>
  );
}
```

这个第二阶段的实现将为博客添加完整的用户交互功能，同时保持现有的Notion内容管理流程。用户可以继续在Notion中管理内容，同时网站访客可以进行评论、点赞、收藏等交互操作。



## 第三阶段：高级功能和优化

### 阶段目标

第三阶段的目标是实现现代化博客的高级功能，包括实时功能、高级搜索、数据分析、个性化推荐等。这个阶段将把博客系统提升到专业级别，提供卓越的用户体验和强大的功能。

通过集成Algolia搜索、实时通知、用户行为分析等功能，系统将具备与主流博客平台相媲美的功能完整性。同时优化性能和用户体验，确保系统能够支持大量用户和内容。

### 高级搜索系统

**Algolia集成**

使用Algolia替换现有的Fuse.js搜索，提供更强大的搜索功能和更好的性能。

```typescript
// lib/algolia/client.ts
import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

export const searchClient = client;
export const postsIndex = client.initIndex('posts');
export const projectsIndex = client.initIndex('projects');
export const booksIndex = client.initIndex('books');
export const toolsIndex = client.initIndex('tools');

// 管理员客户端（用于索引更新）
const adminClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

export const adminPostsIndex = adminClient.initIndex('posts');
export const adminProjectsIndex = adminClient.initIndex('projects');
export const adminBooksIndex = adminClient.initIndex('books');
export const adminToolsIndex = adminClient.initIndex('tools');
```

**搜索索引同步**

```typescript
// lib/algolia/sync.ts
import { adminPostsIndex, adminProjectsIndex, adminBooksIndex, adminToolsIndex } from './client';
import { getAllPosts, getAllProjects, getAllBooks, getAllTools } from '@/lib/notion';

export async function syncSearchIndexes() {
  try {
    // 同步文章索引
    const posts = await getAllPosts();
    const postRecords = posts.map(post => ({
      objectID: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags,
      category: post.category,
      publishedDate: post.publishedDate,
      slug: post.slug,
      type: 'post'
    }));
    
    await adminPostsIndex.replaceAllObjects(postRecords);

    // 同步项目索引
    const projects = await getAllProjects();
    const projectRecords = projects.map(project => ({
      objectID: project.id,
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      category: project.category,
      tags: project.tags,
      slug: project.slug,
      type: 'project'
    }));
    
    await adminProjectsIndex.replaceAllObjects(projectRecords);

    // 同步书籍索引
    const books = await getAllBooks();
    const bookRecords = books.map(book => ({
      objectID: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      tags: book.tags,
      category: book.category,
      rating: book.rating,
      status: book.status,
      type: 'book'
    }));
    
    await adminBooksIndex.replaceAllObjects(bookRecords);

    // 同步工具索引
    const tools = await getAllTools();
    const toolRecords = tools.map(tool => ({
      objectID: tool.id,
      title: tool.title,
      description: tool.description,
      category: tool.category,
      tags: tool.tags,
      rating: tool.rating,
      type: 'tool'
    }));
    
    await adminToolsIndex.replaceAllObjects(toolRecords);

    console.log('Search indexes synced successfully');
  } catch (error) {
    console.error('Error syncing search indexes:', error);
    throw error;
  }
}

// API路由用于触发同步
// app/api/sync-search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { syncSearchIndexes } from '@/lib/algolia/sync';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    await syncSearchIndexes();
    return NextResponse.json({ 
      message: 'Search indexes synced successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { message: 'Error syncing search indexes' }, 
      { status: 500 }
    );
  }
}
```

**高级搜索组件**

```typescript
// components/features/AdvancedSearch.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { InstantSearch, SearchBox, Hits, RefinementList, Configure } from 'react-instantsearch';
import { searchClient } from '@/lib/algolia/client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface SearchHit {
  objectID: string;
  title: string;
  content?: string;
  description?: string;
  excerpt?: string;
  type: 'post' | 'project' | 'book' | 'tool';
  slug?: string;
  tags: string[];
  category: string;
  _highlightResult: any;
}

export function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const Hit = ({ hit }: { hit: SearchHit }) => {
    const getHitUrl = () => {
      switch (hit.type) {
        case 'post':
          return `/posts/${hit.slug}`;
        case 'project':
          return `/projects/${hit.slug}`;
        case 'book':
          return `/bookshelf#${hit.objectID}`;
        case 'tool':
          return `/tools#${hit.objectID}`;
        default:
          return '/';
      }
    };

    const getTypeLabel = () => {
      switch (hit.type) {
        case 'post': return '文章';
        case 'project': return '项目';
        case 'book': return '书籍';
        case 'tool': return '工具';
        default: return '';
      }
    };

    return (
      <div 
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-700"
        onClick={() => {
          router.push(getHitUrl());
          setIsOpen(false);
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {getTypeLabel()}
              </span>
              <span className="text-xs text-gray-500">{hit.category}</span>
            </div>
            <h3 
              className="font-medium text-gray-900 dark:text-gray-100 mb-1"
              dangerouslySetInnerHTML={{ 
                __html: hit._highlightResult.title?.value || hit.title 
              }}
            />
            <p 
              className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
              dangerouslySetInnerHTML={{ 
                __html: hit._highlightResult.excerpt?.value || 
                        hit._highlightResult.description?.value || 
                        hit.excerpt || hit.description || ''
              }}
            />
            {hit.tags && hit.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {hit.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <MagnifyingGlassIcon className="w-4 h-4" />
        <span>搜索</span>
        <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div 
        ref={searchRef}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-96 overflow-hidden"
      >
        <InstantSearch searchClient={searchClient} indexName="posts">
          <Configure hitsPerPage={10} />
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <SearchBox
              placeholder="搜索文章、项目、书籍、工具..."
              classNames={{
                root: 'relative',
                form: 'relative',
                input: 'w-full px-4 py-3 text-lg bg-transparent border-none outline-none',
                submit: 'hidden',
                reset: 'absolute right-3 top-1/2 transform -translate-y-1/2',
              }}
              onChangeCapture={(e) => setQuery(e.currentTarget.value)}
            />
          </div>

          {query && (
            <div className="max-h-80 overflow-y-auto">
              <Hits hitComponent={Hit} />
            </div>
          )}

          {!query && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>输入关键词开始搜索</p>
              <p className="text-sm mt-2">支持搜索文章、项目、书籍和工具</p>
            </div>
          )}
        </InstantSearch>
      </div>
    </div>
  );
}
```

### 实时功能实现

**WebSocket连接管理**

```typescript
// lib/realtime/client.ts
import { createClient } from '@/lib/supabase/client';

class RealtimeManager {
  private supabase = createClient();
  private subscriptions = new Map();

  subscribeToComments(contentId: string, callback: (payload: any) => void) {
    const channel = this.supabase
      .channel(`comments:${contentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `content_id=eq.${contentId}`
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`comments:${contentId}`, channel);
    return channel;
  }

  subscribeToLikes(contentId: string, callback: (payload: any) => void) {
    const channel = this.supabase
      .channel(`likes:${contentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `content_id=eq.${contentId}`
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`likes:${contentId}`, channel);
    return channel;
  }

  unsubscribe(key: string) {
    const channel = this.subscriptions.get(key);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.subscriptions.delete(key);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((channel, key) => {
      this.supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}

export const realtimeManager = new RealtimeManager();
```

**实时评论组件**

```typescript
// components/features/RealtimeComments.tsx
'use client';

import { useState, useEffect } from 'react';
import { realtimeManager } from '@/lib/realtime/client';
import { CommentSection } from './CommentSection';

interface RealtimeCommentsProps {
  contentId: string;
  contentType: string;
  initialComments: any[];
}

export function RealtimeComments({ contentId, contentType, initialComments }: RealtimeCommentsProps) {
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    const handleRealtimeUpdate = (payload: any) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      switch (eventType) {
        case 'INSERT':
          // 新评论添加
          setComments(prev => [...prev, newRecord]);
          break;
        case 'UPDATE':
          // 评论更新
          setComments(prev => 
            prev.map(comment => 
              comment.id === newRecord.id ? newRecord : comment
            )
          );
          break;
        case 'DELETE':
          // 评论删除
          setComments(prev => 
            prev.filter(comment => comment.id !== oldRecord.id)
          );
          break;
      }
    };

    const channel = realtimeManager.subscribeToComments(contentId, handleRealtimeUpdate);

    return () => {
      realtimeManager.unsubscribe(`comments:${contentId}`);
    };
  }, [contentId]);

  return (
    <CommentSection 
      contentId={contentId}
      contentType={contentType}
      comments={comments}
      onCommentUpdate={setComments}
    />
  );
}
```

### 数据分析和个性化推荐

**用户行为追踪**

```typescript
// lib/analytics/tracker.ts
import { createClient } from '@/lib/supabase/client';

class AnalyticsTracker {
  private supabase = createClient();
  private sessionId = this.generateSessionId();

  private generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async trackPageView(contentId: string, contentType: string, metadata?: any) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    try {
      await this.supabase
        .from('user_actions')
        .insert({
          user_id: user?.id || null,
          action_type: 'view',
          content_id: contentId,
          content_type: contentType,
          metadata: {
            session_id: this.sessionId,
            user_agent: navigator.userAgent,
            referrer: document.referrer,
            ...metadata
          }
        });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  async trackInteraction(action: string, contentId: string, contentType: string, metadata?: any) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    try {
      await this.supabase
        .from('user_actions')
        .insert({
          user_id: user?.id || null,
          action_type: action,
          content_id: contentId,
          content_type: contentType,
          metadata: {
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            ...metadata
          }
        });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  async trackSearchQuery(query: string, results: number) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    try {
      await this.supabase
        .from('user_actions')
        .insert({
          user_id: user?.id || null,
          action_type: 'search',
          content_id: query,
          content_type: 'search_query',
          metadata: {
            session_id: this.sessionId,
            results_count: results,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }
}

export const analytics = new AnalyticsTracker();
```

**个性化推荐引擎**

```typescript
// lib/recommendations/engine.ts
import { createServerClient } from '@/lib/supabase/server';
import { getAllPosts, getAllProjects, getAllBooks, getAllTools } from '@/lib/notion';

interface RecommendationItem {
  id: string;
  title: string;
  type: string;
  score: number;
  reason: string;
}

export class RecommendationEngine {
  private supabase = createServerClient();

  async getPersonalizedRecommendations(userId: string, limit = 10): Promise<RecommendationItem[]> {
    // 获取用户行为数据
    const { data: userActions } = await this.supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (!userActions || userActions.length === 0) {
      return this.getPopularRecommendations(limit);
    }

    // 分析用户兴趣
    const interests = this.analyzeUserInterests(userActions);
    
    // 获取所有内容
    const [posts, projects, books, tools] = await Promise.all([
      getAllPosts(),
      getAllProjects(),
      getAllBooks(),
      getAllTools()
    ]);

    // 计算推荐分数
    const recommendations: RecommendationItem[] = [];

    // 基于标签相似性推荐文章
    posts.forEach(post => {
      const score = this.calculateContentScore(post, interests, userActions);
      if (score > 0.3) {
        recommendations.push({
          id: post.id,
          title: post.title,
          type: 'post',
          score,
          reason: this.getRecommendationReason(post, interests)
        });
      }
    });

    // 基于技术栈相似性推荐项目
    projects.forEach(project => {
      const score = this.calculateContentScore(project, interests, userActions);
      if (score > 0.3) {
        recommendations.push({
          id: project.id,
          title: project.title,
          type: 'project',
          score,
          reason: this.getRecommendationReason(project, interests)
        });
      }
    });

    // 基于分类和标签推荐书籍
    books.forEach(book => {
      const score = this.calculateContentScore(book, interests, userActions);
      if (score > 0.3) {
        recommendations.push({
          id: book.id,
          title: book.title,
          type: 'book',
          score,
          reason: this.getRecommendationReason(book, interests)
        });
      }
    });

    // 基于分类推荐工具
    tools.forEach(tool => {
      const score = this.calculateContentScore(tool, interests, userActions);
      if (score > 0.3) {
        recommendations.push({
          id: tool.id,
          title: tool.title,
          type: 'tool',
          score,
          reason: this.getRecommendationReason(tool, interests)
        });
      }
    });

    // 排序并返回
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private analyzeUserInterests(actions: any[]) {
    const interests = {
      categories: new Map<string, number>(),
      tags: new Map<string, number>(),
      contentTypes: new Map<string, number>()
    };

    actions.forEach(action => {
      const weight = this.getActionWeight(action.action_type);
      
      // 分析内容类型偏好
      interests.contentTypes.set(
        action.content_type,
        (interests.contentTypes.get(action.content_type) || 0) + weight
      );

      // 分析元数据中的标签和分类
      if (action.metadata) {
        if (action.metadata.category) {
          interests.categories.set(
            action.metadata.category,
            (interests.categories.get(action.metadata.category) || 0) + weight
          );
        }
        
        if (action.metadata.tags) {
          action.metadata.tags.forEach((tag: string) => {
            interests.tags.set(
              tag,
              (interests.tags.get(tag) || 0) + weight
            );
          });
        }
      }
    });

    return interests;
  }

  private getActionWeight(actionType: string): number {
    const weights = {
      'view': 1,
      'like': 3,
      'comment': 5,
      'bookmark': 4,
      'share': 3
    };
    return weights[actionType] || 1;
  }

  private calculateContentScore(content: any, interests: any, userActions: any[]): number {
    let score = 0;

    // 检查用户是否已经交互过
    const hasInteracted = userActions.some(action => action.content_id === content.id);
    if (hasInteracted) {
      return 0; // 已经交互过的内容不推荐
    }

    // 基于分类的分数
    if (content.category && interests.categories.has(content.category)) {
      score += interests.categories.get(content.category) * 0.3;
    }

    // 基于标签的分数
    if (content.tags) {
      content.tags.forEach((tag: string) => {
        if (interests.tags.has(tag)) {
          score += interests.tags.get(tag) * 0.2;
        }
      });
    }

    // 基于内容类型的分数
    const contentType = this.getContentType(content);
    if (interests.contentTypes.has(contentType)) {
      score += interests.contentTypes.get(contentType) * 0.1;
    }

    // 基于时间的衰减
    if (content.publishedDate || content.createdDate) {
      const date = new Date(content.publishedDate || content.createdDate);
      const daysSincePublished = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      const timeDecay = Math.exp(-daysSincePublished / 30); // 30天半衰期
      score *= timeDecay;
    }

    return Math.min(score, 1); // 限制最大分数为1
  }

  private getContentType(content: any): string {
    if (content.slug && content.content) return 'post';
    if (content.techStack) return 'project';
    if (content.author) return 'book';
    return 'tool';
  }

  private getRecommendationReason(content: any, interests: any): string {
    const reasons = [];

    if (content.category && interests.categories.has(content.category)) {
      reasons.push(`因为你对${content.category}感兴趣`);
    }

    if (content.tags) {
      const matchedTags = content.tags.filter((tag: string) => interests.tags.has(tag));
      if (matchedTags.length > 0) {
        reasons.push(`因为你关注${matchedTags.slice(0, 2).join('、')}`);
      }
    }

    return reasons.length > 0 ? reasons[0] : '为你推荐';
  }

  async getPopularRecommendations(limit = 10): Promise<RecommendationItem[]> {
    // 获取热门内容（基于点赞数、评论数等）
    const { data: popularContent } = await this.supabase
      .from('user_actions')
      .select('content_id, content_type, count(*)')
      .in('action_type', ['like', 'comment', 'bookmark'])
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // 最近30天
      .group('content_id, content_type')
      .order('count', { ascending: false })
      .limit(limit);

    if (!popularContent) return [];

    return popularContent.map(item => ({
      id: item.content_id,
      title: '热门内容', // 需要从实际内容中获取标题
      type: item.content_type,
      score: 0.8,
      reason: '热门推荐'
    }));
  }
}

export const recommendationEngine = new RecommendationEngine();
```

### 性能优化和监控

**性能监控组件**

```typescript
// components/monitoring/PerformanceMonitor.tsx
'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics/tracker';

export function PerformanceMonitor() {
  useEffect(() => {
    // 监控页面加载性能
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navigationEntry = entry as PerformanceNavigationTiming;
          
          // 记录关键性能指标
          const metrics = {
            dns_lookup: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
            tcp_connect: navigationEntry.connectEnd - navigationEntry.connectStart,
            request_response: navigationEntry.responseEnd - navigationEntry.requestStart,
            dom_parse: navigationEntry.domContentLoadedEventEnd - navigationEntry.responseEnd,
            total_load: navigationEntry.loadEventEnd - navigationEntry.navigationStart
          };

          // 发送性能数据
          analytics.trackInteraction('performance', window.location.pathname, 'page', metrics);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    // 监控Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        analytics.trackInteraction('web_vital', 'CLS', 'metric', { value: metric.value });
      });
      
      getFID((metric) => {
        analytics.trackInteraction('web_vital', 'FID', 'metric', { value: metric.value });
      });
      
      getFCP((metric) => {
        analytics.trackInteraction('web_vital', 'FCP', 'metric', { value: metric.value });
      });
      
      getLCP((metric) => {
        analytics.trackInteraction('web_vital', 'LCP', 'metric', { value: metric.value });
      });
      
      getTTFB((metric) => {
        analytics.trackInteraction('web_vital', 'TTFB', 'metric', { value: metric.value });
      });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // 这是一个监控组件，不渲染任何内容
}
```

**错误边界和错误监控**

```typescript
// components/monitoring/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { analytics } from '@/lib/analytics/tracker';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    analytics.trackInteraction('error', 'component_error', 'error', {
      error_message: error.message,
      error_stack: error.stack,
      component_stack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              出现了一些问题
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              页面遇到了错误，请刷新页面重试
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 部署和维护指南

### 环境变量配置

```bash
# .env.local
# Next.js
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Notion API
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_posts_database_id
NOTION_PROJECTS_DB=your_projects_database_id
NOTION_BOOKS_DB=your_books_database_id
NOTION_TOOLS_DB=your_tools_database_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_api_key

# 安全密钥
REVALIDATE_SECRET=your_revalidate_secret
SYNC_SECRET=your_sync_secret

# 缓存配置
CACHE_TTL=3600
```

### 部署脚本

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "sync-search": "node scripts/sync-search.js",
    "setup-db": "node scripts/setup-database.js",
    "deploy": "npm run build && npm run sync-search"
  }
}
```

```javascript
// scripts/sync-search.js
const { syncSearchIndexes } = require('../lib/algolia/sync');

async function main() {
  try {
    console.log('Syncing search indexes...');
    await syncSearchIndexes();
    console.log('Search indexes synced successfully');
  } catch (error) {
    console.error('Error syncing search indexes:', error);
    process.exit(1);
  }
}

main();
```

### 监控和维护

**健康检查API**

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { searchClient } from '@/lib/algolia/client';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {}
  };

  try {
    // 检查Supabase连接
    const supabase = createServerClient();
    const { data, error } = await supabase.from('users').select('count').limit(1);
    checks.services.supabase = error ? 'unhealthy' : 'healthy';

    // 检查Algolia连接
    try {
      await searchClient.listIndices();
      checks.services.algolia = 'healthy';
    } catch (error) {
      checks.services.algolia = 'unhealthy';
    }

    // 检查Notion API
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28'
        }
      });
      checks.services.notion = response.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      checks.services.notion = 'unhealthy';
    }

    // 检查整体状态
    const allHealthy = Object.values(checks.services).every(status => status === 'healthy');
    checks.status = allHealthy ? 'healthy' : 'degraded';

    return NextResponse.json(checks, { 
      status: allHealthy ? 200 : 503 
    });
  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error.message
    }, { status: 500 });
  }
}
```

这个完整的升级方案将把您的博客系统提升到专业级别，同时保持现有的优秀基础。通过三个阶段的渐进式升级，您将获得一个功能完整、性能优秀、用户体验卓越的现代化个人博客系统。

