# House Rules

## Definition of Done

- [ ] TypeScript 编译无错误
- [ ] `npm run build` 两个站点都通过
- [ ] 设计系统 token 使用一致（颜色、字体、间距）
- [ ] 移动端布局正常
- [ ] 代码已 commit

## Design Principles

1. **编辑式极简** — 排版驱动层次，不靠颜色和大小
2. **零运行时依赖**（主站） — 无 API 调用、无数据库
3. **暖色系** — 所有颜色在暖色调家族内，不使用冷色
4. **克制** — 无动画、无过度交互
5. **内容为王** — 书籍封面和文字本身就是视觉亮点

## Tech Standards

- Next.js 16 + Tailwind v4 (CSS-first config)
- 所有页面使用 Server Components（除非需要交互）
- MDX 内容放在 `content/` 目录
- Readwise 数据通过 ISR 或 force-dynamic 获取
