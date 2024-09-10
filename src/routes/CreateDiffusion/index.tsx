"use client";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import { useState } from "react";
import { useTranslations } from "next-intl";

const CreateDiffusion = () => {
  const dict = useTranslations("dict.designs.diffusion");
  const [activeStep, setActiveStep] = useState(1);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <section className={styles.create_diffusion}>
      <Breadcrumb title={dict("back_design")} />

      <div className={styles.wizard}>
        <div
          className={`${styles.step} ${activeStep === 1 ? styles.active : styles.disabled}`}
          onClick={() => handleStepChange(1)}
        >
          <p>1</p>
          <p className={styles.text}>Select PWA</p>
        </div>

        <div className={styles.line}></div>
        <div
          className={`${styles.step} ${activeStep === 2 ? styles.active : styles.disabled}`}
          onClick={() => handleStepChange(2)}
        >
          <p>2</p>
          <p className={styles.text}>Fill fields</p>
        </div>
      </div>
    </section>
  );
};

export default CreateDiffusion;
