import styles from "./styles.module.scss";
import { useCollectionsContext } from "@/context/CollectionsContext";
import { CollectionList } from "@/typescript/interfaces/hotlinkCollections.interface";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ContentProps {
  collection: CollectionList;
}

const TableRow = ({ collection }: ContentProps) => {
  const dict = useTranslations("dict.collections");
  const { id, setId } = useCollectionsContext();
  const [selected, setSelected] = useState(false);

  const formattDate = collection.created_at.slice(0, 10);

  console.log(collection);

  const handleClick = () => {
    setId(collection._id);
    setSelected(true);
  };

  return (
    <div className={`${styles.content} ${id === collection._id && styles.collection_selected}`} onClick={handleClick}>
      <div className={`${styles.column} ${styles.column_one}`}>
        <p>{collection.name}</p>
        <p>{formattDate}</p>
      </div>
      <div className={`${styles.column} ${styles.column_two}`}>
        <p>{collection.description}</p>
        <p>{`${collection.flake?.skinx?.title || dict("template")}/${collection.flake?.title || dict("template")}`}</p>
      </div>
      <div className={`${styles.column} ${styles.column_three}`}>
        <p>{collection.hotlinkCount}</p>
        <p>-</p>
      </div>
    </div>
  );
};

export default TableRow;
