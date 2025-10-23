import axios from "@/utils/axiosConfig";
import {
  ProfileApiResponse,
  SocialMediaProfile,
  ContentItem,
  IdeaItem,
  ContentApiResponse,
  GetContentParams,
  FixContentIdeasParams,
  FixContentIdeasResponse,
  FixContentOptions,
  ConnectTikTokParams,
  ConnectTikTokResponse,
  CreateContentParams,
  CreateContentResponse,
  CreateContentPollingOptions,
  CreateNextWeekContentParams,
  CreateNextWeekContentResponse,
  CreateContentOptions,
} from "../types";

// ============================================================================
// SERVICIOS DE API
// ============================================================================

/**
 * Servicio para obtener el perfil de redes sociales del usuario. Funcion GET PROFILE principal
 *
 * @returns Promise<SocialMediaProfile> - Información del perfil del usuario
 * @throws Error si la petición falla o el perfil no existe
 */
export const getSocialMediaProfile = async (): Promise<SocialMediaProfile> => {
  try {
    const response = await axios.get<{ data: ProfileApiResponse }>("/api/social-media/profile");

    // Validar que la respuesta tenga la estructura esperada
    if (!response.data?.data?.result?.profile) {
      throw new Error("Estructura de respuesta inválida: no se encontró el perfil");
    }

    const { data: apiResponse } = response.data;

    // Validar que el statusCode sea exitoso
    if (apiResponse.statusCode !== 200) {
      throw new Error(`Error del servidor: ${apiResponse.statusCode}`);
    }

    return apiResponse.result.profile;
  } catch (error) {
    console.error("Error al obtener el perfil de redes sociales:", error);

    // Re-lanzar el error con información más específica
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      throw new Error(`Error HTTP ${statusCode}: ${errorMessage}`);
    }

    throw error;
  }
};

/**
 * Servicio para obtener contenido e ideas de redes sociales por rango de fechas
 *
 * @param params - Parámetros con startDate y endDate en formato YYYY-MM-DD
 * @returns Promise<{contents: ContentItem[], ideas: IdeaItem[]}> - Contenido e ideas del usuario
 * @throws Error si la petición falla o el rango de fechas es inválido
 */
export const getSocialMediaContent = async (
  params: GetContentParams,
): Promise<{ contents: ContentItem[]; ideas: IdeaItem[] }> => {
  try {
    const { startDate, endDate } = params;

    // Validar el rango de fechas antes de hacer la petición
    if (!isValidDateRange(startDate, endDate)) {
      throw new Error(
        "Rango de fechas inválido. El rango no debe exceder 7 días y startDate debe ser anterior o igual a endDate.",
      );
    }

    // Realizar la petición con query parameters
    const response = await axios.get<{ data: ContentApiResponse }>("/api/social-media/content", {
      params: {
        startDate,
        endDate,
      },
    });

    // Validar que la respuesta tenga la estructura esperada
    if (!response.data?.data?.result) {
      throw new Error("Estructura de respuesta inválida: no se encontró el resultado");
    }

    const { data: apiResponse } = response.data;

    // Validar que el statusCode sea exitoso
    if (apiResponse.statusCode !== 200) {
      throw new Error(`Error del servidor: ${apiResponse.statusCode}`);
    }

    const { contents, ideas } = apiResponse.result;

    // Validar que la respuesta tenga la estructura esperada
    if (!Array.isArray(contents) || !Array.isArray(ideas)) {
      throw new Error("Estructura de respuesta inválida: contents e ideas deben ser arrays");
    }

    return { contents, ideas };
  } catch (error) {
    console.error("Error al obtener el contenido de redes sociales:", error);

    // Re-lanzar el error con información más específica
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      throw new Error(`Error HTTP ${statusCode}: ${errorMessage}`);
    }

    throw error;
  }
};

/**
 * Servicio para reparar ideas de contenido específicas
 *
 * @param params - Parámetros con array de IDs de ideas a reparar
 * @returns Promise<string> - Mensaje de confirmación
 * @throws Error si la petición falla
 */
