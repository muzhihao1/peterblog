/**
 * 通过 Ghost Content API 提取所有文章
 * 需要先在 Ghost 管理面板中创建自定义集成获取 API Key
 */

const GhostContentAPI = require('@tryghost/content-api');
const fs = require('fs').promises;
const path = require('path');

// Ghost API 配置
// 请在 Ghost Admin > Integrations > Add custom integration 创建集成
const GHOST_URL = 'https://pathlesspath.ghost.io';
const CONTENT_API_KEY = 'YOUR_CONTENT_API_KEY'; // 替换为你的 Content API Key

// 初始化 Ghost API
const api = new GhostContentAPI({
  url: GHOST_URL,
  key: CONTENT_API_KEY,
  version: 'v5.0'
});

/**
 * 提取所有已发布的文章
 */
async function extractAllPosts() {
  try {
    console.log('🚀 开始从 Ghost API 提取文章...\n');
    
    const allPosts = [];
    let page = 1;
    const limit = 15;
    let hasMore = true;
    
    // 分页获取所有文章
    while (hasMore) {
      console.log(`📄 获取第 ${page} 页文章...`);
      
      const posts = await api.posts.browse({
        limit: limit,
        page: page,
        include: 'tags,authors',
        formats: ['html', 'plaintext'],
        order: 'published_at DESC'
      });
      
      if (posts.length > 0) {
        allPosts.push(...posts);
        console.log(`✅ 获取了 ${posts.length} 篇文章`);
        
        if (posts.length < limit) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }
    
    console.log(`\n📚 总共获取了 ${allPosts.length} 篇文章\n`);
    
    // 转换为统一格式
    const formattedArticles = allPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      author: post.primary_author ? post.primary_author.name : 'Unknown',
      date: new Date(post.published_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Published',
      content: {
        html: post.html,
        plaintext: post.plaintext,
        excerpt: post.excerpt || post.custom_excerpt || ''
      },
      tags: post.tags ? post.tags.map(tag => tag.name) : [],
      feature_image: post.feature_image,
      url: post.url,
      reading_time: post.reading_time,
      created_at: post.created_at,
      updated_at: post.updated_at,
      published_at: post.published_at
    }));
    
    // 保存到文件
    const outputPath = path.join(__dirname, 'ghost_all_articles.json');
    await fs.writeFile(
      outputPath,
      JSON.stringify({ 
        articles: formattedArticles,
        total: formattedArticles.length,
        extracted_at: new Date().toISOString()
      }, null, 2)
    );
    
    console.log(`✅ 文章已保存到: ${outputPath}`);
    
    // 显示文章列表
    console.log('\n📋 文章列表：');
    formattedArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.date})`);
    });
    
  } catch (error) {
    console.error('❌ 提取文章时出错:', error);
    console.log('\n请检查：');
    console.log('1. Content API Key 是否正确');
    console.log('2. Ghost 站点 URL 是否正确');
    console.log('3. 是否已安装 @tryghost/content-api：npm install @tryghost/content-api');
  }
}

// 运行提取
extractAllPosts();