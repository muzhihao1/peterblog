/**
 * 导入缺失的文章到 Notion
 * 会检查 Notion 中已有的文章，只导入新文章
 */

const { Client } = require('@notionhq/client');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 初始化 Notion 客户端
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * 获取 Notion 中已有的文章标题列表
 */
async function getExistingArticleTitles() {
  const existingTitles = new Set();
  let hasMore = true;
  let startCursor;
  
  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 100
    });
    
    response.results.forEach(page => {
      const title = page.properties.Title?.title?.[0]?.text?.content;
      if (title) {
        existingTitles.add(title);
      }
    });
    
    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }
  
  return existingTitles;
}

/**
 * 生成 URL 友好的 slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 将简单文章数据转换为 Notion 页面
 */
async function importSimpleArticle(article) {
  const properties = {
    Title: {
      title: [{
        text: { content: article.title }
      }]
    },
    Slug: {
      rich_text: [{
        text: { content: article.slug || generateSlug(article.title) }
      }]
    },
    Date: {
      date: {
        start: formatDate(article.date || article.published_at)
      }
    },
    AuthorName: {
      rich_text: [{
        text: { content: article.author || 'Zhihao Mu' }
      }]
    },
    Published: {
      checkbox: true
    },
    Category: {
      select: { name: 'Blog' }
    },
    Tags: {
      multi_select: [
        { name: 'Ghost导入' },
        ...(article.tags || []).map(tag => ({ name: tag }))
      ]
    }
  };
  
  // 如果有摘要，添加摘要
  if (article.excerpt || article.content?.excerpt) {
    properties.Excerpt = {
      rich_text: [{
        text: { 
          content: (article.excerpt || article.content?.excerpt || '').substring(0, 200) 
        }
      }]
    };
  }
  
  // 如果有阅读时间
  if (article.reading_time) {
    properties.ReadTime = {
      rich_text: [{
        text: { content: `${article.reading_time} min read` }
      }]
    };
  }
  
  // 创建页面内容块
  const children = [];
  
  // 添加基本内容
  if (article.content?.plaintext) {
    // 将纯文本分段
    const paragraphs = article.content.plaintext.split('\n\n');
    paragraphs.forEach(para => {
      if (para.trim()) {
        children.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: para.trim() } }]
          }
        });
      }
    });
  } else {
    // 如果没有详细内容，添加占位符
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { content: '此文章从 Ghost 导入，详细内容请访问原始博客查看。' } 
        }]
      }
    });
    
    if (article.url) {
      children.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ 
            type: 'text', 
            text: { 
              content: `原文链接：${article.url}`,
              link: { url: article.url }
            } 
          }]
        }
      });
    }
  }
  
  // 创建页面
  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: properties,
    children: children
  });
  
  return response;
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  // 处理各种日期格式
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  // 处理 "29 Apr 2025" 格式
  const months = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };
  
  const parts = dateString.split(' ');
  if (parts.length === 3 && months[parts[1]]) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  return new Date().toISOString().split('T')[0];
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始导入缺失的 Ghost 文章到 Notion...\n');
    
    // 检查环境变量
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
      console.error('❌ 错误: 请配置 NOTION_TOKEN 和 NOTION_DATABASE_ID');
      return;
    }
    
    // 获取 Notion 中已有的文章
    console.log('📋 获取 Notion 中已有的文章...');
    const existingTitles = await getExistingArticleTitles();
    console.log(`✅ Notion 中已有 ${existingTitles.size} 篇文章\n`);
    
    // 读取要导入的文章
    const files = [
      'ghost_articles_extracted.json',
      'ghost_all_articles.json',
      // 添加浏览器导出的文件（如果存在）
    ];
    
    let allArticles = [];
    
    for (const fileName of files) {
      try {
        const filePath = path.join(__dirname, fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        if (data.articles && Array.isArray(data.articles)) {
          console.log(`📄 从 ${fileName} 读取了 ${data.articles.length} 篇文章`);
          allArticles = allArticles.concat(data.articles);
        }
      } catch (err) {
        // 文件不存在或解析错误，跳过
      }
    }
    
    // 去重
    const uniqueArticles = new Map();
    allArticles.forEach(article => {
      if (!uniqueArticles.has(article.title)) {
        uniqueArticles.set(article.title, article);
      }
    });
    
    console.log(`\n📚 总共找到 ${uniqueArticles.size} 篇独特文章`);
    
    // 筛选出需要导入的文章
    const articlesToImport = [];
    for (const [title, article] of uniqueArticles) {
      if (!existingTitles.has(title)) {
        articlesToImport.push(article);
      }
    }
    
    console.log(`📝 需要导入 ${articlesToImport.length} 篇新文章\n`);
    
    if (articlesToImport.length === 0) {
      console.log('✅ 所有文章都已存在于 Notion 中！');
      return;
    }
    
    // 显示将要导入的文章
    console.log('将要导入以下文章：');
    articlesToImport.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.date || '未知日期'})`);
    });
    console.log('');
    
    // 逐个导入文章
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < articlesToImport.length; i++) {
      const article = articlesToImport[i];
      console.log(`[${i + 1}/${articlesToImport.length}] 正在导入: ${article.title}`);
      
      try {
        await importSimpleArticle(article);
        successCount++;
        console.log(`✅ 成功导入`);
        
        // 添加延迟，避免触发 API 速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        failCount++;
        console.error(`❌ 导入失败: ${error.message}`);
      }
    }
    
    console.log('\n✨ 导入完成!');
    console.log(`✅ 成功: ${successCount} 篇`);
    console.log(`❌ 失败: ${failCount} 篇`);
    
  } catch (error) {
    console.error('❌ 导入过程中发生错误:', error);
  }
}

// 运行主函数
main();