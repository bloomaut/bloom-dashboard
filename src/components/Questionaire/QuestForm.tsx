import React from "react";
import Buttons from "./Buttons";
import { QuestData } from "./Questionaire";
import GradientBar from "./QuestBar";
import Icon from "../Icon";
import Image from "next/image";

interface Props {
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void;
  handleIndex: (operation: string) => void;
  currentIndex: number;
  questData: QuestData;
}

function QuestForm({ handleChange, handleIndex, currentIndex, questData }: Props) {
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
      <GradientBar value={currentIndex} />
      <div style={{ width: "100%", display: "flex", flexDirection: "row", height: "100%" }}>
        <div style={{ width: "65%", height: "100%" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 600 }}>
            ¿Cuáles son tus principales objetivos de negocio para los próximos 6 meses?
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
              border: "1px solid #FF5733",
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
            }}
            value={questData.answers[currentIndex]}
            onChange={e => handleChange(e, currentIndex)}
            placeholder='Escribe aqui o deja un audio (Podrás leer y editar tu respuesta aquí)'
          ></textarea>
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
                cursor: "pointer",
              }}
            >
              <Image src={"/mic.png"} alt='mic' width={40} height={40} />
              <div style={{ color: "#939393", display: "flex", alignItems: "center", justifyItems: "center" }}>
                Grabar audio
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
              <div style={{ paddingBottom: "0.1rem" }}>Siguiente</div> <Icon name='arrow_right' strokeColor='#ffffff' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestForm;
{
  /* {<input type='text' onChange={e => handleChange(e, currentIndex)} value={questData.answers[currentIndex]} />}

      <Buttons handleIndex={handleIndex} /> */
}
