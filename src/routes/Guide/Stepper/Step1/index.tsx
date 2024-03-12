"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface Step1Props {
  isActive: boolean;
  onClick: () => void;
}

const Step1: React.FC<Step1Props> = ({ isActive, onClick }) => {
  const dict = useTranslations("dict.guide");
  return (
    <div className={`${styles.container} ${isActive ? styles.active : styles.inactive}`} onClick={onClick}>
      <h1>{dict("stepper_title1")}</h1>
      <p>{dict("stepper_subtitle1")}</p>
    </div>
  );
};

export default Step1;
