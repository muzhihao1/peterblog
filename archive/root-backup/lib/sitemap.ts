import { getAllPosts } from '@/lib/notion'
import { getAllProjects } from '@/lib/notion/projects'
import { getAllTools } from '@/lib/notion/tools'
import { getAllBooks } from '@/lib/notion/books'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export async function generateSitemapUrls(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = []
  
  // Static pages
  const staticPages = [
    { path: '/', changefreq: 'daily' as const, priority: 1.0 },
    { path: '/about', changefreq: 'monthly' as const, priority: 0.8 },
    { path: '/blog', changefreq: 'daily' as const, priority: 0.9 },
    { path: '/projects', changefreq: 'weekly' as const, priority: 0.8 },
    { path: '/bookshelf', changefreq: 'weekly' as const, priority: 0.7 },
    { path: '/tools', changefreq: 'weekly' as const, priority: 0.7 },
    { path: '/archive', changefreq: 'monthly' as const, priority: 0.6 },
    { path: '/tags', changefreq: 'weekly' as const, priority: 0.6 },
    { path: '/subscribe', changefreq: 'monthly' as const, priority: 0.5 },
  ]
  
  staticPages.forEach(page => {
    urls.push({
      loc: `${siteUrl}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString()
    })
  })
  
  try {
    // Blog posts
    const posts = await getAllPosts()
    posts.forEach(post => {
      urls.push({
        loc: `${siteUrl}/posts/${post.slug}`,
        lastmod: post.lastEditedTime || post.date,
        changefreq: 'monthly',
        priority: 0.7
      })
    })
    
    // Projects
    const projects = await getAllProjects()
    projects.forEach(project => {
      urls.push({
        loc: `${siteUrl}/projects/${project.slug}`,
        lastmod: project.date,
        changefreq: 'monthly',
        priority: 0.6
      })
    })
    
    // Tools
    const tools = await getAllTools()
    tools.forEach(tool => {
      urls.push({
        loc: `${siteUrl}/tools/${tool.slug}`,
        lastmod: tool.date,
        changefreq: 'monthly',
        priority: 0.6
      })
    })
    
    // Books
    const books = await getAllBooks()
    books.forEach(book => {
      urls.push({
        loc: `${siteUrl}/bookshelf/${book.id}`,
        lastmod: book.finishedDate,
        changefreq: 'monthly',
        priority: 0.5
      })
    })
    
    // Tags (get unique tags from posts)
    const allTags = new Set<string>()
    posts.forEach(post => {
      post.tags?.forEach(tag => allTags.add(tag))
    })
    
    Array.from(allTags).forEach(tag => {
      urls.push({
        loc: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
        changefreq: 'weekly',
        priority: 0.5
      })
    })
  } catch (error) {
    console.error('Error generating dynamic sitemap URLs:', error)
  }
  
  return urls
}

export function generateSitemapXml(urls: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`
  
  return xml
}

export function generateRobotsTxt(): string {
  return `# Robots.txt for ${siteUrl}

# Allow all bots
User-agent: *
Allow: /

# Specific bot rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Disallow specific paths
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml
`
}