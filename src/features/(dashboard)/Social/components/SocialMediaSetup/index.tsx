"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  connectTikTokAndGenerateInitialContent,
  selectProfile,
  selectIsConnectingTikTok,
  selectIsGeneratingWeekContent,
  selectTikTokError,
  selectGenerationError,
  selectError,
  selectIsProfileConnected,
  clearError,
  clearAllErrors,
} from "../../store/socialMediaSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, MessageCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useEffect } from "react";
import styles from "./style.module.scss";
import { useTranslations } from "next-intl";

export function SocialMediaSetup() {
  const dispatch = useAppDispatch();
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.social.setup");

  // Redux selectors - usando los selectores correctos del slice refactorizado
  const profile = useAppSelector(selectProfile);
  const isConnectingTikTok = useAppSelector(selectIsConnectingTikTok);
  const isGeneratingContent = useAppSelector(selectIsGeneratingWeekContent);
  const tikTokError = useAppSelector(selectTikTokError);
  const generationError = useAppSelector(selectGenerationError);
  const generalError = useAppSelector(selectError);
  const isProfileConnected = useAppSelector(selectIsProfileConnected);

  // Manejo de errores específicos
  useEffect(() => {
    if (tikTokError) {
      console.error("❌ Error de TikTok:", tikTokError);
      notifyError(dict("errors.tiktok_connect_and_generate"));
      dispatch(clearError());
    }
  }, [tikTokError, notifyError, dispatch, dict]);

  useEffect(() => {
    if (generationError) {
      console.error("❌ Error de generación:", generationError);
      notifyError(dict("errors.tiktok_connect_and_generate"));
      dispatch(clearError());
    }
  }, [generationError, notifyError, dispatch, dict]);

  useEffect(() => {
    if (generalError && !tikTokError && !generationError) {
      console.error("❌ Error general:", generalError);
      notifyError(`${dict("errors.general_error_prefix")} ${generalError}`);
      dispatch(clearError());
    }
  }, [generalError, tikTokError, generationError, notifyError, dispatch, dict]);

  // Función para conectar plataformas con flujo completo
  const handleConnectPlatform = async (platform: "instagram" | "tiktok") => {
    if (platform === "tiktok") {
      try {
        console.log("🔄 Iniciando conexión de TikTok con generación de contenido...");

        // Limpiar errores previos
        dispatch(clearAllErrors());

        // Simular código de autorización de TikTok OAuth
        const mockAuthCode = "mock_tiktok_auth_code_1234";

        notify("Conectando cuenta de TikTok...");

        // Usar el flujo completo: conectar TikTok + generar contenido inicial
        const result = await dispatch(
          connectTikTokAndGenerateInitialContent({
            code: mockAuthCode,
          }),
        ).unwrap();

        console.log("✅ Flujo completo exitoso:", {
          profile: result.profile.username,
          contentCount: result.contentPieces.length,
        });

        notify("¡TikTok conectado exitosamente!");
        notify(`Contenido inicial generado: ${result.contentPieces.length} elementos`);
      } catch (error: any) {
        console.error("❌ Error en flujo completo de TikTok:", error);
        notifyError(error.message || dict("errors.tiktok_connect_and_generate"));
      }
    } else if (platform === "instagram") {
      notifyError(dict("errors.instagram_not_implemented"));
    }
  };

  // Función para obtener el badge de estado de cada plataforma
  const getStatusBadge = (platform: "instagram" | "tiktok") => {
    const isConnected = platform === "tiktok" ? profile?.connected && profile?.socialMedia === "tiktok" : false;

    if (isConnected) {
      return (
        <Badge variant='default' className={styles.connectedBadge}>
          <CheckCircle className={styles.badgeIcon} />
          {dict("status.connected")}
        </Badge>
      );
    } else {
      return (
        <Badge variant='secondary' className={styles.disconnectedBadge}>
          <Clock className={styles.badgeIcon} />
          {dict("status.not_connected")}
        </Badge>
      );
    }
  };

  // Estados derivados
  const isTikTokConnected = profile?.socialMedia === "tiktok" && profile?.connected;
  const isProcessing = isConnectingTikTok || isGeneratingContent;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>{dict("header.title")}</div>
        </div>
      </header>
      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {/* Instructions Card */}
          <Card className={styles.instructionsCard}>
            <CardHeader className={styles.instructionsHeader}>
              <CardTitle className={styles.instructionsTitle}>
                <AlertCircle className={styles.instructionIcon} />
                {dict("instructions.title")}
              </CardTitle>
              <CardDescription className={styles.instructionsDescription}>
                {dict("instructions.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.instructionsContent}>
              <div className={styles.instructionStep}>
                <div className={styles.stepNumber}>1</div>
                <p>{dict("instructions.steps.0")}</p>
              </div>
              <div className={styles.instructionStep}>
                <div className={styles.stepNumber}>2</div>
                <p>{dict("instructions.steps.1")}</p>
              </div>
              <div className={styles.instructionStep}>
                <div className={styles.stepNumber}>3</div>
                <p>{dict("instructions.steps.2")}</p>
              </div>
            </CardContent>
          </Card>
          {/* Setup Cards */}
          <div className={styles.setupGrid}>
            {/* TikTok Setup */}
            <Card className={`${styles.setupCard} ${styles.tiktokCard}`}>
              <CardHeader className={styles.setupCardHeader}>
                <div className={`${styles.setupCardIcon} ${styles.tiktok}`}>
                  <MessageCircle />
                </div>
                <CardTitle className={styles.setupCardTitle}>{dict("platform.tiktok.title")}</CardTitle>
                <CardDescription>{dict("platform.tiktok.description")}</CardDescription>
              </CardHeader>
              <CardContent className={styles.setupCardContent}>
                <div className={styles.statusBadge}>{getStatusBadge("tiktok")}</div>
                <div className={styles.featuresList}>
                  <p className={styles.featureItem}>{dict("platform.tiktok.features.0")}</p>
                  <p className={styles.featureItem}>{dict("platform.tiktok.features.1")}</p>
                  <p className={styles.featureItem}>{dict("platform.tiktok.features.2")}</p>
                </div>
                <Button
                  onClick={() => handleConnectPlatform("tiktok")}
                  disabled={isTikTokConnected || isProcessing}
                  className={`${styles.connectButton} ${styles.tiktok}`}
                >
                  {isConnectingTikTok ? (
                    <>
                      <Clock className={styles.spinning} />
                      {dict("status.connecting_tiktok")}
                    </>
                  ) : isGeneratingContent ? (
                    <>
                      <Clock className={styles.spinning} />
                      {dict("status.generating_content")}
                    </>
                  ) : isTikTokConnected ? (
                    <>
                      <CheckCircle />
                      {dict("status.connected")}
                    </>
                  ) : (
                    <>
                      <MessageCircle />
                      {dict("cta.connect_tiktok")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            {/* Instagram Setup */}
            <Card className={`${styles.setupCard} ${styles.instagramCard}`}>
              <CardHeader className={styles.setupCardHeader}>
                <div className={`${styles.setupCardIcon} ${styles.instagram}`}>
                  <Instagram />
                </div>
                <CardTitle className={styles.setupCardTitle}>{dict("platform.instagram.title")}</CardTitle>
                <CardDescription>{dict("platform.instagram.description")}</CardDescription>
              </CardHeader>
              <CardContent className={styles.setupCardContent}>
                <div className={styles.statusBadge}>{getStatusBadge("instagram")}</div>
                <div className={styles.featuresList}>
                  <p className={styles.featureItem}>{dict("platform.instagram.features.0")}</p>
                  <p className={styles.featureItem}>{dict("platform.instagram.features.1")}</p>
                  <p className={styles.featureItem}>{dict("platform.instagram.features.2")}</p>
                </div>
                <Button disabled={true} className={`${styles.connectButton} ${styles.instagram}`}>
                  <Instagram />
                  {dict("cta.coming_soon")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
