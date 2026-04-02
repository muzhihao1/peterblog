/** @type {import('next').NextConfig} */

// Bundle analyzer setup
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  images: {
    domains: [
      // Supabase storage domain
      'xelyobfvfjqeuysfzpcf.supabase.co',
      // GitHub avatars
      'avatars.githubusercontent.com',
      // Placeholder services
      'via.placeholder.com',
      'placehold.co',
      // Common image CDNs
      'images.unsplash.com',
      'cdn.jsdelivr.net',
      // Notion images
      'www.notion.so',
      'images.unsplash.com',
      's3.us-west-2.amazonaws.com',
      // Add more domains as needed
    ],
    // Modern image formats
    formats: ['image/avif', 'image/webp'],
    // Image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Reduce quality slightly for smaller file sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  // Enable static export
  output: 'export',
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Webpack configuration for bundle optimization
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)