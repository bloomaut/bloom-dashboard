"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
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

  // Inicialización: Cargar perfil al montar el componente
  useEffect(() => {
    console.log("🚀 Inicializando página de Social Media...");
    dispatch(fetchProfile());
  }, [dispatch]);

  // Manejo de errores del perfil
  useEffect(() => {
    if (profileError) {
      console.error("❌ Error de perfil:", profileError);
      notifyError(`${dict("notifications.profile_error")} ${profileError}`);
      // Limpiar solo el error de perfil después de mostrarlo
      dispatch(clearError());
    }
  }, [profileError, notifyError, dispatch, dict]);

  // Manejo de errores generales
  useEffect(() => {
    if (generalError && !profileError) {
      console.error("❌ Error general:", generalError);
      notifyError(`${dict("notifications.general_error")} ${generalError}`);
      dispatch(clearError());
    }
  }, [generalError, profileError, notifyError, dispatch, dict]);

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

  // Lógica de derivación de pantallas
  // Si no hay perfil conectado o no tiene cuentas conectadas -> Setup
  // Si tiene perfil conectado -> Dashboard
  const shouldShowSetup = !isProfileConnected || !profile?.connected;

  console.log("📊 Estado actual:", {
    hasProfile: Boolean(profile),
    isConnected: isProfileConnected,
    profileConnected: profile?.connected,
    shouldShowSetup,
  });

  return (
    <div className={styles.socialMediaPage} id='social-media-page'>
      {shouldShowSetup ? <SocialMediaSetup /> : <SocialMediaDashboard />}
    </div>
  );
}
