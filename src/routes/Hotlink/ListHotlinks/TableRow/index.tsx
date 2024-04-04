import styles from "./styles.module.scss";
import copyIcon from "/public/icons/copy.svg";
import wpIcon from "/public/icons/whatsapp.svg";
import Image from "next/image";

interface TableRowProps {
  data: {
    id: number;
    nameHotlink: string;
    name: string;
    link: string;
  };
}

const TableRow = ({ data }: TableRowProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <p>{data.nameHotlink}</p>
      </div>
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
