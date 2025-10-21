// Social Media Types and Interfaces

export type SocialMediaPlatform = "tiktok" | "instagram";
export type PublishType = "Video" | "Image" | "Story";
export type DayTime = "morning" | "afternoon" | "evening";
export type ContentStatus = "pending" | "completed" | "failed";

export interface ContentItem {
  clientId: string;
  socialMedia: SocialMediaPlatform;
  publishType: PublishType;
  pillar: string;
  day: Date;
  dayTime: DayTime;
  completed: boolean;
  skinxId: string;
  presetId: string;
  content: {
    title: string;
    script: string;
    copy: string;
    hashtags: string | null;
    cta_copy: string | null;
    key_words_copy: string | null;
    feelings: string | null;
    understanding: string | null;
    make: string | null;
    hook: string | null;
  };
}

export interface SocialProfile {
  _id: string;
  clientId: string;
  username: string;
  bio: string;
  avatar: string;
  socialMedia: string;
  connected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectedAccounts {
  instagram: boolean;
  tiktok: boolean;
}

export interface SocialMediaState {
  // Profile data
  profile: SocialProfile | null;

  // Content data
  contentItems: ContentItem[];
  currentWeekOffset: number;

  // Connected accounts
  connectedAccounts: ConnectedAccounts;

  // UI States
  isGeneratingContent: boolean;
  isConnectingAccount: string | null; // platform being connected
  isCreatingStrategies: boolean;

  // Loading states
  loading: {
    profile: boolean;
    content: boolean;
    connecting: boolean;
    generating: boolean;
  };

  // Error states
  error: {
    profile: string | null;
    content: string | null;
    connection: string | null;
    generation: string | null;
  };

  // Last fetch timestamps for cache management
  lastFetch: {
    profile: number | null;
    content: number | null;
  };
}

// API Response types
export interface GetContentResponse {
  result: {
    contents: any[];
    ideas: any[];
  };
}

export interface GetProfileResponse {
  data: {
    result: {
      profile: SocialProfile;
    };
  };
}

export interface CreateContentIdeaRequest {
  pillar: string;
  idea: string;
  date: string;
  dayTime: DayTime;
}

export interface ConnectAccountRequest {
  platform: SocialMediaPlatform;
  code: string;
}

export interface GenerateContentRequest {
  type: "first-login" | "next-week";
}
