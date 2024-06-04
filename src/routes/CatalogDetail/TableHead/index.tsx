import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

const TableHead = () => {
  const dict = useTranslations("dict.catalog");

  return (
    <div className={styles.container}>
      <h2 className={styles.image}></h2>
      <h2 className={styles.name}>{dict("name")}</h2>
      <h2 className={styles.description}>{dict("description")}</h2>
      <h2 className={styles.price}>{dict("price")}</h2>
    </div>
  );
};

export default TableHead;
