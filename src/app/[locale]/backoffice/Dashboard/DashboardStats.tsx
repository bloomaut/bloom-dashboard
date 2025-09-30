"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, FileText, TrendingUp } from "lucide-react";

interface UserStats {
  total: number;
  withoutProposal: number;
  inWishList: number;
  withProposal: number;
}

export function DashboardStats({stats, loading, error}: {stats:UserStats | null, loading:boolean, error:string | null}) {

  // Calcular tasa de conversión
  const conversionRate = stats ? 
    stats.total > 0 ? ((stats.withProposal / stats.total) * 100).toFixed(1) : "0.0"
    : "0.0";

  const dashboardStats = [
    {
      title: "Usuarios Registrados",
      value: loading ? "..." : stats?.total?.toLocaleString() || "0",
      change: "--%", // Esto podría venir del endpoint en el futuro
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Lista de Espera",
      value: loading ? "..." : stats?.inWishList?.toLocaleString() || "0",
      change: "--%", // Esto podría venir del endpoint en el futuro
      changeType: "positive" as const,
      icon: UserPlus,
    },
    {
      title: "Con Propuestas",
      value: loading ? "..." : stats?.withProposal?.toLocaleString() || "0",
      change: "--%", // Esto podría venir del endpoint en el futuro
      changeType: "positive" as const,
      icon: FileText,
    },
    {
      title: "Tasa de Conversión",
      value: loading ? "..." : `${conversionRate}%`,
      change: "--%", // Esto podría venir del endpoint en el futuro
      changeType: "negative" as const,
      icon: TrendingUp,
    },
  ];

  if (error) {
    return (
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error al cargar estadísticas: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {dashboardStats.map(stat => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-sm font-medium text-muted-foreground'>{stat.title}</div>
            <stat.icon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
            <div className='text-xs text-secondary'>{stat.change} desde el mes pasado</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