export const fixContentIdeas = async (params: FixContentIdeasParams): Promise<string> => {
  try {
    const { ids } = params;

    // Validar que se proporcionen IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Se requiere al menos un ID de idea para reparar");
    }

    // Validar que todos los IDs sean strings válidos
    if (!ids.every(id => typeof id === "string" && id.trim().length > 0)) {
      throw new Error("Todos los IDs deben ser strings válidos");
    }

    // Realizar la petición POST
    const response = await axios.post<{ data: FixContentIdeasResponse }>("/api/social-media/fix-content-idea", {
      ids,
    });

    // Validar que la respuesta tenga la estructura esperada
    if (!response.data?.data?.result) {
      throw new Error("Estructura de respuesta inválida: no se encontró el resultado");
    }

    const { data: apiResponse } = response.data;

    // Validar que el statusCode sea exitoso
    if (apiResponse.statusCode !== 200) {
      throw new Error(`Error del servidor: ${apiResponse.statusCode}`);
    }

    return apiResponse.result.message;
  } catch (error) {
    console.error("Error al reparar las ideas de contenido:", error);

    // Re-lanzar el error con información más específica
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      throw new Error(`Error HTTP ${statusCode}: ${errorMessage}`);
    }

    throw error;
  }
};

/**
 * Función unificada que obtiene contenido y repara ideas incompletas automáticamente. Funcion GET CONTENT principal
 *
 * @param params - Parámetros con startDate y endDate
 * @param options - Opciones de configuración para reintentos
 * @returns Promise<{contents: ContentItem[], ideas: IdeaItem[]}> - Contenido e ideas completamente reparadas
 * @throws Error si no se puede reparar después del máximo de intentos
 */
export const getAndFixSocialMediaContent = async (
  params: GetContentParams,
  options: FixContentOptions = {},
): Promise<{ contents: ContentItem[]; ideas: IdeaItem[] }> => {
  const { maxRetries = 3, retryDelay = 180000 } = options;
  let attempt = 0;
  console.log("startDate " + params.startDate, "endDate", params.endDate);
  while (attempt < maxRetries) {
    try {
      // Obtener el contenido actual
      const { contents, ideas } = await getSocialMediaContent(params);

      // Identificar ideas incompletas
      const incompleteIdeas = ideas.filter(idea => !idea.completed);

      // Si no hay ideas incompletas, retornar el resultado
      if (incompleteIdeas.length === 0) {
        return { contents, ideas };
      }

      // Si es el último intento y aún hay ideas incompletas, lanzar error
      if (attempt === maxRetries - 1) {
        throw new Error(
          `No se pudieron reparar todas las ideas después de ${maxRetries} intentos. ` +
            `Ideas incompletas restantes: ${incompleteIdeas.length}`,
        );
      }

      // Extraer los IDs de las ideas incompletas
      const incompleteIds = incompleteIdeas.map(idea => idea._id);

      console.log(`Intento ${attempt + 1}: Reparando ${incompleteIds.length} ideas incompletas`);

      // Solicitar reparación
      await fixContentIdeas({ ids: incompleteIds });

      // Esperar antes del siguiente intento
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      attempt++;
    } catch (error) {
      // Si es un error de la función de reparación y no es el último intento, continuar
      if (attempt < maxRetries - 1) {
        console.warn(`Error en intento ${attempt + 1}, reintentando:`, error);
        attempt++;

        if (retryDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
        continue;
      }

      // Si es el último intento o un error crítico, lanzar el error
      throw error;
    }
  }

  // Este punto no debería alcanzarse, pero por seguridad
  throw new Error(`Error inesperado: se agotaron los ${maxRetries} intentos sin resultado`);
};

/**
 * Servicio para conectar una cuenta de TikTok
 *
 * @param params - Parámetros con el código de autorización de TikTok
 * @returns Promise<string> - Mensaje de confirmación
 * @throws Error si la petición falla o el código es inválido
 */
export const connectTikTokAccount = async (params: ConnectTikTokParams): Promise<string> => {
  try {
    const { code } = params;

    // Validar que se proporcione el código
    if (!code || typeof code !== "string" || code.trim().length === 0) {
      throw new Error("Se requiere un código de autorización válido de TikTok");
    }

    // Realizar la petición PUT
    const response = await axios.put<{ data: ConnectTikTokResponse }>("/api/social-media/connect/tiktok", {
      code: code.trim(),
    });

    // Validar que la respuesta tenga la estructura esperada
    if (!response.data?.data?.result) {
      throw new Error("Estructura de respuesta inválida: no se encontró el resultado");
    }

    const { data: apiResponse } = response.data;

    // Validar que el statusCode sea exitoso
    if (apiResponse.statusCode !== 200) {
      throw new Error(`Error del servidor: ${apiResponse.statusCode}`);
    }

    return apiResponse.result.message;
  } catch (error) {
    console.error("Error al conectar la cuenta de TikTok:", error);

    // Re-lanzar el error con información más específica
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      throw new Error(`Error HTTP ${statusCode}: ${errorMessage}`);
    }

    throw error;
  }
};

