# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two editorial-minimalist sites (petermu.com + reading.petermu.com) as a Turborepo monorepo with shared design system, Obsidian MDX content, and Readwise API integration.

**Architecture:** Turborepo monorepo with three packages: `apps/main` (Next.js 15, static MDX blog), `apps/reading` (Next.js 15, Readwise-powered reading journal), and `packages/design-system` (shared Tailwind config, fonts, CSS). Both apps are independently deployed to Vercel.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Turborepo, MDX (via next-mdx-remote), Readwise API, Vercel

**Spec:** `docs/superpowers/specs/2026-04-02-blog-redesign-design.md`

---

## File Structure

```
PeterBlog/
├── apps/
│   ├── main/                          # petermu.com
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout with fonts, metadata
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx           # Blog listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Individual post
│   │   │   ├── projects/
│   │   │   │   └── page.tsx           # Projects listing
│   │   │   ├── tools/
│   │   │   │   └── page.tsx           # Tools listing
│   │   │   └── about/
│   │   │       └── page.tsx           # About page
│   │   ├── components/
│   │   │   ├── Header.tsx             # Sticky nav with frosted glass
│   │   │   ├── Footer.tsx             # Minimal centered footer
│   │   │   ├── PostList.tsx           # Article list items
│   │   │   ├── PostItem.tsx           # Single article list item
│   │   │   ├── ProjectCard.tsx        # Project card with green left border
│   │   │   ├── MdxContent.tsx         # MDX renderer component
│   │   │   └── SectionHeading.tsx     # Magazine-style section label
│   │   ├── lib/
│   │   │   ├── content.ts             # MDX file reading + parsing
│   │   │   └── types.ts              # Post, Project, Tool types
│   │   ├── content/
│   │   │   ├── posts/                 # MDX blog posts
│   │   │   │   └── hello-world.mdx    # Sample post
│   │   │   ├── projects/              # MDX project descriptions
│   │   │   │   └── sample-project.mdx
│   │   │   └── data/
│   │   │       └── tools.json         # Tools data
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts         # Extends design-system
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── reading/                       # reading.petermu.com
│       ├── app/
│       │   ├── layout.tsx             # Root layout
│       │   ├── page.tsx               # Today page (default)
│       │   ├── archive/
│       │   │   └── page.tsx           # Archive listing
│       │   └── books/
│       │       └── page.tsx           # Book wall
│       ├── components/
│       │   ├── Header.tsx             # Reading site nav
│       │   ├── Footer.tsx             # Readwise attribution footer
│       │   ├── BookGrid.tsx           # Book wall grid
│       │   ├── BookCard.tsx           # Single book in grid
│       │   ├── BookModal.tsx          # Book detail modal
│       │   ├── HighlightItem.tsx      # Single highlight blockquote
│       │   ├── NoteItem.tsx           # User note with green border
│       │   ├── DayTimeline.tsx        # Day's highlights grouped by book
│       │   ├── ArchiveRow.tsx         # Single archive row
│       │   ├── SortControls.tsx       # Sort pills + search + year filter
│       │   └── DateNav.tsx            # Date navigation arrows
│       ├── lib/
│       │   ├── readwise.ts            # Readwise API client
│       │   └── types.ts              # Book, Highlight, Note types
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   └── design-system/
│       ├── tailwind.config.ts         # Shared colors, fonts, spacing
│       ├── globals.css                # Base styles, CSS variables
│       ├── fonts.ts                   # Font definitions (next/font)
│       ├── index.ts                   # Package exports
│       ├── tsconfig.json
│       └── package.json
├── turbo.json
├── package.json                       # Root workspace
├── .gitignore
└── CLAUDE.md
```

---

## Phase 1: Foundation

### Task 1: Monorepo Scaffolding

**Files:**
- Create: `package.json` (root)
- Create: `turbo.json`
- Create: `.gitignore`
- Create: `apps/main/package.json`
- Create: `apps/reading/package.json`
- Create: `packages/design-system/package.json`

- [ ] **Step 1: Initialize root workspace**

```bash
cd /Users/liasiloam/Vibecoding/PeterBlog
```

Create root `package.json`:

```json
{
  "name": "peterblog",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:main": "turbo run dev --filter=@peterblog/main",
    "dev:reading": "turbo run dev --filter=@peterblog/reading",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.4.0"
  }
}
```

- [ ] **Step 2: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

- [ ] **Step 3: Create main app with Next.js 15**

```bash
cd apps
npx create-next-app@latest main --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git
```

Edit `apps/main/package.json` to set name to `@peterblog/main` and add dependency on `@peterblog/design-system: "workspace:*"`.

- [ ] **Step 4: Create reading app with Next.js 15**

```bash
npx create-next-app@latest reading --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git
```

Edit `apps/reading/package.json` to set name to `@peterblog/reading` and add dependency on `@peterblog/design-system: "workspace:*"`.

- [ ] **Step 5: Create design-system package**

Create `packages/design-system/package.json`:

```json
{
  "name": "@peterblog/design-system",
  "version": "0.0.1",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./tailwind": "./tailwind.config.ts",
    "./globals.css": "./globals.css",
    "./fonts": "./fonts.ts"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

Create `packages/design-system/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Update .gitignore and install dependencies**

Ensure `.gitignore` includes:
```
node_modules/
.next/
.env.local
.env*.local
.turbo/
.superpowers/
```

Run:
```bash
cd /Users/liasiloam/Vibecoding/PeterBlog
npm install
```

Expected: Installs all workspace dependencies successfully.

- [ ] **Step 7: Verify monorepo structure**

Run:
```bash
npx turbo run build --dry
```

