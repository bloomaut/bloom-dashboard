"use client";

import { useState } from "react";
import { useTutorial } from "@/context/TutorialContext";
import { CRMDashboard } from "@/components/v0Components/CRMDashboard";
import { SectionBlocked } from "@/components/v0Components/SectionBlocked";

export default function CRMPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isCompleted } = useTutorial();

  return (
    <div className='flex h-screen bg-gray-50'>
      {isCompleted ? (
        <CRMDashboard />
      ) : (
        <SectionBlocked
          title='CRM'
          description='El sistema de gestión de clientes estará disponible una vez que completes la configuración inicial de tu cuenta.'
        />
      )}
    </div>
  );
}
