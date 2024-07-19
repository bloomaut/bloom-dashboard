import Header from "@/components/Header";
import styles from "./styles.module.scss";
import TemplatesSelector from "./TemplatesSelector";
import PhoneCase from "./PhoneCase";
import Button from "@/components/Button";
import useStepValidation from "@/hooks/useStepValidation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useTemplateContext } from "@/context/TemplatesContext";

const TemplatesPage = () => {
  const { step_04 } = useStepValidation();
  const router = useRouter();
  const dict = useTranslations("dict.templates");
  const { selectedTemplateId } = useTemplateContext();

  const handleNavigation = () => {
    router.push("/catalog");
  };

  return (
    <section className={styles.templates_container}>
      <Header title={dict("title")} subtitle={dict("subtitle")} />
      <div className={styles.inner_container}>
        <TemplatesSelector />
        <div className={styles.phone_image}>
          <PhoneCase />
          {!step_04 && (
            <Button
              title={dict("next")}
              isDisabled={selectedTemplateId.length ? false : true}
              onclick={handleNavigation}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TemplatesPage;
