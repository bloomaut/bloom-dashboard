"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingBag,
  Tag,
  BarChart3,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useCatalogContext } from "@/context/CatalogContext";
import { useCatalogStoreContext } from "@/context/CatalogStoreContext";
import { set } from "react-datepicker/dist/date_utils";
import InventoryForm from "@/app/[locale]/(small)/catalog/InventoryForm";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "low-stock" | "out-of-stock";
  image?: string;
  type: "product" | "service";
}

export function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const { datasets } = useCatalogContext();
  const { fetchDatasetByIdBody } = useCatalogStoreContext();
  const [dataItems, setDataItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const dataIds = datasets.map(dataset => dataset._id);
      const responses = await Promise.all(dataIds.map(id => fetchDatasetByIdBody(id)));
      const allDataItems = responses.flatMap(dataset => dataset?.dataItems);
      if (allDataItems.length > 0) {
        setDataItems(allDataItems);
      }
      console.log("All dataset details:", responses);
    };

    if (datasets.length > 0) {
      fetchAll();
    }
  }, [datasets]);

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "Activo";
      case "low-stock":
        return "Stock bajo";
      case "out-of-stock":
        return "Sin stock";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Inventario</h1>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Buscar productos...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 w-80'
              />
            </div>
            <Button variant='outline' size='sm'>
              <Filter className='h-4 w-4 mr-2' />
              Filtros
            </Button>
            <Button size='sm' className='bg-red-500 hover:bg-red-600' onClick={() => setModal(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Nuevo producto
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6'>
        <div className='mx-auto'>
          {/* Stats Overview */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Total productos</p>
                    <p className='text-2xl font-bold text-gray-900'>{dataItems.length}</p>
                  </div>
                  <Package className='h-8 w-8 text-blue-600' />
                </div>
                <p className='text-xs text-green-600 mt-2'>+12 este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Valor del inventario</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {dataItems.reduce((sum, item) => {
                        return sum + (item.data.listprice || 0);
                      }, 0)}
                    </p>
                  </div>
                  <TrendingUp className='h-8 w-8 text-green-600' />
                </div>
                <p className='text-xs text-green-600 mt-2'>+8% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Stock bajo</p>
                    <p className='text-2xl font-bold text-gray-900'>8</p>
                  </div>
                  <AlertTriangle className='h-8 w-8 text-yellow-600' />
                </div>
                <p className='text-xs text-yellow-600 mt-2'>Requiere atención</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Sin stock</p>
                    <p className='text-2xl font-bold text-gray-900'>3</p>
                  </div>
                  <TrendingDown className='h-8 w-8 text-red-600' />
                </div>
                <p className='text-xs text-red-600 mt-2'>Reabastecer urgente</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='products'>Productos</TabsTrigger>
              <TabsTrigger value='categories'>Categorías</TabsTrigger>
              <TabsTrigger value='promotions'>Promociones</TabsTrigger>
              <TabsTrigger value='analytics'>Análisis</TabsTrigger>
            </TabsList>

            {/* Products */}
            <TabsContent value='products' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Productos y Servicios</CardTitle>
                  <CardDescription>Gestiona tu inventario completo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {dataItems.map(product => (
                      <div
                        key={product._id}
                        className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                      >
                        <div className='flex items-center space-x-4'>
                          <Avatar className='h-12 w-12'>
                            <AvatarImage src={product.data.listimage || "/placeholder.svg"} />
                            <AvatarFallback>
                              {product.data.sku ? <ShoppingBag className='h-6 w-6' /> : <Tag className='h-6 w-6' />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {product.data.listname || product.data.serviceName}
                            </h4>
                            <div className='flex items-center space-x-4 text-sm text-gray-500'>
                              <span>SKU: {product.data.sku}</span>
                              <span>•</span>
                              <span>{product.data.category}</span>
                              <span>•</span>
                              <Badge variant='outline' className='text-xs'>
                                {product.data.sku ? "Producto" : "Servicio"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center space-x-6'>
                          <div className='text-right'>
                            <p className='font-medium text-gray-900'>${product.data.listPrice}</p>
                            {product.data.type === "product" && (
                              <p className='text-sm text-gray-500'>Stock: {product.data.stock}</p>
                            )}
                          </div>
                          <Badge className={getStatusColor(product.data.status)} variant='secondary'>
                            {getStatusText(product.data.status)}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem>
                                <Eye className='h-4 w-4 mr-2' />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className='h-4 w-4 mr-2' />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className='h-4 w-4 mr-2' />
                                Ver estadísticas
                              </DropdownMenuItem>
                              <DropdownMenuItem className='text-red-600'>
                                <Trash2 className='h-4 w-4 mr-2' />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories */}
            <TabsContent value='categories' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Categorías</CardTitle>
                  <CardDescription>Organiza tus productos por categorías</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12 text-gray-500'>
                    <Package className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>Gestión de categorías próximamente</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Promotions */}
            <TabsContent value='promotions' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Promociones Activas</CardTitle>
                  <CardDescription>Crea y gestiona ofertas especiales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12 text-gray-500'>
                    <Tag className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>Sistema de promociones próximamente</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value='analytics' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Inventario</CardTitle>
                  <CardDescription>Estadísticas y reportes de tu inventario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12 text-gray-500'>
                    <BarChart3 className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>Análisis y reportes próximamente</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {modal && <InventoryForm setModal={setModal} />}
    </div>
  );
}
