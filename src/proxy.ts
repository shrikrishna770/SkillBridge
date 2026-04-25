import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding");

    // Redirect to onboarding if not onboarded
    if (isAuth && !token.isOnboarded && !isOnboardingPage) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Prevent access to onboarding if already onboarded
    if (isAuth && token.isOnboarded && isOnboardingPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/", "/onboarding", "/dashboard/:path*"],
};
