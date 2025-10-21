"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Settings, Bell, TrendingUp, Users, Heart, Grid3X3, Sparkles } from "lucide-react";
import { ContentCalendar } from "@/features/(dashboard)/Social/components/ContentCalendar";
import { CreateContentModal } from "@/features/(dashboard)/Social/components/CreateContentModal";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchContent,
  generateContent,
  selectSocialMediaContent,
  selectSocialMediaProfile,
  selectIsLoading,
  selectSocialMediaError,
  selectIsGenerating,
  selectIsCreatingContent,
  clearError,
  //ContentItem as ReduxContentItem,
  //ProfileData as ReduxProfileData,
} from "@/features/(dashboard)/Social/store/socialMediaSlice";
import styles from "./style.module.scss";

// Type mapping for ContentCalendar compatibility
interface CalendarContentItem {
  clientId: string;
  socialMedia: "tiktok";
  publishType: "Video";
  pillar: string;
  day: Date;
  dayTime: "morning" | "afternoon" | "evening";
  completed: boolean;
  skinxId: string;
  presetId: string;
  content: {
    title: string;
    script: string;
    copy: string;
    hashtags: string | null;
    cta_copy: string | null;
    key_words_copy: string | null;
    feelings: string | null;
    understanding: string | null;
    make: string | null;
    hook: string | null;
  };
}

interface CalendarProfileData {
  _id: string;
  clientId: string;
  username: string;
  bio: string;
  avatar: string;
  socialMedia: string;
  createdAt: string;
  updatedAt: string;
}

// Utility function to convert Redux content to Calendar format
const convertToCalendarFormat = (reduxContent: any[]): CalendarContentItem[] => {
  return reduxContent.map(item => ({
    ...item,
    socialMedia: "tiktok" as const,
    publishType: "Video" as const,
    day: new Date(item.day),
    dayTime: item.dayTime === "night" ? "evening" : item.dayTime,
    skinxId: item.clientId, // Using clientId as fallback
    presetId: item.clientId, // Using clientId as fallback
    content: {
      ...item.content,
      hashtags: item.content.hashtags || null,
      cta_copy: item.content.cta_copy || null,
      key_words_copy: item.content.key_words_copy || null,
      feelings: item.content.feelings || null,
      understanding: item.content.understanding || null,
      make: item.content.make || null,
      hook: item.content.hook || null,
    },
  }));
};

// Utility function to convert Redux profile to Calendar format
const convertProfileToCalendarFormat = (reduxProfile: any | null): CalendarProfileData | null => {
  if (!reduxProfile) return null;

  return {
    _id: reduxProfile.name, // Using name as fallback for _id
    clientId: reduxProfile.name, // Using name as fallback
    username: reduxProfile.name,
    bio: reduxProfile.description,
    avatar: "", // Default empty avatar
    socialMedia: "tiktok",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Mock data for testing the component (kept for fallback)
const mockContentData = [
  {
    clientId: "client-001",
    socialMedia: "tiktok" as const,
    publishType: "Video" as const,
    pillar: "Educational",
    day: new Date(2025, 8, 22), // September 22, 2025 (Monday)
    dayTime: "morning" as const,
    completed: true,
    skinxId: "skin-001",
    presetId: "preset-001",
    content: {
      title: "Tips de Marketing Digital",
      script: "Hoy vamos a hablar sobre las mejores estrategias de marketing digital para pequeñas empresas...",
      copy: "¿Sabías que el marketing digital puede incrementar tus ventas hasta en un 300%?",
      hashtags: "#marketing #digital #tips #pequeñasempresas",
      cta_copy: "¡Síguenos para más tips!",
      key_words_copy: "marketing digital, estrategias, ventas",
      feelings: "inspiracional",
      understanding: "básico",
      make: "educativo",
      hook: "¿Quieres incrementar tus ventas?",
    },
  },
];

export function SocialMediaDashboard() {
  const dispatch = useAppDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Redux selectors
  const content = useAppSelector(selectSocialMediaContent);
  const profile = useAppSelector(selectSocialMediaProfile);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectSocialMediaError);
  const isGenerating = useAppSelector(selectIsGenerating);
  const isFixingContent = useAppSelector(selectIsCreatingContent);

  const { notify, notifyError } = useMessageToast();

  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    dispatch(
      fetchContent({
        startDate: today.toISOString().split("T")[0],
        endDate: nextWeek.toISOString().split("T")[0],
      }),
    );
  }, [dispatch]);

  // Clear error notifications
  useEffect(() => {
    if (error) {
      notifyError(error);
      dispatch(clearError());
    }
  }, [error, notifyError, dispatch]);

  const handleCreateContentSuccess = () => {
    console.log("Contenido creado exitosamente");

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    dispatch(
      fetchContent({
        startDate: today.toISOString().split("T")[0],
        endDate: nextWeek.toISOString().split("T")[0],
      }),
    );
  };

  const handleGenerateNextWeek = async () => {
    try {
      notify("Generando contenido para la próxima semana...");
      await dispatch(generateContent("next-week")).unwrap();
      notify("Contenido generado exitosamente");
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      dispatch(
        fetchContent({
          startDate: today.toISOString().split("T")[0],
          endDate: nextWeek.toISOString().split("T")[0],
        }),
      );
    } catch (error) {
      console.error("Error generating next week content:", error);
      notifyError("Error al generar el contenido");
    }
  };

  return (
    <div className={styles.container}>
      {/* Modal */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateContentSuccess}
      />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>Dashboard de Redes Sociales</div>
          <div className={styles.headerActions}>
            <Button
              variant='outline'
              size='sm'
              className={styles.refreshButton}
              onClick={handleGenerateNextWeek}
              disabled={isGenerating}
            >
              <RefreshCw className={isGenerating ? styles.spinning : ""} />
              {isGenerating ? "Generando..." : "Actualizar datos"}
            </Button>
            <Button
              variant='outline'
              size='sm'
              className={styles.generateButton}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Sparkles />
              Generar
            </Button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.contentArea}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingSpinner}></div>
              {isFixingContent ? (
                <div className={styles.loadingTextContainer}>
                  <div className={styles.loadingTitle}>Optimizando contenido...</div>
                  <div className={styles.loadingSubtitle}>Procesando ideas incompletas</div>
                </div>
              ) : (
                <div className={styles.loadingText}>Cargando contenido...</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.contentArea}>
          <div className={styles.contentDescription}>
            <div className={styles.descriptionText}>Visualiza y gestiona todo tu contenido programado de la semana</div>
            {error && <div className={styles.errorMessage}>{String(error)} - Mostrando datos de ejemplo</div>}
          </div>
          <ContentCalendar
            contentItems={convertToCalendarFormat(content)}
            profileData={convertProfileToCalendarFormat(profile)}
          />
        </div>
      )}
    </div>
  );
}