/**
 * Función unificada que conecta TikTok y obtiene el perfil actualizado. Funcion GET CONNECT TIKTOK ACCOUNT principal
 *
 * @param params - Parámetros con el código de autorización de TikTok
 * @returns Promise<SocialMediaProfile> - Perfil actualizado después de la conexión
 * @throws Error si la conexión falla o no se puede obtener el perfil actualizado
 */
export const connectTikTokAndGetProfile = async (params: ConnectTikTokParams): Promise<SocialMediaProfile> => {
  try {
    // Conectar la cuenta de TikTok
    const message = await connectTikTokAccount(params);

    console.log("TikTok conectado exitosamente:", message);

    // Obtener el perfil actualizado
    const updatedProfile = await getSocialMediaProfile();

    // Verificar que la cuenta esté efectivamente conectada
    if (!updatedProfile.connected) {
      throw new Error("La cuenta de TikTok no se conectó correctamente. El perfil no refleja la conexión.");
    }

    return updatedProfile;
  } catch (error) {
    console.error("Error en el proceso de conexión de TikTok:", error);
    throw error;
  }
};

/**
 * Servicio para crear contenido de la próxima semana
 *
 * @param params - Parámetros con el tipo de pipeline
 * @returns Promise<string> - Mensaje de confirmación
 * @throws Error si la petición falla o los parámetros son inválidos
 */
export const createNextWeekContent = async (params: CreateNextWeekContentParams): Promise<string> => {
  try {
    const { pipelineType } = params;

    // Validar el tipo de pipeline
    if (!pipelineType || !["first-login", "next-week"].includes(pipelineType)) {
      throw new Error("Tipo de pipeline inválido. Debe ser 'first-login' o 'next-week'");
    }

    // Validar parámetros específicos para "next-week"
    if (pipelineType === "next-week") {
      const { startDate, endDate } = params;
      if (!startDate || !endDate) {
        throw new Error("Para el tipo 'next-week' se requieren startDate y endDate");
      }

      if (!isValidDateRange(startDate, endDate)) {
        throw new Error("Rango de fechas inválido para 'next-week'");
      }
    }

    // Realizar la petición PUT con query parameter
    const response = await axios.put<{ data: CreateNextWeekContentResponse }>("/api/social-media/pipeline", null, {
      params: {
        pipelineType,
      },
    });

    // Validar que la respuesta tenga la estructura esperada
    if (!response.data?.data?.result) {
      throw new Error("Estructura de respuesta inválida: no se encontró el resultado");
    }

    const { data: apiResponse } = response.data;

    // Validar que el statusCode sea exitoso
    if (apiResponse.statusCode !== 200) {
      throw new Error(`Error del servidor: ${apiResponse.statusCode}`);
    }

    return apiResponse.result.message;
  } catch (error) {
    console.error("Error al crear contenido de la próxima semana:", error);

    // Re-lanzar el error con información más específica
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      throw new Error(`Error HTTP ${statusCode}: ${errorMessage}`);
    }

    throw error;
  }
};

