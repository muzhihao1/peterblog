# 部署说明 - Deployment Instructions

## 项目结构

此项目采用工作区结构，将可部署的博客应用与开发工具分离：

```
.
├── my-blog/              # ✅ 可部署的 Next.js 博客应用
│   ├── app/             # Next.js App Router
│   ├── components/      # React 组件
│   ├── lib/             # 核心功能库
│   ├── public/          # 静态资源
│   ├── package.json     # 项目依赖
│   └── ...              # 其他应用文件
│
├── docs/                 # 📚 项目文档（不部署）
├── SECURITY_CHECKLIST.md # 🔐 安全检查清单
├── README.md            # 📖 工作区说明
└── .env.local           # 🔑 本地环境变量（永不提交）
```

## Vercel 部署配置

在 Vercel 中部署时，需要配置：

### 1. Root Directory
设置 Root Directory 为 `my-blog`

### 2. Build & Development Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` 或使用默认设置
- **Output Directory**: `.next` 或使用默认设置
- **Install Command**: `npm install` 或使用默认设置

### 3. Environment Variables
在 Vercel 中设置以下环境变量：

```env
# Notion API (必需)
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_database_id
NOTION_PROJECTS_DB=your_projects_db_id
NOTION_BOOKS_DB=your_books_db_id
NOTION_TOOLS_DB=your_tools_db_id

# Supabase (必需)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 其他配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 本地开发

```bash
# 进入博客目录
cd my-blog

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env.local

# 编辑 .env.local 添加你的凭证

# 启动开发服务器
npm run dev
```

## 重要提醒

1. **只部署 `my-blog/` 文件夹**
2. **永不提交 `.env.local` 或任何包含凭证的文件**
3. **所有敏感脚本和工具保留在 `my-blog/` 外部**
4. **定期更新和轮换 API 密钥**

## GitHub Actions 部署（可选）

如果使用 GitHub Actions，创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./my-blog
```

## 故障排除

### 构建失败
- 确保所有环境变量已正确设置
- 检查 Root Directory 是否设置为 `my-blog`
- 查看构建日志中的具体错误信息

### 404 错误
- 确认部署的是 `my-blog` 目录而非根目录
- 检查 `vercel.json` 配置是否正确

### API 错误
- 验证 Notion 和 Supabase 凭证是否有效
- 检查 API 权限设置