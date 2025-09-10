// Updated QuestForm component with modern styling matching FormularioEmprendedor
import React, { useState, useRef, useEffect } from "react";
import { QuestData } from "./Questionaire";
import Icon from "../Icon";
import Image from "next/image";
import { questions } from "./questions";

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
  const [showConditional, setShowConditional] = useState(false);
  const [showMainQuestion, setShowMainQuestion] = useState(false);

  useEffect(() => {
    for (let index = 0; index < questData.answers.length; index++) {
      if (questData.answers[index]) {
        setIndex(index);
      }
    }
  }, []);

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
    const questionObj = questions[currentIndex];

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

  const questionObj = questions[currentIndex];
  // Defensive guard: if currentIndex is out of range (questionObj undefined),
  // avoid runtime errors and render a small fallback UI.
  if (!questionObj) {
    return (
      <div
        style={{ padding: "1rem", textAlign: "center", color: "#6B7280" }}
        onClick={() => console.log(questions, currentIndex)}
      >
        Pregunta no disponible.
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

  if (questionObj.hasConditionalQuestion && !showMainQuestion) {
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
              Pregunta {currentIndex + 1} de {questions.length}
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
              marginBottom: "3rem",
              lineHeight: "1.4",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {displayQuestion}
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
              fontSize: "1.125rem",
              color: "var(--color-font-secondary)",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
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
              color: "var(--color-primary)",
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
            marginBottom: "3rem",
            lineHeight: "1.4",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {questionObj.question}
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
                  {empty && (
                    <div
                      style={{
                        backgroundColor: "var(--color-danger, var(--color-primary))",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        boxShadow: "0 4px 12px var(--color-primary)",
                        marginTop: "1rem",
                      }}
                    >
                      Campo no puede estar vacío
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  style={{
                    width: "100%",
                    height: "300px",
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
                  placeholder={
                    isTranscribing ? "Transcribiendo..." : "Escribe aquí o usa el micrófono para grabar tu respuesta..."
                  }
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
              )}
              {/* Error Message for textarea */}
              {questionObj.type !== "singlechoice" && empty && (
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
                  Campo no puede estar vacío
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
                      ? "Transcribiendo..."
                      : isRecording
                        ? "Grabando... (Click para parar)"
                        : "Grabar audio"}
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
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            minWidth: "140px",
            fontSize: "1rem",
            border: "2px solid var(--color-primary)",
            borderRadius: "0.75rem",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "var(--color-primary)",
            fontWeight: "500",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentIndex === 0 ? 0.6 : 1,
            transition: "all 0.18s ease",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 1px 6px rgba(0, 0, 0, 0.04)",
          }}
          onClick={() => handleIndex("subtract")}
          disabled={currentIndex === 0}
          onMouseEnter={e => {
            if (currentIndex !== 0) {
              e.currentTarget.style.backgroundColor = "var(--color-primary)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "scale(1.03)";
            }
          }}
          onMouseLeave={e => {
            if (currentIndex !== 0) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.color = "var(--color-primary)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          <div style={{ position: "absolute", top: "60%", left: "1rem", transform: "translateY(-50%)" }}>
            <Icon name='arrow_left' strokeColor='currentColor' />
          </div>
          <span>Anterior</span>
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            minWidth: "140px",
            fontSize: "1rem",
            border: "none",
            borderRadius: "0.75rem",
            background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.18s ease",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          }}
          onClick={() => handleIndex("add")}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
          }}
        >
          <span style={{ color: "white", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>Siguiente</span>
          <Icon name='arrow_right' strokeColor='white' />
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

        @media (max-width: 768px) {
          /* Mobile responsive styles would go here */
        }
      `}</style>
    </div>
  );
}

export default QuestForm;
