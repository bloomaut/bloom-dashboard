import styles from "./styles.module.scss";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";
import Header from "@/components/Header";
import { useTranslations } from "next-intl";

const Business = () => {
  const dict = useTranslations("dict.business.form");

  return (
    <section className={styles.container_business}>
      <Header title={dict("title")} subtitle={dict("subtitle")} />
      <div className={styles.container_columns}>
        <MainForm />
        <SecondaryForm />
      </div>
    </section>
  );
};

export default Business;
