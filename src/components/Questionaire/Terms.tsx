import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  handleTerms: () => void;
}

export default function Terms({ handleTerms }: Props) {
  const [term, setTerm] = useState(false);
  const dict = useTranslations("dict.terms");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        marginTop: "-1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(1.5rem, 4vw, 3rem)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Título principal - Responsive (más pequeño) */}
        <h2
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontWeight: 600,
            color: "#000000",
            margin: 0,
            textAlign: "center",
            lineHeight: "1.2",
          }}
        >
          {dict("title")}
        </h2>

        {/* Subtítulo - Responsive (más pequeño) */}
        <p
          style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
            fontWeight: 400,
            color: "#6B7280",
            margin: 0,
            textAlign: "center",
            lineHeight: "1.6",
            maxWidth: "min(700px, 90vw)",
            padding: "0 1rem",
          }}
        >
          {dict("subtitle")}
        </p>

        {/* Contenedor de video con ratio 16:9 - Más grande */}
        <div
          style={{
            width: "100%",
            maxWidth: "min(850px, 95vw)",
            margin: "0 1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              backgroundColor: "#D9D9D9",
              borderRadius: "clamp(15px, 2vw, 20px)",
              overflow: "hidden",
            }}
          >
            {/* Aquí puedes agregar tu iframe o video */}
            {/* Ejemplo con iframe:
            <iframe
              src="tu-url-de-video"
              style={{
                width: "100%",
                height: "100%",
                border: "none"
              }}
              allowFullScreen
            />
            */}
          </div>
        </div>

        {/* Checkbox y términos - Responsive (más pequeño) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center", // Cambio de flex-start a center para mejor alineación
            gap: "clamp(0.8rem, 2vw, 1.2rem)",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            color: "#4B5563",
            maxWidth: "min(700px, 90vw)",
            width: "100%",
            padding: "0 1rem",
          }}
        >
          <input
            type='checkbox'
            id='term'
            name='term'
            onChange={() => setTerm(!term)}
            style={{
              display: "none",
            }}
          />
          <label
            htmlFor='term'
            style={{
              width: "clamp(16px, 3.5vw, 18px)",
              height: "clamp(16px, 3.5vw, 18px)",
              border: "2px solid var(--color-primary)",
              borderRadius: "4px",
              display: "inline-block",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              marginTop: "0", // Removido el marginTop para mejor alineación
            }}
          >
            <span
              style={{
                content: '""',
                position: "absolute",
                top: "1px",
                left: "clamp(3px, 0.8vw, 4px)",
                width: "5px",
                height: "8px",
                border: "solid var(--color-primary)",
                borderWidth: "0 2px 2px 0",
                transform: "rotate(45deg)",
                opacity: term ? 1 : 0,
                transition: "opacity 0.2s",
              }}
              className='checkmark'
            ></span>
          </label>

          <span style={{ lineHeight: "1.5" }}>
            {dict("checkbox_text")}{" "}
            <a
              href='/terminos-y-condiciones'
              target='_blank'
              style={{
                color: "var(--color-primary)",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {dict("terms_link")}
            </a>{" "}
            {dict("checkbox_suffix")}
          </span>
        </div>

        {/* Botón Continuar - Responsive (más pequeño) */}
        <button
          style={{
            width: "clamp(180px, 45vw, 220px)",
            height: "clamp(45px, 10vw, 52px)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "clamp(22px, 5vw, 26px)",
            backgroundColor: term ? "var(--color-primary)" : "#D1D5DB",
            border: "none",
            color: term ? "#ffffff" : "#9CA3AF",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            fontWeight: 500,
            gap: "clamp(0.5rem, 1.5vw, 0.8rem)",
            cursor: term ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
            boxShadow: term ? "0 6px 16px var(--color-primary)" : "none",
            transform: term ? "translateY(0)" : "none",
            margin: "0 1rem",
            padding: "0",
          }}
          onClick={() => {
            if (!term) return;
            handleTerms();
          }}
          disabled={!term}
          onMouseEnter={e => {
            if (term && window.innerWidth > 768) {
              // Solo hover en desktop
              e.currentTarget.style.backgroundColor = "#5A0075";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px #5A0075";
            }
          }}
          onMouseLeave={e => {
            if (term && window.innerWidth > 768) {
              // Solo hover en desktop
              e.currentTarget.style.backgroundColor = "var(--color-primary)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 16px var(--color-primary)";
            }
          }}
        >
          {dict("continue_button")}
        </button>
      </div>
    </div>
  );
}
