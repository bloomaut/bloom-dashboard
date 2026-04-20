"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, Video, Calendar, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectContent,
  selectProfile,
  selectIsLoadingContent,
  selectContentError,
  selectGenerationError,
  selectError,
  fetchContent,
  clearAllErrors,
  markContentAsCompleted,
  updateContentItem,
} from "../../store/socialMediaSlice";
import { isSocialProfileDisabled } from "@/utils/featureFlags";
import { ContentStatus, IContentPiece, Platform } from "../../types";
import styles from "./style.module.scss";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/Loading";

// Color scheme for time periods
const TIME_PERIOD_COLORS = {
  morning: {
    bg: "morningItem",
    border: "morningItem",
    text: "morningItem",
    dot: "morningDot",
    header: "morningHeader",
    empty: "emptyMorning",
    timeDot: "morningTimeDot",
  },
  afternoon: {
    bg: "afternoonItem",
    border: "afternoonItem",
    text: "afternoonItem",
    dot: "afternoonDot",
    header: "afternoonHeader",
    empty: "emptyAfternoon",
    timeDot: "afternoonTimeDot",
  },
  evening: {
    bg: "eveningItem",
    border: "eveningItem",
    text: "eveningItem",
    dot: "eveningDot",
    header: "eveningHeader",
    empty: "emptyEvening",
    timeDot: "eveningTimeDot",
  },
} as const;

// Constantes movidas al final para mejor organización
const getDaysOfWeek = (dict: any) => [
  dict("calendar.days.sunday"),
  dict("calendar.days.monday"),
  dict("calendar.days.tuesday"),
  dict("calendar.days.wednesday"),
  dict("calendar.days.thursday"),
  dict("calendar.days.friday"),
  dict("calendar.days.saturday"),
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Genera el rango de fechas para la semana actual (domingo a sábado)
 */
const getCurrentWeekRange = () => {
  const today = new Date();

  // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
  const dayOfWeek = today.getDay();

  // Calcular el domingo de la semana actual
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  // Calcular el sábado de la semana actual (6 días después del domingo)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    startDate: startOfWeek.toISOString().split("T")[0],
    endDate: endOfWeek.toISOString().split("T")[0],
  };
};

/**
 * Genera el rango de fechas para una semana específica basada en el offset
 * @param weekOffset - Offset de semanas desde la semana actual (0 = semana actual, -1 = semana anterior, 1 = semana siguiente)
 */
const getWeekRange = (weekOffset: number) => {
  const today = new Date();

  // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
  const dayOfWeek = today.getDay();

  // Calcular el domingo de la semana actual
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - dayOfWeek);

  // Aplicar el offset de semanas
  const startOfTargetWeek = new Date(startOfCurrentWeek);
  startOfTargetWeek.setDate(startOfCurrentWeek.getDate() + weekOffset * 7);

  // Calcular el sábado de la semana objetivo (6 días después del domingo)
  const endOfTargetWeek = new Date(startOfTargetWeek);
  endOfTargetWeek.setDate(startOfTargetWeek.getDate() + 6);

  return {
    startDate: startOfTargetWeek.toISOString().split("T")[0],
    endDate: endOfTargetWeek.toISOString().split("T")[0],
  };
};

/**
 * Función auxiliar para truncar texto
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima permitida
 * @returns Texto truncado con "..." si excede la longitud
 */
const truncateText = (text: string, maxLength: number = 23): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

type ContentPieceWithDate = IContentPiece & { publishDateObj: Date };

const convertContentPieceForCalendar = (item: IContentPiece): ContentPieceWithDate => {
  return {
    ...item,
    publishDateObj: new Date(item.publishDate.date),
  };
};

/**
 * Hook personalizado para manejar la navegación de semanas
 * @returns Objeto con funciones y estado de navegación
 */
const useWeekNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekOffset(prev => prev - 1);
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekOffset(prev => prev + 1);
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekOffset(0);
  }, []);

  const isCurrentWeek = useCallback(() => {
    return currentWeekOffset === 0;
  }, [currentWeekOffset]);

  return {
    currentWeekOffset,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
  };
};

/**
 * Hook personalizado para calcular las fechas de la semana
 * @param weekOffset - Offset de la semana actual
 * @returns Array de fechas de la semana
 */
