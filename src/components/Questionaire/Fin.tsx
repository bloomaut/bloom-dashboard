"use client";
import React, { useEffect } from "react";
import { CircleLoader } from "./Spinner";
import { postOnboarding, postProp } from "@/services/fetch";
import { generatePropPayload } from "./questions";
import PollUser from "./Polling";
import { useTranslations } from "next-intl";

function Fin({
  setTab,
  questData,
}: {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  questData: {
    userId: string;
    answers: string[];
    terms: boolean;
    completed: boolean;
    prop: boolean;
  };
}) {
  const dict = useTranslations("dict.completion");

  useEffect(() => {
    let hasExecuted = false;

    const timeoutId = setTimeout(async () => {
      if (!hasExecuted) {
        hasExecuted = true;
        try {
          const payload = generatePropPayload({ userId: questData.userId, answers: questData.answers });
          await postProp(payload);
          postOnboarding();
        } catch (error) {
          console.error("Error posting prop:", error);
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Mantener array vacío pero con cleanup

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
        minHeight: "100vh",
        padding: "2rem 1rem",
        marginTop: "-1rem",
      }}
    >
      {/* Progress Section - Mismo estilo que QuestForm */}
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          marginBottom: "3rem",
        }}
      >
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
            {dict("completed")}
          </span>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              color: "var(--color-secondary)",
            }}
          >
            {dict("progress")}
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
              width: "100%",
              transition: "all 0.5s ease-out",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      </div>

      {/* Main Content - Centrado y responsive */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          width: "100%",
          height: "80vh",
          textAlign: "center",
          gap: "2rem",
        }}
      >
        {/* Loader con animación mejorada */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <CircleLoader />
        </div>

        {/* Título principal */}
        <h1
          style={{
            fontWeight: "700",
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "var(--color-primary)",
            lineHeight: "1.2",
            marginBottom: "1rem",
            maxWidth: "90%",
          }}
        >
          {dict("processing_title")}
        </h1>

        {/* Descripción */}
        <div
          style={{
            fontWeight: "400",
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#6B7280",
            lineHeight: "1.6",
            maxWidth: "90%",
            marginBottom: "2rem",
          }}
        >
          {dict("processing_description")}
          <br />
          {dict("notification_description")}
        </div>

        {/* Componente PollUser */}
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            marginTop: "2rem",
          }}
        >
          <PollUser setTab={setTab} />
        </div>

        {/* Información adicional con mejor diseño */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "1rem",
            padding: "1.5rem 2rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginTop: "2rem",
            maxWidth: "90%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--color-primary)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {dict("status_processing")}
            </span>
          </div>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              margin: 0,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {dict("keep_page_open")}
          </p>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @media (max-width: 768px) {
          /* Ajustes adicionales para móvil si es necesario */
        }

        @media (max-width: 480px) {
          /* Ajustes para pantallas muy pequeñas */
        }
      `}</style>
    </div>
  );
}

export default Fin;
