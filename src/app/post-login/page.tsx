import { headers } from "next/headers";
import { redirect } from "next/navigation";

function getPreferredLocale(acceptLanguage: string | null, fallback: "en" | "es" = "en"): "en" | "es" {
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

export default function PostLoginAliasPage() {
  const disableMultilanguage = process.env.NEXT_PUBLIC_DISABLE_MULTILANGUAGE === "true";
  if (disableMultilanguage) {
    redirect(`/es/post-login`);
  }
  const acceptLanguage = headers().get("accept-language");
  const locale = getPreferredLocale(acceptLanguage, "en");
  redirect(`/${locale}/post-login`);
}
