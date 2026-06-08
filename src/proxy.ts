import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token if present
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isAuthenticated = !!token;

  // Redirect `/dashboard` or `/dashboard/:path*` to `/admin/dashboard/:path*`
  if (pathname.startsWith("/dashboard")) {
    const targetPath = pathname.replace("/dashboard", "/admin/dashboard");
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  // 1. If user is trying to access dashboard/admin edits and NOT authenticated, redirect to login
  const isDashboardRoute = pathname.startsWith("/admin/dashboard");
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    // Keep target url in redirect param
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If visiting /admin, redirect to either dashboard or login
  if (pathname === "/admin") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 2. If user is authenticated and trying to access login page, redirect to dashboard
  if (pathname.startsWith("/admin/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
