"use client";

import { ContentCalendar } from "@/components/v0Components/content-calendar";

interface ContentItem {
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

interface ContentCalendarExampleProps {
  contentItems: ContentItem[];
  profileData?: ProfileData;
  loading?: boolean;
  error?: string | null;
  fixingContent?: boolean;
}

export function ContentCalendarExample({
  contentItems,
  profileData,
  loading = false,
  error = null,
  fixingContent = false,
}: ContentCalendarExampleProps) {
  if (loading) {
    return (
      <div className='p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            {fixingContent ? (
              <div className='text-center'>
                <div className='text-gray-700 font-medium'>Optimizando contenido...</div>
                <div className='text-gray-500 text-sm'>Procesando ideas incompletas</div>
              </div>
            ) : (
              <div className='text-gray-600'>Cargando contenido...</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='text-gray-600'>Visualiza y gestiona todo tu contenido programado de la semana</div>
        {error && (
          <div className='mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded'>
            {error} - Mostrando datos de ejemplo
          </div>
        )}
      </div>
      <ContentCalendar contentItems={contentItems} profileData={profileData} />
    </div>
  );
}
