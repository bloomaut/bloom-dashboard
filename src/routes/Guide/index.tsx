"use client";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { get } from "@/services/fetch";
// Componentes
import Step1 from "./Step1";
import Step2 from "./Step2";
import Header from "./Header";
import LoadingSpinner from "@/components/Loading";

const GuidePage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStep = async () => {
      setIsLoading(true);
      const userData = await get("small-business/me");
      if (userData.statusCode === 200) {
        const userStep = userData.result.data.smallBusiness.step;
        setStep(userStep);
        setIsLoading(false);
      } else {
        setStep(0);
      }
      setIsLoading(false);
    };
    fetchUserStep();
  }, []);

  return (
    <section className={styles.container}>
      <Header handleStepChange={setActiveStep} activeStep={activeStep} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {activeStep === 1 && <Step1 userStep={step} />}
          {activeStep === 2 && <Step2 userStep={step} />}
        </>
      )}
    </section>
  );
};

export default GuidePage;
