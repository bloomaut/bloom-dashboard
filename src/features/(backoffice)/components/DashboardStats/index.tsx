"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, FileText, TrendingUp } from "lucide-react";
import styles from "./styles.module.scss";

interface UserStats {
  total: number;
  withoutProposal: number;
  inWishList: number;
  withProposal: number;
}

export function DashboardStats({
  stats,
  loading,
  error,
}: {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
}) {
  // Calcular tasa de conversión
  const conversionRate = stats
    ? stats.total > 0
      ? ((stats.withProposal / stats.total) * 100).toFixed(1)
      : "0.0"
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
      <div className={styles.statsGrid}>
        <Card className={styles.errorCard}>
          <CardContent className={styles.errorContent}>
            <div className={styles.errorMessage}>Error al cargar estadísticas: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>
      {dashboardStats.map(stat => (
        <Card key={stat.title} className={styles.statCard}>
          <CardHeader className={styles.cardHeader}>
            <div className={styles.cardTitle}>{stat.title}</div>
            <stat.icon className={styles.cardIcon} />
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={`${styles.statChange} ${stat.changeType === "negative" ? styles.negative : ""}`}>
              {stat.change} desde el mes pasado
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
