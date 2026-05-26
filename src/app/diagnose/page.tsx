"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, Loader2, Database, Key, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default function DiagnosePage() {
  const [diagnostics, setDiagnostics] = useState({
    envVars: false,
    supabaseConnection: false,
    authEnabled: false,
    tablesExist: false,
    errors: [] as string[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setLoading(true)
    const results = {
      envVars: false,
      supabaseConnection: false,
      authEnabled: false,
      tablesExist: false,
      errors: [] as string[]
    }

    // Check 1: Environment Variables
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (supabaseUrl && 
          supabaseKey && 
          !supabaseUrl.includes('placeholder') && 
          !supabaseKey.includes('placeholder')) {
        results.envVars = true
      } else {
        results.errors.push("环境变量未配置或包含占位符")
      }
    } catch (e: any) {
      results.errors.push("检查环境变量失败: " + e.message)
    }

    // Check 2: Supabase Connection
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from(' employer_profiles').select('id' as never).limit(1) as { data: any; error: any }
      
      if (error) {
        if (error.message.includes('does not exist')) {
          results.errors.push("数据表不存在，需要运行数据库迁移")
        } else {
          results.errors.push("Supabase 连接错误: " + error.message)
        }
      } else {
        results.supabaseConnection = true
      }
    } catch (e: any) {
      results.errors.push("Supabase 连接失败: " + e.message)
    }

    // Check 3: Tables Exist
    try {
      const supabase = createClient()
      const tables = ['employer_profiles', 'worker_profiles', 'job_posts']
      
      let tablesFound = 0
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('id').limit(1)
          if (!error) tablesFound++
        } catch (e) {
          // Table doesn't exist
        }
      }
      
      if (tablesFound >= 2) {
        results.tablesExist = true
      } else {
        results.errors.push(`只找到 ${tablesFound}/${tables.length} 个数据表`)
      }
    } catch (e: any) {
      results.errors.push("检查数据表失败: " + e.message)
    }

    setDiagnostics(results)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">正在诊断配置问题...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔧 配置诊断</h1>
          <p className="text-muted-foreground">
            自动检测零工平台配置问题
          </p>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {diagnostics.envVars ? (
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                )}
                <h3 className="font-medium">环境变量</h3>
                <Badge variant={diagnostics.envVars ? "default" : "destructive"}>
                  {diagnostics.envVars ? "正常" : "未配置"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {diagnostics.supabaseConnection ? (
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                )}
                <h3 className="font-medium">Supabase</h3>
                <Badge variant={diagnostics.supabaseConnection ? "default" : "secondary"}>
                  {diagnostics.supabaseConnection ? "已连接" : "待检查"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {diagnostics.tablesExist ? (
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                )}
                <h3 className="font-medium">数据库表</h3>
                <Badge variant={diagnostics.tablesExist ? "default" : "destructive"}>
                  {diagnostics.tablesExist ? "已创建" : "缺失"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Database className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <h3 className="font-medium">总状态</h3>
                <Badge variant={diagnostics.envVars && diagnostics.tablesExist ? "default" : "destructive"}>
                  {diagnostics.envVars && diagnostics.tablesExist ? "就绪" : "需配置"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Errors */}
        {diagnostics.errors.length > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                发现以下问题
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {diagnostics.errors.map((error, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span className="text-yellow-800">{error}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Solutions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>解决方案</CardTitle>
            <CardDescription>
              根据检测结果选择对应的解决方案
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!diagnostics.envVars && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  1. 检查环境变量
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  确保 .env.local 文件中包含正确的 Supabase 配置
                </p>
                <code className="text-xs bg-gray-100 px-3 py-2 rounded block mb-3">
                  NEXT_PUBLIC_SUPABASE_URL=你的URL<br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=你的密钥
                </code>
              </div>
            )}

            {!diagnostics.tablesExist && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  2. 运行数据库迁移
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  在 Supabase 后台运行 SQL 迁移脚本创建数据表
                </p>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                  <li>打开 <a href="https://supabase.com/dashboard" target="_blank" className="text-primary underline">Supabase Dashboard</a></li>
                  <li>进入你的项目 → SQL Editor</li>
                  <li>复制 <code>supabase/migrations/001_initial_schema.sql</code> 的内容</li>
                  <li>粘贴并点击 Run</li>
                </ol>
              </div>
            )}

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                3. 启用 GitHub OAuth 登录（推荐）
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                配置 GitHub OAuth 实现第三方登录，无需邮箱验证
              </p>
              <div className="text-sm space-y-1">
                <p><strong>GitHub 端：</strong></p>
                <ol className="text-xs text-muted-foreground list-decimal list-inside">
                  <li>GitHub Settings → Developer settings → OAuth Apps</li>
                  <li>New OAuth App</li>
                  <li>Callback URL: <code>https://tiycwvtblbczzllhopdv.supabase.co/auth/v1/callback</code></li>
                  <li>注册后获取 Client ID 和 Secret</li>
                </ol>
                <p className="mt-2"><strong>Supabase 端：</strong></p>
                <ol className="text-xs text-muted-foreground list-decimal list-inside">
                  <li>Authentication → Providers → GitHub</li>
                  <li>启用 Enable Sign in with GitHub</li>
                  <li>填入 Client ID 和 Secret</li>
                  <li>保存</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={runDiagnostics} variant="outline">
            重新诊断
          </Button>
          <Link href="/">
            <Button variant="outline">
              返回首页
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button>
              去登录页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
