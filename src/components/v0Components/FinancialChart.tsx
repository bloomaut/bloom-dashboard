"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

interface FinancialChartProps {
  title: string;
  data: ChartData[];
  type: "income" | "expenses" | "profit";
}

export function FinancialChart({ title, data, type }: FinancialChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses, d.profit)));

  const getColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-500";
      case "expenses":
        return "bg-red-500";
      case "profit":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getValue = (item: ChartData, type: string) => {
    switch (type) {
      case "income":
        return item.income;
      case "expenses":
        return item.expenses;
      case "profit":
        return item.profit;
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {data.map((item, index) => {
            const value = getValue(item, type);
            const percentage = (value / maxValue) * 100;

            return (
              <div key={index} className='flex items-center space-x-4'>
                <div className='w-16 text-sm font-medium text-gray-600'>{item.month}</div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-sm font-medium'>${value.toLocaleString()}</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className={`h-2 rounded-full ${getColor(type)}`} style={{ width: `${percentage}%` }} />
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
