"use client";
import Form from "./Form";
import PhoneCase from "./PhoneCase";
import TemplatesSelector from "./TemplatesSelector";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import { FlakesProvider } from "@/context/FlakesContext";
import { useTranslations } from "next-intl";
import { useState } from "react";

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
