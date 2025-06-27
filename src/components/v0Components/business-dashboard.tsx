"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoalsSummary } from "@/components/v0Components/goals-summary";
import {
  Upload,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  MessageCircle,
  Palette,
  Settings,
  FileText,
  Download,
} from "lucide-react";

export function BusinessDashboard() {
  const [businessData, setBusinessData] = useState({
    name: "Mi Empresa",
    description: "Una empresa innovadora dedicada a brindar soluciones de calidad",
    email: "contacto@miempresa.com",
    phone: "+54 9 11 1234-5678",
    address: "Av. Corrientes 2000, CABA, Argentina",
    website: "https://miempresa.com",
    instagram: "@mi_empresa",
    tiktok: "@mi_empresa_tk",
  });

  // Todas las metas combinadas
  const allGoals = [
    // Metas de Instagram
    {
      id: "ig-followers",
      title: "Seguidores",
      current: 2450,
      target: 3000,
      unit: "",
      status: "on-track" as const,
      platform: "instagram" as const,
    },
    {
      id: "ig-posts",
      title: "Posts mensuales",
      current: 8,
      target: 12,
      unit: "",
      status: "behind" as const,
      platform: "instagram" as const,
    },
    {
      id: "ig-engagement",
      title: "Engagement",
      current: 4.2,
      target: 5.0,
      unit: "%",
      status: "on-track" as const,
      platform: "instagram" as const,
    },
    // Metas de TikTok
    {
      id: "tk-followers",
      title: "Seguidores",
      current: 1200,
      target: 2000,
      unit: "",
      status: "on-track" as const,
      platform: "tiktok" as const,
    },
    {
      id: "tk-videos",
      title: "Videos semanales",
      current: 2,
      target: 4,
      unit: "",
      status: "behind" as const,
      platform: "tiktok" as const,
    },
    // Metas financieras
    {
      id: "fin-revenue",
      title: "Ingresos mensuales",
      current: 67000,
      target: 80000,
      unit: "$",
      status: "on-track" as const,
      platform: "finances" as const,
    },
    {
      id: "fin-profit",
      title: "Margen ganancia",
      current: 32.8,
      target: 40.0,
      unit: "%",
      status: "behind" as const,
      platform: "finances" as const,
    },
    {
      id: "fin-savings",
      title: "Fondo emergencia",
      current: 25000,
      target: 50000,
      unit: "$",
      status: "on-track" as const,
      platform: "finances" as const,
    },
  ];

  const handleSave = () => {
    console.log("Guardando datos del negocio:", businessData);
  };

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Mi Negocio</h1>
          <div className='flex items-center space-x-3'>
            <Button size='sm' className='bg-red-500 hover:bg-red-600' onClick={handleSave}>
              <Save className='h-4 w-4 mr-2' />
              Guardar cambios
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Metas y Objetivos */}
          <section className='mb-8'>
            <GoalsSummary goals={allGoals} />
          </section>

          {/* Tabs Content */}
          <Tabs defaultValue='info' className='space-y-6'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='info'>Información</TabsTrigger>
              <TabsTrigger value='branding'>Branding</TabsTrigger>
              <TabsTrigger value='contact'>Contacto</TabsTrigger>
              <TabsTrigger value='settings'>Configuración</TabsTrigger>
            </TabsList>

            {/* Información Básica */}
            <TabsContent value='info' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Información del Negocio</CardTitle>
                  <CardDescription>
                    Completa la información básica de tu empresa para mejorar tu presencia online
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='business-name'>Nombre del negocio</Label>
                      <Input
                        id='business-name'
                        value={businessData.name}
                        onChange={e => setBusinessData({ ...businessData, name: e.target.value })}
                        placeholder='Nombre de tu empresa'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='business-type'>Tipo de negocio</Label>
                      <Input id='business-type' placeholder='Ej: Restaurante, Tienda, Servicios' />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descripción</Label>
                    <Textarea
                      id='description'
                      value={businessData.description}
                      onChange={e => setBusinessData({ ...businessData, description: e.target.value })}
                      placeholder='Describe tu negocio en pocas palabras'
                      rows={4}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='founded'>Año de fundación</Label>
                      <Input id='founded' type='number' placeholder='2020' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='employees'>Número de empleados</Label>
                      <Input id='employees' placeholder='1-10' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nueva Card para Propuesta Comercial */}
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Comerciales</CardTitle>
                  <CardDescription>Descarga y gestiona los documentos de tu negocio</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border rounded-lg bg-blue-50'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                        <FileText className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <h4 className='font-medium text-gray-900'>Propuesta Comercial</h4>
                        <p className='text-sm text-gray-600'>
                          Documento personalizado con la información de tu negocio
                        </p>
                      </div>
                    </div>
                    <Button className='bg-blue-600 hover:bg-blue-700'>
                      <Download className='h-4 w-4 mr-2' />
                      Descargar PDF
                    </Button>
                  </div>

                  <div className='text-sm text-gray-500 bg-gray-50 p-3 rounded-lg'>
                    <p className='flex items-center space-x-2'>
                      <span>💡</span>
                      <span>La propuesta se genera automáticamente con la información de tu perfil de negocio</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding */}
            <TabsContent value='branding' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Logo de la empresa</CardTitle>
                    <CardDescription>Sube el logo que representa tu marca</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                      <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                        <Upload className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                        <p className='text-sm text-gray-600 mb-2'>Logo de la empresa</p>
                        <Button variant='outline' size='sm'>
                          Subir logo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Colores de marca</CardTitle>
                    <CardDescription>Define la paleta de colores de tu negocio</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-3'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-red-500 rounded-full border-2 border-gray-200'></div>
                        <div className='flex-1'>
                          <Label>Color principal</Label>
                          <Input value='#EF4444' readOnly className='mt-1' />
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-200'></div>
                        <div className='flex-1'>
                          <Label>Color secundario</Label>
                          <Input value='#1F2937' readOnly className='mt-1' />
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-200'></div>
                        <div className='flex-1'>
                          <Label>Color de acento</Label>
                          <Input value='#3B82F6' readOnly className='mt-1' />
                        </div>
                      </div>
                    </div>
                    <Button variant='outline' className='w-full'>
                      <Palette className='h-4 w-4 mr-2' />
                      Generar paleta automática
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Información de Contacto */}
            <TabsContent value='contact' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>
                    Mantén actualizada tu información para que los clientes puedan contactarte
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                          id='email'
                          type='email'
                          value={businessData.email}
                          onChange={e => setBusinessData({ ...businessData, email: e.target.value })}
                          className='pl-10'
                          placeholder='contacto@empresa.com'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Teléfono</Label>
                      <div className='relative'>
                        <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                          id='phone'
                          value={businessData.phone}
                          onChange={e => setBusinessData({ ...businessData, phone: e.target.value })}
                          className='pl-10'
                          placeholder='+54 9 11 1234-5678'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='address'>Dirección</Label>
                    <div className='relative'>
                      <MapPin className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                      <Textarea
                        id='address'
                        value={businessData.address}
                        onChange={e => setBusinessData({ ...businessData, address: e.target.value })}
                        className='pl-10'
                        placeholder='Dirección completa de tu negocio'
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='website'>Sitio web</Label>
                    <div className='relative'>
                      <Globe className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                      <Input
                        id='website'
                        value={businessData.website}
                        onChange={e => setBusinessData({ ...businessData, website: e.target.value })}
                        className='pl-10'
                        placeholder='https://tuempresa.com'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='instagram'>Instagram</Label>
                      <div className='relative'>
                        <Instagram className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                          id='instagram'
                          value={businessData.instagram}
                          onChange={e => setBusinessData({ ...businessData, instagram: e.target.value })}
                          className='pl-10'
                          placeholder='@tu_empresa'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='tiktok'>TikTok</Label>
                      <div className='relative'>
                        <MessageCircle className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                          id='tiktok'
                          value={businessData.tiktok}
                          onChange={e => setBusinessData({ ...businessData, tiktok: e.target.value })}
                          className='pl-10'
                          placeholder='@tu_empresa_tk'
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración */}
            <TabsContent value='settings' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                  <CardDescription>Personaliza el comportamiento de tu cuenta y notificaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12 text-gray-500'>
                    <Settings className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>Configuraciones de la cuenta próximamente</p>
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
export { GoalsSummary };