Expected: Shows both apps and design-system in the task graph.

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Turborepo monorepo with main and reading apps"
```

---

### Task 2: Design System Package

**Files:**
- Create: `packages/design-system/tailwind.config.ts`
- Create: `packages/design-system/globals.css`
- Create: `packages/design-system/fonts.ts`
- Create: `packages/design-system/index.ts`

- [ ] **Step 1: Create shared Tailwind config**

Create `packages/design-system/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: "#f8f6f1",
        "bg-card": "#fdfcfa",
        "bg-section": "#f2f0eb",
        "bg-tag": "#e8e5df",
        "text-primary": "#1a1614",
        "text-body": "#5c5147",
        "text-muted": "#8a7f76",
        "text-label": "#6b5f54",
        accent: "#2d6a4f",
        border: "#e0dbd5",
      },
      maxWidth: {
        content: "680px",
        "content-wide": "720px",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: [
          "var(--font-source-serif)",
          "Georgia",
          '"PingFang SC"',
          '"Microsoft YaHei"',
          "serif",
        ],
        mono: [
          "var(--font-jetbrains)",
          '"Courier New"',
          "monospace",
        ],
      },
      fontSize: {
        "section-label": ["10px", { letterSpacing: "1.5px", lineHeight: "1" }],
        "nav-item": ["11px", { letterSpacing: "0.5px", lineHeight: "1" }],
      },
    },
  },
};

export default config;
```

- [ ] **Step 2: Create global CSS**

Create `packages/design-system/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-text-primary antialiased;
  }

  ::selection {
    background-color: rgba(45, 106, 79, 0.15);
  }
}
```

- [ ] **Step 3: Create font definitions**

Create `packages/design-system/fonts.ts`:

```typescript
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`;
```

- [ ] **Step 4: Create package index**

Create `packages/design-system/index.ts`:

```typescript
export { playfair, sourceSerif, jetbrainsMono, fontVariables } from "./fonts";
```

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/
git commit -m "feat: add shared design system with colors, fonts, and base styles"
```

---

### Task 3: Main Site Layout (Header + Footer + Root Layout)

**Files:**
- Create: `apps/main/components/Header.tsx`
- Create: `apps/main/components/Footer.tsx`
- Modify: `apps/main/app/layout.tsx`
- Modify: `apps/main/tailwind.config.ts`
- Modify: `apps/main/app/globals.css`

- [ ] **Step 1: Configure Tailwind to extend design system**

Replace `apps/main/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";
import sharedConfig from "@peterblog/design-system/tailwind";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      ...sharedConfig.theme?.extend,
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Replace globals.css**

Replace `apps/main/app/globals.css` with:

```css
@import "@peterblog/design-system/globals.css";
```

- [ ] **Step 3: Create Header component**

Create `apps/main/components/Header.tsx`:

```tsx
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
];

const readingUrl = process.env.NEXT_PUBLIC_READING_URL || "https://reading.petermu.com";

export function Header({ currentPath = "/" }: { currentPath?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content-wide items-center justify-between px-10 py-5 max-md:px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-lg font-bold text-text-primary">
            Peter Mu
          </span>
          <span className="font-mono text-section-label uppercase text-text-muted">
            Lab
          </span>
        </Link>
        <nav className="flex items-center gap-6 max-md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-nav-item uppercase ${
                currentPath === item.href
                  ? "border-b-2 border-accent pb-0.5 text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={readingUrl}
            className="font-mono text-nav-item uppercase text-accent"
          >
            Reading &rarr;
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create Footer component**

Create `apps/main/components/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center">
      <p className="font-mono text-[10px] tracking-wide text-text-muted">
        &copy; {new Date().getFullYear()} Peter Mu &middot; Built with curiosity
      </p>
    </footer>
  );
}
```

- [ ] **Step 5: Update root layout**

Replace `apps/main/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { fontVariables } from "@peterblog/design-system";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Peter Mu — Lab",
    template: "%s | Peter Mu",
  },
  description:
    "A place for experiments in technology, reading, and intentional living.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://petermu.com"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={fontVariables}>
      <body className="flex min-h-screen flex-col font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create a minimal homepage placeholder**

Replace `apps/main/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="font-heading text-[42px] font-extrabold italic leading-tight tracking-tight text-text-primary">
        Peter&apos;s Lab
      </h1>
      <p className="mt-4 font-body text-[15px] leading-relaxed text-text-body">
        A place for experiments in technology, reading, and intentional living.
      </p>
    </div>
  );
}
```

- [ ] **Step 7: Verify main site runs**

```bash
cd apps/main && npm run dev
```

Open `http://localhost:3000`. Expected: Warm cream background, frosted glass header with navigation, hero text in Playfair Display italic, minimal footer. No blue, no purple, no cold colors.

- [ ] **Step 8: Commit**

```bash
git add apps/main/
git commit -m "feat: main site layout with header, footer, and design system integration"
```

---

## Phase 2: Main Site Content

### Task 4: MDX Content Pipeline

**Files:**
- Create: `apps/main/lib/types.ts`
- Create: `apps/main/lib/content.ts`
- Create: `apps/main/content/posts/hello-world.mdx`
- Create: `apps/main/components/MdxContent.tsx`
- Modify: `apps/main/package.json` (add dependencies)

- [ ] **Step 1: Install MDX dependencies**

```bash
cd apps/main
npm install next-mdx-remote gray-matter reading-time
npm install -D @types/mdx
```

- [ ] **Step 2: Define content types**

Create `apps/main/lib/types.ts`:

```typescript
export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export interface ProjectFrontmatter {
  title: string;
  description: string;
  url?: string;
  tags?: string[];
  featured?: boolean;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

export interface Tool {
  name: string;
  description: string;
  url: string;
  category?: string;
}
```

- [ ] **Step 3: Create content reading utilities**

Create `apps/main/lib/content.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter, Project, ProjectFrontmatter, Tool } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getAllPosts(): Post[] {
  const postsDir = path.join(CONTENT_DIR, "posts");
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(postsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);

    return {
      slug,
      frontmatter: data as PostFrontmatter,
      content,
      readingTime: stats.text,
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, "posts", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllProjects(): Project[] {
  const projectsDir = path.join(CONTENT_DIR, "projects");
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(projectsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data as ProjectFrontmatter,
      content,
    };
  });
}

export function getAllTools(): Tool[] {
  const toolsPath = path.join(CONTENT_DIR, "data", "tools.json");
  if (!fs.existsSync(toolsPath)) return [];

  const fileContent = fs.readFileSync(toolsPath, "utf-8");
  return JSON.parse(fileContent) as Tool[];
}
```

