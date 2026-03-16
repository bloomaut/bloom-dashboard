"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle,
  Clock,
  Video,
  X,
  Calendar,
  Hash,
  Target,
  MessageSquare,
  Lightbulb,
  Heart,
  Brain,
  Play,
  ChevronLeft,
  ChevronRight,
  FileText,
  Settings,
} from "lucide-react";
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
} from "../../store/socialMediaSlice";
import { isSocialProfileDisabled } from "@/utils/featureFlags";
import { ContentItem } from "../../types";
import styles from "./style.module.scss";
import { Badge } from "@/components/ui/badge";
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

/**
 * Tipo para ContentItem con day como Date
 */
type ContentItemWithDateDay = Omit<ContentItem, "day"> & { day: Date };

/**
 * Convierte un ContentItem para uso en el calendario
 * @param item - ContentItem original
 * @returns ContentItem con formato compatible
 */
const convertContentItemForCalendar = (item: ContentItem): ContentItemWithDateDay => {
  return {
    ...item,
    day: new Date(item.day), // Convertir string ISO a Date
    socialMedia: item.socialMedia as "tiktok",
    publishType: item.publishType as "Video",
    content: {
      ...item.content,
      script: item.content.script || "", // Asegurar que script no sea null
    },
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
  const [selectedContent, setSelectedContent] = useState<ContentItemWithDateDay | null>(null);

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
    return content.map(convertContentItemForCalendar);
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
    const grouped: Record<string, Record<string, ContentItemWithDateDay[]>> = {};

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
      const dateKey = item.day.toDateString();
      if (grouped[dateKey]) {
        grouped[dateKey][item.dayTime].push(item);
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

    const colors = TIME_PERIOD_COLORS[selectedContent.dayTime];

    const handleCloseModal = () => setSelectedContent(null);

    const handleToggleCompleted = () => {
      if (selectedContent._id) {
        handleMarkAsCompleted(selectedContent._id);
        // Actualizar el estado local del modal
        setSelectedContent(prev => (prev ? { ...prev, completed: !prev.completed } : null));
      }
    };

    return (
      <div className={styles.modalOverlay} onClick={handleCloseModal}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className={`${styles.modalHeader} ${styles[colors.header]}`}>
            <div className={styles.modalHeaderContent}>
              <div className={styles.modalHeaderInfo}>
                <Video className='h-5 w-5' />
                <div>
                  <div className={styles.modalTitle}>{selectedContent.content.title}</div>
                  <div className={styles.modalSubtitle}>
                    <Calendar className='h-3 w-3' />
                    <div>{selectedContent.day.toLocaleDateString("es-ES")}</div>
                    <div>•</div>
                    <div className='capitalize'>{dict(`calendar.time_periods.${selectedContent.dayTime}`)}</div>
                    {selectedContent.completed && (
                      <>
                        <div>•</div>
                        <CheckCircle className='h-3 w-3 text-green-600' />
                        <div>{dict("calendar.content.completed")}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={handleCloseModal} className={styles.closeButton}>
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={styles.modalBody}>
            {/* Basic Info */}
            <div className={styles.basicInfoGrid}>
              <div className={styles.infoSection}>
                <h4>{dict("calendar.modal.basic_info")}</h4>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <Target className='h-4 w-4 text-gray-500' />
                    <div className={styles.infoLabel}>{dict("calendar.modal.pillar")}:</div>
                    <Badge variant='secondary'>{selectedContent.pillar}</Badge>
                  </div>
                  <div className={styles.infoItem}>
                    <Play className='h-4 w-4 text-gray-500' />
                    <div className={styles.infoLabel}>{dict("calendar.modal.type")}:</div>
                    <div>{selectedContent.publishType}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>{dict("calendar.modal.social_media")}:</div>
                    <Badge variant='outline'>{selectedContent.socialMedia.toUpperCase()}</Badge>
                  </div>
                </div>
              </div>
              <div className={styles.infoSection}>
                <h4>{dict("calendar.modal.status")}</h4>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    {selectedContent.completed ? (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <div className={styles.statusCompleted}>{dict("calendar.content.completed")}</div>
                      </>
                    ) : (
                      <>
                        <Clock className='h-4 w-4 text-orange-600' />
                        <div className={styles.statusPending}>{dict("calendar.content.pending")}</div>
                      </>
                    )}
                  </div>
                  {/* Botón para marcar como completado */}
                  {selectedContent._id && (
                    <Button
                      variant={selectedContent.completed ? "outline" : "default"}
                      size='sm'
                      onClick={handleToggleCompleted}
                      className='mt-2'
                    >
                      {selectedContent.completed
                        ? dict("calendar.modal.mark_pending")
                        : dict("calendar.modal.mark_completed")}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Hook */}
            {selectedContent.content.hook && (
              <div className={styles.contentSection}>
                <h4>
                  <Lightbulb className='h-4 w-4' />
                  <div>{dict("calendar.modal.hook")}</div>
                </h4>
                <div className={styles.contentBox}>{selectedContent.content.hook}</div>
              </div>
            )}

            {/* Body */}
            {selectedContent.content.body && (
              <div className={styles.contentSection}>
                <h4>
                  <FileText className='h-4 w-4' />
                  <div>{dict("calendar.modal.body")}</div>
                </h4>
                <div className={styles.contentBox}>{selectedContent.content.body}</div>
              </div>
            )}

            {/* Making */}
            {selectedContent.content.making && (
              <div className={styles.contentSection}>
                <h4>
                  <Settings className='h-4 w-4' />
                  <div>{dict("calendar.modal.making")}</div>
                </h4>
                <div className={styles.contentBox}>{selectedContent.content.making}</div>
              </div>
            )}

            {/* Script */}
            {selectedContent.content.script && (
              <div className={styles.contentSection}>
                <h4>{dict("calendar.modal.script")}</h4>
                <div className={`${styles.contentBox} ${styles.scriptBox}`}>{selectedContent.content.script}</div>
              </div>
            )}

            {/* Copy */}
            <div className={styles.contentSection}>
              <h4>
                <MessageSquare className='h-4 w-4' />
                <div>{dict("calendar.modal.copy")}</div>
              </h4>
              <div className={styles.contentBox}>{selectedContent.content.copy}</div>
            </div>

            {/* Hashtags */}
            {selectedContent.content.hashtags && (
              <div className={styles.contentSection}>
                <h4>
                  <Hash className='h-4 w-4' />
                  <div>{dict("calendar.modal.hashtags")}</div>
                </h4>
                <div className={`${styles.contentBox} ${styles.hashtagsBox}`}>{selectedContent.content.hashtags}</div>
              </div>
            )}

            {/* CTA */}
            {selectedContent.content.cta_copy && (
              <div className={styles.contentSection}>
                <h4>{dict("calendar.modal.cta")}</h4>
                <div className={`${styles.contentBox} ${styles.ctaBox}`}>{selectedContent.content.cta_copy}</div>
              </div>
            )}

            {/* Additional Fields */}
            <div className={styles.basicInfoGrid}>
              {selectedContent.content.feelings && (
                <div className={styles.contentSection}>
                  <h4>
                    <Heart className='h-4 w-4' />
                    <div>{dict("calendar.modal.feelings")}</div>
                  </h4>
                  <Badge variant='outline'>{selectedContent.content.feelings}</Badge>
                </div>
              )}
              {selectedContent.content.understanding && (
                <div className={styles.contentSection}>
                  <h4>
                    <Brain className='h-4 w-4' />
                    <div>{dict("calendar.modal.understanding")}</div>
                  </h4>
                  <Badge variant='outline'>{selectedContent.content.understanding}</Badge>
                </div>
              )}
            </div>

            {selectedContent.content.key_words_copy && (
              <div className={styles.contentSection}>
                <h4>{dict("calendar.modal.keywords")}</h4>
                <div className={`${styles.contentBox} ${styles.keywordsBox}`}>
                  {selectedContent.content.key_words_copy}
                </div>
              </div>
            )}

            {selectedContent.content.make && (
              <div className={styles.contentSection}>
                <h4>{dict("calendar.modal.content_type")}</h4>
                <Badge variant='secondary'>{selectedContent.content.make}</Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [selectedContent, handleMarkAsCompleted]);

  /**
   * Componente para renderizar una tarjeta de contenido individual
   * @param item - Item de contenido a renderizar
   * @returns JSX de la tarjeta de contenido
   */
  const renderContentItem = useCallback((item: ContentItemWithDateDay) => {
    const colors = TIME_PERIOD_COLORS[item.dayTime];

    const handleItemClick = () => setSelectedContent(item);

    return (
      <div key={item._id} className={`${styles.contentItem} ${styles[colors.bg]}`} onClick={handleItemClick}>
        <div className={styles.contentItemHeader}>
          <div className={styles.contentItemTitle}>
            <Video className='h-3 w-3' />
            <div className={styles.contentItemTitleText}>{truncateText(item.content.title)}</div>
          </div>
          {item.completed && <CheckCircle className='h-3 w-3 text-green-600' />}
        </div>

        <div className={styles.contentItemPillar}>{item.pillar}</div>

        <div className={styles.contentItemDescription}>
          {item.content.hook ? truncateText(item.content.hook, 50) : truncateText(item.content.script || "", 50)}
        </div>
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
    (dayContent: Record<string, ContentItemWithDateDay[]>, timePeriod: keyof typeof TIME_PERIOD_COLORS) => {
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
    [renderContentItem],
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
          {isLoadingContent ? (
            <div className={styles.calendarLoadingContainer}>
              <div className={styles.calendarLoadingContent}>
                <LoadingSpinner size='medium' />
                <p className={styles.calendarLoadingText}>Cargando contenido del calendario...</p>
              </div>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
