"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createContentIdea } from "@/services/socialMediaService";

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateContentModal({ isOpen, onClose, onSuccess }: CreateContentModalProps) {
  const [formData, setFormData] = useState({
    pillar: "",
    idea: "",
    date: "",
    dayTime: "morning" as "morning" | "afternoon" | "evening",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.pillar.trim()) {
      setError("El pilar es requerido");
      return false;
    }
    if (!formData.idea.trim()) {
      setError("La idea es requerida");
      return false;
    }
    if (!formData.date) {
      setError("La fecha es requerida");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert date to ISO string format
      const isoDate = new Date(formData.date).toISOString();

      await createContentIdea(formData.pillar, formData.idea, isoDate, formData.dayTime);

      // Mostrar mensaje de éxito
      setShowSuccess(true);

      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // Reset form
        setFormData({ pillar: "", idea: "", date: "", dayTime: "morning" });
      }, 2000);
    } catch (err) {
      console.error("Error creating content idea:", err);
      setError("Error al crear la idea de contenido. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form and states
      setFormData({ pillar: "", idea: "", date: "", dayTime: "morning" });
      setError(null);
      setShowSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50 p-4'>
      <div
        className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide'
        onClick={e => e.stopPropagation()}
      >
        {/* Success State */}
        {showSuccess && (
          <div className='p-6 text-center'>
            <div className='flex justify-center mb-4'>
              <CheckCircle className='h-16 w-16 text-green-500' />
            </div>
            <div className='text-xl font-semibold text-gray-900 mb-2'>¡Idea creada exitosamente!</div>
            <div className='text-gray-600'>Tu nueva idea de contenido ha sido guardada correctamente.</div>
          </div>
        )}

        {/* Form State */}
        {!showSuccess && (
          <>
            {/* Header */}
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='text-xl font-semibold text-gray-900'>Generar Nueva Idea de Contenido</div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className='p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              {/* Error Message */}
              {error && (
                <div className='flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700'>
                  <AlertCircle className='h-4 w-4 flex-shrink-0' />
                  <div className='text-sm'>{error}</div>
                </div>
              )}

              {/* Pilar Field */}
              <div className='space-y-2'>
                <Label htmlFor='pillar'>Pilar de Contenido</Label>
                <Input
                  id='pillar'
                  type='text'
                  placeholder='Ej: Educativo, Entretenimiento, Inspiracional...'
                  value={formData.pillar}
                  onChange={e => handleInputChange("pillar", e.target.value)}
                  disabled={isLoading}
                  className='w-full'
                />
              </div>

              {/* Idea Field */}
              <div className='space-y-2'>
                <Label htmlFor='idea'>Idea de Contenido</Label>
                <Textarea
                  id='idea'
                  placeholder='Describe tu idea de contenido en detalle...'
                  value={formData.idea}
                  onChange={e => handleInputChange("idea", e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className='w-full resize-none'
                />
              </div>

              {/* Date Field */}
              <div className='space-y-2'>
                <Label htmlFor='date'>Fecha de Publicación</Label>
                <Input
                  id='date'
                  type='date'
                  value={formData.date}
                  onChange={e => handleInputChange("date", e.target.value)}
                  disabled={isLoading}
                  className='w-full'
                  min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
                />
              </div>

              {/* Time Period Field */}
              <div className='space-y-2'>
                <Label htmlFor='dayTime'>Horario de Publicación</Label>
                <div className='grid grid-cols-3 gap-2'>
                  <button
                    type='button'
                    onClick={() => handleInputChange("dayTime", "morning")}
                    disabled={isLoading}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.dayTime === "morning"
                        ? "border-yellow-500 bg-yellow-50 text-yellow-800"
                        : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className='flex flex-col items-center space-y-1'>
                      <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                      <div>Mañana</div>
                      <div className='text-xs opacity-75'>6:00 - 12:00</div>
                    </div>
                  </button>
                  <button
                    type='button'
                    onClick={() => handleInputChange("dayTime", "afternoon")}
                    disabled={isLoading}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.dayTime === "afternoon"
                        ? "border-red-500 bg-red-50 text-red-800"
                        : "border-gray-200 bg-white text-gray-600 hover:border-red-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className='flex flex-col items-center space-y-1'>
                      <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                      <div>Tarde</div>
                      <div className='text-xs opacity-75'>12:00 - 18:00</div>
                    </div>
                  </button>
                  <button
                    type='button'
                    onClick={() => handleInputChange("dayTime", "evening")}
                    disabled={isLoading}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.dayTime === "evening"
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className='flex flex-col items-center space-y-1'>
                      <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                      <div>Noche</div>
                      <div className='text-xs opacity-75'>18:00 - 24:00</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className='flex items-center space-x-3 pt-4'>
                <Button type='button' variant='outline' onClick={handleClose} disabled={isLoading} className='flex-1'>
                  Cancelar
                </Button>
                <Button type='submit' disabled={isLoading} className='flex-1'>
                  {isLoading ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Creando...
                    </>
                  ) : (
                    "Crear Idea"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
