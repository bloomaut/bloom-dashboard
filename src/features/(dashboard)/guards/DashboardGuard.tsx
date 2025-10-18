"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { get } from "@/services/fetch";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale } = useParams() as { locale?: string };
  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAccess = async () => {
      try {
        const me = await get("user/me");
        const user = me?.result?.user ?? me?.user ?? null;
        const status = user?.client?.proposal_status ?? null;

        if (status !== "approved") {
          router.replace(`/${locale || "en"}/post-login`);
          return;
        }

        if (!cancelled) setAllowed(true);
      } catch (e) {
        if (!cancelled) setError("No pudimos verificar tu acceso. Intenta nuevamente.");
      }
    };

    checkAccess();
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
