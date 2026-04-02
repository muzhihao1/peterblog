# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a **blog project workspace** with the main deployable application located in the `my-blog/` directory. The root workspace contains documentation, configuration, and supporting files.

```
.
├── my-blog/          # 🚀 Main Next.js 15 blog application (WORK HERE)
├── docs/             # 📚 Project documentation and guides
├── tests/            # 🧪 Workspace-level test utilities
├── archive/          # 📦 Archived files and legacy code
├── CLAUDE.md         # 🤖 This AI assistant guidance file
├── README.md         # 📖 Workspace overview
├── SECURITY_CHECKLIST.md  # 🔒 Security protocols and incident response
└── .env.local        # 🔐 Workspace environment variables (git ignored)
```

## IMPORTANT: Always Work in my-blog/

**All development work should happen in the `my-blog/` directory.** This is the deployable Next.js application. The root workspace is for documentation and configuration only.

```bash
# Always change to the app directory first
cd my-blog/

# Then run commands
npm run dev
npm run build
```

## Core Development Commands

### Essential Commands (run from my-blog/ directory)
```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run dev:clean        # Clean .next and start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run Next.js linting

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:api         # Run API integration tests
npm run test:ci          # Run tests in CI mode

# Database & External Services
npm run test:notion      # Test Notion API connection
npm run test:supabase    # Test Supabase connection
npm run db:init          # Initialize Supabase database
```

## Technology Stack

This is a **full-stack Next.js 15 blog** with the following tech stack:

- **Framework**: Next.js 15 with App Router and TypeScript
- **Content Management**: Notion API as headless CMS
- **Database**: Supabase for user data, comments, analytics
- **Authentication**: Supabase Auth with protected routes
- **Styling**: Tailwind CSS with custom design system
- **Image Hosting**: Cloudinary CDN with optimization
- **Deployment**: Vercel with automatic deployments
- **Testing**: Jest + React Testing Library

## Architecture Overview

### Key Features
- **Notion CMS Integration**: All content (posts, projects, books, tools) managed in Notion
- **Comprehensive Fallback System**: Site works even when external APIs fail
- **Real-time Features**: Live comments, presence, notifications via Supabase
- **Advanced Analytics**: Page views, reading time, engagement tracking
- **Full-text Search**: Client-side fuzzy search with Fuse.js
- **Performance Optimized**: Image optimization, caching, lazy loading

### Core Directories (in my-blog/)
```
app/                  # Next.js App Router pages and API routes
├── api/             # Backend API endpoints
├── [routes]/        # Frontend pages with dynamic routing
components/          # Reusable React components organized by feature
├── auth/           # Authentication components
├── comments/       # Comment system components  
├── features/       # Feature-specific components
├── ui/             # Base UI components
lib/                # Core utilities and integrations
├── notion/         # Notion API client and helpers
├── supabase/       # Supabase client configurations
├── analytics/      # Analytics tracking and reporting
├── fallback-*.ts   # Fallback data for external API failures
types/              # TypeScript type definitions
hooks/              # Custom React hooks
contexts/           # React contexts (Auth, Theme)
```

## Environment Configuration

### Required Environment Variables (.env.local in my-blog/)
```bash
# Notion API (REQUIRED for content)
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx

# Supabase (REQUIRED for interactive features)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Optional Content Databases
NOTION_PROJECTS_DB=xxx
NOTION_BOOKS_DB=xxx
NOTION_TOOLS_DB=xxx

# Performance & Configuration
CACHE_TTL=3600000
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Development Guidelines

### Security First Approach
- **NEVER commit secrets**: All sensitive data in environment variables
- **Input validation**: All API endpoints validate and sanitize inputs
- **Authentication required**: Protected routes verify user permissions
- **Secure API routes**: Rate limiting and error handling implemented
- **See SECURITY_CHECKLIST.md**: Emergency procedures for credential leaks

### Code Quality Standards
- **TypeScript strict mode**: Full type safety throughout codebase
- **Component-driven**: Reusable components with clear interfaces
- **Error boundaries**: Graceful failure handling for all features
- **Comprehensive testing**: Unit, integration, and API route tests
- **Performance monitoring**: Built-in analytics and performance tracking

### Development Patterns
1. **Fallback-first design**: Every external API call has fallback data
2. **Progressive enhancement**: Core functionality works without JavaScript
3. **Mobile-first responsive**: Tailwind CSS with responsive design
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **SEO optimized**: Metadata, structured data, sitemap generation

## Testing Strategy

### Test Organization
```bash
# Component tests
__tests__/components/    # Component unit tests
__tests__/api/          # API route tests

# Integration tests  
tests/api-integration/   # Full API integration tests
```

### Test Commands
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run test:api           # API integration tests only
npm run test:ci            # CI/CD optimized test run
```

## Deployment

### Automatic Deployment (Vercel)
- **Trigger**: Push to main branch
- **Build**: Runs in my-blog/ directory
- **Environment**: Production variables configured in Vercel dashboard
- **Domain**: Auto-deployed to production URL

### Manual Deployment Verification
```bash
cd my-blog/
npm run build           # Verify build succeeds
npm run start          # Test production build locally
npm run test:ci        # Run all tests
```

## Common Development Tasks

### Adding New Content Type
1. Create Notion database with required fields
2. Add database ID to environment variables  
3. Create types in `types/[content-type].ts`
4. Implement API client in `lib/notion/[content-type].ts`
5. Add fallback data in `lib/fallback-[content-type].ts`
6. Create components in `components/features/`
7. Add API routes in `app/api/[content-type]/`
8. Create pages in `app/[content-type]/`

### Debugging External API Issues
```bash
npm run test:notion     # Test Notion connection
npm run test:supabase   # Test Supabase connection
```

### Performance Optimization
- Use Next.js Image component for all images
- Implement lazy loading for heavy components
- Utilize Cloudinary for image optimization
- Monitor bundle size with `npm run analyze`

## Security Protocols

### Incident Response
- **Credential leak detected**: Follow SECURITY_CHECKLIST.md immediately
- **API abuse**: Check rate limiting logs and adjust throttling
- **Data breach**: Audit Supabase logs and user access patterns

### Regular Security Tasks
- Rotate API keys every 3-6 months
- Monitor Supabase dashboard for unusual activity
- Review and update dependency vulnerabilities
- Audit user permissions and access controls

## Important Notes

### Mixed Architecture Evolution
- Originally designed for static export (`output: 'export'`)
- Now includes server-side features (API routes, real-time features)
- Cannot use static export with current feature set
- Build configuration temporarily ignores TypeScript/ESLint errors for quick deployment

### Content Management Workflow
1. Create/edit content in Notion databases
2. Content automatically synced via API calls
3. Fallback data ensures site works during API downtime
4. ISR (Incremental Static Regeneration) keeps content fresh

### Known Limitations
- Memory usage requires increased Node.js heap size for builds
- Some TypeScript errors temporarily ignored in build config
- Real-time features require persistent connection to Supabase
- Image optimization dependent on Cloudinary service availability