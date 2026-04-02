# 用户功能测试指南

## 概述
本文档说明如何测试Terminal B开发的用户交互功能。所有功能目前使用Mock数据，可以独立运行。

## 测试准备

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 访问 http://localhost:3000

## 功能测试

### 1. 点赞收藏功能
- 打开任意文章页面（如 `/posts/welcome-to-my-blog`）
- 查看文章底部的交互按钮
- 测试点赞动画（心形放大效果）
- 测试收藏动画（书签弹跳效果）
- 测试分享功能（复制链接）

### 2. 用户行为追踪（后台运行）
- 打开浏览器开发者工具的Network标签
- 浏览页面时观察 `/api/analytics/actions` 的请求
- 滚动页面查看滚动深度追踪
- 检查批量发送机制（每5秒或10条记录）

### 3. 用户认证（Mock模式）
- 点击页面右上角的"登录"按钮
- 在弹窗中选择GitHub或Google登录
- 登录后会跳转到个人主页
- 查看右上角的用户头像下拉菜单

### 4. 个人中心功能

#### 个人主页 `/profile`
- 查看用户基本信息
- 查看统计数据（评论、点赞、收藏、阅读）
- 点击"编辑资料"按钮

#### 编辑资料 `/profile/edit`
- 测试头像上传UI（选择图片查看预览）
- 编辑基本信息（姓名、简介、网站）
- 设置社交账号（GitHub、Twitter）
- 切换通知设置
- 保存更改（Mock保存）

#### 收藏管理 `/profile/bookmarks`
- 查看收藏列表
- 使用搜索功能
- 切换内容类型筛选
- 测试批量选择和删除
- 点击标题跳转到原文

#### 评论历史 `/profile/comments`
- 查看评论列表
- 测试评论编辑功能
- 测试评论删除确认
- 查看回复提醒标记
- 点击标题跳转到原文

## Mock数据说明

### 登录状态
- 使用localStorage存储Mock登录状态
- key: `mock-auth`
- value: `"true"` 表示已登录

### Mock用户数据
```javascript
{
  id: 'mock-user-id',
  email: 'user@example.com',
  username: 'testuser',
  full_name: '测试用户',
  bio: '这是一段个人简介...',
  stats: {
    total_comments: 42,
    total_likes: 156,
    total_bookmarks: 23,
    total_posts_read: 89
  }
}
```

### Mock内容数据
- 4条收藏记录（文章、项目、书籍、工具各一条）
- 4条评论记录（包含回复和未读提醒）

## 注意事项

1. **数据持久化**：Mock数据不会真正保存，刷新页面会重置
2. **API调用**：所有API路由返回Mock响应，有500ms延迟模拟网络请求
3. **认证状态**：使用localStorage，清除浏览器数据会退出登录
4. **图片上传**：仅预览，不会真正上传到服务器

## 与真实API对接准备

### 环境变量切换
```env
# .env.local
NEXT_PUBLIC_USE_MOCK=false  # 切换到真实API
```

### API适配层
所有API调用都预留了适配层接口，便于后续切换：
```typescript
const api = process.env.NEXT_PUBLIC_USE_MOCK === 'true' 
  ? mockAPI 
  : supabaseAPI
```

## 已知限制

1. 头像上传仅UI展示，需要Supabase Storage
2. OAuth登录需要真实的认证配置
3. 实时通知需要WebSocket连接
4. 数据统计需要真实的数据库查询

## 反馈和问题

如发现任何UI问题或功能异常，请记录：
- 操作步骤
- 预期结果
- 实际结果
- 浏览器控制台错误（如有）