- [ ] **Step 4: Create MDX renderer component**

Create `apps/main/components/MdxContent.tsx`:

```tsx
import { MDXRemote } from "next-mdx-remote/rsc";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-4 mt-8 font-heading text-[28px] font-bold text-text-primary" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-3 mt-6 font-heading text-[22px] font-bold text-text-primary" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-2 mt-5 font-heading text-lg font-semibold text-text-primary" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 font-body text-base leading-[1.7] text-text-body" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-accent underline underline-offset-2" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 font-body text-text-body" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 font-body text-text-body" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-4 border-l-2 border-border pl-4 font-body italic text-text-body"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-bg-tag px-1.5 py-0.5 font-mono text-sm text-text-primary" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-4 overflow-x-auto rounded-md bg-text-primary p-4 font-mono text-sm text-bg"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-4 rounded-md" alt={props.alt || ""} {...props} />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
```

- [ ] **Step 5: Create sample content**

Create `apps/main/content/posts/hello-world.mdx`:

```mdx
---
title: "Hello World — A Fresh Start"
date: "2026-04-02"
excerpt: "Rebuilding my blog from scratch with editorial minimalism, Obsidian-powered content, and a focus on what matters."
tags: ["meta", "design"]
---

This is the first post on my redesigned blog. I tore everything down and started over.

## Why Rebuild?

The old site had 50+ components, a database, authentication, comments, real-time features — and yet it didn't feel like *me*. Sometimes the best thing you can do is remove.

## What's Different

- **Obsidian as CMS** — I write in my favorite editor, push to deploy
- **Warm editorial design** — Typography does the heavy lifting
- **No database** — Zero runtime dependencies for the main site
- **Reading journal** — Powered by Readwise, showing what I actually read

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

The code is simpler. The design is warmer. The focus is clearer.
```

Create `apps/main/content/projects/sample-project.mdx`:

```mdx
---
title: "NewWordRadar"
description: "An AI-powered tool that discovers trending new words and phrases across the internet."
url: "https://newwordradar.com"
tags: ["Next.js", "AI", "NLP"]
featured: true
---

Built with Next.js and OpenAI, NewWordRadar monitors social media and news to surface newly coined terms before they go mainstream.
```

Create `apps/main/content/data/tools.json`:

```json
[
  {
    "name": "Obsidian",
    "description": "Local-first knowledge base and writing tool",
    "url": "https://obsidian.md",
    "category": "Writing"
  },
  {
    "name": "Readwise",
    "description": "Sync and review your reading highlights",
    "url": "https://readwise.io",
    "category": "Reading"
  },
  {
    "name": "Vercel",
    "description": "Deploy frontend applications with zero config",
    "url": "https://vercel.com",
    "category": "Deployment"
  }
]
```

- [ ] **Step 6: Verify content pipeline works**

In a temporary test, import `getAllPosts` in the homepage and render the first post's title. Verify it reads from `content/posts/` correctly.

- [ ] **Step 7: Commit**

```bash
git add apps/main/lib/ apps/main/components/MdxContent.tsx apps/main/content/
git commit -m "feat: MDX content pipeline with sample posts, projects, and tools"
```

---

### Task 5: Homepage

**Files:**
- Modify: `apps/main/app/page.tsx`
- Create: `apps/main/components/SectionHeading.tsx`
- Create: `apps/main/components/PostItem.tsx`
- Create: `apps/main/components/ProjectCard.tsx`

- [ ] **Step 1: Create SectionHeading component**

Create `apps/main/components/SectionHeading.tsx`:

```tsx
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 font-mono text-section-label uppercase text-text-label">
      {children}
    </h2>
  );
}
```

- [ ] **Step 2: Create PostItem component**

Create `apps/main/components/PostItem.tsx`:

```tsx
import Link from "next/link";
import type { Post } from "@/lib/types";

export function PostItem({ post }: { post: Post }) {
  const date = new Date(post.frontmatter.date);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="border-b border-border pb-5 mb-5 last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="group">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-heading text-[17px] font-semibold text-text-primary group-hover:text-accent">
            {post.frontmatter.title}
          </h3>
          <time className="shrink-0 font-mono text-[10px] text-text-muted">
            {formatted}
          </time>
        </div>
        {post.frontmatter.excerpt && (
          <p className="mt-1.5 font-body text-[13px] leading-relaxed text-text-body">
            {post.frontmatter.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}
```

- [ ] **Step 3: Create ProjectCard component**

Create `apps/main/components/ProjectCard.tsx`:

