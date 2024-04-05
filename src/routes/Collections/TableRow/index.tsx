import { useCollectionsContext } from "@/context/CollectionsContext";
import styles from "./styles.module.scss";

interface ContentProps {
  collection: CollectionList;
}

const TableRow = ({ collection }: ContentProps) => {
  const { id, setId } = useCollectionsContext();

  const formattDate = collection.created_at.slice(0, 10);

  return (
    <div
      className={`${styles.content} ${id === collection._id && styles.collection_selected}`}
      onClick={() => setId(collection._id)}
    >
      <div className={`${styles.column} ${styles.column_one}`}>
        <p>{collection.name}</p>
        <p>{formattDate}</p>
      </div>
      <div className={`${styles.column} ${styles.column_two}`}>
        <p>{collection.description}</p>
        <p>{`${collection.flake.skinx.title}/${collection.flake.title}`}</p>
      </div>
      <div className={`${styles.column} ${styles.column_three}`}>
        <p>{collection.hotlinkCount}</p>
        <p>-</p>
      </div>
    </div>
  );
};

export default TableRow;
