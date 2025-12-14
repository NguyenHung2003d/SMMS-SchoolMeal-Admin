import { NextRequest, NextResponse } from "next/server";
import { PATHS, ROLES } from "./constants/auth";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    if (accessToken) {
      const user = parseJwt(accessToken);
      if (user?.role === ROLES.ADMIN) {
        return NextResponse.redirect(new URL(PATHS.ADMIN_DASHBOARD, req.url));
      }
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

    if (!accessToken && refreshToken) {
      return NextResponse.next();
    }

    if (accessToken) {
      const user = parseJwt(accessToken);
      
      if (user?.role !== ROLES.ADMIN) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
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
    "/reports/:path*"
  ],
};