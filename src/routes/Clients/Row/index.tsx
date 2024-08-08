import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
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
        <p className={styles.last_name}>
          {client.clientCode} {client.clientFirstname}
        </p>
        {client.clientLastname && <p className={styles.first_name}>{client.clientLastname}</p>}
        {client.clientEmail && <p className={styles.email}>({client.clientEmail})</p>}
      </div>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={onEdit}>
          <Icon name='edit' width={25} height={25} strokeColor='#7f7f7f' viewBox='0 0 25 18' />
        </button>
        <button className={styles.btn} onClick={onDelete}>
          <Icon name='delete' width={25} height={25} strokeColor='#7f7f7f' viewBox='0 0 25 23' />
        </button>
      </div>
    </div>
  );
};

export default Row;
