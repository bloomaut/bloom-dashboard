"use client";

import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../components/Icon";
import { questions, questionsES, generatePropPayload } from "./utils/questions";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { get, postProp, postOnboarding } from "@/services/fetch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateQuestData,
  setCurrentIndex,
  setUserId,
  hydrateQuestAnswers,
} from "@/features/(onboarding)/Questionary/store/questSlice";
import { setUserData } from "@/store/features/userSlice";
import { MOCK_ANSWERS_ES } from "./utils/mockAnswers";
import styles from "./styles.module.scss";

function Questionary() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [showConditional, setShowConditional] = useState(false);
  const [showMainQuestion, setShowMainQuestion] = useState(false);
  const dict = useTranslations("dict.questionnaire");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockAppliedRef = useRef(false);
  const en = pathname.includes("/en");

  const dispatch = useAppDispatch();
  const questData = useAppSelector(s => s.questData);
  const currentIndex = questData.currentIndex;
  const [empty, setEmpty] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const storageKey = questData.userId ? `questionary::${questData.userId}::${en ? "en" : "es"}` : null;

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const {
          result: { user },
        } = await get("user/me");
        const uid = user?.client?.id ?? user?.id ?? null;
        if (cancelled) return;
        dispatch(setUserId(uid));

        if (uid) {
          const key = `questionary::${uid}::${en ? "en" : "es"}`;
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw) as { answers: string[]; currentIndex?: number };
            dispatch(hydrateQuestAnswers(parsed.answers));
            const targetLen = (en ? questions : questionsES).length;
            if (
              typeof parsed.currentIndex === "number" &&
              parsed.currentIndex >= 0 &&
              parsed.currentIndex < targetLen
            ) {
              dispatch(setCurrentIndex(parsed.currentIndex));
            } else {
              const lastAnswered = parsed.answers.reduce((acc, v, i) => (v ? i : acc), 0);
              dispatch(setCurrentIndex(lastAnswered));
            }
          } else {
            // posicionarse en la última contestada si hubiera algo en state
            const lastAnswered = questData.answers.reduce((acc, v, i) => (v ? i : acc), 0);
            dispatch(setCurrentIndex(lastAnswered));
          }
        }
      } catch {
        // sin userId -> persistencia desactivada
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, [dispatch, en]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers: questData.answers, currentIndex }));
    } catch {}
  }, [storageKey, questData.answers, currentIndex]);

  const handleIndex = (op: "add" | "subtract") => {
    const total = en ? questions.length : questionsES.length;
    if (op === "add") {
      const q = (en ? questions : questionsES)[currentIndex];
      const ans = questData.answers[currentIndex];
      const ok = !q?.mandatory || (ans && ans.trim() !== "");
      setEmpty(!ok);
      if (!ok) return;

      if (currentIndex >= total - 1) {
        submitAnswers();
      } else {
        dispatch(setCurrentIndex(currentIndex + 1));
      }
    } else if (op === "subtract" && currentIndex > 0) {
      dispatch(setCurrentIndex(currentIndex - 1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
    const value = e.target.value ?? "";
    dispatch(updateQuestData({ index, data: value }));
  };

  const submitAnswers = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    console.log("=== INICIO SUBMIT ANSWERS ===");
    console.log("questData:", questData);

    try {
      const uid = questData.userId || null;
      console.log("User ID:", uid);

      if (!uid) {
        throw new Error("No pudimos resolver tu usuario para enviar el cuestionario.");
      }

      console.log("=== ENVIANDO A POSTPROP ===");
      const propRes = await postProp(questData.answers);
      console.log("=== RESPUESTA DE POSTPROP ===");
      console.log("propRes:", propRes);

      // Verificar si la respuesta de postProp fue exitosa
      if (!propRes || !propRes.success) {
        const errorMsg = propRes?.error || "Error al enviar las respuestas del cuestionario";
        console.error("Error en postProp:", errorMsg);
        throw new Error(errorMsg);
      }

      // TODO: Consultar si la logica de inicio de onboarding sigue siendo la misma o si esta va a cambiar (Logica Actual: Se suben preguntas -> Se pide el inicio del pipeline)
      console.log("=== POSTPROP EXITOSO, ENVIANDO ONBOARDING ===");
      // 2) Notificar avance de onboarding (proxy interno a pipeline/onboarding)
      const onboardingRes = await postOnboarding();
      console.log("=== RESPUESTA DE POSTONBOARDING ===");
      console.log("onboardingRes:", onboardingRes);

      // Verificar si la respuesta de postOnboarding fue exitosa
      if (!onboardingRes.success) {
        throw new Error(onboardingRes.error || "Error al notificar el progreso del onboarding");
      }

      console.log("=== ACTUALIZANDO DATOS DE USUARIO ===");
      // 3) Hidratar el usuario local con el nuevo proposal_status ("processing")
      try {
        const resUser = await get("user/me");
        console.log("=== RESPUESTA GET USER/ME ===");
        console.log("resUser questionary:", resUser);

        if (resUser?.statusCode === 200 && resUser?.result?.user) {
          dispatch(setUserData(resUser.result.user));
          console.log("Usuario actualizado en Redux");
        } else {
          console.warn("No se pudo actualizar los datos del usuario, pero continuando con el flujo");
        }
      } catch (userError) {
        console.warn("Error al actualizar datos del usuario:", userError);
        // No lanzamos error aquí porque no es crítico para el flujo principal
      }

      console.log("=== GUARDANDO EN LOCALSTORAGE ===");
      // 4) Persistencia local
      try {
        if (storageKey) {
          const raw = localStorage.getItem(storageKey);
          const parsed = raw ? JSON.parse(raw) : {};
          parsed.completed = true;
          localStorage.setItem(storageKey, JSON.stringify(parsed));
          console.log("Guardado en localStorage:", storageKey);
        }
      } catch (storageError) {
        console.warn("Error al guardar en localStorage:", storageError);
        // No es crítico, continuamos
      }

      console.log("=== REDIRIGIENDO ===");
      // 5) Redirección exitosa
      const locale = en ? "en" : "es";
      const redirectUrl = `/${locale}/onboarding/waiting`;
      console.log("Redirigiendo a:", redirectUrl);
      router.replace(redirectUrl);
    } catch (err: any) {
      console.error("=== ERROR EN SUBMITANSWERS ===");
      console.error("Error completo:", err);
      console.error("Error message:", err?.message);
      console.error("Error stack:", err?.stack);
      console.error("Error type:", typeof err);

      // Determinar el mensaje de error más apropiado
      let errorMessage = "Error inesperado al procesar tu cuestionario";

      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      // Mensajes específicos para errores comunes
      if (errorMessage.includes("Network Error") || errorMessage.includes("conexión")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet e intenta nuevamente.";
      } else if (errorMessage.includes("timeout") || errorMessage.includes("tardó demasiado")) {
        errorMessage = "La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.";
      } else if (errorMessage.includes("401") || errorMessage.includes("autorización")) {
        errorMessage = "Tu sesión ha expirado. Por favor, recarga la página e inicia sesión nuevamente.";
      } else if (errorMessage.includes("500") || errorMessage.includes("servidor")) {
        errorMessage = "Error del servidor. Por favor, intenta nuevamente en unos minutos.";
      }

      console.error("Mensaje de error final:", errorMessage);
      setSubmitError(errorMessage);
    } finally {
      console.log("=== FIN SUBMIT ANSWERS ===");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    for (let index = 0; index < questData.answers.length; index++) {
      if (questData.answers[index]) {
        dispatch(setCurrentIndex(index));
      }
    }
  }, []);

  useEffect(() => {
    // Autocompletar (mock) activado por query param ?mock=1
    if (mockAppliedRef.current) return;
    const mock = searchParams.get("mock");
    if (mock === "1" && questData.userId) {
      const total = en ? questions.length : questionsES.length;
      const incoming = MOCK_ANSWERS_ES;
      dispatch(hydrateQuestAnswers(incoming));
      dispatch(setCurrentIndex(total - 1));
      mockAppliedRef.current = true;
    }
  }, [dispatch, searchParams, questData.userId, en]);

  useEffect(() => {
    setShowConditional(false);
    setShowMainQuestion(false);
  }, [currentIndex]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("questionIndex", currentIndex.toString());

      const response = await fetch("/api/transcription", {
        method: "POST",
        body: formData,
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      const transcription = data.transcription || "";

      const syntheticEvent = {
        target: { value: transcription },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      handleChange(syntheticEvent, currentIndex);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      alert("Error transcribing audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    const questionObj = en ? questions[currentIndex] : questionsES[currentIndex];

    if (questionObj.hasConditionalQuestion && !showConditional) {
      if (value.toLowerCase() === "no") {
        handleChange(
          { target: { value: questionObj.defaultAnswer } } as React.ChangeEvent<HTMLTextAreaElement>,
          currentIndex,
        );
        // delay advancing one tick so parent state (redux) can update
        setTimeout(() => handleIndex("add"), 0);
      } else if (value.toLowerCase() === "yes") {
        setShowConditional(true);
      }
    } else if (showConditional) {
      handleChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>, currentIndex);
      setShowConditional(false);
      handleIndex("add");
    } else {
      handleChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>, currentIndex);
    }
  };

  const questionObj = en ? questions[currentIndex] : questionsES[currentIndex];
  // Defensive guard: if currentIndex is out of range (questionObj undefined),
  // avoid runtime errors and render a small fallback UI.
  if (!questionObj) {
    return (
      <div className={styles.fallbackContainer} onClick={() => console.log(questions, currentIndex)}>
        Question not avaible.
      </div>
    );
  }

  const displayQuestion = showConditional ? questionObj.question : questionObj.conditionalQuestion;

  const handleConditionalRadio = (value: string) => {
    if (value === "no") {
      console.log(currentIndex);
      handleChange(
        { target: { value: questionObj.defaultAnswer } } as React.ChangeEvent<HTMLTextAreaElement>,
        currentIndex,
      );
      setShowConditional(false);
      setShowMainQuestion(false);
      // wait one tick so the parent's questData is updated before handleIndex validates it
      setTimeout(() => handleIndex("add"), 0);
    } else if (value === "yes") {
      setShowMainQuestion(true);
    }
  };

  const handleMainAnswer = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e as React.ChangeEvent<HTMLTextAreaElement>, currentIndex);
    setShowMainQuestion(false);
    handleIndex("add");
  };

  // Nueva función para validar si la pregunta actual está completada
  const isCurrentQuestionCompleted = () => {
    const questionObj = en ? questions[currentIndex] : questionsES[currentIndex];
    if (!questionObj) return true;

    // Si la pregunta no es obligatoria, siempre está "completada"
    if (!questionObj.mandatory) return true;

    const currentAnswer = questData.answers[currentIndex];

    // Para preguntas de tipo date_text, verificar que la fecha esté completa
    if (questionObj.type === "date_text") {
      return currentAnswer && currentAnswer.trim() !== "";
    }

    // Para preguntas de tipo singlechoice, verificar que haya una opción seleccionada
    if (questionObj.type === "singlechoice") {
      return currentAnswer && currentAnswer.trim() !== "";
    }

    // Para otros tipos de preguntas, verificar que no esté vacío
    return currentAnswer && currentAnswer.trim() !== "";
  };

  if (questionObj.hasConditionalQuestion && !showMainQuestion) {
    return (
      <div className={styles.container}>
        {/* Progress Section */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span
              className={styles.title}
              onClick={() =>
                console.log(
                  currentIndex,
                  questionObj.hasConditionalQuestion,
                  showMainQuestion,
                  questionObj.hasConditionalQuestion && !showMainQuestion,
                )
              }
            >
              Cuestionario
            </span>
            <span className={styles.percentage}>{Math.round(progressPercentage)}%</span>
          </div>
          <div className={styles.progressHeader}>
            <span className={`${styles.questionInfo} ${styles.secondary}`}>
              {dict("question")} {currentIndex + 1} {dict("of")} {questions.length}
              {/* Indicador de pregunta obligatoria */}
              {questionObj.mandatory && <span className={styles.mandatoryIndicator}>*</span>}
            </span>
          </div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Question Title */}
          <h2 className={styles.questionTitle}>{displayQuestion}</h2>

          {/* Short Description */}
          {questionObj.short_description && <p className={styles.shortDescription}>{questionObj.short_description}</p>}

          {/* Content Layout */}
          <div className={styles.contentLayout}>
            {/* Input Section */}
            <div className={styles.inputSection}>
              <div className={styles.inputContainer}>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name={`conditional_${currentIndex}`}
                    value='yes'
                    onChange={() => handleConditionalRadio("yes")}
                    className={styles.purple}
                  />
                  Sí
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name={`conditional_${currentIndex}`}
                    value='no'
                    onChange={() => handleConditionalRadio("no")}
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress Section */}
      <div className={styles.progressSection}>
        <div className={`${styles.progressHeader} ${styles.mainView}`}>
          <span className={styles.questionInfo}>
            {dict("question")} {currentIndex + 1} {dict("of")} {questions.length}
            {/* Indicador de pregunta obligatoria */}
            {questionObj.mandatory && <span className={styles.mandatoryIndicator}>*</span>}
          </span>
          <span className={`${styles.percentage} ${styles.purple}`}>{Math.round(progressPercentage)}%</span>
        </div>
        <div className={`${styles.progressBarContainer} ${styles.purple}`}>
          <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <div className={styles.questionary}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Question Title */}
          <h2 className={styles.questionTitle}>{questionObj.question}</h2>

          {/* Short Description */}
          {questionObj.short_description && <p className={styles.shortDescription}>{questionObj.short_description}</p>}

          {/* Content Layout */}
          <div className={styles.contentLayout}>
            {/* Input Section */}
            <div className={styles.inputSection}>
              <div className={styles.inputContainer}>
                {questionObj.type === "singlechoice" ? (
                  <div>
                    {questionObj.options.map((opt, idx) => (
                      <label key={idx} className={styles.radioLabel}>
                        <input
                          type='radio'
                          name={`question_${currentIndex}`}
                          value={
                            typeof opt === "string"
                              ? opt
                              : typeof opt === "object" && "value" in (opt as { value?: string })
                                ? (opt as { value: string }).value
                                : ""
                          }
                          checked={
                            questData.answers[currentIndex] ===
                            (typeof opt === "string"
                              ? opt
                              : typeof opt === "object" && "value" in (opt as { value?: string })
                                ? (opt as { value: string }).value
                                : "")
                          }
                          onChange={handleInputChange}
                        />
                        {typeof opt === "string"
                          ? opt
                          : typeof opt === "object" && "option" in (opt as { option?: string })
                            ? (opt as { option: string }).option
                            : ""}
                      </label>
                    ))}
                  </div>
                ) : questionObj.type === "date_text" ? (
                  <div className={styles.dateInputContainer}>
                    {/* Contenedor principal del input de fecha */}
                    <div className={styles.dateInputWrapper}>
                      {/* Label flotante */}
                      <label
                        className={`${styles.dateLabel} ${questData.answers[currentIndex] ? styles.filled : ""}`}
                      ></label>

                      {/* Input de fecha estilizado */}
                      <input
                        type='date'
                        className={`${styles.dateInput} ${questData.answers[currentIndex] ? styles.filled : ""}`}
                        value={questData.answers[currentIndex] || ""}
                        onChange={e => {
                          handleChange(
                            { target: { value: e.target.value } } as React.ChangeEvent<HTMLTextAreaElement>,
                            currentIndex,
                          );
                        }}
                        onClick={e => {
                          // Intentar abrir el selector solo en respuesta directa al clic del usuario
                          try {
                            (e.target as HTMLInputElement).showPicker?.();
                          } catch (error) {
                            // Si falla showPicker, el comportamiento nativo del input funcionará
                            console.log("showPicker no disponible, usando comportamiento nativo");
                          }
                        }}
                      />

                      {/* Ícono de calendario - clickeable */}
                      <div
                        className={`${styles.calendarIcon} ${questData.answers[currentIndex] ? styles.filled : ""}`}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();

                          // Buscar el input de fecha más cercano
                          const container = e.currentTarget.parentElement;
                          const input = container?.querySelector('input[type="date"]') as HTMLInputElement;

                          if (input) {
                            input.focus();
                            // Intentar abrir el selector solo en respuesta directa al clic del usuario
                            try {
                              input.showPicker?.();
                            } catch (error) {
                              // Si falla showPicker, simular un clic en el input
                              input.click();
                            }
                          }
                        }}
                      >
                        <Icon
                          name='calendar'
                          width={20}
                          height={20}
                          strokeColor={questData.answers[currentIndex] ? "var(--color-primary)" : "#9CA3AF"}
                          strokeWidth={2}
                        />
                      </div>
                    </div>

                    {/* Información adicional */}
                    {!questData.answers[currentIndex] && (
                      <div className={styles.dateInfo}>
                        <Icon name='info' width={16} height={16} strokeColor='#6B7280' />
                        <span>{dict("date_holder")}</span>
                      </div>
                    )}

                    {/* Fecha seleccionada con formato legible */}
                    {questData.answers[currentIndex] && (
                      <div className={styles.selectedDate}>
                        <Icon
                          name='check'
                          width={20}
                          height={20}
                          strokeColor='var(--color-primary)'
                          strokeWidth={2.5}
                        />
                        <span>
                          {dict("selected_date")}{" "}
                          {en
                            ? new Date(questData.answers[currentIndex] + "T00:00:00").toLocaleDateString("en-GB", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : new Date(questData.answers[currentIndex] + "T00:00:00").toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                        </span>
                      </div>
                    )}

                    {/* Error Message */}
                    {empty && questionObj.mandatory && (
                      <div className={styles.errorMessage}>
                        <Icon name='alert-circle' width={18} height={18} strokeColor='#DC2626' strokeWidth={2} />
                        <span>Por favor selecciona una fecha para continuar</span>
                      </div>
                    )}
                  </div>
                ) : questionObj.type === "extended_text" ? (
                  <textarea
                    className={`${styles.textarea} ${isRecording ? styles.recording : ""}`}
                    value={questData.answers[currentIndex]}
                    onChange={e => handleChange(e, currentIndex)}
                    placeholder={isTranscribing ? dict("transcribing") : dict("place_holder_extended")}
                    disabled={isTranscribing}
                  />
                ) : questionObj.type === "simple_text" ? (
                  <input
                    type='text'
                    className={`${styles.textInput} ${isRecording ? styles.recording : ""}`}
                    value={questData.answers[currentIndex]}
                    onChange={e => handleChange(e, currentIndex)}
                    placeholder={dict("place_holder_simple")}
                  />
                ) : (
                  <>Not Available for {questionObj.type}</>
                )}
                {/* Error Message for textarea and simple_text */}
                {(questionObj.type === "extended_text" || questionObj.type === "simple_text") &&
                  empty &&
                  questionObj.mandatory && <div className={styles.textInputError}>{dict("mandatory_field")}</div>}
              </div>

              {/* Audio Controls */}
              {questionObj.type === "extended_text" && (
                <div className={styles.audioControls}>
                  <div
                    className={`${styles.audioButton} ${isRecording ? styles.recording : ""} ${isTranscribing ? styles.transcribing : ""}`}
                    onClick={!isTranscribing ? handleMicrophoneClick : undefined}
                  >
                    <div className={`${styles.micIcon} ${isRecording ? styles.recording : ""}`}>
                      <Icon
                        name='mic'
                        width={20}
                        height={20}
                        strokeColor={isRecording ? "white" : "var(--color-primary)"}
                        fillColor={isRecording ? "var(--color-primary)" : "none"}
                        strokeWidth={2}
                        title='mic'
                      />
                    </div>
                    <span className={`${styles.audioText} ${isRecording ? styles.recording : ""}`}>
                      {isTranscribing
                        ? dict("transcribing")
                        : isRecording
                          ? dict("recording_audio")
                          : dict("record_audio")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className={styles.navigation}>
          {/* Botón "Anterior" removido completamente */}

          <button
            className={`${styles.continueButton} ${isCurrentQuestionCompleted() ? styles.enabled : ""} ${submitting ? styles.submitting : ""}`}
            onClick={() => {
              if (!isCurrentQuestionCompleted() || submitting) return;
              handleIndex("add");
            }}
            disabled={!isCurrentQuestionCompleted() || submitting}
          >
            {/* Efecto de brillo sutil */}
            {isCurrentQuestionCompleted() && <div className={styles.shimmerEffect} />}

            <span className={styles.buttonText}>{submitting ? dict("processing") : dict("continue_button")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Questionary;
