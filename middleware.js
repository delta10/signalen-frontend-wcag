import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl

  // Block /manage and /nl/manage by returning a 404 response
  if (url.pathname === '/manage' || url.pathname === '/nl/manage') {
    return NextResponse.json(
      { message: 'Not Found' },
      { status: 404 }
    )
  }

  return NextResponse.next() // Continue with the request
}

export const config = {
  matcher: ['/manage', '/nl/manage'], // Apply middleware to these paths
}