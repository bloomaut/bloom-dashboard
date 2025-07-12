import Image from "next/image";
import React from "react";

const GradientBar = ({ value }: { value: number }) => {
  const clampedValue = Math.max(0, Math.min(500, value)); // Clamp between 0 and 100
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 30, position: "relative" }}>
      {value}
      <div
        style={{
          width: "42.8%",
          height: "8px",
          background:
            clampedValue >= 0
              ? `linear-gradient(to right, #FF5733 ${Math.min((clampedValue / 200) * 100, 100)}%, #BEBEBE ${Math.min((clampedValue / 225) * 100, 100)}%)`
              : "#BEBEBE",

          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "-35px" }}>
          Paso {String(value).length === 3 ? parseInt(String(value)[0]) : 1} de 4
        </div>
      </div>
      <div
        style={{
          width: "27.6%",
          height: "8px",
          background:
            clampedValue >= 200
              ? `linear-gradient(to right, #FF5733 ${Math.min(((clampedValue - 200) / 90) * 100, 100)}%, #BEBEBE ${Math.min(((clampedValue - 200) / 145) * 100, 100)}%)`
              : "#BEBEBE",

          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "-48px", top: "-35px" }}>Perfil</div>
        <Image
          src={String(value).length === 3 && value >= 200 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", left: "-26px", top: "-7px" }}
        />
      </div>
      <div
        style={{
          width: "9.5%",
          height: "8px",
          background:
            clampedValue >= 200
              ? `linear-gradient(to right, #FF5733 ${Math.min(((clampedValue - 290) / 42) * 100, 100)}%, #BEBEBE ${Math.min(((clampedValue - 290) / 145) * 100, 100)}%)`
              : "#BEBEBE",

          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "-48px", top: "-35px" }}>Mercado</div>
        <Image
          src={String(value).length === 3 && value >= 290 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", left: "-26px", top: "-7px" }}
        />
      </div>
      <div
        style={{
          width: "11.4%",
          height: "8px",
          background:
            clampedValue >= 200
              ? `linear-gradient(to right, #FF5733 ${Math.min(((clampedValue - 332) / 50) * 100, 100)}%, #BEBEBE ${Math.min(((clampedValue - 332) / 145) * 100, 100)}%)`
              : "#BEBEBE",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "-48px", top: "-35px" }}>Estrategia</div>
        <Image
          src={String(value).length === 3 && value >= 332 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", left: "-26px", top: "-7px" }}
        />
      </div>
      <div
        style={{
          width: "7.6%",
          height: "8px",
          background:
            clampedValue >= 200
              ? `linear-gradient(to right, #FF5733 ${Math.min(((clampedValue - 382) / 35) * 100, 100)}%, #BEBEBE ${Math.min(((clampedValue - 382) / 145) * 100, 100)}%)`
              : "#BEBEBE",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "-48px", top: "-35px" }}>Operaciones</div>
        <Image
          src={String(value).length === 3 && value >= 384 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", left: "-26px", top: "-7px" }}
        />
      </div>
      <div>
        <div style={{ position: "absolute", right: "0px", top: "-35px" }}>Finanzas</div>
        <Image
          src={String(value).length === 3 && value >= 418 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", right: "0px", top: "-7px" }}
        />
      </div>
    </div>
  );
};

export default GradientBar;
