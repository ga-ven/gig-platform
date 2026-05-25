"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, DollarSign, TrendingUp, Calendar, ArrowUpRight } from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  amount: number
  status: string
  created_at: string
  job_posts: {
    title: string
  }
}

export default function WorkerIncomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const supabase = createClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalIncome: 0,
    pendingIncome: 0,
    completedJobs: 0,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    if (!user) return
    
    try {
      // Get worker profile
      const { data: workerProfile, error: profileError } = await supabase
        .from("worker_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (profileError || !workerProfile) {
        toast.error("找不到师傅信息")
        setLoading(false)
        return
      }

      // Fetch transactions
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          job_posts (
            title
          )
        `)
        .eq("payee_id", workerProfile.id)
        .order("created_at", { ascending: false })

      if (error) {
        toast.error(error.message)
      } else {
        setTransactions(data || [])
        
        // Calculate stats
        const completed = data?.filter((t) => t.status === "completed") || []
        const pending = data?.filter((t) => t.status === "pending") || []
        
        setStats({
          totalIncome: completed.reduce((sum, t) => sum + t.amount, 0),
          pendingIncome: pending.reduce((sum, t) => sum + t.amount, 0),
          completedJobs: completed.length,
        })
      }
    } catch (error) {
      toast.error("获取收入记录失败")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "待结算", color: "bg-yellow-100 text-yellow-800" },
      completed: { label: "已结算", color: "bg-green-100 text-green-800" },
      refunded: { label: "已退款", color: "bg-red-100 text-red-800" },
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收入</h1>
          <p className="text-muted-foreground">
            查看您的收入记录和统计数据
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总收入</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ¥{stats.totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                已完成的收入
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待结算</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ¥{stats.pendingIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                等待结算中
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成订单</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">
                成功完成的订单数
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle>收入记录</CardTitle>
            <CardDescription>
              您的所有收入和结算记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无收入记录</p>
                <p className="text-sm text-muted-foreground mt-1">
                  完成第一单后来这里查看您的收入吧！
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.job_posts?.title || "任务收入"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +¥{transaction.amount.toFixed(2)}
                        </p>
                        <Badge className={getStatusBadge(transaction.status).color}>
                          {getStatusBadge(transaction.status).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
