import { useCatalogContext } from "@/context/CatalogContext";
import Header from "./Header";
import styles from "./styles.module.scss";
import Card from "./Card";
import LoadingSpinner from "@/components/Loading";
import { useTranslations } from "next-intl";

const Catalog = () => {
  const { datasets, loading } = useCatalogContext();
  const dict = useTranslations("dict");

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {loading ? (
          <LoadingSpinner />
        ) : datasets.length ? (
          datasets.map(dataset => <Card key={dataset._id} {...dataset} />)
        ) : (
          <p>{dict("catalog.empty_datasets")}</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
