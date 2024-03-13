"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Steps from "../Steps";
import { useState } from "react";

const Step1 = () => {
  const dict = useTranslations("dict.guide.stepper_one");
  const [activeStep, setActiveStep] = useState(1);
  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber);
  };

  return (
    <div className={styles.container}>
      <h1>{dict("title")}</h1>
      <div className={styles.step_container}>
        <div onClick={() => handleStepClick(1)}>
          <Steps
            step_number={1}
            title={dict("title_one")}
            subtitle={dict("subtitle_one")}
            isActive={activeStep === 1}
          />
        </div>
        <div onClick={() => handleStepClick(2)}>
          <Steps
            step_number={2}
            title={dict("title_two")}
            subtitle={dict("subtitle_two")}
            isActive={activeStep === 2}
          />
        </div>
        <div onClick={() => handleStepClick(3)}>
          <Steps
            step_number={3}
            title={dict("title_three")}
            subtitle={dict("subtitle_three")}
            isActive={activeStep === 3}
          />
        </div>
        <div onClick={() => handleStepClick(4)}>
          <Steps
            step_number={4}
            title={dict("title_four")}
            subtitle={dict("subtitle_four")}
            isActive={activeStep === 4}
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
