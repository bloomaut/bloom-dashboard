"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  createSingleContent,
  selectIsCreatingContent,
  selectCreationError,
  clearError,
} from "@/features/(dashboard)/Social/store/socialMediaSlice";
import { CreateContentParams } from "@/features/(dashboard)/Social/types";
import styles from "./style.module.scss";

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateContentModal({ isOpen, onClose, onSuccess }: CreateContentModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(selectIsCreatingContent);
  const reduxError = useSelector(selectCreationError);

  const [formData, setFormData] = useState({
    pillar: "",
    idea: "",
    date: "",
    dayTime: "morning" as "morning" | "afternoon" | "evening",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Combinar errores de Redux y locales
  const error = reduxError || localError;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (error) {
      setLocalError(null);
      if (reduxError) {
        dispatch(clearError());
      }
    }
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.idea.trim()) {
      return { isValid: false, error: "La idea es requerida" };
    }
    if (!formData.date) {
      return { isValid: false, error: "La fecha es requerida" };
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { isValid: false, error: "La fecha no puede ser en el pasado" };
    }

    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      setLocalError(validation.error!);
      return;
    }

    // Limpiar errores antes de enviar
    setLocalError(null);
    if (reduxError) {
      dispatch(clearError());
    }

    try {
      // Preparar parámetros para el thunk
      const contentParams: CreateContentParams = {
        idea: formData.idea.trim(),
        pillar: formData.pillar.trim() || undefined, // Solo incluir si no está vacío
        date: formData.date, // Ya está en formato YYYY-MM-DD
        dayTime: formData.dayTime,
      };

      // Usar el thunk de Redux con tipado correcto
      const result = await dispatch(createSingleContent(contentParams)).unwrap();

      console.log("✅ Contenido creado exitosamente:", result._id);

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
        resetForm();
      }, 2000);
    } catch (error: unknown) {
      console.error("❌ Error al crear contenido:", error);
      // El error ya se maneja en Redux, pero podemos manejar casos específicos
      if (typeof error === "string") {
        setLocalError(error);
      } else if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError("Error inesperado al crear el contenido");
      }
    }
  };

  const resetForm = () => {
    setFormData({ pillar: "", idea: "", date: "", dayTime: "morning" });
    setLocalError(null);
    setShowSuccess(false);
    if (reduxError) {
      dispatch(clearError());
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      resetForm();
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
                <Label htmlFor='pillar'>Pilar de Contenido (Opcional)</Label>
                <Input
                  id='pillar'
                  type='text'
                  placeholder='Ej: Educativo, Entretenimiento, Inspiracional...'
                  value={formData.pillar}
                  onChange={e => handleInputChange("pillar", e.target.value)}
                  disabled={isLoading}
                  className={styles.inputField}
                />
                <div className={styles.fieldHint}>
                  Si no especificas un pilar, se asignará automáticamente según el contenido de tu idea.
                </div>
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
