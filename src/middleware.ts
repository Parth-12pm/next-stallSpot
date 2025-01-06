// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Public paths that don't require authentication
    const publicPaths = ['/', '/auth/login', '/auth/signup', '/auth/role-select'];
    if (publicPaths.includes(path)) return NextResponse.next();

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Allow access to profile completion page
    if (path.startsWith('/profile/complete')) {
      return NextResponse.next();
    }

    // Check if profile is incomplete and redirect if necessary
    // This assumes we're storing profileComplete in the token
    if (!token.profileComplete && !path.startsWith('/profile/complete')) {
      return NextResponse.redirect(new URL('/profile/complete', req.url));
    }

    // Role-based access control
    if (path.startsWith("/organizer") && token.role !== "organizer") {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (path.startsWith("/vendor") && token.role !== "vendor") {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/organizer/:path*',
    '/vendor/:path*',
    '/profile/:path*'
  ]
};