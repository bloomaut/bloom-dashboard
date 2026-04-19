import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";
import { NextRequest, NextResponse } from "next/server";

const disableMultilanguage = process.env.NEXT_PUBLIC_DISABLE_MULTILANGUAGE === "true";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: disableMultilanguage ? "es" : "en",
});

function swapEnToEs(pathname: string) {
  if (pathname === "/en") return "/es";
  if (pathname.startsWith("/en/")) return `/es/${pathname.slice(4)}`;
  return pathname;
}

function getPreferredLocale(acceptLanguage: string | null, fallback: string = "en") {
  if (!acceptLanguage) return fallback;
  const parsed = acceptLanguage
    .split(",")
    .map(token => {
      const [lang, qPart] = token.trim().split(";");
      const qValue = qPart?.split("=")[1];
      const q = qValue ? parseFloat(qValue) : 1;
      return { lang: lang.toLowerCase(), q: Number.isFinite(q) ? q : 1 };
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

  if (disableMultilanguage) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/es", req.url));
    }
    if (pathname === "/en" || pathname.startsWith("/en/")) {
      return NextResponse.redirect(new URL(swapEnToEs(pathname), req.url));
    }
  }

  // Redirect "/" to preferred locale (en/es) based on Accept-Language
  if (pathname === "/") {
    const preferred = getPreferredLocale(req.headers.get("accept-language"), "en");
    return NextResponse.redirect(new URL(`/${preferred}`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
};
