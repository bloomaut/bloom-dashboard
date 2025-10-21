"use client";

import { useState } from "react";
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
import styles from "./style.module.scss";

// Type definitions
interface ContentItem {
  clientId: string;
  socialMedia: "tiktok"; // Enum (tiktok)
  publishType: "Video"; // Enum (Video)
  pillar: string;
  day: Date;
  dayTime: "morning" | "afternoon" | "evening"; // Enum
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

interface ProfileData {
  _id: string;
  clientId: string;
  username: string;
  bio: string;
  avatar: string;
  socialMedia: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentCalendarProps {
  contentItems: ContentItem[];
  profileData?: ProfileData | null;
}

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

// Days of the week in divish
const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Helper function to truncate text to 20 characters
const truncateText = (text: string, maxLength: number = 23): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export function ContentCalendar({ contentItems, profileData }: ContentCalendarProps) {
  console.log("PROFILEDATA: ", profileData);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = semana actual, -1 = semana anterior, 1 = semana siguiente

  // Get week dates based on offset
  const getWeekDates = (weekOffset: number = 0) => {
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
  };

  const weekDates = getWeekDates(currentWeekOffset);

  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  // Get week range text
  const getWeekRangeText = () => {
    const startDate = weekDates[0];
    const endDate = weekDates[6];

    const formatDate = (date: Date) => {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  };

  // Check if it's current week
  const isCurrentWeek = () => {
    return currentWeekOffset === 0;
  };

  // Group content by day and time
  const groupContentByDay = () => {
    const grouped: Record<string, Record<string, ContentItem[]>> = {};

    weekDates.forEach(date => {
      const dateKey = date.toDateString();
      grouped[dateKey] = {
        morning: [],
        afternoon: [],
        evening: [],
      };
    });

    contentItems.forEach(item => {
      const dateKey = item.day.toDateString();
      if (grouped[dateKey]) {
        grouped[dateKey][item.dayTime].push(item);
      }
    });

    return grouped;
  };

  const groupedContent = groupContentByDay();

  // Render content tooltip
  const renderContentTooltip = () => {
    if (!selectedContent) return null;

    const colors = TIME_PERIOD_COLORS[selectedContent.dayTime];

    return (
      <div className={styles.modalOverlay} onClick={() => setSelectedContent(null)}>
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
              <button onClick={() => setSelectedContent(null)} className={styles.closeButton}>
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
            <div className={styles.contentSection}>
              <h4>Guión</h4>
              <div className={`${styles.contentBox} ${styles.scriptBox}`}>{selectedContent.content.script}</div>
            </div>

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
  };

  // Render content item card
  const renderContentItem = (item: ContentItem) => {
    const colors = TIME_PERIOD_COLORS[item.dayTime];

    return (
      <div
        key={`${item.clientId}-${item.skinxId}-${item.presetId}`}
        className={`${styles.contentItem} ${styles[colors.bg]}`}
        onClick={() => setSelectedContent(item)}
      >
        <div className={styles.contentItemHeader}>
          <div className={styles.contentItemTitle}>
            <Video className='h-3 w-3' />
            <div className={styles.contentItemTitleText}>{truncateText(item.content.title)}</div>
          </div>
          {item.completed && <CheckCircle className='h-3 w-3 text-green-600' />}
        </div>

        <div className={styles.contentItemPillar}>{item.pillar}</div>

        {item.content.hook ? (
          <div className={styles.contentItemDescription}>{item.content.hook}</div>
        ) : (
          <div className={styles.contentItemDescription}>{item.content.script}</div>
        )}
      </div>
    );
  };

  // Render time period section
  const renderTimePeriod = (dayContent: Record<string, ContentItem[]>, timePeriod: keyof typeof TIME_PERIOD_COLORS) => {
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
  };

  return (
    <div className={styles.contentCalendar}>
      {/* Tooltip */}
      {renderContentTooltip()}

      {/* Color Legend and Profile Cards */}
      <div className={styles.cardsGrid}>
        {/* Color Legend */}
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

        {/* Profile Card */}
        <Card>
          <CardHeader className='pb-3'></CardHeader>
          <CardContent>
            {profileData ? (
              <div className={styles.profileContainer}>
                <div className={styles.profileImageContainer}>
                  <img src={profileData.avatar} alt={profileData.username} className={styles.profileImage} />
                </div>
                <div className={styles.profileInfo}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profileUsername}>@{profileData.username}</div>
                    <Badge variant='secondary' className={styles.profileBadge}>
                      {profileData.socialMedia.toUpperCase()}
                    </Badge>
                  </div>
                  <div className={styles.profileBio}>{profileData.bio}</div>
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

      {/* Calendar Grid */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Calendario de Contenido Semanal</CardTitle>

            {/* Week Navigation */}
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
              const dayContent = groupedContent[dateKey] || { morning: [], afternoon: [], evening: [] };
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div key={dateKey} className={`${styles.dayColumn} ${index === 6 ? styles.lastColumn : ""}`}>
                  {/* Day Header */}
                  <div className={`${styles.dayHeader} ${isToday ? styles.todayHeader : ""}`}>
                    <div className={styles.dayName}>{DAYS_OF_WEEK[index]}</div>
                    <div className={`${styles.dayDate} ${isToday ? styles.todayDate : ""}`}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className={styles.dayContent}>
                    {/* Morning */}
                    <div className={styles.timePeriodSection}>
                      <h5>
                        <div className={`${styles.timePeriodDot} ${styles.morningTimeDot}`}></div>
                        <div>Mañana</div>
                      </h5>
                      {renderTimePeriod(dayContent, "morning")}
                    </div>

                    {/* Afternoon */}
                    <div className={styles.timePeriodSection}>
                      <h5>
                        <div className={`${styles.timePeriodDot} ${styles.afternoonTimeDot}`}></div>
                        <div>Tarde</div>
                      </h5>
                      {renderTimePeriod(dayContent, "afternoon")}
                    </div>

                    {/* Evening */}
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
}