```tsx
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const { title, description, tags, url } = project.frontmatter;

  return (
    <div className="rounded border-l-[3px] border-accent bg-bg-section p-5">
      <h3 className="font-heading text-base font-semibold text-text-primary">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      <p className="mt-1.5 font-body text-[13px] leading-relaxed text-text-body">
        {description}
      </p>
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-bg-tag px-2 py-0.5 font-mono text-[10px] text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Build the full homepage**

Replace `apps/main/app/page.tsx`:

```tsx
import Link from "next/link";
import { getAllPosts, getAllProjects } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import { PostItem } from "@/components/PostItem";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);
  const featuredProject = getAllProjects().find(
    (p) => p.frontmatter.featured
  );

  return (
    <div className="mx-auto max-w-content px-10 max-md:px-5">
      {/* Hero */}
      <section className="pb-12 pt-16">
        <h1 className="font-heading text-[42px] font-extrabold italic leading-tight tracking-tight text-text-primary max-md:text-[32px]">
          Peter&apos;s Lab
        </h1>
        <p className="mt-4 font-body text-[15px] leading-[1.7] text-text-body">
          A place for experiments in technology, reading, and intentional
          living. I build things, read widely, and write about what I learn
          along the way.
        </p>
      </section>

      <hr className="border-border" />

      {/* Recent Writing */}
      <section className="py-8">
        <SectionHeading>Recent Writing</SectionHeading>
        <div>
          {posts.map((post) => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-2 text-right">
          <Link
            href="/blog"
            className="font-mono text-nav-item uppercase text-accent"
          >
            All posts &rarr;
          </Link>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="pb-12">
          <SectionHeading>Featured Project</SectionHeading>
          <ProjectCard project={featuredProject} />
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify homepage**

```bash
cd apps/main && npm run dev
```

Open `http://localhost:3000`. Expected: Hero with italic Playfair title, recent posts list with dates right-aligned, featured project card with green left border. All on warm cream background.

- [ ] **Step 6: Commit**

```bash
git add apps/main/
git commit -m "feat: homepage with hero, recent posts, and featured project"
```

---

### Task 6: Blog Pages (Listing + Post)

**Files:**
- Create: `apps/main/app/blog/page.tsx`
- Create: `apps/main/app/blog/[slug]/page.tsx`
- Create: `apps/main/components/PostList.tsx`

- [ ] **Step 1: Create PostList component**

Create `apps/main/components/PostList.tsx`:

```tsx
import { PostItem } from "./PostItem";
import type { Post } from "@/lib/types";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="font-body text-sm text-text-muted">No posts yet.</p>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create blog listing page**

Create `apps/main/app/blog/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { PostList } from "@/components/PostList";

export const metadata: Metadata = {
  title: "Writing",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">
        Writing
      </h1>
      <PostList posts={posts} />
    </div>
  );
}
```

- [ ] **Step 3: Create individual post page**

Create `apps/main/app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MdxContent } from "@/components/MdxContent";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const date = new Date(post.frontmatter.date);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <header className="mb-8">
        <h1 className="font-heading text-[32px] font-bold leading-tight text-text-primary">
          {post.frontmatter.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-text-muted">
          <time>{formatted}</time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-bg-tag px-2 py-0.5 font-mono text-[10px] text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose-custom">
        <MdxContent source={post.content} />
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Verify blog pages**

Navigate to `http://localhost:3000/blog` — should show post listing.
Click a post — should show full article with MDX rendered content.

- [ ] **Step 5: Commit**

```bash
git add apps/main/app/blog/ apps/main/components/PostList.tsx
git commit -m "feat: blog listing and individual post pages with MDX rendering"
```

---

### Task 7: Projects, Tools, and About Pages

**Files:**
- Create: `apps/main/app/projects/page.tsx`
- Create: `apps/main/app/tools/page.tsx`
- Create: `apps/main/app/about/page.tsx`

- [ ] **Step 1: Create projects page**

Create `apps/main/app/projects/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">
        Projects
      </h1>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create tools page**

Create `apps/main/app/tools/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getAllTools } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tools",
};

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">
        Tools
      </h1>
      <div>
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="border-b border-border py-4 first:pt-0 last:border-b-0"
          >
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-[15px] font-semibold text-text-primary hover:text-accent"
            >
              {tool.name}
            </a>
            <p className="mt-1 font-body text-[13px] text-text-body">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create about page**

Create `apps/main/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MdxContent } from "@/components/MdxContent";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const aboutPath = path.join(process.cwd(), "content", "about.mdx");
  const hasAboutFile = fs.existsSync(aboutPath);

  if (!hasAboutFile) {
    return (
      <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
        <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">
          About
        </h1>
        <p className="font-body text-base leading-[1.7] text-text-body">
          Hi, I&apos;m Peter. I build things, read widely, and write about
          what I learn.
        </p>
      </div>
    );
  }

  const fileContent = fs.readFileSync(aboutPath, "utf-8");
  const { content } = matter(fileContent);

  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">
        About
      </h1>
      <div className="prose-custom">
        <MdxContent source={content} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify all pages**

Navigate to each page and verify:
- `/projects` — shows project cards with green left border
- `/tools` — shows simple tool list with external links
- `/about` — shows about content or fallback text

- [ ] **Step 5: Commit**

```bash
git add apps/main/app/projects/ apps/main/app/tools/ apps/main/app/about/
git commit -m "feat: projects, tools, and about pages"
```

---

## Phase 3: Reading Site

### Task 8: Readwise API Client

**Files:**
- Create: `apps/reading/lib/types.ts`
- Create: `apps/reading/lib/readwise.ts`

- [ ] **Step 1: Define reading site types**

Create `apps/reading/lib/types.ts`:

```typescript
export interface ReadwiseBook {
  id: number;
  title: string;
  author: string;
  category: string;
  source: string;
  cover_image_url: string | null;
  num_highlights: number;
  last_highlight_at: string | null;
  updated: string;
  highlights_url: string;
}

export interface ReadwiseHighlight {
  id: number;
  text: string;
  note: string;
  location: number;
  location_type: string;
  highlighted_at: string | null;
  url: string | null;
  color: string;
  updated: string;
  book_id: number;
  tags: { id: number; name: string }[];
}

export interface BookWithHighlights {
  book: ReadwiseBook;
  highlights: ReadwiseHighlight[];
}

export interface DayData {
  date: string;
  books: {
    book: ReadwiseBook;
    highlights: ReadwiseHighlight[];
  }[];
  highlightCount: number;
  noteCount: number;
}

export interface ArchiveEntry {
  date: string;
  bookCount: number;
  highlightCount: number;
  noteCount: number;
}
```

- [ ] **Step 2: Create Readwise API client**

Create `apps/reading/lib/readwise.ts`:

```typescript
import type {
  ReadwiseBook,
  ReadwiseHighlight,
  BookWithHighlights,
  DayData,
  ArchiveEntry,
} from "./types";

const READWISE_API = "https://readwise.io/api/v2";
const TOKEN = process.env.READWISE_ACCESS_TOKEN;

