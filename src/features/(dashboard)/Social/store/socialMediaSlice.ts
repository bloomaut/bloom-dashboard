import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getSocialMediaProfile,
  getAndFixSocialMediaContent,
  connectTikTokAndGetProfile,
  createAndWaitForContent,
  createAndWaitForNewContent,
} from "../services/socialMediaService";
import {
  SocialMediaProfile,
  ContentItem,
  GetContentParams,
  ConnectTikTokParams,
  CreateContentParams,
  CreateContentPollingOptions,
  CreateNextWeekContentParams,
  CreateContentOptions,
} from "../types";

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

/**
 * Interface para el caché de contenido
 */
interface ContentCache {
  [key: string]: {
    contents: ContentItem[];
    timestamp: number;
    expiresAt: number;
  };
}

/**
 * Interface para el estado del slice de redes sociales
 */
export interface SocialMediaState {
  // Datos principales
  profile: SocialMediaProfile | null;
  content: ContentItem[];

  // Sistema de caché
  contentCache: ContentCache;
  cacheExpirationTime: number; // Tiempo en ms (default: 5 minutos)

  // Estados de carga
  isLoadingProfile: boolean;
  isLoadingContent: boolean;
  isConnectingTikTok: boolean;
  isGeneratingWeekContent: boolean;
  isCreatingContent: boolean;

  // Manejo de errores
  error: string | null;
  profileError: string | null;
  contentError: string | null;
  tikTokError: string | null;
  generationError: string | null;
  creationError: string | null;

  // Metadatos
  lastFetchedDateRange: {
    startDate: string;
    endDate: string;
  } | null;
  lastProfileUpdate: number | null;
  totalContentCount: number;
}

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialState: SocialMediaState = {
  // Datos principales
  profile: null,
  content: [],

  // Sistema de caché
  contentCache: {},
  cacheExpirationTime: 5 * 60 * 1000, // 5 minutos

  // Estados de carga
  isLoadingProfile: false,
  isLoadingContent: false,
  isConnectingTikTok: false,
  isGeneratingWeekContent: false,
  isCreatingContent: false,

  // Manejo de errores
  error: null,
  profileError: null,
  contentError: null,
  tikTokError: null,
  generationError: null,
  creationError: null,

  // Metadatos
  lastFetchedDateRange: null,
  lastProfileUpdate: null,
  totalContentCount: 0,
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Genera una clave única para el caché basada en el rango de fechas
 */
const generateCacheKey = (startDate: string, endDate: string): string => {
  return `${startDate}_${endDate}`;
};

/**
 * Verifica si los datos en caché están vigentes
 */
const isCacheValid = (cacheEntry: ContentCache[string]): boolean => {
  return Date.now() < cacheEntry.expiresAt;
};

/**
 * Limpia entradas de caché expiradas
 */
const cleanExpiredCache = (cache: ContentCache): ContentCache => {
  const now = Date.now();
  const cleanedCache: ContentCache = {};

  Object.entries(cache).forEach(([key, entry]) => {
    if (entry.expiresAt > now) {
      cleanedCache[key] = entry;
    }
  });

  return cleanedCache;
};

// ============================================================================
// THUNKS ASÍNCRONOS
// ============================================================================

/**
 * 1. Obtener perfil de redes sociales del usuario
 */
export const fetchProfile = createAsyncThunk("socialMedia/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    console.log("🔄 Obteniendo perfil de usuario...");
    const profile = await getSocialMediaProfile();
    console.log("✅ Perfil obtenido exitosamente:", profile.username);
    return profile;
  } catch (error: any) {
    console.error("❌ Error al obtener perfil:", error);
    return rejectWithValue(error.message || "Error al obtener el perfil");
  }
});

/**
 * 2. Obtener contenido con sistema de caché inteligente
 */
