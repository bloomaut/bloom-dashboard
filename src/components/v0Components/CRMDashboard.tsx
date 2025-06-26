"use client";

import { useState } from "react";
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
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: "lead" | "prospect" | "customer" | "inactive";
  lastContact: string;
  value: number;
  source: string;
  avatar?: string;
}

interface Deal {
  id: string;
  title: string;
  contact: string;
  value: number;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  probability: number;
  closeDate: string;
}

export function CRMDashboard() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [searchTerm, setSearchTerm] = useState("");

  // Datos simulados
  const contacts: Contact[] = [
    {
      id: "1",
      name: "María González",
      email: "maria@email.com",
      phone: "+54 9 11 1234-5678",
      company: "Tech Solutions",
      status: "customer",
      lastContact: "Hace 2 días",
      value: 15000,
      source: "Instagram",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      email: "carlos@empresa.com",
      phone: "+54 9 11 8765-4321",
      company: "Marketing Pro",
      status: "prospect",
      lastContact: "Hace 1 semana",
      value: 8500,
      source: "TikTok",
    },
    {
      id: "3",
      name: "Ana Martínez",
      email: "ana@startup.com",
      phone: "+54 9 11 5555-1234",
      status: "lead",
      lastContact: "Hace 3 días",
      value: 5000,
      source: "Referido",
    },
  ];

  const deals: Deal[] = [
    {
      id: "1",
      title: "Proyecto Web - Tech Solutions",
      contact: "María González",
      value: 15000,
      stage: "negotiation",
      probability: 80,
      closeDate: "2024-02-15",
    },
    {
      id: "2",
      title: "Campaña Marketing - Marketing Pro",
      contact: "Carlos Rodríguez",
      value: 8500,
      stage: "proposal",
      probability: 60,
      closeDate: "2024-02-28",
    },
  ];

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "customer":
        return "bg-green-100 text-green-800";
      case "prospect":
        return "bg-blue-100 text-blue-800";
      case "lead":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStageColor = (stage: Deal["stage"]) => {
    switch (stage) {
      case "closed-won":
        return "bg-green-100 text-green-800";
      case "negotiation":
        return "bg-blue-100 text-blue-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "qualification":
        return "bg-yellow-100 text-yellow-800";
      case "prospecting":
        return "bg-orange-100 text-orange-800";
      case "closed-lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='flex-1 flex flex-col overflow-hidden w-full'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>CRM</h1>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Buscar contactos...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 w-80'
              />
            </div>
            <Button variant='outline' size='sm'>
              <Filter className='h-4 w-4 mr-2' />
              Filtros
            </Button>
            <Button size='sm' className='bg-red-500 hover:bg-red-600'>
              <Plus className='h-4 w-4 mr-2' />
              Nuevo contacto
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6'>
        <div className=' mx-auto'>
          {/* Stats Overview */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Total Contactos</p>
                    <p className='text-2xl font-bold text-gray-900'>127</p>
                  </div>
                  <Users className='h-8 w-8 text-blue-600' />
                </div>
                <p className='text-xs text-green-600 mt-2'>+12 este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Leads Activos</p>
                    <p className='text-2xl font-bold text-gray-900'>23</p>
                  </div>
                  <Target className='h-8 w-8 text-orange-600' />
                </div>
                <p className='text-xs text-green-600 mt-2'>+5 esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Ventas del mes</p>
                    <p className='text-2xl font-bold text-gray-900'>$45.2K</p>
                  </div>
                  <DollarSign className='h-8 w-8 text-green-600' />
                </div>
                <p className='text-xs text-green-600 mt-2'>+18% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Tasa de conversión</p>
                    <p className='text-2xl font-bold text-gray-900'>32%</p>
                  </div>
                  <TrendingUp className='h-8 w-8 text-purple-600' />
                </div>
                <p className='text-xs text-green-600 mt-2'>+3% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='contacts'>Contactos</TabsTrigger>
              <TabsTrigger value='deals'>Oportunidades</TabsTrigger>
              <TabsTrigger value='activities'>Actividades</TabsTrigger>
            </TabsList>

            {/* Contactos */}
            <TabsContent value='contacts' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Contactos</CardTitle>
                  <CardDescription>Gestiona todos tus contactos y leads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {contacts.map(contact => (
                      <div
                        key={contact.id}
                        className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                      >
                        <div className='flex items-center space-x-4'>
                          <Avatar>
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {contact.name
                                .split(" ")
                                .map(n => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className='font-medium text-gray-900'>{contact.name}</h4>
                            <div className='flex items-center space-x-4 text-sm text-gray-500'>
                              <span className='flex items-center space-x-1'>
                                <Mail className='h-3 w-3' />
                                <span>{contact.email}</span>
                              </span>
                              <span className='flex items-center space-x-1'>
                                <Phone className='h-3 w-3' />
                                <span>{contact.phone}</span>
                              </span>
                              {contact.company && <span>• {contact.company}</span>}
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center space-x-4'>
                          <div className='text-right'>
                            <Badge className={getStatusColor(contact.status)} variant='secondary'>
                              {contact.status === "customer" && "Cliente"}
                              {contact.status === "prospect" && "Prospecto"}
                              {contact.status === "lead" && "Lead"}
                              {contact.status === "inactive" && "Inactivo"}
                            </Badge>
                            <p className='text-sm text-gray-500 mt-1'>{contact.lastContact}</p>
                          </div>
                          <div className='text-right'>
                            <p className='font-medium text-gray-900'>${contact.value.toLocaleString()}</p>
                            <p className='text-xs text-gray-500'>Valor potencial</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Crear oportunidad</DropdownMenuItem>
                              <DropdownMenuItem>Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Oportunidades */}
            <TabsContent value='deals' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline de Ventas</CardTitle>
                  <CardDescription>Seguimiento de oportunidades de negocio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {deals.map(deal => (
                      <div
                        key={deal.id}
                        className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                      >
                        <div className='flex-1'>
                          <h4 className='font-medium text-gray-900'>{deal.title}</h4>
                          <p className='text-sm text-gray-500'>Contacto: {deal.contact}</p>
                          <div className='flex items-center space-x-2 mt-2'>
                            <Badge className={getStageColor(deal.stage)} variant='secondary'>
                              {deal.stage === "negotiation" && "Negociación"}
                              {deal.stage === "proposal" && "Propuesta"}
                              {deal.stage === "qualification" && "Calificación"}
                              {deal.stage === "prospecting" && "Prospección"}
                              {deal.stage === "closed-won" && "Ganada"}
                              {deal.stage === "closed-lost" && "Perdida"}
                            </Badge>
                            <span className='text-xs text-gray-500'>{deal.probability}% probabilidad</span>
                          </div>
                        </div>

                        <div className='text-right'>
                          <p className='font-bold text-lg text-gray-900'>${deal.value.toLocaleString()}</p>
                          <p className='text-sm text-gray-500 flex items-center space-x-1'>
                            <Calendar className='h-3 w-3' />
                            <span>{deal.closeDate}</span>
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm' className='ml-4'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Cambiar etapa</DropdownMenuItem>
                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Actividades */}
            <TabsContent value='activities' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Actividades Recientes</CardTitle>
                  <CardDescription>Historial de interacciones y tareas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-4 p-4 border rounded-lg'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>Llamada completada</p>
                        <p className='text-sm text-gray-600'>Contacto con María González sobre el proyecto web</p>
                        <p className='text-xs text-gray-500 mt-1'>Hace 2 horas</p>
                      </div>
                    </div>

                    <div className='flex items-start space-x-4 p-4 border rounded-lg'>
                      <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                        <Mail className='h-4 w-4 text-blue-600' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>Email enviado</p>
                        <p className='text-sm text-gray-600'>Propuesta enviada a Carlos Rodríguez</p>
                        <p className='text-xs text-gray-500 mt-1'>Hace 1 día</p>
                      </div>
                    </div>

                    <div className='flex items-start space-x-4 p-4 border rounded-lg'>
                      <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center'>
                        <Clock className='h-4 w-4 text-yellow-600' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>Recordatorio pendiente</p>
                        <p className='text-sm text-gray-600'>Seguimiento con Ana Martínez programado</p>
                        <p className='text-xs text-gray-500 mt-1'>Mañana a las 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
