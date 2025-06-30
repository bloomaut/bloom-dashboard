import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
}

export function TransactionList({ title, transactions }: TransactionListProps) {
  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "pending":
        return "Pendiente";
      case "failed":
        return "Fallido";
      default:
        return "Desconocido";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Transacciones recientes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50'
            >
              <div className='flex items-center space-x-3'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className='h-4 w-4 text-green-600' />
                  ) : (
                    <ArrowDownRight className='h-4 w-4 text-red-600' />
                  )}
                </div>
                <div>
                  <p className='font-medium text-gray-900'>{transaction.description}</p>
                  <div className='flex items-center space-x-2 text-sm text-gray-500'>
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.date}</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='text-right'>
                  <p className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <Badge className={getStatusColor(transaction.status)} variant='secondary'>
                    {getStatusText(transaction.status)}
                  </Badge>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuItem>Eliminar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
