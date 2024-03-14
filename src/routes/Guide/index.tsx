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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserStep = async () => {
      setIsLoading(true);
      try {
        const userData = await get("small-business/me", "NEXT_PUBLIC_API_DASH");
        if (userData.statusCode === 200) {
          const userStep = userData.result.data.smallBusiness.step;
          setStep(userStep);
          setIsLoggedIn(true);
        } else {
          console.log("Acá va a ir un toast");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        setIsLoggedIn(false);
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
      ) : isLoggedIn ? ( // Si el usuario está logueado
        <>
          {activeStep === 1 && <Step1 userStep={step} />}
          {activeStep === 2 && <Step2 userStep={step} />}
        </>
      ) : (
        // Si no está logueado, cargar pasos deshabilitados
        <>
          {activeStep === 1 && <Step1 userStep={0} />}
          {activeStep === 2 && <Step2 userStep={0} />}
        </>
      )}
    </section>
  );
};

export default GuidePage;
