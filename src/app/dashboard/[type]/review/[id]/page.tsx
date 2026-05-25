"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Star } from "lucide-react"
import { toast } from "sonner"

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      checkReviewStatus()
    }
  }, [user])

  const checkReviewStatus = async () => {
    try {
      // Get user profile
      const { data: employerProfile } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('user_id', user!.id)
        .single()

      const profileId = employerProfile?.id

      if (!profileId) {
        const { data: workerProfile } = await supabase
          .from('worker_profiles')
          .select('id')
          .eq('user_id', user!.id)
          .single()

        if (workerProfile) {
          const { data } = await supabase
            .from('reviews')
            .select('id')
            .eq('job_id', params.id as string)
            .eq('reviewer_id', workerProfile.id)
            .single()

          if (data) setHasReviewed(true)
        }
      } else {
        const { data } = await supabase
          .from('reviews')
          .select('id')
          .eq('job_id', params.id as string)
          .eq('reviewer_id', profileId!)
          .single()

        if (data) setHasReviewed(true)
      }
    } catch (error) {
      console.error('Error checking review status:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: params.id as string,
          rating,
          comment,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || '提交评价失败')
      } else {
        toast.success('评价提交成功！')
        setHasReviewed(true)
        router.push(params.type === 'employer' ? '/dashboard/employer' : '/dashboard/worker')
      }
    } catch (error) {
      toast.error('提交评价失败，请稍后重试')
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>评价任务</CardTitle>
            <CardDescription>
              {params.type === 'employer' 
                ? '对完成的师傅进行评价' 
                : '对雇主进行评价'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasReviewed ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">您已经评价过了</p>
                <Button onClick={() => router.back()}>返回</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>评分</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rating === 5 && '非常满意'}
                    {rating === 4 && '满意'}
                    {rating === 3 && '一般'}
                    {rating === 2 && '不满意'}
                    {rating === 1 && '非常不满意'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">评价内容（可选）</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="分享您的体验和感受..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      '提交评价'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    取消
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
