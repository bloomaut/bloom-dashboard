import React from "react";
import Image from "next/image";
import small from "@/../public/assets/logo_small_color.png";

function WishList() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          fontFamily: "Inter, sans-serif",
          alignItems: "center",
          justifyContent: "start",
          color: "var(--color-font-secondary)",
          marginTop: "10%",
        }}
      >
        <div style={{ position: "relative", width: "700px", height: "250px", marginTop: "2%" }}>
          <Image src={"/bloomLogo.png"} alt='Bloom AI' fill priority />
        </div>
        <p style={{ paddingTop: "3%" }}>¡Gracias por unirte a Bloom AI!</p>
        <div style={{ paddingTop: "1%", textAlign: "center" }}>
          {" "}
          ¡Estás en la lista de espera! Te avisaremos por correo electrónico en cuanto haya novedades o tu lugar esté
          disponible.
          <br /> Revisa tu bandeja de entrada (y la carpeta de spam, por si acaso) para no perderte la actualización.
        </div>
      </div>
    </div>
  );
}

export default WishList;
