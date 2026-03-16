import type { SocialMediaProfile } from "../types";

export type SocialMediaView = "setup" | "dashboard";

export function resolveSocialMediaView(params: {
  disableSocialProfile: boolean;
  profile: SocialMediaProfile | null;
  isProfileConnected: boolean;
}): SocialMediaView {
  const { disableSocialProfile, profile, isProfileConnected } = params;

  if (disableSocialProfile) return "dashboard";

  const connected = Boolean(profile?.connected) && Boolean(isProfileConnected);
  return connected ? "dashboard" : "setup";
}
