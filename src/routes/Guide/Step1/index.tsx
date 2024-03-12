"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Steps from "../Steps";

const Step1 = () => {
  const dict = useTranslations("dict.guide.stepper_one");
  return (
    <div className={styles.container}>
      <h1>Pasos</h1>
      <div className={styles.step_container}>
        <Steps step_number={1} title={dict("title_one")} subtitle={dict("subtitle_one")} />
        <Steps step_number={2} title={dict("title_two")} subtitle={dict("subtitle_two")} />
        <Steps step_number={3} title={dict("title_three")} subtitle={dict("subtitle_three")} />
        <Steps step_number={4} title={dict("title_four")} subtitle={dict("subtitle_four")} />
      </div>
    </div>
  );
};

export default Step1;
