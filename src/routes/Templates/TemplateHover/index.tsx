import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";

const TemplateHover = () => {
  const dict = useTranslations("dict.templates");

  return (
    <div className={styles.hover}>
      <button className={styles.preview}>Preview</button>
      <button className={styles.select}>{dict("select")}</button>
    </div>
  );
};

export default TemplateHover;
