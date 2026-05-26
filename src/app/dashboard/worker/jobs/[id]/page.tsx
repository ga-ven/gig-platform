"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Clock, DollarSign, ArrowLeft, Check } from "lucide-react"
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
  employer_profiles: {
    company_name: string | null
  }
}

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [job, setJob] = useState<JobPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && params.id) {
      fetchJobDetail()
      checkApplicationStatus()
    }
  }, [user, params.id])

  const fetchJobDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("job_posts")
        .select(`
          *,
          employer_profiles (
            company_name
          )
        ` as never)
        .eq("id", params.id as string)
        .single() as { data: JobPost | null; error: any }

      if (error) {
        toast.error(error.message)
        router.push("/dashboard/worker/jobs")
      } else {
        setJob(data)
      }
    } catch (error) {
      toast.error("获取任务详情失败")
    } finally {
      setLoading(false)
    }
  }

  const checkApplicationStatus = async () => {
    if (!user) return
    
    try {
      const { data: workerProfile } = await supabase
        .from("worker_profiles")
        .select("id" as never)
        .eq("user_id", user.id)
        .single() as { data: { id: string } | null }

      if (!workerProfile) return

      const { data } = await supabase
        .from("job_applications")
        .select("id, status" as never)
        .eq("job_id", params.id as string)
        .eq("worker_id", workerProfile.id)
        .single() as { data: { id: string; status: string } | null }

      if (data) {
        setHasApplied(true)
      }
    } catch (error) {
      console.error("Error checking application status:", error)
    }
  }

  const handleApply = async () => {
    if (!user) {
      toast.error("请先登录")
      router.push("/auth/login")
      return
    }

    setApplying(true)

    try {
      // Get worker profile
      const { data: workerProfile, error: profileError } = await supabase
        .from("worker_profiles")
        .select("id" as never)
        .eq("user_id", user.id)
        .single() as { data: { id: string } | null; error: any }

      if (profileError || !workerProfile) {
        toast.error("找不到师傅信息，请重新注册")
        router.push("/auth/register")
        return
      }

      // Create application
      const { error } = await supabase.from("job_applications").insert({
        job_id: params.id as string,
        worker_id: workerProfile.id,
        status: "pending",
      } as never) as { error: any }

      if (error) {
        if (error.code === "23505") {
          toast.error("您已经申请过这个任务了")
        } else {
          toast.error(error.message)
        }
      } else {
        toast.success("申请成功！等待雇主审核")
        setHasApplied(true)
      }
    } catch (error) {
      toast.error("申请失败，请稍后重试")
    } finally {
      setApplying(false)
    }
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
          <Link href="/dashboard/worker/jobs">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回任务列表
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Job Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.required_skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {job.status === "pending" ? "待接单" : job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{job.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                {job.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                )}
                <div className="flex items-center font-medium text-green-600">
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

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  发布者: {job.employer_profiles?.company_name || "未知"}
                </p>
                <p className="text-sm text-muted-foreground">
                  发布时间: {new Date(job.created_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>申请此任务</CardTitle>
              <CardDescription>
                {hasApplied
                  ? "您已经申请过此任务，请等待雇主审核"
                  : "确认申请后，雇主会收到您的申请并决定是否接受"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasApplied ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-600">已申请</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      等待雇主审核中
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  disabled={applying || job.status !== "pending"}
                  className="w-full"
                  size="lg"
                >
                  {applying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      申请中...
                    </>
                  ) : (
                    <>
                      申请此任务
                    </>
                  )}
                </Button>
              )}
              {job.status !== "pending" && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  此任务已不接受新的申请
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
