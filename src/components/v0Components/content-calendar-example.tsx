"use client";

import { useState, useEffect } from "react";
import { ContentCalendar } from "@/components/v0Components/content-calendar";
import { getContent, getProfile, fixContentIdeasWithRetry } from "@/services/socialMediaService";

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
  {
    clientId: "client-001",
    socialMedia: "tiktok" as const,
    publishType: "Video" as const,
    pillar: "Entertainment",
    day: new Date(2025, 8, 22), // September 22, 2025 (Monday)
    dayTime: "afternoon" as const,
    completed: false,
    skinxId: "skin-002",
    presetId: "preset-002",
    content: {
      title: "Behind the Scenes",
      script: "Te mostramos cómo es un día normal en nuestra oficina y los secretos detrás de nuestros videos...",
      copy: "Nunca habíamos mostrado esto antes... ¡Prepárate para sorprenderte!",
      hashtags: "#behindthescenes #oficina #secretos",
      cta_copy: "¡Comenta qué quieres ver!",
      key_words_copy: null,
      feelings: "divertido",
      understanding: null,
      make: null,
      hook: "¿Quieres ver nuestros secretos?",
    },
  },
  {
    clientId: "client-001",
    socialMedia: "tiktok" as const,
    publishType: "Video" as const,
    pillar: "Educational",
    day: new Date(2025, 8, 23), // September 23, 2025 (Tuesday)
    dayTime: "morning" as const,
    completed: false,
    skinxId: "skin-003",
    presetId: "preset-003",
    content: {
      title: "Herramientas Gratuitas",
      script: "Las 5 herramientas gratuitas que todo emprendedor debe conocer para hacer crecer su negocio...",
      copy: "¡Estas herramientas son completamente GRATIS y pueden cambiar tu negocio!",
      hashtags: "#herramientas #gratis #emprendedores #negocio",
      cta_copy: "¡Guarda este video!",
      key_words_copy: "herramientas gratuitas, emprendedores",
      feelings: "útil",
      understanding: "intermedio",
      make: "tutorial",
      hook: "¿Gastas dinero en herramientas caras?",
    },
  },
  {
    clientId: "client-001",
    socialMedia: "tiktok" as const,
    publishType: "Video" as const,
    pillar: "Motivational",
    day: new Date(2025, 8, 24), // September 24, 2025 (Wednesday - Today)
    dayTime: "evening" as const,
    completed: true,
    skinxId: "skin-004",
    presetId: "preset-004",
    content: {
      title: "Motivación de Miércoles",
      script: "Es mitad de semana y es normal sentirse cansado, pero recuerda por qué empezaste...",
      copy: "¡No te rindas! Cada pequeño paso cuenta hacia tu gran objetivo.",
      hashtags: "#motivacion #miercoles #nuncaterendas #objetivos",
      cta_copy: "¡Comparte tu objetivo en comentarios!",
      key_words_copy: "motivación, objetivos, perseverancia",
      feelings: "inspiracional",
      understanding: null,
      make: "motivacional",
      hook: "¿Te sientes cansado?",
    },
  },
  {
    clientId: "client-001",
    socialMedia: "tiktok" as const,
    publishType: "Video" as const,
    pillar: "Educational",
    day: new Date(2025, 8, 25), // September 25, 2025 (Thursday)
    dayTime: "morning" as const,
    completed: false,
    skinxId: "skin-005",
    presetId: "preset-005",
    content: {
      title: "Análisis de Competencia",
      script: "Cómo analizar a tu competencia de forma estratégica sin copiar, sino aprendiendo...",
      copy: "La competencia no es tu enemigo, es tu mejor maestro 📊",
      hashtags: "#competencia #analisis #estrategia #aprendizaje",
      cta_copy: "¿Analizas a tu competencia?",
      key_words_copy: "análisis competencia, estrategia",
      feelings: "educativo",
      understanding: "avanzado",
      make: "análisis",
      hook: "¿Espías a tu competencia?",
    },
  },
  {
    clientId: "client-001",
    socialMedia: "tiktok" as const,
    publishType: "Video" as const,
    pillar: "Educational",
    day: new Date(2025, 8, 25), // September 25, 2025 (Thursday)
    dayTime: "afternoon" as const,
    completed: false,
    skinxId: "skin-006",
    presetId: "preset-006",
    content: {
      title: "Errores Comunes",
      script: "Los 3 errores más comunes que cometen los emprendedores al empezar y cómo evitarlos...",
      copy: "Yo cometí estos errores y me costaron miles de dólares 💸",
      hashtags: "#errores #emprendedores #consejos #experiencia",
      cta_copy: "¿Has cometido alguno?",
      key_words_copy: "errores emprendedores, consejos",
      feelings: "reflexivo",
      understanding: "básico",
      make: "tutorial",
      hook: "¿Estás cometiendo estos errores?",
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

export function ContentCalendarExample() {
  const [contentData, setContentData] = useState(mockContentData);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixingContent, setFixingContent] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        // Get current week date range
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Go to Saturday

        // Format dates for API call (YYYY-MM-DD format)
        const startDate = startOfWeek.toISOString().split("T")[0];
        const endDate = endOfWeek.toISOString().split("T")[0];

        // Call the profile API
        const profileResponse = await getProfile();
        if (profileResponse.data && profileResponse.data.result) {
          setProfileData(profileResponse.data.result);
        }

        // Content fetching and fixing loop
        const maxRetries = 3;
        let currentRetry = 0;
        let finalContentData = [];

        while (currentRetry < maxRetries) {
          try {
            console.log(`Fetching content attempt ${currentRetry + 1}/${maxRetries}`);
            const contentResponse: any = await getContent(startDate, endDate);

            // Extract ideas from the response
            let ideas = [];
            if (contentResponse.result && contentResponse.result.ideas) {
              ideas = contentResponse.result.ideas;
            } else if (contentResponse.data && contentResponse.data.result && contentResponse.data.result.ideas) {
              ideas = contentResponse.data.result.ideas;
            }

            if (ideas.length === 0) {
              console.log("No ideas found in response, using mock data");
              finalContentData = mockContentData;
              break;
            }

            // Collect incomplete idea IDs
            const incompleteIds: string[] = [];
            ideas.forEach((idea: any) => {
              if (idea.completed === false) {
                incompleteIds.push(idea.id);
              }
            });

            console.log(`Found ${incompleteIds.length} incomplete ideas:`, incompleteIds);

            // If there are incomplete ideas and we haven't reached max retries, try to fix them
            if (incompleteIds.length > 0 && currentRetry < maxRetries - 1) {
              setFixingContent(true);
              console.log(`Attempting to fix ${incompleteIds.length} incomplete ideas...`);

              try {
                const fixResult = await fixContentIdeasWithRetry(incompleteIds);
                console.log("Fix result:", fixResult);

                // Wait a moment for the fixes to be processed
                await new Promise(resolve => setTimeout(resolve, 2000));

                currentRetry++;
                continue; // Try fetching again
              } catch (fixError) {
                console.error("Error fixing content ideas:", fixError);
                currentRetry++;
                continue; // Try fetching again even if fix failed
              }
            }

            // Transform the data regardless of completion status
            const transformedData = ideas.map((item: any) => {
              // Map dayTime from API to our time periods (prioritize dayTime over dayType)
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
                day: new Date(item.day),
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

            finalContentData = transformedData;
            break; // Successfully processed, exit loop
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

    fetchContent();
  }, []);

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
      <ContentCalendar contentItems={contentData} profileData={profileData?.profile} />
    </div>
  );
}
