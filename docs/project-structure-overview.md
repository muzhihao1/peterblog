# 项目结构概览

## 认证系统文件
```
app/
├── api/auth/
│   ├── login/route.ts      # GitHub OAuth登录
│   ├── logout/route.ts     # 登出功能
│   └── user/route.ts       # 获取用户信息
├── auth/
│   └── callback/route.ts   # OAuth回调处理
lib/
├── supabase/
│   ├── client.ts          # 客户端配置
│   ├── server.ts          # 服务端配置
│   └── admin.ts           # 管理员配置
├── auth/
│   └── middleware.ts      # 认证中间件
components/
├── auth/
│   ├── AuthButton.tsx     # 登录/登出按钮
│   └── LoginModal.tsx     # 登录弹窗
contexts/
└── AuthContext.tsx        # 认证状态管理
```

## 交互功能文件
```
app/api/
├── likes/route.ts         # 点赞API
├── bookmarks/route.ts     # 收藏API
├── analytics/
│   ├── actions/route.ts   # 行为记录
│   ├── stats/route.ts     # 统计数据
│   └── popular/route.ts   # 热门内容
components/
├── interactions/
│   ├── InteractionButtons.tsx
│   ├── LikeButton.tsx
│   ├── BookmarkButton.tsx
│   └── ShareButton.tsx
hooks/
├── useInteractions.ts     # 交互状态管理
└── usePageView.ts         # 页面浏览追踪
lib/analytics/
└── tracker.ts             # 行为追踪库
```

## 用户中心文件
```
app/profile/
├── page.tsx              # 个人主页
├── edit/page.tsx         # 编辑资料
├── bookmarks/page.tsx    # 收藏管理
└── comments/page.tsx     # 评论历史
```

## 性能优化文件
```
components/ui/
├── LazyLoad.tsx          # 懒加载组件
├── OptimizedImage.tsx    # 优化图片组件
├── Skeleton.tsx          # 骨架屏（待创建）
└── VirtualList.tsx       # 虚拟列表（待创建）
```

## 数据库架构
```
scripts/
└── supabase-init.sql     # 数据库初始化脚本
    ├── user_profiles     # 用户资料表
    ├── comments          # 评论表
    ├── likes             # 点赞表
    ├── bookmarks         # 收藏表
    └── user_actions      # 行为追踪表
```

## 文档资源
```
docs/
├── supabase-setup-guide.md           # Supabase设置指南
├── api-specification.md              # API接口规范
├── env-configuration-guide.md        # 环境变量配置
├── api-implementation-examples.md    # API实现示例
├── integration-test-plan.md          # 集成测试计划
└── project-structure-overview.md     # 项目结构概览（本文档）
```