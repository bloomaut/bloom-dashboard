import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import DragDrop from "./DragDrop";
import AddInfoForm from "./AddInfoForm";
import { useTranslations } from "next-intl";

const SecondaryForm = () => {
  const dict = useTranslations("dict.business");

  // eslint-disable-next-line no-empty-function
  const handleChange = () => {};

  return (
    <div className={styles.secondary_form}>
      <DragDrop />
      <section className={styles.color_info}>
        <div className={styles.colors}>
          <h6>{dict("data.colors")}</h6>
          <div className={styles.container_circle}>
            <article className={styles.circle}></article>
            <article className={styles.circle}></article>
            <article className={styles.circle}>
              <Icon name='add' viewBox='0 0 20 22' width={35} height={35} strokeWidth={1} />
            </article>
          </div>
          <p className={styles.description}>{dict("data.description")}</p>
        </div>
        <AddInfoForm />
      </section>
    </div>
  );
};

export default SecondaryForm;
