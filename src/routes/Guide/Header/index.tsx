"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface HeaderProps {
  activeStep: number;
  handleStepChange: (step: number) => void;
}

const Header = ({ activeStep, handleStepChange }: HeaderProps) => {
  const dict = useTranslations("dict.guide");
  return (
    <div className={styles.main_container}>
      <div
        className={`${styles.container} ${activeStep === 1 ? styles.active : styles.inactive}`}
        onClick={() => handleStepChange(1)}
      >
        <h1>{dict("stepper_title1")}</h1>
        <p>{dict("stepper_subtitle1")}</p>
      </div>
      <div
        className={`${styles.container} ${activeStep === 2 ? styles.active : styles.inactive}`}
        onClick={() => handleStepChange(2)}
      >
        <h1>{dict("stepper_title2")}</h1>
        <p>{dict("stepper_subtitle2")}</p>
      </div>
    </div>
  );
};

export default Header;
