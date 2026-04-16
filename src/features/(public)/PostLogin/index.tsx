"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get } from "@/services/fetch";
import styles from "./styles/postLogin.module.scss";
import LoadingSpinner from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { extractUserFromMeResponse, getRouteForUser } from "@/lib/userMe";
import { getUsersStats } from "@/services/userFetch";

export default function PostLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveDestination = async () => {
      try {
        const me = await get("user/me");
        const user = extractUserFromMeResponse(me);
        if (!user) throw new Error("Missing user");

        if (user.role === "admin") {
          await getUsersStats();
        }

        // Cachea señales para guards cliente
        document.cookie = `app-role=${user.role}; path=/; samesite=lax`;
        document.cookie = `onboarding=${user.onboarding_status}; path=/; samesite=lax`;

        // Decide destino
        router.replace(getRouteForUser(user, locale));
      } catch (e) {
        if (!cancelled) {
          setError("No pudimos resolver tu sesión. Intenta nuevamente.");
        }
      }
    };

    resolveDestination();
    return () => {
      cancelled = true;
    };
  }, [locale, router]);

  const handleReset = () => {
    setError(null);
    router.replace(`/${locale}/post-login`);
  };

  return (
    <div className={styles.container}>
      {error ? (
        <div className={styles.errorContainer}>
          <ErrorMessage error={new Error(error)} reset={handleReset} />
        </div>
      ) : (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size='large' home />
        </div>
      )}
    </div>
  );
}
