import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getProfile,
  getContent,
  generateWeekContent,
  createContentIdea,
  fixContentIdeasWithRetry,
  processIncompleteIdeas,
  connectTikTokAccount,
  ContentResponse,
  ProfileData,
  ContentItem,
  IdeaItem,
} from "../services/socialMediaService";

// Interfaces para el estado
export interface SocialMediaState {
  profile: ProfileData | null;
  content: ContentItem[];
  ideas: IdeaItem[];
  isLoading: boolean;
  isGenerating: boolean;
  isCreatingContent: boolean;
  isFixingIdeas: boolean;
  error: string | null;
  incompleteIdeasCount: number;
  lastFetchedDateRange: {
    startDate: string;
    endDate: string;
  } | null;
}

// Estado inicial
const initialState: SocialMediaState = {
  profile: null,
  content: [],
  ideas: [],
  isLoading: false,
  isGenerating: false,
  isCreatingContent: false,
  isFixingIdeas: false,
  error: null,
  incompleteIdeasCount: 0,
  lastFetchedDateRange: null,
};

// Thunks asíncronos

// 1. Obtener perfil del usuario
export const fetchProfile = createAsyncThunk("socialMedia/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const profile = await getProfile();
    return profile;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Error al obtener el perfil");
  }
});

// 2. Obtener contenido por rango de fechas
export const fetchContent = createAsyncThunk(
  "socialMedia/fetchContent",
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const contentResponse = await getContent(startDate, endDate);
      return {
        ...contentResponse,
        dateRange: { startDate, endDate },
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error al obtener el contenido");
    }
  },
);

// 3. Generar contenido semanal
export const generateContent = createAsyncThunk(
  "socialMedia/generateContent",
  async (type: "first-login" | "next-week", { rejectWithValue }) => {
    try {
      const success = await generateWeekContent(type);
      if (!success) {
        throw new Error("Error al generar contenido");
      }
      return { type, success };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error al generar contenido");
    }
  },
);

// 4. Crear idea de contenido manual
export const createContent = createAsyncThunk(
  "socialMedia/createContent",
  async (
    {
      pillar,
      idea,
      date,
      dayTime,
    }: {
      pillar: string;
      idea: string;
      date: string;
      dayTime: "morning" | "afternoon" | "evening";
    },
    { rejectWithValue },
  ) => {
    try {
      const success = await createContentIdea(pillar, idea, date, dayTime);
      if (!success) {
        throw new Error("Error al crear la idea de contenido");
      }
      return { pillar, idea, date, dayTime };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error al crear la idea de contenido");
    }
  },
);

// 5. Reparar ideas incompletas
export const fixIncompleteIdeas = createAsyncThunk(
  "socialMedia/fixIncompleteIdeas",
  async (ideaIds: string[], { rejectWithValue, getState, dispatch }) => {
    try {
      const success = await fixContentIdeasWithRetry(ideaIds);
      if (!success) {
        throw new Error("Error al reparar las ideas de contenido");
      }

      // Después de reparar, refrescar el contenido si tenemos el rango de fechas
      const state = getState() as { socialMedia: SocialMediaState };
      if (state.socialMedia.lastFetchedDateRange) {
        const { startDate, endDate } = state.socialMedia.lastFetchedDateRange;
        dispatch(fetchContent({ startDate, endDate }));
      }

      return ideaIds;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error al reparar las ideas de contenido");
    }
  },
);

// 6. Procesar automáticamente ideas incompletas
export const autoProcessIncompleteIdeas = createAsyncThunk(
  "socialMedia/autoProcessIncompleteIdeas",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { socialMedia: SocialMediaState };
      const incompleteIdeas = state.socialMedia.ideas.filter(idea => !idea.completed);

      if (incompleteIdeas.length === 0) {
        return { processed: 0 };
      }

      const incompleteIds = incompleteIdeas.map(idea => idea._id);
      await dispatch(fixIncompleteIdeas(incompleteIds)).unwrap();

      return { processed: incompleteIds.length };
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al procesar ideas incompletas automáticamente");
    }
  },
);

// 7. Conectar cuenta de TikTok
export const connectTikTok = createAsyncThunk(
  "socialMedia/connectTikTok",
  async (code: string, { rejectWithValue }) => {
    try {
      const success = await connectTikTokAccount(code);
      if (!success) {
        throw new Error("Error al conectar TikTok");
      }
      // Obtener perfil actualizado después de la conexión
      const profile = await getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error al conectar TikTok");
    }
  },
);

