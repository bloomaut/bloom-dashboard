"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Video } from "lucide-react";

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

interface ContentCalendarProps {
  contentItems: ContentItem[];
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

// Days of the week in Spanish
const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function ContentCalendar({ contentItems }: ContentCalendarProps) {
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

  // Render content item card
  const renderContentItem = (item: ContentItem) => {
    const colors = TIME_PERIOD_COLORS[item.dayTime];

    return (
      <div
        key={`${item.clientId}-${item.skinxId}-${item.presetId}`}
        className={`p-2 mb-2 rounded-lg border ${colors.bg} ${colors.border} ${colors.text}`}
      >
        <div className='flex items-center justify-between mb-1'>
          <div className='flex items-center space-x-1'>
            <Video className='h-3 w-3' />
            <div className='text-xs font-medium truncate'>{item.content.title}</div>
          </div>
          {item.completed && <CheckCircle className='h-3 w-3 text-green-600' />}
        </div>

        <div className='text-xs opacity-75 mb-1'>{item.pillar}</div>

        <div className='text-xs opacity-60 truncate'>{item.content.script.substring(0, 40)}...</div>
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
