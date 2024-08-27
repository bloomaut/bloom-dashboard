import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: "en",
});

const protectedRoutes = ["/", "catalog", "clients", "hotlink", "my-business"];
const publicRoutes = ["/playground", "/policy", "/login"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(route => pathname.includes(route));
}

function isPublicRoute(pathname: string) {
  return publicRoutes.some(route => pathname.includes(route));
}

export default async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  const session = await getSession(req, response);

  if (!session?.user && isProtectedRoute(pathname) && !isPublicRoute(pathname) && !pathname.includes("login")) {
    return NextResponse.redirect(new URL("/en/login", req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
};
