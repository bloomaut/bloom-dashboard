"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { get } from "@/services/fetch";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale } = useParams() as { locale?: string };
  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      // 1) Fast-path: confía en cookie seteada por post-login
      const cookies = typeof document !== "undefined" ? document.cookie : "";
      const fromCookie = cookies
        .split("; ")
        .find(c => c.startsWith("app-role="))
        ?.split("=")[1];

      if (fromCookie === "admin") {
        if (!cancelled) setAllowed(true);
        return;
      }

      // 2) Fallback: consulta backend si no hay cookie
      try {
        const me = await get("user/me");
        const role = me?.role ?? me?.app_metadata?.role ?? "user";

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
    return () => {
      cancelled = true;
    };
  }, [router, locale]);

  const handleReset = () => {
    setError(null);
    router.replace(`/${locale || "en"}/post-login`);
  };

  if (error) {
    return <ErrorMessage error={new Error(error)} reset={handleReset} />;
  }

  if (!allowed) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
