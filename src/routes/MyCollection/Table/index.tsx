import styles from "./styles.module.scss";
import { useHotlinkListContext } from "@/context/HotlinksListContext";
import { useTranslations } from "next-intl";
// Components
import TableRow from "../TableRow";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { Fade } from "react-awesome-reveal";

const Table = () => {
  const dict = useTranslations("dict.my-collection");
  const { loading, hotlinkList } = useHotlinkListContext();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.column}>
          <p>{dict("client")}</p>
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
          <Fade cascade damping={0.3} triggerOnce>
            {hotlinkList.map((hotlink, index) => (
              <TableRow key={index} hotlink={hotlink} />
            ))}
          </Fade>
        )}
      </div>
    </div>
  );
};

export default Table;
