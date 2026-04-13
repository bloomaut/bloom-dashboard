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

    const ping = async () => {
      try {
        await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "x-client-type": "web",
            "X-Client-Type": "web",
            "client-type": "web",
          },
        });
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
