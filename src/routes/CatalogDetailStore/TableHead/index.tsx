import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface Props {
  allProducts?: boolean;
}
const TableHead = ({ allProducts }: Props) => {
  const dict = useTranslations("dict.catalog");

  return (
    <div
      className={styles.container}
      style={{
        display: "grid",
        gridTemplateColumns: allProducts ? "0.2fr 1.5fr 1fr 2.5fr 0.5fr 1fr" : "0.2fr 1fr 2.5fr 0.5fr 1fr",
      }}
    >
      <h2 className={styles.name}></h2>
      <h2 className={styles.name}>{dict("name")}</h2>
      {allProducts && <h2 className={styles.name}>{dict("title")}</h2>}
      <h2 className={styles.price}>{dict("price")}</h2>
      <h2 className={styles.description}>Variants</h2>
    </div>
  );
};

export default TableHead;
