"use client";

import { useEffect } from "react";
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

export default function SocialMediaPage() {
  const dispatch = useAppDispatch();
  const { notifyError } = useMessageToast();

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
      notifyError(`Error al cargar el perfil: ${profileError}`);
      // Limpiar solo el error de perfil después de mostrarlo
      dispatch(clearError());
    }
  }, [profileError, notifyError, dispatch]);

  // Manejo de errores generales
  useEffect(() => {
    if (generalError && !profileError) {
      console.error("❌ Error general:", generalError);
      notifyError(`Error: ${generalError}`);
      dispatch(clearError());
    }
  }, [generalError, profileError, notifyError, dispatch]);

  // Estado de carga inicial
  if (isLoadingProfile && !profile) {
    return (
      <div className={styles.loadingContainer} id='social-media-page'>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Cargando perfil de redes sociales...</p>
        </div>
      </div>
    );
  }

  // Estado de error crítico (sin perfil y con error)
  if (!isLoadingProfile && !profile && profileError) {
    return (
      <div className={styles.errorContainer} id='social-media-page'>
        <div className={styles.errorContent}>
          <h2>Error al cargar el perfil</h2>
          <p>No se pudo cargar la información de tu perfil de redes sociales.</p>
          <button
            onClick={() => {
              dispatch(clearAllErrors());
              dispatch(fetchProfile());
            }}
            className={styles.retryButton}
          >
            Reintentar
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
