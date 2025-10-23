// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

/**
 * Interfaz para el perfil de redes sociales del usuario
 */
export interface SocialMediaProfile {
  _id: string;
  clientId: string;
  username: string;
  bio: string;
  avatar: string;
  socialMedia: string;
  createdAt: string;
  updatedAt: string;
  connected: boolean;
}

/**
 * Respuesta estándar del API para el perfil
 */
export interface ProfileApiResponse {
  statusCode: number;
  result: {
    profile: SocialMediaProfile;
  };
}

/**
 * Respuesta genérica del API
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  result: T;
}

/**
 * Interfaz para el contenido de redes sociales
 */
export interface ContentItem {
  _id: string;
  clientId: string;
  socialMedia: string;
  publishType: string;
  day: string; // ISODate
  dayTime: "morning" | "afternoon" | "evening";
  status: string;
  pillar: string;
  completed: boolean;
  skinxId: string;
  presetId: string;
  content: {
    title: string;
    hook: string;
    body: string;
    making: string;
    copy: string;
    feelings: string;
    understanding: string;
    hashtags: string;
    cta_copy: string;
    key_words_copy: string;
    script: string | null;
    make: string | null;
  };
  createdAt: string; // ISODate
  updatedAt: string; // ISODate
}

/**
 * Interfaz para las ideas de contenido
 */
export interface IdeaItem {
  _id: string;
  clientId: string;
  SMPWeekStrategy: string;
  day: string; // ISODate
  dayContent: string[];
  completed: boolean;
  createdAt: string; // ISODate
  updatedAt: string; // ISODate
}

/**
 * Respuesta del API para contenido e ideas
 */
export interface ContentApiResponse {
  statusCode: number;
  result: {
    contents: ContentItem[];
    ideas: IdeaItem[];
  };
}

/**
 * Parámetros para obtener contenido por rango de fechas
 */
export interface GetContentParams {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}

/**
 * Parámetros para reparar ideas de contenido
 */
export interface FixContentIdeasParams {
  ids: string[]; // Array de IdeaItem._id
}

/**
 * Respuesta del API para reparar ideas de contenido
 */
export interface FixContentIdeasResponse {
  statusCode: number;
  result: {
    message: string;
  };
}

/**
 * Opciones para la función unificada de reparación
 */
export interface FixContentOptions {
  maxRetries?: number; // Máximo número de intentos (default: 3)
  retryDelay?: number; // Delay entre intentos en ms (default: 2000)
}

/**
 * Parámetros para conectar cuenta de TikTok
 */
export interface ConnectTikTokParams {
  code: string; // Código de autorización de TikTok
}

/**
 * Respuesta del API para conectar TikTok
 */
export interface ConnectTikTokResponse {
  statusCode: number;
  result: {
    message: string;
  };
}

/**
 * Interfaces para el endpoint POST Create Content
 */
export interface CreateContentParams {
  idea: string;
  pillar?: string; // Campo opcional
  date: string; // Formato YYYY-MM-DD
  dayTime: "morning" | "afternoon" | "evening";
}

export interface CreateContentResponse {
  data: {
    statusCode: number;
    result: {
      message: string;
    };
  };
}

export interface CreateContentPollingOptions {
  maxRetries?: number; // Máximo número de intentos para verificar contenido (default: 20)
  retryDelay?: number; // Delay entre verificaciones en ms (default: 30000 - 30 segundos)
}

/**
 * Tipos de pipeline para generar contenido
 */
export type PipelineType = "first-login" | "next-week";

/**
 * Parámetros para crear contenido de la próxima semana
 */
export interface CreateNextWeekContentParams {
  pipelineType: PipelineType;
  startDate?: string; // Requerido solo para "next-week", opcional para "first-login"
  endDate?: string; // Requerido solo para "next-week", opcional para "first-login"
}

/**
 * Respuesta del API para crear contenido de la próxima semana
 */
export interface CreateNextWeekContentResponse {
  statusCode: number;
  result: {
    message: string;
  };
}

/**
 * Opciones para la función unificada de creación de contenido
 */
export interface CreateContentOptions {
  maxRetries?: number; // Máximo número de intentos para verificar contenido (default: 10)
  retryDelay?: number; // Delay entre verificaciones en ms (default: 3000)
  fixIncompleteIdeas?: boolean; // Si debe reparar ideas incompletas automáticamente (default: true)
}
