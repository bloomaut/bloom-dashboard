"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchContent,
  fetchProfile,
  selectProfile,
  selectIsLoadingProfile,
  selectProfileError,
  selectError,
  selectIsProfileConnected,
  clearError,
  clearAllErrors,
} from "@/features/(dashboard)/Social/store/socialMediaSlice";
import { SocialMediaSetup } from "@/features/(dashboard)/Social/components/SocialMediaSetup";
import { SocialMediaDashboard } from "@/features/(dashboard)/Social/components/SocialMediaDashboard";
import { resolveSocialMediaView } from "@/features/(dashboard)/Social/utils/socialProfileMode";
import { isSocialProfileDisabled } from "@/utils/featureFlags";
import { useMessageToast } from "@/hooks/useMessageToast";
import styles from "./styles/dashboardSocial.module.scss";
import LoadingSpinner from "@/components/Loading";

export default function SocialMediaPage() {
  const dispatch = useAppDispatch();
  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.social.page");

  // Redux selectors - usando los selectores correctos del slice
  const profile = useAppSelector(selectProfile);
  const isLoadingProfile = useAppSelector(selectIsLoadingProfile);
  const profileError = useAppSelector(selectProfileError);
  const generalError = useAppSelector(selectError);
  const isProfileConnected = useAppSelector(selectIsProfileConnected);

  const disableSocialProfile = isSocialProfileDisabled();

  // Validación de Social Profile (temporalmente desactivable)
  // Para desactivar el flujo de conexión/validación de redes, seteá:
  // NEXT_PUBLIC_DISABLE_SOCIAL_PROFILE=true
  useEffect(() => {
    console.log("🚀 Inicializando página de Social Media...");

    if (disableSocialProfile) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDate = startOfWeek.toISOString().split("T")[0];
      const endDate = endOfWeek.toISOString().split("T")[0];

      dispatch(fetchContent({ startDate, endDate }));
      return;
    }

    dispatch(fetchProfile());
  }, [dispatch, disableSocialProfile]);

  // Manejo de errores del perfil
  useEffect(() => {
    if (disableSocialProfile) return;

    if (profileError) {
      console.error("❌ Error de perfil:", profileError);
      notifyError(`${dict("notifications.profile_error")} ${profileError}`);
      // Limpiar solo el error de perfil después de mostrarlo
      dispatch(clearError());
    }
  }, [profileError, notifyError, dispatch, dict, disableSocialProfile]);

  // Manejo de errores generales
  useEffect(() => {
    if (disableSocialProfile) return;

    if (generalError && !profileError) {
      console.error("❌ Error general:", generalError);
      notifyError(`${dict("notifications.general_error")} ${generalError}`);
      dispatch(clearError());
    }
  }, [generalError, profileError, notifyError, dispatch, dict, disableSocialProfile]);

  // Modo directo al calendario (sin validación de Social Profile)
  if (disableSocialProfile) {
    return (
      <div className={styles.socialMediaPage} id='social-media-page'>
        <SocialMediaDashboard />
      </div>
    );
  }

  // Estado de carga inicial
  if (!isLoadingProfile && !profile) {
    return (
      <div className={styles.loadingContainer} id='social-media-page'>
        <LoadingSpinner size='medium' />
      </div>
    );
  }

  // Estado de error crítico (sin perfil y con error)
  if (!isLoadingProfile && !profile && profileError) {
    return (
      <div className={styles.errorContainer} id='social-media-page'>
        <div className={styles.errorContent}>
          <h2>{dict("error.title")}</h2>
          <p>{dict("error.description")}</p>
          <button
            onClick={() => {
              dispatch(clearAllErrors());
              dispatch(fetchProfile());
            }}
            className={styles.retryButton}
          >
            {dict("error.retry_button")}
          </button>
        </div>
      </div>
    );
  }

  const view = resolveSocialMediaView({ disableSocialProfile, profile, isProfileConnected });

  console.log("📊 Estado actual:", {
    hasProfile: Boolean(profile),
    isConnected: isProfileConnected,
    profileConnected: profile?.connected,
    view,
  });

  return (
    <div className={styles.socialMediaPage} id='social-media-page'>
      {view === "setup" ? <SocialMediaSetup /> : <SocialMediaDashboard />}
    </div>
  );
}
