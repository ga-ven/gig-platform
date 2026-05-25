import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

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
      
      // Check if token is expired
      if (session.exp < Date.now()) {
        return NextResponse.json(
          { user: null },
          { status: 200 }
        )
      }

      // Get fresh user data from database
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

      return NextResponse.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
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
