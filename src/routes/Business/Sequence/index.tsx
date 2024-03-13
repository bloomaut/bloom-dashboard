"use client";
import Button from "@/components/Button";
import Subtitle from "../Subtitle";
import Card from "./Card";
import styles from "./styles.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";

export interface ContentProps {
  step: number;
  title: string;
  description: string;
}

const Sequence = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dict = useTranslations("dict.business.sequence");

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
