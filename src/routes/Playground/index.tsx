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
  const [loading, setLoading] = useState(false);
  return (
    <FlakesProvider>
      <section className={styles.container}>
        <div className={styles.breadcrumb_container}>
          <Breadcrumb title={dict("breadcrumb_title")} />
        </div>
        <div className={styles.inner_container}>
          <TemplatesSelector />
          <Form setLoading={setLoading} />
          <PhoneCase loading={loading} />
        </div>
      </section>
    </FlakesProvider>
  );
};

export default Playground;
