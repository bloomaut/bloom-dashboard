"use client";
import React from "react";
import { CircleLoader } from "../components/Spinner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/features/userSlice";
import { get } from "@/services/fetch";
import styles from "./styles.module.scss";

function Waiting() {
  const dict = useTranslations("dict.completion");
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let redirected = false;

    const checkStatus = async () => {
      try {
        const resUser = await get("user/me");
        if (resUser?.statusCode === 200) {
          const user = resUser.result.user;
          dispatch(setUserData(user));

          // TODO: Change proposal_status for the new status property to verify and values
          const client = user?.client ?? user;
          const status = client?.proposal_status;

          // Si ya fue aprobada, salir del onboarding al dashboard
          if (!redirected && status === "approved") {
            redirected = true;
            if (intervalId) clearInterval(intervalId);
            router.push(`/${locale}/dashboard`);
          }
        }
      } catch (err) {
        console.error("Error al consultar estado de propuesta:", err);
      }
    };

    // Llamada inmediata y luego cada 3 minutos
    checkStatus();
    intervalId = setInterval(checkStatus, 180000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [dispatch, router, locale]);

  return (
    <div className={styles.container}>
      {/* Progress Section - Mismo estilo que QuestForm */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>{dict("completed")}</span>
          <span className={styles.progressPercentage}>{dict("progress")}</span>
        </div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} />
        </div>
      </div>

      {/* Main Content - Centrado y responsive */}
      <div className={styles.mainContent}>
        {/* Loader con animación mejorada */}
        <div className={styles.loaderContainer}>
          <CircleLoader />
        </div>

        {/* Título principal */}
        <h1 className={styles.title}>{dict("processing_title")}</h1>

        {/* Descripción */}
        <div className={styles.description}>
          {dict("processing_description")}
          <br />
          {dict("notification_description")}
        </div>

        {/* Información adicional con mejor diseño */}
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <div className={styles.statusIndicator} />
            <span className={styles.statusLabel}>{dict("status_processing")}</span>
          </div>
          <p className={styles.statusText}>{dict("keep_page_open")}</p>
        </div>
      </div>
    </div>
  );
}

export default Waiting;
