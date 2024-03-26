import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import styles from "./styles.module.scss";

interface DetailProps {
  client: ClientsProps;
}

const Detail = ({ client }: DetailProps) => {
  return (
    <section className={styles.container}>
      <p className={styles.detail_names}>
        {client.ClientFirstname} {client.ClientLastname}
      </p>
      <div className={styles.info}>
        <p className={styles.label}>
          Email: <span>{client.ClientEmail}</span>
        </p>
        <p className={styles.label}>
          Ubicación: <span>{client.ClientLocation}</span>
        </p>
        <p className={styles.label}>
          Teléfono: <span>{client.ClientPhone}</span>
        </p>
        {client.note && (
          <p className={styles.label}>
            Nota: <span>{client.note}</span>
          </p>
        )}
      </div>
    </section>
  );
};

export default Detail;