/**
 * Función unificada que crea contenido y espera hasta que esté disponible y completo. Funcion CREATE WEEK CONTENT principal
 *
 * @param params - Parámetros con el tipo de pipeline y fechas opcionales
 * @param options - Opciones de configuración para verificaciones y reintentos
 * @returns Promise<{contents: ContentItem[], ideas: IdeaItem[]}> - Contenido generado y completamente procesado
 * @throws Error si no se puede generar o completar el contenido
 */
export const createAndWaitForContent = async (
  params: CreateNextWeekContentParams,
  options: CreateContentOptions = {},
): Promise<{ contents: ContentItem[]; ideas: IdeaItem[] }> => {
  const { maxRetries = 10, retryDelay = 60000, fixIncompleteIdeas = true } = options;

  try {
    const { pipelineType } = params;

    // Determinar las fechas según el tipo de pipeline
    let startDate: string;
    let endDate: string;

    if (pipelineType === "first-login") {
      // Para first-login: hoy + 1 hasta hoy + 8
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const nextWeekEnd = new Date(today);
      nextWeekEnd.setDate(today.getDate() + 8);

      startDate = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD
      endDate = nextWeekEnd.toISOString().split("T")[0]; // YYYY-MM-DD
    } else {
      // Para next-week: usar las fechas proporcionadas
      if (!params.startDate || !params.endDate) {
        throw new Error("Para 'next-week' se requieren startDate y endDate");
      }
      startDate = params.startDate;
      endDate = params.endDate;
    }

    console.log(`Creando contenido ${pipelineType} para el rango: ${startDate} - ${endDate}`);

    // Solicitar la creación del contenido
    const message = await createNextWeekContent(params);
    console.log("Solicitud de creación enviada:", message);

    // Esperar y verificar periódicamente hasta que el contenido esté disponible
    let attempt = 0;
    let previousContentCount = 0;

    while (attempt < maxRetries) {
      try {
        // Esperar antes de verificar (excepto en el primer intento)
        if (attempt > 0 && retryDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }

        console.log(`Verificación ${attempt + 1}: Obteniendo contenido...`);

        // Obtener el contenido actual
        const { contents, ideas } = await getSocialMediaContent({ startDate, endDate });

        // Verificar si hay nuevo contenido (comparar con intento anterior)
        if (contents.length > previousContentCount) {
          console.log(`Nuevo contenido detectado: ${contents.length} elementos`);

          // Si se debe reparar ideas incompletas automáticamente
          if (fixIncompleteIdeas) {
            const incompleteIdeas = getIncompleteIdeas(ideas);

            if (incompleteIdeas.length > 0) {
              console.log(`Reparando ${incompleteIdeas.length} ideas incompletas...`);

              // Usar la función unificada de reparación
              return await getAndFixSocialMediaContent({ startDate, endDate });
            }
          }

          // Si todas las ideas están completas o no se debe reparar automáticamente
          return { contents, ideas };
        }

        previousContentCount = contents.length;
        attempt++;

        console.log(`Intento ${attempt}: Contenido aún no disponible, reintentando...`);
      } catch (error) {
        console.warn(`Error en verificación ${attempt + 1}:`, error);
        attempt++;

        // Si es el último intento, lanzar el error
        if (attempt >= maxRetries) {
          throw error;
        }
      }
    }

    throw new Error(
      `No se pudo obtener el contenido generado después de ${maxRetries} intentos. ` +
        `El proceso de generación puede estar tardando más de lo esperado.`,
    );
  } catch (error) {
    console.error("Error en el proceso de creación y espera de contenido:", error);
    throw error;
  }
};

