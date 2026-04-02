/**
 * 将 Ghost 博客文章导入到 Notion 数据库
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
 * 将文章内容转换为 Notion 块格式
 */
function convertContentToBlocks(article) {
  const blocks = [];
  
  // 添加引言
  if (article.content.introduction) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: article.content.introduction.title || '引言' } }]
      }
    });
    
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: article.content.introduction.text || '' } }]
      }
    });
    
    if (article.content.introduction.quote) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: article.content.introduction.quote } }]
        }
      });
    }
  }
  
  // 添加各个章节
  if (article.content.sections) {
    article.content.sections.forEach(section => {
      // 章节标题
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: section.title } }]
        }
      });
      
      // 子章节
      if (section.subsections) {
        section.subsections.forEach(subsection => {
          // 子章节标题
          blocks.push({
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ type: 'text', text: { content: subsection.title } }]
            }
          });
          
          // 子章节内容
          if (subsection.content) {
            const paragraphs = subsection.content.split('\n\n');
            paragraphs.forEach(paragraph => {
              if (paragraph.trim()) {
                blocks.push({
                  object: 'block',
                  type: 'paragraph',
                  paragraph: {
                    rich_text: [{ type: 'text', text: { content: paragraph.trim() } }]
                  }
                });
              }
            });
          }
          
          // 引用
          if (subsection.quote) {
            blocks.push({
              object: 'block',
              type: 'quote',
              quote: {
                rich_text: [{ type: 'text', text: { content: subsection.quote } }]
              }
            });
          }
        });
      }
    });
  }
  
  // 添加总结
  if (article.content.conclusion) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: article.content.conclusion.title || '结语' } }]
      }
    });
    
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: article.content.conclusion.text || '' } }]
      }
    });
    
    if (article.content.conclusion.callToAction) {
      blocks.push({
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [{ type: 'text', text: { content: article.content.conclusion.callToAction } }],
          icon: { emoji: '💡' }
        }
      });
    }
  }
  
  return blocks;
}

/**
 * 生成 URL 友好的 slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // 保留字母、数字、中文和连字符
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 将文章导入到 Notion
 */
async function importArticleToNotion(article) {
  try {
    // 准备页面属性
    const properties = {
      Title: {
        title: [
          {
            text: {
              content: article.title
            }
          }
        ]
      },
      Slug: {
        rich_text: [
          {
            text: {
              content: generateSlug(article.title)
            }
          }
        ]
      },
      Date: {
        date: {
          start: formatDate(article.date)
        }
      },
      AuthorName: {
        rich_text: [
          {
            text: {
              content: article.author || 'Zhihao Mu'
            }
          }
        ]
      },
      Published: {
        checkbox: true
      },
      Category: {
        select: {
          name: 'Blog'
        }
      },
      Tags: {
        multi_select: [
          { name: 'Ghost导入' },
          { name: '博客' }
        ]
      }
    };
    
    // 如果有摘要，添加摘要
    if (article.content.introduction && article.content.introduction.text) {
      properties.Excerpt = {
        rich_text: [
          {
            text: {
              content: article.content.introduction.text.substring(0, 200) + '...'
            }
          }
        ]
      };
    }
    
    // 创建页面
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
      children: convertContentToBlocks(article)
    });
    
    console.log(`✅ 成功导入文章: ${article.title}`);
    return response;
  } catch (error) {
    console.error(`❌ 导入文章失败: ${article.title}`, error);
    throw error;
  }
}

/**
 * 格式化日期为 ISO 格式
 */
function formatDate(dateString) {
  // 处理类似 "29 Apr 2025" 的格式
  const months = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };
  
  const parts = dateString.split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  // 尝试直接解析
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  // 默认返回今天
  return new Date().toISOString().split('T')[0];
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始导入 Ghost 文章到 Notion...\n');
    
    // 检查环境变量
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
      console.error('❌ 错误: 请在 .env.local 文件中配置 NOTION_TOKEN 和 NOTION_DATABASE_ID');
      console.log('\n请按照以下步骤配置:');
      console.log('1. 访问 https://www.notion.so/my-integrations');
      console.log('2. 创建一个新的集成，获取 Token');
      console.log('3. 在你的 Notion 数据库中，点击 "..." -> "Add connections" 添加你的集成');
      console.log('4. 复制数据库 ID (在数据库 URL 中)');
      console.log('5. 将这些信息填入 .env.local 文件');
      return;
    }
    
    // 读取 Ghost 文章数据
    const filePath = path.join(__dirname, 'ghost_articles_extracted.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (!data.articles || data.articles.length === 0) {
      console.log('❌ 没有找到要导入的文章');
      return;
    }
    
    console.log(`📚 找到 ${data.articles.length} 篇文章\n`);
    
    // 逐个导入文章
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < data.articles.length; i++) {
      const article = data.articles[i];
      console.log(`[${i + 1}/${data.articles.length}] 正在导入: ${article.title}`);
      
      try {
        await importArticleToNotion(article);
        successCount++;
        
        // 添加延迟，避免触发 Notion API 速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        failCount++;
        console.error(`导入失败: ${error.message}`);
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