"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { get } from "@/services/fetch";
import styles from "./styles/postLogin.module.scss";
import LoadingSpinner from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

export default function PostLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveDestination = async () => {
      try {
        const {
          result: { user },
        } = await get("user/me");
        const role = user?.role ?? user?.app_metadata?.role ?? "user";
        const onboarding = user?.client?.proposal_status ?? user?.client?.proposal_status ?? "initial";

        // Cachea señales para guards cliente
        document.cookie = `app-role=${role}; path=/; samesite=lax`;
        document.cookie = `onboarding=${onboarding === "completed" ? "completed" : "incomplete"}; path=/; samesite=lax`;

        // Decide destino
        if (role === "admin") {
          router.replace(`/${locale}/backoffice/metrics`);
          return;
        }
        if (onboarding !== "approved") {
          router.replace(`/${locale}/onboarding`);
          return;
        }
        router.replace(`/${locale}/dashboard/home`);
      } catch (e) {
        if (!cancelled) {
          setError("No pudimos resolver tu sesión. Intenta nuevamente.");
          router.replace(`/${locale}`);
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
          <LoadingSpinner size='large' />
        </div>
      )}
    </div>
  );
}
