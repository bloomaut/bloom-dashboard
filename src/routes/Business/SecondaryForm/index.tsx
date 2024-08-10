import styles from "./styles.module.scss";
import useStepValidation from "@/hooks/useStepValidation";
import { useBusinessContext } from "@/context/BusinessContext";
import { useTranslations } from "next-intl";
// Components
import DragAndDrop from "@/components/DragAndDrop";
import AddInfoForm from "./AddInfoForm";
import Palette from "./Palette";
import Button from "@/components/Button";

const SecondaryForm = () => {
  const { logo, setLogo, errorLogo, banner, setBanner, loading, handleSubmit } = useBusinessContext();
  const { step_04 } = useStepValidation();

  const dict = useTranslations("dict.form_validation");

  return (
    <div className={styles.secondary_form}>
      <div className={styles.drag_container}>
        <div className={styles.logo}>
          <h6>Logo</h6>
          <DragAndDrop file={logo} setFile={setLogo} img='Logo' />
          {errorLogo && <span className={styles.error}>{dict("logo_required")}</span>}
        </div>
        <div className={styles.banner}>
          <h6>Banner</h6>
          <DragAndDrop file={banner} setFile={setBanner} img='Banner' />
        </div>
      </div>
      <section className={styles.second_row}>
        <Palette />
        <AddInfoForm />
      </section>
      <div className={styles.button}>
        <Button title={step_04 ? "Update" : "Update and Next"} loading={loading} type='button' onclick={handleSubmit} />
      </div>
    </div>
  );
};

export default SecondaryForm;
