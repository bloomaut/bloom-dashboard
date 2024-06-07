import { useCatalogContext } from "@/context/CatalogContext";
import Header from "./Header";
import styles from "./styles.module.scss";
import Card from "./Card";
import LoadingSpinner from "@/components/Loading";

const Catalog = () => {
  const { datasets, loading } = useCatalogContext();

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {loading ? <LoadingSpinner /> : datasets.map(dataset => <Card key={dataset._id} {...dataset} />)}
      </div>
    </div>
  );
};

export default Catalog;
