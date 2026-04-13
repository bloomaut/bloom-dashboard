"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, CheckCircle2 } from "lucide-react";
import styles from "./styles.module.scss";

interface UserStats {
  total: number;
  inWishList: number;
  withOnBoardingCompleted?: number;
}

export function DashboardStats({
  stats,
  loading,
  error,
  onRetry,
}: {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}) {
  const withOnBoardingCompleted = stats?.withOnBoardingCompleted ?? 0;

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
      title: "Onboarding Completado",
      value: loading ? "..." : withOnBoardingCompleted.toLocaleString(),
      change: "--%", // Esto podría venir del endpoint en el futuro
      changeType: "positive" as const,
      icon: CheckCircle2,
    },
  ];

  if (error) {
    return (
      <div className={styles.statsGrid}>
        <Card className={styles.errorCard}>
          <CardContent className={styles.errorContent}>
            <div className={styles.errorMessage}>{error}</div>
            {onRetry ? (
              <div className={styles.errorActions}>
                <button className={styles.retryButton} type='button' onClick={onRetry}>
                  Reintentar
                </button>
              </div>
            ) : null}
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
            <div className={styles.statChange}>{stat.change} desde el mes pasado</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
