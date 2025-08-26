import "@/styles/globals.scss";
import type { Metadata } from "next";
import { locales } from "@/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Providers } from "@/store/provider";
import { notFound } from "next/navigation";
import { Barlow, Roboto } from "next/font/google";

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
  title: "Bloom",
  description: "We transform ideas into businesses. Free, simple, and straightforward.",
  // metadataBase: new URL(""),
  openGraph: {
    title: "Bloom",
    description: "We transform ideas into businesses. Free, simple, and straightforward.",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
          <body className={`${barlow.className} ${barlow.variable} ${roboto.variable}`}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </body>
        </html>
      </UserProvider>
    </Providers>
  );
}
