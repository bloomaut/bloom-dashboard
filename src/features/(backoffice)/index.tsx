"use client";
import type React from "react";
import { useEffect } from "react";
import "@/styles/globals.scss";
import { Sidebar } from "./components/SideBar";
import styles from "./styles/backoffice.module.scss";

export default function BackofficeWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_API_DASH || "").trim().replace(/\/+$/, "");
    const normalized = base.endsWith("/api") ? base.slice(0, -4) : base;
    const url = normalized ? `${normalized}/api/user/me` : "/api/user/me";
    const locale = (window.location.pathname.match(/^\/(en|es)\b/)?.[1] as "en" | "es" | undefined) ?? "en";

    const ping = async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "x-client-type": "web",
            "X-Client-Type": "web",
            "client-type": "web",
          },
        });
        if (res.status === 401) {
          document.cookie = "app-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
          document.cookie = "onboarding=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
          localStorage.removeItem("client_id");
          window.location.assign(`/${locale}/post-login`);
        }
      } catch {}
    };

    ping();
    const interval = window.setInterval(ping, 4 * 60 * 1000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") ping();
    };
    window.addEventListener("focus", ping);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", ping);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </div>
  );
}
