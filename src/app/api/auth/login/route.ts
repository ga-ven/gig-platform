import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CustomUser {
  id: string
  username: string
  password: string
  role: string
  created_at: string
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '请输入用户名和密码' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: user, error: findError } = await supabase
      .from('custom_users')
      .select('*')
      .eq('username', username)
      .single()

    if (findError || !user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const typedUser = user as CustomUser

    const passwordHash = Buffer.from(password).toString('base64')
    if (typedUser.password !== passwordHash) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const sessionToken = Buffer.from(JSON.stringify({
      user_id: typedUser.id,
      username: typedUser.username,
      role: typedUser.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    })).toString('base64')

    const response = NextResponse.json({
      success: true,
      user: {
        id: typedUser.id,
        username: typedUser.username,
        role: typedUser.role,
      }
    })

    // Set session cookie
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || '登录失败' },
      { status: 500 }
    )
  }
}