/**
 * POST Create Content - Genera un único contenido de redes sociales
 *
 * @param params - Parámetros para crear contenido (idea, pillar, date, dayTime)
 * @returns Promise<string> - Mensaje de confirmación del servidor
 * @throws Error si la validación falla o hay error en la API
 */
export const createContent = async (params: CreateContentParams): Promise<string> => {
  console.log("🚀 Iniciando creación de contenido:", params);

  // Validar parámetros de entrada
  if (!isValidCreateContentParams(params)) {
    throw new Error("Parámetros inválidos para crear contenido");
  }

  try {
    const response = await axios.post<CreateContentResponse>("/api/social-media/create-content-idea", {
      idea: params.idea,
      pillar: params.pillar,
      date: params.date,
      dayTime: params.dayTime,
    });

    console.log("✅ Contenido solicitado exitosamente:", response.data);

    if (response.data.data.statusCode !== 200) {
      throw new Error(`Error del servidor: ${response.data.data.statusCode}`);
    }

    return response.data.data.result.message;
  } catch (error) {
    console.error("❌ Error al crear contenido:", error);

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error en la API: ${message}`);
    }

    throw error;
  }
};

/**
 * Función unificada: Crea contenido y espera hasta obtener el nuevo contenido generado. Funcion CREATE CONTENT polling principal
 *
 * Esta función implementa la lógica completa de polling:
 * 1. Obtiene la lista actual de contenidos para el día especificado
 * 2. Almacena los IDs existentes
 * 3. Solicita la creación del nuevo contenido
 * 4. Realiza polling periódico hasta detectar el nuevo contenido
 * 5. Retorna el nuevo contenido generado
 *
 * @param params - Parámetros para crear contenido
 * @param options - Opciones de configuración (maxRetries, retryDelay)
 * @returns Promise<ContentItem> - El nuevo contenido generado
 * @throws Error si no se puede crear o detectar el nuevo contenido
 */
export const createAndWaitForNewContent = async (
  params: CreateContentParams,
  options: CreateContentPollingOptions = {},
): Promise<ContentItem> => {
  const { maxRetries = 20, retryDelay = 30000 } = options; // 30 segundos por defecto

  console.log("🎯 Iniciando proceso completo de creación de contenido:", params);
  console.log("⚙️ Opciones de polling:", { maxRetries, retryDelay });

  // Validar parámetros
  if (!isValidCreateContentParams(params)) {
    throw new Error("Parámetros inválidos para crear contenido");
  }

  try {
    // Paso 1: Obtener contenido actual para almacenar IDs existentes
    console.log("📋 Obteniendo contenido actual para el día:", params.date);
    const initialContent = await getSocialMediaContent({
      startDate: params.date,
      endDate: params.date,
    });

    const existingContentIds = new Set(initialContent.contents.map(item => item._id));
    console.log("🔍 IDs de contenido existentes:", Array.from(existingContentIds));

    // Paso 2: Solicitar creación del nuevo contenido
    console.log("🚀 Solicitando creación de nuevo contenido...");
    const creationMessage = await createContent(params);
    console.log("✅ Solicitud enviada:", creationMessage);

    // Paso 3: Polling para detectar el nuevo contenido
    console.log("🔄 Iniciando polling para detectar nuevo contenido...");

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔍 Intento ${attempt}/${maxRetries} - Verificando nuevo contenido...`);

      try {
        // Obtener contenido actualizado
        const updatedContent = await getSocialMediaContent({
          startDate: params.date,
          endDate: params.date,
        });

        // Buscar contenido nuevo comparando IDs
        const newContent = updatedContent.contents.find(item => !existingContentIds.has(item._id));

        if (newContent) {
          console.log("🎉 ¡Nuevo contenido detectado!:", newContent._id);
          console.log("📝 Contenido generado:", {
            id: newContent._id,
            day: newContent.day,
            dayTime: newContent.dayTime,
            pillar: newContent.pillar,
            completed: newContent.completed,
          });

          return newContent;
        }

        console.log(`⏳ Contenido aún no disponible. Esperando ${retryDelay / 1000}s antes del siguiente intento...`);

        // Esperar antes del siguiente intento (excepto en el último)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        console.warn(`⚠️ Error en intento ${attempt}:`, error);

        // Si es el último intento, lanzar el error
        if (attempt === maxRetries) {
          throw error;
        }

        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    // Si llegamos aquí, no se detectó contenido nuevo después de todos los intentos
    throw new Error(
      `No se pudo detectar el nuevo contenido después de ${maxRetries} intentos. ` +
        `El contenido puede estar siendo procesado aún. Intenta nuevamente más tarde.`,
    );
  } catch (error) {
    console.error("❌ Error en el proceso completo de creación:", error);
    throw error;
  }
};

