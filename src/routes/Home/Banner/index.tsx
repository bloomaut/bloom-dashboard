"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Title from "@/components/Title";

const Banner = () => {
  const dict = useTranslations("dict");

  return (
    <div className={styles.container}>
      <Title text={dict("home.welcome")} />
    </div>
  );
};

export default Banner;
