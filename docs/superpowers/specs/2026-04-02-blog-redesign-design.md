# Peter's Blog Redesign — Design Spec

## Overview

Full redesign of Peter's personal blog from a feature-heavy Next.js application to an editorial minimalist site inspired by jiyongshi.com. The project consists of two independently deployed sites sharing a unified visual language.

**Domain architecture:**
- `petermu.com` — Main site (blog, projects, tools, about)
- `reading.petermu.com` — Reading journal (Readwise integration)

**Design philosophy:** Editorial minimalism — typography-driven hierarchy, warm color palette, narrow content columns, intentional restraint. The site should feel like a beautifully typeset book, not a web application.

---

## 1. Design System

### 1.1 Color Palette (6 colors, no dark mode)

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#f8f6f1` | Page background, warm cream |
| Text Primary | `#1a1614` | Headings, titles, body emphasis |
| Text Body | `#5c5147` | Body text, descriptions |
| Text Muted | `#8a7f76` | Dates, metadata, secondary labels |
| Accent | `#2d6a4f` | Active nav indicator, note borders, featured borders, links, badges |
| Border | `#e0dbd5` | Separators, highlight borders, card borders |

Additional derived colors:
- Card/input background: `#fdfcfa` (near-white)
- Section background: `#f2f0eb` (slightly darker cream for featured cards)
- Tag background: `#e8e5df` (muted warm gray for tags/pills)

### 1.2 Typography (Three-font system)

| Font | Role | Usage |
|------|------|-------|
| **Playfair Display** (serif) | Identity + Headings | Site name, page titles, date headings, article titles. Italic for hero. Tight letter-spacing (-1 to -1.5px) for large sizes. |
| **Source Serif 4** (serif) | Content + Reading | Article body, highlight quotes, book titles, descriptions. Optimized for long-form reading. Line-height 1.7. |
| **JetBrains Mono** (monospace) | UI Chrome | Navigation, dates, labels, metadata, sort controls, search input, badges, footer. Uppercase + letter-spacing for section labels. |

Font loading: Google Fonts via `next/font` with `display: swap`. Chinese fallbacks: `"PingFang SC", "Microsoft YaHei", sans-serif`.

### 1.3 Layout

- **Content width:** 680px max for main content, 720px for book grid
- **Page centering:** `margin: 0 auto` with `padding: 0 40px` (mobile: `0 20px`)
- **Vertical rhythm:** 32px section spacing, 20px item spacing, 16px inner spacing
- **No sidebar, no multi-column layouts** — single column throughout

### 1.4 Component Patterns

**Navigation bar:**
- Sticky, frosted glass effect (`background: rgba(248,246,241,0.85)`, `backdrop-filter: blur(8px)`)
- Bottom border: `1px solid #e0dbd5`
- Logo left (Playfair Display 18px bold), nav right (JetBrains Mono 11px uppercase)
- Active state: dark text + `2px solid #2d6a4f` bottom border
- Cross-site link to reading/main in accent color with arrow

**Section headings:**
- JetBrains Mono, 10px, uppercase, letter-spacing 1.5px, color `#6b5f54`
- Acts as magazine-style section dividers

**Article list items:**
- Title (Playfair Display 17px, bold) + date (JetBrains Mono 10px, muted) on same line, justified
- Excerpt below (Source Serif 4 13px, body color)
- Separated by `1px solid #e0dbd5` bottom border

**Featured card:**
- Left border: `3px solid #2d6a4f`
- Background: `#f2f0eb`
- Border-radius: 4px
- Tags as small pills with `#e8e5df` background

**Footer:**
- Centered, JetBrains Mono 10px, muted color
- Minimal: copyright + tagline only

**No animations.** No hover scale effects, no fade-ins, no transitions beyond CSS defaults. The reference site achieves its quality through restraint.

---

## 2. Main Site — petermu.com

### 2.1 Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **Styling:** Tailwind CSS 4
- **Content:** Local MDX files from Obsidian vault (in `content/` directory)
- **MDX processing:** next-mdx-remote or Contentlayer successor (e.g., Velite)
- **Deployment:** Vercel
- **No external CMS, no database, no auth**

### 2.2 Pages

#### Homepage (`/`)
- Hero: Site name "Peter's Lab" (Playfair Display 42px italic) + one-paragraph description
- Divider
- Recent Writing: Latest 5 posts as list items (title + excerpt + date)
- "All posts →" link in accent color
- Featured Project: One project card with left green border
- Footer

