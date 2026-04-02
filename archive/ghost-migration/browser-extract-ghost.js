/**
 * 浏览器控制台脚本 - 从 Ghost 管理界面提取所有文章
 * 使用方法：
 * 1. 登录 Ghost 管理后台 (https://pathlesspath.ghost.io/ghost/#/posts)
 * 2. 打开浏览器开发者工具 (F12)
 * 3. 切换到 Console 标签
 * 4. 复制粘贴整个脚本并运行
 */

(async function extractGhostArticles() {
  console.log('🚀 开始提取 Ghost 文章...');
  
  const articles = [];
  let pageNum = 1;
  let hasMore = true;
  
  // 获取当前页面的文章列表
  function getArticlesFromPage() {
    const articleElements = document.querySelectorAll('.gh-posts-list-item');
    const pageArticles = [];
    
    articleElements.forEach(el => {
      try {
        // 提取文章信息
        const titleEl = el.querySelector('.gh-content-entry-title');
        const title = titleEl ? titleEl.textContent.trim() : 'Untitled';
        
        const linkEl = el.querySelector('a.gh-list-data');
        const href = linkEl ? linkEl.getAttribute('href') : '';
        const postId = href.match(/posts\/([^\/]+)/)?.[1] || '';
        
        const statusEl = el.querySelector('.gh-content-entry-status');
        const status = statusEl ? statusEl.textContent.trim() : 'Published';
        
        const dateEl = el.querySelector('.gh-content-entry-date');
        const dateText = dateEl ? dateEl.textContent.trim() : '';
        
        const authorEl = el.querySelector('.gh-content-entry-author');
        const author = authorEl ? authorEl.textContent.trim() : 'Unknown';
        
        // 提取标签
        const tags = [];
        el.querySelectorAll('.gh-content-entry-tag').forEach(tagEl => {
          tags.push(tagEl.textContent.trim());
        });
        
        pageArticles.push({
          id: postId,
          title: title,
          author: author,
          date: dateText,
          status: status,
          tags: tags,
          href: href
        });
      } catch (err) {
        console.error('提取文章信息时出错:', err);
      }
    });
    
    return pageArticles;
  }
  
  // 滚动到底部以加载更多文章
  async function scrollToLoadMore() {
    const scrollElement = document.querySelector('.gh-main');
    if (!scrollElement) return false;
    
    const previousHeight = scrollElement.scrollHeight;
    scrollElement.scrollTo(0, scrollElement.scrollHeight);
    
    // 等待新内容加载
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newHeight = scrollElement.scrollHeight;
    return newHeight > previousHeight;
  }
  
  // 主循环 - 滚动并收集文章
  while (hasMore) {
    console.log(`📄 正在获取第 ${pageNum} 批文章...`);
    
    // 获取当前页面的文章
    const pageArticles = getArticlesFromPage();
    
    // 去重并添加到总列表
    pageArticles.forEach(article => {
      if (!articles.find(a => a.id === article.id)) {
        articles.push(article);
      }
    });
    
    console.log(`✅ 当前已收集 ${articles.length} 篇文章`);
    
    // 尝试加载更多
    hasMore = await scrollToLoadMore();
    pageNum++;
    
    // 防止无限循环
    if (pageNum > 20) {
      console.log('⚠️ 已达到最大页数限制');
      break;
    }
  }
  
  console.log(`\n📚 总共提取了 ${articles.length} 篇文章`);
  
  // 显示文章列表
  console.log('\n📋 文章列表：');
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title} (${article.date})`);
  });
  
  // 创建下载文件
  const exportData = {
    articles: articles,
    total: articles.length,
    extracted_at: new Date().toISOString(),
    site_url: window.location.origin
  };
  
  // 创建下载链接
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ghost_articles_browser_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('\n✅ 文章数据已下载到你的默认下载文件夹');
  console.log('📌 文件名:', link.download);
  
  // 返回结果供进一步处理
  return articles;
})();

/**
 * 补充脚本：获取单篇文章的详细内容
 * 在文章编辑页面运行此脚本
 */
function extractSingleArticleContent() {
  const editor = document.querySelector('.koenig-editor');
  if (!editor) {
    console.error('未找到编辑器，请确保在文章编辑页面运行此脚本');
    return null;
  }
  
  const sections = [];
  
  // 提取所有卡片内容
  editor.querySelectorAll('[data-kg-card]').forEach(card => {
    const cardType = card.getAttribute('data-kg-card');
    
    if (cardType === 'markdown') {
      const content = card.querySelector('.CodeMirror-code');
      if (content) {
        sections.push({
          type: 'markdown',
          content: content.textContent
        });
      }
    } else if (cardType === 'html') {
      const content = card.querySelector('.CodeMirror-code');
      if (content) {
        sections.push({
          type: 'html',
          content: content.textContent
        });
      }
    } else if (cardType === 'image') {
      const img = card.querySelector('img');
      if (img) {
        sections.push({
          type: 'image',
          src: img.src,
          alt: img.alt || '',
          caption: card.querySelector('figcaption')?.textContent || ''
        });
      }
    } else {
      // 处理段落文本
      const textContent = card.textContent?.trim();
      if (textContent) {
        sections.push({
          type: 'text',
          content: textContent
        });
      }
    }
  });
  
  return sections;
}