import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("authjs.session-token") ?? 
                        request.cookies.get("__Secure-authjs.session-token")
  const menuExpressUser = request.cookies.get("menuexpress-user-flag")

  const { pathname } = request.nextUrl

  // Si no hay sesión y trata de entrar a la app, mandalo a /login
  if (pathname === "/" && !sessionToken && !menuExpressUser) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}