import React from "react";
import Image from "next/image";
import small from "@/../public/assets/logo_small_color.png";

function WishList() {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center", paddingTop: "15%" }}>
      <div
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          fontFamily: "Inter, sans-serif",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-font-secondary)",
        }}
      >
        <Image src={"/logotipo_horizontal.png"} alt='Small' width={150} height={150} priority />
        <div style={{ paddingTop: "15%", textAlign: "center" }}>
          {" "}
          ¡Estás en la lista de espera! Te avisaremos por correo electrónico en cuanto haya novedades o tu lugar esté
          disponible. Revisa tu bandeja de entrada (y la carpeta de spam, por si acaso) para no perderte la
          actualización.
        </div>
      </div>
    </div>
  );
}

export default WishList;
