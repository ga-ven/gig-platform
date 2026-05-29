"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, DollarSign, Star, Clock, FileText, CheckCircle } from "lucide-react"

export default function WorkerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState({ rating: 0, completedJobs: 0, pendingApps: 0 })

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
      const { data: workerProfile } = await supabase
        .from("worker_profiles")
        .select("id, avg_rating" as never)
        .eq("user_id", user.id)
        .single() as { data: { id: string; avg_rating: number | null } | null }

      if (!workerProfile) return

      const { data: applications } = await supabase
        .from("job_applications")
        .select("id, status" as never)
        .eq("worker_id", workerProfile.id) as { data: { id: string; status: string }[] | null }

      const pendingApps = applications?.filter(a => a.status === 'pending').length || 0
      const completedJobs = applications?.filter(a => a.status === 'completed').length || 0

      setStats({
        rating: workerProfile.avg_rating || 0,
        completedJobs,
        pendingApps
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
              <h1 className="text-2xl font-bold text-gray-900">师傅工作台</h1>
              <p className="text-sm text-muted-foreground">浏览任务，开始工作</p>
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
                    <p className="font-medium text-blue-700">浏览任务</p>
                    <p className="text-xs text-blue-600">找到合适的工作</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium text-green-700">申请任务</p>
                    <p className="text-xs text-green-600">提交申请等待审核</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium text-yellow-700">完成任务</p>
                    <p className="text-xs text-yellow-600">按约定完成工作</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium text-purple-700">获得报酬</p>
                    <p className="text-xs text-purple-600">收款并积累评分</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">我的评分</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">平均评分</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">完成的订单</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">申请中</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApps}</div>
              <p className="text-xs text-muted-foreground">等待审核</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总收入</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥0</div>
              <p className="text-xs text-muted-foreground">累计收入</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/worker/jobs">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Briefcase className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <p className="font-medium text-lg">浏览任务</p>
                    <p className="text-sm text-muted-foreground">找到合适的工作</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/worker/applications">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Clock className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <p className="font-medium text-lg">我的申请</p>
                    <p className="text-sm text-muted-foreground">查看申请状态</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/worker/income">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <DollarSign className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <p className="font-medium text-lg">我的收入</p>
                    <p className="text-sm text-muted-foreground">查看收入记录</p>
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
