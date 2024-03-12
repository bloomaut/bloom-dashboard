"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Header from "./Header";

const GuidePage = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className={styles.container}>
      <Header handleStepChange={setActiveStep} activeStep={activeStep}></Header>
      {activeStep === 1 && <Step1 />}
      {activeStep === 2 && <Step2 />}
    </section>
  );
};

export default GuidePage;
