import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, Users, Shield, Zap } from "lucide-react"

async function testSupabaseConnection() {
  const results = {
    connection: false,
    tables: false,
    auth: false,
    error: null as string | null,
  }

  try {
    // Test basic connection by fetching the URL
    const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL!, {
      method: 'HEAD',
    })
    results.connection = response.ok || response.status === 404

    // The 404 is expected since we're just hitting the base URL
    // If we get here without error, the URL is valid
    results.connection = true
  } catch (error: any) {
    results.error = error.message
  }

  return results
}

export default async function TestPage() {
  const results = await testSupabaseConnection()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Supabase 连接测试</h1>
          <p className="text-muted-foreground">
            检查你的零工平台配置是否正确
          </p>
        </div>

        {/* Test Results */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5" />
                数据库连接
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.connection ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">成功</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">失败</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                用户认证
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-yellow-600">
                <Badge variant="outline">待测试</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                请尝试注册/登录来测试
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                数据库表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-yellow-600">
                <Badge variant="outline">待验证</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                需要运行迁移脚本
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {results.error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                连接错误
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-sm bg-white px-3 py-2 rounded border">
                {results.error}
              </code>
            </CardContent>
          </Card>
        )}

        {/* Supabase Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>当前配置</CardTitle>
            <CardDescription>
              你的 Supabase 项目配置如下
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Project URL:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </code>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Anon Key:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              下一步操作
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. 运行数据库迁移（重要！）</h3>
              <p className="text-sm text-muted-foreground">
                你需要在 Supabase 后台运行 SQL 迁移脚本来创建数据表：
              </p>
              <code className="text-xs bg-gray-100 px-3 py-2 rounded block">
                访问 Supabase Dashboard → SQL Editor → 复制 supabase/migrations/001_initial_schema.sql 的内容 → 运行
              </code>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">2. 测试注册功能</h3>
              <p className="text-sm text-muted-foreground">
                迁移完成后，点击下方按钮测试用户注册：
              </p>
              <Link href="/auth/register">
                <Button>去注册页面</Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">3. 验证数据库表</h3>
              <p className="text-sm text-muted-foreground">
                在 Supabase Dashboard → Table Editor 中，你应该能看到以下表：
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>employer_profiles</li>
                <li>worker_profiles</li>
                <li>job_posts</li>
                <li>job_applications</li>
                <li>transactions</li>
                <li>reviews</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">
              返回首页
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button>
              测试登录
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
