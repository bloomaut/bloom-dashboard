"use client";
import styles from "./styles.module.scss";
import { FlakesProvider } from "@/context/FlakesContext";
import { useTranslations } from "next-intl";
import { useState } from "react";
//Componentes
import Breadcrumb from "@/components/Breadcrumb";
import Form from "./Form";
import PhoneCase from "./PhoneCase";
import TemplatesSelector from "./TemplatesSelector";

const Playground = () => {
  const dict = useTranslations("dict.playground");
  const [loadingDots, setLoadingDots] = useState(false);

  return (
    <FlakesProvider>
      <section className={styles.container}>
        <div className={styles.breadcrumb_container}>
          <Breadcrumb title={dict("breadcrumb_title")} />
        </div>
        <div className={styles.inner_container}>
          <TemplatesSelector />
          <Form setLoadingDots={setLoadingDots} />
          <PhoneCase loadingDots={loadingDots} />
        </div>
      </section>
    </FlakesProvider>
  );
};

export default Playground;
