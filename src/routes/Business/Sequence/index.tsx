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
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(true);
  const [step3, setStep3] = useState(true);
  const [step4, setStep4] = useState(true);
  const dict = useTranslations("dict.business.sequence");

  useEffect(() => {
    if (business?.name) {
      setStep2(false);
    }
    if (business?.name && business?.logo) {
      setStep3(false);
    }
    if (business?.name && business?.logo && files?.length > 1) {
      for (const file of files) {
        if (file.filetype === "application/pdf") {
          setStep4(false);
          break;
        }
      }
    }
  }, [business, files]);

  const content: ContentProps[] = [
    {
      step: 1,
      title: `${dict("card_title_01")}`,
      description: `${dict("card_description_01")}`,
      disabled: step1,
    },
    {
      step: 2,
      title: `${dict("card_title_02")}`,
      description: `${dict("card_description_02")}`,
      disabled: step2,
    },
    {
      step: 3,
      title: `${dict("card_title_03")}`,
      description: `${dict("card_description_03")}`,
      disabled: step3,
    },
    {
      step: 4,
      title: `${dict("card_title_04")}`,
      description: `${dict("card_description_04")}`,
      disabled: step4,
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
