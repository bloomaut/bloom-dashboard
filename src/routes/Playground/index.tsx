"use client";
import Form from "./Form";
import PhoneCase from "./PhoneCase";
import TemplatesSelector from "./TemplatesSelector";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import { FlakesProvider } from "@/context/FlakesContext";

const Playground = () => {
  return (
    <FlakesProvider>
      <section className={styles.container}>
        <div className={styles.breadcrumb_container}>
          <Breadcrumb title={"Simulador"} />
        </div>
        <div className={styles.inner_container}>
          <TemplatesSelector />
          <Form />
          <PhoneCase />
        </div>
      </section>
    </FlakesProvider>
  );
};

export default Playground;
