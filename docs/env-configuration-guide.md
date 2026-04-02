# 环境变量配置指南

## 概述

本文档详细说明了第二阶段开发所需的所有环境变量配置。

## 环境变量清单

### 1. Supabase配置（必需）

```bash
# Supabase项目URL
# 获取位置：Supabase Dashboard > Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xelyobfvfjqeuysfzpcf.supabase.co

# Supabase匿名密钥（客户端使用）
# 获取位置：Supabase Dashboard > Settings > API > Project API keys > anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase服务角色密钥（服务端使用，需要保密）
# 获取位置：Supabase Dashboard > Settings > API > Project API keys > service_role
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. GitHub OAuth配置（必需）

在Supabase Dashboard配置GitHub OAuth：

1. 访问：[Supabase Dashboard](https://supabase.com/dashboard/project/xelyobfvfjqeuysfzpcf/auth/providers)
2. 找到GitHub provider
3. 启用GitHub
4. 配置回调URL：`https://xelyobfvfjqeuysfzpcf.supabase.co/auth/v1/callback`

在GitHub创建OAuth App：

1. 访问：https://github.com/settings/developers
2. 创建新的OAuth App
3. 配置信息：
   - Application name: My Blog Auth
   - Homepage URL: https://yourdomain.com
   - Authorization callback URL: https://xelyobfvfjqeuysfzpcf.supabase.co/auth/v1/callback
4. 将Client ID和Client Secret填入Supabase

### 3. 开发环境配置

创建 `.env.local` 文件：

```bash
# 基础配置
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xelyobfvfjqeuysfzpcf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 现有的Notion配置（保持不变）
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_notion_database_id
NOTION_PROJECTS_DB=your_projects_db_id
NOTION_BOOKS_DB=your_books_db_id
NOTION_TOOLS_DB=your_tools_db_id

# 缓存配置
CACHE_TTL=3600000

# 安全配置（用于API路由保护）
REVALIDATE_SECRET=your_revalidate_secret_here
```

### 4. 生产环境配置（Vercel）

在Vercel Dashboard添加环境变量：

1. 访问：Project Settings > Environment Variables
2. 添加所有上述环境变量
3. 注意：`SUPABASE_SERVICE_ROLE_KEY` 只在生产环境添加，不要暴露

### 5. 类型安全配置

创建 `env.d.ts` 文件：

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY: string
      
      // Site
      NEXT_PUBLIC_SITE_URL?: string
      
      // Notion
      NOTION_TOKEN: string
      NOTION_DATABASE_ID: string
      NOTION_PROJECTS_DB: string
      NOTION_BOOKS_DB: string
      NOTION_TOOLS_DB: string
      
      // Cache
      CACHE_TTL?: string
      
      // Security
      REVALIDATE_SECRET?: string
    }
  }
}

export {}
```

## 配置验证脚本

创建 `scripts/validate-env.js`：

```javascript
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NOTION_TOKEN',
  'NOTION_DATABASE_ID'
]

const missing = required.filter(key => !process.env[key])

if (missing.length > 0) {
  console.error('❌ 缺少必需的环境变量:')
  missing.forEach(key => console.error(`  - ${key}`))
  process.exit(1)
}

console.log('✅ 所有必需的环境变量已配置')
```

## 安全注意事项

1. **永远不要提交 `.env.local` 文件到Git**
   - 确保 `.gitignore` 包含 `.env.local`
   
2. **服务端密钥必须保密**
   - `SUPABASE_SERVICE_ROLE_KEY` 只在服务端使用
   - 不要在客户端代码中使用
   
3. **使用环境变量验证**
   - 在应用启动时验证所有必需的环境变量
   - 使用上面的验证脚本

## 本地开发快速开始

1. 复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```

2. 填入实际的密钥值

3. 验证配置：
   ```bash
   node scripts/validate-env.js
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 故障排查

### 常见问题

1. **认证失败**
   - 检查 Supabase URL 和密钥是否正确
   - 确认 GitHub OAuth 回调URL配置正确

2. **环境变量未生效**
   - 重启开发服务器
   - 清除 `.next` 缓存目录

3. **生产环境问题**
   - 在Vercel确认所有环境变量已添加
   - 检查环境变量的作用域（Preview/Production）