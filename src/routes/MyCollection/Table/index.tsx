import styles from "./styles.module.scss";
import TableRow from "../TableRow";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useHotlinkListContext } from "@/context/HotlinksListContext";
import { useTranslations } from "next-intl";

const Table = () => {
  const dict = useTranslations("dict.my-collection");
  const { loading, hotlinkList } = useHotlinkListContext();

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
        {loading ? (
          <Loading />
        ) : hotlinkList.length < 1 ? (
          <p className={styles.empty_list}>{dict("empty_list")}</p>
        ) : (
          hotlinkList.map((hotlink, index) => <TableRow key={index} data={hotlink} />)
        )}
      </div>
    </div>
  );
};

export default Table;
