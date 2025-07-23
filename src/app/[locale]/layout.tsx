import "@/styles/globals.scss";
import type { Metadata } from "next";
import { locales } from "@/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Providers } from "@/store/provider";
import { notFound } from "next/navigation";
import { Barlow } from "next/font/google";

const barlow = Barlow({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Small",
  description: "Small",
  // metadataBase: new URL(""),
  openGraph: {
    title: "Small",
    description: "Small",
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as "en" | "es")) notFound();
  const messages = useMessages();

  return (
    <Providers>
      <UserProvider>
        <html lang={locale}>
          <body className={barlow.className} style={{ overflow: "hidden" }}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </body>
        </html>
      </UserProvider>
    </Providers>
  );
}
