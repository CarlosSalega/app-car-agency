import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set("x-pathname", pathname);

  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("session");

    if (pathname === "/admin/login") {
      return response;
    }

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  if (
    pathname.startsWith("/_next/image") ||
    request.url.includes("cloudinary.com")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable, stale-while-revalidate=86400",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
