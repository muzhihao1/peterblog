# 生产环境图片管理指南

网站已部署到 **petermu.com**，以下是推荐的图片管理方案。

## 🔒 安全说明

在生产环境（petermu.com），`/admin` 路由默认是被禁用的。如果您需要使用在线上传功能：

1. **设置环境变量**（在 Vercel 中）
   ```
   ADMIN_PASSWORD=your_secure_password
   ```

2. **访问方式**
   ```
   https://petermu.com/admin/images?password=your_secure_password
   ```

**建议**：为了安全，推荐使用下面的本地工具或 Cloudinary 管理界面。

## 🎯 推荐方案（按优先级排序）

### 方案一：使用 Cloudinary 管理界面（最简单）

1. **直接上传**
   - 登录 [Cloudinary Dashboard](https://cloudinary.com/console/media_library)
   - 点击 "Upload" 按钮
   - 选择对应的文件夹（blog/posts、blog/projects 等）
   - 上传图片

2. **获取链接**
   - 上传完成后，点击图片
   - 复制 "Secure URL"
   - 直接在 Notion 中使用

3. **优势**
   - ✅ 无需部署代码
   - ✅ 安全可靠
   - ✅ 支持批量上传
   - ✅ 可以直接管理和删除图片

### 方案二：本地脚本上传（推荐开发者）

1. **创建上传脚本** `upload-image.js`：
```javascript
const cloudinary = require('cloudinary').v2
const path = require('path')

// 配置（使用您的凭证）
cloudinary.config({
  cloud_name: 'dquszaj2f',
  api_key: '429452948875983',
  api_secret: 'n2XSyohIyHOXwvHzm-BG7oFT-HQ'
})

// 上传函数
async function uploadImage(imagePath, folder = 'posts') {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: `blog/${folder}`,
      transformation: [
        { quality: 'auto:best', fetch_format: 'auto' }
      ]
    })
    console.log('✅ 上传成功!')
    console.log('URL:', result.secure_url)
    console.log('用于 Notion:', result.secure_url)
    return result.secure_url
  } catch (error) {
    console.error('❌ 上传失败:', error)
  }
}

// 使用示例
const imagePath = process.argv[2]
const folder = process.argv[3] || 'posts'

if (!imagePath) {
  console.log('使用方法: node upload-image.js <图片路径> [文件夹]')
  console.log('文件夹选项: posts, projects, books, tools')
  process.exit(1)
}

uploadImage(imagePath, folder)
```

2. **使用方法**：
```bash
# 上传文章配图
node upload-image.js ./my-article-hero.jpg posts

# 上传项目截图
node upload-image.js ./project-screenshot.png projects

# 上传书籍封面
node upload-image.js ./book-cover.jpg books
```

### 方案三：浏览器书签工具（最便捷）

创建一个浏览器书签，点击即可快速上传：

1. **创建书签**
   - 名称：`上传到 Cloudinary`
   - URL：`https://cloudinary.com/console/c-dquszaj2f/media_library/folders/blog`

2. **使用流程**
   - 点击书签
   - 拖拽图片上传
   - 复制链接使用

### 方案四：移动端上传（随时随地）

1. **使用 Cloudinary App**
   - 下载 Cloudinary 移动应用
   - 登录账号
   - 直接从手机上传图片

2. **获取链接**
   - 上传后长按图片
   - 选择 "Copy URL"
   - 在 Notion App 中粘贴

## 📝 标准操作流程（SOP）

### 发布新文章时的配图流程

1. **准备图片**
   - 推荐尺寸：1920x1080（16:9）
   - 格式：JPG/PNG
   - 大小：< 2MB（会自动压缩）

2. **命名规范**
   ```
   文章: article-{date}-{title}.jpg
   项目: project-{name}-{type}.jpg
   书籍: book-{isbn}.jpg
   工具: tool-{name}-icon.png
   ```

3. **上传步骤**
   - 选择上述任一方案上传
   - 等待上传完成
   - 复制 Cloudinary URL

4. **在 Notion 中使用**
   - 打开对应的数据库
   - 编辑页面属性
   - 将 URL 粘贴到相应字段：
     - 文章：Cover 字段
     - 项目：Thumbnail/Screenshots 字段
     - 书籍：Cover 字段
     - 工具：Icon 字段

5. **验证**
   - 保存 Notion 页面
   - 访问 petermu.com 查看效果
   - 图片会自动优化显示

## 🔧 高级技巧

### 1. URL 参数优化

在 Cloudinary URL 后添加参数实现实时转换：

```
# 原始 URL
https://res.cloudinary.com/dquszaj2f/image/upload/v123/blog/posts/article.jpg

# 生成缩略图（300x200）
https://res.cloudinary.com/dquszaj2f/image/upload/w_300,h_200,c_fill/v123/blog/posts/article.jpg

# 自动格式和质量
https://res.cloudinary.com/dquszaj2f/image/upload/f_auto,q_auto/v123/blog/posts/article.jpg

# 人脸识别裁剪
https://res.cloudinary.com/dquszaj2f/image/upload/w_400,h_400,c_thumb,g_face/v123/blog/posts/article.jpg
```

### 2. 批量处理

如果需要批量上传多张图片：

```bash
# 创建批量上传脚本 batch-upload.sh
#!/bin/bash
for image in *.jpg; do
  node upload-image.js "$image" posts
  sleep 1
done
```

### 3. 从 URL 直接导入

如果图片已经在网上（如 Unsplash）：

```javascript
// 直接从 URL 上传到 Cloudinary
cloudinary.uploader.upload('https://unsplash.com/...', {
  folder: 'blog/posts',
  public_id: 'my-article-hero'
})
```

## 📊 图片规格建议

| 类型 | 推荐尺寸 | 格式 | 用途 |
|------|----------|------|------|
| 文章封面 | 1920x1080 | JPG | 文章列表和详情页 |
| 项目缩略图 | 1440x900 | JPG/PNG | 项目卡片 |
| 项目截图 | 1440x900 | PNG | 项目详情展示 |
| 书籍封面 | 400x600 | JPG | 书架展示 |
| 工具图标 | 512x512 | PNG/SVG | 工具列表 |
| 作者头像 | 400x400 | JPG | 个人信息 |

## 🚀 快速检查清单

发布内容前，确保：

- [ ] 图片已上传到 Cloudinary
- [ ] 获得了正确的 URL（https://res.cloudinary.com/dquszaj2f/...）
- [ ] URL 已更新到 Notion 对应字段
- [ ] 图片可以正常访问（在浏览器中打开 URL）
- [ ] 文件夹分类正确（posts/projects/books/tools）

## 💡 常见问题

**Q: 上传后图片不显示？**
A: 检查 URL 是否正确，确保是 `https://res.cloudinary.com/dquszaj2f/` 开头

**Q: 如何删除图片？**
A: 登录 Cloudinary 控制台，在 Media Library 中删除

**Q: 图片太大怎么办？**
A: Cloudinary 会自动压缩，但建议上传前用工具压缩到 2MB 以下

**Q: 可以用中文命名吗？**
A: 建议使用英文命名，避免编码问题

## 📱 微信/手机快速分享

1. 在手机上选择图片
2. 分享到 Cloudinary App
3. 自动上传并获得链接
4. 复制链接到 Notion

---

通过以上方案，您可以在任何地方、任何设备上轻松管理博客图片！