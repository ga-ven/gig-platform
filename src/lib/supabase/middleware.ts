import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Development mode: skip Supabase auth if not properly configured
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl.includes('placeholder') || 
      supabaseKey.includes('placeholder')) {
    // Allow all requests in development without proper Supabase config
    return NextResponse.next({
      request,
    })
  }

  // Only proceed with auth check if we have valid config
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Auth timeout')), 5000)
    })

    const authPromise = supabase.auth.getUser()

    let user = null
    try {
      const result = await Promise.race([authPromise, timeoutPromise]) as { data: { user: any } }
      user = result.data.user
    } catch (error) {
      console.error('Auth check failed:', error)
      // Continue without auth on timeout or error
      return NextResponse.next({ request })
    }

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    // If user is on auth page and already logged in, redirect to dashboard
    if (isAuthPage && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user is on dashboard and not logged in, redirect to login
    if (isDashboardPage && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // Allow request to proceed on any error
    return NextResponse.next({ request })
  }
}
