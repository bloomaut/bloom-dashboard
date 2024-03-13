"use client";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { get } from "@/services/fetch";
// Componentes
import Step1 from "./Step1";
import Step2 from "./Step2";
import Header from "./Header";

const GuidePage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const fetchUserStep = async () => {
      const userData = await get("small-business/me", "NEXT_PUBLIC_API_DASH");
      if (userData.statusCode === 200) {
        const userStep = userData.result.data.smallBusiness.step;
        setStep(userStep);
      } else {
        console.log("Acá va a ir un toast");
      }
    };
    fetchUserStep();
  }, []);

  return (
    <section className={styles.container}>
      <Header handleStepChange={setActiveStep} activeStep={activeStep} />
      {activeStep === 1 && <Step1 userStep={step} />}
      {activeStep === 2 && <Step2 userStep={step} />}
    </section>
  );
};

export default GuidePage;
