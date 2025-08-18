import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "dict.landing" });

  return {
    title: `PointZero - ${t("hero.title")} ${t("hero.title_accent")}`,
    description: t("hero.description"),
    openGraph: {
      title: `PointZero - ${t("hero.title")} ${t("hero.title_accent")}`,
      description: t("hero.description"),
      locale: locale,
    },
    alternates: {
      canonical: "/en",
      languages: {
        en: "/en",
        es: "/es",
      },
    },
    icons: {
      icon: "/pointZeroIso.webp",
      shortcut: "/pointZeroIso.webp",
      apple: "/pointZeroIso.webp",
    },
  };
}
