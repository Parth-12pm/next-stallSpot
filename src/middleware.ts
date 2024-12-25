import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Public paths that don't require authentication
    const publicPaths = ['/', '/auth/login', '/auth/signup'];
    if (publicPaths.includes(path)) return NextResponse.next();

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
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