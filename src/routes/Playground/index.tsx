"use client";
import Form from "./Form";
import PhoneCase from "./PhoneCase";
import TemplatesSelector from "./TemplatesSelector";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";

interface Content {
  title: string;
  description: string;
}

const Playground = () => {
  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb_container}>
        <Breadcrumb title={"Simulador"} route={"introduction"} />
      </div>
      <div className={styles.inner_container}>
        <TemplatesSelector/>
        <Form/>
        <PhoneCase/>
      </div>
    </section>
  );
};

export default Playground;
