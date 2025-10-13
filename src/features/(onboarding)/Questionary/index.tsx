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
    try {
      const uid = questData.userId || null;
      if (!uid) throw new Error("No pudimos resolver tu usuario para enviar el cuestionario.");

      // 1) Enviar respuestas estructuradas (entrevista por bloques)
      const payload = generatePropPayload({ userId: String(uid), answers: questData.answers });
      console.log("payload:", payload);
      const propRes = await postProp(payload);
      if (propRes?.error) {
        throw new Error(typeof propRes.error === "string" ? propRes.error : "Error al enviar respuestas");
      }
      console.log("propRes:", propRes);
      // 2) Notificar avance de onboarding (proxy interno a pipeline/onboarding)
      const onboardingRes = await postOnboarding();
      console.log("onboardingRes:", onboardingRes);
      if (onboardingRes?.error) {
        throw new Error(typeof onboardingRes.error === "string" ? onboardingRes.error : "Error en postOnboarding");
      }

      // 3) Hidratar el usuario local con el nuevo proposal_status ("processing")
      const resUser = await get("user/me");
      console.log("resUser questionary:", resUser);
      if (resUser?.statusCode === 200 && resUser?.result?.user) {
        dispatch(setUserData(resUser.result.user));
      }

      // Persistencia y redirección
      try {
        if (storageKey) {
          const raw = localStorage.getItem(storageKey);
          const parsed = raw ? JSON.parse(raw) : {};
          parsed.completed = true;
          localStorage.setItem(storageKey, JSON.stringify(parsed));
        }
      } catch {}

      const locale = en ? "en" : "es";
      router.replace(`/${locale}/onboarding/waiting`);
    } catch (err: any) {
      setSubmitError(err?.message ?? "Error al enviar tus respuestas");
    } finally {
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
      <div
        style={{ padding: "1rem", textAlign: "center", color: "#6B7280" }}
        onClick={() => console.log(questions, currentIndex)}
      >
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
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
          minHeight: "100vh",
          padding: "2rem 1rem",
          marginTop: "-1rem",
        }}
      >
        {/* Progress Section */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "var(--color-primary)",
                fontFamily: "Inter, sans-serif",
              }}
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
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: "500",
                color: "var(--color-primary)",
              }}
            >
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "var(--color-font-secondary)",
              }}
            >
              {dict("question")} {currentIndex + 1} {dict("of")} {questions.length}
              {/* Indicador de pregunta obligatoria */}
              {questionObj.mandatory && (
                <span
                  style={{
                    color: "var(--color-primary)",
                    marginLeft: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  *
                </span>
              )}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.04)",
              borderRadius: "9999px",
              height: "1rem",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                height: "1rem",
                borderRadius: "9999px",
                width: `${progressPercentage}%`,
                transition: "all 0.5s ease-out",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "80rem",
            margin: "0 auto",
            width: "100%",
            minHeight: "70vh",
          }}
        >
          {/* Question Title */}
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              color: "var(--color-primary)",
              marginBottom: "1rem",
              lineHeight: "1.4",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {displayQuestion}
          </h2>

          {/* Short Description */}
          {questionObj.short_description && (
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6B7280",
                marginBottom: "3rem",
                lineHeight: "1.6",
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                maxWidth: "60rem",
                margin: "0 auto 3rem auto",
              }}
            >
              {questionObj.short_description}
            </p>
          )}

          {/* Content Layout */}
          <div
            style={{
              width: "80%",
              gap: "3rem",
              alignItems: "start",
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
            }}
          >
            {/* Input Section */}
            <div style={{ width: "100%", position: "relative" }}>
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "1rem",
                    fontSize: "1.125rem",
                    color: "#575757",
                    fontFamily: "Inter, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type='radio'
                    name={`conditional_${currentIndex}`}
                    value='yes'
                    onChange={() => handleConditionalRadio("yes")}
                    style={{
                      marginRight: "0.75rem",
                      accentColor: "#6A20A4",
                    }}
                  />
                  Sí
                </label>
                <label
                  style={{
                    display: "block",
                    marginBottom: "1rem",
                    fontSize: "1.125rem",
                    color: "#575757",
                    fontFamily: "Inter, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type='radio'
                    name={`conditional_${currentIndex}`}
                    value='no'
                    onChange={() => handleConditionalRadio("no")}
                    style={{
                      marginRight: "0.75rem",
                      accentColor: "var(--color-primary)",
                    }}
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
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
        minHeight: "100vh",
        padding: "2rem 1rem",
        marginTop: "-1rem",
      }}
    >
      {/* Progress Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "500",
              color: "var(--color-primary)",
            }}
          >
            {dict("question")} {currentIndex + 1} {dict("of")} {questions.length}
            {/* Indicador de pregunta obligatoria */}
            {questionObj.mandatory && (
              <span
                style={{
                  color: "var(--color-primary)",
                  marginLeft: "0.5rem",
                  fontWeight: "600",
                }}
              >
                *
              </span>
            )}
          </span>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              color: "#6A20A4",
            }}
          >
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            backgroundColor: "rgba(106, 32, 164, 0.2)",
            borderRadius: "9999px",
            height: "1rem",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
              height: "1rem",
              borderRadius: "9999px",
              width: `${progressPercentage}%`,
              transition: "all 0.5s ease-out",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "80rem",
          margin: "0 auto",
          width: "100%",
          minHeight: "70vh",
        }}
      >
        {/* Question Title */}
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            color: "var(--color-primary)",
            marginBottom: "1rem",
            lineHeight: "1.4",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {questionObj.question}
        </h2>

        {/* Short Description */}
        {questionObj.short_description && (
          <p
            style={{
              fontSize: "1.125rem",
              color: "#6B7280",
              marginBottom: "3rem",
              lineHeight: "1.6",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              maxWidth: "60rem",
              margin: "0 auto 3rem auto",
            }}
          >
            {questionObj.short_description}
          </p>
        )}

        {/* Content Layout */}
        <div
          style={{
            width: "80%",
            gap: "3rem",
            alignItems: "start",
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
          }}
        >
          {/* Input Section */}
          <div style={{ width: "100%", position: "relative" }}>
            <div style={{ position: "relative" }}>
              {questionObj.type === "singlechoice" ? (
                <div>
                  {questionObj.options.map((opt, idx) => (
                    <label
                      key={idx}
                      style={{
                        display: "block",
                        marginBottom: "1rem",
                        fontSize: "1.125rem",
                        color: "#575757",
                        fontFamily: "Inter, sans-serif",
                        cursor: "pointer",
                      }}
                    >
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
                        style={{
                          marginRight: "0.75rem",
                          accentColor: "var(--color-primary)",
                        }}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    alignItems: "center",
                  }}
                >
                  {/* Contenedor principal del input de fecha */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "400px",
                    }}
                  >
                    {/* Label flotante */}
                    <label
                      style={{
                        position: "absolute",
                        top: questData.answers[currentIndex] ? "-0.75rem" : "1rem",
                        left: "1rem",
                        fontSize: questData.answers[currentIndex] ? "0.75rem" : "1rem",
                        color: questData.answers[currentIndex] ? "var(--color-primary)" : "#9CA3AF",
                        fontWeight: questData.answers[currentIndex] ? "600" : "400",
                        fontFamily: "Inter, sans-serif",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        backgroundColor: questData.answers[currentIndex] ? "white" : "transparent",
                        padding: questData.answers[currentIndex] ? "0 0.5rem" : "0",
                        borderRadius: "0.25rem",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    ></label>

                    {/* Input de fecha estilizado */}
                    <input
                      type='date'
                      style={{
                        width: "100%",
                        padding: "1.25rem 1rem 1rem 1rem",
                        fontSize: "1.125rem",
                        border: "2px solid",
                        borderColor: questData.answers[currentIndex]
                          ? "var(--color-primary)"
                          : "rgba(148, 163, 184, 0.3)",
                        borderRadius: "1rem",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        color: "#374151",
                        fontFamily: "Inter, sans-serif",
                        outline: "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: questData.answers[currentIndex]
                          ? "0 8px 25px rgba(255, 61, 2, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)"
                          : "0 4px 12px rgba(0, 0, 0, 0.05)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      value={questData.answers[currentIndex] || ""}
                      onChange={e => {
                        handleChange(
                          { target: { value: e.target.value } } as React.ChangeEvent<HTMLTextAreaElement>,
                          currentIndex,
                        );
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = "var(--color-primary)";
                        e.target.style.backgroundColor = "white";
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 12px 35px rgba(90, 0, 117, 0.2), 0 8px 25px rgba(0, 0, 0, 0.1)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = questData.answers[currentIndex]
                          ? "var(--color-primary)"
                          : "rgba(148, 163, 184, 0.3)";
                        e.target.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = questData.answers[currentIndex]
                          ? "0 8px 25px rgba(255, 61, 2, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)"
                          : "0 4px 12px rgba(0, 0, 0, 0.05)";
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
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "auto",
                        color: questData.answers[currentIndex] ? "var(--color-primary)" : "#9CA3AF",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                      }}
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
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = "rgba(90, 0, 117, 0.1)";
                        e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#6B7280",
                        fontSize: "0.875rem",
                        fontFamily: "Inter, sans-serif",
                        textAlign: "center",
                      }}
                    >
                      <Icon name='info' width={16} height={16} strokeColor='#6B7280' />
                      <span>{dict("date_holder")}</span>
                    </div>
                  )}

                  {/* Fecha seleccionada con formato legible */}
                  {questData.answers[currentIndex] && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "1rem 1.5rem",
                        backgroundColor: "rgba(90, 0, 117, 0.05)",
                        border: "1px solid rgba(90, 0, 117, 0.2)",
                        borderRadius: "0.75rem",
                        color: "var(--color-primary)",
                        fontSize: "1rem",
                        fontWeight: "600",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <Icon name='check' width={20} height={20} strokeColor='var(--color-primary)' strokeWidth={2.5} />
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        backgroundColor: "#FEF2F2",
                        border: "1px solid #FECACA",
                        color: "#DC2626",
                        padding: "1rem 1.5rem",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        fontFamily: "Inter, sans-serif",
                        boxShadow: "0 4px 12px rgba(220, 38, 38, 0.1)",
                        animation: "shake 0.5s ease-in-out",
                      }}
                    >
                      <Icon name='alert-circle' width={18} height={18} strokeColor='#DC2626' strokeWidth={2} />
                      <span>Por favor selecciona una fecha para continuar</span>
                    </div>
                  )}
                </div>
              ) : questionObj.type === "extended_text" ? (
                <textarea
                  style={{
                    width: "100%",
                    height: "20rem",
                    fontSize: "1.125rem",
                    padding: "1.5rem",
                    border: isRecording ? "2px solid var(--color-primary)" : "2px solid rgba(0,0,0,0.08)",
                    borderRadius: "0.75rem",
                    backgroundColor: isRecording ? "rgba(255, 245, 243, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    color: "#575757",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                    resize: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                  value={questData.answers[currentIndex]}
                  onChange={e => handleChange(e, currentIndex)}
                  placeholder={isTranscribing ? dict("transcribing") : dict("place_holder_extended")}
                  disabled={isTranscribing}
                  onFocus={e => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={e => {
                    if (!isRecording) {
                      e.target.style.borderColor = "rgba(0,0,0,0.08)";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    }
                  }}
                />
              ) : questionObj.type === "simple_text" ? (
                <input
                  type='text'
                  style={{
                    width: "100%",
                    fontSize: "1.125rem",
                    padding: "1.5rem",
                    border: isRecording ? "2px solid var(--color-primary)" : "2px solid rgba(0,0,0,0.08)",
                    borderRadius: "0.75rem",
                    backgroundColor: isRecording ? "rgba(255, 245, 243, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    color: "#575757",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                  value={questData.answers[currentIndex]}
                  onChange={e => handleChange(e, currentIndex)}
                  placeholder={dict("place_holder_simple")}
                  onFocus={e => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={e => {
                    if (!isRecording) {
                      e.target.style.borderColor = "rgba(0,0,0,0.08)";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    }
                  }}
                />
              ) : (
                <>Not Available for {questionObj.type}</>
              )}
              {/* Error Message for textarea and simple_text */}
              {(questionObj.type === "extended_text" || questionObj.type === "simple_text") &&
                empty &&
                questionObj.mandatory && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-3rem",
                      right: "0",
                      backgroundColor: "var(--color-danger, var(--color-primary))",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px var(--color-danger)",
                      zIndex: 10,
                    }}
                  >
                    {dict("mandatory_field")}
                  </div>
                )}
            </div>

            {/* Audio Controls */}
            {questionObj.type === "extended_text" && (
              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: isTranscribing ? "not-allowed" : "pointer",
                    opacity: isTranscribing ? 0.5 : 1,
                    padding: "0.75rem 1rem",
                    borderRadius: "2rem",
                    backgroundColor: isRecording ? "rgba(255, 245, 243, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    border: "2px solid",
                    borderColor: isRecording ? "var(--color-primary)" : "rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                  }}
                  onClick={!isTranscribing ? handleMicrophoneClick : undefined}
                  onMouseEnter={e => {
                    if (!isTranscribing) {
                      e.currentTarget.style.backgroundColor = isRecording
                        ? "rgba(255, 61, 2, 0.15)"
                        : "rgba(255, 255, 255, 1)";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isTranscribing) {
                      e.currentTarget.style.backgroundColor = isRecording
                        ? "rgba(255, 61, 2, 0.1)"
                        : "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      backgroundColor: isRecording ? "var(--color-primary)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: isRecording ? "pulse 1.5s infinite" : "none",
                    }}
                  >
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
                  <span
                    style={{
                      color: isRecording ? "var(--color-primary)" : "var(--color-secondary)",
                      fontWeight: isRecording ? 600 : 500,
                      fontSize: "0.875rem",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Botón "Anterior" removido completamente */}

        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "1rem 2rem",
            minWidth: "200px",
            fontSize: "1.125rem",
            border: "none",
            borderRadius: "1rem",
            background: isCurrentQuestionCompleted()
              ? "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)"
              : "linear-gradient(90deg, #ccc 0%, #999 100%)",
            color: "white",
            fontWeight: "700",
            cursor: isCurrentQuestionCompleted() && !submitting ? "pointer" : "not-allowed",
            opacity: submitting ? 0.85 : isCurrentQuestionCompleted() ? 1 : 0.6,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            fontFamily: "Inter, sans-serif",
            boxShadow: isCurrentQuestionCompleted()
              ? "0 8px 25px rgba(255, 61, 2, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)"
              : "0 4px 12px rgba(0, 0, 0, 0.08)",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => {
            if (!isCurrentQuestionCompleted() || submitting) return;
            handleIndex("add");
          }}
          disabled={!isCurrentQuestionCompleted() || submitting}
          onMouseEnter={e => {
            if (isCurrentQuestionCompleted()) {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(255, 61, 2, 0.35), 0 8px 25px rgba(0, 0, 0, 0.15)";
            }
          }}
          onMouseLeave={e => {
            if (isCurrentQuestionCompleted()) {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 61, 2, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)";
            }
          }}
        >
          {/* Efecto de brillo sutil */}
          {isCurrentQuestionCompleted() && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                animation: "shimmer 2s infinite",
              }}
            />
          )}

          <span
            style={{
              color: "white",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "1.125rem",
              fontWeight: "700",
            }}
          >
            {submitting ? "Procesando..." : dict("continue_button")}
          </span>
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 var(--color-primary);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 61, 2, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 61, 2, 0);
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @media (max-width: 768px) {
          /* Mobile responsive styles would go here */
        }
      `}</style>
    </div>
  );
}

export default Questionary;
