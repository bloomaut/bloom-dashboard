import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  status: "on-track" | "warning" | "over-budget";
}

interface BudgetTrackerProps {
  categories: BudgetCategory[];
}

export function BudgetTracker({ categories }: BudgetTrackerProps) {
  const getStatusIcon = (status: BudgetCategory["status"]) => {
    switch (status) {
      case "on-track":
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case "warning":
        return <Clock className='h-4 w-4 text-yellow-600' />;
      case "over-budget":
        return <AlertTriangle className='h-4 w-4 text-red-600' />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: BudgetCategory["status"]) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "over-budget":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: BudgetCategory["status"]) => {
    switch (status) {
      case "on-track":
        return "En objetivo";
      case "warning":
        return "Atención";
      case "over-budget":
        return "Excedido";
      default:
        return "Desconocido";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguimiento de Presupuesto</CardTitle>
        <CardDescription>Control de gastos por categoría</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {categories.map(category => {
            const percentage = (category.spent / category.budgeted) * 100;
            const progressColor = percentage > 100 ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500";

            return (
              <div key={category.id} className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    {getStatusIcon(category.status)}
                    <h4 className='font-medium text-gray-900'>{category.name}</h4>
                  </div>
                  <Badge className={getStatusColor(category.status)} variant='secondary'>
                    {getStatusText(category.status)}
                  </Badge>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Gastado: ${category.spent.toLocaleString()}</span>
                    <span>Presupuesto: ${category.budgeted.toLocaleString()}</span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className='h-2' />
                  <div className='flex justify-between text-xs text-gray-500'>
                    <span>{percentage.toFixed(1)}% utilizado</span>
                    <span className={category.remaining >= 0 ? "text-green-600" : "text-red-600"}>
                      {category.remaining >= 0 ? "Restante" : "Excedido"}: $
                      {Math.abs(category.remaining).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
