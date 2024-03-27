import styles from "./styles.module.scss";
import Image from "next/image";
import iconEdit from "../../../../public/icons/edit.svg";
import iconDelete from "../../../../public/icons/delete.svg";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useClientsContext } from "@/context/ClientsContext";

interface RowProps {
  client: ClientsProps;
  onDelete: () => void;
  onEdit: () => void;
}

const Row = ({ client, onDelete, onEdit }: RowProps) => {
  const { setClientSelected } = useClientsContext();

  return (
    <div className={styles.row}>
      <div className={styles.names} onClick={() => setClientSelected(client)}>
        <p className={styles.last_name}>{client.ClientFirstname}</p>
        <p className={styles.first_name}>{client.ClientLastname}</p>
        <p className={styles.email}>({client.ClientEmail})</p>
      </div>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={onEdit}>
          <Image src={iconEdit} className={styles.icon} alt='Icon Edit' />
        </button>
        <button className={styles.btn} onClick={onDelete}>
          <Image src={iconDelete} className={styles.icon} alt='Icon Delete' />
        </button>
      </div>
    </div>
  );
};

export default Row;
