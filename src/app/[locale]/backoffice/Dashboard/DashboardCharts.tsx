"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from "recharts";

const monthlyData = [
  { month: "Ene", usuarios: 186, propuestas: 12 },
  { month: "Feb", usuarios: 305, propuestas: 18 },
  { month: "Mar", usuarios: 237, propuestas: 15 },
  { month: "Abr", usuarios: 273, propuestas: 22 },
  { month: "May", usuarios: 209, propuestas: 19 },
  { month: "Jun", usuarios: 314, propuestas: 25 },
];

const userFlowData = [
  { step: "Visitantes", value: 10000 },
  { step: "Registro", value: 2847 },
  { step: "Propuesta", value: 156 },
];

const statusData = [
  { name: "En Lista de Espera", value: 1847, color: "#4DC2F4" },
  { name: "En Proceso", value: 1000, color: "#6A20A4" },
  { name: "Con Propuesta", value: 1234, color: "#2BA8D4" }, // Variante más oscura del primario
];

const chartConfig = {
  usuarios: {
    label: "Usuarios",
    color: "#4DC2F4",
  },
  propuestas: {
    label: "Propuestas",
    color: "#6A20A4",
  },
  value: {
    label: "Valor",
    color: "#4DC2F4",
  },
};

export function DashboardCharts() {
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
