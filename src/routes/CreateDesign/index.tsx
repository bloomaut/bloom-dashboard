"use client";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import { useState } from "react";
import { useTranslations } from "next-intl";
import PowerappList from "./PowerappList";
import DesignForm from "./DesignForm";
import { DesignProvider } from "@/context/DesignContext";

const CreateDesign = () => {
  const dict = useTranslations("dict.designs.diffusion");
  const [activeStep, setActiveStep] = useState(1);

  return (
    <DesignProvider>
      <section className={styles.create_diffusion}>
        <Breadcrumb title={dict("back_design")} />

        <div className={styles.wizard}>
          <div
            className={`${styles.step} ${activeStep === 1 ? styles.active : styles.disabled}`}
            onClick={() => setActiveStep(1)}
          >
            <p>1</p>
            <p className={styles.text}>{dict("select_pwa")}</p>
          </div>

          <div className={styles.line}></div>
          <div
            className={`${styles.step} ${activeStep === 2 ? styles.active : styles.disabled}`}
            onClick={() => setActiveStep(2)}
          >
            <p>2</p>
            <p className={styles.text}>{dict("fill_fields")}</p>
          </div>
        </div>

        {activeStep === 1 ? <PowerappList setActiveStep={setActiveStep} /> : <DesignForm />}
      </section>
    </DesignProvider>
  );
};

export default CreateDesign;
