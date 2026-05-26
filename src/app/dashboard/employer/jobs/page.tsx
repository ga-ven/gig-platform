"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, MapPin, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface JobPost {
  id: string
  title: string
  description: string | null
  location: string | null
  pay_amount: number
  required_skills: string[]
  job_time_start: string | null
  job_time_end: string | null
  status: string
  created_at: string
  job_applications: Array<{
    id: string
    status: string
  }>
}

export default function EmployerJobsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchJobs()
    }
  }, [user])

  const fetchJobs = async () => {
    if (!user) return
    
    try {
      // Get employer profile
      const { data: employerProfile, error: profileError } = await supabase
        .from("employer_profiles")
        .select("id" as never)
        .eq("user_id", user.id)
        .single() as { data: { id: string } | null; error: any }

      if (profileError || !employerProfile) {
        toast.error("找不到雇主信息")
        return
      }

      const { data, error } = await supabase
        .from("job_posts")
        .select(`
          *,
          job_applications (id, status)
        ` as never)
        .eq("employer_id", employerProfile.id)
        .order("created_at", { ascending: false }) as { data: JobPost[] | null; error: any }

      if (error) {
        toast.error(error.message)
      } else {
        setJobs(data || [])
      }
    } catch (error) {
      toast.error("获取任务列表失败")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">我的任务</h1>
          <Link href="/dashboard/employer/jobs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              发布新任务
            </Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>暂无任务</CardTitle>
              <CardDescription>
                您还没有发布任何任务。点击上方"发布新任务"开始吧！
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/employer/jobs/new">
                <Button>发布第一个任务</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {job.required_skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className={getStatusBadge(job.status).color}>
                      {getStatusBadge(job.status).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ¥{job.pay_amount}
                    </div>
                    {job.job_time_start && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(job.job_time_start).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      收到 {job.job_applications?.length || 0} 个申请
                    </p>
                    <Link href={`/dashboard/employer/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </Link>
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
