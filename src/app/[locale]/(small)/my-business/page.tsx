"use client";

import { useState } from "react";
import { Sidebar } from "@/components/v0Components/Sidebar";
import { BusinessDashboard } from "@/components/v0Components/business-dashboard";
import { SectionBlocked } from "@/components/v0Components/SectionBlocked";
import { useTutorial } from "@/context/TutorialContext";

export default function BusinessPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isCompleted } = useTutorial();

  return (
    <div className='flex h-screen bg-gray-50 w-full'>
      <BusinessDashboard />
    </div>
  );
}
