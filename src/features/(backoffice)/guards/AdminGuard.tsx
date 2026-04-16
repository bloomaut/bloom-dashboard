"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { get } from "@/services/fetch";
import { extractUserFromMeResponse } from "@/lib/userMe";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale } = useParams() as { locale?: string };
  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const checkAdmin = async () => {
      try {
        const me = await get("user/me");
        const status = (me as any)?.status ?? (me as any)?.statusCode ?? null;
        if (status === 401) {
          router.replace(`/${locale || "en"}/post-login`);
          return;
        }
        const user = extractUserFromMeResponse(me);
        if (!user) {
          router.replace(`/${locale || "en"}/post-login`);
          return;
        }
        const role = user?.role ?? "user";

        if (role !== "admin") {
          router.replace(`/${locale || "en"}/dashboard/home`);
          return;
        }

        if (!cancelled) setAllowed(true);
      } catch (e) {
        if (!cancelled) setError("No pudimos verificar tu acceso. Intenta nuevamente.");
      }
    };

    checkAdmin();

    const pingIfVisible = () => {
      if (document.visibilityState === "visible") checkAdmin();
    };

    intervalId = setInterval(pingIfVisible, 2 * 60 * 1000);
    window.addEventListener("focus", checkAdmin);
    document.addEventListener("visibilitychange", pingIfVisible);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("focus", checkAdmin);
      document.removeEventListener("visibilitychange", pingIfVisible);
    };
  }, [router, locale]);

  const handleReset = () => {
    setError(null);
    router.replace(`/${locale || "en"}/post-login`);
  };

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <ErrorMessage error={new Error(error)} reset={handleReset} />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <LoadingSpinner size='large' home />
      </div>
    );
  }

  return <>{children}</>;
}
