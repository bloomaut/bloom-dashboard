import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import copyIcon from "/public/icons/copy.svg";
import wpIcon from "/public/icons/whatsapp.svg";
import Image from "next/image";

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
        <Image src={copyIcon} width={30} height={30} alt='icon' />
        <Image src={wpIcon} width={30} height={30} alt='icon' />
      </div>
    </div>
  );
};

export default TableRow;
