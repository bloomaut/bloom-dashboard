import styles from "./styles.module.scss";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useClientsContext } from "@/context/ClientsContext";
import Icon from "@/components/Icon";

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
          {client.clientCode} {client.ClientFirstname}
        </p>
        {client.ClientLastname && <p className={styles.first_name}>{client.ClientLastname}</p>}
        {client.ClientEmail && <p className={styles.email}>({client.ClientEmail})</p>}
      </div>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={onEdit}>
          <Icon name='edit' viewBox='0 0 25 20' />
        </button>
        <button className={styles.btn} onClick={onDelete}>
          <Icon name='trash' viewBox='0 0 25 25' />
        </button>
      </div>
    </div>
  );
};

export default Row;
