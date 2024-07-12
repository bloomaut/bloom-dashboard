import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: "en",
});

const protectedRoutes = ["catalog", "clients", "collections", "hotlink", "my-business", "my-collection"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(route => pathname.includes(route));
}

export default async function authMiddleware(req: NextRequest) {
  const response = NextResponse.next();
  const session = await getSession(req, response);

  if (!session?.user && isProtectedRoute(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
};
