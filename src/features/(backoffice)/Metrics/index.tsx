"use client";
import { useEffect, useState } from "react";
import { getUsersStats } from "@/services/userFetch";
import { DashboardCharts } from "../components/DashboardCharts";
import { DashboardStats } from "../components/DashboardStats";
import styles from "./styles.module.scss";

interface UserStats {
  total: number;
  inWishList: number;
  withOnBoardingCompleted?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUsersStats();
        console.log("response 13: ", response);
        const payload: any = response;
        const users = payload?.result?.users ?? payload?.data?.result?.users;

        const next: UserStats = {
          total: Number(users?.total ?? 0),
          inWishList: Number(users?.inWishList ?? 0),
          withOnBoardingCompleted: Number(users?.withOnBoardingCompleted ?? 0),
        };
        setStats(next);
      } catch (err: any) {
        console.error("Error fetching user stats:", err);
        setError("No pudimos cargar las estadísticas. Intentá nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [reloadToken]);

  const handleRetry = () => setReloadToken(v => v + 1);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.title}>Dashboard</div>
        <div className={styles.subtitle}>Resumen de métricas y estadísticas del sistema</div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsSection}>
        <DashboardStats stats={stats} loading={loading} error={error} onRetry={handleRetry} />
      </div>

      {/* Charts */}
      <div className={styles.chartsSection}>
        <DashboardCharts userStats={stats} loading={loading} error={error} onRetry={handleRetry} />
      </div>
    </div>
  );
}
