"use client";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import { useState } from "react";
import { useTranslations } from "next-intl";
import PowerappList from "./PowerappList";
import DesignForm from "./DesignForm";
import { DesignProvider, useDesignContext } from "@/context/DesignContext";
import { useMessageToast } from "@/hooks/useMessageToast";

const CreateDesign = () => {
  const { designSelected } = useDesignContext();
  const { notifyError } = useMessageToast();
  const [activeStep, setActiveStep] = useState(1);
  const dict = useTranslations("dict");

  const handleStepChange = (step: number) => {
    if (step === 2 && !designSelected) {
      notifyError(dict("toast.error_design_selected"));
    } else {
      setActiveStep(step);
    }
  };

  return (
    <DesignProvider>
      <section className={styles.create_diffusion}>
        <Breadcrumb title={dict("designs.diffusion.back_design")} />

        <div className={styles.wizard}>
          <div
            className={`${styles.step} ${activeStep === 1 ? styles.active : styles.disabled}`}
            onClick={() => handleStepChange(1)}
          >
            <p>1</p>
            <p className={styles.text}>{dict("designs.diffusion.select_pwa")}</p>
          </div>

          <div className={styles.line}></div>
          <div
            className={`${styles.step} ${activeStep === 2 ? styles.active : styles.disabled}`}
            onClick={() => handleStepChange(2)}
          >
            <p>2</p>
            <p className={styles.text}>{dict("designs.diffusion.fill_fields")}</p>
          </div>
        </div>

        {activeStep === 1 ? <PowerappList setActiveStep={setActiveStep} /> : <DesignForm />}
      </section>
    </DesignProvider>
  );
};

export default CreateDesign;
