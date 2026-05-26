import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

interface CustomUser {
  id: string
  username: string
  role: string
  email?: string
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    try {
      const session = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
      
      if (session.exp < Date.now()) {
        return NextResponse.json(
          { user: null },
          { status: 200 }
        )
      }

      const supabase = await createClient()
      const { data: user } = await supabase
        .from('custom_users')
        .select('id, username, role, email')
        .eq('id', session.user_id)
        .single()

      if (!user) {
        return NextResponse.json(
          { user: null },
          { status: 200 }
        )
      }

      const typedUser = user as CustomUser

      return NextResponse.json({
        user: {
          id: typedUser.id,
          username: typedUser.username,
          role: typedUser.role,
        }
      })

    } catch (error) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
