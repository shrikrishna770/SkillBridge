import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - login (login page)
     * - signup (signup page)
     * - onboarding (onboarding page - optional, but let's keep it protected normally)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|login|signup|_next/static|_next/image|favicon.ico).*)",
  ],
};
