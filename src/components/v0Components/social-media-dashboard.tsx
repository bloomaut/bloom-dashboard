"use client";

import { useState } from "react";
import { ProfileInfoCard } from "@/components/v0Components/profile-info-card";
import { GoalsCard } from "@/components/v0Components/goals-card";
import { ScheduleCard } from "@/components/v0Components/schedule-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Settings, Bell, TrendingUp, Users, Heart, Grid3X3 } from "lucide-react";
import { AppDownload } from "@/components/v0Components/app-download";
import { ContentCalendarExample } from "./content-calendar-example";
import { CreateContentModal } from "./create-content-modal";

export function SocialMediaDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateContentSuccess = () => {
    // Aquí podrías agregar lógica para refrescar los datos del calendario
    console.log("Contenido creado exitosamente");
  };

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Modal */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateContentSuccess}
      />

      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='text-2xl font-bold text-gray-900'>Dashboard de Redes Sociales</div>
          <div className='flex items-center space-x-3'>
            <Button variant='outline' size='sm' className='cursor-pointer'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Actualizar datos
            </Button>
            <Button variant='outline' size='sm' className='cursor-pointer' onClick={() => setIsCreateModalOpen(true)}>
              <Settings className='h-4 w-4 mr-2' />
              Generar
            </Button>
          </div>
        </div>
      </header>
      <ContentCalendarExample />
    </div>
  );
}
