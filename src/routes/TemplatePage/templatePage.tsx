import Header from "@/components/Header";
import styles from "./styles.module.scss";
import TemplatesSelector from "./TemplatesSelector";
import Button from "@/components/Button";
import useStepValidation from "@/hooks/useStepValidation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useTemplateContext } from "@/context/TemplatesContext";
import PhoneCase from "@/components/PhoneCase";

const TemplatesPage = () => {
  const router = useRouter();
  const dict = useTranslations("dict.templates");
  const { step_04 } = useStepValidation();
  const { selectedTemplateId, previewId, previewLoading, setPreviewLoading } = useTemplateContext();

  const handleNavigation = () => {
    router.push("/catalog");
  };

  return (
    <section className={styles.templates_container}>
      <Header title={dict("title")} subtitle={dict("subtitle")} />
      <div className={styles.inner_container}>
        <TemplatesSelector />
        <div className={styles.column_container}>
          <div className={styles.phone_image}>
            <PhoneCase loading={previewLoading} previewId={previewId} setPreviewLoading={setPreviewLoading} />
          </div>
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
