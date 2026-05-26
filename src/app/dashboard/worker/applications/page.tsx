"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Clock, DollarSign, Briefcase } from "lucide-react"
import { toast } from "sonner"

interface Application {
  id: string
  status: string
  created_at: string
  job_posts: {
    id: string
    title: string
    description: string | null
    location: string | null
    pay_amount: number
    required_skills: string[]
    job_time_start: string | null
    status: string
  }
}

export default function WorkerApplicationsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    if (!user) return
    
    try {
      // Get worker profile
      const { data: workerProfile, error: profileError } = await supabase
        .from("worker_profiles")
        .select("id" as never)
        .eq("user_id", user.id)
        .single() as { data: { id: string } | null; error: any }

      if (profileError || !workerProfile) {
        toast.error("找不到师傅信息")
        setLoading(false)
        return
      }

      // Fetch applications
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          job_posts (
            id,
            title,
            description,
            location,
            pay_amount,
            required_skills,
            job_time_start,
            status
          )
        `)
        .eq("worker_id", workerProfile.id)
        .order("created_at", { ascending: false })

      if (error) {
        toast.error(error.message)
      } else {
        setApplications(data || [])
      }
    } catch (error) {
      toast.error("获取申请列表失败")
    } finally {
      setLoading(false)
    }
  }

  const getApplicationStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "等待审核", color: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "已接受", color: "bg-green-100 text-green-800" },
      rejected: { label: "已拒绝", color: "bg-red-100 text-red-800" },
    }
    return statusMap[status] || statusMap.pending
  }

  const getJobStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "招募中", color: "bg-blue-100 text-blue-800" },
      accepted: { label: "进行中", color: "bg-yellow-100 text-yellow-800" },
      completed: { label: "已完成", color: "bg-green-100 text-green-800" },
      cancelled: { label: "已取消", color: "bg-gray-100 text-gray-800" },
    }
    return statusMap[status] || statusMap.pending
  }

  if (isLoading || loading) {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的申请</h1>
          <p className="text-muted-foreground">
            查看您申请的所有任务及其状态
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>暂无申请</CardTitle>
              <CardDescription>
                您还没有申请任何任务。去任务列表看看有什么机会吧！
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/dashboard/worker/jobs")}>
                <Briefcase className="mr-2 h-4 w-4" />
                浏览任务
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {application.job_posts.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {application.job_posts.required_skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getApplicationStatusBadge(application.status).color}>
                        {getApplicationStatusBadge(application.status).label}
                      </Badge>
                      <Badge className={getJobStatusBadge(application.job_posts.status).color}>
                        {getJobStatusBadge(application.job_posts.status).label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {application.job_posts.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {application.job_posts.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.job_posts.location}
                      </div>
                    )}
                    <div className="flex items-center font-medium text-green-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ¥{application.job_posts.pay_amount}
                    </div>
                    {application.job_posts.job_time_start && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(application.job_posts.job_time_start).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      申请时间: {new Date(application.created_at).toLocaleDateString()}
                    </p>
                    {application.job_posts.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/worker/jobs/${application.job_posts.id}`)}
                      >
                        查看详情
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
