# 安全检查清单 - 多重凭证泄露紧急处理

## 🚨 最新发现（2025-01-17）

### 泄露的凭证清单：
1. **Notion API Token** - 在多个脚本文件中硬编码
2. **Supabase Service Role Key** - 在 .claude/mcp.json 中
3. **多个 Notion 数据库 ID** - 在脚本文件中

## 紧急处理步骤

### 1. 立即撤销所有泄露的凭证（最优先）

#### Notion Token 撤销：
- 访问 https://www.notion.so/my-integrations
- 删除或重新生成受影响的集成 token

#### Supabase 密钥重新生成：
- [ ] 登录 Supabase Dashboard
- [ ] 进入项目设置 > API
- [ ] 重新生成 Service Role Key
- [ ] 复制新的密钥

### 2. 更新所有使用该密钥的地方
- [ ] 更新本地 `.env.local` 文件
- [ ] 更新 Vercel 环境变量
- [ ] 更新其他部署环境（如有）

### 3. 验证新密钥工作正常
- [ ] 本地测试：`npm run dev`
- [ ] 测试需要认证的功能
- [ ] 确认 Vercel 部署正常

### 4. 清理 Git 历史
- [ ] 运行 `./clean-git-history.sh`
- [ ] Force push 到远程仓库
- [ ] 通知所有协作者更新本地仓库

### 5. 安全加固措施
- [ ] 确认 `.gitignore` 包含所有敏感文件
- [ ] 设置 GitHub Secret Scanning 警报
- [ ] 考虑使用环境变量管理工具（如 dotenv-vault）

## 预防措施

### 开发最佳实践
1. **永远不要**在代码或文档中硬编码密钥
2. 使用 `.env.example` 文件作为模板
3. 在文档中只提供获取密钥的说明，不要包含实际密钥
4. 定期审查提交历史

### Git 配置建议
```bash
# 设置全局 gitignore
echo "*.env*" >> ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

### 使用 pre-commit hooks
```bash
# 安装 pre-commit
pip install pre-commit

# 创建 .pre-commit-config.yaml
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
EOF

# 初始化
pre-commit install
```

## 已完成的修复
- ✅ 从文档中删除了暴露的密钥
- ✅ 更新了 `.gitignore` 文件
- ✅ 准备了清理脚本
- ✅ 创建了安全检查清单

## 后续监控
1. 监控 Supabase 项目的异常活动
2. 检查是否有未授权的数据访问
3. 考虑启用审计日志
4. 定期轮换密钥（建议每 3-6 个月）

---

**记住：密钥一旦泄露，即使从历史中删除，也应该立即重新生成新的密钥！**