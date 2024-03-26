import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

const Titles = () => {
  const dict = useTranslations("dict.collections");
  return (
    <div>
      <div className={styles.title}>
        <h2>Nombre</h2>
        <h2 className={styles.border}>Diseño utilizado</h2>
        <h2 className={styles.border}>Receptor</h2>
      </div>
      <div className={styles.subtitle}>
        <div className={styles.subtitle_one}>
          <p>Fecha</p>
        </div>
        <div className={styles.subtitle_two}>
          <p>Nombre del Skin</p>
          <p>Plantilla</p>
        </div>
        <div className={styles.subtitle_three}>
          <p>Total</p>
          <p>Abiertos</p>
        </div>
      </div>
    </div>
  );
};

export default Titles;
