import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const role = request.nextauth.token?.role;
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/admin")) return token?.role === "admin";
        if (pathname.startsWith("/account")) return Boolean(token);
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
