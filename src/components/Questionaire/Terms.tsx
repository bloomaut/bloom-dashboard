import React, { useState } from "react";
import Icon from "../Icon";

interface Props {
  handleTerms: () => void;
}

export default function Terms({ handleTerms }: Props) {
  const terms = [
    "Toda la información proporcionada será utilizada únicamente para mejorar tu experiencia.",
    "Tus datos están protegidos según nuestra política de privacidad.",
    "Las respuestas que proporciones durante el onboarding serán procesadas para generar tu documento de propuesta.",
    "Small se reserva el derecho de modificar estos términos en cualquier momento.",
  ];

  const [term, setTerm] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
      <div style={{ width: "45%", display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: "1.8rem", fontWeight: 600, color: "#FF5733" }}>Bienvenidos a Small!</div>
        <div style={{ backgroundColor: "#D9D9D9", height: "50vh", borderRadius: 15 }}></div>
        <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#575757" }}>Términos y condiciones</div>
        <div
          style={{
            height: "fit",
            borderRadius: 15,
            border: "1px solid #FF5733",
            fontSize: "0.9rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            fontFamily: "Barlow, sans-serif",
            color: "#575757",
          }}
        >
          <div>Al utilizar Small, aceptas los siguientes términos y condiciones</div>
          {terms.map((term, index) => {
            return (
              <div style={{ paddingLeft: "0.2rem" }} key={index}>
                {index + 1}. {term}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div
            style={{
              height: "fit",
              width: "100%",
              fontSize: "0.8rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "row",

              gap: "1rem",
              fontFamily: "barrow",
              color: "#575757",
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
                width: "15px",
                height: "15px",
                border: "2px solid orange",
                borderRadius: "4px",
                display: "inline-block",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span
                style={{
                  content: '""',
                  position: "absolute",
                  top: "1px",
                  left: "3px",
                  width: "5px",
                  height: "8px",
                  border: "solid orange",
                  borderWidth: "0 2px 2px 0",
                  transform: "rotate(45deg)",
                  opacity: term ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
                className='checkmark'
              ></span>
            </label>
            Acepto los términos y condiciones
          </div>
          <div
            style={{
              width: "8rem",
              height: "2.5rem",
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
            onClick={() => {
              if (!term) return;
              handleTerms();
            }}
          >
            <div style={{ paddingBottom: "0.1rem" }}>Siguiente</div> <Icon name='arrow_right' strokeColor='#ffffff' />
          </div>
        </div>
      </div>
    </div>
  );
}
