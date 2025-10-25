"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { ContentCalendar } from "../ContentCalendar";
import { CreateContentModal } from "@/features/(dashboard)/Social/components/CreateContentModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  generateWeekContent,
  selectIsGeneratingWeekContent,
  selectIsCreatingContent,
  clearAllErrors,
  selectError,
} from "../../store/socialMediaSlice";
import styles from "./style.module.scss";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SocialMediaDashboard() {
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.social.dashboard");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ========================================================================
  // REDUX SELECTORS
  // ========================================================================
  const isGeneratingWeekContent = useAppSelector(selectIsGeneratingWeekContent);
  const isCreatingContent = useAppSelector(selectIsCreatingContent);
  const generalError = useAppSelector(selectError);

  // Estados derivados
  const isGenerating = isGeneratingWeekContent;

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Manejo de errores con notificaciones
  useEffect(() => {
    if (generalError) {
      console.error("❌ Error en SocialMediaDashboard:", generalError);

      // Limpiar errores después de mostrar la notificación
      const timer = setTimeout(() => {
        dispatch(clearAllErrors());
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [generalError, dispatch]);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  /**
   * Genera contenido para la próxima semana
   */
  const handleGenerateNextWeek = async () => {
    try {
      console.log("🔄 Generando contenido para la próxima semana...");

      // Calcular fechas para la próxima semana
      const today = new Date();
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7) + 7); // Próximo lunes

      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6); // Domingo de esa semana

      const startDate = nextMonday.toISOString().split("T")[0]; // YYYY-MM-DD
      const endDate = nextSunday.toISOString().split("T")[0]; // YYYY-MM-DD

      await dispatch(
        generateWeekContent({
          pipelineType: "next-week",
          startDate,
          endDate,
        }),
      ).unwrap();

      console.log("✅ Contenido generado exitosamente");
    } catch (error) {
      console.error("❌ Error generando contenido:", error);
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className={styles.container}>
      {/* Modal de creación de contenido */}
      <CreateContentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Header con acciones */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>{dict("header.title")}</div>
          <div className={styles.headerActions}>
            <Button
              variant='outline'
              size='sm'
              className={styles.refreshButton}
              onClick={handleGenerateNextWeek}
              disabled={isGenerating}
            >
              <RefreshCw className={isGenerating ? styles.spinning : ""} />
              {isGenerating ? dict("actions.generating") : dict("actions.generate_week")}
            </Button>
            <Button
              variant='outline'
              size='sm'
              className={styles.generateButton}
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isCreatingContent}
            >
              <Sparkles />
              {isCreatingContent ? dict("actions.creating") : dict("actions.create_content")}
            </Button>
          </div>
        </div>
      </header>

      {/* Área de contenido principal */}
      <div className={styles.contentArea}>
        <ContentCalendar />
      </div>
    </div>
  );
}
