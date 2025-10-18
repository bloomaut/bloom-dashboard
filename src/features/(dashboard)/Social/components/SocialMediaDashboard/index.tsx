"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Settings, Bell, TrendingUp, Users, Heart, Grid3X3, Sparkles } from "lucide-react";
import { ContentCalendar } from "@/features/(dashboard)/Social/components/ContentCalendar";
import { CreateContentModal } from "@/features/(dashboard)/Social/components/CreateContentModal";
import { generateWeekContent, getContent, getProfile, fixContentIdeasWithRetry } from "@/features/(dashboard)/Social/services/socialMediaService";
import { useMessageToast } from "@/hooks/useMessageToast";

// Mock data for testing the component
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

interface ProfileData {
  profile: {
    _id: string;
    clientId: string;
    username: string;
    bio: string;
    avatar: string;
    socialMedia: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function SocialMediaDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentData, setContentData] = useState(mockContentData);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixingContent, setFixingContent] = useState(false);
  const { notify, notifyError } = useMessageToast();

  const fetchContent = async () => {
    try {
      setLoading(true);

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDate = startOfWeek.toISOString().split("T")[0];
      const endDate = endOfWeek.toISOString().split("T")[0];

      const profileResponse = await getProfile();
      if (profileResponse.data && profileResponse.data.result) {
        setProfileData(profileResponse.data.result);
      }

      const maxRetries = 3;
      let currentRetry = 0;
      let finalContentData: any[] = [];

      while (currentRetry < maxRetries) {
        try {
          console.log(`Fetching content attempt ${currentRetry + 1}/${maxRetries}`);
          const contentResponse: any = await getContent(startDate, endDate);

          console.log("Content items:", contentResponse);
          let contentItems = [];
          if (contentResponse.result && contentResponse.result.contents) {
            contentItems = contentResponse.result.contents;
          } else if (contentResponse.data && contentResponse.data.result && contentResponse.data.result.contents) {
            contentItems = contentResponse.data.result.contents;
          }

          let ideas = [];
          if (contentResponse.result && contentResponse.result.ideas) {
            ideas = contentResponse.result.ideas;
          } else if (contentResponse.data && contentResponse.data.result && contentResponse.data.result.ideas) {
            ideas = contentResponse.data.result.ideas;
          }

          if (contentItems.length === 0) {
            console.log("No content found in response, using mock data");
            finalContentData = mockContentData;
            break;
          }

          const incompleteIds: string[] = [];
          ideas.forEach((idea: any) => {
            if (idea.completed === false) {
              incompleteIds.push(idea.id);
            }
          });

          console.log(`Found ${incompleteIds.length} incomplete ideas:`, incompleteIds);

          if (incompleteIds.length > 0 && currentRetry < maxRetries - 1) {
            setFixingContent(true);
            console.log(`Attempting to fix ${incompleteIds.length} incomplete ideas...`);

            try {
              const fixResult = await fixContentIdeasWithRetry(incompleteIds);
              console.log("Fix result:", fixResult);

              await new Promise(resolve => setTimeout(resolve, 2000));

              currentRetry++;
              continue;
            } catch (fixError) {
              console.error("Error fixing content ideas:", fixError);
              currentRetry++;
              continue;
            }
          }

          const transformedData = contentItems.map((item: any) => {
            let dayTime: "morning" | "afternoon" | "evening" = "morning";
            const timeField = item.dayTime || item.dayType;

            if (timeField === "afternoon" || timeField === "tarde") {
              dayTime = "afternoon";
            } else if (timeField === "evening" || timeField === "noche") {
              dayTime = "evening";
            } else if (timeField === "morning" || timeField === "mañana") {
              dayTime = "morning";
            }

            return {
              clientId: item.clientId || "unknown",
              socialMedia: item.socialMedia || ("tiktok" as const),
              publishType: (item.publishType === "video" ? "Video" : item.publishType) || ("Video" as const),
              pillar: item.pillar || "General",
              day: new Date(item.day.split("T")[0] + "T12:00:00.000Z"),
              dayTime: dayTime,
              completed: item.completed || item.status === "completed",
              skinxId: item.skinxId || item.id || "",
              presetId: item.presetId || "",
              content: {
                title: item.content?.title || item.title || `Contenido de ${item.pillar}`,
                script: item.content?.script || item.script || "",
                copy: item.content?.copy || item.copy || "",
                hashtags: item.content?.hashtags || item.hashtags || null,
                cta_copy: item.content?.cta_copy || item.cta_copy || null,
                key_words_copy: item.content?.key_words_copy || item.key_words_copy || null,
                feelings: item.content?.feelings || item.feelings || null,
                understanding: item.content?.understanding || item.understanding || null,
                make: item.content?.make || item.make || null,
                hook: item.content?.hook || item.hook || null,
              },
            };
          });
          console.log("Transformed content items:", transformedData);
          finalContentData = transformedData;
          break;
        } catch (fetchError) {
          console.error(`Content fetch attempt ${currentRetry + 1} failed:`, fetchError);
          currentRetry++;

          if (currentRetry >= maxRetries) {
            console.log("Max retries reached, using mock data");
            finalContentData = mockContentData;
          }
        }
      }

      setContentData(finalContentData);
      setError(null);
    } catch (err) {
      console.error("Error in content fetching process:", err);
      setError("Failed to fetch content data");
      setContentData(mockContentData);
    } finally {
      setLoading(false);
      setFixingContent(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleCreateContentSuccess = () => {
    console.log("Contenido creado exitosamente");
    fetchContent();
  };

  const handleGenerateNextWeek = async () => {
    setIsGenerating(true);
    try {
      notify("Generando contenido para la próxima semana...");
      await generateWeekContent("next-week");
      notify("Contenido generado exitosamente");
      await fetchContent();
    } catch (error) {
      console.error("Error generating next week content:", error);
      notifyError("Error al generar el contenido");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Modal */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateContentSuccess}
      />

      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='text-2xl font-bold text-gray-900'>Dashboard de Redes Sociales</div>
          <div className='flex items-center space-x-3'>
            <Button
              variant='outline'
              size='sm'
              className='cursor-pointer'
              onClick={handleGenerateNextWeek}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generando..." : "Actualizar datos"}
            </Button>
            <Button variant='outline' size='sm' className='cursor-pointer' onClick={() => setIsCreateModalOpen(true)}>
              <Sparkles className='h-4 w-4 mr-2' />
              Generar
            </Button>
          </div>
        </div>
      </header>

      {loading ? (
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
      ) : (
        <div className='p-6'>
          <div className='mb-6'>
            <div className='text-gray-600'>Visualiza y gestiona todo tu contenido programado de la semana</div>
            {error && (
              <div className='mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded'>
                {error} - Mostrando datos de ejemplo
              </div>
            )}
          </div>
          <ContentCalendar contentItems={contentData} profileData={profileData?.profile} />
        </div>
      )}
    </div>
  );
}
