"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingBag, Wrench, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppSelector } from "@/store/hooks";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useCatalogContext } from "@/context/CatalogContext";
import { post } from "@/services/fetch";
import { useTranslations } from "next-intl";
import { ENV } from "@/typescript/types/api";

interface InventorySetupProps {
  onFirstProductAdded: () => void;
}

export function InventorySetup({ onFirstProductAdded }: InventorySetupProps) {
  const [activeTab, setActiveTab] = useState("product");
  const schema = useAppSelector(state => state.dataschema);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    sku: "",
    type: "product",
  });
  const { notify, notifyError } = useMessageToast();
  const { handleAddDataset, datasets, loading } = useCatalogContext();
  const dict = useTranslations("dict");

  // Store created catalog IDs
  const [productCatalogId, setProductCatalogId] = useState<string | null>(null);
  const [serviceCatalogId, setServiceCatalogId] = useState<string | null>(null);
  const [catalogsCreated, setCatalogsCreated] = useState(false);

  useEffect(() => {
    if (loading) return; // Don't run until datasets are loaded

    const createDefaultCatalogs = async () => {
      const productCatalog = datasets.find(ds => String(ds.dataschema.category) === "uitool-store");
      const serviceCatalog = datasets.find(ds => String(ds.dataschema.category) === "uitool-services");

      // If both exist, set IDs and skip creation
      if (productCatalog && serviceCatalog) {
        setProductCatalogId(productCatalog._id);
        setServiceCatalogId(serviceCatalog._id);
        setCatalogsCreated(true);
        return;
      }

      // Otherwise, create missing catalogs
      try {
        console.log("data", productCatalog, serviceCatalog);
        let response1, response2;
        let success1 = false,
          success2 = false;
        if (datasets.length === 0) {
          const postDataschema = {
            name: "default",
            description: "first catalog",
            dataschema: schema[0]._id,
            order: 0,
            image: null,
          };
          response1 = await post("datasets", postDataschema, ENV.BOX);
          success1 = response1.data.statusCode === 201;
          if (success1) {
            handleAddDataset(response1.data.data);
            setProductCatalogId(response1.data.data._id);
          }
        }

        if (datasets.length === 0) {
          const postDataschemaService = {
            name: "default",
            description: "first catalog",
            dataschema: schema[2]._id,
            order: 0,
            image: null,
          };
          response2 = await post("datasets", postDataschemaService, ENV.BOX);
          success2 = response2.data.statusCode === 201;
          if (success2) {
            handleAddDataset(response2.data.data);
            setServiceCatalogId(response2.data.data._id);
          }
        }

        if (success1 && success2) {
          setCatalogsCreated(true);
          notify(dict("toast.post_dataset"));
        } else {
          notifyError(dict("toast.error_dataset"));
        }
      } catch (error) {
        notifyError(dict("toast.error_dataset"));
      }
    };

    if (schema[0]?._id && schema[2]?._id) {
      createDefaultCatalogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, datasets, loading]);

  // Handle item creation (product or service)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        };
      } else if (activeTab === "service") {
        datasetId = serviceCatalogId;
        data = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
        };
      }

      if (!datasetId) {
        notifyError("No se pudo encontrar el catálogo para crear el item.");
        return;
      }

      // Post the item to the correct dataset
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
        onFirstProductAdded();
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
    <div className='flex-1 flex flex-col overflow-hidden'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Configuración de Inventario</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6'>
        <div className='h-full mx-auto flex flex-col justify-between'>
          {/* Welcome Card */}
          <Card className='mb-[2rem] border-blue-200 bg-blue-50 p-3'>
            <CardHeader>
              <CardTitle className='text-blue-800 flex items-center space-x-2'>
                <Package className='h-6 w-6' />
                <span>¡Bienvenido a tu Inventario!</span>
              </CardTitle>
              <CardDescription className='text-blue-700'>
                Para comenzar, necesitas agregar tu primer producto o servicio. Esto nos ayudará a configurar tu
                catálogo y habilitar todas las funcionalidades de gestión.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-blue-700'>
              <div className='space-y-2 flex flex-col gap-2'>
                <p className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  <span>Gestiona tu stock en tiempo real</span>
                </p>
                <p className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  <span>Crea catálogos organizados</span>
                </p>
                <p className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  <span>Configura promociones automáticas</span>
                </p>
                <p className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-blue-600' />
                  <span>Controla precios y márgenes</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card>
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
                      handleInputChange("type", "uitool-products"), console.log("uitool-products");
                    }}
                  >
                    <ShoppingBag className='h-4 w-4' />
                    <span>Producto</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='service'
                    className='flex items-center space-x-2'
                    onClick={() => {
                      handleInputChange("type", "uitool-services"), console.log("uitool-services");
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
                        <Select>
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
        </div>
      </main>
    </div>
  );
}
