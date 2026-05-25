import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Development mode: Allow all requests without auth check
  // This prevents middleware from blocking page loads during development
  return NextResponse.next({
    request,
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
