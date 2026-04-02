# 内容创作与发布指南

## 📋 内容发布流程概览

### 1. 写文章流程
1. 登录 Notion，进入 Posts 数据库
2. 创建新页面，填写必需字段：
   - **Title**（标题）- 必填
   - **Author**（作者）- 必填，默认设置为你的名字
   - **Date**（日期）- 必填，发布日期
   - **Category**（分类）- 选择：Technology、Design、Productivity、Life
   - **Tags**（标签）- 多选，用于文章分类
   - **Excerpt**（摘要）- 文章简介，显示在列表页
   - **Slug**（URL路径）- 自定义URL，如 `my-first-post`
3. 在页面内容区撰写正文
4. 保存后等待 1-2 分钟，网站会自动同步

### 2. 配图最佳实践

#### 推荐的图片来源（已配置CDN）：
- **Unsplash**: `https://images.unsplash.com/...`
- **Notion**: 直接上传到 Notion 页面
- **豆瓣**: 书籍封面使用豆瓣图片链接
- **GitHub**: 存储在仓库 `public/images/` 目录

#### 图片使用指南：
```markdown
# 文章封面图
- 推荐尺寸：1920x1080 或 16:9 比例
- 格式：JPG/PNG/WebP
- 大小：建议 < 500KB

# 文章内图片
- 使用 Notion 内置图片块
- 支持图片说明文字
- 自动响应式适配

# 项目截图
- 推荐尺寸：1440x900
- 可以使用多张展示不同功能
```

### 3. 各内容类型字段说明

#### 📝 文章 (Posts)
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Title | 文本 | ✅ | 文章标题 |
| Author | 文本 | ✅ | 作者名称 |
| Date | 日期 | ✅ | 发布日期 |
| Category | 单选 | ✅ | 文章分类 |
| Tags | 多选 | ❌ | 标签列表 |
| Excerpt | 文本 | ❌ | 文章摘要 |
| Slug | 文本 | ❌ | 自定义URL |

#### 🚀 项目 (Projects)
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Title | 文本 | ✅ | 项目名称 |
| Description | 文本 | ✅ | 项目简介 |
| Category | 单选 | ✅ | website/opensource/design/other |
| Status | 单选 | ✅ | active/completed/archived |
| TechStack | 多选 | ✅ | 技术栈 |
| Thumbnail | 图片 | ✅ | 项目缩略图 |
| Screenshots | 图片 | ❌ | 项目截图 |
| DemoUrl | URL | ❌ | 演示链接 |
| GithubUrl | URL | ❌ | GitHub链接 |
| StartDate | 日期 | ✅ | 开始日期 |
| EndDate | 日期 | ❌ | 结束日期 |

#### 📚 书籍 (Books)
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Title | 文本 | ✅ | 书名 |
| Author | 文本 | ✅ | 作者 |
| Status | 单选 | ✅ | read/reading/want-to-read |
| Cover | 图片 | ✅ | 封面图 |
| Rating | 数字 | ❌ | 评分(1-5) |
| StartDate | 日期 | ❌ | 开始阅读日期 |
| FinishDate | 日期 | ❌ | 完成阅读日期 |
| Takeaways | 文本 | ❌ | 主要收获 |
| Notes | 文本 | ❌ | 读书笔记 |

#### 🛠️ 工具 (Tools)
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Name | 文本 | ✅ | 工具名称 |
| Description | 文本 | ✅ | 工具描述 |
| Category | 单选 | ✅ | 工具分类 |
| Icon | 图片 | ❌ | 工具图标 |
| UseCases | 文本 | ❌ | 使用场景 |
| Alternatives | 文本 | ❌ | 替代工具 |

## 🚀 快速操作流程

### 发布新文章
```bash
1. 打开 Notion → Posts 数据库
2. 点击 "New" → 选择 "Empty page"
3. 填写标题、作者、日期、分类
4. 撰写内容（支持 Markdown）
5. 添加封面图（可选）
6. 保存 → 等待同步
```

### 添加项目
```bash
1. 打开 Notion → Projects 数据库
2. 填写项目信息
3. 上传缩略图和截图
4. 添加技术栈标签
5. 填写项目详情
6. 保存 → 自动发布
```

## 🖼️ 图片优化方案

### 方案一：使用 GitHub（推荐）
1. 将图片放入 `public/images/` 目录
2. 提交到 GitHub
3. 在 Notion 中使用：`/images/your-image.jpg`

### 方案二：使用图床服务
推荐免费图床：
- [SM.MS](https://sm.ms/) - 免费5GB
- [Cloudinary](https://cloudinary.com/) - 免费额度充足
- [ImgBB](https://imgbb.com/) - 免费无限空间

### 方案三：Notion 直接上传
- 优点：操作简单，管理方便
- 缺点：有容量限制，国内访问可能较慢

## 📊 内容管理最佳实践

1. **定期更新**：建议每周至少发布一篇内容
2. **标签管理**：保持标签的一致性，避免重复
3. **SEO 优化**：
   - 使用描述性的标题
   - 填写完整的摘要
   - 合理使用标签
4. **图片优化**：
   - 压缩图片大小
   - 使用合适的格式
   - 添加 alt 文本

## 🔧 常见问题解决

### Q: 发布后没有立即显示？
A: 等待 1-2 分钟，或手动触发重新部署

### Q: 图片加载很慢？
A: 使用图片压缩工具，推荐 [TinyPNG](https://tinypng.com/)

### Q: 如何批量导入内容？
A: 可以使用 Notion 的 CSV 导入功能

### Q: 如何备份内容？
A: Notion 自动保存所有版本历史，也可定期导出

## 💡 进阶技巧

1. **使用模板**：在 Notion 中为每种内容类型创建模板
2. **自动化**：使用 Zapier 连接 Notion 和其他服务
3. **协作**：邀请其他人共同管理内容
4. **分析**：查看网站分析数据，了解热门内容

---

更新日期：2024-12-19
作者：Peter Mu