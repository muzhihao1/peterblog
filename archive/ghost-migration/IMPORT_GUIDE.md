# Ghost 文章导入 Notion 指南

## 准备工作

### 1. 配置 Notion Integration

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 点击 "New integration" 创建新的集成
3. 填写基本信息：
   - Name: Ghost Blog Import
   - Associated workspace: 选择你的工作空间
   - 点击 "Submit"
4. 复制生成的 "Internal Integration Token"

### 2. 创建 Notion 数据库

1. 在 Notion 中创建一个新的数据库页面
2. 添加以下属性（属性名必须完全一致）：
   - **Title** (标题) - Title 类型
   - **Slug** (URL标识) - Text 类型
   - **Date** (日期) - Date 类型
   - **AuthorName** (作者) - Text 类型
   - **AuthorAvatar** (头像) - URL 类型
   - **Published** (已发布) - Checkbox 类型
   - **Category** (分类) - Select 类型
   - **Tags** (标签) - Multi-select 类型
   - **Excerpt** (摘要) - Text 类型
   - **ReadTime** (阅读时间) - Text 类型

### 3. 连接 Integration 到数据库

1. 在你的 Notion 数据库页面，点击右上角的 "..."
2. 选择 "Add connections"
3. 搜索并选择你刚创建的 "Ghost Blog Import" integration

### 4. 获取数据库 ID

1. 在浏览器中打开你的 Notion 数据库
2. 查看 URL，格式类似：
   ```
   https://www.notion.so/your-workspace/Database-Name-1234567890abcdef1234567890abcdef?v=...
   ```
3. 数据库 ID 是 URL 中的 32 位字符串：`1234567890abcdef1234567890abcdef`

## 配置环境变量

编辑 `.env.local` 文件，填入你的配置：

```bash
# Notion 配置
NOTION_TOKEN=你的_Integration_Token
NOTION_DATABASE_ID=你的数据库_ID

# 缓存配置（可选）
CACHE_TTL=3600000  # 1小时

# 其他配置
NODE_ENV=production
```

## 安装依赖

在项目根目录运行：

```bash
npm install @notionhq/client dotenv
```

## 运行导入脚本

```bash
node import-ghost-to-notion.js
```

## 注意事项

1. **API 速率限制**：脚本已经添加了 1 秒的延迟，避免触发 Notion API 的速率限制
2. **重复导入**：如果需要重新导入，请先在 Notion 中删除之前导入的文章
3. **文章格式**：脚本会自动将 Ghost 文章的结构转换为 Notion 的块格式
4. **错误处理**：如果某篇文章导入失败，脚本会继续导入其他文章

## 验证导入

导入完成后，你可以：

1. 检查 Notion 数据库，确认文章是否正确导入
2. 访问你的博客网站，查看文章是否正常显示
3. 检查文章内容格式是否正确

## 故障排除

### 常见错误

1. **"NOTION_TOKEN environment variable is required"**
   - 确保 `.env.local` 文件存在且配置正确
   - 确保在正确的目录下运行脚本

2. **"notion_1.Client is not a constructor"**
   - 确保已安装 `@notionhq/client` 包
   - 运行 `npm install @notionhq/client`

3. **"Unauthorized"**
   - 检查 Integration Token 是否正确
   - 确保 Integration 已连接到数据库

4. **"Database not found"**
   - 检查数据库 ID 是否正确
   - 确保数据库页面是 Database 类型，不是普通页面