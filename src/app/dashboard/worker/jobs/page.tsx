"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Clock, DollarSign, Search, Briefcase } from "lucide-react"
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

export default function WorkerJobsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

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
    try {
      const { data, error } = await supabase
        .from("job_posts")
        .select(`
          *,
          employer_profiles (
            company_name
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => job.required_skills.includes(skill))

    return matchesSearch && matchesSkills
  })

  const allSkills = Array.from(
    new Set(jobs.flatMap((job) => job.required_skills))
  ).sort()

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">浏览任务</h1>
          <p className="text-muted-foreground">
            找到合适的任务，开始工作吧！
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索任务..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">技能筛选:</p>
                <div className="flex flex-wrap gap-2">
                  {allSkills.slice(0, 10).map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedSkills(
                          selectedSkills.includes(skill)
                            ? selectedSkills.filter((s) => s !== skill)
                            : [...selectedSkills, skill]
                        )
                      }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>暂无任务</CardTitle>
              <CardDescription>
                {searchTerm || selectedSkills.length > 0
                  ? "没有找到符合条件的任务，尝试调整筛选条件"
                  : "当前没有可接的任务，稍后再来看看吧！"}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
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
                    <Badge className="bg-blue-100 text-blue-800">
                      待接单
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    <div className="flex items-center font-medium text-green-600">
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
                      发布者: {job.employer_profiles?.company_name || "未知"}
                    </p>
                    <Link href={`/dashboard/worker/jobs/${job.id}`}>
                      <Button>
                        <Briefcase className="mr-2 h-4 w-4" />
                        查看详情并申请
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
