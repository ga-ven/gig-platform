"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    checkUserAndRedirect()
  }, [])

  const checkUserAndRedirect = async () => {
    try {
      setLoading(true)
      
      // Get current user from custom auth API
      const response = await fetch('/api/auth/user')
      const result = await response.json()

      if (!result.user) {
        // No user logged in, redirect to login
        window.location.href = '/auth/login'
        return
      }

      // User is logged in, redirect based on role
      setUserRole(result.user.role)
      
      if (result.user.role === 'employer') {
        window.location.href = '/dashboard/employer'
      } else {
        window.location.href = '/dashboard/worker'
      }
    } catch (error: any) {
      console.error("Error checking user role:", error)
      setError("检查用户信息时出错，请刷新页面重试")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">正在检查用户信息...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">⚠️ 出错了</CardTitle>
            <CardDescription className="text-center">
              在检查用户信息时遇到问题
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  返回首页
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  setLoading(true)
                  setError(null)
                  checkUserAndRedirect()
                }} 
                className="flex-1"
              >
                重试
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fallback while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">正在跳转到 {userRole === 'employer' ? '雇主' : '师傅'} Dashboard...</p>
      </div>
    </div>
  )
}
