import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface Props {
  allServices?: boolean;
}

const TableHead = ({ allServices }: Props) => {
  const dict = useTranslations("dict.catalog");

  return (
    <div
      className={styles.container}
      style={{
        display: "grid",
        gridTemplateColumns: allServices
          ? "0.10fr 0.79fr 0.51fr 1.30fr 0.30fr 1.20fr"
          : "0.2fr 1fr 2fr 0.5fr 0.64fr 0.7fr",
      }}
    >
      <h2 className={styles.name}></h2>
      <h2 className={styles.name}>{dict("name")}</h2>
      {allServices && <h2 className={styles.name}>{dict("title")}</h2>}
      <h2 className={styles.description}>{dict("description")}</h2>
      <h2 className={styles.price}>{dict("price")}</h2>
      <h2 className={styles.price}>{dict("available_days")}</h2>
    </div>
  );
};

export default TableHead;
