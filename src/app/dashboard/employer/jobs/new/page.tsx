"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function NewJobPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    pay_amount: "",
    job_time_start: "",
    job_time_end: "",
    skills: [] as string[],
  })
  const [skillInput, setSkillInput] = useState("")

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("请先登录")
      router.push("/auth/login")
      return
    }

    if (formData.skills.length === 0) {
      toast.error("请至少添加一个技能要求")
      return
    }

    setLoading(true)

    try {
      // Get employer profile
      const { data: employerProfile, error: profileError } = await supabase
        .from("employer_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (profileError || !employerProfile) {
        toast.error("找不到雇主信息，请重新注册")
        router.push("/auth/register")
        return
      }

      // Create job post
      const { data, error } = await supabase
        .from("job_posts")
        .insert({
          employer_id: employerProfile.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          pay_amount: parseFloat(formData.pay_amount),
          required_skills: formData.skills,
          job_time_start: formData.job_time_start || null,
          job_time_end: formData.job_time_end || null,
          status: "pending",
        })
        .select()
        .single()

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("任务发布成功！")
        router.push("/dashboard/employer/jobs")
      }
    } catch (error) {
      toast.error("发布任务失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>发布新任务</CardTitle>
            <CardDescription>
              填写任务信息，吸引合适的师傅来接单
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">任务标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：需要搬家师傅，帮忙搬家具"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">任务描述 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="详细描述任务内容、工作要求等..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">工作地点</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="例如：朝阳区三里屯"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pay_amount">报酬金额 (¥) *</Label>
                  <Input
                    id="pay_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pay_amount}
                    onChange={(e) => setFormData({ ...formData, pay_amount: e.target.value })}
                    placeholder="例如：500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>所需技能 *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="添加技能标签"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddSkill}>
                      添加
                    </Button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_time_start">开始时间</Label>
                  <Input
                    id="job_time_start"
                    type="datetime-local"
                    value={formData.job_time_start}
                    onChange={(e) => setFormData({ ...formData, job_time_start: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_time_end">结束时间</Label>
                  <Input
                    id="job_time_end"
                    type="datetime-local"
                    value={formData.job_time_end}
                    onChange={(e) => setFormData({ ...formData, job_time_end: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      发布中...
                    </>
                  ) : (
                    "发布任务"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/employer")}
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
