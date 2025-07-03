// Updated QuestForm component with speech-to-text functionality
import React, { useState, useRef, useEffect } from "react";
import { QuestData } from "./Questionaire";
import GradientBar from "./QuestBar";
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        justifyContent: "start",
        alignItems: "center",
        height: "100%",
        marginTop: "1rem",
      }}
    >
      <GradientBar value={currentIndex * 4} />
      <div style={{ width: "100%", display: "flex", flexDirection: "row", height: "100%" }}>
        <div style={{ width: "65%", height: "100%" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 600 }}>
            {questions[currentIndex]}
          </div>
          <div
            style={{ backgroundColor: "#D9D9D9", height: "88%", borderRadius: 15, marginTop: "3rem", width: "90%" }}
          ></div>
        </div>
        <div style={{ width: "35%", height: "100%" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 600 }}>
            Términos y condiciones
          </div>
          <textarea
            style={{
              borderRadius: 15,
              border: isRecording ? "2px solid #FF5733" : "1px solid #FF5733",
              fontSize: "0.9rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontFamily: "Barlow, sans-serif",
              color: "#575757",
              marginTop: "3rem",
              height: "79%",
              width: "100%",
              outline: "none",
              resize: "none",
              backgroundColor: isRecording ? "#fff5f3" : "white",
            }}
            value={questData.answers[currentIndex]}
            onChange={e => handleChange(e, currentIndex)}
            placeholder={
              isTranscribing
                ? "Transcribiendo..."
                : "Escribe aqui o deja un audio (Podrás leer y editar tu respuesta aquí)"
            }
            required={true}
            disabled={isTranscribing}
          />
          {empty && (
            <div
              style={{
                backgroundColor: "gray",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px",
                borderTopRightRadius: "20px",
                padding: "0.4rem",
                whiteSpace: "nowrap",
                position: "absolute",
                top: "300px",
                right: "10%",
                color: "white",
              }}
            >
              Campo no puede estar vacio
            </div>
          )}
          <div
            style={{
              width: "100%",
              height: "10%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                cursor: isTranscribing ? "not-allowed" : "pointer",
                opacity: isTranscribing ? 0.5 : 1,
              }}
              onClick={!isTranscribing ? handleMicrophoneClick : undefined}
            >
              <div
                style={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: isRecording ? "#FF5733" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: isRecording ? "pulse 1.5s infinite" : "none",
                }}
              >
                <Image
                  src={"/mic.png"}
                  alt='mic'
                  width={40}
                  height={40}
                  style={{
                    filter: isRecording ? "brightness(0) invert(1)" : "none",
                  }}
                />
              </div>
              <div
                style={{
                  color: isRecording ? "#FF5733" : "#939393",
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                  fontWeight: isRecording ? 600 : 400,
                }}
              >
                {isTranscribing ? "Transcribiendo..." : isRecording ? "Grabando... (Click para parar)" : "Grabar audio"}
              </div>
            </div>
            <div
              style={{
                width: "8rem",
                height: "2.2rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "30px",
                backgroundColor: "#FF5733",
                paddingBlock: 10,
                paddingInline: 20,
                color: "#ffffff",
                fontSize: "0.8rem",
                gap: "0.8rem",
                cursor: "pointer",
              }}
              onClick={() => handleIndex("add")}
            >
              <div style={{ paddingBottom: "0.1rem" }}>Siguiente</div>
              <Icon name='arrow_right' strokeColor='#ffffff' />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 87, 51, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 87, 51, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 87, 51, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default QuestForm;
