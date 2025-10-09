"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from "recharts";

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
    <div className='space-y-4'>
      {/* Second row with two charts */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* User Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[250px] sm:h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx='50%'
                    cy='50%'
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Flow Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Flujo de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[250px] sm:h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={userFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey='step' angle={-45} textAnchor='end' height={60} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='#4DC2F4'
                    strokeWidth={3}
                    dot={{ fill: "#4DC2F4", strokeWidth: 2, r: 4 }}
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
