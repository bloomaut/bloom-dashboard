import type { Metadata } from "next";
import { locales } from "@/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Small",
  description: "Small",
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
    <UserProvider>
      <html lang={locale}>
        <body className={inter.className}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </UserProvider>
  );
}
