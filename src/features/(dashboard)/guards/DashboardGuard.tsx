"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { get } from "@/services/fetch";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/features/userSlice";
import { extractUserFromMeResponse } from "@/lib/userMe";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale } = useParams() as { locale?: string };
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAccess = async () => {
      try {
        const me = await get("user/me");
        const user = extractUserFromMeResponse(me);
        const status = user?.onboarding_status ?? null;

        // Actualizar Redux con los datos del usuario
        if (user && !cancelled) {
          dispatch(setUserData(user));
        }

        if (!status || !["BRAND_COMPLETED", "SOCIAL_CONNECTED", "ONBOARDING_COMPLETED"].includes(status)) {
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
  }, [router, locale, dispatch]);

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
