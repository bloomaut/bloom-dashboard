"use client";
import Breadcrumb from "@/components/Breadcrumb";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

const Business = () => {
  const dict = useTranslations("dict.business");

  const submitForm = (formData: any) => {
    console.log(formData);
  };
  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb_container}>
        <Breadcrumb title={dict("breadcrumb_title")} route={"playground"} />
      </div>
      <div className={styles.inner_container}>
        <Form submitForm={submitForm} />
        <Files />
        <Sequence />
      </div>
    </section>
  );
};

export default Business;
