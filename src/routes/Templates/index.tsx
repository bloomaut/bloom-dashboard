import Header from "@/components/Header";
import styles from "./styles.module.scss";
import TemplatesSelector from "./TemplatesSelector";
import PhoneCase from "./PhoneCase";
import Button from "@/components/Button";
import useStepValidation from "@/hooks/useStepValidation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { TemplateProvider } from "@/context/TemplatesContext";

const Templates = () => {
  const { step_02, step_04 } = useStepValidation();
  const router = useRouter();
  const dict = useTranslations("dict.templates");

  const handleNavigation = () => {
    router.push("/catalog");
  };

  return (
    <TemplateProvider>
      <section className={styles.templates_container}>
        <Header title={dict("title")} subtitle={dict("subtitle")} />
        <div className={styles.inner_container}>
          <TemplatesSelector />
          <div className={styles.phone_image}>
            <PhoneCase />
            {!step_04 && <Button title='Next' isDisabled={!step_02} onclick={handleNavigation} />}
          </div>
        </div>
      </section>
    </TemplateProvider>
  );
};

export default Templates;
