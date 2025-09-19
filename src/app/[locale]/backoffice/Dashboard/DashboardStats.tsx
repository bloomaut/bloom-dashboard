import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, FileText, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Usuarios Registrados",
    value: "2,847",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Lista de Espera",
    value: "1,234",
    change: "+8%",
    changeType: "positive" as const,
    icon: UserPlus,
  },
  {
    title: "Propuestas Comerciales",
    value: "156",
    change: "+23%",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Conversión",
    value: "12.5%",
    change: "-2%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
];

export function DashboardStats() {
  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map(stat => (
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
