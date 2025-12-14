import { NextRequest, NextResponse } from "next/server";
import { PATHS, ROLES } from "./constants/auth";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (searchParams.has("_rsc")) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (pathname === "/login") {
    if (accessToken) {
      return NextResponse.redirect(new URL(PATHS.ADMIN_DASHBOARD, req.url));
    }
    return NextResponse.next();
  }

  const adminPaths = ["/admin", "/dashboard", "/schools", "/users"];
  const isProtectedPath = adminPaths.some((p) => pathname.startsWith(p));

  if (isProtectedPath) {
    if (!accessToken && !refreshToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/dashboard/:path*",
    "/schools/:path*",
    "/users/:path*",
    "/reports/:path*",
  ],
};
