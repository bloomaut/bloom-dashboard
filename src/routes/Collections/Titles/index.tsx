import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

const Titles = () => {
  const dict = useTranslations("dict.collections.titles");
  return (
    <div>
      <div className={styles.title}>
        <h2>{dict("title_one")}</h2>
        <h2 className={styles.border}>{dict("title_two")}</h2>
        <h2 className={styles.border}>{dict("title_three")}</h2>
      </div>
      <div className={styles.subtitle}>
        <div className={`${styles.column} ${styles.column_one}`}>
          <p></p>
          <p>{dict("column_one")}</p>
        </div>
        <div className={`${styles.column} ${styles.column_two}`}>
          <p>{dict("column_two")}</p>
          <p>{dict("column_three")}</p>
        </div>
        <div className={`${styles.column} ${styles.column_three}`}>
          <p>{dict("column_four")}</p>
          <p>{dict("column_five")}</p>
        </div>
      </div>
    </div>
  );
};

export default Titles;
