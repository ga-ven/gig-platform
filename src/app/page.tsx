import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Database, Users, Shield, ArrowRight, CheckCircle, Zap, FileText, ExternalLink } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Play className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">零工平台</span>
          </div>
          <div className="flex gap-4">
            <Link href="/setup">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                设置指南
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/auth/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Setup Notice */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">
                首次使用？需要完成快速配置才能使用完整功能
              </span>
            </div>
            <Link href="/setup">
              <Button size="sm" variant="outline" className="border-amber-300">
                查看设置指南
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            零成本搭建 · 0 基础可用
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            连接雇主与师傅的
            <br />
            <span className="text-primary">智能零工撮合平台</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            轻松发布任务，快速找到合适的师傅。支持实时通知，资金托管，
            双向评价，让零工交易更简单、更安全。
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/setup">
              <Button size="lg" className="text-lg px-8" variant="default">
                开始设置
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
               了解更多
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Setup Steps Preview */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">3 步快速启动</h2>
            <p className="text-muted-foreground">
              完成简单配置，立即开始使用
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                步骤 1
              </div>
              <CardHeader>
                <Database className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle>运行数据库迁移</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  在 Supabase SQL Editor 中运行迁移脚本，创建所需的数据表
                </p>
                <a 
                  href="https://supabase.com/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">
                    打开 Supabase
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                步骤 2
              </div>
              <CardHeader>
                <Users className="h-10 w-10 text-green-500 mb-2" />
                <CardTitle>配置 GitHub OAuth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  启用第三方登录，无需邮箱验证，快速上手
                </p>
                <Link href="/setup">
                  <Button size="sm" variant="outline">
                    查看配置指南
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                步骤 3
              </div>
              <CardHeader>
                <Zap className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle>开始使用！</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  配置完成，返回注册账号，开始您的零工平台之旅
                </p>
                <Link href="/auth/register">
                  <Button size="sm">
                    立即注册
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">为什么选择我们</h2>
            <p className="text-muted-foreground">
              为独立开发者打造的零成本建站方案
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>快速上手</CardTitle>
                <CardDescription>
                  基于 Next.js + Supabase，最现代化的技术栈，让开发效率提升 10 倍
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>资金托管</CardTitle>
                <CardDescription>
                  平台代为托管款项，完成任务后再分账，杜绝跳单风险
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>实时撮合</CardTitle>
                <CardDescription>
                  支持实时通知，雇主发单、师傅申请、状态变更第一时间知晓
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">如何工作</h2>
            <p className="text-muted-foreground">
              简单的四步流程，完成零工撮合
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">注册账号</h3>
              <p className="text-sm text-muted-foreground">
                选择您的角色（雇主/师傅），完成注册
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">发布/接任务</h3>
              <p className="text-sm text-muted-foreground">
                雇主发布任务，师傅浏览并申请
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">支付托管</h3>
              <p className="text-sm text-muted-foreground">
                雇主预付资金，平台托管保障双方
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">完成评价</h3>
              <p className="text-sm text-muted-foreground">
                任务完成，互评打分，平台分账
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">技术栈</h2>
            <p className="text-muted-foreground">
              使用业界领先的技术，打造高性能应用
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              "Next.js 14",
              "Supabase",
              "TypeScript",
              "Tailwind CSS",
              "shadcn/ui",
              "Vercel",
            ].map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-muted-foreground mb-8">
            完成 3 步配置，立即开始使用您的零工平台！
          </p>
          <Link href="/setup">
            <Button size="lg" className="text-lg px-8">
              <Zap className="mr-2 h-5 w-5" />
              开始设置
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 零工平台. 基于 Next.js + Supabase 构建。</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/setup" className="text-sm hover:underline">
              设置指南
            </Link>
            <Link href="/diagnose" className="text-sm hover:underline">
              诊断工具
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
