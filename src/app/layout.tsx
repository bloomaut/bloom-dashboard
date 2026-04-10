import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='auto'>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