async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  if (!TOKEN) throw new Error("READWISE_ACCESS_TOKEN not set");

  const results: T[] = [];
  let nextUrl: string | null = `${READWISE_API}${endpoint}`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Authorization: `Token ${TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Readwise API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    results.push(...data.results);
    nextUrl = data.next;
  }

  return results;
}

export async function getBooks(): Promise<ReadwiseBook[]> {
  const books = await fetchAllPages<ReadwiseBook>("/books/?page_size=1000");
  return books.sort(
    (a, b) =>
      new Date(b.last_highlight_at || b.updated).getTime() -
      new Date(a.last_highlight_at || a.updated).getTime()
  );
}

export async function getHighlights(): Promise<ReadwiseHighlight[]> {
  return fetchAllPages<ReadwiseHighlight>("/highlights/?page_size=1000");
}

export async function getBookWithHighlights(
  bookId: number
): Promise<BookWithHighlights | null> {
  if (!TOKEN) throw new Error("READWISE_ACCESS_TOKEN not set");

  const bookRes = await fetch(`${READWISE_API}/books/${bookId}`, {
    headers: { Authorization: `Token ${TOKEN}` },
    next: { revalidate: 3600 },
  });

  if (!bookRes.ok) return null;
  const book: ReadwiseBook = await bookRes.json();

  const highlights = await fetchAllPages<ReadwiseHighlight>(
    `/highlights/?book_id=${bookId}&page_size=1000`
  );

  return {
    book,
    highlights: highlights.sort(
      (a, b) =>
        new Date(a.highlighted_at || a.updated).getTime() -
        new Date(b.highlighted_at || b.updated).getTime()
    ),
  };
}

export async function getDayData(dateStr: string): Promise<DayData> {
  const highlights = await getHighlights();
  const books = await getBooks();

  const bookMap = new Map(books.map((b) => [b.id, b]));

  const dayHighlights = highlights.filter((h) => {
    const hlDate = h.highlighted_at || h.updated;
    return hlDate.startsWith(dateStr);
  });

  const grouped = new Map<number, ReadwiseHighlight[]>();
  for (const hl of dayHighlights) {
    const existing = grouped.get(hl.book_id) || [];
    existing.push(hl);
    grouped.set(hl.book_id, existing);
  }

  const dayBooks = Array.from(grouped.entries())
    .map(([bookId, hls]) => ({
      book: bookMap.get(bookId)!,
      highlights: hls.sort(
        (a, b) =>
          new Date(a.highlighted_at || a.updated).getTime() -
          new Date(b.highlighted_at || b.updated).getTime()
      ),
    }))
    .filter((entry) => entry.book);

  const noteCount = dayHighlights.filter((h) => h.note && h.note.trim()).length;

  return {
    date: dateStr,
    books: dayBooks,
    highlightCount: dayHighlights.length,
    noteCount,
  };
}

export async function getArchive(): Promise<ArchiveEntry[]> {
  const highlights = await getHighlights();

  const dateMap = new Map<
    string,
    { bookIds: Set<number>; highlightCount: number; noteCount: number }
  >();

  for (const hl of highlights) {
    const date = (hl.highlighted_at || hl.updated).slice(0, 10);
    const entry = dateMap.get(date) || {
      bookIds: new Set(),
      highlightCount: 0,
      noteCount: 0,
    };
    entry.bookIds.add(hl.book_id);
    entry.highlightCount++;
    if (hl.note && hl.note.trim()) entry.noteCount++;
    dateMap.set(date, entry);
  }

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      bookCount: data.bookIds.size,
      highlightCount: data.highlightCount,
      noteCount: data.noteCount,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/reading/lib/
git commit -m "feat: Readwise API client with books, highlights, and day data"
```

---

### Task 9: Reading Site Layout

**Files:**
- Create: `apps/reading/components/Header.tsx`
- Create: `apps/reading/components/Footer.tsx`
- Modify: `apps/reading/app/layout.tsx`
- Modify: `apps/reading/tailwind.config.ts`
- Modify: `apps/reading/app/globals.css`

- [ ] **Step 1: Configure Tailwind (same as main site)**

Replace `apps/reading/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";
import sharedConfig from "@peterblog/design-system/tailwind";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      ...sharedConfig.theme?.extend,
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Replace globals.css**

Replace `apps/reading/app/globals.css`:

```css
@import "@peterblog/design-system/globals.css";
```

- [ ] **Step 3: Create reading site Header**

Create `apps/reading/components/Header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Today", href: "/" },
  { label: "Archive", href: "/archive" },
  { label: "Books", href: "/books" },
];

const mainUrl = process.env.NEXT_PUBLIC_MAIN_URL || "https://petermu.com";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content-wide items-center justify-between px-10 py-4 max-md:px-5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-lg font-bold text-text-primary">
            Peter Mu
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Reading Journal
          </span>
        </div>
        <nav className="flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-nav-item uppercase ${
                pathname === item.href
                  ? "border-b-2 border-accent pb-0.5 text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={mainUrl}
            className="font-mono text-nav-item uppercase text-accent"
          >
            &larr; petermu.com
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create reading site Footer**

Create `apps/reading/components/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border py-4 text-center">
      <p className="font-mono text-[9px] tracking-wide text-text-muted">
        Highlights synced from Readwise
      </p>
    </footer>
  );
}
```

- [ ] **Step 5: Update root layout**

Replace `apps/reading/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { fontVariables } from "@peterblog/design-system";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Peter Mu — Reading Journal",
    template: "%s | Reading Journal",
  },
  description: "What I read, highlight, and think about.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://reading.petermu.com"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={fontVariables}>
      <body className="flex min-h-screen flex-col font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/reading/
git commit -m "feat: reading site layout with header, footer, and design system"
```

---

### Task 10: Books Page + Modal

