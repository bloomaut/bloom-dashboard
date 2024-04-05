import { useParams } from "next/navigation";
import TableRow from "../TableRow";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useCollectionsContext } from "@/context/CollectionsContext";

const Table = () => {
  const dict = useTranslations("dict.my-collection");
  const { id } = useParams();
  const { collectionsList } = useCollectionsContext();

  const data = collectionsList.filter(collection => collection._id === id);

  console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.column}>
          <p>{dict("clients")}</p>
        </div>
        <div className={styles.column}>
          <p>Link</p>
        </div>
        <div className={styles.column}>
          <p>{dict("share")}</p>
        </div>
      </div>
      <div className={styles.rows_container}>
        {data.map(client => {
          return <TableRow key={client._id} data={client} />;
        })}
      </div>
    </div>
  );
};

export default Table;
