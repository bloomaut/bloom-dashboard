import type React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./SideBar/SideBar";
import { useState } from "react";
import BackOffice from "./BackOffice";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Backoffice Admin",
  description: "Panel administrativo para gestión de usuarios y métricas",
  generator: "v0.app",
};

export default function BackofficeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='es' className={roboto.variable}>
      <body className='bg-background text-foreground font-sans'>
        <BackOffice>{children}</BackOffice>
      </body>
    </html>
  );
}
