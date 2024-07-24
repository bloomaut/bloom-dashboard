import styles from "./styles.module.scss";
import { useCollectionsContext } from "@/context/CollectionsContext";
import { CollectionList } from "@/typescript/interfaces/hotlinkCollections.interface";

interface ContentProps {
  collection: CollectionList;
}

const TableRow = ({ collection }: ContentProps) => {
  const { id, setId } = useCollectionsContext();
  const formattDate = collection.created_at.slice(0, 10);

  const handleClick = () => {
    setId(collection._id);
  };

  return (
    <div className={`${styles.content} ${id === collection._id && styles.collection_selected}`} onClick={handleClick}>
      <div className={`${styles.column} ${styles.column_one}`}>
        <p>{collection.name}</p>
        <p>{formattDate}</p>
      </div>
      <div className={`${styles.column} ${styles.column_three}`}>
        <p>-</p> {/* TODO: volver a pedirle a backend el total de hotlinks de cada colección */}
      </div>
    </div>
  );
};

export default TableRow;
