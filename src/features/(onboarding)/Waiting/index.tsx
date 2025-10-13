"use client";
import React from "react";
import { CircleLoader } from "../components/Spinner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/features/userSlice";
import { get } from "@/services/fetch";

function Waiting() {
  const dict = useTranslations("dict.completion");
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let redirected = false;

    const checkStatus = async () => {
      try {
        const resUser = await get("user/me");
        if (resUser?.statusCode === 200) {
          const user = resUser.result.user;
          dispatch(setUserData(user));

          const client = user?.client ?? user;
          const status = client?.proposal_status;
          const proposalUrl = client?.proposal_url;

          // Cuando el documento esté listo, ir a la revisión
          if (!redirected && proposalUrl && status === "pending") {
            redirected = true;
            if (intervalId) clearInterval(intervalId);
            router.push(`/${locale}/onboarding/review`);
          }

          // Si ya fue aprobada, salir del onboarding al dashboard
          if (!redirected && status === "approved") {
            redirected = true;
            if (intervalId) clearInterval(intervalId);
            router.push(`/${locale}/dashboard`);
          }
        }
      } catch (err) {
        console.error("Error al consultar estado de propuesta:", err);
      }
    };

    // Llamada inmediata y luego cada 3 minutos
    checkStatus();
    intervalId = setInterval(checkStatus, 180000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [dispatch, router, locale]);

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
        ></div>

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

export default Waiting;
