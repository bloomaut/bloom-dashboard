"use client";
import { useEffect, useState } from "react";
import { getUsersStats } from "@/services/userFetch";
import { DashboardCharts } from "../components/DashboardCharts";
import { DashboardStats } from "../components/DashboardStats";
import styles from "./styles.module.scss";

interface UserStats {
  total: number;
  withoutProposal: number;
  inWishList: number;
  withProposal: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getUsersStats();
        console.log("response: ", response);
        if (response?.data?.statusCode === 200 && response?.data?.result?.users) {
          setStats(response.data.result.users);
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (err: any) {
        console.error("Error fetching user stats:", err);
        setError(err?.message || "Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.title}>Dashboard</div>
        <div className={styles.subtitle}>Resumen de métricas y estadísticas del sistema</div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsSection}>
        <DashboardStats stats={stats} loading={loading} error={error} />
      </div>

      {/* Charts */}
      <div className={styles.chartsSection}>
        <DashboardCharts userStats={stats} />
      </div>
    </div>
  );
}