#### Blog listing (`/blog`)
- Page title "Writing" (Playfair Display 28px)
- Optional: tag filter (pill-style buttons)
- All posts as list items, chronologically
- Year grouping if many posts

#### Blog post (`/blog/[slug]`)
- Title (Playfair Display 32px)
- Date + reading time (JetBrains Mono)
- Article body (Source Serif 4, 16px, line-height 1.7, max-width 680px)
- MDX support: code blocks, images, callouts
- No comments, no likes, no share buttons

#### Projects (`/projects`)
- Page title "Projects"
- Project cards in single column
- Each card: left green border, title, description, tech stack tags

#### Tools (`/tools`)
- Page title "Tools"
- Simple list of tool recommendations
- Each item: name, one-line description, external link
- No comparison feature, no categories — just a curated flat list

#### About (`/about`)
- Page title "About"
- Profile photo (optional)
- Bio text (Source Serif 4)
- Links to social/contact

### 2.3 Content Structure

```
content/
├── posts/           # Blog posts as .mdx files
│   ├── 2026-03-28-second-brain.mdx
│   └── 2026-03-15-simplicity.mdx
├── projects/        # Project descriptions as .mdx files
│   ├── newwordradar.mdx
│   └── peterblog.mdx
├── tools.mdx        # Single file with tool recommendations
└── about.mdx        # About page content
```

MDX frontmatter for posts:
```yaml
---
title: "Building a Second Brain with AI"
date: "2026-03-28"
excerpt: "How I use Claude and Obsidian together..."
tags: ["ai", "productivity"]
---
```

### 2.4 Obsidian Integration Workflow

1. User writes content in Obsidian vault
2. Obsidian vault's blog folder is symlinked or copied to `content/` in the project
3. `npm run build` reads MDX files at build time
4. Push to GitHub → Vercel auto-deploys

Options for sync:
- **Symlink:** `ln -s ~/ObsidianVault/blog ./content` (simplest)
- **Git submodule:** If vault is in a separate repo
- **Manual copy:** Just copy files when ready to publish

---

## 3. Reading Site — reading.petermu.com

