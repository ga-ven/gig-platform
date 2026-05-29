"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"employer" | "worker">("worker")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || username.length < 3) {
      toast.error("用户名至少需要3个字符")
      return
    }

    if (password !== confirmPassword) {
      toast.error("两次输入的密码不一致")
      return
    }

    if (password.length < 6) {
      toast.error("密码至少需要6个字符")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "注册失败")
      } else {
        toast.success("注册成功！")
        
        // Auto login after registration
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })

        const loginResult = await loginResponse.json()

        if (loginResponse.ok) {
          router.push("/dashboard")
          router.refresh()
        } else {
          toast.success("注册成功，请登录")
          router.push("/auth/login")
        }
      }
    } catch (error) {
      toast.error("注册失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">注册</CardTitle>
          <CardDescription className="text-center">
            创建新账号并选择您的角色
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名（至少3个字符）"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">选择角色</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "employer" | "worker")}
              >
                <SelectTrigger>
                  <SelectValue>
                    {role === "worker" ? "师傅" : "雇主"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">师傅</SelectItem>
                  <SelectItem value="employer">雇主</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {role === "worker"
                  ? "您可以在平台上接单并提供服务"
                  : "您可以在平台上发布任务并找到合适的师傅"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少6个字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  注册中...
                </>
              ) : (
                "注册"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            已有账号?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
