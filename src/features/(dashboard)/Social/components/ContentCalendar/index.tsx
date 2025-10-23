"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ContentItem } from "../../types";
import styles from "./style.module.scss";

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
const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

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
                    <div className='capitalize'>{selectedContent.dayTime}</div>
                    {selectedContent.completed && (
                      <>
                        <div>•</div>
                        <CheckCircle className='h-3 w-3 text-green-600' />
                        <div>Completado</div>
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
                <h4>Información Básica</h4>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <Target className='h-4 w-4 text-gray-500' />
                    <div className={styles.infoLabel}>Pilar:</div>
                    <Badge variant='secondary'>{selectedContent.pillar}</Badge>
                  </div>
                  <div className={styles.infoItem}>
                    <Play className='h-4 w-4 text-gray-500' />
                    <div className={styles.infoLabel}>Tipo:</div>
                    <div>{selectedContent.publishType}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Red Social:</div>
                    <Badge variant='outline'>{selectedContent.socialMedia.toUpperCase()}</Badge>
                  </div>
                </div>
              </div>
              <div className={styles.infoSection}>
                <h4>Estado</h4>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    {selectedContent.completed ? (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <div className={styles.statusCompleted}>Completado</div>
                      </>
                    ) : (
                      <>
                        <Clock className='h-4 w-4 text-orange-600' />
                        <div className={styles.statusPending}>Pendiente</div>
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
                      {selectedContent.completed ? "Marcar como Pendiente" : "Marcar como Completado"}
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
                  <div>Hook</div>
                </h4>
                <div className={styles.contentBox}>{selectedContent.content.hook}</div>
              </div>
            )}

            {/* Script */}
            {selectedContent.content.script && (
              <div className={styles.contentSection}>
                <h4>Guión</h4>
                <div className={`${styles.contentBox} ${styles.scriptBox}`}>{selectedContent.content.script}</div>
              </div>
            )}

            {/* Copy */}
            <div className={styles.contentSection}>
              <h4>
                <MessageSquare className='h-4 w-4' />
                <div>Copy</div>
              </h4>
              <div className={styles.contentBox}>{selectedContent.content.copy}</div>
            </div>

            {/* Hashtags */}
            {selectedContent.content.hashtags && (
              <div className={styles.contentSection}>
                <h4>
                  <Hash className='h-4 w-4' />
                  <div>Hashtags</div>
                </h4>
                <div className={`${styles.contentBox} ${styles.hashtagsBox}`}>{selectedContent.content.hashtags}</div>
              </div>
            )}

            {/* CTA */}
            {selectedContent.content.cta_copy && (
              <div className={styles.contentSection}>
                <h4>Call to Action</h4>
                <div className={`${styles.contentBox} ${styles.ctaBox}`}>{selectedContent.content.cta_copy}</div>
              </div>
            )}

            {/* Additional Fields */}
            <div className={styles.basicInfoGrid}>
              {selectedContent.content.feelings && (
                <div className={styles.contentSection}>
                  <h4>
                    <Heart className='h-4 w-4' />
                    <div>Sentimientos</div>
                  </h4>
                  <Badge variant='outline'>{selectedContent.content.feelings}</Badge>
                </div>
              )}
              {selectedContent.content.understanding && (
                <div className={styles.contentSection}>
                  <h4>
                    <Brain className='h-4 w-4' />
                    <div>Comprensión</div>
                  </h4>
                  <Badge variant='outline'>{selectedContent.content.understanding}</Badge>
                </div>
              )}
            </div>

            {selectedContent.content.key_words_copy && (
              <div className={styles.contentSection}>
                <h4>Palabras Clave</h4>
                <div className={`${styles.contentBox} ${styles.keywordsBox}`}>
                  {selectedContent.content.key_words_copy}
                </div>
              </div>
            )}

            {selectedContent.content.make && (
              <div className={styles.contentSection}>
                <h4>Tipo de Contenido</h4>
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
            <div className={styles.emptyText}>Sin contenido</div>
          </div>
        );
      }

      return <div className={styles.timePeriodContainer}>{items.map(renderContentItem)}</div>;
    },
    [renderContentItem],
  );

  // Mostrar loading si está cargando contenido
  if (isLoadingContent) {
    return (
      <div className={styles.contentCalendar}>
        <Card>
          <CardContent className='flex items-center justify-center p-8'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
              <p>Cargando calendario...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.contentCalendar}>
      {/* Modal de detalles */}
      {renderContentModal()}

      {/* Mensaje de error si existe */}
      {hasError && (
        <div className={styles.errorBanner}>
          <div className={styles.errorMessage}>{errorMessage} - Mostrando datos disponibles</div>
        </div>
      )}

      {/* Tarjetas de leyenda de colores y perfil */}
      <div className={styles.cardsGrid}>
        {/* Leyenda de colores */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>Esquema de Colores - Horarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.colorLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.morningDot}`}></div>
                <div className={styles.legendText}>Mañana (6:00 - 12:00)</div>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.afternoonDot}`}></div>
                <div className={styles.legendText}>Tarde (12:00 - 18:00)</div>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.eveningDot}`}></div>
                <div className={styles.legendText}>Noche (18:00 - 24:00)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de perfil */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>Perfil Conectado</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className={styles.profileContainer}>
                <div className={styles.profileImageContainer}>
                  <img src={profile.avatar} alt={profile.username} className={styles.profileImage} />
                </div>
                <div className={styles.profileInfo}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profileUsername}>@{profile.username}</div>
                    <Badge variant='secondary' className={styles.profileBadge}>
                      {profile.socialMedia.toUpperCase()}
                    </Badge>
                  </div>
                  <div className={styles.profileBio}>{profile.bio}</div>
                  {profile.connected && (
                    <Badge variant='outline' className='mt-2 text-green-600 border-green-600'>
                      ✓ Conectado
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.noProfile}>
                <div className={styles.noProfileContent}>
                  <div className={styles.noProfileTitle}>No hay perfil conectado</div>
                  <div className={styles.noProfileSubtitle}>Conecta tu cuenta de TikTok</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid del calendario */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Calendario de Contenido Semanal</CardTitle>

            {/* Navegación de semanas */}
            <div className={styles.weekNavigation}>
              <div className={styles.weekControls}>
                <Button variant='outline' size='sm' onClick={goToPreviousWeek} className='h-8 w-8 p-0'>
                  <ChevronLeft className='h-4 w-4' />
                </Button>

                <div className={styles.weekInfo}>
                  <div className={styles.weekRange}>{getWeekRangeText()}</div>
                  <div className={styles.weekStatus}>
                    {isCurrentWeek()
                      ? "Semana actual"
                      : currentWeekOffset > 0
                        ? `+${currentWeekOffset} semana${currentWeekOffset > 1 ? "s" : ""}`
                        : `${currentWeekOffset} semana${currentWeekOffset < -1 ? "s" : ""}`}
                  </div>
                </div>

                <Button variant='outline' size='sm' onClick={goToNextWeek} className='h-8 w-8 p-0'>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>

              {!isCurrentWeek() && (
                <Button variant='outline' size='sm' onClick={goToCurrentWeek} className={styles.todayButton}>
                  Hoy
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className={styles.calendarGrid}>
            {weekDates.map((date, index) => {
              const dateKey = date.toDateString();
              const dayContent = groupContentByDay[dateKey] || { morning: [], afternoon: [], evening: [] };
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div key={dateKey} className={`${styles.dayColumn} ${index === 6 ? styles.lastColumn : ""}`}>
                  {/* Encabezado del día */}
                  <div className={`${styles.dayHeader} ${isToday ? styles.todayHeader : ""}`}>
                    <div className={styles.dayName}>{DAYS_OF_WEEK[index]}</div>
                    <div className={`${styles.dayDate} ${isToday ? styles.todayDate : ""}`}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </div>
                  </div>

                  {/* Secciones de contenido */}
                  <div className={styles.dayContent}>
                    {/* Mañana */}
                    <div className={styles.timePeriodSection}>
                      <h5>
                        <div className={`${styles.timePeriodDot} ${styles.morningTimeDot}`}></div>
                        <div>Mañana</div>
                      </h5>
                      {renderTimePeriod(dayContent, "morning")}
                    </div>

                    {/* Tarde */}
                    <div className={styles.timePeriodSection}>
                      <h5>
                        <div className={`${styles.timePeriodDot} ${styles.afternoonTimeDot}`}></div>
                        <div>Tarde</div>
                      </h5>
                      {renderTimePeriod(dayContent, "afternoon")}
                    </div>

                    {/* Noche */}
                    <div className={styles.timePeriodSection}>
                      <h5>
                        <div className={`${styles.timePeriodDot} ${styles.eveningTimeDot}`}></div>
                        <div>Noche</div>
                      </h5>
                      {renderTimePeriod(dayContent, "evening")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
