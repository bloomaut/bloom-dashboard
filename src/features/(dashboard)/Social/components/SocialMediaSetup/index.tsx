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

export function SocialMediaSetup() {
  const dispatch = useAppDispatch();
  const { notify, notifyError } = useMessageToast();

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
      notifyError(`Error al conectar TikTok: ${tikTokError}`);
      dispatch(clearError());
    }
  }, [tikTokError, notifyError, dispatch]);

  useEffect(() => {
    if (generationError) {
      console.error("❌ Error de generación:", generationError);
      notifyError(`Error al generar contenido: ${generationError}`);
      dispatch(clearError());
    }
  }, [generationError, notifyError, dispatch]);

  useEffect(() => {
    if (generalError && !tikTokError && !generationError) {
      console.error("❌ Error general:", generalError);
      notifyError(`Error: ${generalError}`);
      dispatch(clearError());
    }
  }, [generalError, tikTokError, generationError, notifyError, dispatch]);

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
          contentCount: result.contents.length,
        });

        notify("¡TikTok conectado exitosamente!");
        notify(`Contenido inicial generado: ${result.contents.length} elementos`);
      } catch (error: any) {
        console.error("❌ Error en flujo completo de TikTok:", error);
        notifyError(error.message || "Error al conectar TikTok y generar contenido");
      }
    } else if (platform === "instagram") {
      // Instagram no está implementado aún
      notifyError("La conexión de Instagram estará disponible próximamente");
    }
  };

  // Función para obtener el badge de estado de cada plataforma
  const getStatusBadge = (platform: "instagram" | "tiktok") => {
    // Verificar conexión basada en el perfil
    const isConnected = platform === "tiktok" ? profile?.connected && profile?.socialMedia === "tiktok" : false; // Instagram no implementado

    if (isConnected) {
      return (
        <Badge variant='default' className={styles.connectedBadge}>
          <CheckCircle className={styles.badgeIcon} />
          Conectado
        </Badge>
      );
    } else {
      return (
        <Badge variant='secondary' className={styles.disconnectedBadge}>
          <Clock className={styles.badgeIcon} />
          No conectado
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
          <div className={styles.headerTitle}>Configuración de Redes Sociales</div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {/* Instructions Card */}
          <Card className={styles.instructionsCard}>
            <CardHeader>
              <CardTitle className={styles.instructionsTitle}>Instrucciones</CardTitle>
              <CardDescription className={styles.instructionsDescription}>
                Página inicial donde primero tienes que registrar tus cuentas de Instagram y TikTok
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.instructionsContent}>
              <p>Deberían haber dos botones uno para IG, otro para TikTok.</p>
              <p>Y alguna UI que indique el estatus de registro.</p>
              <p>Si ya se registró una cuenta envíos verde completado, si todavía no se hizo nada con otro color.</p>
            </CardContent>
          </Card>

          {/* Setup Cards */}
          <div className={styles.setupGrid}>
            {/* TikTok Setup */}
            <Card className={styles.setupCard}>
              <CardHeader className={styles.setupCardHeader}>
                <div className={`${styles.setupCardIcon} ${styles.tiktok}`}>
                  <MessageCircle />
                </div>
                <CardTitle className={styles.setupCardTitle}>TikTok</CardTitle>
                <CardDescription>Conecta tu cuenta de TikTok para gestionar tu contenido</CardDescription>
              </CardHeader>
              <CardContent className={styles.setupCardContent}>
                <div className={styles.statusBadge}>
                  {isTikTokConnected ? (
                    <Badge variant='default'>Conectado</Badge>
                  ) : (
                    <Badge variant='secondary'>No conectado</Badge>
                  )}
                </div>

                <div className={styles.featuresList}>
                  <p className={styles.featureItem}>• Subir videos automáticamente</p>
                  <p className={styles.featureItem}>• Analizar rendimiento</p>
                  <p className={styles.featureItem}>• Programar contenido</p>
                </div>

                <Button
                  onClick={() => handleConnectPlatform("tiktok")}
                  disabled={isTikTokConnected || isProcessing}
                  className={`${styles.connectButton} ${styles.tiktok}`}
                >
                  {isConnectingTikTok ? (
                    <>
                      <Clock className={styles.spinning} />
                      Conectando TikTok...
                    </>
                  ) : isGeneratingContent ? (
                    <>
                      <Clock className={styles.spinning} />
                      Generando contenido...
                    </>
                  ) : isTikTokConnected ? (
                    <>
                      <CheckCircle />
                      Conectado
                    </>
                  ) : (
                    <>
                      <MessageCircle />
                      Conectar TikTok
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instagram Setup */}
            <Card className={styles.setupCard}>
              <CardHeader className={styles.setupCardHeader}>
                <div className={`${styles.setupCardIcon} ${styles.instagram}`}>
                  <Instagram />
                </div>
                <CardTitle className={styles.setupCardTitle}>Instagram</CardTitle>
                <CardDescription>Conecta tu cuenta de Instagram para gestionar tus publicaciones</CardDescription>
              </CardHeader>
              <CardContent className={styles.setupCardContent}>
                {getStatusBadge("instagram")}

                <div className={styles.featuresList}>
                  <p className={styles.featureItem}>• Programar publicaciones</p>
                  <p className={styles.featureItem}>• Ver métricas de engagement</p>
                  <p className={styles.featureItem}>• Gestionar stories</p>
                </div>

                <Button disabled={true} className={`${styles.connectButton} ${styles.instagram}`}>
                  <Instagram />
                  Próximamente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
