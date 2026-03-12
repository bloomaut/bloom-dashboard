"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { get } from "@/services/fetch";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/features/userSlice";
import { extractUserFromMeResponse, getRouteForUser } from "@/lib/userMe";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  console.log("OnboardingGuard");
  const router = useRouter();
  const { locale } = useParams() as { locale?: string };
  const pathname = usePathname();

  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    const checkOnboarding = async () => {
      try {
        const me = await get("user/me");
        const user = extractUserFromMeResponse(me);
        if (!user) throw new Error("Missing user");

        // Hidratar Redux: userData disponible para el resto de la UI
        if (!cancelled && user) {
          dispatch(setUserData(user));
          // Opcional: persistir client_id para futuros requests
          if (user?.client?.id) {
            localStorage.setItem("client_id", String(user.client.id));
          }
        }
        const loc = locale || "en";
        const target = getRouteForUser(user, loc);
        console.log("target", target);

        // Si ya está en la ruta correcta de onboarding, permitir render
        if (pathname && pathname.startsWith(target)) {
          if (!cancelled) setAllowed(true);
          return;
        }

        // Redirige a la etapa correcta
        if (!cancelled) {
          router.replace(target);
        }
      } catch (e) {
        if (!cancelled) {
          setError("No pudimos verificar tu estado de onboarding. Intenta nuevamente.");
        }
      }
    };

    checkOnboarding();
    return () => {
      cancelled = true;
    };
  }, [dispatch, router, locale, pathname]);

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
        <LoadingSpinner size='large' />
      </div>
    );
  }

  return <>{children}</>;
}
