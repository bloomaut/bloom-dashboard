import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ContentResponse {
  id: string;
  pillar: string;
  idea: string;
  date: string;
  status: string;
}

interface ContentIdeaResponse {
  id: string;
  pillar: string;
  idea: string;
  date: string;
}

interface SocialProfileInfo {
  platform: string;
  name: string;
  handle: string;
  followers: number;
  engagement: number;
}

interface TikTokConnectionResponse {
  success: boolean;
  accountInfo: {
    name: string;
    handle: string;
  };
}

export const getContent = async (startDate: string, endDate: string): Promise<any[]> => {
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

export const getProfile = async (): Promise<any> => {
  try {
    const response = await axios.get(`/api/social-media/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

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

export const createContentIdea = async (
  pillar: string,
  idea: string,
  date: string,
  dayTime: string,
): Promise<ContentIdeaResponse> => {
  try {
    const response = await axios.post(`/api/social-media/create-content-idea`, {
      pillar,
      idea,
      date,
      dayTime,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating content idea:", error);
    throw error;
  }
};

export const connectTikTokAccount = async (authToken: string): Promise<TikTokConnectionResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/social-media/connect-social-account/tiktok`, {
      auth_token: authToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error connecting TikTok account:", error);
    throw error;
  }
};

export const getSocialProfileInfo = async (platform: "tiktok" | "instagram"): Promise<SocialProfileInfo> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/social-media/social-profile-info`, {
      params: {
        platform,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching social profile info:", error);
    throw error;
  }
};

export const generateWeekContent = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.put(`/api/social-media/pipeline/next-week`);
    return response.data;
  } catch (error) {
    console.error("Error generating week content:", error);
    throw error;
  }
};

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

      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  return false;
};
