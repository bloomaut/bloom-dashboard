import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface TableRowProps {
  data: {
    name: string;
    link: string;
  };
}

const TableRow = ({ data }: TableRowProps) => {
  const dict = useTranslations("dict.my-collection");

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <p>{data.name}</p>
      </div>
      <div className={styles.column}>
        <p>{data.link}</p>
      </div>
      <div className={styles.column}>
        <p></p>
      </div>
    </div>
  );
};

export default TableRow;
