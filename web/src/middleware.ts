import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the origin making the request
  const origin = request.headers.get('origin') || '*'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  
  // Handle API routes with CORS
  if (isApiRoute) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // For actual API requests
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // Handle authentication routes
  const token = request.cookies.get('auth_token')?.value
  
  // If user is not authenticated and trying to access protected routes
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // If user is authenticated and trying to access auth pages
  if (token && request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}
