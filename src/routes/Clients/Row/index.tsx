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
  const { setClientSelected, clientSelected } = useClientsContext();

  return (
    <div className={`${styles.row} ${clientSelected?._id === client._id && styles.select}`}>
      <div className={styles.names} onClick={() => setClientSelected(client)}>
        <p className={styles.last_name}>
          {client.ClientCode} {client.ClientFirstname}
        </p>
        {client.ClientLastname && <p className={styles.first_name}>{client.ClientLastname}</p>}
        {client.ClientEmail && <p className={styles.email}>({client.ClientEmail})</p>}
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
