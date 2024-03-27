import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface DetailProps {
  client: ClientsProps;
}

const Detail = ({ client }: DetailProps) => {
  const dict = useTranslations("dict.clients");

  return (
    <section className={styles.container}>
      <p className={styles.detail_names}>
        {client.ClientFirstname} {client.ClientLastname}
      </p>
      <div className={styles.info}>
        <p className={styles.label}>
          {dict("form_label_03")}: <span>{client.ClientEmail}</span>
        </p>
        <p className={styles.label}>
          {dict("form_label_04")}: <span>{client.ClientLocation}</span>
        </p>
        <p className={styles.label}>
          {dict("form_label_05")}: <span>{client.ClientPhone}</span>
        </p>
        {client.note && (
          <p className={styles.label}>
            {dict("form_label_06")}: <span>{client.note}</span>
          </p>
        )}
      </div>
    </section>
  );
};

export default Detail;
