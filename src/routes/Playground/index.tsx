"use client";
import styles from "./styles.module.scss";
import { FlakesProvider } from "@/context/FlakesContext";
import { useTranslations } from "next-intl";
import { OpenGraphProvider } from "@/context/OpenGraphContext";
// Components
import Form from "./Form";
import PhoneCase from "./PhoneCase";
import TemplatesSelector from "./TemplatesSelector";
import Title from "@/components/Title";

const Playground = () => {
  const dict = useTranslations("dict.playground");

  return (
    <FlakesProvider>
      <OpenGraphProvider>
        <section className={styles.container}>
          <div className={styles.title_container}>
            <Title text={dict("title")} />
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
