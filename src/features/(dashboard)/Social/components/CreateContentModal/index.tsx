"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/store/hooks";
// Removed v0 component imports - using standard HTML elements with SCSS styling
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  createSingleContent,
  selectIsCreatingContent,
  selectCreationError,
  clearError,
} from "@/features/(dashboard)/Social/store/socialMediaSlice";
import { CreateContentParams, DayTime } from "@/features/(dashboard)/Social/types";
import styles from "./style.module.scss";

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateContentModal({ isOpen, onClose, onSuccess }: CreateContentModalProps) {
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.social.create_modal");
  const isLoading = useSelector(selectIsCreatingContent);
  const reduxError = useSelector(selectCreationError);

  const [formData, setFormData] = useState({
    pillar: "",
    idea: "",
    date: "",
    dayTime: DayTime.MORNING,
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
      return { isValid: false, error: dict("validation.idea_required") };
    }
    if (!formData.date) {
      return { isValid: false, error: dict("validation.date_required") };
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { isValid: false, error: dict("validation.date_past") };
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

      console.log("✅ Contenido creado exitosamente:", result.id);

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
        setLocalError(dict("validation.unexpected_error"));
      }
    }
  };

  const resetForm = () => {
    setFormData({ pillar: "", idea: "", date: "", dayTime: DayTime.MORNING });
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
            <div className={styles.successTitle}>{dict("success.title")}</div>
            <div className={styles.successMessage}>{dict("success.message")}</div>
          </div>
        )}

        {/* Form State */}
        {!showSuccess && (
          <>
            {/* Header */}
            <div className={styles.modalHeader}>
              <div className={styles.headerContent}>
                <h2 className={styles.headerTitle}>{dict("header.title")}</h2>
              </div>
            </div>

            {/* Form */}
            <div className={styles.modalBody}>
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
                  <label htmlFor='pillar' className={styles.fieldLabel}>
                    {dict("form.pillar.label")}
                  </label>
                  <input
                    id='pillar'
                    type='text'
                    placeholder={dict("form.pillar.placeholder")}
                    value={formData.pillar}
                    onChange={e => handleInputChange("pillar", e.target.value)}
                    disabled={isLoading}
                    className={styles.inputField}
                  />
                  <div className={styles.fieldHint}>{dict("form.pillar.hint")}</div>
                </div>

                {/* Idea Field */}
                <div className={styles.fieldContainer}>
                  <label htmlFor='idea' className={styles.fieldLabel}>
                    {dict("form.idea.label")}
                  </label>
                  <textarea
                    id='idea'
                    placeholder={dict("form.idea.placeholder")}
                    value={formData.idea}
                    onChange={e => handleInputChange("idea", e.target.value)}
                    disabled={isLoading}
                    rows={4}
                    className={styles.textareaField}
                  />
                </div>

                {/* Date Field */}
                <div className={styles.fieldContainer}>
                  <label htmlFor='date' className={styles.fieldLabel}>
                    {dict("form.date.label")}
                  </label>
                  <input
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
                  <label htmlFor='dayTime' className={styles.fieldLabel}>
                    {dict("form.time_period.label")}
                  </label>
                  <div className={styles.timePeriodGrid}>
                    <button
                      type='button'
                      onClick={() => handleInputChange("dayTime", DayTime.MORNING)}
                      disabled={isLoading}
                      className={`${styles.timePeriodButton} ${styles.morningButton} ${
                        formData.dayTime === DayTime.MORNING ? styles.active : ""
                      }`}
                    >
                      <div className={styles.timePeriodContent}>
                        <div className={`${styles.timePeriodDot} ${styles.morningDot}`}></div>
                        <div>{dict("form.time_period.morning")}</div>
                        <div className={styles.timePeriodTime}>{dict("form.time_period.morning_time")}</div>
                      </div>
                    </button>
                    <button
                      type='button'
                      onClick={() => handleInputChange("dayTime", DayTime.AFTERNOON)}
                      disabled={isLoading}
                      className={`${styles.timePeriodButton} ${styles.afternoonButton} ${
                        formData.dayTime === DayTime.AFTERNOON ? styles.active : ""
                      }`}
                    >
                      <div className={styles.timePeriodContent}>
                        <div className={`${styles.timePeriodDot} ${styles.afternoonDot}`}></div>
                        <div>{dict("form.time_period.afternoon")}</div>
                        <div className={styles.timePeriodTime}>{dict("form.time_period.afternoon_time")}</div>
                      </div>
                    </button>
                    <button
                      type='button'
                      onClick={() => handleInputChange("dayTime", DayTime.EVENING)}
                      disabled={isLoading}
                      className={`${styles.timePeriodButton} ${styles.eveningButton} ${
                        formData.dayTime === DayTime.EVENING ? styles.active : ""
                      }`}
                    >
                      <div className={styles.timePeriodContent}>
                        <div className={`${styles.timePeriodDot} ${styles.eveningDot}`}></div>
                        <div>{dict("form.time_period.evening")}</div>
                        <div className={styles.timePeriodTime}>{dict("form.time_period.evening_time")}</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.actionsContainer}>
                  <button
                    type='button'
                    onClick={handleClose}
                    disabled={isLoading}
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                  >
                    {dict("actions.cancel")}
                  </button>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`${styles.actionButton} ${styles.submitButton}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className={styles.loadingIcon} />
                        {dict("actions.creating")}
                      </>
                    ) : (
                      dict("actions.create")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
