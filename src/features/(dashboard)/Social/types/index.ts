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
 * Modelos de contenido (nuevo pipeline)
 */
export enum Platform {
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  YOUTUBE = "youtube",
}

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export enum DayTime {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
}

export enum ContentStatus {
  DRAFT = "draft",
  IN_PROCESS = "in_process",
  READY = "ready",
  INTERNAL_PUBLISHED = "internal_published",
  SOCIAL_PUBLISHED = "social_published",
  REJECTED = "rejected",
}

export enum ContentIntention {
  CONNECTION = "connection",
  CONVERSION = "conversion",
  AUTHORITY = "authority",
  EDUCATION = "education",
}

export enum ContentNarrative {
  STORYTELLING = "storytelling",
  HOW_TO = "how-to",
}

export enum TensionLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum CtaType {
  COMMENT = "comment",
  DM = "dm",
  PERFIL = "perfil",
  SAVE = "save",
  FOLLOW = "follow",
  BIO = "bio",
  SHARE = "share",
  CLICK = "click",
}

export enum CameraType {
  SELFIE = "selfie",
  SCREEN = "screen",
  BACK = "back",
}

export enum ShotType {
  SHORT_PLANE = "short_plane",
  MEDIUM_PLANE = "medium_plane",
  OPEN_PLANE = "open_plane",
}

export enum OverlayType {
  SIMPLE_TEXT = "simple_text",
  SUBTITLES = "subtitles",
  MEDIA = "media",
  NARRATIVE_TEXT = "narrative_text",
}

export interface PublishDate {
  date: string;
}

export interface StrategyDetails {
  intention: ContentIntention;
  narrative: ContentNarrative;
  sceneStrategyId: string;
  tensionLevel: TensionLevel;
  ctaType: CtaType;
  hookFunction: string;
}

export interface NarrativeDetails {
  message: string;
  proofType: string;
}

export interface ContentBlueprint {
  scenes: SceneBlueprint[];
  sound: string;
}

export interface SceneBlueprint {
  camera: CameraType;
  shot: ShotType;
  action: string;
  instruction: string;
  overlays: OverlayBlueprint[];
}

export interface OverlayBlueprint {
  type: OverlayType;
  value: string;
}

export interface IContentPiece {
  id: string;
  weekStrategyId: string;
  platform: Platform;
  title: string | null;
  day: DayOfWeek;
  dayTime: DayTime;
  publishDate: PublishDate;
  status: ContentStatus;
  strategy: StrategyDetails;
  narrativeDetails: NarrativeDetails;
  blueprint: ContentBlueprint;
  script: string[][];
  caption?: string;
}

export interface ContentApiResponse {
  statusCode: number;
  result: {
    contentPieces: unknown[];
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
  dayTime: DayTime;
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
