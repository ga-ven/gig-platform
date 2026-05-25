import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Check if username already exists
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

    // Hash password (simple hash for MVP - in production use bcrypt)
    const passwordHash = Buffer.from(password).toString('base64')

    // Create user in custom_users table
    const { data: newUser, error: insertError } = await supabase
      .from('custom_users')
      .insert({
        username,
        password: passwordHash,
        email: email || `${username}@local.com`,
        role,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    // Also create profile based on role
    const { error: profileError } = await supabase
      .from(role === 'employer' ? 'employer_profiles' : 'worker_profiles')
      .insert({
        user_id: newUser.id,
        company_name: username,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
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
