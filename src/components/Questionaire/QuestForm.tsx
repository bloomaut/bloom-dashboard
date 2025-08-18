// Updated QuestForm component with modern styling matching FormularioEmprendedor
import React, { useState, useRef, useEffect } from "react";
import { QuestData } from "./Questionaire";
import GradientBar from "./QuestBar";
import Icon from "../Icon";
import Image from "next/image";
import { questions } from "./questions";
import { getYouTubeEmbedURL, videos } from "./videos";

interface Props {
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void;
  handleIndex: (operation: string) => void;
  currentIndex: number;
  questData: QuestData;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  empty: boolean;
}

function QuestForm({ handleChange, handleIndex, currentIndex, questData, setIndex, empty }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    for (let index = 0; index < questData.answers.length; index++) {
      if (questData.answers[index] !== "") {
        setIndex(index);
      }
    }
  }, []);

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

  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FBFAFE 0%, #ffffff 100%)",
        padding: "1rem",
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
              color: "#6A20A4",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Cuestionario
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
              color: "rgba(106, 32, 164, 0.7)",
            }}
          >
            Pregunta {currentIndex + 1} de {questions.length}
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
              background: "linear-gradient(90deg, #FF3D02 0%, #6A20A4 100%)",
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
            color: "#6A20A4",
            marginBottom: "3rem",
            lineHeight: "1.4",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {questions[currentIndex]}
        </h2>

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
          {/* Video Section */}
          {/*   <div style={{ width: "100%" }}>
            <iframe
              style={{
                borderRadius: "1rem",
                width: "100%",
                height: "400px",
                border: "none",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
              src={`${getYouTubeEmbedURL(videos[currentIndex])}`}
              allow='accelerometer; autoplay;'
            />
          </div> */}

          {/* Input Section */}
          <div style={{ width: "100%", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <textarea
                style={{
                  width: "100%",
                  height: "300px",
                  fontSize: "1.125rem",
                  padding: "1.5rem",
                  border: isRecording ? "2px solid #FF3D02" : "2px solid rgba(106, 32, 164, 0.3)",
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
                placeholder={
                  isTranscribing ? "Transcribiendo..." : "Escribe aquí o usa el micrófono para grabar tu respuesta..."
                }
                disabled={isTranscribing}
                onFocus={e => {
                  e.target.style.borderColor = "#FF3D02";
                  e.target.style.backgroundColor = "white";
                }}
                onBlur={e => {
                  if (!isRecording) {
                    e.target.style.borderColor = "rgba(106, 32, 164, 0.3)";
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                  }
                }}
              />

              {/* Error Message */}
              {empty && (
                <div
                  style={{
                    position: "absolute",
                    top: "-3rem",
                    right: "0",
                    backgroundColor: "#ef4444",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    zIndex: 10,
                  }}
                >
                  Campo no puede estar vacío
                </div>
              )}
            </div>

            {/* Audio Controls */}
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
                  backgroundColor: isRecording ? "rgba(255, 61, 2, 0.1)" : "rgba(255, 255, 255, 0.8)",
                  border: "2px solid",
                  borderColor: isRecording ? "#FF3D02" : "rgba(106, 32, 164, 0.3)",
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
                    backgroundColor: isRecording ? "#FF3D02" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: isRecording ? "pulse 1.5s infinite" : "none",
                  }}
                >
                  <Image
                    src={"/mic.png"}
                    alt='mic'
                    width={24}
                    height={24}
                    style={{
                      filter: isRecording ? "brightness(0) invert(1)" : "none",
                    }}
                  />
                </div>
                <span
                  style={{
                    color: isRecording ? "#FF3D02" : "#6A20A4",
                    fontWeight: isRecording ? 600 : 500,
                    fontSize: "0.875rem",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {isTranscribing
                    ? "Transcribiendo..."
                    : isRecording
                      ? "Grabando... (Click para parar)"
                      : "Grabar audio"}
                </span>
              </div>
            </div>
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
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 2rem",
            fontSize: "1.125rem",
            border: "2px solid #6A20A4",
            borderRadius: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "#6A20A4",
            fontWeight: "500",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentIndex === 0 ? 0.5 : 1,
            transition: "all 0.3s ease",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
          onClick={() => handleIndex("subtract")}
          disabled={currentIndex === 0}
          onMouseEnter={e => {
            if (currentIndex !== 0) {
              e.currentTarget.style.backgroundColor = "#6A20A4";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={e => {
            if (currentIndex !== 0) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
              e.currentTarget.style.color = "#6A20A4";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          <Icon name='arrow_left' strokeColor='currentColor' />
          <span>Anterior</span>
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 2rem",
            fontSize: "1.125rem",
            border: "none",
            borderRadius: "1rem",
            background: "linear-gradient(90deg, #FF3D02 0%, #6A20A4 100%)",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 15px rgba(255, 61, 2, 0.3)",
          }}
          onClick={() => handleIndex("add")}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 61, 2, 0.4)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 61, 2, 0.3)";
          }}
        >
          <span>Siguiente</span>
          <Icon name='arrow_right' strokeColor='white' />
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 61, 2, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 61, 2, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 61, 2, 0);
          }
        }

        @media (max-width: 768px) {
          /* Mobile responsive styles would go here */
        }
      `}</style>
    </div>
  );
}

export default QuestForm;
