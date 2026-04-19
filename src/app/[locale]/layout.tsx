import "@/styles/globals.scss";
import type { Metadata } from "next";
import { locales } from "@/navigation";
import { Providers } from "@/store/provider";
import { notFound } from "next/navigation";
import { Barlow, Roboto } from "next/font/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import Script from "next/script";

const barlow = Barlow({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"], // Eliminé "200" y agregué "100" y "900"
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloomaut",
  description: "We transform ideas into businesses. Free, simple, and straightforward.",
  // metadataBase: new URL(""),
  openGraph: {
    title: "Bloomaut",
    description: "We transform ideas into businesses. Free, simple, and straightforward.",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function AppLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as "en" | "es")) notFound();
  const messages = useMessages();
  const disableLogin = process.env.NEXT_PUBLIC_DIABLE_LOGIN === "true";

  return (
    <Providers>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className={`${barlow.className} ${barlow.variable} ${roboto.variable}`}>{children}</div>
      </NextIntlClientProvider>
      {disableLogin && <Script src='https://tally.so/widgets/embed.js' strategy='lazyOnload' />}
    </Providers>
  );
}
