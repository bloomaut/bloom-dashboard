import { DashboardCharts } from "./DashboardCharts";
import { DashboardStats } from "./DashboardStats";

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <div className='text-3xl font-bold tracking-tight'>Dashboard</div>
        <div className='text-muted-foreground'>Resumen de métricas y estadísticas del sistema</div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts */}
      <DashboardCharts />
    </div>
  );
}
