# Ghost 博客文章完整提取指南

## 当前状态

- Ghost 博客共有 **30 篇文章**
- 已提取到 JSON：**5 篇文章**（ghost_articles_extracted.json）
- 已导入 Notion：**10 篇文章**（其中 4 篇来自 JSON 文件）
- 待提取和导入：**约 20 篇文章**

## 方案一：使用 Ghost Content API（推荐）

### 1. 获取 Ghost Content API Key

1. 登录 Ghost 管理后台：https://pathlesspath.ghost.io/ghost/
2. 进入 Settings → Integrations
3. 点击 "Add custom integration"
4. 填写名称（如 "Article Export"）
5. 保存后复制 **Content API Key**

### 2. 安装依赖

```bash
npm install @tryghost/content-api
```

### 3. 运行提取脚本

1. 编辑 `extract-ghost-api.js`，将 `YOUR_CONTENT_API_KEY` 替换为你的 API Key
2. 运行脚本：

```bash
node extract-ghost-api.js
```

这会生成 `ghost_all_articles.json` 文件，包含所有文章的完整内容。

## 方案二：使用浏览器脚本（备选）

如果无法使用 API，可以使用浏览器脚本：

### 1. 提取文章列表

1. 登录 Ghost 管理后台：https://pathlesspath.ghost.io/ghost/#/posts
2. 打开浏览器开发者工具（F12）
3. 切换到 Console 标签
4. 复制 `browser-extract-ghost.js` 的全部内容并粘贴到控制台
5. 按 Enter 运行
6. 脚本会自动滚动页面并收集所有文章信息
7. 完成后会自动下载 JSON 文件

### 2. 获取文章详细内容（可选）

对于需要详细内容的文章：

1. 打开文章编辑页面
2. 在控制台运行 `extractSingleArticleContent()` 函数
3. 手动保存返回的内容

## 导入到 Notion

### 1. 使用智能导入脚本

新的导入脚本会自动检查已存在的文章，只导入缺失的：

```bash
node import-missing-articles.js
```

脚本特性：
- ✅ 自动检测 Notion 中已有的文章
- ✅ 支持多个 JSON 文件源
- ✅ 去重处理
- ✅ 只导入新文章
- ✅ 显示导入进度

### 2. 导入顺序

1. 首先运行一次，导入 `ghost_articles_extracted.json` 中缺失的文章
2. 使用 Ghost API 或浏览器脚本获取所有文章
3. 再次运行导入脚本，导入剩余的文章

## 文件说明

- `extract-ghost-api.js` - Ghost Content API 提取脚本
- `browser-extract-ghost.js` - 浏览器控制台提取脚本
- `import-missing-articles.js` - 智能导入脚本（检查重复）
- `import-ghost-to-notion.js` - 原始导入脚本
- `ghost_articles_extracted.json` - 已有的 5 篇文章
- `ghost_all_articles.json` - API 提取的所有文章（待生成）

## 常见问题

### Q: Ghost Content API Key 在哪里？
A: Settings → Integrations → Add custom integration

### Q: 为什么浏览器脚本只能获取文章列表？
A: Ghost 管理界面的文章列表页不包含完整内容，需要使用 API 或单独打开每篇文章

### Q: 导入时出现 "page not found" 错误？
A: 确保 Notion Integration 已连接到数据库，数据库 ID 正确

### Q: 如何处理重复文章？
A: 使用 `import-missing-articles.js`，它会自动检查并跳过已存在的文章

## 下一步

1. 使用 Ghost Content API 提取所有 30 篇文章
2. 运行 `import-missing-articles.js` 导入缺失的约 20 篇文章
3. 验证 Notion 数据库中所有文章是否正确导入