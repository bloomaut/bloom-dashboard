import { useCatalogContext } from "@/context/CatalogContext";
import Header from "./Header";
import styles from "./styles.module.scss";
import Card from "./Card";

const Catalog = () => {
  const { datasets } = useCatalogContext();

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {datasets.map(dataset => (
          <Card key={dataset._id} {...dataset} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
