"use client";

import { ProfileInfoCard } from "@/components/v0Components/profile-info-card";
import { GoalsCard } from "@/components/v0Components/goals-card";
import { ScheduleCard } from "@/components/v0Components/schedule-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Settings, Bell, TrendingUp, Users, Heart, Grid3X3 } from "lucide-react";
import { AppDownload } from "@/components/v0Components/app-download";
import { ContentCalendarExample } from "./content-calendar-example";

export function SocialMediaDashboard() {
  // Datos simulados de los perfiles conectados
  const profilesData = [
    {
      platform: "instagram" as const,
      username: "mi_negocio",
      followers: 2450,
      following: 180,
      posts: 127,
      engagement: 4.2,
      isVerified: false,
      goalsCompletion: 67, // Add this line
    },
    {
      platform: "tiktok" as const,
      username: "mi_negocio_tk",
      followers: 1200,
      following: 95,
      posts: 45,
      engagement: 6.8,
      isVerified: false,
      goalsCompletion: 50, // Add this line
    },
  ];

  // Metas generadas por la plataforma
  const instagramGoals = [
    {
      id: "ig-followers",
      title: "Alcanzar seguidores",
      current: 2450,
      target: 3000,
      unit: "seguidores",
      deadline: "31 Dic 2024",
      status: "on-track" as const,
      icon: <Users className='h-4 w-4 text-blue-600' />,
    },
    {
      id: "ig-posts",
      title: "Publicaciones mensuales",
      current: 8,
      target: 12,
      unit: "posts",
      deadline: "31 Ene 2025",
      status: "behind" as const,
      icon: <Grid3X3 className='h-4 w-4 text-purple-600' />,
    },
    {
      id: "ig-engagement",
      title: "Tasa de engagement",
      current: 4.2,
      target: 5.0,
      unit: "%",
      deadline: "28 Feb 2025",
      status: "on-track" as const,
      icon: <Heart className='h-4 w-4 text-red-600' />,
    },
  ];

  const tiktokGoals = [
    {
      id: "tk-followers",
      title: "Alcanzar seguidores",
      current: 1200,
      target: 2000,
      unit: "seguidores",
      deadline: "31 Dic 2024",
      status: "on-track" as const,
      icon: <Users className='h-4 w-4 text-blue-600' />,
    },
    {
      id: "tk-videos",
      title: "Videos semanales",
      current: 2,
      target: 4,
      unit: "videos",
      deadline: "Cada semana",
      status: "behind" as const,
      icon: <Grid3X3 className='h-4 w-4 text-black' />,
    },
  ];

  // Cronograma diario generado automáticamente
  const dailyTasks = [
    {
      id: "daily-1",
      title: "Publicar story de Instagram",
      description: "Compartir contenido behind-the-scenes del día",
      type: "story" as const,
      platform: "instagram" as const,
      day: "Hoy",
      status: "completed" as const,
      priority: "medium" as const,
      details: "Mostrar el proceso de preparación de productos o servicios del día",
    },
    {
      id: "daily-2",
      title: "Responder comentarios",
      description: "Interactuar con seguidores en ambas plataformas",
      type: "engagement" as const,
      platform: "both" as const,
      day: "Hoy",
      status: "in-progress" as const,
      priority: "high" as const,
      details: "Revisar y responder comentarios de las últimas 24 horas en Instagram y TikTok",
    },
    {
      id: "daily-3",
      title: "Crear video para TikTok",
      description: "Grabar video siguiendo la tendencia #SmallBusiness",
      type: "video" as const,
      platform: "tiktok" as const,
      day: "Hoy",
      status: "pending" as const,
      priority: "high" as const,
      details: "Crear contenido siguiendo la tendencia actual, duración 15-30 segundos",
    },
  ];

  // Cronograma semanal
  const weeklyTasks = [
    {
      id: "weekly-1",
      title: "Análisis de métricas",
      description: "Revisar rendimiento de la semana y ajustar estrategia",
      type: "analysis" as const,
      platform: "both" as const,
      day: "Viernes",
      status: "pending" as const,
      priority: "medium" as const,
      details: "Analizar engagement, alcance, impresiones y crecimiento de seguidores",
    },
    {
      id: "weekly-2",
      title: "Planificar contenido siguiente",
      description: "Preparar posts para la próxima semana",
      type: "post" as const,
      platform: "both" as const,
      day: "Domingo",
      status: "pending" as const,
      priority: "high" as const,
      details: "Crear calendario de contenido, preparar imágenes y escribir captions",
    },
  ];

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='text-2xl font-bold text-gray-900'>Dashboard de Redes Sociales</div>
          <div className='flex items-center space-x-3'>
            <Button variant='outline' size='sm' className='cursor-pointer'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Actualizar datos
            </Button>
            <Button variant='outline' size='sm' className='cursor-pointer'>
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
