"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, Users, DollarSign, Plus, FileText, CheckCircle } from "lucide-react"

export default function EmployerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState({ jobs: 0, applications: 0, activeJobs: 0 })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    if (!user) return
    try {
      const { data: employerProfile } = await supabase
        .from("employer_profiles")
        .select("id" as never)
        .eq("user_id", user.id)
        .single() as { data: { id: string } | null }

      if (!employerProfile) return

      const { data: jobs } = await supabase
        .from("job_posts")
        .select("id, status" as never)
        .eq("employer_id", employerProfile.id) as { data: { id: string; status: string }[] | null }

      const activeJobs = jobs?.filter(j => j.status === 'accepted').length || 0
      setStats({
        jobs: jobs?.length || 0,
        applications: 0,
        activeJobs
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">雇主工作台</h1>
              <p className="text-sm text-muted-foreground">管理您的零工任务</p>
            </div>
            <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => router.push("/auth/login"))}>
              退出登录
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            四步完成零工撮合
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium text-blue-700">发布任务</p>
                    <p className="text-xs text-blue-600">描述需求和要求</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium text-green-700">选择师傅</p>
                    <p className="text-xs text-green-600">审核申请并接受</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium text-yellow-700">支付托管</p>
                    <p className="text-xs text-yellow-600">预付资金到平台</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium text-purple-700">完成评价</p>
                    <p className="text-xs text-purple-600">确认完成并评价</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">我的任务</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.jobs}</div>
              <p className="text-xs text-muted-foreground">已发布的任务</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">进行中</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">正在进行的任务</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">已完成的任务</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/employer/jobs/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Plus className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <p className="font-medium text-lg">发布新任务</p>
                    <p className="text-sm text-muted-foreground">描述您的零工需求</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/employer/jobs">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Briefcase className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <p className="font-medium text-lg">管理任务</p>
                    <p className="text-sm text-muted-foreground">查看和管理已发布的任务</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
