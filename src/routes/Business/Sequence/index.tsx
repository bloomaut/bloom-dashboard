"use client";
import Button from "@/components/Button";
import Subtitle from "../Subtitle";
import Card from "./Card";
import styles from "./styles.module.scss";
import { useState } from "react";

export interface ContentProps {
  step: number;
  title: string;
  description: string;
}

const Sequence = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const content: ContentProps[] = [
    {
      step: 1,
      title: "Cargar información del negocio",
      description:
        "Con esta información de contexto diseñamos el contenido y la conversación de los chatbots. Tu sitio web ayuda",
    },
    {
      step: 2,
      title: "Subí el logo de tu empresa",
      description: "Del logo tomamos automáticamente la paleta de color que luego podrás editar",
    },
    {
      step: 3,
      title: "Documentos descriptivos",
      description: "Podes adjuntar la cantidad de información que consideres necesaria para tu negocio ",
    },
    {
      step: 4,
      title: "Flyer, brochure, brandin o publicidad",
      description: "Subí archivos referentes a tu negocio para extraer informacion",
    },
  ];

  const handleButtonClick = () => {
    console.log("Clicked on me!");
    setIsButtonDisabled(false);
  };

  return (
    <div className={styles.container}>
      <Subtitle text='Secuencia' />
      <div className={styles.cards_container}>
        {content.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>
      <div className={styles.btn_container}>
        <Button
          title='Terminé de cargar los datos'
          onclick={handleButtonClick}
          isDisabled={isButtonDisabled}
          styleName={isButtonDisabled ? "btn_disabled_sequence" : "btn"}
        />
      </div>
    </div>
  );
};

export default Sequence;
