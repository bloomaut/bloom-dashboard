import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: "en",
});

const protectedRoutes = ["post-login", "onboarding", "dashboard"];
const publicRoutes = ["/policy", "/pricing"];
const adminRoutes = ["/backoffice"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(route => pathname.includes(route));
}

function isPublicRoute(pathname: string) {
  return publicRoutes.some(route => pathname.includes(route));
}

function isAdminRoute(pathname: string) {
  return adminRoutes.some(route => pathname.includes(route));
}

function extractLocaleFromPath(pathname: string): "en" | "es" | null {
  const m = pathname.match(/^\/(en|es)\b/);
  return m ? (m[1] as "en" | "es") : null;
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

  console.log("Middleware session:", session);

  // Redirige "/" al locale preferido (en/es) según Accept-Language
  if (pathname === "/") {
    const preferred = getPreferredLocale(req.headers.get("accept-language"), "en");
    return NextResponse.redirect(new URL(`/${preferred}`, req.url));
  }

  const preferred = getPreferredLocale(req.headers.get("accept-language"), "en");
  const localeFromPath = extractLocaleFromPath(pathname) ?? preferred;

  // Requiere sesión para rutas protegidas y admin; permite públicas (incluye post-login)
  if (!session?.user && (isProtectedRoute(pathname) || isAdminRoute(pathname)) && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL(`/${localeFromPath}`, req.url));
  }

  // Eliminado: chequeo de rol admin y gating de onboarding (delegado a post-login/guards cliente)

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
};