export const fetchContent = createAsyncThunk(
  "socialMedia/fetchContent",
  async (params: GetContentParams & { forceRefresh?: boolean }, { getState, rejectWithValue }) => {
    try {
      const { startDate, endDate, forceRefresh = false } = params;
      const state = getState() as { socialMedia: SocialMediaState };
      const cacheKey = generateCacheKey(startDate, endDate);

      console.log("🔄 Obteniendo contenido para:", { startDate, endDate, forceRefresh });

      // Verificar caché si no se fuerza la actualización
      if (!forceRefresh && state.socialMedia.contentCache[cacheKey]) {
        const cacheEntry = state.socialMedia.contentCache[cacheKey];
        if (isCacheValid(cacheEntry)) {
          console.log("📦 Contenido obtenido desde caché");
          return {
            contents: cacheEntry.contents,
            dateRange: { startDate, endDate },
            fromCache: true,
          };
        }
      }

      // Obtener datos frescos de la API
      const { contents } = await getAndFixSocialMediaContent({ startDate, endDate });
      console.log("✅ Contenido obtenido desde API:", contents.length, "elementos");

      return {
        contents,
        dateRange: { startDate, endDate },
        fromCache: false,
      };
    } catch (error: any) {
      console.error("❌ Error al obtener contenido:", error);
      return rejectWithValue(error.message || "Error al obtener el contenido");
    }
  },
);

/**
 * 3. Conectar cuenta de TikTok y obtener perfil actualizado
 */
export const connectTikTok = createAsyncThunk(
  "socialMedia/connectTikTok",
  async (params: ConnectTikTokParams, { rejectWithValue }) => {
    try {
      console.log("🔄 Conectando cuenta de TikTok...");
      const updatedProfile = await connectTikTokAndGetProfile(params);
      console.log("✅ TikTok conectado exitosamente:", updatedProfile.connected);
      return updatedProfile;
    } catch (error: any) {
      console.error("❌ Error al conectar TikTok:", error);
      return rejectWithValue(error.message || "Error al conectar TikTok");
    }
  },
);

/**
 * 4. Generar contenido semanal (first-login o next-week)
 */
export const generateWeekContent = createAsyncThunk(
  "socialMedia/generateWeekContent",
  async (params: CreateNextWeekContentParams & { options?: CreateContentOptions }, { rejectWithValue }) => {
    try {
      const { options, ...contentParams } = params;
      console.log("🔄 Generando contenido semanal:", contentParams.pipelineType);

      const { contents } = await createAndWaitForContent(contentParams, options);
      console.log("✅ Contenido semanal generado:", contents.length, "elementos");

      return {
        contents,
        pipelineType: contentParams.pipelineType,
      };
    } catch (error: any) {
      console.error("❌ Error al generar contenido semanal:", error);
      return rejectWithValue(error.message || "Error al generar contenido semanal");
    }
  },
);

/**
 * 5. Crear contenido individual
 */
export const createSingleContent = createAsyncThunk(
  "socialMedia/createSingleContent",
  async (params: CreateContentParams & { options?: CreateContentPollingOptions }, { rejectWithValue }) => {
    try {
      const { options, ...contentParams } = params;
      console.log("🔄 Creando contenido individual:", contentParams.idea);

      const newContent = await createAndWaitForNewContent(contentParams, options);
      console.log("✅ Contenido individual creado:", newContent._id);

      return newContent;
    } catch (error: any) {
      console.error("❌ Error al crear contenido individual:", error);
      return rejectWithValue(error.message || "Error al crear contenido individual");
    }
  },
);

/**
 * 6. Flujo completo: Conectar TikTok + Generar contenido inicial
 */
export const connectTikTokAndGenerateInitialContent = createAsyncThunk(
  "socialMedia/connectTikTokAndGenerateInitialContent",
  async (params: ConnectTikTokParams & { contentOptions?: CreateContentOptions }, { dispatch, rejectWithValue }) => {
    try {
      console.log("🔄 Iniciando flujo completo: TikTok + contenido inicial...");

      // Paso 1: Conectar TikTok
      const profile = await dispatch(connectTikTok(params)).unwrap();

      // Paso 2: Generar contenido inicial (first-login)
      const contentResult = await dispatch(
        generateWeekContent({
          pipelineType: "first-login",
          options: params.contentOptions,
        }),
      ).unwrap();

      console.log("✅ Flujo completo exitoso");
      return {
        profile,
        contents: contentResult.contents,
      };
    } catch (error: any) {
      console.error("❌ Error en flujo completo:", error);
      return rejectWithValue(error.message || "Error en el flujo completo");
    }
  },
);

