"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Mic, PencilLine, Square, Loader2, CheckCircle, AlertCircle, RotateCcw, Check, ArrowLeft } from "lucide-react";
import {
  selectIsCreatingContent,
  selectCreationError,
  clearError,
} from "@/features/(dashboard)/Social/store/socialMediaSlice";
import { DayTime } from "@/features/(dashboard)/Social/types";
import {
  createSocialMediaContentFromIdea,
  createSocialMediaIdea,
  transcribeSocialMediaUpload,
  type SocialIdea,
} from "@/features/(dashboard)/Social/services/socialMediaService";
import { userState } from "@/store/features/userSlice";
import styles from "./style.module.scss";

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateContentModal({ isOpen, onClose, onSuccess }: CreateContentModalProps) {
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.social.create_modal");
  const user = useAppSelector(userState);
  const userId = user?.id ? String(user.id) : "";
  const isLoading = useSelector(selectIsCreatingContent);
  const reduxError = useSelector(selectCreationError);

  type Step = "choose" | "write" | "record" | "processing" | "review" | "success";

  const todayIso = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [step, setStep] = useState<Step>("choose");
  const [formData, setFormData] = useState({ pillar: "", date: todayIso, dayTime: DayTime.MORNING });
  const [rawIdea, setRawIdea] = useState("");
  const [processedIdea, setProcessedIdea] = useState("");
  const [ideaMeta, setIdeaMeta] = useState<SocialIdea | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [isCreatingFromIdea, setIsCreatingFromIdea] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordTimerRef = useRef<number | null>(null);

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

  const clearAllLocalState = () => {
    setStep("choose");
    setFormData({ pillar: "", date: todayIso, dayTime: DayTime.MORNING });
    setRawIdea("");
    setProcessedIdea("");
    setIdeaMeta(null);
    setLocalError(null);
    setShowSuccess(false);
    setIsRecording(false);
    setIsTranscribing(false);
    setIsGeneratingIdea(false);
    setIsCreatingFromIdea(false);
    setRecordSeconds(0);
  };

  useEffect(() => {
    if (!isOpen) return;
    clearAllLocalState();
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
      try {
        mediaRecorderRef.current?.stop();
      } catch {}
      mediaRecorderRef.current = null;
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    };
  }, []);

  const handleClose = () => {
    if (isLoading || isTranscribing || isGeneratingIdea || isCreatingFromIdea) return;
    try {
      mediaRecorderRef.current?.stop();
    } catch {}
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    mediaStreamRef.current = null;
    onClose();
    clearAllLocalState();
  };

  const generateImprovedIdea = async (input: string) => {
    const ideaText = input.trim();
    if (!ideaText) {
      setLocalError(dict("validation.idea_required"));
      return;
    }
    if (!userId) {
      setLocalError("No pudimos resolver tu usuario para procesar la idea.");
      return;
    }

    setLocalError(null);
    if (reduxError) dispatch(clearError());
    setIsGeneratingIdea(true);
    setStep("processing");

    try {
      const idea = await createSocialMediaIdea({ userId, idea: ideaText });
      setIdeaMeta(idea);
      setProcessedIdea(String(idea.message || "").trim());
      setStep("review");
    } catch (e: any) {
      setLocalError(e?.message || "Error procesando la idea");
      setStep("write");
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const startRecording = async () => {
    setLocalError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        mediaStreamRef.current?.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        transcribeIdeaAudio(blob);
      };

      recorder.start();
      setRecordSeconds(0);
      if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = window.setInterval(() => setRecordSeconds(s => s + 1), 1000);
      setIsRecording(true);
      setStep("record");
    } catch (e: any) {
      setLocalError(e?.message || "No pudimos iniciar la grabación");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
    recordTimerRef.current = null;
    setStep("processing");
    setIsTranscribing(true);
    try {
      mediaRecorderRef.current?.stop();
    } catch {
      setIsTranscribing(false);
      setStep("record");
      setLocalError("No pudimos detener la grabación");
    }
  };

  const encodeWav = (audioBuffer: AudioBuffer) => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1;
    const bitsPerSample = 16;

    const numFrames = audioBuffer.length;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numFrames * blockAlign;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    let offset = 0;

    const writeString = (s: string) => {
      for (let i = 0; i < s.length; i += 1) view.setUint8(offset + i, s.charCodeAt(i));
      offset += s.length;
    };

    writeString("RIFF");
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, format, true);
    offset += 2;
    view.setUint16(offset, numChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitsPerSample, true);
    offset += 2;
    writeString("data");
    view.setUint32(offset, dataSize, true);
    offset += 4;

    const channelData = Array.from({ length: numChannels }, (_, ch) => audioBuffer.getChannelData(ch));
    for (let i = 0; i < numFrames; i += 1) {
      for (let ch = 0; ch < numChannels; ch += 1) {
        let sample = channelData[ch][i];
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  const convertToWav = async (input: Blob): Promise<Blob> => {
    const arrayBuffer = await input.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    try {
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      return encodeWav(audioBuffer);
    } finally {
      try {
        await audioCtx.close();
      } catch {}
    }
  };

  const transcribeIdeaAudio = async (audioBlob: Blob) => {
    try {
      const wavBlob = await convertToWav(audioBlob);
      const segments = await transcribeSocialMediaUpload(wavBlob, {});
      const transcription = segments
        .map(s => String(s?.text ?? "").trim())
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (!transcription) throw new Error("No pudimos transcribir el audio");

      setRawIdea(transcription);
      await generateImprovedIdea(transcription);
    } catch (e: any) {
      setLocalError(e?.message || "Error transcribiendo audio");
      setStep("record");
    } finally {
      setIsTranscribing(false);
    }
  };

  const beginWrite = () => {
    setLocalError(null);
    setRawIdea("");
    setProcessedIdea("");
    setStep("write");
  };

  const beginReviewFromWrite = async () => {
    await generateImprovedIdea(rawIdea);
  };

  const redoIdea = () => {
    setLocalError(null);
    setRawIdea("");
    setProcessedIdea("");
    setIdeaMeta(null);
    setStep("choose");
  };

  const createContentFromImprovedIdea = async () => {
    if (!userId) {
      setLocalError("No pudimos resolver tu usuario para generar contenido.");
      return;
    }
    if (!ideaMeta) {
      setLocalError("Primero necesitamos procesar la idea.");
      return;
    }

    const msg = processedIdea.trim();
    if (!msg) {
      setLocalError(dict("validation.idea_required"));
      return;
    }

    setLocalError(null);
    if (reduxError) dispatch(clearError());
    setIsCreatingFromIdea(true);

    try {
      await createSocialMediaContentFromIdea({
        userId,
        title: ideaMeta.title,
        message: msg,
        proofType: ideaMeta.proofType,
        intention: ideaMeta.intention,
        narrative: ideaMeta.narrative,
      });
      setShowSuccess(true);
      setStep("success");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        clearAllLocalState();
      }, 2000);
    } catch (e: any) {
      setLocalError(e?.message || dict("validation.unexpected_error"));
      setStep("review");
    } finally {
      setIsCreatingFromIdea(false);
    }
  };

  const formattedTimer = useMemo(() => {
    const mm = String(Math.floor(recordSeconds / 60)).padStart(2, "0");
    const ss = String(recordSeconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [recordSeconds]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Success State */}
        {showSuccess && step === "success" && (
          <div className={styles.successContainer}>
            <div className={styles.successIconContainer}>
              <CheckCircle className={styles.successIcon} />
            </div>
            <div className={styles.successTitle}>{dict("success.title")}</div>
            <div className={styles.successMessage}>{dict("success.message")}</div>
          </div>
        )}

        {step !== "success" && (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.headerBar}>
                {step !== "choose" && (
                  <button
                    type='button'
                    className={styles.headerIconButton}
                    onClick={() => setStep("choose")}
                    disabled={isLoading || isTranscribing}
                  >
                    <ArrowLeft className={styles.headerIcon} />
                  </button>
                )}
                <div className={styles.headerTitle}>Nueva idea</div>
                <button type='button' className={styles.headerIconButton} onClick={handleClose} disabled={isLoading}>
                  <span className={styles.headerClose}>✕</span>
                </button>
              </div>
            </div>

            <div className={styles.modalBody}>
              {error && (
                <div className={styles.errorContainer}>
                  <AlertCircle className={styles.errorIcon} />
                  <div className={styles.errorText}>{error}</div>
                </div>
              )}

              {step === "choose" && (
                <div className={styles.stepContainer}>
                  <div className={styles.stepTitle}>Contame la idea</div>
                  <div className={styles.stepSubtitle}>Podés grabarla o escribirla</div>
                  <div className={styles.choiceGrid}>
                    <button type='button' className={styles.choiceCard} onClick={startRecording} disabled={isLoading}>
                      <div className={styles.choiceIcon}>
                        <Mic />
                      </div>
                      <div className={styles.choiceText}>Empezar grabación</div>
                    </button>
                    <button type='button' className={styles.choiceCard} onClick={beginWrite} disabled={isLoading}>
                      <div className={styles.choiceIcon}>
                        <PencilLine />
                      </div>
                      <div className={styles.choiceText}>Escribir idea</div>
                    </button>
                  </div>
                </div>
              )}

              {step === "write" && (
                <div className={styles.stepContainer}>
                  <div className={styles.stepTitle}>Escribí tu idea</div>
                  <textarea
                    className={styles.ideaTextarea}
                    placeholder='Escribí tu idea acá...'
                    value={rawIdea}
                    onChange={e => {
                      setRawIdea(e.target.value);
                      if (error) setLocalError(null);
                    }}
                    disabled={isLoading}
                    rows={6}
                  />
                  <div className={styles.bottomActions}>
                    <button type='button' className={styles.secondaryButton} onClick={() => setStep("choose")}>
                      Volver
                    </button>
                    <button
                      type='button'
                      className={styles.primaryButton}
                      onClick={beginReviewFromWrite}
                      disabled={isLoading}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {step === "record" && (
                <div className={styles.stepContainer}>
                  <div className={styles.stepTitle}>Grabando idea</div>
                  <div className={styles.recordTimer}>{formattedTimer}</div>
                  <button type='button' className={styles.recordButton} onClick={stopRecording} disabled={!isRecording}>
                    <Square />
                  </button>
                  <div className={styles.stepSubtitle}>Tocá para detener</div>
                </div>
              )}

              {step === "processing" && (
                <div className={styles.stepContainer}>
                  <div className={styles.processingIcon}>
                    <Loader2 className={styles.loadingIcon} />
                  </div>
                  <div className={styles.stepTitle}>Procesando idea...</div>
                  <div className={styles.stepSubtitle}>
                    {isTranscribing
                      ? "Transcribiendo audio"
                      : isGeneratingIdea
                        ? "Mejorando idea con IA"
                        : "Preparando"}
                  </div>
                </div>
              )}

              {step === "review" && (
                <div className={styles.stepContainer}>
                  <div className={styles.stepTitle}>Revisá tu idea</div>
                  <div className={styles.reviewBox}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewHeaderTitle}>Transcripción original</div>
                      <div className={styles.reviewHeaderActions}>
                        <button
                          type='button'
                          className={styles.iconButton}
                          onClick={redoIdea}
                          disabled={isLoading || isCreatingFromIdea || isGeneratingIdea}
                        >
                          <RotateCcw className={styles.iconSmall} />
                        </button>
                      </div>
                    </div>
                    <textarea className={styles.reviewTextarea} value={rawIdea} disabled rows={4} />
                  </div>

                  <div className={styles.reviewBox}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewHeaderTitle}>Idea procesada</div>
                    </div>
                    <textarea
                      className={styles.reviewTextarea}
                      value={processedIdea}
                      onChange={e => setProcessedIdea(e.target.value)}
                      disabled={isLoading || isCreatingFromIdea}
                      rows={6}
                    />
                  </div>

                  <div className={styles.scheduleGrid}>
                    <div className={styles.fieldContainer}>
                      <label className={styles.fieldLabel}>{dict("form.date.label")}</label>
                      <input
                        type='date'
                        value={formData.date}
                        onChange={e => handleInputChange("date", e.target.value)}
                        disabled={isLoading}
                        className={styles.inputField}
                        min={todayIso}
                      />
                    </div>
                    <div className={styles.fieldContainer}>
                      <label className={styles.fieldLabel}>{dict("form.time_period.label")}</label>
                      <div className={styles.dayTimeRow}>
                        <button
                          type='button'
                          className={`${styles.dayTimeButton} ${formData.dayTime === DayTime.MORNING ? styles.activeDayTime : ""}`}
                          onClick={() => handleInputChange("dayTime", DayTime.MORNING)}
                          disabled={isLoading}
                        >
                          {dict("form.time_period.morning")}
                        </button>
                        <button
                          type='button'
                          className={`${styles.dayTimeButton} ${formData.dayTime === DayTime.AFTERNOON ? styles.activeDayTime : ""}`}
                          onClick={() => handleInputChange("dayTime", DayTime.AFTERNOON)}
                          disabled={isLoading}
                        >
                          {dict("form.time_period.afternoon")}
                        </button>
                        <button
                          type='button'
                          className={`${styles.dayTimeButton} ${formData.dayTime === DayTime.EVENING ? styles.activeDayTime : ""}`}
                          onClick={() => handleInputChange("dayTime", DayTime.EVENING)}
                          disabled={isLoading}
                        >
                          {dict("form.time_period.evening")}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bottomActions}>
                    <button
                      type='button'
                      className={styles.secondaryButton}
                      onClick={redoIdea}
                      disabled={isLoading || isCreatingFromIdea || isGeneratingIdea}
                    >
                      Rehacer
                    </button>
                    <button
                      type='button'
                      className={styles.primaryButton}
                      onClick={createContentFromImprovedIdea}
                      disabled={isLoading || isCreatingFromIdea || isGeneratingIdea}
                    >
                      {isCreatingFromIdea ? (
                        <>
                          <Loader2 className={styles.loadingIcon} /> Generando content...
                        </>
                      ) : (
                        <>
                          <Check className={styles.iconSmall} /> Generar content
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
