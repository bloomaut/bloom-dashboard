"use client";
import Button from "@/components/Button";
import Subtitle from "../Subtitle";
import Card from "./Card";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";

export interface ContentProps {
  step: number;
  title: string;
  description: string;
  disabled: boolean;
}

const Sequence = () => {
  const business = useAppSelector(data => data.business);
  const files = useAppSelector(data => data.files.media);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const dict = useTranslations("dict.business.sequence");

  useEffect(() => {
    switch (currentStep) {
      case 1:
        if (business?.name) {
          setCurrentStep(2);
        }
        break;
      case 2:
        if (business?.logo) {
          setCurrentStep(3);
        }
        break;
      case 3:
        if (files?.length >= 2) {
          const hasPDF = files.some(file => file.filetype === "application/pdf");
          if (hasPDF) setCurrentStep(4);
        }
        break;
      default:
        break;
    }
  }, [business, files, currentStep]);

  const content: ContentProps[] = [
    {
      step: 1,
      title: `${dict("card_title_01")}`,
      description: `${dict("card_description_01")}`,
      disabled: currentStep !== 1,
    },
    {
      step: 2,
      title: `${dict("card_title_02")}`,
      description: `${dict("card_description_02")}`,
      disabled: currentStep !== 2,
    },
    {
      step: 3,
      title: `${dict("card_title_03")}`,
      description: `${dict("card_description_03")}`,
      disabled: currentStep !== 3,
    },
    {
      step: 4,
      title: `${dict("card_title_04")}`,
      description: `${dict("card_description_04")}`,
      disabled: currentStep !== 4,
    },
  ];

  const handleButtonClick = () => {
    console.log("Clicked on me!");
    setIsButtonDisabled(false);
  };

  return (
    <div className={styles.container}>
      <Subtitle text={dict("title")} />
      <div className={styles.cards_container}>
        {content.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>
      <div className={styles.btn_container}>
        <Button
          title={dict("button")}
          onclick={handleButtonClick}
          isDisabled={isButtonDisabled}
          styleName={isButtonDisabled ? "btn_disabled_sequence" : "btn"}
        />
      </div>
    </div>
  );
};

export default Sequence;
