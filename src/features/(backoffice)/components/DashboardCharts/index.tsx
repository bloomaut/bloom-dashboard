"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from "recharts";
import styles from "./styles.module.scss";

interface UserStats {
  total: number;
  withoutProposal: number;
  inWishList: number;
  withProposal: number;
}

export function DashboardCharts({ userStats }: { userStats: UserStats | null }) {
  // Prepare data for status distribution chart
  const statusData = [
    { name: "Sin Propuesta", value: userStats?.withoutProposal || 0, color: "#4DC2F4" },
    { name: "En Lista de Espera", value: userStats?.inWishList || 0, color: "#6A20A4" },
    { name: "Con Propuesta", value: userStats?.withProposal || 0, color: "#2BA8D4" },
  ];

  const userFlowData = [
    { step: "Total", value: userStats?.total || 0 },
    { step: "En Lista de Espera", value: userStats?.inWishList || 0 },
    { step: "Sin Propuesta", value: userStats?.withoutProposal || 0 },
    { step: "Con Propuesta", value: userStats?.withProposal || 0 },
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
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='#667eea'
                    strokeWidth={4}
                    dot={{ fill: "#667eea", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#764ba2" }}
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