// ============================================================================
// UTILIDADES Y HELPERS
// ============================================================================

/**
 * Valida si un perfil tiene la información mínima requerida
 *
 * @param profile - Perfil a validar
 * @returns boolean - true si el perfil es válido
 */
export const isValidProfile = (profile: SocialMediaProfile): boolean => {
  return Boolean(profile._id && profile.clientId && profile.username && profile.socialMedia);
};

/**
 * Verifica si el usuario tiene una cuenta conectada
 *
 * @param profile - Perfil del usuario
 * @returns boolean - true si la cuenta está conectada
 */
export const isAccountConnected = (profile: SocialMediaProfile): boolean => {
  return profile.connected === true;
};

/**
 * Valida si un rango de fechas es válido (máximo 7 días)
 *
 * @param startDate - Fecha de inicio en formato YYYY-MM-DD
 * @param endDate - Fecha de fin en formato YYYY-MM-DD
 * @returns boolean - true si el rango es válido
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  // Validar formato de fecha básico
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Verificar que las fechas sean válidas
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  // Verificar que startDate sea anterior o igual a endDate
  if (start > end) {
    return false;
  }

  // Verificar que el rango no exceda 7 días
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 7;
};

/**
 * Valida si un elemento de contenido tiene la estructura correcta
 *
 * @param content - Elemento de contenido a validar
 * @returns boolean - true si el contenido es válido
 */
export const isValidContentItem = (content: ContentItem): boolean => {
  return Boolean(
    content._id &&
      content.clientId &&
      content.socialMedia &&
      content.day &&
      content.dayTime &&
      content.content &&
      typeof content.content === "object",
  );
};

/**
 * Valida si un elemento de idea tiene la estructura correcta
 *
 * @param idea - Elemento de idea a validar
 * @returns boolean - true si la idea es válida
 */
export const isValidIdeaItem = (idea: IdeaItem): boolean => {
  return Boolean(
    idea._id && idea.clientId && idea.day && Array.isArray(idea.dayContent) && typeof idea.completed === "boolean",
  );
};

/**
 * Filtra y retorna solo las ideas que están incompletas
 *
 * @param ideas - Array de ideas a filtrar
 * @returns IdeaItem[] - Array de ideas incompletas
 */
export const getIncompleteIdeas = (ideas: IdeaItem[]): IdeaItem[] => {
  return ideas.filter(idea => !idea.completed);
};

/**
 * Verifica si todas las ideas están completas
 *
 * @param ideas - Array de ideas a verificar
 * @returns boolean - true si todas las ideas están completas
 */
export const areAllIdeasComplete = (ideas: IdeaItem[]): boolean => {
  return ideas.every(idea => idea.completed === true);
};

/**
 * Extrae los IDs de un array de ideas
 *
 * @param ideas - Array de ideas
 * @returns string[] - Array de IDs
 */
export const extractIdeaIds = (ideas: IdeaItem[]): string[] => {
  return ideas.map(idea => idea._id);
};

/**
 * Valida si un código de TikTok tiene el formato correcto
 *
 * @param code - Código de autorización a validar
 * @returns boolean - true si el código es válido
 */
