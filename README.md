# 零工撮合平台 (Gig Platform)

基于 Next.js 14 + Supabase 构建的零工撮合平台，实现从"发单-接单-支付-评价"的完整业务闭环。

## ✨ 特性

- 🔐 **用户认证** - 基于 Supabase Auth 的邮箱/第三方登录
- 👥 **双角色系统** - 雇主（发单方）和师傅（服务方）
- 📋 **任务管理** - 发布、浏览、申请、撮合
- 💰 **资金托管** - 微信支付集成，资金安全有保障
- ⭐ **评价系统** - 双向评价，构建信任体系
- 📱 **响应式设计** - 完美支持移动端
- 🔒 **RLS 安全策略** - 行级安全，数据隔离
- 🚀 **0 成本部署** - 使用 Vercel + Supabase 免费套餐

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **UI**: shadcn/ui + Tailwind CSS
- **样式**: Tailwind CSS 4
- **图标**: Lucide React
- **部署**: Vercel

## 📦 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/gig-platform.git
cd gig-platform
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 创建 [Supabase](https://supabase.com) 项目
2. 在 SQL Editor 中运行 `supabase/migrations/001_initial_schema.sql`
3. 复制环境变量：

```bash
cp .env.example .env.local
```

4. 填写 `.env.local` 中的 Supabase 配置

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 5. 部署到 Vercel

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 项目结构

```
gig-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # 营销页面
│   │   ├── (dashboard)/        # 用户仪表盘
│   │   │   ├── employer/        # 雇主视图
│   │   │   └── worker/         # 师傅视图
│   │   ├── auth/               # 登录/注册
│   │   └── api/                # API Routes
│   ├── components/             # UI 组件
│   │   ├── ui/                 # shadcn/ui 组件
│   │   └── features/           # 业务组件
│   ├── lib/                    # 工具库
│   │   └── supabase/          # Supabase 客户端
│   ├── hooks/                  # React Hooks
│   └── types/                  # TypeScript 类型
├── supabase/
│   └── migrations/             # 数据库迁移
└── public/                    # 静态资源
```

## 🎯 核心功能

### 雇主端
- 发布任务（标题、描述、技能要求、报酬等）
- 查看和管理收到的申请
- 选择合适的师傅
- 支付托管
- 对完成的订单进行评价

### 师傅端
- 浏览所有可用任务
- 搜索和筛选任务
- 申请任务
- 查看申请状态
- 查看收入记录
- 对雇主进行评价

## 🔧 开发

```bash
# 开发模式
npm run dev

# 类型检查
npm run typecheck

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## ⚠️ 注意事项

1. **环境变量**: 确保正确配置 Supabase 的 URL 和密钥
2. **数据库迁移**: 部署前先在 Supabase 运行 SQL 迁移脚本
3. **支付集成**: MVP 版本使用模拟支付，生产环境需要集成真实的微信支付
4. **安全**: 生产环境请启用 RLS 策略并妥善保管 Service Role Key

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
