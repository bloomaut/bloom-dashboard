import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Wrench, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useCatalogContext } from "@/context/CatalogContext";
import { createTransaction, post } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";

function FinanceModal({ setModal }: { setModal: (value: boolean) => void }) {
  const { datasets } = useCatalogContext();
  const [activeTab, setActiveTab] = useState("product");
  const [formData, setFormData] = useState({
    amount: "0",
    type: "income",
    category: "Servicios",
    description: "description",
    date: "",
  });
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    const now = new Date().toISOString();
    console.log(now);
    setFormData(prev => ({
      ...prev,
      date: now,
    }));
    try {
      const response = await createTransaction({ ...formData, amount: parseInt(formData.amount), date: now });
      if (response.data.statusCode === 201) {
        notify("¡Transacción creada!");
      } else {
        notifyError("Error al crear la transacción");
      }
    } catch (error) {
      notifyError("Error al crear la transacción");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card style={{ width: "90%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <div
        style={{ position: "absolute", right: 0, top: 0, padding: "1rem", cursor: "pointer" }}
        onClick={() => setModal(false)}
      >
        X
      </div>
      <CardHeader>
        <CardTitle>Agregar Transacción</CardTitle>
        <CardDescription>Completa la información la transacción</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <TabsContent value='product' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='amount'>Cantidad</Label>
                  <Input
                    id='amount'
                    type='number'
                    value={formData.amount}
                    onChange={e => handleInputChange("amount", e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='type'>Tipo</Label>
                  <Select value={formData.type} onValueChange={value => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar Tipo' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='income'>Income</SelectItem>
                      <SelectItem value='expense'>Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Descripción</Label>
                <Textarea
                  id='description'
                  placeholder='Describe tu producto...'
                  value={formData.description}
                  onChange={e => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='category'>Categoría</Label>
                  <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar categoría' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='service'>Servicios</SelectItem>
                      <SelectItem value='product'>Productos</SelectItem>
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
  );
}

export default FinanceModal;
