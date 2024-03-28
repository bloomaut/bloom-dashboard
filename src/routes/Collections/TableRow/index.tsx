import { useCollectionsContext } from "@/context/CollectionsContext";
import styles from "./styles.module.scss";

interface ContentProps {
  content: { id: string; name: string; date: string; name_skin: string; template: string; total: number; open: number };
}

const TableRow = ({ content }: ContentProps) => {
  const { id, setId } = useCollectionsContext();

  return (
    <div
      className={`${styles.content} ${id === content.id && styles.content_selected}`}
      onClick={() => setId(content.id)}
    >
      <div className={`${styles.column} ${styles.column_one}`}>
        <p>{content.name}</p>
        <p>{content.date}</p>
      </div>
      <div className={`${styles.column} ${styles.column_two}`}>
        <p>{content.name_skin}</p>
        <p>{content.template}</p>
      </div>
      <div className={`${styles.column} ${styles.column_three}`}>
        <p>{content.total}</p>
        <p>{content.open}</p>
      </div>
    </div>
  );
};

export default TableRow;