// Slice
const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetSocialMediaState: state => {
      return initialState;
    },
    updateContentItem: (state, action: PayloadAction<{ id: string; updates: Partial<ContentItem> }>) => {
      const { id, updates } = action.payload;
      const contentIndex = state.content.findIndex(item => item._id === id);
      if (contentIndex !== -1) {
        state.content[contentIndex] = { ...state.content[contentIndex], ...updates };
      }
    },
    markContentAsCompleted: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const contentIndex = state.content.findIndex(item => item._id === id);
      if (contentIndex !== -1) {
        state.content[contentIndex].completed = true;
      }
    },
    markIdeaAsCompleted: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const ideaIndex = state.ideas.findIndex(item => item._id === id);
      if (ideaIndex !== -1) {
        state.ideas[ideaIndex].completed = true;
        state.incompleteIdeasCount = Math.max(0, state.incompleteIdeasCount - 1);
      }
    },
    updateIncompleteIdeasCount: state => {
      state.incompleteIdeasCount = state.ideas.filter(idea => !idea.completed).length;
    },
  },
  extraReducers: builder => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Content
    builder
      .addCase(fetchContent.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.content = action.payload.result.contents;
        state.ideas = action.payload.result.ideas;
        state.incompleteIdeasCount = action.payload.result.ideas.filter(idea => !idea.completed).length;
        state.lastFetchedDateRange = action.payload.dateRange;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Generate Content
    builder
      .addCase(generateContent.pending, state => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.isGenerating = false;
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });

    // Create Content
    builder
      .addCase(createContent.pending, state => {
        state.isCreatingContent = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isCreatingContent = false;
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isCreatingContent = false;
        state.error = action.payload as string;
      });

    // Fix Incomplete Ideas
    builder
      .addCase(fixIncompleteIdeas.pending, state => {
        state.isFixingIdeas = true;
        state.error = null;
      })
      .addCase(fixIncompleteIdeas.fulfilled, (state, action) => {
        state.isFixingIdeas = false;
      })
      .addCase(fixIncompleteIdeas.rejected, (state, action) => {
        state.isFixingIdeas = false;
        state.error = action.payload as string;
      });

    // Auto Process Incomplete Ideas
    builder
      .addCase(autoProcessIncompleteIdeas.pending, state => {
        state.isFixingIdeas = true;
        state.error = null;
      })
      .addCase(autoProcessIncompleteIdeas.fulfilled, (state, action) => {
        state.isFixingIdeas = false;
      })
      .addCase(autoProcessIncompleteIdeas.rejected, (state, action) => {
        state.isFixingIdeas = false;
        state.error = action.payload as string;
      });

    // Fix Incomplete Ideas
    builder
      .addCase(fixIncompleteIdeas.pending, state => {
        state.isFixingIdeas = true;
        state.error = null;
      })
      .addCase(fixIncompleteIdeas.fulfilled, (state, action) => {
        state.isFixingIdeas = false;
        // Las ideas se actualizarán cuando se refresquen los datos
      })
      .addCase(fixIncompleteIdeas.rejected, (state, action) => {
        state.isFixingIdeas = false;
        state.error = action.payload as string;
      });

    // Auto Process Incomplete Ideas
    builder
      .addCase(autoProcessIncompleteIdeas.pending, state => {
        state.isFixingIdeas = true;
        state.error = null;
      })
      .addCase(autoProcessIncompleteIdeas.fulfilled, (state, action) => {
        state.isFixingIdeas = false;
      })
      .addCase(autoProcessIncompleteIdeas.rejected, (state, action) => {
        state.isFixingIdeas = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const {
  clearError,
  resetSocialMediaState,
  updateContentItem,
  markContentAsCompleted,
  markIdeaAsCompleted,
  updateIncompleteIdeasCount,
} = socialMediaSlice.actions;

// Selectors
export const selectSocialMediaProfile = (state: { socialMedia: SocialMediaState }) => state.socialMedia.profile;
export const selectSocialMediaContent = (state: { socialMedia: SocialMediaState }) => state.socialMedia.content;
export const selectSocialMediaIdeas = (state: { socialMedia: SocialMediaState }) => state.socialMedia.ideas;
export const selectIsLoading = (state: { socialMedia: SocialMediaState }) => state.socialMedia.isLoading;
export const selectIsGenerating = (state: { socialMedia: SocialMediaState }) => state.socialMedia.isGenerating;
export const selectIsCreatingContent = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.isCreatingContent;
export const selectIsFixingIdeas = (state: { socialMedia: SocialMediaState }) => state.socialMedia.isFixingIdeas;
export const selectSocialMediaError = (state: { socialMedia: SocialMediaState }) => state.socialMedia.error;
export const selectIncompleteIdeasCount = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.incompleteIdeasCount;
export const selectLastFetchedDateRange = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.lastFetchedDateRange;

// Helper selectors
export const selectContentByDay = (state: { socialMedia: SocialMediaState }, day: string) =>
  state.socialMedia.content.filter(item => item.day === day);

export const selectContentByPillar = (state: { socialMedia: SocialMediaState }, pillar: string) =>
  state.socialMedia.content.filter(item => item.pillar === pillar);

export const selectIsAnyOperationInProgress = (state: { socialMedia: SocialMediaState }) =>
  state.socialMedia.isLoading ||
  state.socialMedia.isGenerating ||
  state.socialMedia.isCreatingContent ||
  state.socialMedia.isFixingIdeas;

export default socialMediaSlice.reducer;
