import styles from "./styles.module.scss";
import Image from "next/image";
import iconEdit from "../../../../public/icons/edit.svg";
import iconDelete from "../../../../public/icons/delete.svg";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";

const Row = (client: ClientsProps) => {
  const handleClick = () => {
    console.log(client._id);
  };

  return (
    <div className={styles.row} onClick={handleClick}>
      <div className={styles.names}>
        <p className={styles.first_name}>{client.ClientLastname}</p>
        <p className={styles.last_name}>{client.ClientFirstname}</p>
        <p className={styles.email}>({client.ClientEmail})</p>
      </div>
      <div className={styles.controls}>
        <button className={styles.btn}>
          <Image src={iconEdit} className={styles.icon} alt='Icon Edit' />
        </button>
        <button className={styles.btn}>
          <Image src={iconDelete} className={styles.icon} alt='Icon Delete' />
        </button>
      </div>
    </div>
  );
};

export default Row;
