import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface NewUser {
  id: string
  username: string
  role: string
  email: string
}

export async function POST(request: Request) {
  try {
    const { username, password, role, email } = await request.json()

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    if (!['employer', 'worker'].includes(role)) {
      return NextResponse.json(
        { error: '角色必须是 employer 或 worker' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: existingUser } = await supabase
      .from('custom_users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已被占用' },
        { status: 400 }
      )
    }

    const passwordHash = Buffer.from(password).toString('base64')

    const { data: newUser, error: insertError } = await supabase
      .from('custom_users')
      .insert({
        username,
        password: passwordHash,
        email: email || `${username}@local.com`,
        role,
      } as never)
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    const typedNewUser = newUser as NewUser

    await supabase
      .from(role === 'employer' ? 'employer_profiles' : 'worker_profiles')
      .insert({
        user_id: typedNewUser.id,
        company_name: username,
      } as never)

    return NextResponse.json({
      success: true,
      user: {
        id: typedNewUser.id,
        username: typedNewUser.username,
        role: typedNewUser.role,
      }
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || '注册失败' },
      { status: 500 }
    )
  }
}