**Files:**
- Create: `apps/reading/app/books/page.tsx`
- Create: `apps/reading/components/BookGrid.tsx`
- Create: `apps/reading/components/BookCard.tsx`
- Create: `apps/reading/components/BookModal.tsx`
- Create: `apps/reading/components/SortControls.tsx`
- Create: `apps/reading/components/HighlightItem.tsx`
- Create: `apps/reading/components/NoteItem.tsx`

- [ ] **Step 1: Create HighlightItem and NoteItem**

Create `apps/reading/components/HighlightItem.tsx`:

```tsx
import { formatTime } from "@/lib/readwise";

export function HighlightItem({
  text,
  highlightedAt,
}: {
  text: string;
  highlightedAt: string | null;
}) {
  return (
    <div className="mb-4 border-l-2 border-border pl-4">
      <p className="font-body text-[13px] leading-[1.7] text-text-primary">
        &ldquo;{text}&rdquo;
      </p>
      {highlightedAt && (
        <p className="mt-1.5 font-mono text-[9px] text-text-muted">
          {formatTime(highlightedAt)}
        </p>
      )}
    </div>
  );
}
```

Create `apps/reading/components/NoteItem.tsx`:

```tsx
export function NoteItem({ text }: { text: string }) {
  return (
    <div className="mb-4 border-l-2 border-accent pl-4">
      <p className="font-body text-[12px] italic leading-[1.7] text-text-body">
        {text}
      </p>
      <p className="mt-1 font-mono text-[9px] text-accent">&#9998; NOTE</p>
    </div>
  );
}
```

- [ ] **Step 2: Create BookCard**

Create `apps/reading/components/BookCard.tsx`:

```tsx
import Image from "next/image";
import type { ReadwiseBook } from "@/lib/types";

export function BookCard({
  book,
  onClick,
}: {
  book: ReadwiseBook;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="text-center text-left">
      <div className="relative">
        {book.cover_image_url ? (
          <Image
            src={book.cover_image_url}
            alt={book.title}
            width={137}
            height={206}
            className="aspect-[2/3] w-full rounded object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-accent p-2">
            <span className="text-center font-heading text-[10px] leading-tight text-bg">
              {book.title}
            </span>
          </div>
        )}
        {book.num_highlights > 0 && (
          <span className="absolute bottom-1 right-1 rounded bg-accent/85 px-1.5 py-0.5 font-mono text-[9px] text-white">
            {book.num_highlights}
          </span>
        )}
      </div>
      <h3 className="mt-1.5 line-clamp-2 font-body text-[11px] font-medium leading-tight text-text-primary">
        {book.title}
      </h3>
      <p className="font-body text-[9px] text-text-muted">{book.author}</p>
    </button>
  );
}
```

- [ ] **Step 3: Create BookModal**

Create `apps/reading/components/BookModal.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { BookWithHighlights } from "@/lib/types";
import { HighlightItem } from "./HighlightItem";
import { NoteItem } from "./NoteItem";

export function BookModal({
  data,
  onClose,
}: {
  data: BookWithHighlights;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { book, highlights } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/20 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-[700px] overflow-y-auto rounded-xl bg-bg p-8 shadow-[0_16px_48px_rgba(28,26,23,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 font-mono text-lg text-text-muted hover:text-text-primary"
        >
          &times;
        </button>

        <div className="mb-6 flex gap-4">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              width={80}
              height={120}
              className="aspect-[2/3] w-20 rounded object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-20 items-center justify-center rounded bg-accent p-2">
              <span className="text-center font-heading text-xs text-bg">
                {book.title}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-heading text-xl font-bold text-text-primary">
              {book.title}
            </h2>
            <p className="mt-1 font-body text-sm text-text-muted">
              {book.author}
            </p>
            <p className="mt-2 font-mono text-section-label uppercase text-text-label">
              {highlights.length} highlights
            </p>
          </div>
        </div>

        <div>
          {highlights.map((hl) => (
            <div key={hl.id}>
              <HighlightItem
                text={hl.text}
                highlightedAt={hl.highlighted_at}
              />
              {hl.note && hl.note.trim() && <NoteItem text={hl.note} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create SortControls**

Create `apps/reading/components/SortControls.tsx`:

```tsx
"use client";

export type SortMode = "recent" | "highlights" | "title";

