import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Database, Users, Shield, Zap, ArrowRight, Play, FileText, Key } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Play className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">零工平台 - 快速开始</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-1">
            🚀 首次设置
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            欢迎使用零工撮合平台
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            按照以下 3 个简单步骤完成配置，开始使用您的零工平台
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {/* Step 1 */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    运行数据库迁移
                  </CardTitle>
                  <CardDescription>
                    在 Supabase 中创建所需的数据表
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                将以下 SQL 脚本粘贴到 Supabase SQL Editor 并运行：
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <code className="text-xs">
                  {`-- 在 Supabase SQL Editor 中运行以下内容：
-- 1. 打开 Supabase Dashboard
-- 2. 进入 SQL Editor
-- 3. 复制下面文件的内容：
--    supabase/migrations/001_initial_schema.sql
-- 4. 粘贴并点击 Run`}
                </code>
              </div>
              <div className="flex gap-3">
                <a 
                  href="https://supabase.com/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button>
                    打开 Supabase Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/diagnose">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    查看诊断工具
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    配置 GitHub OAuth（推荐）
                  </CardTitle>
                  <CardDescription>
                    启用第三方登录，无需邮箱验证即可使用
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">GitHub OAuth Callback URL:</p>
                <code className="text-xs bg-white px-3 py-2 rounded block border">
                  https://tiycwvtblbczzllhopdv.supabase.co/auth/v1/callback
                </code>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>在 Supabase 中配置：</strong></p>
                <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                  <li>Authentication → Providers → GitHub</li>
                  <li>启用 Enable Sign in with GitHub</li>
                  <li>填入 GitHub Client ID 和 Secret</li>
                  <li>保存</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    开始使用！
                  </CardTitle>
                  <CardDescription>
                    配置完成后，返回这里开始使用平台
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                完成以上步骤后，您可以：
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">作为雇主</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 注册并创建雇主账号</li>
                    <li>• 发布零工任务</li>
                    <li>• 管理收到的申请</li>
                    <li>• 支付托管资金</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">作为师傅</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 注册并创建师傅账号</li>
                    <li>• 浏览可接的任务</li>
                    <li>• 申请感兴趣的任务</li>
                    <li>• 查看收入记录</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Link href="/auth/register">
                  <Button size="lg">
                    <Users className="mr-2 h-5 w-5" />
                    立即注册
                  </Button>
                </Link>
                <Link href="/diagnose">
                  <Button size="lg" variant="outline">
                    <FileText className="mr-2 h-5 w-5" />
                    诊断配置问题
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">其他资源</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/diagnose" className="block">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <h4 className="font-medium">配置诊断</h4>
                  <p className="text-sm text-muted-foreground">自动检测配置问题</p>
                </div>
              </Link>
              <a 
                href="https://supabase.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <Key className="h-8 w-8 text-green-500 mb-2" />
                  <h4 className="font-medium">Supabase 文档</h4>
                  <p className="text-sm text-muted-foreground">官方文档和教程</p>
                </div>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <Users className="h-8 w-8 text-purple-500 mb-2" />
                  <h4 className="font-medium">GitHub</h4>
                  <p className="text-sm text-muted-foreground">OAuth 配置指南</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 零工平台. 基于 Next.js + Supabase 构建。</p>
          <p className="text-sm mt-2">
            需要帮助？查看 <a href="#" className="text-primary hover:underline">文档</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
