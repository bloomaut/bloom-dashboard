"use client";

import { ContentCalendar } from "@/components/v0Components/content-calendar";

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

export function ContentCalendarExample() {
  return (
    <div className='p-6'>
      <div className='mb-6'>
        <div className='text-3xl font-bold text-gray-900 mb-2'>Calendario de Contenido</div>
        <div className='text-gray-600'>Visualiza y gestiona todo tu contenido programado de la semana</div>
      </div>

      <ContentCalendar contentItems={mockContentData} />
    </div>
  );
}
