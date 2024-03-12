// GuidePage.js
"use client";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import Step1 from "./Stepper/Step1";
import Step2 from "./Stepper/Step2";

const GuidePage = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <section className={styles.container}>
      <Step1 isActive={activeStep === 1} onClick={() => handleStepChange(1)} />
      <Step2 isActive={activeStep === 2} onClick={() => handleStepChange(2)} />
    </section>
  );
};

export default GuidePage;
