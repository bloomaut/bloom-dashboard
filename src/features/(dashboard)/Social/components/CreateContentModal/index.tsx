"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createContentIdea } from "@/features/(dashboard)/Social/services/socialMediaService";
import styles from "./style.module.scss";

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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Success State */}
        {showSuccess && (
          <div className={styles.successContainer}>
            <div className={styles.successIconContainer}>
              <CheckCircle className={styles.successIcon} />
            </div>
            <div className={styles.successTitle}>¡Idea creada exitosamente!</div>
            <div className={styles.successMessage}>Tu nueva idea de contenido ha sido guardada correctamente.</div>
          </div>
        )}

        {/* Form State */}
        {!showSuccess && (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerTitle}>Generar Nueva Idea de Contenido</div>
                <button onClick={handleClose} disabled={isLoading} className={styles.closeButton}>
                  <X className={styles.closeIcon} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Error Message */}
              {error && (
                <div className={styles.errorContainer}>
                  <AlertCircle className={styles.errorIcon} />
                  <div className={styles.errorText}>{error}</div>
                </div>
              )}

              {/* Pilar Field */}
              <div className={styles.fieldContainer}>
                <Label htmlFor='pillar'>Pilar de Contenido</Label>
                <Input
                  id='pillar'
                  type='text'
                  placeholder='Ej: Educativo, Entretenimiento, Inspiracional...'
                  value={formData.pillar}
                  onChange={e => handleInputChange("pillar", e.target.value)}
                  disabled={isLoading}
                  className={styles.inputField}
                />
              </div>

              {/* Idea Field */}
              <div className={styles.fieldContainer}>
                <Label htmlFor='idea'>Idea de Contenido</Label>
                <Textarea
                  id='idea'
                  placeholder='Describe tu idea de contenido en detalle...'
                  value={formData.idea}
                  onChange={e => handleInputChange("idea", e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className={styles.textareaField}
                />
              </div>

              {/* Date Field */}
              <div className={styles.fieldContainer}>
                <Label htmlFor='date'>Fecha de Publicación</Label>
                <Input
                  id='date'
                  type='date'
                  value={formData.date}
                  onChange={e => handleInputChange("date", e.target.value)}
                  disabled={isLoading}
                  className={styles.inputField}
                  min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
                />
              </div>

              {/* Time Period Field */}
              <div className={styles.fieldContainer}>
                <Label htmlFor='dayTime'>Horario de Publicación</Label>
                <div className={styles.timePeriodGrid}>
                  <button
                    type='button'
                    onClick={() => handleInputChange("dayTime", "morning")}
                    disabled={isLoading}
                    className={`${styles.timePeriodButton} ${styles.morningButton} ${
                      formData.dayTime === "morning" ? styles.active : ""
                    }`}
                  >
                    <div className={styles.timePeriodContent}>
                      <div className={`${styles.timePeriodDot} ${styles.morningDot}`}></div>
                      <div>Mañana</div>
                      <div className={styles.timePeriodTime}>6:00 - 12:00</div>
                    </div>
                  </button>
                  <button
                    type='button'
                    onClick={() => handleInputChange("dayTime", "afternoon")}
                    disabled={isLoading}
                    className={`${styles.timePeriodButton} ${styles.afternoonButton} ${
                      formData.dayTime === "afternoon" ? styles.active : ""
                    }`}
                  >
                    <div className={styles.timePeriodContent}>
                      <div className={`${styles.timePeriodDot} ${styles.afternoonDot}`}></div>
                      <div>Tarde</div>
                      <div className={styles.timePeriodTime}>12:00 - 18:00</div>
                    </div>
                  </button>
                  <button
                    type='button'
                    onClick={() => handleInputChange("dayTime", "evening")}
                    disabled={isLoading}
                    className={`${styles.timePeriodButton} ${styles.eveningButton} ${
                      formData.dayTime === "evening" ? styles.active : ""
                    }`}
                  >
                    <div className={styles.timePeriodContent}>
                      <div className={`${styles.timePeriodDot} ${styles.eveningDot}`}></div>
                      <div>Noche</div>
                      <div className={styles.timePeriodTime}>18:00 - 24:00</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.actionsContainer}>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClose}
                  disabled={isLoading}
                  className={styles.actionButton}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={isLoading} className={styles.actionButton}>
                  {isLoading ? (
                    <>
                      <Loader2 className={styles.loadingIcon} />
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
