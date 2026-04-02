import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
  type?: 'website' | 'article' | 'profile'
  image?: string
  url?: string
  locale?: string
  siteName?: string
}

const defaultSiteName = '我的博客'
const defaultDescription = '分享技术、想法和创意的个人博客'
const defaultImage = '/og-image.png'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export function generateMetadata({
  title,
  description,
  keywords = ['博客', '技术', '开发', '编程'],
  author = defaultSiteName,
  publishedTime,
  modifiedTime,
  type = 'website',
  image = defaultImage,
  url = siteUrl,
  locale = 'zh_CN',
  siteName = defaultSiteName
}: SEOProps): Metadata {
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  
  const metadata: Metadata = {
    title: {
      default: title,
      template: `%s | ${siteName}`
    },
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type: type as any,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: `@${author.replace(/\s+/g, '')}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: [author],
    }
  }

  return metadata
}

// JSON-LD structured data generator
export function generateStructuredData({
  title,
  description,
  author = defaultSiteName,
  publishedTime,
  modifiedTime,
  type = 'website',
  image = defaultImage,
  url = siteUrl,
  keywords = []
}: SEOProps) {
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  const baseData = {
    '@context': 'https://schema.org',
  }

  if (type === 'article') {
    return {
      ...baseData,
      '@type': 'BlogPosting',
      headline: title,
      description,
      author: {
        '@type': 'Person',
        name: author
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      image: fullImageUrl,
      url,
      keywords: keywords.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      publisher: {
        '@type': 'Organization',
        name: defaultSiteName,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        }
      }
    }
  }

  if (type === 'profile') {
    return {
      ...baseData,
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: author,
        description,
        image: fullImageUrl,
        url
      }
    }
  }

  // Default to WebSite
  return {
    ...baseData,
    '@type': 'WebSite',
    name: title,
    description,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// Breadcrumb structured data
export function generateBreadcrumbData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`
    }))
  }
}

// FAQ structured data
export function generateFAQData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// Component to inject structured data (for client components)
export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
}