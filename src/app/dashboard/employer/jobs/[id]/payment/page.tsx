"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && params.id && params.transaction_id) {
      processPayment()
    }
  }, [user, params.id, params.transaction_id])

  const processPayment = async () => {
    try {
      // For MVP, we'll simulate payment success
      // In production, this would call WeChat Pay API
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'completed' } as never)
        .eq('id', params.transaction_id as string) as { error: any }

      if (error) {
        setPaymentStatus('failed')
        toast.error('支付失败')
      } else {
        // Update job status
        await supabase
          .from('job_posts')
          .update({ status: 'completed' } as never)
          .eq('id', params.id as string)

        setPaymentStatus('success')
        toast.success('支付成功！')
      }
    } catch (error) {
      setPaymentStatus('failed')
      toast.error('支付处理失败')
    } finally {
      setLoading(false)
    }
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
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">支付结果</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {paymentStatus === 'pending' && (
              <>
                <Clock className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                <p className="text-lg font-medium mb-2">支付处理中...</p>
                <p className="text-muted-foreground">请稍候</p>
              </>
            )}

            {paymentStatus === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-medium mb-2 text-green-600">支付成功！</p>
                <p className="text-muted-foreground mb-6">
                  您的支付已成功处理，任务即将开始。
                </p>
                <div className="space-y-3">
                  <Link href="/dashboard/employer/jobs">
                    <Button className="w-full">
                      返回任务列表
                    </Button>
                  </Link>
                  <Link href="/dashboard/employer">
                    <Button variant="outline" className="w-full">
                      返回 Dashboard
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {paymentStatus === 'failed' && (
              <>
                <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-medium mb-2 text-red-600">支付失败</p>
                <p className="text-muted-foreground mb-6">
                  支付处理失败，请稍后重试或联系客服。
                </p>
                <div className="space-y-3">
                  <Link href={`/dashboard/employer/jobs/${params.id}`}>
                    <Button className="w-full">
                      返回任务详情
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setLoading(true)
                      setPaymentStatus('pending')
                      processPayment()
                    }}
                  >
                    重试支付
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          注意：这是 MVP 版本，支付功能已简化。生产环境需要集成微信支付 API。
        </p>
      </div>
    </div>
  )
}
