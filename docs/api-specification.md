# API接口规范文档

## 概述

本文档定义了博客系统第二阶段所有API接口的统一规范，确保前后端对接顺畅。

## 基础规范

### 请求格式
- **基础URL**: `https://yourdomain.com/api`
- **Content-Type**: `application/json`
- **认证Header**: `Authorization: Bearer {token}`

### 响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功"
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 错误码规范
- `AUTH_REQUIRED` - 需要登录
- `AUTH_INVALID` - 认证失败
- `PERMISSION_DENIED` - 权限不足
- `NOT_FOUND` - 资源不存在
- `VALIDATION_ERROR` - 数据验证失败
- `SERVER_ERROR` - 服务器错误

## 认证相关API

### 1. GitHub OAuth登录
```
GET /api/auth/github
```
重定向到GitHub OAuth页面

### 2. OAuth回调
```
GET /api/auth/callback?code={code}
```
处理OAuth回调，返回用户信息和token

### 3. 获取当前用户
```
GET /api/auth/me
```

响应：
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "用户名",
    "avatar_url": "https://...",
    "created_at": "2025-01-09T..."
  }
}
```

### 4. 登出
```
POST /api/auth/logout
```

## 点赞相关API

### 1. 点赞/取消点赞
```
POST /api/likes
```

请求体：
```json
{
  "content_id": "article_id",
  "content_type": "post"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "liked": true,
    "like_count": 42
  }
}
```

### 2. 获取点赞状态
```
GET /api/likes/status?content_id={id}&content_type={type}
```

响应：
```json
{
  "success": true,
  "data": {
    "liked": false,
    "like_count": 41
  }
}
```

## 收藏相关API

### 1. 收藏/取消收藏
```
POST /api/bookmarks
```

请求体：
```json
{
  "content_id": "article_id",
  "content_type": "post"
}
```

### 2. 获取收藏列表
```
GET /api/bookmarks?page=1&limit=20&type={type}
```

响应：
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "bookmark_id",
        "content_id": "article_id",
        "content_type": "post",
        "content_title": "文章标题",
        "created_at": "2025-01-09T..."
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

## 评论相关API

### 1. 获取评论列表
```
GET /api/comments/{content_id}?page=1&limit=20
```

响应：
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "comment_id",
        "content": "评论内容",
        "user": {
          "id": "user_id",
          "name": "用户名",
          "avatar_url": "https://..."
        },
        "parent_id": null,
        "replies": [],
        "created_at": "2025-01-09T...",
        "updated_at": "2025-01-09T..."
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

### 2. 创建评论
```
POST /api/comments
```

请求体：
```json
{
  "content_id": "article_id",
  "content": "评论内容",
  "parent_id": null
}
```

### 3. 更新评论
```
PUT /api/comments/{comment_id}
```

请求体：
```json
{
  "content": "更新后的内容"
}
```

### 4. 删除评论
```
DELETE /api/comments/{comment_id}
```

## 用户行为追踪API

### 1. 记录行为
```
POST /api/analytics/actions
```

请求体：
```json
{
  "actions": [
    {
      "type": "page_view",
      "target_id": "article_id",
      "target_type": "post",
      "metadata": {
        "duration": 120,
        "scroll_depth": 75
      }
    }
  ]
}
```

### 2. 获取热门内容
```
GET /api/analytics/popular?type={type}&period={7d|30d|all}
```

## 用户资料API

### 1. 获取用户资料
```
GET /api/users/{user_id}/profile
```

### 2. 更新用户资料
```
PUT /api/users/profile
```

请求体：
```json
{
  "name": "新名称",
  "bio": "个人简介",
  "website": "https://...",
  "social_links": {
    "github": "username",
    "twitter": "username"
  }
}
```

### 3. 上传头像
```
POST /api/users/avatar
Content-Type: multipart/form-data
```

## 分页规范

所有列表接口支持分页：
- `page`: 页码，从1开始
- `limit`: 每页数量，默认20，最大100
- 响应包含 `total`、`page`、`limit` 字段

## 时间格式

所有时间字段使用ISO 8601格式：
```
2025-01-09T10:30:00.000Z
```

## 状态码使用

- `200 OK` - 成功获取资源
- `201 Created` - 成功创建资源
- `204 No Content` - 成功删除资源
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源不存在
- `500 Internal Server Error` - 服务器错误

## 版本控制

API版本通过URL路径控制：
- v1: `/api/v1/...`（当前版本）
- 未来版本：`/api/v2/...`