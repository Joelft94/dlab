import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for token in cookie
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname === '/login'
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  console.log('Middleware:', { 
    path: request.nextUrl.pathname, 
    hasToken: !!token, 
    isAuthPage, 
    isDashboardPage 
  })

  // If trying to access protected route without token
  if (!token && isDashboardPage) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access login page with token
  if (token && isAuthPage) {
    const dashboardUrl = new URL('/dashboard/users', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*']
}