"use client";
import styles from "./styles.module.scss";
import { FlakesProvider } from "@/context/FlakesContext";
import { useTranslations } from "next-intl";
//Componentes
import Breadcrumb from "@/components/Breadcrumb";
import Form from "./Form";
import PhoneCase from "./PhoneCase";
import TemplatesSelector from "./TemplatesSelector";
import { OpenGraphProvider } from "@/context/OpenGraphContext";

const Playground = () => {
  const dict = useTranslations("dict.playground");

  return (
    <FlakesProvider>
      <OpenGraphProvider>
        <section className={styles.container}>
          <div className={styles.breadcrumb_container}>
            <Breadcrumb title={dict("breadcrumb_title")} />
          </div>
          <div className={styles.inner_container}>
            <TemplatesSelector />
            <Form />
            <PhoneCase />
          </div>
        </section>
      </OpenGraphProvider>
    </FlakesProvider>
  );
};

export default Playground;
