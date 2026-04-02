# My Blog Project Workspace

This is the development workspace for my personal blog. The actual deployable application is in the `my-blog/` directory.

## Project Structure

```
.
├── my-blog/          # 🚀 Deployable Next.js application
├── docs/             # 📚 Project documentation
├── CLAUDE.md         # 🤖 AI assistant instructions
├── README.md         # 📖 This file
└── .env.local        # 🔐 Local environment variables (git ignored)
```

## Important

- **Deploy from `my-blog/` directory only**
- Keep all sensitive files (tokens, keys) outside of `my-blog/`
- Never commit `.env.local` or any files with credentials

## Quick Start

```bash
cd my-blog
npm install
npm run dev
```

## Security

See `SECURITY_CHECKLIST.md` for security best practices.