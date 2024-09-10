"use client";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import { useTranslations } from "next-intl";

const CreateDiffusion = () => {
  const dict = useTranslations("dict.designs.diffusion");

  return (
    <section className={styles.create_diffusion}>
      <Breadcrumb title={dict("back_design")} />
    </section>
  );
};

export default CreateDiffusion;
