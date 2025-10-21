import axios from "axios";

// Interfaces para tipado
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

export interface ContentResponse {
  statusCode: number;
  result: {
    contents: ContentItem[];
    ideas: IdeaItem[];
  };
}

export interface ProfileData {
  name: string;
  description: string;
  target_audience: string;
  tone: string;
  pillars: string[];
  connected_accounts: {
    instagram: boolean;
    tiktok: boolean;
  };
}

export interface CreateContentIdeaRequest {
  idea: string;
  pillar: string;
  date: Date;
  dayTime: "morning" | "afternoon" | "evening";
}

// 1. Endpoint para obtener el perfil del usuario
export const getProfile = async (): Promise<ProfileData> => {
  try {
    const response = await axios.get(`/api/social-media/profile`);

    const apiResult = response.data;

    // Transform API response to match ProfileData interface
    const transformedProfile: ProfileData = {
      name: apiResult.profile?.username || "",
      description: apiResult.profile?.bio || "",
      target_audience: apiResult.profile?.target_audience || "",
      tone: apiResult.profile?.tone || "",
      pillars: apiResult.profile?.pillars || [],
      connected_accounts: {
        instagram: false, // Instagram not implemented yet
        tiktok: apiResult.connected || false,
      },
    };

    return transformedProfile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// 2. Endpoint para obtener contenido por rango de fechas
export const getContent = async (startDate: string, endDate: string): Promise<ContentResponse> => {
  try {
    const response = await axios.get(`/api/social-media/content`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

// 3. Endpoint para reparar ideas de contenido incompletas
export const fixContentIdeas = async (contentIdeaIds: string[]): Promise<boolean> => {
  try {
    const response = await axios.post(`/api/social-media/fix-content-ideas`, {
      ids: contentIdeaIds,
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error fixing content ideas:", error);
    throw error;
  }
};

// 3.1. Función para reparar ideas con reintentos automáticos
export const fixContentIdeasWithRetry = async (contentIdeaIds: string[], maxRetries: number = 3): Promise<boolean> => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const success = await fixContentIdeas(contentIdeaIds);
      if (success) {
        return true;
      }
    } catch (error) {
      attempts++;
      console.warn(`Fix content ideas attempt ${attempts} failed:`, error);

      if (attempts >= maxRetries) {
        throw new Error(`Failed to fix content ideas after ${maxRetries} attempts`);
      }

      // Espera exponencial entre reintentos
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  return false;
};

// 3.2. Función para procesar ideas incompletas automáticamente
export const processIncompleteIdeas = async (
  contentResponse: ContentResponse,
  maxRetries: number = 3,
): Promise<ContentResponse> => {
  const incompleteIdeas = contentResponse.result.ideas.filter(idea => !idea.completed);

  if (incompleteIdeas.length === 0) {
    return contentResponse;
  }

  const incompleteIds = incompleteIdeas.map(idea => idea._id);

  try {
    await fixContentIdeasWithRetry(incompleteIds, maxRetries);
    return contentResponse;
  } catch (error) {
    console.error("Error processing incomplete ideas:", error);
    throw error;
  }
};

// 4. Endpoint para generar contenido semanal
export const generateWeekContent = async (type: "first-login" | "next-week"): Promise<boolean> => {
  try {
    const response = await axios.put(`/api/social-media/pipeline?pipelineType=${type}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error generating week content:", error);
    throw error;
  }
};

// 5. Endpoint para crear una idea de contenido manual
export const createContentIdea = async (
  pillar: string,
  idea: string,
  date: string,
  dayTime: "morning" | "afternoon" | "evening",
): Promise<boolean> => {
  try {
    const response = await axios.post(`/api/social-media/create-content-idea`, {
      idea,
      pillar,
      date: new Date(date),
      dayTime,
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error creating content idea:", error);
    throw error;
  }
};

// 6. Endpoint para conectar cuenta de TikTok
export const connectTikTokAccount = async (code: string): Promise<boolean> => {
  try {
    const response = await axios.put(`/api/social-media/connect/tiktok`, {
      code: code,
    });
    console.log("connectTikTokAccount:", response.data);
    return response.status === 200;
  } catch (error) {
    console.error("Error connecting TikTok account:", error);
    throw error;
  }
};
