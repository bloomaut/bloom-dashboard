import Image from "next/image";
import React from "react";

const GradientBar = ({ value }: { value: number }) => {
  const clampedValue = Math.max(0, Math.min(400, value)); // Clamp between 0 and 100
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 30, position: "relative" }}>
      <div
        style={{
          width: "25%",
          height: "8px",
          background:
            parseInt(String(value)[0]) >= 0
              ? `linear-gradient(to right, #FF5733 ${clampedValue}%, #BEBEBE ${clampedValue}%)`
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
          width: "25%",
          height: "8px",
          background:
            String(value).length === 3 && parseInt(String(value)[0]) >= 1
              ? `linear-gradient(to right, #FF5733 ${clampedValue - 100}%, #BEBEBE ${clampedValue - 100}%)`
              : "#BEBEBE",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "-48px", top: "-35px" }}>Objetivos</div>
        <Image
          src={String(value).length === 3 && parseInt(String(value)[0]) >= 1 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", left: "-26px", top: "-7px" }}
        />
      </div>
      <div
        style={{
          width: "25%",
          height: "8px",
          background:
            String(value).length === 3 && parseInt(String(value)[0]) >= 2
              ? `linear-gradient(to right, #FF5733 ${clampedValue - 200}%, #BEBEBE ${clampedValue - 200}%)`
              : "#BEBEBE",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "-48px", top: "-35px" }}>Desafios</div>
        <Image
          src={String(value).length === 3 && parseInt(String(value)[0]) >= 2 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", left: "-26px", top: "-7px" }}
        />
      </div>
      <div
        style={{
          width: "25%",
          height: "8px",
          background:
            String(value).length === 3 && parseInt(String(value)[0]) >= 3
              ? `linear-gradient(to right, #FF5733 ${clampedValue - 300}%, #BEBEBE ${clampedValue - 300}%)`
              : "#BEBEBE",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "-48px", top: "-35px" }}>Recursos</div>
        <Image
          src={String(value).length === 3 && parseInt(String(value)[0]) >= 3 ? "/orangeCircle.png" : "/greyCircle.png"}
          alt='circle'
          width={22}
          height={22}
          style={{ position: "absolute", left: "-26px", top: "-7px" }}
        />
      </div>
      <div style={{ position: "absolute", right: "0px", top: "-35px" }}>Resultados esperados</div>
    </div>
  );
};

export default GradientBar;