export const isValidTikTokCode = (code: string): boolean => {
  // Validar que sea un string no vacío
  if (!code || typeof code !== "string") {
    return false;
  }

  // Validar que no esté vacío después de trim
  const trimmedCode = code.trim();
  if (trimmedCode.length === 0) {
    return false;
  }

  // Validar longitud mínima (los códigos de TikTok suelen tener al menos 10 caracteres)
  if (trimmedCode.length < 10) {
    return false;
  }

  return true;
};

/**
 * Verifica si una cuenta de TikTok está conectada en el perfil
 *
 * @param profile - Perfil del usuario
 * @returns boolean - true si TikTok está conectado
 */
export const isTikTokConnected = (profile: SocialMediaProfile): boolean => {
  return profile.connected === true && profile.socialMedia === "tiktok";
};

/**
 * Genera las fechas para el pipeline "first-login"
 *
 * @returns {startDate: string, endDate: string} - Fechas en formato YYYY-MM-DD
 */
export const generateFirstLoginDates = (): { startDate: string; endDate: string } => {
  const today = new Date();

  // Mañana (hoy + 1)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Próxima semana (hoy + 8)
  const nextWeekEnd = new Date(today);
  nextWeekEnd.setDate(today.getDate() + 8);

  return {
    startDate: tomorrow.toISOString().split("T")[0],
    endDate: nextWeekEnd.toISOString().split("T")[0],
  };
};

/**
 * Valida los parámetros para crear contenido según el tipo de pipeline
 *
 * @param params - Parámetros a validar
 * @returns boolean - true si los parámetros son válidos
 */
export const isValidCreateWeekContentParams = (params: CreateNextWeekContentParams): boolean => {
  const { pipelineType, startDate, endDate } = params;

  // Validar tipo de pipeline
  if (!pipelineType || !["first-login", "next-week"].includes(pipelineType)) {
    return false;
  }

  // Para "next-week" se requieren fechas
  if (pipelineType === "next-week") {
    if (!startDate || !endDate) {
      return false;
    }

    return isValidDateRange(startDate, endDate);
  }

  // Para "first-login" no se requieren fechas adicionales
  return true;
};

/**
 * Detecta si hay contenido nuevo comparando con un conteo anterior
 *
 * @param currentCount - Conteo actual de contenido
 * @param previousCount - Conteo anterior de contenido
 * @returns boolean - true si hay contenido nuevo
 */
export const hasNewContent = (currentCount: number, previousCount: number): boolean => {
  return currentCount > previousCount;
};

/**
 * Valida los parámetros para crear contenido individual
 *
 * @param params - Parámetros de creación de contenido
 * @returns boolean - true si los parámetros son válidos
 */
export const isValidCreateContentParams = (params: CreateContentParams): boolean => {
  // Validar que idea esté presente y no esté vacía
  if (!params.idea || typeof params.idea !== "string" || params.idea.trim().length === 0) {
    console.error("❌ Idea es requerida y debe ser un string no vacío");
    return false;
  }

  // Validar que date esté presente y tenga formato correcto
  if (!params.date || typeof params.date !== "string") {
    console.error("❌ Date es requerido y debe ser un string");
    return false;
  }

  // Validar formato de fecha YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(params.date)) {
    console.error("❌ Date debe tener formato YYYY-MM-DD");
    return false;
  }

  // Validar que la fecha sea válida
  const dateObj = new Date(params.date);
  if (isNaN(dateObj.getTime())) {
    console.error("❌ Date debe ser una fecha válida");
    return false;
  }

  // Validar dayTime
  const validDayTimes = ["morning", "afternoon", "evening"];
  if (!params.dayTime || !validDayTimes.includes(params.dayTime)) {
    console.error('❌ dayTime debe ser "morning", "afternoon" o "evening"');
    return false;
  }

  // Validar pillar si está presente (es opcional)
  if (params.pillar !== undefined && (typeof params.pillar !== "string" || params.pillar.trim().length === 0)) {
    console.error("❌ pillar debe ser un string no vacío si se proporciona");
    return false;
  }

  return true;
};
