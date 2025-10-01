"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/v0Components/Sidebar";
import { SocialMediaSetup } from "@/components/v0Components/social-media-setup";
import { SocialMediaDashboard } from "@/components/v0Components/social-media-dashboard";
import { StrategyLoading } from "@/components/v0Components/strategy-loading";
import { getProfile } from "@/services/socialMediaService";

export default function SocialMediaPage() {
  const [connectedAccounts, setConnectedAccounts] = useState({
    instagram: false,
    tiktok: false,
  });
  const [isCreatingStrategies, setIsCreatingStrategies] = useState(false);

  const handleAccountConnection = (platform: "instagram" | "tiktok") => {
    const newConnectedAccounts = {
      ...connectedAccounts,
      [platform]: true,
    };

    if (newConnectedAccounts.tiktok) {
      setIsCreatingStrategies(true);
    }

    setConnectedAccounts(newConnectedAccounts);
  };

  const [profile, setProfile] = useState<any>();

  const fetchProfile = async () => {
    try {
      const profileResponse = await getProfile();
      setProfile(profileResponse.data.result.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className='flex h-full bg-gray-50 w-full' id='social-media-page'>
      {!profile?.connected ? (
        <SocialMediaSetup
          connectedAccounts={connectedAccounts}
          onAccountConnection={handleAccountConnection}
          refetchProfile={fetchProfile}
        />
      ) : (
        <SocialMediaDashboard />
      )}
    </div>
  );
}
