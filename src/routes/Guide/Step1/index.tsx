"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Steps from "../Steps";

const Step1 = () => {
  const dict = useTranslations("dict.guide.stepper_one");
  return (
    <div className={styles.container}>
      <h1>Pasos</h1>
      <Steps step_number={1} title={dict("title_one")} subtitle={dict("subtitle_one")} />
    </div>
  );
};

export default Step1;
