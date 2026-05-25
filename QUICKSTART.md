# 🚀 快速配置指南

## 当前状态

⚠️ **项目已初始化，但需要配置 Supabase 才能完整运行**

### 已完成 ✅
- Next.js 项目结构
- Tailwind CSS 配置
- shadcn/ui 组件库
- Supabase 客户端代码
- 数据库 Schema 设计
- 所有页面和功能代码

### 待配置 ⚠️
- Supabase 项目设置
- 数据库迁移
- 环境变量配置

---

## 快速开始

### 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "New Project" 创建新项目
3. 等待项目创建完成（约 2 分钟）

### 步骤 2: 获取 API 密钥

1. 进入项目 Dashboard
2. 点击左侧菜单 **Settings** → **API**
3. 复制以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key
   - **service_role** key (仅限服务端使用)

### 步骤 3: 运行数据库迁移

1. 在 Supabase Dashboard 点击左侧 **SQL Editor**
2. 复制 `supabase/migrations/001_initial_schema.sql` 的内容
3. 粘贴到 SQL Editor 并点击 **Run**

### 步骤 4: 配置环境变量

编辑 `d:\coding\gig-platform\.env.local` 文件：

```env
# Supabase Configuration - 替换为你的真实密钥
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
SUPABASE_SERVICE_ROLE_KEY=你的service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 步骤 5: 启动开发服务器

```bash
cd d:\coding\gig-platform
npm run dev
```

访问 **http://localhost:3000** 查看应用！

---

## 测试账号

配置完成后，你可以：

### 创建雇主账号
1. 访问注册页面
2. 输入邮箱、密码
3. 选择角色：**我是雇主（发布任务）**
4. 点击注册

### 创建师傅账号
1. 访问注册页面
2. 输入邮箱、密码
3. 选择角色：**我是师傅（提供服务）**
4. 点击注册

---

## 常见问题

### Q: 注册时显示错误？
**A**: 检查 Supabase 的 Auth 设置，确保 Email 确认已禁用（开发环境）

### Q: 页面加载很慢？
**A**: 首次加载需要编译，下次会快很多。也可以运行 `npm run build` 预编译

### Q: 如何查看数据库？
**A**: 在 Supabase Dashboard 点击 **Table Editor** 查看数据表

### Q: 如何重置数据库？
**A**: 在 **SQL Editor** 中运行：
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
然后重新运行迁移脚本。

---

## 下一步

配置完成后，你可以：

1. ✅ 测试用户注册/登录
2. ✅ 测试任务发布
3. ✅ 测试任务申请
4. ✅ 测试支付流程
5. ✅ 部署到 Vercel

部署到 Vercel 的详细指南请查看 **DEPLOYMENT.md**

---

## 技术支持

如遇问题：
1. 检查 Supabase 状态: [status.supabase.com](https://status.supabase.com)
2. 查看 Next.js 文档: [nextjs.org/docs](https://nextjs.org/docs)
3. 查看 Supabase 文档: [supabase.com/docs](https://supabase.com/docs)

祝你开发顺利！ 🚀
