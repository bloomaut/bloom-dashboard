"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from "recharts";
import styles from "./styles.module.scss";

interface UserStats {
  total: number;
  inWishList: number;
  withOnBoardingCompleted?: number;
}

export function DashboardCharts({ userStats }: { userStats: UserStats | null }) {
  const total = userStats?.total ?? 0;
  const inWishList = userStats?.inWishList ?? 0;
  const withOnBoardingCompleted = userStats?.withOnBoardingCompleted ?? 0;
  const others = Math.max(0, total - inWishList - withOnBoardingCompleted);

  // Prepare data for status distribution chart
  const statusData = [
    { name: "Lista de Espera", value: inWishList, color: "#4DC2F4" },
    { name: "Onboarding Completado", value: withOnBoardingCompleted, color: "#5A0075" },
    { name: "Otros", value: others, color: "#767676" },
  ];

  const userFlowData = [
    { step: "Total", value: total },
    { step: "Lista de Espera", value: inWishList },
    { step: "Onboarding Completado", value: withOnBoardingCompleted },
  ];

  return (
    <div className={styles.chartsContainer}>
      {/* Second row with two charts */}
      <div className={styles.chartsGrid}>
        {/* User Status Distribution */}
        <Card className={styles.chartCard}>
          <CardHeader className={styles.chartHeader}>
            <CardTitle className={styles.chartTitle}>Estado de Usuarios</CardTitle>
            <p className={styles.chartDescription}>Distribución de usuarios por estado actual</p>
          </CardHeader>
          <CardContent>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx='50%'
                    cy='50%'
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey='value'
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(15, 23, 42, 0.12)",
                      borderRadius: "8px",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Flow Funnel */}
        <Card className={styles.chartCard}>
          <CardHeader className={styles.chartHeader}>
            <CardTitle className={styles.chartTitle}>Flujo de Usuarios</CardTitle>
            <p className={styles.chartDescription}>Progresión de usuarios a través del sistema</p>
          </CardHeader>
          <CardContent>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={userFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey='step' angle={-45} textAnchor='end' height={60} fontSize={12} stroke='#64748b' />
                  <YAxis stroke='#64748b' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(15, 23, 42, 0.12)",
                      borderRadius: "8px",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='#4DC2F4'
                    strokeWidth={4}
                    dot={{ fill: "#4DC2F4", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#F44336" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
