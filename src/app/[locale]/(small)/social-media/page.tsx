"use client";

import { useState } from "react";
import { Sidebar } from "@/components/v0Components/Sidebar";
import { SocialMediaSetup } from "@/components/v0Components/social-media-setup";
import { SocialMediaDashboard } from "@/components/v0Components/social-media-dashboard";
import { StrategyLoading } from "@/components/v0Components/strategy-loading";

export default function SocialMediaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState({
    instagram: false,
    tiktok: false,
  });
  const [isCreatingStrategies, setIsCreatingStrategies] = useState(false);
  const [strategiesReady, setStrategiesReady] = useState(false);

  const hasConnectedAccounts = /* connectedAccounts.instagram && */ connectedAccounts.tiktok;

  const handleAccountConnection = (platform: "instagram" | "tiktok") => {
    const newConnectedAccounts = {
      ...connectedAccounts,
      [platform]: true,
    };

    // Si ambas cuentas van a estar conectadas, activar inmediatamente la creación de estrategias
    if (/* newConnectedAccounts.instagram &&  */ newConnectedAccounts.tiktok) {
      setIsCreatingStrategies(true);
    }

    setConnectedAccounts(newConnectedAccounts);
  };

  const handleStrategiesComplete = () => {
    setIsCreatingStrategies(false);
    setStrategiesReady(true);
  };

  return (
    <div className='flex h-screen bg-gray-50 w-full' id='social-media-page'>
      {!hasConnectedAccounts /*  && !isCreatingStrategies  */ ? (
        <SocialMediaSetup
          connectedAccounts={connectedAccounts}
          onAccountConnection={handleAccountConnection}
        /> /* : isCreatingStrategies ? (
        <StrategyLoading onComplete={handleStrategiesComplete} />
      ) */
      ) : (
        <SocialMediaDashboard />
      )}
    </div>
  );
}
