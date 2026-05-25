"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, MapPin, Clock, DollarSign, Check, X, User } from "lucide-react"
import { toast } from "sonner"

interface WorkerProfile {
  id: string
  user_id: string
  skills: string[]
  avg_rating: number | null
  full_name?: string
  email?: string
}

interface Application {
  id: string
  worker_id: string
  status: string
  created_at: string
  worker_profiles: WorkerProfile
}

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
  job_applications: Application[]
}

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [job, setJob] = useState<JobPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && params.id) {
      fetchJobDetail()
    }
  }, [user, params.id])

  const fetchJobDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("job_posts")
        .select(`
          *,
          job_applications (
            id,
            worker_id,
            status,
            created_at,
            worker_profiles (
              id,
              user_id,
              skills,
              avg_rating,
              profiles:user_id (
                full_name,
                email
              )
            )
          )
        `)
        .eq("id", params.id as string)
        .single()

      if (error) {
        toast.error(error.message)
        router.push("/dashboard/employer/jobs")
      } else {
        setJob(data)
      }
    } catch (error) {
      toast.error("获取任务详情失败")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptApplication = async (applicationId: string) => {
    setActionLoading(applicationId)
    try {
      // Update application status
      const { error: appError } = await supabase
        .from("job_applications")
        .update({ status: "accepted" })
        .eq("id", applicationId)

      if (appError) {
        toast.error(appError.message)
        return
      }

      // Update job status
      const { error: jobError } = await supabase
        .from("job_posts")
        .update({ status: "accepted" })
        .eq("id", params.id as string)

      if (jobError) {
        toast.error(jobError.message)
        return
      }

      // Reject other applications
      const otherApplications = job?.job_applications.filter(
        (app) => app.id !== applicationId
      )

      if (otherApplications && otherApplications.length > 0) {
        await supabase
          .from("job_applications")
          .update({ status: "rejected" })
          .eq("job_id", params.id as string)
          .neq("id", applicationId)
      }

      toast.success("已接受申请！")
      fetchJobDetail()
    } catch (error) {
      toast.error("操作失败，请稍后重试")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectApplication = async (applicationId: string) => {
    setActionLoading(applicationId)
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: "rejected" })
        .eq("id", applicationId)

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("已拒绝申请")
        fetchJobDetail()
      }
    } catch (error) {
      toast.error("操作失败，请稍后重试")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "待处理", color: "bg-blue-100 text-blue-800" },
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

  if (!user || !job) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard/employer/jobs">
            <Button variant="ghost">← 返回任务列表</Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Job Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <Badge className={getJobStatusBadge(job.status).color}>
                    {getJobStatusBadge(job.status).label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {job.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ¥{job.pay_amount}
                </div>
                {job.job_time_start && (
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(job.job_time_start).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card>
            <CardHeader>
              <CardTitle>收到的申请 ({job.job_applications?.length || 0})</CardTitle>
              <CardDescription>
                查看并选择合适的师傅来完成任务
              </CardDescription>
            </CardHeader>
            <CardContent>
              {job.job_applications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  暂无申请，等待师傅接单中...
                </p>
              ) : (
                <div className="space-y-4">
                  {job.job_applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {application.worker_profiles.full_name || "未知用户"}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {application.worker_profiles.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>评分: {application.worker_profiles.avg_rating || 0}</span>
                            <span>申请时间: {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.status === "pending" && application.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptApplication(application.id)}
                              disabled={actionLoading === application.id}
                            >
                              {actionLoading === application.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  接受
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectApplication(application.id)}
                              disabled={actionLoading === application.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              拒绝
                            </Button>
                          </>
                        )}
                        <Badge className={getStatusBadge(application.status).color}>
                          {getStatusBadge(application.status).label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
