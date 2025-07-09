import React from 'react'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  ShoppingBag, Wrench, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from '@/store/hooks';
import { useTranslations } from 'next-intl';
import { useMessageToast } from '@/hooks/useMessageToast';
import { useCatalogContext } from '@/context/CatalogContext';
import { post } from '@/services/fetch';
import { ENV } from '@/typescript/types/api';

function InventoryForm({setModal}: { setModal: (value: boolean) => void }) {

    const { datasets } = useCatalogContext();
    const [activeTab, setActiveTab] = useState("product");
      const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        sku: "",
        type: "product",
        duration: "",
      });
      const { notify, notifyError } = useMessageToast();
      const dict = useTranslations("dict");
    
      const [productCatalogId, setProductCatalogId] = useState<string | null>(null);
      const [serviceCatalogId, setServiceCatalogId] = useState<string | null>(null);
    
      useEffect(() => {
          const createDefaultCatalogs = async () => {
            const productCatalog = datasets.find(ds => String(ds.dataschema.category) === "uitool-store");
            const serviceCatalog = datasets.find(ds => String(ds.dataschema.category) === "uitool-services");
      console.log('useEffect datasets', productCatalog);
            if (productCatalog && serviceCatalog) {
              setProductCatalogId(productCatalog._id);
              setServiceCatalogId(serviceCatalog._id);
              return;
            }
            
        }
        createDefaultCatalogs()
        }, [datasets]);

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
            console.log(datasets);
          // Wait until catalogs are created
          if (!productCatalogId || !serviceCatalogId) {
            notifyError("Los catálogos aún no están listos. Intenta de nuevo en unos segundos.");
            return;
          }
      
          try {
            let datasetId: string | null = null;
            let data: any = {};
      
            if (activeTab === "product") {
              datasetId = productCatalogId;
              data = {
                listname: formData.name,
                listdescr: formData.description,
                listprice: formData.price,
                listimage: null,
                productBrand: null,
                productAge: null,
                productColor: null,
                productGenre: null,
                productMaterial: null,
                productModel: null,
                productSize: null,
                stock: formData.stock,
                category: formData.category,
                sku: formData.sku
              };
            } else if (activeTab === "service") {
              datasetId = serviceCatalogId;
              data = {
                serviceName: formData.name,
                serviceDescr: formData.description,
                simultaneous: 1,
                price: formData.price,
                category: formData.category,
                duration: formData.duration,
              };
            }
      
            if (!datasetId) {
              notifyError("No se pudo encontrar el catálogo para crear el item.");
              return;
            }
      
            const response = await post(
              "dataitem",
              {
                dataset: datasetId,
                data,
                visibility: true,
              },
              ENV.BOX,
            );
      
            if (response.data.statusCode === 201) {
              notify(dict("toast.success_item") || "¡Item creado!");
            } else {
              notifyError(dict("toast.error_item") || "Error al crear el item.");
            }
          } catch (error) {
            notifyError(dict("toast.error_item") || "Error al crear el item.");
          }
        };
      
        const handleInputChange = (field: string, value: string) => {
          setFormData(prev => ({
            ...prev,
            [field]: value,
          }));
        };
        
  return (
    <Card style={{width: '90%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <div style={{position: 'absolute', right: 0, top: 0, padding: '1rem', cursor: 'pointer'}} onClick={() => setModal(false)}>X</div>
            <CardHeader>
              <CardTitle>Agregar tu primer item</CardTitle>
              <CardDescription>Completa la información de tu primer producto o servicio</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger
                    value='product'
                    className='flex items-center space-x-2'
                    onClick={() => {
                      handleInputChange("type", "uitool-products");
                      console.log("uitool-products");
                    }}
                  >
                    <ShoppingBag className='h-4 w-4' />
                    <span>Producto</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='service'
                    className='flex items-center space-x-2'
                    onClick={() => {
                      handleInputChange("type", "uitool-services");
                      console.log("uitool-services");
                    }}
                  >
                    <Wrench className='h-4 w-4' />
                    <span>Servicio</span>
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <TabsContent value='product' className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <Label htmlFor='product-name'>Nombre del producto *</Label>
                        <Input
                          id='product-name'
                          placeholder='Ej: Camiseta básica'
                          value={formData.name}
                          onChange={e => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='product-sku'>SKU (Código)</Label>
                        <Input
                          id='product-sku'
                          placeholder='Ej: CAM-001'
                          value={formData.sku}
                          onChange={e => handleInputChange("sku", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='product-description'>Descripción</Label>
                      <Textarea
                        id='product-description'
                        placeholder='Describe tu producto...'
                        value={formData.description}
                        onChange={e => handleInputChange("description", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      <div className='space-y-2'>
                        <Label htmlFor='product-price'>Precio *</Label>
                        <Input
                          id='product-price'
                          type='number'
                          placeholder='0.00'
                          value={formData.price}
                          onChange={e => handleInputChange("price", e.target.value)}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='product-stock'>Stock inicial *</Label>
                        <Input
                          id='product-stock'
                          type='number'
                          placeholder='0'
                          value={formData.stock}
                          onChange={e => handleInputChange("stock", e.target.value)}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='product-category'>Categoría</Label>
                        <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar categoría' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='ropa'>Ropa</SelectItem>
                            <SelectItem value='electronica'>Electrónica</SelectItem>
                            <SelectItem value='hogar'>Hogar</SelectItem>
                            <SelectItem value='deportes'>Deportes</SelectItem>
                            <SelectItem value='belleza'>Belleza</SelectItem>
                            <SelectItem value='otros'>Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label>Imagen del producto</Label>
                      <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                        <Upload className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                        <p className='text-sm text-gray-600 mb-2'>Arrastra una imagen o haz clic para subir</p>
                        <Button variant='outline' size='sm' type='button'>
                          Seleccionar imagen
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='service' className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <Label htmlFor='service-name'>Nombre del servicio *</Label>
                        <Input
                          id='service-name'
                          placeholder='Ej: Consultoría de marketing'
                          value={formData.name}
                          onChange={e => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='service-duration'>Duración</Label>
                        <Select value={formData.duration} onValueChange={value => handleInputChange("duration", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder='Duración del servicio' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='30min'>30 minutos</SelectItem>
                            <SelectItem value='1h'>1 hora</SelectItem>
                            <SelectItem value='2h'>2 horas</SelectItem>
                            <SelectItem value='custom'>Personalizada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='service-description'>Descripción del servicio</Label>
                      <Textarea
                        id='service-description'
                        placeholder='Describe qué incluye tu servicio...'
                        value={formData.description}
                        onChange={e => handleInputChange("description", e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <Label htmlFor='service-price'>Precio *</Label>
                        <Input
                          id='service-price'
                          type='number'
                          placeholder='0.00'
                          value={formData.price}
                          onChange={e => handleInputChange("price", e.target.value)}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='service-category'>Categoría</Label>
                        <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar categoría' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='consultoria'>Consultoría</SelectItem>
                            <SelectItem value='diseno'>Diseño</SelectItem>
                            <SelectItem value='marketing'>Marketing</SelectItem>
                            <SelectItem value='desarrollo'>Desarrollo</SelectItem>
                            <SelectItem value='educacion'>Educación</SelectItem>
                            <SelectItem value='otros'>Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <div className='flex justify-end space-x-4 pt-6 border-t'>
                    <Button type='submit' className='bg-red-500 hover:bg-red-600'>
                      <CheckCircle className='h-4 w-4 mr-2' />
                      Crear {activeTab === "product" ? "producto" : "servicio"}
                      <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
  )
}

export default InventoryForm
