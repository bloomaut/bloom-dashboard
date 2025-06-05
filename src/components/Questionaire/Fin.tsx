import React from "react";
import { CircleLoader } from "./Spinner";

function Fin() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 30,
        position: "relative",
        marginTop: "2rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "70%",
          height: "8px",
          background: " #FF5733",
          borderRadius: "5px",
          position: "relative",
          marginBottom: "8rem",
        }}
      >
        <div style={{ position: "absolute", top: "-35px" }}>Terminado</div>
      </div>

      <div style={{ position: "absolute", top: "-35px", right: "15%" }}>100%</div>
      <CircleLoader />
      <div style={{ fontWeight: 600, fontFamily: "inter, sans-serif", fontSize: "2.2rem", marginTop: "2rem" }}>
        Estamos procesando tu respuesta
      </div>
      <div
        style={{
          fontWeight: 300,
          fontFamily: "inter, sans-serif",
          fontSize: "1.5rem",
          marginTop: "2rem",
          textAlign: "center",
        }}
      >
        Este proceso tomará entre 15 y 20 minutos.
        <br /> Te notificaremos por correo electrónico y en esta
        <br /> página cuando tu documento esté listo.
      </div>
    </div>
  );
}

export default Fin;
