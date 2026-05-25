# Vercel 部署指南

## 零工撮合平台 - 快速部署到 Vercel

---

## 🚀 快速部署步骤

### 第一步：推送代码到 GitHub

在项目根目录执行：

```bash
# 1. 初始化 Git 仓库
cd d:\coding\gig-platform
git init

# 2. 添加所有文件
git add .

# 3. 提交代码
git commit -m "Initial commit: Gig Platform MVP"

# 4. 创建主分支
git branch -M main

# 5. 添加远程仓库（替换为你的 GitHub 仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/gig-platform.git

# 6. 推送代码
git push -u origin main
```

### 第二步：在 Vercel 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 **gig-platform** 仓库
5. 点击 **"Import"**

### 第三步：配置环境变量

在 Vercel 项目配置页面，找到 **"Environment Variables"**，添加以下变量：

```env
# Supabase 配置（从 .env.local 复制）
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
SUPABASE_SERVICE_ROLE_KEY=你的service-role-key

# 应用配置
NEXT_PUBLIC_APP_URL=https://你的项目.vercel.app
```

⚠️ **重要**：替换为你在 Supabase 的真实配置！

### 第四步：部署

1. 确保所有环境变量已添加
2. 点击 **"Deploy"**
3. 等待部署完成（约 1-2 分钟）

---

## 🎯 部署完成后的配置

### 1. 更新 Supabase 允许的域名

部署后，你需要在 Supabase 配置允许的域名：

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入你的项目 → **Authentication** → **URL Configuration**
3. 在 **Site URL** 中添加：
   ```
   https://你的项目.vercel.app
   ```
4. 在 **Redirect URLs** 中添加：
   ```
   https://你的项目.vercel.app/*
   ```

### 2. 测试部署的网站

部署成功后，你会获得一个 Vercel 域名，例如：
```
https://gig-platform.vercel.app
```

访问这个地址测试你的应用。

---

## 🔧 自定义域名（可选）

如果你有自己的域名，可以配置自定义域名：

1. 在 Vercel 项目设置中点击 **"Domains"**
2. 输入你的域名（如 `gig.yourdomain.com`）
3. 按照提示添加 DNS 记录
4. 等待验证完成

---

## ⚠️ 重要注意事项

### 1. 环境变量

确保在 Vercel 中配置了所有环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. 数据库迁移

确保在 Supabase 中已经运行了所有迁移脚本：
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_custom_users.sql`

### 3. 跨域配置

如果遇到 CORS 错误，在 Supabase 中添加你的 Vercel 域名到允许列表。

---

## 📊 部署后检查清单

- [ ] Vercel 部署成功
- [ ] 环境变量已配置
- [ ] 数据库迁移已运行
- [ ] Supabase 域名配置正确
- [ ] 可以访问网站首页
- [ ] 可以注册新用户
- [ ] 可以登录
- [ ] 可以访问 Dashboard

---

## 🔍 故障排查

### 部署失败

**检查项：**
1. GitHub 仓库是否公开或私有？
2. 环境变量是否正确配置？
3. package.json 是否正确？

**解决方案：**
- 查看 Vercel 部署日志
- 确认环境变量格式正确
- 检查是否有编译错误

### 登录/注册不工作

**检查项：**
1. Supabase 环境变量是否正确？
2. 数据库迁移是否完成？
3. RLS 策略是否正确配置？

**解决方案：**
- 重新检查 Supabase 配置
- 在 Supabase SQL Editor 重新运行迁移脚本
- 检查浏览器控制台错误信息

### 页面样式问题

**检查项：**
1. Tailwind CSS 是否正确编译？
2. CDN 资源是否可访问？

**解决方案：**
- 运行 `npm run build` 本地检查
- 清除浏览器缓存
- 检查网络请求

---

## 💰 成本说明

### Vercel Hobby（免费）

| 资源 | 限制 |
|------|------|
| 带宽 | 100GB/月 |
| 项目数 | 无限 |
| Serverless Functions | 100小时/月 |
| 自定义域名 | 支持 |

### Supabase Free Tier

| 资源 | 限制 |
|------|------|
| 数据库 | 500MB |
| 存储 | 1GB |
| 带宽 | 5GB/月 |
| 用户数 | 100k/月 |

### 总成本：$0/月

---

## 🎉 恭喜！

你的零工撮合平台已成功部署到 Vercel！

**访问地址：** `https://你的项目.vercel.app`

---

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)

---

## 🆘 需要帮助？

如果遇到问题：
1. 查看 Vercel 部署日志
2. 检查 Supabase 状态
3. 确认环境变量配置

祝你部署顺利！ 🚀
