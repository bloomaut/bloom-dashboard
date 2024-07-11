import Header from "@/components/Header";
import styles from "./styles.module.scss";
import TemplatesSelector from "./TemplatesSelector";
import PhoneCase from "./PhoneCase";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

const Templates = () => {
  const dict = useTranslations("dict.templates");

  return (
    <section className={styles.templates_container}>
      <Header title={dict("title")} subtitle={dict("subtitle")} />
      <div className={styles.inner_container}>
        <div className={styles.templates}>
          <TemplatesSelector />
        </div>
        <div className={styles.phone_image}>
          <PhoneCase />
          <Button title='Next' isDisabled={true} />
        </div>
      </div>
    </section>
  );
};

export default Templates;
