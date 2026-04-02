# Lessons Learned

## Sprint 1

- Tailwind v4 使用 CSS-first 配置（`@theme` 指令），不需要 JS 配置文件
- Next.js 16 的 `params` 和 `searchParams` 是 Promise，需要 `await`
- `create-next-app` 即使用 `--no-git` 也会创建 `.git` 目录，需要手动清理
- npm workspaces 用 `"*"` 而非 `"workspace:*"` 引用工作区包
- Readwise API 页面在无 token 时应使用 `force-dynamic` 避免构建时调用
