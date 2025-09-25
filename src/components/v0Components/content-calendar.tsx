"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

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
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    text: "text-yellow-800",
    dot: "bg-yellow-500",
  },
  afternoon: {
    bg: "bg-red-100",
    border: "border-red-300",
    text: "text-red-800",
    dot: "bg-red-500",
  },
  evening: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
} as const;

// Days of the week in divish
const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function ContentCalendar({ contentItems, profileData }: ContentCalendarProps) {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // Get current week's dates
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay); // Go to Sunday

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();

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
      <div 
        className='fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50 p-4'
        onClick={() => setSelectedContent(null)}
      >
        <div 
          className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-4 ${colors.bg} ${colors.border} border-b`}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <Video className='h-5 w-5' />
                <div>
                  <div className='text-lg font-semibold'>{selectedContent.content.title}</div>
                  <div className='flex items-center space-x-2 text-sm opacity-75'>
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
              <button
                onClick={() => setSelectedContent(null)}
                className='p-1 hover:bg-gray-200 rounded-full transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='p-6 space-y-6'>
            {/* Basic Info */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='font-medium text-gray-700 mb-2'>Información Básica</div>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <Target className='h-4 w-4 text-gray-500' />
                    <div className='text-gray-600'>Pilar:</div>
                    <Badge variant='secondary'>{selectedContent.pillar}</Badge>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Play className='h-4 w-4 text-gray-500' />
                    <div className='text-gray-600'>Tipo:</div>
                    <div>{selectedContent.publishType}</div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='text-gray-600'>Red Social:</div>
                    <Badge variant='outline'>{selectedContent.socialMedia.toUpperCase()}</Badge>
                  </div>
                </div>
              </div>
              <div>
                <div className='font-medium text-gray-700 mb-2'>Estado</div>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center space-x-2'>
                    {selectedContent.completed ? (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <div className='text-green-600 font-medium'>Completado</div>
                      </>
                    ) : (
                      <>
                        <Clock className='h-4 w-4 text-orange-600' />
                        <div className='text-orange-600 font-medium'>Pendiente</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hook */}
            {selectedContent.content.hook && (
              <div>
                <div className='font-medium text-gray-700 mb-2 flex items-center space-x-2'>
                  <Lightbulb className='h-4 w-4' />
                  <div>Hook</div>
                </div>
                <div className='bg-gray-50 p-3 rounded-lg text-sm'>{selectedContent.content.hook}</div>
              </div>
            )}

            {/* Script */}
            <div>
              <div className='font-medium text-gray-700 mb-2'>Guión</div>
              <div className='bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap'>
                {selectedContent.content.script}
              </div>
            </div>

            {/* Copy */}
            <div>
              <div className='font-medium text-gray-700 mb-2 flex items-center space-x-2'>
                <MessageSquare className='h-4 w-4' />
                <div>Copy</div>
              </div>
              <div className='bg-gray-50 p-3 rounded-lg text-sm'>{selectedContent.content.copy}</div>
            </div>

            {/* Hashtags */}
            {selectedContent.content.hashtags && (
              <div>
                <div className='font-medium text-gray-700 mb-2 flex items-center space-x-2'>
                  <Hash className='h-4 w-4' />
                  <div>Hashtags</div>
                </div>
                <div className='bg-blue-50 p-3 rounded-lg text-sm text-blue-800'>
                  {selectedContent.content.hashtags}
                </div>
              </div>
            )}

            {/* CTA */}
            {selectedContent.content.cta_copy && (
              <div>
                <div className='font-medium text-gray-700 mb-2'>Call to Action</div>
                <div className='bg-green-50 p-3 rounded-lg text-sm text-green-800 font-medium'>
                  {selectedContent.content.cta_copy}
                </div>
              </div>
            )}

            {/* Additional Fields */}
            <div className='grid grid-cols-2 gap-4'>
              {selectedContent.content.feelings && (
                <div>
                  <div className='font-medium text-gray-700 mb-2 flex items-center space-x-2'>
                    <Heart className='h-4 w-4' />
                    <div>Sentimientos</div>
                  </div>
                  <Badge variant='outline'>{selectedContent.content.feelings}</Badge>
                </div>
              )}
              {selectedContent.content.understanding && (
                <div>
                  <div className='font-medium text-gray-700 mb-2 flex items-center space-x-2'>
                    <Brain className='h-4 w-4' />
                    <div>Comprensión</div>
                  </div>
                  <Badge variant='outline'>{selectedContent.content.understanding}</Badge>
                </div>
              )}
            </div>

            {selectedContent.content.key_words_copy && (
              <div>
                <div className='font-medium text-gray-700 mb-2'>Palabras Clave</div>
                <div className='bg-purple-50 p-3 rounded-lg text-sm text-purple-800'>
                  {selectedContent.content.key_words_copy}
                </div>
              </div>
            )}

            {selectedContent.content.make && (
              <div>
                <div className='font-medium text-gray-700 mb-2'>Tipo de Contenido</div>
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
        className={`p-2 mb-2 rounded-lg border ${colors.bg} ${colors.border} ${colors.text} cursor-pointer hover:shadow-md transition-shadow`}
        onClick={() => setSelectedContent(item)}
      >
        <div className='flex items-center justify-between mb-1'>
          <div className='flex items-center space-x-1'>
            <Video className='h-3 w-3' />
            <div className='text-xs font-medium truncate'>{item.content.title}</div>
          </div>
          {item.completed && <CheckCircle className='h-3 w-3 text-green-600' />}
        </div>

        <div className='text-xs opacity-75 mb-1'>{item.pillar}</div>

        {item.content.hook ? (
          <div className='text-xs opacity-60 truncate'>{item.content.hook}</div>
        ) : (
          <div className='text-xs opacity-60 truncate'>{item.content.script.substring(0, 40)}...</div>
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
        <div className={`p-2 rounded border-2 border-dashed ${colors.border} opacity-50 min-h-[60px]`}>
          <div className='text-xs text-gray-400 text-center pt-4'>Sin contenido</div>
        </div>
      );
    }

    return <div className='space-y-1'>{items.map(renderContentItem)}</div>;
  };

  return (
    <div className='w-full space-y-6'>
      {/* Tooltip */}
      {renderContentTooltip()}

      {/* Color Legend and Profile Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Color Legend */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>Esquema de Colores - Horarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-yellow-500 rounded-full'></div>
                <div className='text-sm font-medium'>Mañana (6:00 - 12:00)</div>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                <div className='text-sm font-medium'>Tarde (12:00 - 18:00)</div>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                <div className='text-sm font-medium'>Noche (18:00 - 24:00)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card>
          <CardHeader className='pb-3'></CardHeader>
          <CardContent>
            {profileData ? (
              <div className='flex items-center space-x-4'>
                <div className='flex-shrink-0'>
                  <img
                    src={profileData.avatar}
                    alt={profileData.username}
                    className='w-24 h-24   rounded-full object-cover'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center space-x-2 mb-1'>
                    <div className='text-lg font-semibold truncate'>@{profileData.username}</div>
                    <Badge variant='secondary' className='text-xs'>
                      {profileData.socialMedia.toUpperCase()}
                    </Badge>
                  </div>
                  <div className='text-sm text-gray-600 line-clamp-2 mb-2'>{profileData.bio}</div>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-center h-20 text-gray-500'>
                <div className='text-center'>
                  <div className='text-sm'>No hay perfil conectado</div>
                  <div className='text-xs mt-1'>Conecta tu cuenta de TikTok</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg'>Calendario de Contenido Semanal</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='grid grid-cols-7 gap-0 min-h-[500px]'>
            {weekDates.map((date, index) => {
              const dateKey = date.toDateString();
              const dayContent = groupedContent[dateKey] || { morning: [], afternoon: [], evening: [] };
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div key={dateKey} className={`border-r border-b border-gray-200 ${index === 6 ? "border-r-0" : ""}`}>
                  {/* Day Header */}
                  <div className={`p-3 border-b border-gray-200 text-center ${isToday ? "bg-blue-50" : "bg-gray-50"}`}>
                    <div className='font-semibold text-sm'>{DAYS_OF_WEEK[index]}</div>
                    <div className={`text-xs mt-1 ${isToday ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className='p-2 space-y-3'>
                    {/* Morning */}
                    <div>
                      <div className='flex items-center space-x-1 mb-2'>
                        <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                        <div className='text-xs font-medium text-gray-600'>Mañana</div>
                      </div>
                      {renderTimePeriod(dayContent, "morning")}
                    </div>

                    {/* Afternoon */}
                    <div>
                      <div className='flex items-center space-x-1 mb-2'>
                        <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                        <div className='text-xs font-medium text-gray-600'>Tarde</div>
                      </div>
                      {renderTimePeriod(dayContent, "afternoon")}
                    </div>

                    {/* Evening */}
                    <div>
                      <div className='flex items-center space-x-1 mb-2'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                        <div className='text-xs font-medium text-gray-600'>Noche</div>
                      </div>
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