// ============================================================================
// SLICE
// ============================================================================

const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState,
  reducers: {
    // Manejo de errores
    clearError: state => {
      state.error = null;
    },
    clearAllErrors: state => {
      state.error = null;
      state.profileError = null;
      state.contentError = null;
      state.tikTokError = null;
      state.generationError = null;
      state.creationError = null;
    },

    // Reset del estado
    resetSocialMediaState: () => initialState,

    // Gestión de contenido
    updateContentItem: (state, action: PayloadAction<{ id: string; updates: Partial<ContentItem> }>) => {
      const { id, updates } = action.payload;
      const contentIndex = state.content.findIndex(item => item._id === id);
      if (contentIndex !== -1) {
        state.content[contentIndex] = { ...state.content[contentIndex], ...updates };

        // Actualizar también en caché si existe
        Object.keys(state.contentCache).forEach(cacheKey => {
          const cacheEntry = state.contentCache[cacheKey];
          const cacheContentIndex = cacheEntry.contents.findIndex(item => item._id === id);
          if (cacheContentIndex !== -1) {
            cacheEntry.contents[cacheContentIndex] = { ...cacheEntry.contents[cacheContentIndex], ...updates };
          }
        });
      }
    },

    markContentAsCompleted: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const contentIndex = state.content.findIndex(item => item._id === id);
      if (contentIndex !== -1) {
        state.content[contentIndex].completed = true;

        // Actualizar también en caché
        Object.keys(state.contentCache).forEach(cacheKey => {
          const cacheEntry = state.contentCache[cacheKey];
          const cacheContentIndex = cacheEntry.contents.findIndex(item => item._id === id);
          if (cacheContentIndex !== -1) {
            cacheEntry.contents[cacheContentIndex].completed = true;
          }
        });
      }
    },

    // Gestión de caché
    setCacheExpirationTime: (state, action: PayloadAction<number>) => {
      state.cacheExpirationTime = action.payload;
    },

    clearCache: state => {
      state.contentCache = {};
    },

    clearExpiredCache: state => {
      state.contentCache = cleanExpiredCache(state.contentCache);
    },

    // Agregar contenido al estado actual (para contenido nuevo)
    addContentItem: (state, action: PayloadAction<ContentItem>) => {
      const newContent = action.payload;
      const existingIndex = state.content.findIndex(item => item._id === newContent._id);

      if (existingIndex === -1) {
        state.content.push(newContent);
        state.totalContentCount += 1;

        // Invalidar caché relacionado
        const contentDate = newContent.day.split("T")[0]; // Extraer fecha YYYY-MM-DD
        Object.keys(state.contentCache).forEach(cacheKey => {
          const [startDate, endDate] = cacheKey.split("_");
          if (contentDate >= startDate && contentDate <= endDate) {
            delete state.contentCache[cacheKey];
          }
        });
      }
    },
  },

  extraReducers: builder => {
    // ========================================================================
    // FETCH PROFILE
    // ========================================================================
    builder
      .addCase(fetchProfile.pending, state => {
        state.isLoadingProfile = true;
        state.profileError = null;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.profile = action.payload;
        state.lastProfileUpdate = Date.now();
        state.profileError = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.profileError = action.payload as string;
        state.error = action.payload as string;
      });

    // ========================================================================
    // FETCH CONTENT
    // ========================================================================
    builder
      .addCase(fetchContent.pending, state => {
        state.isLoadingContent = true;
        state.contentError = null;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoadingContent = false;
        state.content = action.payload.contents;
        state.totalContentCount = action.payload.contents.length;
        state.lastFetchedDateRange = action.payload.dateRange;
        state.contentError = null;

        // Actualizar caché si no viene del caché
        if (!action.payload.fromCache) {
          const cacheKey = generateCacheKey(action.payload.dateRange.startDate, action.payload.dateRange.endDate);

          // Limpiar caché expirado antes de agregar nuevo
          state.contentCache = cleanExpiredCache(state.contentCache);

          // Agregar al caché
          state.contentCache[cacheKey] = {
            contents: action.payload.contents,
            timestamp: Date.now(),
            expiresAt: Date.now() + state.cacheExpirationTime,
          };
        }
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoadingContent = false;
        state.contentError = action.payload as string;
        state.error = action.payload as string;
      });

    // ========================================================================
    // CONNECT TIKTOK
    // ========================================================================
    builder
      .addCase(connectTikTok.pending, state => {
        state.isConnectingTikTok = true;
        state.tikTokError = null;
        state.error = null;
      })
      .addCase(connectTikTok.fulfilled, (state, action) => {
        state.isConnectingTikTok = false;
        state.profile = action.payload;
        state.lastProfileUpdate = Date.now();
        state.tikTokError = null;
      })
      .addCase(connectTikTok.rejected, (state, action) => {
        state.isConnectingTikTok = false;
        state.tikTokError = action.payload as string;
        state.error = action.payload as string;
      });

    // ========================================================================
    // GENERATE WEEK CONTENT
    // ========================================================================
    builder
      .addCase(generateWeekContent.pending, state => {
        state.isGeneratingWeekContent = true;
        state.generationError = null;
        state.error = null;
      })
      .addCase(generateWeekContent.fulfilled, (state, action) => {
        state.isGeneratingWeekContent = false;

        // Agregar nuevo contenido al estado actual
        const newContents = action.payload.contents;
        newContents.forEach(newContent => {
          const existingIndex = state.content.findIndex(item => item._id === newContent._id);
          if (existingIndex === -1) {
            state.content.push(newContent);
          }
        });

        state.totalContentCount = state.content.length;
        state.generationError = null;

        // Limpiar caché ya que hay contenido nuevo
        state.contentCache = {};
      })
      .addCase(generateWeekContent.rejected, (state, action) => {
        state.isGeneratingWeekContent = false;
        state.generationError = action.payload as string;
        state.error = action.payload as string;
      });

    // ========================================================================
    // CREATE SINGLE CONTENT
    // ========================================================================
    builder
      .addCase(createSingleContent.pending, state => {
        state.isCreatingContent = true;
        state.creationError = null;
        state.error = null;
      })
      .addCase(createSingleContent.fulfilled, (state, action) => {
        state.isCreatingContent = false;

        // Agregar el nuevo contenido
        const newContent = action.payload;
        const existingIndex = state.content.findIndex(item => item._id === newContent._id);

        if (existingIndex === -1) {
          state.content.push(newContent);
          state.totalContentCount += 1;
        }

        state.creationError = null;

        // Invalidar caché relacionado con la fecha del contenido
        const contentDate = newContent.day.split("T")[0];
        Object.keys(state.contentCache).forEach(cacheKey => {
          const [startDate, endDate] = cacheKey.split("_");
          if (contentDate >= startDate && contentDate <= endDate) {
            delete state.contentCache[cacheKey];
          }
        });
      })
      .addCase(createSingleContent.rejected, (state, action) => {
        state.isCreatingContent = false;
        state.creationError = action.payload as string;
        state.error = action.payload as string;
      });

    // ========================================================================
    // CONNECT TIKTOK AND GENERATE INITIAL CONTENT
    // ========================================================================
    builder
      .addCase(connectTikTokAndGenerateInitialContent.pending, state => {
        state.isConnectingTikTok = true;
        state.isGeneratingWeekContent = true;
        state.tikTokError = null;
        state.generationError = null;
        state.error = null;
      })
      .addCase(connectTikTokAndGenerateInitialContent.fulfilled, (state, action) => {
        state.isConnectingTikTok = false;
        state.isGeneratingWeekContent = false;

        // Actualizar perfil
        state.profile = action.payload.profile;
        state.lastProfileUpdate = Date.now();

        // Actualizar contenido
        state.content = action.payload.contents;
        state.totalContentCount = action.payload.contents.length;

        // Limpiar errores
        state.tikTokError = null;
        state.generationError = null;

        // Limpiar caché
        state.contentCache = {};
      })
      .addCase(connectTikTokAndGenerateInitialContent.rejected, (state, action) => {
        state.isConnectingTikTok = false;
        state.isGeneratingWeekContent = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  clearError,
  clearAllErrors,
  resetSocialMediaState,
  updateContentItem,
  markContentAsCompleted,
  setCacheExpirationTime,
  clearCache,
  clearExpiredCache,
  addContentItem,
} = socialMediaSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

// Selectors básicos
export const selectProfile = (state: { socialMedia: SocialMediaState }) => state.socialMedia.profile;
export const selectContent = (state: { socialMedia: SocialMediaState }) => state.socialMedia.content;
export const selectTotalContentCount = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.totalContentCount;

// Selectors de estados de carga
export const selectIsLoadingProfile = (state: { socialMedia: SocialMediaState }) => state.socialMedia.isLoadingProfile;
export const selectIsLoadingContent = (state: { socialMedia: SocialMediaState }) => state.socialMedia.isLoadingContent;
export const selectIsConnectingTikTok = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.isConnectingTikTok;
export const selectIsGeneratingWeekContent = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.isGeneratingWeekContent;
export const selectIsCreatingContent = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.isCreatingContent;

// Selectors de errores
export const selectError = (state: { socialMedia: SocialMediaState }) => state.socialMedia.error;
export const selectProfileError = (state: { socialMedia: SocialMediaState }) => state.socialMedia.profileError;
export const selectContentError = (state: { socialMedia: SocialMediaState }) => state.socialMedia.contentError;
export const selectTikTokError = (state: { socialMedia: SocialMediaState }) => state.socialMedia.tikTokError;
export const selectGenerationError = (state: { socialMedia: SocialMediaState }) => state.socialMedia.generationError;
export const selectCreationError = (state: { socialMedia: SocialMediaState }) => state.socialMedia.creationError;

// Selectors de metadatos
export const selectLastFetchedDateRange = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.lastFetchedDateRange;
export const selectLastProfileUpdate = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.lastProfileUpdate;

// Selectors de caché
export const selectContentCache = (state: { socialMedia: SocialMediaState }) => state.socialMedia.contentCache;
export const selectCacheExpirationTime = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.cacheExpirationTime;

// Selectors computados
export const selectIsAnyOperationInProgress = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.isLoadingProfile ||
  state.socialMedia.isLoadingContent ||
  state.socialMedia.isConnectingTikTok ||
  state.socialMedia.isGeneratingWeekContent ||
  state.socialMedia.isCreatingContent;

export const selectIsProfileConnected = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.profile?.connected || false;

export const selectContentByDay = (state: { socialMedia: SocialMediaState }, day: string) =>
  state.socialMedia.content.filter(item => item.day.startsWith(day));

export const selectContentByPillar = (state: { socialMedia: SocialMediaState }, pillar: string) =>
  state.socialMedia.content.filter(item => item.pillar === pillar);

export const selectContentByDayTime = (
  state: { socialMedia: SocialMediaState },
  dayTime: "morning" | "afternoon" | "evening",
) => state.socialMedia.content.filter(item => item.dayTime === dayTime);

export const selectCompletedContent = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.content.filter(item => item.completed);

export const selectIncompleteContent = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.content.filter(item => !item.completed);

export const selectContentStats = (state: { socialMedia: SocialMediaState }) => {
  const content = state.socialMedia.content;
  return {
    total: content.length,
    completed: content.filter(item => item.completed).length,
    incomplete: content.filter(item => !item.completed).length,
    byDayTime: {
      morning: content.filter(item => item.dayTime === "morning").length,
      afternoon: content.filter(item => item.dayTime === "afternoon").length,
      evening: content.filter(item => item.dayTime === "evening").length,
    },
  };
};

// Selector para verificar si hay datos en caché para un rango específico
export const selectHasCachedContent = (
  state: { socialMedia: SocialMediaState },
  startDate: string,
  endDate: string,
) => {
  const cacheKey = generateCacheKey(startDate, endDate);
  const cacheEntry = state.socialMedia.contentCache[cacheKey];
  return cacheEntry ? isCacheValid(cacheEntry) : false;
};

export default socialMediaSlice.reducer;