const useWeekDates = (weekOffset: number) => {
  return useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + weekOffset * 7);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  }, [weekOffset]);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ContentCalendar = () => {
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.social");
  const disableSocialProfile = isSocialProfileDisabled();

  // Redux selectors - siempre usa datos de Redux
  const content = useAppSelector(selectContent);
  const profile = useAppSelector(selectProfile);
  const isLoadingContent = useAppSelector(selectIsLoadingContent);

  // Errores específicos
  const contentError = useAppSelector(selectContentError);
  const generationError = useAppSelector(selectGenerationError);
  const generalError = useAppSelector(selectError);

  // Estados derivados
  const hasError = contentError || generationError || generalError;
  const errorMessage = contentError || generationError || generalError;

  // Estado local
  const [selectedContent, setSelectedContent] = useState<ContentPieceWithDate | null>(null);

  // Hooks personalizados
  const { currentWeekOffset, goToPreviousWeek, goToNextWeek, goToCurrentWeek, isCurrentWeek } = useWeekNavigation();

  const weekDates = useWeekDates(currentWeekOffset);

  // Obtener días de la semana traducidos
  const DAYS_OF_WEEK = getDaysOfWeek(dict);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Cargar contenido cuando cambia la semana (incluyendo la carga inicial)
  useEffect(() => {
    console.log(`📅 Cargando contenido para semana con offset: ${currentWeekOffset}`);
    const { startDate, endDate } = getWeekRange(currentWeekOffset);

    dispatch(fetchContent({ startDate, endDate }));
  }, [currentWeekOffset, dispatch]);

  // Manejo de errores con notificaciones
  useEffect(() => {
    if (hasError) {
      console.error("❌ Error en ContentCalendar:", errorMessage);

      // Limpiar errores después de mostrar la notificación
      const timer = setTimeout(() => {
        dispatch(clearAllErrors());
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [hasError, errorMessage, dispatch]);

  // ========================================================================
  // EXPOSED METHODS
  // ========================================================================

  // Convertir contenido de Redux para uso en el calendario
  const contentItems = useMemo(() => {
    return (content as IContentPiece[]).map(convertContentPieceForCalendar);
  }, [content]);

  /**
   * Función para obtener el texto del rango de fechas de la semana
   * @returns String con el rango de fechas formateado
   */
  const getWeekRangeText = useCallback(() => {
    const startDate = weekDates[0];
    const endDate = weekDates[6];

    const formatDate = (date: Date) => {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [weekDates]);

  /**
   * Función para agrupar contenido por día y horario
   * @returns Objeto agrupado por fecha y horario
   */
  const groupContentByDay = useMemo(() => {
    const grouped: Record<string, Record<string, ContentPieceWithDate[]>> = {};

    // Inicializar estructura para cada día de la semana
    weekDates.forEach(date => {
      const dateKey = date.toDateString();
      grouped[dateKey] = {
        morning: [],
        afternoon: [],
        evening: [],
      };
    });

    // Agrupar contenido existente
    contentItems.forEach(item => {
      const dateKey = item.publishDateObj.toDateString();
      if (grouped[dateKey]) {
        grouped[dateKey][item.dayTime as unknown as keyof typeof TIME_PERIOD_COLORS].push(item);
      }
    });

    return grouped;
  }, [weekDates, contentItems]);

  /**
   * Función para manejar el marcado de contenido como completado
   * @param contentId - ID del contenido a marcar
   */
  const handleMarkAsCompleted = useCallback(
    (contentId: string) => {
      dispatch(markContentAsCompleted(contentId));
    },
    [dispatch],
  );

  /**
   * Componente para renderizar el modal de detalles del contenido
   * @returns JSX del modal o null si no hay contenido seleccionado
   */
  const renderContentModal = useCallback(() => {
    if (!selectedContent) return null;

    const handleCloseModal = () => setSelectedContent(null);

    const handleToggleCompleted = () => {
      const nextStatus = selectedContent.status === ContentStatus.READY ? ContentStatus.DRAFT : ContentStatus.READY;

      if (nextStatus === ContentStatus.READY) {
        handleMarkAsCompleted(selectedContent.id);
      } else {
        dispatch(updateContentItem({ id: selectedContent.id, updates: { status: ContentStatus.DRAFT } }));
      }

      setSelectedContent(prev => (prev ? { ...prev, status: nextStatus } : null));
    };

    const title = selectedContent.title ?? "Sin titulo";

    const dayNames = getDaysOfWeek(dict);
    const dayLabel = dayNames[selectedContent.publishDateObj.getDay()] || "";
    const timeLabel = dict(`calendar.time_periods.${selectedContent.dayTime}`);
    const dateLabel = selectedContent.publishDateObj
      .toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/\./g, "");

    const statusMeta = (() => {
      switch (selectedContent.status) {
        case ContentStatus.DRAFT:
          return { label: "Borrador", className: styles.statusDraft };
        case ContentStatus.IN_PROCESS:
          return { label: "En proceso", className: styles.statusProcess };
        case ContentStatus.READY:
          return { label: "Listo", className: styles.statusReady };
        case ContentStatus.INTERNAL_PUBLISHED:
          return { label: "Publicado (Interno)", className: styles.statusInternal };
        case ContentStatus.SOCIAL_PUBLISHED:
          return { label: "Publicado (Redes)", className: styles.statusSocial };
        case ContentStatus.REJECTED:
          return { label: "Rechazado", className: styles.statusRejected };
        default:
          return { label: String(selectedContent.status), className: styles.statusDraft };
      }
    })();

    const scriptScenes = selectedContent.script || [];
    const scriptPlain = scriptScenes
      .map(scene => scene.join(" "))
      .filter(Boolean)
      .join("\n\n");

    const toLabel = (input: string) => input.replace(/_/g, " ").replace(/-/g, " ").trim();

    const getCameraLabel = (scene: any) => {
      const raw = scene?.camera ? String(scene.camera) : "";
      if (!raw) return null;
      if (raw === "selfie") return "selfie";
      if (raw === "screen") return "pantalla";
      if (raw === "back") return "trasera";
      return toLabel(raw).toLowerCase();
    };

    const getShotLabel = (scene: any) => {
      const raw = scene?.shot ? String(scene.shot) : "";
      if (!raw) return null;
      if (raw === "short_plane") return "plano corto";
      if (raw === "medium_plane") return "plano medio";
      if (raw === "open_plane") return "plano abierto";
      return toLabel(raw).toLowerCase();
    };

    const getOverlayChips = (scene: any) => {
      const overlays = Array.isArray(scene?.overlays) ? scene.overlays : [];
      return overlays
        .map((o: unknown) => {
          const type = typeof (o as any)?.type === "string" ? String((o as any).type) : "";
          const value = typeof (o as any)?.value === "string" ? String((o as any).value) : "";
          if (!type) return null;
          if (type === "subtitles") return value ? `subtítulos · ${value}` : "subtítulos";
          if (type === "simple_text") return value ? `texto · ${value}` : "texto";
          if (type === "narrative_text") return value ? `narrativa · ${value}` : "narrativa";
          if (type === "media") return value ? `media · ${value}` : "media";
          return value ? `${toLabel(type).toLowerCase()} · ${value}` : toLabel(type).toLowerCase();
        })
        .filter(Boolean)
        .slice(0, 3) as string[];
    };

    const hookText = (scriptScenes[0]?.[0] || "").trim();

    const getSceneLines = (sceneIndex: number) => {
      const scene = scriptScenes[sceneIndex] || [];
      const lines = scene.map(s => String(s || "").trim()).filter(Boolean);
      if (sceneIndex === 0 && hookText) return lines.filter(l => l !== hookText);
      return lines;
    };

    const handleCopyScript = async () => {
      if (!scriptPlain) return;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(scriptPlain);
          return;
        }
      } catch {}

      try {
        const el = document.createElement("textarea");
        el.value = scriptPlain;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      } catch {}
    };

    return (
      <div className={styles.modalOverlay} onClick={handleCloseModal}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div className={styles.modalHeaderSimple}>
            <div className={styles.modalHeaderContent}>
              <div className={styles.modalHeaderInfo}>
                <div className={styles.modalMetaRow}>
                  <span className={styles.modalMetaText}>
                    {dayLabel} · {timeLabel}
                  </span>
                  <span className={styles.modalMetaDot} />
                  <span className={styles.modalMetaText}>{dateLabel}</span>
                </div>
                <div className={styles.modalTitleRow}>
                  <Video className={styles.modalTitleIcon} />
                  <div className={styles.modalTitle}>{title}</div>
                </div>
              </div>
              <div className={styles.modalHeaderActions}>
                <span className={`${styles.statusBadge} ${statusMeta.className}`}>{statusMeta.label}</span>
              </div>
            </div>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.modalSection}>
              <div className={styles.sectionTitlePrimary}>Guión</div>
              <div className={styles.scriptContainer}>
                <div className={styles.scriptStack}>
                  {scriptScenes.map((_, idx) => {
                    const lines = getSceneLines(idx);
                    const hasAny = lines.length > 0 || (idx === 0 && Boolean(hookText));
                    if (!hasAny) return null;

                    const isLast = idx === scriptScenes.length - 1;
                    return (
                      <div key={idx}>
                        {idx > 0 && <div className={styles.scriptDivider} />}
                        {isLast ? (
                          <div className={styles.sceneTitleRow}>
                            <div className={styles.sceneTitle}>Escena {idx + 1}</div>
                            <span className={styles.sceneCtaBadge}>cta</span>
                          </div>
                        ) : (
                          <div className={styles.sceneTitle}>Escena {idx + 1}</div>
                        )}
                        <div className={styles.sceneBody}>
                          {idx === 0 && hookText && (
                            <div className={styles.hookHighlight}>
                              <div className={styles.hookLabel}>Hook</div>
                              <div className={styles.hookText}>{hookText}</div>
                            </div>
                          )}
                          {lines.map((line, lineIdx) => (
                            <div key={lineIdx} className={styles.bulletRow}>
                              <div className={styles.bulletDash}>—</div>
                              <div className={styles.bulletText}>{line}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {Array.isArray(selectedContent.blueprint?.scenes) && selectedContent.blueprint.scenes.length > 0 && (
              <div className={styles.modalSection}>
                <div className={styles.sectionTitlePrimary}>Escenas</div>
                <div className={styles.sceneCardsStack}>
                  {selectedContent.blueprint.scenes.map((scene, idx) => {
                    const cameraLabel = getCameraLabel(scene);
                    const shotLabel = getShotLabel(scene);
                    const overlayChips = getOverlayChips(scene);

                    const actionText = typeof (scene as any)?.action === "string" ? (scene as any).action : "";
                    const instructionText =
                      typeof (scene as any)?.instruction === "string" ? (scene as any).instruction : "";

                    return (
                      <div key={idx} className={styles.sceneCard}>
                        <div className={styles.sceneCardHeader}>
                          <div className={styles.sceneCardTitle}>Escena {idx + 1}</div>
                          <div className={styles.sceneCardChips}>
                            {cameraLabel && <span className={styles.sceneChip}>{cameraLabel}</span>}
                            {shotLabel && <span className={styles.sceneChip}>{shotLabel}</span>}
                          </div>
                        </div>
                        <div className={styles.sceneCardBody}>
                          {actionText.trim().length > 0 && (
                            <div>
                              <div className={styles.sceneFieldLabel}>Acción</div>
                              <div className={styles.sceneFieldValue}>{actionText}</div>
                            </div>
                          )}
                          {instructionText.trim().length > 0 && (
                            <div>
                              <div className={styles.sceneFieldLabel}>Instrucción de grabación</div>
                              <div className={styles.sceneFieldValueSecondary}>{instructionText}</div>
                            </div>
                          )}
                          {overlayChips.length > 0 && (
                            <div>
                              <div className={styles.sceneFieldLabel}>Overlays</div>
                              <div className={styles.overlayChips}>
                                {overlayChips.map((c, overlayIdx) => (
                                  <span key={overlayIdx} className={styles.overlayChip}>
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(selectedContent.blueprint.sound || "").trim().length > 0 && (
              <div className={styles.modalSection}>
                <div className={styles.soundRow}>
                  <Volume2 className={styles.soundIcon} />
                  <div>
                    <div className={styles.soundLabel}>Sonido</div>
                    <div className={styles.soundValue}>{selectedContent.blueprint.sound}</div>
                  </div>
                </div>
              </div>
            )}

            {(selectedContent.caption ?? "").trim().length > 0 && (
              <div className={styles.modalSection}>
                <div className={styles.sectionTitle}>Caption</div>
                <div className={styles.sectionBodyText}>{selectedContent.caption}</div>
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type='button' className={styles.footerButton} onClick={handleCopyScript} disabled={!scriptPlain}>
              Copiar guión
            </button>
            <button type='button' className={styles.footerButtonPrimary} onClick={handleToggleCompleted}>
              {selectedContent.status === ContentStatus.READY ? "Marcar pendiente" : "Marcar listo"}
            </button>
          </div>
        </div>
      </div>
    );
  }, [selectedContent, handleMarkAsCompleted, dispatch, dict]);

  /**
   * Componente para renderizar una tarjeta de contenido individual
   * @param item - Item de contenido a renderizar
   * @returns JSX de la tarjeta de contenido
   */
  const renderContentItem = useCallback((item: ContentPieceWithDate) => {
    const colors = TIME_PERIOD_COLORS[item.dayTime as unknown as keyof typeof TIME_PERIOD_COLORS];

    const handleItemClick = () => setSelectedContent(item);

    const title = item.title ?? "Sin titulo";
    const platformLabel = String((item.platform ?? Platform.TIKTOK) || Platform.TIKTOK).toUpperCase();

    return (
      <div key={item.id} className={`${styles.contentItem} ${styles[colors.bg]}`} onClick={handleItemClick}>
        <div className={styles.contentItemHeader}>
          <div className={styles.contentItemTitle}>
            <Video className='h-3 w-3' />
            <div className={styles.contentItemTitleText}>{truncateText(title)}</div>
          </div>
          {item.status === ContentStatus.READY && <CheckCircle className='h-3 w-3 text-green-600' />}
        </div>

        <div className={styles.contentItemPillar}>{platformLabel}</div>
      </div>
    );
  }, []);

  /**
   * Componente para renderizar una sección de período de tiempo
   * @param dayContent - Contenido agrupado por horario del día
   * @param timePeriod - Período de tiempo (morning, afternoon, evening)
   * @returns JSX de la sección de período de tiempo
   */
  const renderTimePeriod = useCallback(
    (dayContent: Record<string, ContentPieceWithDate[]>, timePeriod: keyof typeof TIME_PERIOD_COLORS) => {
      const items = dayContent[timePeriod] || [];
      const colors = TIME_PERIOD_COLORS[timePeriod];

      if (items.length === 0) {
        return (
          <div className={`${styles.emptyTimePeriod} ${styles[colors.empty]}`}>
            <div className={styles.emptyText}>{dict("calendar.content.no_content")}</div>
          </div>
        );
      }

      return <div className={styles.timePeriodContainer}>{items.map(renderContentItem)}</div>;
    },
    [renderContentItem, dict],
  );

  return (
    <div className={styles.contentCalendar}>
      {/* Modal y banners de error */}
      {renderContentModal()}
      {hasError && (
        <div className={styles.errorBanner}>
          <div className={styles.errorMessage}>
            {errorMessage} {dict("calendar.error.banner")}
          </div>
        </div>
      )}

      {/* Tarjetas de leyenda de colores y perfil */}
      <div className={styles.cardsGrid}>
        {/* Social Profile UI (conexión/validación) temporalmente deshabilitable */}
        {!disableSocialProfile && (
          <div className={styles.profileCard}>
            <div className={styles.profileCardHeader}>
              <h3 className={styles.profileCardTitle}>{dict("calendar.profile_card.title")}</h3>
            </div>
            <div className={styles.profileCardContent}>
              {profile ? (
                <div className={styles.profileContainer}>
                  <div className={styles.profileImageContainer}>
                    <img src={profile.avatar} alt={profile.username} className={styles.profileImage} />
                    <div className={styles.profileImageOverlay}>
                      <div className={styles.profileImageBadge}>{profile.socialMedia.charAt(0).toUpperCase()}</div>
                    </div>
                  </div>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileHeader}>
                      <div className={styles.profileUsername}>@{profile.username}</div>
                      <div className={styles.profilePlatformBadge}>{profile.socialMedia.toUpperCase()}</div>
                    </div>
                    <div className={styles.profileBio}>{profile.bio}</div>
                  </div>
                </div>
              ) : (
                <div className={styles.noProfile}>
                  <div className={styles.noProfileIcon}>
                    <svg className={styles.noProfileIconSvg} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                  </div>
                  <div className={styles.noProfileContent}>
                    <div className={styles.noProfileTitle}>{dict("calendar.profile_card.no_profile")}</div>
                    <div className={styles.noProfileSubtitle}>{dict("calendar.profile_card.connect_subtitle")}</div>
                    <button className={styles.connectButton}>
                      <span>{dict("calendar.profile_card.connect_button")}</span>
                      <svg className={styles.connectButtonIcon} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 7l5 5m0 0l-5 5m5-5H6'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leyenda de colores */}
        <div className={styles.legendCard}>
          <div className={styles.legendCardHeader}>
            <h3 className={styles.legendCardTitle}>
              <svg className={styles.legendCardIcon} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                />
              </svg>
              {dict("calendar.legend_card.title")}
            </h3>
          </div>
          <div className={styles.legendCardContent}>
            <div className={styles.colorLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.morningDot}`}></div>
                <div className={styles.legendInfo}>
                  <span className={styles.legendText}>{dict("calendar.legend_card.morning")}</span>
                  <span className={styles.legendTime}>{dict("calendar.legend_card.morning_time")}</span>
                </div>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.afternoonDot}`}></div>
                <div className={styles.legendInfo}>
                  <span className={styles.legendText}>{dict("calendar.legend_card.afternoon")}</span>
                  <span className={styles.legendTime}>{dict("calendar.legend_card.afternoon_time")}</span>
                </div>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.eveningDot}`}></div>
                <div className={styles.legendInfo}>
                  <span className={styles.legendText}>{dict("calendar.legend_card.evening")}</span>
                  <span className={styles.legendTime}>{dict("calendar.legend_card.evening_time")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid del calendario */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <h2 className={styles.calendarTitle}>{dict("calendar.title")}</h2>

            {/* Navegación de semanas */}
            <div className={styles.weekNavigation}>
              <div className={styles.weekControls}>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={goToPreviousWeek}
                  className='h-8 w-8 p-0'
                  title={dict("calendar.navigation.previous_week")}
                  disabled={isLoadingContent}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>

                <div className={styles.weekInfo}>
                  <div className={styles.weekRange}>{getWeekRangeText()}</div>
                  <div className={styles.weekStatus}>
                    {isCurrentWeek()
                      ? dict("calendar.navigation.current_week")
                      : currentWeekOffset > 0
                        ? `+${currentWeekOffset} ${dict("calendar.navigation.week")}${currentWeekOffset > 1 ? "s" : ""}`
                        : `${currentWeekOffset} ${dict("calendar.navigation.week")}${currentWeekOffset < -1 ? "s" : ""}`}
                  </div>
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={goToNextWeek}
                  className='h-8 w-8 p-0'
                  title={dict("calendar.navigation.next_week")}
                  disabled={isLoadingContent}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>

              {!isCurrentWeek() && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={goToCurrentWeek}
                  className={styles.todayButton}
                  disabled={isLoadingContent}
                >
                  {dict("calendar.navigation.today")}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className={styles.calendarWrapper}>
            <div className={styles.calendarScroll}>
              <div className={styles.calendarGrid}>
                {weekDates.map((date, index) => {
                  const dateKey = date.toDateString();
                  const dayContent = groupContentByDay[dateKey] || { morning: [], afternoon: [], evening: [] };
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div key={dateKey} className={`${styles.dayColumn} ${index === 6 ? styles.lastColumn : ""}`}>
                      <div className={`${styles.dayHeader} ${isToday ? styles.todayHeader : ""}`}>
                        <div className={styles.dayName}>{DAYS_OF_WEEK[index]}</div>
                        <div className={`${styles.dayDate} ${isToday ? styles.todayDate : ""}`}>
                          {date.getDate()}/{date.getMonth() + 1}
                        </div>
                      </div>
                      <div className={styles.dayContent}>
                        <div className={styles.timePeriodSection}>
                          <h5>
                            <div className={`${styles.timePeriodDot} ${styles.morningTimeDot}`}></div>
                            <div>{dict("calendar.time_periods.morning")}</div>
                          </h5>
                          {renderTimePeriod(dayContent, "morning")}
                        </div>
                        <div className={styles.timePeriodSection}>
                          <h5>
                            <div className={`${styles.timePeriodDot} ${styles.afternoonTimeDot}`}></div>
                            <div>{dict("calendar.time_periods.afternoon")}</div>
                          </h5>
                          {renderTimePeriod(dayContent, "afternoon")}
                        </div>
                        <div className={styles.timePeriodSection}>
                          <h5>
                            <div className={`${styles.timePeriodDot} ${styles.eveningTimeDot}`}></div>
                            <div>{dict("calendar.time_periods.evening")}</div>
                          </h5>
                          {renderTimePeriod(dayContent, "evening")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {isLoadingContent && (
              <div className={styles.calendarLoadingOverlay}>
                <div className={styles.calendarLoadingContent}>
                  <LoadingSpinner size='medium' />
                  <p className={styles.calendarLoadingText}>Cargando contenido del calendario...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
