// Not using it for now

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware (req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (token === undefined || token === '' || token === null) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Optional: Validate token with an external API or logic
  const isValid = true // Replace with actual validation
  if (!isValid) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next() // Allow the request to continue
}

export const config = {
  matcher: ['/dashboardnotusingit/:path*', '/profilenotusingit/:path*']
}
