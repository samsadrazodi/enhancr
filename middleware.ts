import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect /app/* routes - require auth
  if (path.startsWith("/app/")) {
    const session = request.cookies.get("supabase-auth-token")

    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*"],
}
