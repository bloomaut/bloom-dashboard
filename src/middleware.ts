import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: "en",
});

const protectedRoutes = ["catalog", "clients", "hotlink", "my-business"];
const publicRoutes = ["/policy", "/login", "/pricing"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(route => pathname.includes(route));
}

function isPublicRoute(pathname: string) {
  return publicRoutes.some(route => pathname.includes(route));
}

function getPreferredLocale(acceptLanguage: string | null, fallback: string = "en") {
  if (!acceptLanguage) return fallback;
  const parsed = acceptLanguage
    .split(",")
    .map(token => {
      const [lang, qPart] = token.trim().split(";");
      const qValue = qPart?.split("=")[1];
      const q = qValue ? parseFloat(qValue) : 1;
      return { lang: lang.toLowerCase(), q: isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of parsed) {
    if (lang.startsWith("es")) return "es";
    if (lang.startsWith("en")) return "en";
  }
  return fallback;
}

export default async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  const session = await getSession(req, response);

  // Redirige "/" al locale preferido (en/es) según Accept-Language
  if (pathname === "/") {
    const preferred = getPreferredLocale(req.headers.get("accept-language"), "en");
    return NextResponse.redirect(new URL(`/${preferred}`, req.url));
  }

  // No autenticado y accede a ruta protegida: envía al locale preferido
  if (!session?.user && isProtectedRoute(pathname) && !isPublicRoute(pathname)) {
    const preferred = getPreferredLocale(req.headers.get("accept-language"), "en");
    return NextResponse.redirect(new URL(`/${preferred}`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
};
