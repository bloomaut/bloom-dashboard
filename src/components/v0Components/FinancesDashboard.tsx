"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Plus,
  CreditCard,
  Wallet,
  Target,
  AlertCircle,
} from "lucide-react";
import { GoalsCard } from "./GoalCard";
import { FinancialChart } from "./FinancialChart";
import { TransactionList } from "./TransactionList";
import { BudgetTracker } from "./BudgetTracker";
import { useEffect, useState } from "react";
import { getFinances } from "@/services/fetch";
import FinanceModal from "@/app/[locale]/(small)/finances/FinanceModal";

export function FinancesDashboard() {
  const [financeData, setFinanceData] = useState();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getFinanceData = async () => {
      const financeData = await getFinances();
      setFinanceData(financeData);
    };
    getFinanceData();
  }, []);

  // Datos simulados
  const chartData = [
    { month: "Ene", income: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", income: 52000, expenses: 35000, profit: 17000 },
    { month: "Mar", income: 48000, expenses: 38000, profit: 10000 },
    { month: "Abr", income: 61000, expenses: 42000, profit: 19000 },
    { month: "May", income: 55000, expenses: 39000, profit: 16000 },
    { month: "Jun", income: 67000, expenses: 45000, profit: 22000 },
  ];

  const recentTransactions = [
    {
      id: "1",
      description: "Pago de cliente - Proyecto Web",
      amount: 15000,
      type: "income" as const,
      category: "Servicios",
      date: "Hace 2 horas",
      status: "completed" as const,
    },
    {
      id: "2",
      description: "Compra de software - Adobe Creative",
      amount: -299,
      type: "expense" as const,
      category: "Software",
      date: "Ayer",
      status: "completed" as const,
    },
    {
      id: "3",
      description: "Factura pendiente - Marketing Digital",
      amount: 8500,
      type: "income" as const,
      category: "Servicios",
      date: "Hace 3 días",
      status: "pending" as const,
    },
    {
      id: "4",
      description: "Gastos de oficina - Papelería",
      amount: -150,
      type: "expense" as const,
      category: "Oficina",
      date: "Hace 5 días",
      status: "completed" as const,
    },
  ];

  const budgetCategories = [
    {
      id: "1",
      name: "Marketing y Publicidad",
      budgeted: 5000,
      spent: 3200,
      remaining: 1800,
      status: "on-track" as const,
    },
    {
      id: "2",
      name: "Software y Herramientas",
      budgeted: 1500,
      spent: 1350,
      remaining: 150,
      status: "warning" as const,
    },
    {
      id: "3",
      name: "Gastos de Oficina",
      budgeted: 800,
      spent: 950,
      remaining: -150,
      status: "over-budget" as const,
    },
    {
      id: "4",
      name: "Capacitación",
      budgeted: 2000,
      spent: 450,
      remaining: 1550,
      status: "on-track" as const,
    },
  ];

  // Metas financieras
  const financialGoals = [
    {
      id: "fin-revenue",
      title: "Ingresos mensuales",
      current: 67000,
      target: 80000,
      unit: "$",
      deadline: "31 Dic 2024",
      status: "on-track" as const,
      icon: <DollarSign className='h-4 w-4 text-green-600' />,
    },
    {
      id: "fin-profit",
      title: "Margen de ganancia",
      current: 32.8,
      target: 40.0,
      unit: "%",
      deadline: "31 Mar 2025",
      status: "behind" as const,
      icon: <TrendingUp className='h-4 w-4 text-blue-600' />,
    },
    {
      id: "fin-expenses",
      title: "Reducir gastos operativos",
      current: 45000,
      target: 40000,
      unit: "$",
      deadline: "28 Feb 2025",
      status: "behind" as const,
      icon: <TrendingDown className='h-4 w-4 text-red-600' />,
    },
    {
      id: "fin-savings",
      title: "Fondo de emergencia",
      current: 25000,
      target: 50000,
      unit: "$",
      deadline: "30 Jun 2025",
      status: "on-track" as const,
      icon: <Wallet className='h-4 w-4 text-purple-600' />,
    },
  ];

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Finanzas</h1>
          <div className='flex items-center space-x-3'>
            <Button size='sm' className='bg-red-500 hover:bg-red-600' onClick={() => setOpenModal(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Nueva transacción
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Financial Overview */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Ingresos del mes</p>
                    <p className='text-2xl font-bold text-gray-900'>$67,000</p>
                  </div>
                  <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                    <TrendingUp className='h-6 w-6 text-green-600' />
                  </div>
                </div>
                <p className='text-xs text-green-600 mt-2'>+22% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Gastos del mes</p>
                    <p className='text-2xl font-bold text-gray-900'>$45,000</p>
                  </div>
                  <div className='h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center'>
                    <TrendingDown className='h-6 w-6 text-red-600' />
                  </div>
                </div>
                <p className='text-xs text-red-600 mt-2'>+15% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Ganancia neta</p>
                    <p className='text-2xl font-bold text-gray-900'>$22,000</p>
                  </div>
                  <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <DollarSign className='h-6 w-6 text-blue-600' />
                  </div>
                </div>
                <p className='text-xs text-green-600 mt-2'>+38% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Margen de ganancia</p>
                    <p className='text-2xl font-bold text-gray-900'>32.8%</p>
                  </div>
                  <div className='h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <PieChart className='h-6 w-6 text-purple-600' />
                  </div>
                </div>
                <p className='text-xs text-green-600 mt-2'>+2.1% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Metas Financieras */}
          <section className='mb-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Metas Financieras</h2>
            <GoalsCard platform='finances' goals={financialGoals} />
          </section>

          {/* Tabs Content */}
          <Tabs defaultValue='overview' className='space-y-6'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='overview'>Resumen</TabsTrigger>
              <TabsTrigger value='transactions'>Transacciones</TabsTrigger>
              <TabsTrigger value='budget'>Presupuesto</TabsTrigger>
              <TabsTrigger value='reports'>Reportes</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value='overview' className='space-y-6 min-h-60 items-center justify-center'>
              <div className='w-full h-full min-h-60 flex items-center justify-center'>Próximamente</div>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* <FinancialChart title='Ingresos' data={chartData} type='income' />
                <FinancialChart title='Gastos' data={chartData} type='expenses' />
                <FinancialChart title='Ganancias' data={chartData} type='profit' />
              </div>
                  
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <TransactionList title='Transacciones Recientes' transactions={recentTransactions} />
                <BudgetTracker categories={budgetCategories} /> */}
              </div>
            </TabsContent>

            {/* Transactions */}
            <TabsContent value='transactions' className='space-y-6 min-h-[700px]'>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3'>
                      <Wallet className='h-8 w-8 text-blue-600' />
                      <div>
                        <p className='text-sm font-medium text-gray-600'>Balance actual</p>
                        <p className='text-xl font-bold text-gray-900'>$125,430</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3'>
                      <CreditCard className='h-8 w-8 text-green-600' />
                      <div>
                        <p className='text-sm font-medium text-gray-600'>Ingresos pendientes</p>
                        <p className='text-xl font-bold text-gray-900'>$8,500</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3'>
                      <AlertCircle className='h-8 w-8 text-red-600' />
                      <div>
                        <p className='text-sm font-medium text-gray-600'>Gastos pendientes</p>
                        <p className='text-xl font-bold text-gray-900'>$2,150</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <TransactionList title='Todas las Transacciones' transactions={recentTransactions} />
            </TabsContent>

            {/* Budget */}
            <TabsContent value='budget' className='space-y-6 min-h-60'>
              <div className='w-full h-full min-h-60 flex items-center justify-center'>Próximamente</div>
              {/*   <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <BudgetTracker categories={budgetCategories} />

                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Presupuesto</CardTitle>
                    <CardDescription>Estado general del presupuesto mensual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex justify-between items-center p-4 bg-blue-50 rounded-lg'>
                        <div>
                          <p className='font-medium text-blue-900'>Presupuesto total</p>
                          <p className='text-sm text-blue-700'>Asignado para este mes</p>
                        </div>
                        <p className='text-xl font-bold text-blue-900'>$9,300</p>
                      </div>

                      <div className='flex justify-between items-center p-4 bg-red-50 rounded-lg'>
                        <div>
                          <p className='font-medium text-red-900'>Total gastado</p>
                          <p className='text-sm text-red-700'>Gastos acumulados</p>
                        </div>
                        <p className='text-xl font-bold text-red-900'>$5,950</p>
                      </div>

                      <div className='flex justify-between items-center p-4 bg-green-50 rounded-lg'>
                        <div>
                          <p className='font-medium text-green-900'>Disponible</p>
                          <p className='text-sm text-green-700'>Restante del presupuesto</p>
                        </div>
                        <p className='text-xl font-bold text-green-900'>$3,350</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}
            </TabsContent>

            {/* Reports */}
            <TabsContent value='reports' className='space-y-6 min-h-60'>
              <div className='w-full h-full min-h-60 flex items-center justify-center'>Próximamente</div>
              {/*  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3'>
                      <Target className='h-8 w-8 text-blue-600' />
                      <div>
                        <h3 className='font-medium text-gray-900'>Reporte Mensual</h3>
                        <p className='text-sm text-gray-500'>Resumen financiero del mes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3'>
                      <PieChart className='h-8 w-8 text-green-600' />
                      <div>
                        <h3 className='font-medium text-gray-900'>Análisis de Gastos</h3>
                        <p className='text-sm text-gray-500'>Desglose por categorías</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3'>
                      <TrendingUp className='h-8 w-8 text-purple-600' />
                      <div>
                        <h3 className='font-medium text-gray-900'>Proyección Anual</h3>
                        <p className='text-sm text-gray-500'>Estimación de ingresos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {openModal && <FinanceModal setModal={setOpenModal} />}
    </div>
  );
}
