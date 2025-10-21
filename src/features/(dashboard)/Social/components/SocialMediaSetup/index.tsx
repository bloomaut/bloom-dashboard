"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  connectTikTok,
  generateContent,
  selectSocialMediaProfile,
  selectIsLoading,
  selectIsGenerating,
  selectSocialMediaError,
  clearError,
} from "@/features/(dashboard)/Social/store/socialMediaSlice";
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

  // Redux selectors
  const profile = useAppSelector(selectSocialMediaProfile);
  const isLoading = useAppSelector(selectIsLoading);
  const isGenerating = useAppSelector(selectIsGenerating);
  const error = useAppSelector(selectSocialMediaError);

  // Handle errors
  useEffect(() => {
    if (error) {
      notifyError(error);
      dispatch(clearError());
    }
  }, [error, notifyError, dispatch]);

  const handleConnectPlatform = async (platform: "instagram" | "tiktok") => {
    if (platform === "tiktok") {
      try {
        // Simulate TikTok OAuth flow
        const code = "mock_tiktok_auth_code";

        notify("Conectando cuenta de TikTok...");
        const connectResult = await dispatch(connectTikTok(code)).unwrap();

        if (connectResult) {
          notify("Cuenta de TikTok conectada exitosamente");

          // Generate initial content
          notify("Generando contenido inicial...");
          await dispatch(generateContent("first-login")).unwrap();
          notify("Contenido inicial generado exitosamente");
        }
      } catch (error: any) {
        console.error("Error connecting TikTok:", error);
        notifyError(error || "Error al conectar la cuenta de TikTok");
      }
    } else {
      // Instagram connection logic would go here
      notifyError("La conexión de Instagram no está disponible aún");
    }
  };

  const getStatusBadge = (platform: "instagram" | "tiktok") => {
    const isConnected = profile?.connected_accounts?.[platform] || false;

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
                {getStatusBadge("tiktok")}

                <div className={styles.featuresList}>
                  <p className={styles.featureItem}>• Subir videos automáticamente</p>
                  <p className={styles.featureItem}>• Analizar rendimiento</p>
                  <p className={styles.featureItem}>• Programar contenido</p>
                </div>

                <Button
                  onClick={() => handleConnectPlatform("tiktok")}
                  disabled={profile?.connected_accounts?.tiktok || isLoading || isGenerating}
                  className={`${styles.connectButton} ${styles.tiktok}`}
                >
                  {isLoading ? (
                    <>
                      <Clock className={styles.spinning} />
                      Conectando...
                    </>
                  ) : isGenerating ? (
                    <>
                      <Clock className={styles.spinning} />
                      Generando contenido...
                    </>
                  ) : profile?.connected_accounts?.tiktok ? (
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

                <Button
                  onClick={() => handleConnectPlatform("instagram")}
                  disabled={true}
                  className={`${styles.connectButton} ${styles.instagram}`}
                >
                  {false ? (
                    <>
                      <Clock className={styles.spinning} />
                      Conectando...
                    </>
                  ) : profile?.connected_accounts?.instagram ? (
                    <>
                      <CheckCircle />
                      Conectado
                    </>
                  ) : (
                    <>
                      <Instagram />
                      Proximamente
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
