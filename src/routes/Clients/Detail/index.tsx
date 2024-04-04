import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useClientsContext } from "@/context/ClientsContext";

const Detail = () => {
  const { clientSelected } = useClientsContext();
  const dict = useTranslations("dict.clients");

  return (
    <section className={styles.container}>
      <p className={styles.detail_names}>
        {clientSelected?.ClientFirstname} {clientSelected?.ClientLastname && clientSelected.ClientLastname}
      </p>
      <div className={styles.info}>
        {clientSelected?.ClientEmail && (
          <p className={styles.label}>
            {dict("form_label_03")}: <span>{clientSelected?.ClientEmail}</span>
          </p>
        )}
        {clientSelected?.ClientLocation && (
          <p className={styles.label}>
            {dict("form_label_04")}: <span>{clientSelected?.ClientLocation}</span>
          </p>
        )}
        {clientSelected?.ClientPhone && (
          <p className={styles.label}>
            {dict("form_label_05")}: <span>{clientSelected?.ClientPhone}</span>
          </p>
        )}
        {clientSelected?.personalNote && (
          <p className={styles.label}>
            {dict("form_label_06")}: <span>{clientSelected?.personalNote}</span>
          </p>
        )}
      </div>
    </section>
  );
};

export default Detail;