### 3.1 Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **Styling:** Tailwind CSS 4
- **Data source:** Readwise API (https://readwise.io/api_defs)
- **Deployment:** Vercel (separate project, same account)
- **Caching:** ISR (Incremental Static Regeneration) with 1-hour revalidation

### 3.2 Readwise API Integration

**API endpoints used:**
- `GET /api/v2/books` — List all books with metadata (title, author, cover, category)
- `GET /api/v2/highlights` — List highlights with book associations, timestamps, notes
- `GET /api/v2/export` — Bulk export of all highlights grouped by book

**Authentication:** Readwise API token stored in environment variable `READWISE_ACCESS_TOKEN`.

**Data flow:**
1. At build time (ISR): fetch books and highlights from Readwise API
2. Transform into page-ready data structures
3. Cache with 1-hour revalidation
4. No client-side API calls — all data is server-rendered

### 3.3 Pages

#### Today (`/` or `/today`)
Default landing page. Shows today's reading highlights.

- Date heading (Playfair Display 28px) with left/right arrow navigation
- Stats line: "X books · Y highlights · Z notes" (JetBrains Mono)
- Highlights grouped by book
- Each book group: small cover thumbnail + title + author
- Each highlight: blockquote with left border (`2px solid #e0dbd5`), timestamp
- User notes: blockquote with green left border (`2px solid #2d6a4f`), italic text, "NOTE" label
- If no highlights for today, show most recent day with highlights

#### Archive (`/archive`)
Date-indexed list of all reading activity.

- Each row: date (JetBrains Mono) | summary ("2 books · 5 highlights") | highlight count badge
- Rows separated by `1px solid #e0dbd5`
- Click a date → navigates to Today page for that date

#### Books (`/books`)
Book wall — grid display of all books.

- Page title "Book Wall" (Playfair Display 28px) + total book count
- Sort controls: Recent / Highlights / Title (pill buttons, JetBrains Mono)
- Year filter dropdown
- Search input (JetBrains Mono)
- CSS Grid: 4 columns desktop, 2 columns mobile
- Each book: cover image (2:3 aspect ratio from Readwise), title below, author below
- Highlight count badge: absolute positioned, bottom-right of cover, green background (`rgba(45,106,79,0.85)`)
- Click book → opens detail modal

#### Book Detail Modal
- Overlay modal, max-width 700px, border-radius 12px
- Warm-toned shadow: `rgba(28,26,23,0.2) 0 16px 48px`
- Book cover + title + author at top
- Highlight count (JetBrains Mono uppercase)
- All highlights listed chronologically with timestamps
- Each highlight: left border blockquote style
- Close button (X) top-right

### 3.4 Shared Components (between main and reading site)

Both sites share the same design system but are separate Next.js projects. Shared elements:
- Identical `tailwind.config.ts` (colors, fonts, spacing)
- Same header pattern (logo + nav), but with different nav items
- Same footer pattern
- Cross-site navigation link in nav (main ↔ reading)

Could be extracted to a shared npm package or simply duplicated (acceptable given the small surface area).

---

## 4. Project Structure

### 4.1 Monorepo (recommended)

```
PeterBlog/
├── apps/
│   ├── main/              # petermu.com — Next.js project
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Site-specific components
│   │   ├── content/       # MDX files (from Obsidian)
│   │   ├── lib/           # Utilities
│   │   └── package.json
│   └── reading/           # reading.petermu.com — Next.js project
│       ├── app/           # App Router pages
│       ├── components/    # Site-specific components
│       ├── lib/
│       │   └── readwise.ts  # Readwise API client
│       └── package.json
├── packages/
│   └── design-system/     # Shared Tailwind config, fonts, base styles
│       ├── tailwind.config.ts
│       ├── fonts.ts
│       └── globals.css
├── turbo.json             # Turborepo config
├── package.json           # Root workspace config
└── CLAUDE.md
```

**Tool:** Turborepo for monorepo management. Both apps deploy independently to Vercel.

---

## 5. Features Removed (vs current blog)

| Feature | Reason |
|---------|--------|
| Comment system (CommentSection, CommentForm, etc.) | User confirmed comments are useless in mobile era |
| User authentication (Supabase Auth, AuthModal, etc.) | No need without comments/favorites |
| Real-time features (notifications, presence, live comments) | Personal blog, not a social product |
| Supabase integration (entire dependency removed) | No database needed |
| Notion CMS integration | Replaced by local Obsidian MDX files |
| Tool comparison feature | Over-engineered; replaced by simple list |
| Analytics dashboard | Use Vercel Analytics or Plausible instead |
| Newsletter/subscribe | Not needed for initial launch |
| Year in review page | Can be a blog post instead |
| Like/bookmark/favorite buttons | No user system |
| Search (Fuse.js) | Simple blog doesn't need it initially; can add later |
| Dark mode | User confirmed not needed |
| Cloudinary integration | Use Next.js Image with local or URL images |
| All animation components | Editorial minimalism = no animations |

---

## 6. Environment Variables

### Main site (petermu.com)
```bash
# No external API dependencies!
NEXT_PUBLIC_SITE_URL=https://petermu.com
NEXT_PUBLIC_READING_URL=https://reading.petermu.com
```

### Reading site (reading.petermu.com)
```bash
READWISE_ACCESS_TOKEN=xxx          # Readwise API token
NEXT_PUBLIC_SITE_URL=https://reading.petermu.com
NEXT_PUBLIC_MAIN_URL=https://petermu.com
```

---

## 7. Deployment

- **Platform:** Vercel (two separate projects in same account)
- **Main site:** Connected to `apps/main/`, domain `petermu.com`
- **Reading site:** Connected to `apps/reading/`, domain `reading.petermu.com`
- **Build:** Turborepo handles workspace dependencies
- **Publishing flow:** Write in Obsidian → commit content changes → push → Vercel auto-deploys

---

## 8. Success Criteria

1. **Visual parity with reference:** Warm editorial aesthetic, typography-driven hierarchy, narrow single-column layout
2. **Lighthouse scores:** Performance 95+, Accessibility 95+, SEO 95+
3. **Zero external runtime dependencies** for main site (no API calls at request time)
4. **Readwise data freshness:** Reading site updates within 1 hour of new highlights
5. **Mobile responsive:** Clean reading experience on mobile, book grid adapts to 2 columns
6. **Fast builds:** < 30 seconds for main site, < 60 seconds for reading site
7. **Content workflow:** Write in Obsidian, publish with `git push`, no other steps needed