export function SortControls({
  sort,
  onSortChange,
  search,
  onSearchChange,
  years,
  selectedYear,
  onYearChange,
}: {
  sort: SortMode;
  onSortChange: (s: SortMode) => void;
  search: string;
  onSearchChange: (s: string) => void;
  years: number[];
  selectedYear: number | null;
  onYearChange: (y: number | null) => void;
}) {
  const sortOptions: { label: string; value: SortMode }[] = [
    { label: "Recent", value: "recent" },
    { label: "Highlights", value: "highlights" },
    { label: "Title", value: "title" },
  ];

  return (
    <div className="mb-6 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
      <div className="flex gap-1">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
              sort === opt.value
                ? "bg-text-primary text-bg"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-32 rounded border border-border bg-bg-card px-2.5 py-1 font-mono text-[11px] text-text-body outline-none focus:border-accent"
        />
        <select
          value={selectedYear ?? "all"}
          onChange={(e) =>
            onYearChange(e.target.value === "all" ? null : Number(e.target.value))
          }
          className="rounded border border-border bg-bg-card px-2 py-1 font-mono text-[10px] text-text-body outline-none"
        >
          <option value="all">All</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create BookGrid (client component that assembles everything)**

Create `apps/reading/components/BookGrid.tsx`:

```tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import type { ReadwiseBook, BookWithHighlights } from "@/lib/types";
import { BookCard } from "./BookCard";
import { BookModal } from "./BookModal";
import { SortControls, type SortMode } from "./SortControls";

export function BookGrid({ books }: { books: ReadwiseBook[] }) {
  const [sort, setSort] = useState<SortMode>("recent");
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [modalData, setModalData] = useState<BookWithHighlights | null>(null);

  const years = useMemo(() => {
    const yearSet = new Set<number>();
    books.forEach((b) => {
      const date = b.last_highlight_at || b.updated;
      if (date) yearSet.add(new Date(date).getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [books]);

  const filtered = useMemo(() => {
    let result = [...books];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    if (selectedYear) {
      result = result.filter((b) => {
        const date = b.last_highlight_at || b.updated;
        return date && new Date(date).getFullYear() === selectedYear;
      });
    }

    switch (sort) {
      case "highlights":
        result.sort((a, b) => b.num_highlights - a.num_highlights);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
      default:
        result.sort(
          (a, b) =>
            new Date(b.last_highlight_at || b.updated).getTime() -
            new Date(a.last_highlight_at || a.updated).getTime()
        );
    }

    return result;
  }, [books, sort, search, selectedYear]);

  const handleBookClick = useCallback(async (bookId: number) => {
    const res = await fetch(`/api/book/${bookId}`);
    if (res.ok) {
      const data: BookWithHighlights = await res.json();
      setModalData(data);
    }
  }, []);

  return (
    <>
      <SortControls
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearchChange={setSearch}
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <div className="grid grid-cols-4 gap-5 max-md:grid-cols-2">
        {filtered.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => handleBookClick(book.id)}
          />
        ))}
      </div>
      {modalData && (
        <BookModal data={modalData} onClose={() => setModalData(null)} />
      )}
    </>
  );
}
```

- [ ] **Step 6: Create book detail API route**

Create `apps/reading/app/api/book/[id]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getBookWithHighlights } from "@/lib/readwise";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const bookId = parseInt(params.id, 10);
  if (isNaN(bookId)) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const data = await getBookWithHighlights(bookId);
  if (!data) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 7: Create books page**

Create `apps/reading/app/books/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getBooks } from "@/lib/readwise";
import { BookGrid } from "@/components/BookGrid";

export const metadata: Metadata = {
  title: "Book Wall",
};

export const revalidate = 3600;

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="mx-auto max-w-content-wide px-10 py-10 max-md:px-5">
      <div className="mb-2 flex items-baseline justify-between">
        <h1 className="font-heading text-[28px] font-bold text-text-primary">
          Book Wall
        </h1>
        <span className="font-mono text-section-label uppercase text-text-muted">
          {books.length} books
        </span>
      </div>
      <BookGrid books={books} />
    </div>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add apps/reading/
git commit -m "feat: books page with grid, sort/filter, search, and detail modal"
```

---

### Task 11: Today Page

**Files:**
- Create: `apps/reading/app/page.tsx`
- Create: `apps/reading/components/DayTimeline.tsx`
- Create: `apps/reading/components/DateNav.tsx`

- [ ] **Step 1: Create DateNav component**

Create `apps/reading/components/DateNav.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/readwise";

export function DateNav({ date }: { date: string }) {
  const router = useRouter();

  const currentDate = new Date(date + "T00:00:00");

  const navigate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    const dateStr = newDate.toISOString().slice(0, 10);
    router.push(`/?date=${dateStr}`);
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-sm text-text-muted hover:text-text-primary"
      >
        &larr;
      </button>
      <h1 className="font-heading text-[28px] font-bold text-text-primary">
        {formatDate(date)}
      </h1>
      <button
        onClick={() => navigate(1)}
        className="font-mono text-sm text-text-muted hover:text-text-primary"
      >
        &rarr;
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create DayTimeline component**

Create `apps/reading/components/DayTimeline.tsx`:

```tsx
import Image from "next/image";
import type { DayData } from "@/lib/types";
import { HighlightItem } from "./HighlightItem";
import { NoteItem } from "./NoteItem";

export function DayTimeline({ data }: { data: DayData }) {
  if (data.books.length === 0) {
    return (
      <p className="mt-8 text-center font-body text-sm text-text-muted">
        No reading highlights for this day.
      </p>
    );
  }

  return (
    <div>
      {data.books.map(({ book, highlights }) => (
        <div key={book.id} className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            {book.cover_image_url ? (
              <Image
                src={book.cover_image_url}
                alt={book.title}
                width={36}
                height={52}
                className="h-[52px] w-9 rounded object-cover"
              />
            ) : (
              <div className="flex h-[52px] w-9 items-center justify-center rounded bg-accent">
                <span className="font-mono text-[8px] text-bg">Book</span>
              </div>
            )}
            <div>
              <h3 className="font-body text-sm font-semibold text-text-primary">
                {book.title}
              </h3>
              <p className="font-body text-[11px] text-text-muted">
                {book.author}
              </p>
            </div>
          </div>

          {highlights.map((hl) => (
            <div key={hl.id}>
              <HighlightItem
                text={hl.text}
                highlightedAt={hl.highlighted_at}
              />
              {hl.note && hl.note.trim() && <NoteItem text={hl.note} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create Today page**

Create `apps/reading/app/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getDayData, getArchive } from "@/lib/readwise";
import { DateNav } from "@/components/DateNav";
import { DayTimeline } from "@/components/DayTimeline";

export const metadata: Metadata = {
  title: "Today",
};

export const revalidate = 3600;

export default async function TodayPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  let dateStr = searchParams.date;

  if (!dateStr) {
    // Find the most recent day with highlights
    const archive = await getArchive();
    dateStr = archive.length > 0 ? archive[0].date : new Date().toISOString().slice(0, 10);
  }

  const dayData = await getDayData(dateStr);

  return (
    <div className="mx-auto max-w-content px-10 py-10 max-md:px-5">
      <DateNav date={dateStr} />

      <p className="mb-8 text-center font-mono text-section-label uppercase text-text-muted">
        {dayData.books.length} books &middot; {dayData.highlightCount}{" "}
        highlights &middot; {dayData.noteCount} notes
      </p>

      <DayTimeline data={dayData} />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/reading/
git commit -m "feat: today page with daily reading timeline and date navigation"
```

---

### Task 12: Archive Page

**Files:**
- Create: `apps/reading/app/archive/page.tsx`
- Create: `apps/reading/components/ArchiveRow.tsx`

- [ ] **Step 1: Create ArchiveRow component**

Create `apps/reading/components/ArchiveRow.tsx`:

```tsx
import Link from "next/link";
import type { ArchiveEntry } from "@/lib/types";

export function ArchiveRow({ entry }: { entry: ArchiveEntry }) {
  const date = new Date(entry.date + "T00:00:00");
  const formatted = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/?date=${entry.date}`}
      className="flex items-center justify-between border-b border-border py-3 hover:bg-bg-section"
    >
      <div className="flex items-center gap-4">
        <span className="w-12 font-mono text-[11px] text-text-muted">
          {formatted}
        </span>
        <span className="font-mono text-[10px] text-text-body">
          {entry.bookCount} books &middot; {entry.highlightCount} highlights
        </span>
      </div>
      <span className="rounded bg-accent/85 px-1.5 py-0.5 font-mono text-[9px] text-white">
        {entry.highlightCount}
      </span>
    </Link>
  );
}
```

- [ ] **Step 2: Create archive page**

Create `apps/reading/app/archive/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getArchive } from "@/lib/readwise";
import { ArchiveRow } from "@/components/ArchiveRow";

export const metadata: Metadata = {
  title: "Archive",
};

export const revalidate = 3600;

export default async function ArchivePage() {
  const archive = await getArchive();

  // Group by year-month
  const grouped = new Map<string, typeof archive>();
  for (const entry of archive) {
    const yearMonth = entry.date.slice(0, 7);
    const existing = grouped.get(yearMonth) || [];
    existing.push(entry);
    grouped.set(yearMonth, existing);
  }

  return (
    <div className="mx-auto max-w-content px-10 py-10 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">
        Archive
      </h1>
      {Array.from(grouped.entries()).map(([yearMonth, entries]) => {
        const date = new Date(yearMonth + "-01T00:00:00");
        const label = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });

        return (
          <div key={yearMonth} className="mb-8">
            <h2 className="mb-3 font-mono text-section-label uppercase text-text-label">
              {label}
            </h2>
            <div>
              {entries.map((entry) => (
                <ArchiveRow key={entry.date} entry={entry} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/reading/
git commit -m "feat: archive page with date-indexed reading history"
```

---

## Phase 4: Polish & Deploy

### Task 13: Mobile Responsiveness + Next.js Config

**Files:**
- Modify: `apps/main/next.config.ts`
- Modify: `apps/reading/next.config.ts`
- Modify: `apps/main/components/Header.tsx` (add mobile menu)

- [ ] **Step 1: Add mobile hamburger menu to main site Header**

Update `apps/main/components/Header.tsx` to add a mobile menu button that toggles nav visibility on small screens. Convert to `"use client"` component with `useState` for menu toggle.

Add a hamburger button visible on `md:hidden` that toggles the nav items in a vertical dropdown below the header.

- [ ] **Step 2: Configure Next.js for main site**

Replace `apps/main/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@peterblog/design-system"],
};

export default nextConfig;
```

- [ ] **Step 3: Configure Next.js for reading site**

Replace `apps/reading/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@peterblog/design-system"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
```

The `images.remotePatterns` allows book covers from any Readwise source domain.

- [ ] **Step 4: Verify both sites build**

```bash
cd /Users/liasiloam/Vibecoding/PeterBlog
npx turbo run build
```

Expected: Both apps build successfully.

- [ ] **Step 5: Commit**

```bash
git add apps/
git commit -m "feat: mobile responsiveness and Next.js configuration"
```

---

### Task 14: SEO + Final Touches

**Files:**
- Create: `apps/main/app/sitemap.ts`
- Create: `apps/main/app/robots.ts`
- Create: `apps/reading/app/sitemap.ts`
- Modify: `apps/main/app/not-found.tsx`

- [ ] **Step 1: Create sitemap for main site**

Create `apps/main/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://petermu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
  }));

  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    { url: `${BASE_URL}/projects`, lastModified: new Date() },
    { url: `${BASE_URL}/tools`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    ...postUrls,
  ];
}
```

- [ ] **Step 2: Create robots.txt**

Create `apps/main/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://petermu.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Create 404 page**

Create `apps/main/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center justify-center px-10 py-32 max-md:px-5">
      <h1 className="font-heading text-[48px] font-bold text-text-primary">
        404
      </h1>
      <p className="mt-2 font-body text-sm text-text-muted">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 font-mono text-nav-item uppercase text-accent"
      >
        &larr; Back home
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Final build verification**

```bash
cd /Users/liasiloam/Vibecoding/PeterBlog
npx turbo run build
```

Expected: Both apps build with zero errors.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: SEO sitemap, robots.txt, and 404 page"
```

---

### Task 15: PMAlfred Project Management Setup

**Files:**
- Create: `.pm/project.md`
- Create: `.pm/route.md`
- Create: `.pm/ledger.md`
- Create: `.pm/lessons.md`
- Create: `.pm/backlog.md`
- Create: `.pm/bugs.md`
- Create: `.pm/analytics.md`
- Create: `.pm/house-rules.md`

- [ ] **Step 1: Initialize PMAlfred directory**

Create all `.pm/` files per the PMAlfred specification in CLAUDE.md. Set:
- Project name: "PeterBlog Redesign"
- Sprint 1: "Foundation & Main Site"
- Capacity based on tasks completed
- house-rules.md with Definition of Done for this project

- [ ] **Step 2: Commit**

```bash
git add .pm/
git commit -m "chore: initialize PMAlfred project management"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1: Foundation | 1-3 | Monorepo, design system, main site layout |
| 2: Main Site Content | 4-7 | MDX pipeline, homepage, blog, projects/tools/about |
| 3: Reading Site | 8-12 | Readwise API, layout, books, today, archive |
| 4: Polish & Deploy | 13-15 | Mobile, SEO, PMAlfred setup |

**Total:** 15 tasks, each with 3-8 steps. Independent tasks within each phase can be parallelized via subagent-driven development.
