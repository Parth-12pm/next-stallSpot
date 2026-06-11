/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// middleware.ts
import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public paths are handled by the matcher config, so we don't need to check them here.
    // withAuth will not run on public paths.
    const publicPaths = [
      "/",
      "/auth/login",
      "/auth/signup",
      "/auth/role-select",
      "/A372",
    ];
    // The `authorized` callback in withAuth handles this.
    // If we are in this function, the token is guaranteed to exist.
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Special handling for profile completion path
    if (path.startsWith("/profile/complete")) {
      // If profile is already complete, redirect to dashboard
      if (token.profileComplete) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Handle profile route
    if (path === "/profile") {
      if (!token.profileComplete) {
        return NextResponse.redirect(new URL("/profile/complete", req.url));
      }
      return NextResponse.next();
    }

    // Enforce profile completion for all protected routes
    if (!token.profileComplete && !path.startsWith("/profile/complete")) {
      return NextResponse.redirect(new URL("/profile/complete", req.url));
    }

    // Role-based access control
    if (path.startsWith("/organizer") && token.role !== "organizer") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/vendor") && token.role !== "vendor") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Add this condition to your existing middleware
    if (path.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // The `authorized` callback determines if a user is authorized to access a page.
      // It runs before the middleware function.
      // Returning !!token is the default behavior and is sufficient for checking if the user is logged in.
      authorized: ({ token }) => !!token,
    },
  }
);

// Also update the config to include admin routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/organizer/:path*",
    "/vendor/:path*",
    "/profile/:path*",
    "/admin/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - and the public paths defined above.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/signup|auth/role-select|A372|$).*)",
  ],
};
