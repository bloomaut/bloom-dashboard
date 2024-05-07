"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
//Componentes
import Button from "@/components/Button";
import Subtitle from "../Subtitle";
import Card from "./Card";
import { Fade } from "react-awesome-reveal";

export interface ContentProps {
  step: number;
  title: string;
  description: string;
}

const Sequence = () => {
  const business = useAppSelector(data => data.business);
  const files = useAppSelector(data => data.files.media);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [missingSteps, setMissingSteps] = useState([1, 2, 3, 4]);
  const dict = useTranslations("dict.business.sequence");

  useEffect(() => {
    if (currentStep === 1) {
      if (business?.name) {
        setCurrentStep(2);
        setMissingSteps(missingSteps.filter(step => step !== 1));
      }
    } else if (currentStep === 2) {
      if (business?.logo) {
        setCurrentStep(3);
        setMissingSteps(missingSteps.filter(step => step !== 2));
      }
    } else if (currentStep === 3) {
      if (files?.length >= 2 && files.some(file => file.filetype === "application/pdf")) {
        setCurrentStep(4);
        setMissingSteps(missingSteps.filter(step => step !== 3 && step !== 4));
      }
    } else if (currentStep === 4) {
      if (files?.length <= 1) {
        setCurrentStep(2);
        setMissingSteps([3, 4]);
      }
    }
  }, [business, files, currentStep, missingSteps]);

  const content: ContentProps[] = [
    {
      step: 1,
      title: `${dict("card_title_01")}`,
      description: `${dict("card_description_01")}`,
    },
    {
      step: 2,
      title: `${dict("card_title_02")}`,
      description: `${dict("card_description_02")}`,
    },
    {
      step: 3,
      title: `${dict("card_title_03")}`,
      description: `${dict("card_description_03")}`,
    },
    {
      step: 4,
      title: `${dict("card_title_04")}`,
      description: `${dict("card_description_04")}`,
    },
  ];

  const handleButtonClick = () => {
    setIsButtonDisabled(false);
  };

  return (
    <div className={styles.container}>
      <Subtitle text={dict("title")} />
      <div className={styles.cards_container}>
        {content.map((data, index) => (
          <Card key={index} data={data} disabled={missingSteps.indexOf(data.step) === -1} />
        ))}
      </div>
      <div className={styles.btn_container}>
        <Button title={dict("button")} onclick={handleButtonClick} isDisabled={isButtonDisabled} />
      </div>
    </div>
  );
};

export default Sequence;
